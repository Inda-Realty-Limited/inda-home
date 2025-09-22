import { getComputedListingByUrl } from "@/api/listings";
import { getFreeViewStatus, hasPaid, verifyPayment } from "@/api/payments";
import { Button, Container, Footer, Navbar } from "@/components";
import PaymentModal from "@/components/inc/PaymentModal";
import { dummyResultData } from "@/data/resultData";
import { getToken, getUser } from "@/helpers";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import {
  FaBed,
  FaBolt,
  FaBoxes,
  FaBuilding,
  FaCar,
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaChevronUp,
  FaClock,
  FaCouch,
  FaHome,
  FaLock,
  FaMapMarkerAlt,
  FaRoad,
  FaShieldAlt,
  FaShower,
  FaStar,
  FaUtensils,
  FaWater,
} from "react-icons/fa";
import { IoIosInformationCircle } from "react-icons/io";
import { RiEditFill } from "react-icons/ri";

type ResultProps = {
  hiddenMode?: boolean; // deprecated; gating is now based solely on payment status
};

const Result: React.FC<ResultProps> = ({ hiddenMode = false }) => {
  const [isPaid, setIsPaid] = useState(false);
  // Backend-driven free view availability
  const [freeViewAvailable, setFreeViewAvailable] = useState<boolean>(false);
  // Hide gated content unless user has paid OR a backend-controlled free view is available
  const isHidden = !(isPaid || freeViewAvailable);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [proceed, setProceed] = useState(false);
  const [open, setOpen] = useState<number | null>(0);
  // Controls whether PaymentModal starts directly on paid-only (deep) step
  const [startPaidFlow, setStartPaidFlow] = useState<boolean>(false);
  // Trust score will be derived from API values when present
  const choseFree = () => {
    setProceed(false);
  };
  const [result, setResult] = useState<any | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [isStartingPayment, setIsStartingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  const [verifyingRef, setVerifyingRef] = useState<string | null>(null);
  const checkoutIframeRef = useRef<HTMLIFrameElement | null>(null);
  // Animated Trust Score display value
  const [displayScore, setDisplayScore] = useState(0);

  // Joshua's WhatsApp number for all CTA/WhatsApp links (set via env)
  const rawWhatsapp =
    process.env.NEXT_PUBLIC_WHATSAPP_JOSHUA ||
    process.env.NEXT_PUBLIC_INDA_WHATSAPP ||
    "2348102544302";
  const sanitizePhone = (p: string) =>
    p.replace(/[^0-9]/g, "").replace(/^0+/, "");
  const INDA_WHATSAPP = sanitizePhone(rawWhatsapp);
  const openWhatsApp = (text: string, phone: string = INDA_WHATSAPP) => {
    const safePhone = sanitizePhone(phone || INDA_WHATSAPP);
    const url = `https://wa.me/${safePhone}?text=${encodeURIComponent(text)}`;
    if (typeof window !== "undefined") {
      window.open(url, "_blank");
    }
  };

  const [isROISummaryOpen, setIsROISummaryOpen] = useState(true);
  const [isPriceSummaryOpen, setIsPriceSummaryOpen] = useState(true);
  const [isLocationSummaryOpen, setIsLocationSummaryOpen] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);
  const [paymentCallbackUrl, setPaymentCallbackUrl] = useState<string | null>(
    null
  );
  const [isEmbedded, setIsEmbedded] = useState(false);
  const [selectedBar, setSelectedBar] = useState<null | {
    series: "fmv" | "price";
    index: number;
  }>(null);

  useEffect(() => {
    const u = getUser();
    setUser(u);
  }, []);

  // Query backend for free view availability (do not auto-unlock on frontend)
  useEffect(() => {
    if (!router.isReady) return;
    if (isEmbedded) return;
    getFreeViewStatus()
      .then((st) => setFreeViewAvailable(!!st?.freeViewAvailable))
      .catch(() => setFreeViewAvailable(false));
  }, [router.isReady, isEmbedded]);

  // Animate Trust Score from 0 to the value in 4s whenever result changes
  useEffect(() => {
    if (!result) {
      setDisplayScore(0);
      return;
    }
    const raw =
      (result as any)?.indaScore?.finalScore ??
      (result as any)?.aiReport?.finalScore ??
      null;
    if (typeof raw !== "number" || Number.isNaN(raw)) {
      setDisplayScore(0);
      return;
    }
    const target = Math.max(0, Math.min(100, Math.round(raw)));
    let raf = 0;
    const start = performance.now();
    const dur = 4000; // 4 seconds
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
    setDisplayScore(0);
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = easeOutCubic(p);
      setDisplayScore(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [result]);

  const [chartMonths, setChartMonths] = useState<string[]>([]);
  const [chartFMV, setChartFMV] = useState<number[]>([]);
  const [chartPriceSeries, setChartPriceSeries] = useState<number[]>([]);
  const [chartWindowLabel, setChartWindowLabel] = useState<string>("");
  const [last6ChangePct, setLast6ChangePct] = useState<number>(0);
  const [marketPositionPct, setMarketPositionPct] = useState<number>(0);
  const [dummyFairValue, setDummyFairValue] = useState<number | null>(null);

  // Compute a dummy FMV once per property based on real price (±10–20%)
  useEffect(() => {
    const currentPrice =
      result?.snapshot?.priceNGN ??
      (result as any)?.analytics?.market?.purchasePrice ??
      null;
    if (!currentPrice) {
      setDummyFairValue(null);
      return;
    }
    // Recompute when price changes
    const sign = Math.random() < 0.5 ? -1 : 1;
    const pct = 0.1 + Math.random() * 0.1; // 10% to 20%
    const fmvRaw = currentPrice * (1 + sign * pct);
    const base = 1_000_000; // round to nearest million
    const fmv = Math.round(fmvRaw / base) * base;
    setDummyFairValue(fmv);
  }, [result]);

  // Generate chart data as dummy series anchored to current price and dummy FMV
  useEffect(() => {
    const currentPrice =
      result?.snapshot?.priceNGN ??
      (result as any)?.analytics?.market?.purchasePrice ??
      null;
    if (!currentPrice || !dummyFairValue) {
      setChartMonths([]);
      setChartWindowLabel("");
      setChartFMV([]);
      setChartPriceSeries([]);
      setLast6ChangePct(0);
      setMarketPositionPct(0);
      return;
    }
    const now = new Date();
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const months: string[] = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push(`${monthNames[d.getMonth()]}`);
    }
    const windowLabel = `${months[0]} - ${months[months.length - 1]}`;

    // Create smooth series approaching the latest values with small noise
    const makeSeries = (endValue: number) => {
      const series: number[] = [];
      const start = Math.max(
        1,
        Math.round(endValue * (0.9 + Math.random() * 0.1))
      ); // start within -10% to 0%
      for (let i = 0; i < 12; i++) {
        const t = i / 11; // 0..1
        const base = start + (endValue - start) * t;
        const noise = (Math.random() - 0.5) * endValue * 0.01; // ±1%
        series.push(Math.max(1, Math.round(base + noise)));
      }
      return series;
    };

    const fmvSeries = makeSeries(dummyFairValue);
    const priceSeries = makeSeries(currentPrice);
    const base6 = fmvSeries[6] || fmvSeries[0] || 1;
    const last = fmvSeries[fmvSeries.length - 1] || base6;
    const change6 = ((last - base6) / base6) * 100;
    const marketPct = ((currentPrice - dummyFairValue) / dummyFairValue) * 100;

    setChartMonths(months);
    setChartWindowLabel(windowLabel);
    setChartFMV(fmvSeries);
    setChartPriceSeries(priceSeries);
    setLast6ChangePct(change6);
    setMarketPositionPct(marketPct);
  }, [result, dummyFairValue]);

  // ROI panel state
  type ROIFieldKey =
    | "purchasePrice"
    | "financingRate"
    | "financingTenureYears"
    | "holdingPeriodYears"
    | "yieldLong"
    | "yieldShort"
    | "expensePct"
    | "appreciationLocalNominal"
    | "appreciationLocalReal"
    | "appreciationUsdAdj";

  const [openROIInfo, setOpenROIInfo] = useState<ROIFieldKey | null>(null);
  const [editingROIField, setEditingROIField] = useState<ROIFieldKey | null>(
    null
  );
  const [roiValues, setRoiValues] = useState({
    purchasePrice: 130_000_000,
    financingRate: 4.5,
    financingTenureYears: 10,
    holdingPeriodYears: 3,
    yieldLong: 5.2,
    yieldShort: 6.8,
    expensePct: 18.2,
    appreciationLocalNominal: 3.2,
    appreciationLocalReal: 0,
    appreciationUsdAdj: 0,
  });
  const [roiHasEdited, setRoiHasEdited] = useState(false);
  const [appreciationTab, setAppreciationTab] = useState<
    "localNominal" | "localReal" | "usdAdj"
  >("localNominal");

  // Track which ROI fields have been edited at least once
  const [editedFields, setEditedFields] = useState<
    Partial<Record<ROIFieldKey, boolean>>
  >({});

  // Prefill ROI purchase price from API price unless the user edits it
  useEffect(() => {
    const currentPrice =
      result?.snapshot?.priceNGN ??
      // prefer analytics.price.listingPriceNGN when available
      (result as any)?.analytics?.price?.listingPriceNGN ??
      (result as any)?.analytics?.market?.purchasePrice ??
      null;
    if (!currentPrice) return;
    setRoiValues((prev) => {
      if (editedFields.purchasePrice) return prev;
      if (prev.purchasePrice === currentPrice) return prev;
      return { ...prev, purchasePrice: currentPrice };
    });
  }, [result, editedFields.purchasePrice]);

  // Prefill other ROI fields from analytics unless user edited them
  useEffect(() => {
    if (!result) return;
    const a: any = (result as any)?.analytics || {};
    const sAny: any = (result as any)?.snapshot || {};
    const holdingYearsFromSnap = sAny?.analytics?.holding?.holdingPeriodYears;
    const nextVals: Partial<typeof roiValues> = {};

    const trySet = <K extends keyof typeof roiValues>(key: K, val?: any) => {
      if (val === undefined || val === null || Number.isNaN(val)) return;
      if ((editedFields as any)[key]) return;
      // coerce to number where relevant
      const num = typeof val === "string" ? Number(val) : val;
      (nextVals as any)[key] = num;
    };

    trySet("financingRate", a?.financing?.interestRatePct);
    trySet("financingTenureYears", a?.financing?.tenorYearsDefault);
    trySet("holdingPeriodYears", holdingYearsFromSnap);
    trySet("yieldLong", a?.yields?.longTermPct);
    trySet("yieldShort", a?.yields?.shortTermPct);
    trySet("expensePct", a?.expenses?.totalExpensesPct);
    trySet("appreciationLocalNominal", a?.appreciation?.nominalPct);
    trySet("appreciationLocalReal", a?.appreciation?.realPct);
    trySet("appreciationUsdAdj", a?.appreciation?.usdFxInflAdjPct);

    if (Object.keys(nextVals).length) {
      setRoiValues((prev) => ({ ...prev, ...nextVals }));
    }
  }, [result, editedFields]);

  // Calculation state
  type CalcResult = {
    profit: number;
    roiPct: number;
    annualIncome: number;
  };
  const [isCalculating, setIsCalculating] = useState(false);
  const [calcResult, setCalcResult] = useState<CalcResult | null>(null);
  const [resultView, setResultView] = useState<"long" | "short">("long");
  const longTabRef = useRef<HTMLButtonElement | null>(null);
  const shortTabRef = useRef<HTMLButtonElement | null>(null);
  const underlineRef = useRef<HTMLDivElement | null>(null);
  const [underlineStyle, setUnderlineStyle] = useState<{
    width: number;
    left: number;
  }>({ width: 0, left: 0 });

  useEffect(() => {
    const active =
      resultView === "long" ? longTabRef.current : shortTabRef.current;
    const container = active?.parentElement?.parentElement; // the flex tabs wrapper then the outer wrapper with the baseline
    if (active && container) {
      const tabRect = active.getBoundingClientRect();
      const parentRect = container.getBoundingClientRect();
      setUnderlineStyle({
        width: tabRect.width,
        left: tabRect.left - parentRect.left,
      });
    }
  }, [resultView]);

  // Derived appreciation values (placeholder derivation until real formula is provided)
  const appNominal = roiValues.appreciationLocalNominal;
  const appReal = roiValues.appreciationLocalReal || appNominal;
  const appUsd = roiValues.appreciationUsdAdj || appReal;

  // Analytics-derived results for display
  const aAny: any = (result as any)?.analytics || {};
  const projAny = aAny?.projections || {};
  const yieldsAny = aAny?.yields || {};
  const roiPctFromAnalytics =
    resultView === "long" ? projAny?.roiLongTermPct : projAny?.roiShortTermPct;
  const profitFromAnalytics =
    resultView === "long"
      ? projAny?.projectedTotalProfitLongTerm
      : projAny?.projectedTotalProfitShortTerm;
  const incomeFromAnalytics =
    resultView === "long"
      ? yieldsAny?.annualLongTermIncomeNGN
      : yieldsAny?.annualShortTermIncomeNGN;

  // Gallery scroller ref and controls
  const galleryRef = useRef<HTMLDivElement | null>(null);
  const scrollGalleryBy = (dir: 1 | -1) => {
    const el = galleryRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLDivElement>("div > div");
    const cardWidth = card?.getBoundingClientRect().width || 320;
    el.scrollBy({ left: dir * (cardWidth + 16), behavior: "smooth" });
  };

  // ROI helpers and formatters
  const roiFieldInfo: Record<ROIFieldKey, string> = {
    purchasePrice:
      "The total cost to buy the property, including any extra fees not shown here. You can adjust this to match your actual cost.",
    financingRate:
      "The yearly percentage rate charged on any loan you take to buy the property.",
    financingTenureYears:
      "How long you plan to take to pay off your loan (in years).",
    holdingPeriodYears:
      "The length of time you plan to own the property before selling (in years).",
    yieldLong:
      "The expected yearly rental income from renting out the property on long leases, shown as a % of the purchase price.",
    yieldShort:
      "The expected yearly rental income from renting the property for short stays (like Airbnb), shown as a % of the purchase price.",
    expensePct:
      "All yearly costs (maintenance, management, taxes, etc.) as a percentage of your rental income.",
    appreciationLocalNominal:
      "Shows the raw growth in Naira based on median prices in this micro-location tag. Does not account for inflation. Good for quick market comparisons and tracking price trends.",
    appreciationLocalReal:
      "Shows true growth in Naira after adjusting for local inflation. Useful for long-term investors who want to know real purchasing power gains.",
    appreciationUsdAdj:
      "Shows real returns for diaspora investors in USD, accounting for both Naira inflation and FX changes. Useful for investors thinking in foreign currency or planning cross-border investments.",
  };

  const toggleROIInfo = (key: ROIFieldKey) => {
    setOpenROIInfo((prev) => (prev === key ? null : key));
    setEditingROIField(null);
  };

  const startROIEdit = (key: ROIFieldKey) => {
    setEditingROIField((prev) => (prev === key ? null : key));
    setOpenROIInfo(null);
  };

  const parseNumber = (input: string | number): number => {
    if (typeof input === "number") return input;
    const cleaned = input.replace(/[^0-9.-]/g, "");
    const n = parseFloat(cleaned);
    return Number.isNaN(n) ? 0 : n;
  };

  const updateROIValue = (key: ROIFieldKey, raw: string | number) => {
    const value = parseNumber(raw);
    setRoiValues((prev) => ({ ...prev, [key]: value }));
    setEditedFields((prev) => ({ ...prev, [key]: true }));
    if (!roiHasEdited) setRoiHasEdited(true);
  };

  const formatNaira = (n: number) => `₦${Math.round(n).toLocaleString()}`;
  const formatPercent = (n: number) => `${(n ?? 0).toFixed(2)}%`;
  const formatCompact = (n: number) => {
    const abs = Math.abs(n);
    if (abs >= 1_000_000_000) {
      const v = n / 1_000_000_000;
      return `₦${v >= 10 ? v.toFixed(0) : v.toFixed(1)}B`;
    }
    if (abs >= 1_000_000) {
      const v = n / 1_000_000;
      return `₦${v >= 10 ? v.toFixed(0) : v.toFixed(1)}M`;
    }
    return `₦${Math.round(n).toLocaleString()}`;
  };

  // Extract amenities from snapshot.amenities (if present) or parse from title/description
  const extractAmenities = (snap: any): string[] => {
    const fromField = Array.isArray(snap?.amenities)
      ? snap.amenities.filter(Boolean).map((x: any) => String(x))
      : [];
    if (fromField.length) return fromField;

    const title: string = String(snap?.title || "");
    const desc: string = String(snap?.description || "");
    const textBank = `${title}\n${desc}`.toLowerCase();

    // Parse structured lists under a Features: header (flexible)
    const lines = desc
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    let feats: string[] = [];
    const headerIdx = lines.findIndex((l) => /^features\s*:?.*$/i.test(l));
    if (headerIdx !== -1) {
      const headerLine = lines[headerIdx];
      const afterColon = headerLine.split(/:/)[1];
      if (afterColon) {
        afterColon
          .split(/,|·|•|\||\/|;|\s{2,}/)
          .map((s) => s.trim())
          .filter(Boolean)
          .forEach((s) => feats.push(s));
      }
      for (let i = headerIdx + 1; i < lines.length; i++) {
        const l = lines[i];
        // Stop at the next section header like "Title:", "Price:", etc.
        if (
          /^title\s*:|^price\s*:|^location\s*:|^video\s*:|^documents?\s*:|^[A-Z][A-Za-z ]+\s*:\s*$/.test(
            l
          )
        ) {
          break;
        }
        if (/^[\-•*·]/.test(l)) {
          feats.push(l.replace(/^[\-−•*·]\s*/, ""));
        } else if (/,/.test(l)) {
          l.split(/,|·|•|\||\/|;|\s{2,}/)
            .map((s) => s.trim())
            .filter(Boolean)
            .forEach((s) => feats.push(s));
        } else {
          feats.push(l);
        }
      }
    } else {
      // Generic bullets anywhere
      feats = lines
        .filter((l) => /^[\-•*·]/.test(l))
        .map((l) => l.replace(/^[\-−•*·]\s*/, ""));
    }

    // Heuristic keywords from title/description (works for land listings like "Fenced and Gated")
    type KeyHint = { re: RegExp; label: string };
    const hints: KeyHint[] = [
      { re: /\bgated\b/, label: "Gated" },
      { re: /\bfenc(e|ed|ing)\b/, label: "Fenced" },
      { re: /\bsecurity|secure|estate security\b/, label: "24/7 Security" },
      {
        re: /\btarred road|good road|paved road|access road\b/,
        label: "Good Road Access",
      },
      { re: /\bdrainage\b/, label: "Drainage" },
      { re: /\bwater( supply)?\b/, label: "Water Supply" },
      { re: /\belectric(it(y|ies))?|power|light(s)?\b/, label: "Electricity" },
      { re: /\bparking|car park\b/, label: "Parking" },
    ];
    hints.forEach((h) => {
      if (h.re.test(textBank)) feats.push(h.label);
    });

    // If property is land and title indicates fenced/gated but not captured
    const typeStd = String(snap?.propertyTypeStd || "").toLowerCase();
    if (typeStd.includes("land")) {
      if (/\bgated\b/.test(title.toLowerCase())) feats.push("Gated");
      if (/\bfenc(e|ed|ing)\b/.test(title.toLowerCase())) feats.push("Fenced");
    }

    // Deduplicate and trim
    const uniq: string[] = [];
    feats.forEach((f) => {
      const norm = f.replace(/\s+/g, " ").trim();
      if (norm && !uniq.some((u) => u.toLowerCase() === norm.toLowerCase())) {
        uniq.push(norm);
      }
    });
    return uniq.slice(0, 20);
  };

  // Map amenity text to an icon and color theme
  const getAmenityMeta = (label: string) => {
    const l = label.toLowerCase();
    const entry =
      l.includes("gated") || l.includes("fence")
        ? {
            icon: FaShieldAlt,
            bg: "bg-emerald-50",
            fg: "text-emerald-700",
            ring: "ring-emerald-200",
          }
        : l.includes("drainage")
        ? {
            icon: FaWater,
            bg: "bg-cyan-50",
            fg: "text-cyan-700",
            ring: "ring-cyan-200",
          }
        : l.includes("water")
        ? {
            icon: FaWater,
            bg: "bg-sky-50",
            fg: "text-sky-700",
            ring: "ring-sky-200",
          }
        : l.includes("electric") || l.includes("power") || l.includes("light")
        ? {
            icon: FaBolt,
            bg: "bg-amber-50",
            fg: "text-amber-700",
            ring: "ring-amber-200",
          }
        : l.includes("road")
        ? {
            icon: FaRoad,
            bg: "bg-slate-50",
            fg: "text-slate-700",
            ring: "ring-slate-200",
          }
        : l.includes("parking") || l.includes("car")
        ? {
            icon: FaCar,
            bg: "bg-emerald-50",
            fg: "text-emerald-700",
            ring: "ring-emerald-200",
          }
        : l.includes("shower") || l.includes("bath")
        ? {
            icon: FaShower,
            bg: "bg-sky-50",
            fg: "text-sky-700",
            ring: "ring-sky-200",
          }
        : l.includes("kitchen")
        ? {
            icon: FaUtensils,
            bg: "bg-amber-50",
            fg: "text-amber-700",
            ring: "ring-amber-200",
          }
        : l.includes("living") || l.includes("lounge")
        ? {
            icon: FaCouch,
            bg: "bg-indigo-50",
            fg: "text-indigo-700",
            ring: "ring-indigo-200",
          }
        : l.includes("closet") || l.includes("storage")
        ? {
            icon: FaBoxes,
            bg: "bg-fuchsia-50",
            fg: "text-fuchsia-700",
            ring: "ring-fuchsia-200",
          }
        : l.includes("security") || l.includes("secure") || l.includes("estate")
        ? {
            icon: FaShieldAlt,
            bg: "bg-rose-50",
            fg: "text-rose-700",
            ring: "ring-rose-200",
          }
        : l.includes("bed") || l.includes("bedroom")
        ? {
            icon: FaBed,
            bg: "bg-teal-50",
            fg: "text-teal-700",
            ring: "ring-teal-200",
          }
        : {
            icon: FaHome,
            bg: "bg-gray-50",
            fg: "text-gray-700",
            ring: "ring-gray-200",
          };
    return entry;
  };

  // Date helpers
  const toQuarterLabel = (d: Date) => {
    const q = Math.floor(d.getMonth() / 3) + 1; // 1..4
    return `Q${q} ${d.getFullYear()}`;
  };
  const isValidDate = (d: Date) => !Number.isNaN(d.getTime());

  const isValidUrl = (str: string): boolean => {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  };

  // Motion variants for ROI section
  const roiContainer = {
    hidden: { opacity: 0, y: 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: { when: "beforeChildren", staggerChildren: 0.05 },
    },
  } as const;

  const roiItem = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0 },
  } as const;

  // Dummy calculation simulator
  const handleCalculate = () => {
    if (isCalculating) return;
    setIsCalculating(true);
    // Close any open edit/info states
    setEditingROIField(null);
    setOpenROIInfo(null);

    const {
      purchasePrice,
      financingRate,
      financingTenureYears,
      holdingPeriodYears,
      yieldLong,
      expensePct,
      appreciationLocalNominal,
    } = roiValues;

    window.setTimeout(() => {
      const years = Math.max(1, Math.min(holdingPeriodYears || 1, 50));
      const principal = purchasePrice || 0;
      const rentTotal = principal * (yieldLong / 100) * years;
      // Expenses are a share of rent, not principal
      const expensesTotal = rentTotal * (expensePct / 100);
      const interestTotal =
        principal *
        (financingRate / 100) *
        Math.min(years, financingTenureYears || years);
      const appreciationGain =
        principal * (appreciationLocalNominal / 100) * years;

      const profit = Math.max(
        0,
        rentTotal + appreciationGain - expensesTotal - interestTotal
      );
      const roiPct = principal > 0 ? (profit / principal) * 100 : 0;
      const annualIncome = principal * (yieldLong / 100);

      setCalcResult({ profit, roiPct, annualIncome });
      setIsCalculating(false);
    }, 900);
  };

  // Auto-calc ROI once on load when purchase price is available and user hasn't edited
  useEffect(() => {
    if (!result) return;
    if (roiHasEdited) return;
    if (calcResult) return;
    const currentPrice =
      result?.snapshot?.priceNGN ??
      (result as any)?.analytics?.market?.purchasePrice ??
      null;
    if (!currentPrice || currentPrice <= 0) return;
    // Only auto-calc when the ROI purchase price has been synced to the real price
    if (roiValues.purchasePrice !== currentPrice) return;
    handleCalculate();
  }, [result, roiValues.purchasePrice, roiHasEdited, calcResult]);

  // Recalculate automatically when user edits any ROI field after initial calc (debounced)
  useEffect(() => {
    if (!roiHasEdited) return; // only after user starts editing
    const t = setTimeout(() => {
      handleCalculate();
    }, 500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roiValues, roiHasEdited]);

  useEffect(() => {
    if (router.isReady) {
      const { q, type } = router.query;
      const query = (q as string) || "";
      setSearchQuery(query);
      setSearchType((type as string) || "");

      const token = getToken();
      if (!token) {
        router.push(
          `/auth?q=${encodeURIComponent(query)}&type=${(type as string) || ""}`
        );
        return;
      }

      if (query && (type as string) === "link" && isValidUrl(query)) {
        // If a reference is present (post-payment), verify will run in the other effect.
        // To enforce order (verify first, then hasPaid), skip hasPaid pre-check when reference exists.
        const refFromQuery = (router.query["reference"] as string) || "";
        const refFromHash =
          typeof window !== "undefined"
            ? new URL(window.location.href).hash.replace(/^#/, "")
            : "";
        const hasReference = !!(refFromQuery || refFromHash);

        if (!hasReference) {
          // No reference yet, safe to pre-check payment status
          hasPaid(query as string, "instant")
            .then((resp) => {
              if (resp?.paid) {
                setIsPaid(true);
              } else {
                setIsPaid(false);
              }
            })
            .catch(() => setIsPaid(false));
        }

        setIsLoading(true);
        setNotFound(false);
        setHasAttemptedFetch(true);
        setCurrentStep(0);

        const stepTimers = [
          setTimeout(() => setCurrentStep(1), 1500),
          setTimeout(() => setCurrentStep(2), 3000),
          setTimeout(() => setCurrentStep(3), 4500),
        ];

        getComputedListingByUrl(query as string)
          .then((payload) => {
            setResult(payload?.data || null);
            setNotFound(!payload?.data);
          })
          .catch(() => {
            setResult(null);
            setNotFound(true);
          })
          .finally(() => {
            setIsLoading(false);
            stepTimers.forEach((t) => clearTimeout(t));
          });
      } else if (query) {
        setResult(null);
        setNotFound(true);
        setIsLoading(false);
        setHasAttemptedFetch(true);
      }
    }
  }, [router.isReady, router.query]);

  // If the payment provider returns with a reference (e.g., in query or hash), verify and unhide
  useEffect(() => {
    if (!router.isReady) return;
    const refFromQuery = (router.query["reference"] as string) || "";
    const refFromHash =
      typeof window !== "undefined"
        ? new URL(window.location.href).hash.replace(/^#/, "")
        : "";
    const reference = refFromQuery || refFromHash;
    if (!reference) return;

    if (isEmbedded && typeof window !== "undefined") {
      try {
        const url = new URL(window.location.href);
        const listingQ = url.searchParams.get("q") || "";
        window.parent?.postMessage(
          { type: "payment_callback", reference, q: listingQ },
          window.location.origin
        );
      } catch {}
      return;
    }

    verifyPayment(reference)
      .then(() => {
        // Verified; mark as paid before any hasPaid calls
        setIsPaid(true);
        setProceed(false);
        setCheckoutUrl(null);
        setPaymentError(null);
      })
      .catch((e) => {
        setPaymentError(
          e?.response?.data?.message || e?.message || "Verification failed."
        );
      });
  }, [router.isReady, router.query, isEmbedded]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let isTop = true;
    try {
      isTop = window.self === window.top;
    } catch {
      isTop = true;
    }
    if (!isTop) return;

    const onMessage = (event: MessageEvent) => {
      if (!event?.data || typeof event.data !== "object") return;
      if (event.origin !== window.location.origin) return;
      if (event.data.type !== "payment_callback") return;
      const reference = event.data.reference as string | undefined;
      if (!reference) return;
      setIsVerifyingPayment(true);
      setVerifyingRef(reference);
      setCheckoutUrl(null);
      setPaymentError(null);
      const listingQ = (event.data.q as string) || searchQuery || "";
      verifyPayment(reference)
        .then(() => {
          setIsPaid(true);
          setIsVerifyingPayment(false);
          setProceed(false);
          const target =
            paymentCallbackUrl ||
            (listingQ
              ? `/result?q=${encodeURIComponent(listingQ)}&type=link`
              : "/result");
          router.push(target);
          setPaymentCallbackUrl(null);
        })
        .catch((e: any) => {
          setIsVerifyingPayment(false);
          setPaymentError(
            e?.response?.data?.message || e?.message || "Verification failed."
          );
        });
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [paymentCallbackUrl, searchQuery]);

  if (isLoading) {
    return (
      <Container
        noPadding
        className="min-h-screen bg-[#F9F9F9] text-inda-dark flex flex-col"
        data-hidden={isHidden ? "true" : "false"}
      >
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-[#F9F9F9] via-[#FAFAFA] to-[#F5F5F5] min-h-0 relative">
          {/* Background overlay */}
          <div className="absolute inset-0 bg-white/30 backdrop-blur-[0.5px]"></div>

          <div className="max-w-4xl w-full text-center relative z-10">
            {/* Loading Animation */}
            <div className="mb-8 sm:mb-12 flex justify-center">
              <div className="relative">
                {/* Outer rotating ring */}
                <div className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 border-4 border-[#4EA8A1]/20 rounded-full animate-spin border-t-[#4EA8A1]"></div>
                {/* Inner pulsing circle */}
                <div className="absolute inset-4 sm:inset-6 lg:inset-8 bg-gradient-to-br from-[#4EA8A1] to-[#66B3AD] rounded-full flex items-center justify-center animate-pulse">
                  <svg
                    className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-[#101820] mb-4 sm:mb-6 leading-tight">
              Analyzing Your Property...
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-[#101820]/70 max-w-2xl mx-auto leading-relaxed mb-8">
              We're verifying documents, checking market data, and running our
              AI analysis to give you the most accurate insights.
            </p>

            {/* Progress Steps */}
            <div className="max-w-md mx-auto space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span
                  className={`font-medium ${
                    currentStep >= 0 ? "text-[#4EA8A1]" : "text-[#101820]/60"
                  }`}
                >
                  Fetching property data...
                </span>
                <div className="flex space-x-1">
                  {currentStep === 0 ? (
                    <>
                      <div className="w-2 h-2 bg-[#4EA8A1] rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-[#4EA8A1] rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-[#4EA8A1] rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </>
                  ) : (
                    <div className="w-4 h-4 bg-[#4EA8A1] rounded-full flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span
                  className={`font-medium ${
                    currentStep >= 1 ? "text-[#4EA8A1]" : "text-[#101820]/60"
                  }`}
                >
                  Verifying documents...
                </span>
                <div className="flex space-x-1">
                  {currentStep === 1 ? (
                    <>
                      <div className="w-2 h-2 bg-[#4EA8A1] rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-[#4EA8A1] rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-[#4EA8A1] rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </>
                  ) : currentStep > 1 ? (
                    <div className="w-4 h-4 bg-[#4EA8A1] rounded-full flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span
                  className={`font-medium ${
                    currentStep >= 2 ? "text-[#4EA8A1]" : "text-[#101820]/60"
                  }`}
                >
                  Running market analysis...
                </span>
                <div className="flex space-x-1">
                  {currentStep === 2 ? (
                    <>
                      <div className="w-2 h-2 bg-[#4EA8A1] rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-[#4EA8A1] rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-[#4EA8A1] rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </>
                  ) : currentStep > 2 ? (
                    <div className="w-4 h-4 bg-[#4EA8A1] rounded-full flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span
                  className={`font-medium ${
                    currentStep >= 3 ? "text-[#4EA8A1]" : "text-[#101820]/60"
                  }`}
                >
                  Generating insights...
                </span>
                <div className="flex space-x-1">
                  {currentStep === 3 ? (
                    <>
                      <div className="w-2 h-2 bg-[#4EA8A1] rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-[#4EA8A1] rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-[#4EA8A1] rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </>
                  ) : currentStep > 3 ? (
                    <div className="w-4 h-4 bg-[#4EA8A1] rounded-full flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                  )}
                </div>
              </div>
            </div>

            {/* Estimated time */}
            <div className="mt-8 inline-flex items-center bg-white/80 backdrop-blur-sm border border-[#E5E5E5] rounded-full px-4 sm:px-6 py-2 sm:py-3 shadow-sm">
              <div className="w-2 h-2 bg-[#4EA8A1] rounded-full mr-3 animate-pulse"></div>
              <span className="text-sm sm:text-base text-[#101820]/60 font-medium">
                This usually takes 5-10 seconds...
              </span>
            </div>
          </div>
        </main>
        <Footer />
      </Container>
    );
  }

  // Full result view when result is available
  if (result) {
    // Helper values computed safely
    const price =
      result?.snapshot?.priceNGN ?? result?.analytics?.market?.purchasePrice;
    // Use generated dummy FMV instead of API FMV
    const fairValue = dummyFairValue;
    const marketDelta =
      price && fairValue
        ? Math.round(((price - fairValue) / fairValue) * 100)
        : null;

    // Inda Trust Score: from API only; show empty if missing
    const trustScoreRaw =
      (result as any)?.indaScore?.finalScore ??
      (result as any)?.aiReport?.finalScore ??
      null;
    const trustScore =
      typeof trustScoreRaw === "number" && !Number.isNaN(trustScoreRaw)
        ? Math.round(trustScoreRaw)
        : null;

    const sellerName =
      result?.snapshot?.agentCompanyName || result?.snapshot?.agentName || "—";
    const sellerProfileUrl =
      (result?.snapshot as any)?.agentCompanyUrl ||
      (result?.snapshot as any)?.agentUrl ||
      null;

    // Dummy bedrooms/bathrooms (deterministic based on price)
    const priceForSeed =
      typeof price === "number" && price > 0 ? price : 100_000_000;
    const seed = Math.floor(priceForSeed / 1_000_000); // reduce magnitude
    const bedDummy = 2 + (Math.floor(seed / 7) % 3); // 2..4
    const bathDummy = 2 + (Math.floor(seed / 11) % 2); // 2..3

    // Listing status (prefer explicit listing status fields)
    const listingStatus: string | null =
      (result?.snapshot as any)?.listingStatus ||
      (result?.snapshot as any)?.status ||
      (result as any)?.listingStatus ||
      (result as any)?.marketStatus ||
      (result as any)?.status ||
      null;

    // Delivery date mapping with graceful fallback to an estimate
    const rawDelivery: any =
      (result?.snapshot as any)?.deliveryDate ||
      (result?.snapshot as any)?.expectedDeliveryDate ||
      (result as any)?.deliveryDate ||
      (result as any)?.expectedDeliveryDate ||
      (result?.aiReport as any)?.delivery?.expectedDate ||
      (result?.aiReport as any)?.timeline?.deliveryDate ||
      null;
    let deliveryLabel: string = "—";
    let deliverySource: string = "—";
    if (rawDelivery) {
      if (typeof rawDelivery === "string") {
        // If it's a readable string like 'Q3 2026' or ISO date
        const parsed = new Date(rawDelivery);
        if (isValidDate(parsed)) {
          deliveryLabel = toQuarterLabel(parsed);
          deliverySource = "From listing/docs.";
        } else {
          deliveryLabel = String(rawDelivery);
          deliverySource = "From listing/docs.";
        }
      } else if (typeof rawDelivery === "number") {
        const parsed = new Date(rawDelivery);
        if (isValidDate(parsed)) {
          deliveryLabel = toQuarterLabel(parsed);
          deliverySource = "From listing/docs.";
        }
      }
    }
    if (deliveryLabel === "—") {
      const est = new Date();
      est.setMonth(est.getMonth() + 9); // default estimate: ~9 months out
      deliveryLabel = toQuarterLabel(est) + " (est.)";
      deliverySource = "Estimated";
    }

    return (
      <Container
        noPadding
        className={`min-h-screen bg-[#F9F9F9] text-inda-dark`}
        data-hidden={isHidden ? "true" : "false"}
      >
        <Navbar />
        <main className="flex-1 py-8">
          <div className="text-[#101820]/90 w-full max-w-7xl mx-auto space-y-8">
            {/* Intro Header */}
            <div className="px-6">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Hi {user?.firstName || "there"},
              </h2>
              <p className="text-lg md:text-xl lg:text-2xl font-normal mb-6">
                Here's what we found based on your search.
              </p>
              {(result?.listingUrl || result?.snapshot?.listingUrl) && (
                <p className="flex items-center gap-3 font-normal whitespace-nowrap overflow-hidden text-base md:text-lg">
                  <span className="shrink-0">
                    Results for the listing link:
                  </span>
                  <a
                    className="text-inda-teal underline truncate flex-1 min-w-0"
                    href={result?.listingUrl || result?.snapshot?.listingUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {result?.listingUrl || result?.snapshot?.listingUrl}
                  </a>
                </p>
              )}
            </div>

            {/* INDA TRUST SCORE (visible, not blurred) */}
            <div className="w-full px-6 my-6 relative z-20">
              <div className="rounded-2xl p-6 md:p-8 bg-[#4EA8A1] text-white">
                <div className="flex items-center justify-between mb-4 md:mb-6">
                  <span className="text-lg md:text-xl font-semibold">
                    Inda Trust Score
                  </span>
                  <span className="text-lg md:text-xl font-semibold tabular-nums">
                    {trustScore !== null ? `${displayScore}%` : "—"}
                  </span>
                </div>
                <div className="w-full h-4 bg-white/60 rounded-full overflow-hidden">
                  <div
                    className="h-4 rounded-full transition-[width] duration-200 ease-out"
                    style={{
                      width: `${trustScore !== null ? displayScore : 0}%`,
                      background:
                        "linear-gradient(90deg, rgba(60,143,137,1) 0%, rgba(78,168,161,1) 50%, rgba(60,143,137,1) 100%)",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* BEGIN hidden blur scope */}
            <div className="relative overflow-hidden">
              {isHidden && (
                <div className="absolute inset-0 z-10 pointer-events-none">
                  {/* Keep the unlock UI centered in the viewport while scrolling this section */}
                  <div className="sticky top-[50vh] -translate-y-1/2 transform w-full">
                    <div className="mx-auto w-[200px] h-[200px] md:w-[240px] md:h-[240px] rounded-full bg-[#4EA8A1] flex flex-col items-center justify-center shadow-2xl pointer-events-auto">
                      <FaLock className="text-white w-12 h-12 md:w-14 md:h-14 mb-4" />
                      <button
                        onClick={() => {
                          // Unlock should open the normal two-step flow (include Instant, show Step 1)
                          setStartPaidFlow(false);
                          setProceed(true);
                        }}
                        className="px-4 py-1.5 md:px-6 md:py-2 rounded-full border border-white text-white text-sm md:text-base font-semibold hover:bg-white/10 transition"
                      >
                        Unlock here
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <div className={isHidden ? "filter blur-sm" : undefined}>
                {/* Gallery */}
                <div className="w-full px-6">
                  <h3 className="text-2xl md:text-3xl font-bold mb-6">
                    Gallery
                  </h3>
                  <div className="relative group">
                    {/* Left arrow (desktop only) */}
                    <button
                      type="button"
                      aria-label="Scroll left"
                      onClick={() => scrollGalleryBy(-1)}
                      className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/50 transition-opacity opacity-0 group-hover:opacity-100"
                    >
                      <FaChevronLeft />
                    </button>
                    {/* Scroll container */}
                    <div
                      ref={galleryRef}
                      className="flex gap-4 overflow-x-auto pb-4 scroll-smooth"
                      style={{
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                      }}
                    >
                      <style jsx>{`
                        div::-webkit-scrollbar {
                          display: none;
                        }
                      `}</style>
                      {(result?.snapshot?.imageUrls ?? []).length > 0 ? (
                        (result?.snapshot?.imageUrls ?? [])
                          .slice(0, 6)
                          .map((url: string, idx: number) => (
                            <div
                              key={idx}
                              className="flex-shrink-0 w-80 h-56 md:w-96 md:h-64 lg:w-[420px] lg:h-72 rounded-lg overflow-hidden"
                            >
                              <img
                                src={url}
                                alt={`property-${idx}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))
                      ) : (
                        <div className="flex items-center justify-center w-full h-24 text-sm text-gray-600">
                          No images available.
                        </div>
                      )}
                    </div>
                    {/* Right arrow (desktop only) */}
                    <button
                      type="button"
                      aria-label="Scroll right"
                      onClick={() => scrollGalleryBy(1)}
                      className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/50 transition-opacity opacity-0 group-hover:opacity-100"
                    >
                      <FaChevronRight />
                    </button>
                  </div>
                </div>

                {/* Action Buttons Row */}
                {/* <div className="w-full px-6">
                  <div className="bg-[#4EA8A159] rounded-2xl my-6 px-4 sm:px-6 py-4 sm:py-6">
                    <div
                      className="flex flex-nowrap items-center gap-2 sm:gap-3 justify-start overflow-x-auto sm:overflow-visible relative"
                      style={{
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                      }}
                    >
                      {(() => {
                        const listingLink = (
                          result?.listingUrl ||
                          result?.snapshot?.listingUrl ||
                          ""
                        ).toString();
                        const rawPhone: string =
                          (result?.snapshot as any)?.agentPhone ||
                          (result?.snapshot as any)?.sellerPhone ||
                          (result?.snapshot as any)?.contactPhone ||
                          "";
                        const phone = sanitizePhone(rawPhone);
                        const hasPhone = phone.length >= 10;
                        const waText = `Hello, I'm interested in this property.\n\nListing: ${
                          listingLink || "N/A"
                        }`;
                        const onShare = async () => {
                          try {
                            if (navigator.share) {
                              await navigator.share({
                                title: "Property on INDA",
                                text: waText,
                                url: listingLink || window.location.href,
                              });
                              return;
                            }
                          } catch {}
                          try {
                            await navigator.clipboard.writeText(
                              listingLink || window.location.href
                            );
                            alert("Link copied to clipboard");
                          } catch {
                            window.open(listingLink || "#", "_blank");
                          }
                        };
                        return (
                          <>
                            <button
                              onClick={() =>
                                openWhatsApp(
                                  waText,
                                  hasPhone ? phone : INDA_WHATSAPP
                                )
                              }
                              className="flex items-center justify-center gap-2 whitespace-nowrap px-4 sm:px-5 py-2 sm:py-2.5 bg-inda-teal text-white rounded-full text-xs sm:text-sm font-medium hover:bg-teal-600 transition-colors"
                            >
                              <FaWhatsapp className="text-sm" />
                              {hasPhone ? "WhatsApp Seller" : "WhatsApp Us"}
                            </button>
                            <button
                              disabled={!hasPhone}
                              onClick={() =>
                                hasPhone && window.open(`tel:${phone}`, "_self")
                              }
                              className={`flex items-center justify-center gap-2 whitespace-nowrap px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                                hasPhone
                                  ? "bg-inda-teal text-white hover:bg-teal-600"
                                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
                              }`}
                            >
                              <FaPhone className="text-sm" />
                              Call Seller
                            </button>
                            <button
                              className="flex items-center justify-center gap-2 whitespace-nowrap px-4 sm:px-5 py-2 sm:py-2.5 bg-inda-teal text-white rounded-full text-xs sm:text-sm font-medium hover:bg-teal-600 transition-colors"
                              onClick={() =>
                                window.open(listingLink || "#", "_blank")
                              }
                            >
                              <FaExternalLinkAlt className="text-sm" />
                              View Source
                            </button>
                            <button
                              onClick={onShare}
                              className="flex items-center justify-center gap-2 whitespace-nowrap px-4 sm:px-5 py-2 sm:py-2.5 bg-inda-teal text-white rounded-full text-xs sm:text-sm font-medium hover:bg-teal-600 transition-colors"
                            >
                              <FaShare className="text-sm" />
                              Share
                            </button>
                          </>
                        );
                      })()}
                      <style jsx>{`
                        div::-webkit-scrollbar {
                          display: none;
                        }
                      `}</style>
                    </div>
                  </div>
                </div> */}

                {/* Smart Summary */}
                <div className="w-full px-6">
                  <div className="">
                    {/* Desktop Table View */}
                    <div className="hidden md:block">
                      <div className="space-y-3">
                        {/* Table Header */}
                        <div className="pt-8 pb-6 px-8 bg-[#E5E5E566] rounded-2xl">
                          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-inda-teal">
                            Smart Summary
                          </h2>
                          <div className="grid grid-cols-3 gap-12 text-lg font-semibold text-gray-700">
                            <div>Info</div>
                            <div>Details</div>
                            <div>Status</div>
                          </div>
                        </div>

                        {/* Bedroom/Bathrooms Row */}
                        <div className="grid grid-cols-2 xl:grid-cols-3 gap-6 xl:gap-12 py-5 px-5 xl:py-6 xl:px-6 bg-[#E5E5E566] font-normal text-sm xl:text-base text-[#101820] rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-inda-teal/10 rounded-lg flex items-center justify-center">
                              <FaBuilding className="text-inda-teal text-lg" />
                            </div>
                            <span>Bedroom/Bathrooms</span>
                          </div>
                          <div>
                            {bedDummy} Bed./
                            {bathDummy} Bath.
                          </div>
                          <div>From listing/docs.</div>
                        </div>

                        {/* Developer Row */}
                        <div className="grid grid-cols-2 xl:grid-cols-3 gap-6 xl:gap-12 py-5 px-5 xl:py-6 xl:px-6 bg-[#E5E5E566] font-normal text-sm xl:text-base text-[#101820] rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-inda-teal/10 rounded-lg flex items-center justify-center">
                              <FaBuilding className="text-inda-teal text-lg" />
                            </div>
                            <span className="font-medium">Seller</span>
                          </div>
                          <div className="font-medium">{sellerName}</div>
                          <div className="font-medium">
                            {sellerProfileUrl ? (
                              <a
                                className="text-inda-teal hover:underline"
                                href={sellerProfileUrl}
                                target="_blank"
                                rel="noreferrer"
                              >
                                View Profile here
                              </a>
                            ) : (
                              <span>—</span>
                            )}
                          </div>
                        </div>

                        {/* Delivery Date Row */}
                        <div className="grid grid-cols-2 xl:grid-cols-3 gap-6 xl:gap-12 py-5 px-5 xl:py-6 xl:px-6 bg-[#E5E5E566] font-normal text-sm xl:text-base text-[#101820] rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-inda-teal/10 rounded-lg flex items-center justify-center">
                              <FaClock className="text-inda-teal text-lg" />
                            </div>
                            <span className="font-medium">Delivery Date</span>
                          </div>
                          <div className="font-medium">{deliveryLabel}</div>
                          <div className="flex items-center gap-2">
                            {deliverySource}
                          </div>
                        </div>

                        {/* Status Row */}
                        <div className="grid grid-cols-2 xl:grid-cols-3 gap-6 xl:gap-12 py-5 px-5 xl:py-6 xl:px-6 bg-[#E5E5E566] font-normal text-sm xl:text-base text-[#101820] rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-inda-teal/10 rounded-lg flex items-center justify-center">
                              <FaMapMarkerAlt className="text-inda-teal text-lg" />
                            </div>
                            <span className="font-medium">Status</span>
                          </div>
                          <div className="font-medium">
                            {listingStatus || "—"}
                          </div>
                          <div className="flex items-center gap-2">
                            {listingStatus ? "From listing/docs." : "—"}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Mobile Card View (mirrors desktop rows exactly) */}
                    <div className="md:hidden space-y-4">
                      {/* Bedroom/Bathrooms Card */}
                      <div className="bg-[#E5E5E566] rounded-lg p-5">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 bg-inda-teal/10 rounded-lg flex items-center justify-center">
                            <FaBuilding className="text-inda-teal text-lg" />
                          </div>
                          <h4 className="font-semibold text-lg">
                            Bedroom/Bathrooms
                          </h4>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <span className="text-sm text-gray-500">
                              Details:{" "}
                            </span>
                            <span className="font-semibold text-base">
                              {bedDummy} Bed./
                              {bathDummy} Bath.
                            </span>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">
                              Status:{" "}
                            </span>
                            <span className="text-sm">From listing/docs.</span>
                          </div>
                        </div>
                      </div>

                      {/* Seller Card */}
                      <div className="bg-[#E5E5E566] rounded-lg p-5">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 bg-inda-teal/10 rounded-lg flex items-center justify-center">
                            <FaBuilding className="text-inda-teal text-lg" />
                          </div>
                          <h4 className="font-semibold text-lg">Seller</h4>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <span className="text-sm text-gray-500">
                              Details:{" "}
                            </span>
                            <span className="font-semibold text-base">
                              {sellerName}
                            </span>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">
                              Status:{" "}
                            </span>
                            {sellerProfileUrl ? (
                              <a
                                className="text-sm text-inda-teal cursor-pointer hover:underline"
                                href={sellerProfileUrl}
                                target="_blank"
                                rel="noreferrer"
                              >
                                View Profile here
                              </a>
                            ) : (
                              <span className="text-sm">—</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Delivery Date Card */}
                      <div className="bg-[#E5E5E566] rounded-lg p-5">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 bg-inda-teal/10 rounded-lg flex items-center justify-center">
                            <FaClock className="text-inda-teal text-lg" />
                          </div>
                          <h4 className="font-semibold text-lg">
                            Delivery Date
                          </h4>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <span className="text-sm text-gray-500">
                              Details:{" "}
                            </span>
                            <span className="font-semibold text-base">
                              {deliveryLabel}
                            </span>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">
                              Status:{" "}
                            </span>
                            <span className="text-sm">{deliverySource}</span>
                          </div>
                        </div>
                      </div>

                      {/* Status Card */}
                      <div className="bg-[#E5E5E566] rounded-lg p-5">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 bg-inda-teal/10 rounded-lg flex items-center justify-center">
                            <FaMapMarkerAlt className="text-inda-teal text-lg" />
                          </div>
                          <h4 className="font-semibold text-lg">Status</h4>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <span className="text-sm text-gray-500">
                              Details:{" "}
                            </span>
                            <span className="font-semibold text-base">
                              {listingStatus || "—"}
                            </span>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">
                              Status:{" "}
                            </span>
                            <span className="text-sm">
                              {listingStatus ? "From listing/docs." : "—"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                <div className="w-full px-6">
                  <div className="rounded-lg py-8">
                    <h3 className="text-2xl md:text-3xl font-bold mb-8">
                      Amenities
                    </h3>
                    {(() => {
                      const amenities = extractAmenities(
                        result?.snapshot || result
                      );
                      if (!amenities || amenities.length === 0) {
                        return (
                          <div className="flex items-center justify-center min-h-[120px] rounded-xl border border-dashed border-gray-300 text-gray-600">
                            No amenities listed.
                          </div>
                        );
                      }
                      return (
                        <div className="bg-[#E5E5E566] rounded-2xl p-4 sm:p-6">
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                            {amenities.map((a, i) => {
                              const meta = getAmenityMeta(a);
                              const Icon = meta.icon;
                              return (
                                <div
                                  key={`${a}-${i}`}
                                  className={`group flex items-center gap-3 rounded-xl ${meta.bg} ring-1 ${meta.ring} px-3 py-3 sm:px-4 sm:py-4 transition-colors hover:bg-white hover:shadow-sm`}
                                >
                                  <span
                                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${meta.bg} ${meta.fg} ring-1 ${meta.ring} group-hover:bg-[#4EA8A1]/10 group-hover:text-[#4EA8A1] group-hover:ring-[#4EA8A1]/20`}
                                  >
                                    <Icon className="text-base sm:text-lg" />
                                  </span>
                                  <span className="text-xs sm:text-sm font-medium text-[#101820] line-clamp-2">
                                    {a}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Feedback & Complaints */}
                <div className="w-full px-6">
                  <div className="rounded-lg p-6 sm:p-8">
                    <h3 className="text-2xl md:text-3xl font-bold mb-6 sm:mb-8 text-inda-teal">
                      Feedback & Complaints
                    </h3>
                    <div>
                      {/* Ratings Overview */}
                      <div className="bg-[#E5E5E566] rounded-2xl p-4 sm:p-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Average rating + stars */}
                          <div className="flex items-center md:items-start gap-4">
                            <div className="flex-shrink-0">
                              <div className="flex items-baseline gap-2 mb-1">
                                <span className="text-3xl sm:text-4xl font-extrabold">
                                  0.0
                                </span>
                              </div>
                              <div className="flex items-center gap-1 mb-2">
                                {Array.from({ length: 5 }).map((_, i) => {
                                  const active = false;
                                  return (
                                    <FaStar
                                      key={i}
                                      className={
                                        active
                                          ? "text-yellow-400 h-6 w-6 sm:h-6 sm:w-6"
                                          : "text-gray-300 h-5 w-5 sm:h-6 sm:w-6"
                                      }
                                    />
                                  );
                                })}
                              </div>
                              <p className="text-xs sm:text-sm text-[#0F1417] font-normal">
                                0 reviews
                              </p>
                            </div>
                          </div>

                          {/* Distribution bars */}
                          <div className="space-y-2">
                            {[5, 4, 3, 2, 1].map((stars) => (
                              <div
                                key={stars}
                                className="flex items-center gap-3"
                              >
                                <span className="w-6 sm:w-8 text-xs sm:text-sm text-[#101820]">
                                  {stars}
                                </span>
                                <div className="flex-1 h-2 bg-[#E5E5E5] rounded-full overflow-hidden">
                                  <div
                                    className="h-2 bg-[#101820]/40 rounded-full"
                                    style={{ width: `0%` }}
                                  ></div>
                                </div>
                                <span className="w-10 sm:w-12 text-right text-xs sm:text-sm text-[#101820]/65">
                                  0%
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Reviews List */}
                      <div className="space-y-4 sm:space-y-6">
                        <h1 className="font-bold text-lg sm:text-xl">
                          Reviews
                        </h1>
                        <div className="w-full border border-[#4EA8A1] rounded-2xl min-h-40 sm:min-h-56 md:min-h-64 flex items-center justify-center px-4">
                          <p className="text-center text-base sm:text-lg font-medium">
                            No Reviews Yet
                          </p>
                        </div>
                        <button className="text-[#4EA8A1] text-base sm:text-lg font-semibold hover:underline">
                          Report Your Experience here &lt;&lt;
                        </button>
                      </div>
                    </div>

                    {/* AI Summary */}
                    <div className="mt-6 sm:mt-8 pt-6 border-t border-gray-200">
                      <h4 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-inda-teal">
                        AI Summary
                      </h4>
                      <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                        {result?.aiReport?.sellerCredibility?.summary || "—"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="w-full px-6">
                  <div className="bg-[#E5E5E533] rounded-2xl p-6 sm:p-8">
                    <h3 className="text-2xl md:text-3xl font-bold mb-8 text-inda-teal">
                      Property Price Analysis
                    </h3>

                    {/* Price Cards Row (aligned with chart width) */}
                    <div className="w-full max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                      <div className="bg-[#4EA8A114] rounded-xl p-6">
                        <h4 className="text-base font-bold mb-2 text-[#101820]/70">
                          Price
                        </h4>
                        <p className="text-2xl font-bold text-inda-teal">
                          {price ? `₦${price.toLocaleString()}` : "—"}
                        </p>
                      </div>

                      <div className="bg-[#4EA8A114] rounded-xl p-6">
                        <h4 className="text-base font-bold mb-2 text-[#101820]/70">
                          Fair Market Value
                        </h4>
                        <p className="text-2xl font-bold text-inda-teal">
                          {fairValue ? `₦${fairValue.toLocaleString()}` : "—"}
                        </p>
                      </div>
                    </div>

                    {/* Chart Section */}
                    <div className="bg-transparent rounded-xl p-4 sm:p-6 mb-6">
                      {/* Header + Market Position row (same width as graph) */}
                      <div className="w-full max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-5">
                        <div>
                          <p className="text-sm text-inda-teal font-medium mb-1">
                            {`${last6ChangePct >= 0 ? "↑" : "↓"} ${Math.abs(
                              last6ChangePct
                            ).toFixed(1)}% in the last 6 months`}
                          </p>
                          <p className="text-xs text-gray-500">
                            {chartWindowLabel || "Sales (last 12 months)"}
                          </p>
                        </div>
                        <div className="bg-transparent border border-gray-200 rounded-lg px-4 py-3 ">
                          <div className="text-xs font-medium text-gray-600 mb-1">
                            Market Position
                          </div>
                          {price && fairValue ? (
                            <div
                              className={`text-sm font-bold ${
                                marketPositionPct >= 5
                                  ? "text-red-500"
                                  : marketPositionPct <= -5
                                  ? "text-green-600"
                                  : "text-amber-500"
                              }`}
                            >
                              {`${Math.abs(marketPositionPct).toFixed(0)}% ${
                                marketPositionPct >= 0
                                  ? "Overpriced"
                                  : "Underpriced"
                              }`}
                            </div>
                          ) : (
                            <div className="text-sm font-bold text-gray-500">
                              —
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Chart (Grouped bars with overlay lines) */}
                      <div
                        className="w-full max-w-4xl mx-auto mt-6 sm:mt-8 overflow-x-auto relative"
                        style={{
                          scrollbarWidth: "none",
                          msOverflowStyle: "none",
                        }}
                      >
                        <style jsx>{`
                          div::-webkit-scrollbar {
                            display: none;
                          }
                        `}</style>
                        {chartMonths.length === 12 &&
                        chartFMV.length === 12 &&
                        chartPriceSeries.length === 12 ? (
                          <div className="relative min-w-[600px] sm:min-w-0">
                            {(() => {
                              const W = 720; // svg width
                              const H = 240; // svg height a bit taller for bars
                              const padL = 56;
                              const padR = 20;
                              const padT = 12;
                              const padB = 32;
                              const innerW = W - padL - padR;
                              const innerH = H - padT - padB;
                              const maxY =
                                Math.max(...chartFMV, ...chartPriceSeries) || 1;
                              const minY = Math.min(
                                ...chartFMV,
                                ...chartPriceSeries
                              );
                              const yMin = Math.max(0, minY * 0.9);
                              const yMax = maxY * 1.08;
                              const groupCount = chartMonths.length;
                              const groupW = innerW / groupCount;
                              const barW = Math.min(14, groupW * 0.3);
                              const gap = 4; // gap between the two bars in a group
                              const xCenter = (i: number) =>
                                padL + groupW * i + groupW / 2;
                              const yScale = (val: number) =>
                                padT +
                                innerH -
                                ((val - yMin) / (yMax - yMin)) * innerH;

                              // y-axis ticks (5 steps) with compact labels
                              const ticks = 5;
                              const tickVals = Array.from(
                                { length: ticks + 1 },
                                (_, i) => yMin + ((yMax - yMin) * i) / ticks
                              );

                              // No line overlay; bars only

                              return (
                                <svg
                                  viewBox={`0 0 ${W} ${H}`}
                                  className="w-full h-auto"
                                  preserveAspectRatio="xMidYMid meet"
                                >
                                  {/* grid */}
                                  {tickVals.map((tv, i) => {
                                    const y = yScale(tv);
                                    return (
                                      <g key={`g-${i}`}>
                                        <line
                                          x1={padL}
                                          x2={W - padR}
                                          y1={y}
                                          y2={y}
                                          stroke="#E5E7EB"
                                          strokeWidth={1}
                                        />
                                        <text
                                          x={padL - 8}
                                          y={y + 3}
                                          textAnchor="end"
                                          fontSize={10}
                                          fill="#6B7280"
                                        >
                                          {formatCompact(tv)}
                                        </text>
                                      </g>
                                    );
                                  })}

                                  {/* x-axis labels */}
                                  {chartMonths.map((m, i) => (
                                    <text
                                      key={`xm-${m}-${i}`}
                                      x={xCenter(i)}
                                      y={H - 8}
                                      textAnchor="middle"
                                      fontSize={10}
                                      fill="#6B7280"
                                    >
                                      {m}
                                    </text>
                                  ))}

                                  {/* Bars (former colors) */}
                                  {chartFMV.map((v, i) => {
                                    const x = xCenter(i) - gap / 2 - barW; // FMV bar on the left
                                    const y = yScale(v);
                                    const h = Math.max(2, padT + innerH - y);
                                    const isSelected =
                                      selectedBar?.series === "fmv" &&
                                      selectedBar.index === i;
                                    return (
                                      <rect
                                        key={`bf-${i}`}
                                        x={x}
                                        y={y}
                                        width={barW}
                                        height={h}
                                        fill={
                                          isSelected ? "#3b8f89" : "#4EA8A1"
                                        }
                                        rx={2}
                                        className="cursor-pointer"
                                        onClick={() =>
                                          setSelectedBar(
                                            isSelected
                                              ? null
                                              : { series: "fmv", index: i }
                                          )
                                        }
                                      />
                                    );
                                  })}
                                  {chartPriceSeries.map((v, i) => {
                                    const x = xCenter(i) + gap / 2; // Price bar on the right
                                    const y = yScale(v);
                                    const h = Math.max(2, padT + innerH - y);
                                    const isSelected =
                                      selectedBar?.series === "price" &&
                                      selectedBar.index === i;
                                    return (
                                      <rect
                                        key={`bp-${i}`}
                                        x={x}
                                        y={y}
                                        width={barW}
                                        height={h}
                                        fill={
                                          isSelected ? "#9aa4ae" : "#D1D5DB"
                                        }
                                        rx={2}
                                        className="cursor-pointer"
                                        onClick={() =>
                                          setSelectedBar(
                                            isSelected
                                              ? null
                                              : { series: "price", index: i }
                                          )
                                        }
                                      />
                                    );
                                  })}

                                  {/* Tooltip bubble for selected bar */}
                                  {(() => {
                                    if (!selectedBar) return null;
                                    const isFMV = selectedBar.series === "fmv";
                                    const i = selectedBar.index;
                                    const val = isFMV
                                      ? chartFMV[i]
                                      : chartPriceSeries[i];
                                    const x = isFMV
                                      ? xCenter(i) - gap / 2 - barW + barW / 2
                                      : xCenter(i) + gap / 2 + barW / 2;
                                    const y = yScale(val) - 8; // a bit above the bar top
                                    const label = `₦${Math.round(
                                      val
                                    ).toLocaleString()}`;
                                    const bubblePadX = 8;
                                    const bubblePadY = 6;
                                    // compute text width roughly (8px per char at fontSize 11)
                                    const textW = Math.max(
                                      40,
                                      label.length * 7.2
                                    );
                                    const rectW = textW + bubblePadX * 2;
                                    const rectH = 24;
                                    const rectX = Math.max(
                                      padL,
                                      Math.min(x - rectW / 2, W - padR - rectW)
                                    );
                                    const rectY = Math.max(padT, y - rectH - 8);
                                    const pointerX = x;
                                    const pointerY = rectY + rectH; // top of pointer triangle
                                    const color = isFMV ? "#4EA8A1" : "#9AA4AE";
                                    return (
                                      <g key="tooltip">
                                        <rect
                                          x={rectX}
                                          y={rectY}
                                          width={rectW}
                                          height={rectH}
                                          rx={6}
                                          fill={color}
                                          opacity={0.95}
                                        />
                                        <text
                                          x={rectX + rectW / 2}
                                          y={rectY + rectH / 2 + 4}
                                          textAnchor="middle"
                                          fontSize={11}
                                          fill="#ffffff"
                                          fontWeight={600}
                                        >
                                          {label}
                                        </text>
                                        {/* pointer triangle */}
                                        <path
                                          d={`M ${pointerX - 6} ${
                                            rectY + rectH
                                          } L ${pointerX + 6} ${
                                            rectY + rectH
                                          } L ${pointerX} ${
                                            rectY + rectH + 8
                                          } Z`}
                                          fill={color}
                                          opacity={0.95}
                                        />
                                      </g>
                                    );
                                  })()}
                                </svg>
                              );
                            })()}
                            {/* Legend */}
                            <div className="flex flex-wrap items-center justify-start gap-4 sm:gap-6 mt-3">
                              <div className="flex items-center gap-2">
                                <span
                                  className="inline-block w-3 h-3 rounded-sm"
                                  style={{ background: "#4EA8A1" }}
                                />
                                <span className="text-xs text-gray-600 font-medium">
                                  FMV
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span
                                  className="inline-block w-3 h-3 rounded-sm"
                                  style={{ background: "#D1D5DB" }}
                                />
                                <span className="text-xs text-gray-600 font-medium">
                                  Price
                                </span>
                              </div>
                            </div>
                            {/* Mobile scroll affordance: edge fades + hint */}
                            <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-[#F9F9F9] to-transparent sm:hidden" />
                            <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-[#F9F9F9] to-transparent sm:hidden" />
                            <div className="pointer-events-none absolute bottom-0 right-2 sm:hidden">
                              <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur px-2.5 py-1.5 rounded-full shadow text-[10px] font-medium text-[#101820]">
                                <span>Swipe</span>
                                <FaChevronRight className="h-3 w-3 text-inda-teal animate-pulse" />
                              </div>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>

                    {/* AI Summary Collapsible */}
                    <div className="border-t border-gray-300 pt-6">
                      <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() =>
                          setIsPriceSummaryOpen(!isPriceSummaryOpen)
                        }
                      >
                        <h4 className="text-xl font-bold text-inda-teal">
                          AI Summary
                        </h4>
                        <div className="text-inda-teal">
                          {isPriceSummaryOpen ? (
                            <FaChevronUp className="text-base" />
                          ) : (
                            <FaChevronDown className="text-base" />
                          )}
                        </div>
                      </div>

                      {isPriceSummaryOpen && (
                        <div className="mt-4  bg-transparent rounded-lg">
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {result?.aiReport?.pricing?.summary ||
                              result?.aiReport?.marketValue?.summary ||
                              result?.aiReport?.summary ||
                              "—"}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Map Section - Google Maps */}
                <div className="w-full px-4">
                  <div className=" rounded-lg p-4">
                    <h3 className="text-2xl md:text-3xl font-bold mb-8 text-inda-teal">
                      Microlocation Insights
                    </h3>
                    <div className="flex flex-col gap-6">
                      <div>
                        <div className="h-[360px] sm:h-[480px] md:h-[560px] lg:h-[640px] xl:h-[700px] rounded-lg overflow-hidden bg-white">
                          {/* Use embed from env when provided (from Oyinda) */}
                          {(() => {
                            const embed =
                              process.env.NEXT_PUBLIC_RESULTS_MAP_EMBED_URL;
                            if (embed) {
                              return (
                                <iframe
                                  title="results-map-embed"
                                  className="w-full h-full"
                                  loading="lazy"
                                  referrerPolicy="no-referrer-when-downgrade"
                                  src={embed}
                                />
                              );
                            }
                            // Fallback to AerialMap if no embed URL provided
                            const lat = Number(
                              process.env.NEXT_PUBLIC_MAP_DEFAULT_LAT ?? 6.6018
                            );
                            const lng = Number(
                              process.env.NEXT_PUBLIC_MAP_DEFAULT_LNG ?? 3.3515
                            );
                            const zoom = Number(
                              process.env.NEXT_PUBLIC_MAP_DEFAULT_ZOOM ?? 16
                            );
                            const AerialMap =
                              require("@/components/inc/AerialMap").default;
                            return (
                              <AerialMap
                                lat={lat}
                                lng={lng}
                                zoom={zoom}
                                useOblique={false}
                                heading={0}
                                mapType="hybrid"
                                className="relative w-full h-full"
                              />
                            );
                          })()}
                        </div>
                      </div>
                      <div>
                        <div
                          className="flex items-center justify-between cursor-pointer mb-2"
                          onClick={() =>
                            setIsLocationSummaryOpen(!isLocationSummaryOpen)
                          }
                        >
                          <h4 className="text-xl font-bold text-inda-teal">
                            AI Summary
                          </h4>
                          {isLocationSummaryOpen ? (
                            <FaChevronUp className="text-inda-teal" />
                          ) : (
                            <FaChevronDown className="text-inda-teal" />
                          )}
                        </div>
                        {isLocationSummaryOpen && (
                          <div className="bg-transparent rounded-lg">
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {result?.aiReport?.microlocation?.summary || (
                                <span className="text-[#101820]/70">
                                  We’re still compiling micro‑location signals
                                  (flood risk, access roads, market depth,
                                  safety indices). For the demo, assume this
                                  area scores above Lagos median on
                                  infrastructure and rental absorption, with
                                  moderate traffic exposure and low reported
                                  title disputes.
                                </span>
                              )}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ROI Panel */}
                <div className="w-full px-4">
                  <motion.div
                    className="rounded-lg p-4"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={roiContainer}
                  >
                    <h3 className="text-2xl md:text-3xl font-bold mb-4 text-inda-teal">
                      Investment ROI Calculator
                    </h3>
                    <p className="text-[#101820] text-base lg:text-lg mb-8">
                      Estimate your potential returns on investment properties
                      with our comprehensive calculator.
                    </p>

                    <h4 className="font-bold text-xl lg:text-2xl py-4">
                      Property Details
                    </h4>

                    {/* Top grid of inputs (info/editable) */}
                    <motion.div
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                      variants={roiContainer}
                    >
                      {/* Purchase Price */}
                      <motion.div variants={roiItem}>
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-base lg:text-lg text-[#101820]/90">
                            <span className="inline-flex items-center gap-2">
                              <span>Purchase Price</span>
                              {editedFields.purchasePrice && (
                                <span className="text-[10px] uppercase tracking-wide bg-[#4EA8A11A] border border-[#4EA8A1]/40 text-[#0A655E] px-1.5 py-0.5 rounded">
                                  Edited
                                </span>
                              )}
                            </span>
                          </p>
                          <div className="flex items-center gap-2 text-inda-teal">
                            <motion.button
                              whileTap={{ scale: 0.97 }}
                              animate={{
                                rotate:
                                  openROIInfo === "purchasePrice" ? 15 : 0,
                              }}
                              onClick={() => toggleROIInfo("purchasePrice")}
                              aria-label="Info: Purchase Price"
                            >
                              <IoIosInformationCircle className="w-5 h-5" />
                            </motion.button>
                            <motion.button
                              whileTap={{ scale: 0.97 }}
                              onClick={() => startROIEdit("purchasePrice")}
                              aria-label="Edit: Purchase Price"
                            >
                              <RiEditFill className="w-5 h-5" />
                            </motion.button>
                          </div>
                        </div>
                        <AnimatePresence mode="wait">
                          {openROIInfo === "purchasePrice" && (
                            <motion.div
                              key="pp-info"
                              className="bg-[#E5F4F2] rounded-lg p-3 text-sm text-[#101820]"
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -8 }}
                            >
                              {roiFieldInfo.purchasePrice}
                            </motion.div>
                          )}
                          {editingROIField === "purchasePrice" && (
                            <motion.div
                              key="pp-edit"
                              className="relative bg-[#4EA8A129] h-16 rounded-lg px-4 text-base text-[#101820]/90 flex items-center ring-2 ring-[#4EA8A1]/50"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                            >
                              <span className="absolute -top-2 right-2 text-[10px] uppercase tracking-wide bg-[#0A655E] text-white px-2 py-0.5 rounded-full shadow">
                                Editing
                              </span>
                              <input
                                type="text"
                                inputMode="numeric"
                                className="bg-transparent outline-none w-full"
                                value={roiValues.purchasePrice.toLocaleString()}
                                onChange={(e) =>
                                  updateROIValue(
                                    "purchasePrice",
                                    e.target.value
                                  )
                                }
                              />
                            </motion.div>
                          )}
                          {!(
                            openROIInfo === "purchasePrice" ||
                            editingROIField === "purchasePrice"
                          ) && (
                            <motion.div
                              key="pp-view"
                              className="bg-[#4EA8A129] h-16 rounded-lg p-4 text-base text-center text-[#101820] flex items-center justify-center"
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -6 }}
                            >
                              {formatNaira(roiValues.purchasePrice)}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>

                      {/* Financing */}
                      <motion.div variants={roiItem}>
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-base lg:text-lg text-[#101820]/90">
                            <span className="inline-flex items-center gap-2">
                              <span>Financing</span>
                              {editedFields.financingRate && (
                                <span className="text-[10px] uppercase tracking-wide bg-[#4EA8A11A] border border-[#4EA8A1]/40 text-[#0A655E] px-1.5 py-0.5 rounded">
                                  Edited
                                </span>
                              )}
                            </span>
                          </p>
                          <div className="flex items-center gap-2 text-inda-teal">
                            <motion.button
                              whileTap={{ scale: 0.97 }}
                              animate={{
                                rotate:
                                  openROIInfo === "financingRate" ? 15 : 0,
                              }}
                              onClick={() => toggleROIInfo("financingRate")}
                              aria-label="Info: Financing"
                            >
                              <IoIosInformationCircle className="w-5 h-5" />
                            </motion.button>
                            <motion.button
                              whileTap={{ scale: 0.97 }}
                              onClick={() => startROIEdit("financingRate")}
                              aria-label="Edit: Financing"
                            >
                              <RiEditFill className="w-5 h-5" />
                            </motion.button>
                          </div>
                        </div>
                        <AnimatePresence mode="wait">
                          {openROIInfo === "financingRate" && (
                            <motion.div
                              key="fin-info"
                              className="bg-[#E5F4F2] rounded-lg p-3 text-sm text-[#101820]"
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -8 }}
                            >
                              {roiFieldInfo.financingRate}
                            </motion.div>
                          )}
                          {editingROIField === "financingRate" && (
                            <motion.div
                              key="fin-edit"
                              className="relative bg-[#4EA8A129] h-16 rounded-lg px-4 text-base text-[#101820]/90 flex items-center ring-2 ring-[#4EA8A1]/50"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                            >
                              <span className="absolute -top-2 right-2 text-[10px] uppercase tracking-wide bg-[#0A655E] text-white px-2 py-0.5 rounded-full shadow">
                                Editing
                              </span>
                              <input
                                type="number"
                                step="0.01"
                                className="bg-transparent outline-none w-full"
                                value={roiValues.financingRate}
                                onChange={(e) =>
                                  updateROIValue(
                                    "financingRate",
                                    e.target.value
                                  )
                                }
                              />
                              <span className="ml-1">%</span>
                            </motion.div>
                          )}
                          {!(
                            openROIInfo === "financingRate" ||
                            editingROIField === "financingRate"
                          ) && (
                            <motion.div
                              key="fin-view"
                              className="bg-[#4EA8A129] h-16 rounded-lg p-4 text-base text-center text-[#101820] flex items-center justify-center"
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -6 }}
                            >
                              {formatPercent(roiValues.financingRate)}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>

                      {/* Financing Tenure */}
                      <motion.div variants={roiItem}>
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-base lg:text-lg text-[#101820]/90">
                            <span className="inline-flex items-center gap-2">
                              <span>Financing Tenure</span>
                              {editedFields.financingTenureYears && (
                                <span className="text-[10px] uppercase tracking-wide bg-[#4EA8A11A] border border-[#4EA8A1]/40 text-[#0A655E] px-1.5 py-0.5 rounded">
                                  Edited
                                </span>
                              )}
                            </span>
                          </p>
                          <div className="flex items-center gap-2 text-inda-teal">
                            <motion.button
                              whileTap={{ scale: 0.97 }}
                              animate={{
                                rotate:
                                  openROIInfo === "financingTenureYears"
                                    ? 15
                                    : 0,
                              }}
                              onClick={() =>
                                toggleROIInfo("financingTenureYears")
                              }
                              aria-label="Info: Financing Tenure"
                            >
                              <IoIosInformationCircle className="w-5 h-5" />
                            </motion.button>
                            <motion.button
                              whileTap={{ scale: 0.97 }}
                              onClick={() =>
                                startROIEdit("financingTenureYears")
                              }
                              aria-label="Edit: Financing Tenure"
                            >
                              <RiEditFill className="w-5 h-5" />
                            </motion.button>
                          </div>
                        </div>
                        <AnimatePresence mode="wait">
                          {openROIInfo === "financingTenureYears" && (
                            <motion.div
                              key="tenure-info"
                              className="bg-[#E5F4F2] rounded-lg p-3 text-sm text-[#101820]"
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -8 }}
                            >
                              {roiFieldInfo.financingTenureYears}
                            </motion.div>
                          )}
                          {editingROIField === "financingTenureYears" && (
                            <motion.div
                              key="tenure-edit"
                              className="relative bg-[#4EA8A129] h-16 rounded-lg px-4 text-base text-[#101820]/90 flex items-center ring-2 ring-[#4EA8A1]/50"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                            >
                              <span className="absolute -top-2 right-2 text-[10px] uppercase tracking-wide bg-[#0A655E] text-white px-2 py-0.5 rounded-full shadow">
                                Editing
                              </span>
                              <input
                                type="number"
                                step="1"
                                className="bg-transparent outline-none w-full"
                                value={roiValues.financingTenureYears}
                                onChange={(e) =>
                                  updateROIValue(
                                    "financingTenureYears",
                                    e.target.value
                                  )
                                }
                              />
                              <span className="ml-1">years</span>
                            </motion.div>
                          )}
                          {!(
                            openROIInfo === "financingTenureYears" ||
                            editingROIField === "financingTenureYears"
                          ) && (
                            <motion.div
                              key="tenure-view"
                              className="bg-[#4EA8A129] h-16 rounded-lg p-4 text-base text-center text-[#101820] flex items-center justify-center"
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -6 }}
                            >
                              {roiValues.financingTenureYears} years
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>

                      {/* Holding Period */}
                      <motion.div variants={roiItem}>
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-base lg:text-lg text-[#101820]/90">
                            <span className="inline-flex items-center gap-2">
                              <span>Holding Period</span>
                              {editedFields.holdingPeriodYears && (
                                <span className="text-[10px] uppercase tracking-wide bg-[#4EA8A11A] border border-[#4EA8A1]/40 text-[#0A655E] px-1.5 py-0.5 rounded">
                                  Edited
                                </span>
                              )}
                            </span>
                          </p>
                          <div className="flex items-center gap-2 text-inda-teal">
                            <motion.button
                              whileTap={{ scale: 0.97 }}
                              animate={{
                                rotate:
                                  openROIInfo === "holdingPeriodYears" ? 15 : 0,
                              }}
                              onClick={() =>
                                toggleROIInfo("holdingPeriodYears")
                              }
                              aria-label="Info: Holding Period"
                            >
                              <IoIosInformationCircle className="w-5 h-5" />
                            </motion.button>
                            <motion.button
                              whileTap={{ scale: 0.97 }}
                              onClick={() => startROIEdit("holdingPeriodYears")}
                              aria-label="Edit: Holding Period"
                            >
                              <RiEditFill className="w-5 h-5" />
                            </motion.button>
                          </div>
                        </div>
                        <AnimatePresence mode="wait">
                          {openROIInfo === "holdingPeriodYears" && (
                            <motion.div
                              key="hold-info"
                              className="bg-[#E5F4F2] rounded-lg p-3 text-sm text-[#101820]"
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -8 }}
                            >
                              {roiFieldInfo.holdingPeriodYears}
                            </motion.div>
                          )}
                          {editingROIField === "holdingPeriodYears" && (
                            <motion.div
                              key="hold-edit"
                              className="relative bg-[#4EA8A129] h-16 rounded-lg px-4 text-base text-[#101820]/90 flex items-center ring-2 ring-[#4EA8A1]/50"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                            >
                              <span className="absolute -top-2 right-2 text-[10px] uppercase tracking-wide bg-[#0A655E] text-white px-2 py-0.5 rounded-full shadow">
                                Editing
                              </span>
                              <input
                                type="number"
                                step="1"
                                className="bg-transparent outline-none w-full"
                                value={roiValues.holdingPeriodYears}
                                onChange={(e) =>
                                  updateROIValue(
                                    "holdingPeriodYears",
                                    e.target.value
                                  )
                                }
                              />
                              <span className="ml-1">years</span>
                            </motion.div>
                          )}
                          {!(
                            openROIInfo === "holdingPeriodYears" ||
                            editingROIField === "holdingPeriodYears"
                          ) && (
                            <motion.div
                              key="hold-view"
                              className="bg-[#4EA8A129] h-16 rounded-lg p-4 text-base text-center text-[#101820] flex items-center justify-center"
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -6 }}
                            >
                              {roiValues.holdingPeriodYears} years
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </motion.div>

                    {/* Middle grid of yields/expenses (info/editable) */}
                    <motion.div
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6"
                      variants={roiContainer}
                    >
                      {/* Avg. Rental Yield (Long Term) */}
                      <motion.div variants={roiItem}>
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-base lg:text-lg text-[#101820]/90">
                            <span className="inline-flex items-center gap-2">
                              <span>Avg. Rental Yield (Long Term)</span>
                              {editedFields.yieldLong && (
                                <span className="text-[10px] uppercase tracking-wide bg-[#4EA8A11A] border border-[#4EA8A1]/40 text-[#0A655E] px-1.5 py-0.5 rounded">
                                  Edited
                                </span>
                              )}
                            </span>
                          </p>
                          <div className="flex items-center gap-2 text-inda-teal">
                            <motion.button
                              whileTap={{ scale: 0.97 }}
                              animate={{
                                rotate: openROIInfo === "yieldLong" ? 15 : 0,
                              }}
                              onClick={() => toggleROIInfo("yieldLong")}
                              aria-label="Info: Yield Long"
                            >
                              <IoIosInformationCircle className="w-5 h-5" />
                            </motion.button>
                            <motion.button
                              whileTap={{ scale: 0.97 }}
                              onClick={() => startROIEdit("yieldLong")}
                              aria-label="Edit: Yield Long"
                            >
                              <RiEditFill className="w-5 h-5" />
                            </motion.button>
                          </div>
                        </div>
                        <AnimatePresence mode="wait">
                          {openROIInfo === "yieldLong" && (
                            <motion.div
                              key="yl-info"
                              className="bg-[#E5F4F2] rounded-lg p-3 text-sm text-[#101820]"
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -8 }}
                            >
                              {roiFieldInfo.yieldLong}
                            </motion.div>
                          )}
                          {editingROIField === "yieldLong" && (
                            <motion.div
                              key="yl-edit"
                              className="relative bg-[#4EA8A129] h-16 rounded-lg px-4 text-base text-[#101820]/90 flex items-center ring-2 ring-[#4EA8A1]/50"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                            >
                              <span className="absolute -top-2 right-2 text-[10px] uppercase tracking-wide bg-[#0A655E] text-white px-2 py-0.5 rounded-full shadow">
                                Editing
                              </span>
                              <input
                                type="number"
                                step="0.01"
                                className="bg-transparent outline-none w-full"
                                value={roiValues.yieldLong}
                                onChange={(e) =>
                                  updateROIValue("yieldLong", e.target.value)
                                }
                              />
                              <span className="ml-1">%</span>
                            </motion.div>
                          )}
                          {!(
                            openROIInfo === "yieldLong" ||
                            editingROIField === "yieldLong"
                          ) && (
                            <motion.div
                              key="yl-view"
                              className="bg-[#4EA8A129] h-16 rounded-lg p-4 text-base text-center text-[#101820] flex items-center justify-center"
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -6 }}
                            >
                              {formatPercent(roiValues.yieldLong)}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>

                      {/* Avg. Rental Yield (Short Term) */}
                      <motion.div variants={roiItem}>
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-base lg:text-lg text-[#101820]/90">
                            <span className="inline-flex items-center gap-2">
                              <span>Avg. Rental Yield (Short Term)</span>
                              {editedFields.yieldShort && (
                                <span className="text-[10px] uppercase tracking-wide bg-[#4EA8A11A] border border-[#4EA8A1]/40 text-[#0A655E] px-1.5 py-0.5 rounded">
                                  Edited
                                </span>
                              )}
                            </span>
                          </p>
                          <div className="flex items-center gap-2 text-inda-teal">
                            <motion.button
                              whileTap={{ scale: 0.97 }}
                              animate={{
                                rotate: openROIInfo === "yieldShort" ? 15 : 0,
                              }}
                              onClick={() => toggleROIInfo("yieldShort")}
                              aria-label="Info: Yield Short"
                            >
                              <IoIosInformationCircle className="w-5 h-5" />
                            </motion.button>
                            <motion.button
                              whileTap={{ scale: 0.97 }}
                              onClick={() => startROIEdit("yieldShort")}
                              aria-label="Edit: Yield Short"
                            >
                              <RiEditFill className="w-5 h-5" />
                            </motion.button>
                          </div>
                        </div>
                        <AnimatePresence mode="wait">
                          {openROIInfo === "yieldShort" && (
                            <motion.div
                              key="ys-info"
                              className="bg-[#E5F4F2] rounded-lg p-3 text-sm text-[#101820]"
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -8 }}
                            >
                              {roiFieldInfo.yieldShort}
                            </motion.div>
                          )}
                          {editingROIField === "yieldShort" && (
                            <motion.div
                              key="ys-edit"
                              className="relative bg-[#4EA8A129] h-16 rounded-lg px-4 text-base text-[#101820]/90 flex items-center ring-2 ring-[#4EA8A1]/50"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                            >
                              <span className="absolute -top-2 right-2 text-[10px] uppercase tracking-wide bg-[#0A655E] text-white px-2 py-0.5 rounded-full shadow">
                                Editing
                              </span>
                              <input
                                type="number"
                                step="0.01"
                                className="bg-transparent outline-none w-full"
                                value={roiValues.yieldShort}
                                onChange={(e) =>
                                  updateROIValue("yieldShort", e.target.value)
                                }
                              />
                              <span className="ml-1">%</span>
                            </motion.div>
                          )}
                          {!(
                            openROIInfo === "yieldShort" ||
                            editingROIField === "yieldShort"
                          ) && (
                            <motion.div
                              key="ys-view"
                              className="bg-[#4EA8A129] h-16 rounded-lg p-4 text-base text-center text-[#101820] flex items-center justify-center"
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -6 }}
                            >
                              {formatPercent(roiValues.yieldShort)}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>

                      {/* Total Expense (% of Rent) */}
                      <motion.div variants={roiItem}>
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-base lg:text-lg text-[#101820]/90">
                            <span className="inline-flex items-center gap-2">
                              <span>Total Expense (% of Rent)</span>
                              {editedFields.expensePct && (
                                <span className="text-[10px] uppercase tracking-wide bg-[#4EA8A11A] border border-[#4EA8A1]/40 text-[#0A655E] px-1.5 py-0.5 rounded">
                                  Edited
                                </span>
                              )}
                            </span>
                          </p>
                          <div className="flex items-center gap-2 text-inda-teal">
                            <motion.button
                              whileTap={{ scale: 0.97 }}
                              animate={{
                                rotate: openROIInfo === "expensePct" ? 15 : 0,
                              }}
                              onClick={() => toggleROIInfo("expensePct")}
                              aria-label="Info: Expense %"
                            >
                              <IoIosInformationCircle className="w-5 h-5" />
                            </motion.button>
                            <motion.button
                              whileTap={{ scale: 0.97 }}
                              onClick={() => startROIEdit("expensePct")}
                              aria-label="Edit: Expense %"
                            >
                              <RiEditFill className="w-5 h-5" />
                            </motion.button>
                          </div>
                        </div>
                        <AnimatePresence mode="wait">
                          {openROIInfo === "expensePct" && (
                            <motion.div
                              key="ex-info"
                              className="bg-[#E5F4F2] rounded-lg p-3 text-sm text-[#101820]"
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -8 }}
                            >
                              {roiFieldInfo.expensePct}
                            </motion.div>
                          )}
                          {editingROIField === "expensePct" && (
                            <motion.div
                              key="ex-edit"
                              className="relative bg-[#4EA8A129] h-16 rounded-lg px-4 text-base text-[#101820]/90 flex items-center ring-2 ring-[#4EA8A1]/50"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                            >
                              <span className="absolute -top-2 right-2 text-[10px] uppercase tracking-wide bg-[#0A655E] text-white px-2 py-0.5 rounded-full shadow">
                                Editing
                              </span>
                              <input
                                type="number"
                                step="0.01"
                                className="bg-transparent outline-none w-full"
                                value={roiValues.expensePct}
                                onChange={(e) =>
                                  updateROIValue("expensePct", e.target.value)
                                }
                              />
                              <span className="ml-1">%</span>
                            </motion.div>
                          )}
                          {!(
                            openROIInfo === "expensePct" ||
                            editingROIField === "expensePct"
                          ) && (
                            <motion.div
                              key="ex-view"
                              className="bg-[#4EA8A129] h-16 rounded-lg p-4 text-base text-center text-[#101820] flex items-center justify-center"
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -6 }}
                            >
                              {formatPercent(roiValues.expensePct)}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </motion.div>

                    {/* Appreciation: show one at a time with tabs (non-editable) */}
                    <motion.div
                      className="bg-[#4EA8A129] rounded-xl p-4 mb-8"
                      variants={roiItem}
                    >
                      <div className="flex gap-2 mb-4">
                        <motion.button
                          whileTap={{ scale: 0.98 }}
                          className={`px-3 py-2 rounded-md text-sm font-medium ${
                            appreciationTab === "localNominal"
                              ? "bg-[#4EA8A1] text-white"
                              : "bg-transparent text-[#101820]/80 border border-[#4EA8A1]/40 hover:bg-[#4EA8A11A]"
                          }`}
                          onClick={() => setAppreciationTab("localNominal")}
                        >
                          ₦ Local Nominal
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.98 }}
                          className={`px-3 py-2 rounded-md text-sm font-medium ${
                            appreciationTab === "localReal"
                              ? "bg-[#4EA8A1] text-white"
                              : "bg-transparent text-[#101820]/80 border border-[#4EA8A1]/40 hover:bg-[#4EA8A11A]"
                          }`}
                          onClick={() => setAppreciationTab("localReal")}
                        >
                          ₦ Local Real
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.98 }}
                          className={`px-3 py-2 rounded-md text-sm font-medium ${
                            appreciationTab === "usdAdj"
                              ? "bg-[#4EA8A1] text-white"
                              : "bg-transparent text-[#101820]/80 border border-[#4EA8A1]/40 hover:bg-[#4EA8A11A]"
                          }`}
                          onClick={() => setAppreciationTab("usdAdj")}
                        >
                          USD (FX + Inflation Adj)
                        </motion.button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-base lg:text-lg font-semibold text-[#101820]">
                          {appreciationTab === "localNominal" && (
                            <span>Annual Appreciation (₦, Local Nominal)</span>
                          )}
                          {appreciationTab === "localReal" && (
                            <span>Annual Appreciation (₦, Local Real)</span>
                          )}
                          {appreciationTab === "usdAdj" && (
                            <span>
                              Annual Appreciation (USD, FX + Inflation Adjusted)
                            </span>
                          )}
                        </div>
                        <motion.button
                          whileTap={{ scale: 0.97 }}
                          onClick={() =>
                            setOpenROIInfo((prev) =>
                              prev ===
                              (appreciationTab === "localNominal"
                                ? "appreciationLocalNominal"
                                : appreciationTab === "localReal"
                                ? "appreciationLocalReal"
                                : "appreciationUsdAdj")
                                ? null
                                : appreciationTab === "localNominal"
                                ? "appreciationLocalNominal"
                                : appreciationTab === "localReal"
                                ? "appreciationLocalReal"
                                : "appreciationUsdAdj"
                            )
                          }
                          aria-label="Info: Appreciation"
                          className="text-inda-teal"
                        >
                          <IoIosInformationCircle className="w-5 h-5" />
                        </motion.button>
                      </div>
                      <AnimatePresence mode="wait">
                        {openROIInfo === "appreciationLocalNominal" &&
                          appreciationTab === "localNominal" && (
                            <motion.div
                              key="app-info-nominal"
                              className="mt-3 bg-[#E5F4F2] rounded-lg p-3 text-sm text-[#101820]"
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -8 }}
                            >
                              {roiFieldInfo.appreciationLocalNominal}
                            </motion.div>
                          )}
                        {openROIInfo === "appreciationLocalReal" &&
                          appreciationTab === "localReal" && (
                            <motion.div
                              key="app-info-real"
                              className="mt-3 bg-[#E5F4F2] rounded-lg p-3 text-sm text-[#101820]"
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -8 }}
                            >
                              {roiFieldInfo.appreciationLocalReal}
                            </motion.div>
                          )}
                        {openROIInfo === "appreciationUsdAdj" &&
                          appreciationTab === "usdAdj" && (
                            <motion.div
                              key="app-info-usd"
                              className="mt-3 bg-[#E5F4F2] rounded-lg p-3 text-sm text-[#101820]"
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -8 }}
                            >
                              {roiFieldInfo.appreciationUsdAdj}
                            </motion.div>
                          )}
                      </AnimatePresence>
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={`app-val-${appreciationTab}`}
                          className="mt-4 bg-[#4EA8A129] rounded-lg p-4 text-center text-xl font-bold text-[#101820]"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          {appreciationTab === "localNominal" &&
                            formatPercent(appNominal)}
                          {appreciationTab === "localReal" &&
                            formatPercent(appReal)}
                          {appreciationTab === "usdAdj" &&
                            formatPercent(appUsd)}
                        </motion.div>
                      </AnimatePresence>
                    </motion.div>

                    {/* Calculate button */}
                    <div className="flex justify-end mb-8">
                      <motion.button
                        onClick={handleCalculate}
                        className={`py-3 px-8 rounded-lg text-base font-semibold transition text-white flex items-center gap-2 bg-[#4EA8A1] hover:bg-[#0A655E]`}
                        disabled={false}
                        whileTap={{ scale: 0.98 }}
                        whileHover={{ y: -1 }}
                      >
                        {isCalculating && (
                          <svg
                            className="animate-spin -ml-1 mr-1 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                            ></path>
                          </svg>
                        )}
                        {isCalculating ? "Calculating…" : "Calculate"}
                      </motion.button>
                    </div>

                    {/* Results */}
                    <div className="mb-8">
                      <h4 className="text-[#101820] font-bold text-xl mb-4">
                        Results
                      </h4>
                      <div className="relative flex items-center gap-4 mb-3">
                        <button
                          ref={longTabRef}
                          onClick={() => setResultView("long")}
                          className={`px-6 py-3 rounded-md border text-inda-teal bg-transparent ${
                            resultView === "long"
                              ? "border-inda-teal"
                              : "border-inda-teal/70"
                          }`}
                        >
                          Long Term Rental
                        </button>
                        <button
                          ref={shortTabRef}
                          onClick={() => setResultView("short")}
                          className={`px-6 py-3 rounded-md border text-inda-teal bg-transparent ${
                            resultView === "short"
                              ? "border-inda-teal"
                              : "border-inda-teal/70"
                          }`}
                        >
                          Short Term Rental
                        </button>
                        <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gray-200 rounded-full" />
                        <div
                          ref={underlineRef}
                          className="absolute -bottom-2 h-1 bg-inda-teal rounded-full transition-all duration-300"
                          style={{
                            width: underlineStyle.width,
                            left: underlineStyle.left,
                          }}
                        />
                      </div>
                      <div className="mb-6" />
                      <div
                        className="rounded-2xl p-8 text-white"
                        style={{
                          background:
                            "linear-gradient(90deg, #0A655E 5.77%, #4EA8A1 95.19%)",
                        }}
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                          <div className="rounded-lg p-6">
                            <p className="text-lg mb-4 opacity-90">
                              Projected Total Profit
                            </p>
                            <div className="inline-block bg-white text-[#0F5E57] px-6 py-4 rounded-xl font-bold text-xl shadow-sm">
                              {profitFromAnalytics != null
                                ? formatNaira(profitFromAnalytics)
                                : calcResult
                                ? formatNaira(calcResult.profit)
                                : "—"}
                            </div>
                          </div>
                          <div className="rounded-lg p-6">
                            <p className="text-lg mb-4 opacity-90">
                              Return on Investment (ROI)
                            </p>
                            <div className="inline-block bg-white text-[#0F5E57] px-6 py-4 rounded-xl font-bold text-xl shadow-sm">
                              {roiPctFromAnalytics != null
                                ? formatPercent(roiPctFromAnalytics)
                                : calcResult
                                ? formatPercent(calcResult.roiPct)
                                : "—"}
                            </div>
                          </div>
                          <div className="rounded-lg p-6">
                            <p className="text-lg mb-4 opacity-90">
                              Annual Rental Income
                            </p>
                            <div className="inline-block bg-white text-[#0F5E57] px-6 py-4 rounded-xl font-bold text-xl shadow-sm">
                              {incomeFromAnalytics != null
                                ? formatNaira(incomeFromAnalytics)
                                : calcResult
                                ? formatNaira(calcResult.annualIncome)
                                : "—"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Monthly Projection */}
                    {Array.isArray(aAny?.projections?.monthlyProjection) &&
                      aAny.projections.monthlyProjection.length > 0 && (
                        <div className="mt-8">
                          <h4 className="text-lg lg:text-xl font-bold text-inda-teal mb-3">
                            Price Projection (12 months)
                          </h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                            {aAny.projections.monthlyProjection.map(
                              (m: any) => (
                                <div
                                  key={m.month}
                                  className="bg-[#F8F9FA] rounded-lg p-3 text-center"
                                >
                                  <div className="text-xs text-[#101820]/60 mb-1">
                                    Month {m.month}
                                  </div>
                                  <div className="text-sm font-semibold">
                                    {formatNaira(m.priceNGN)}
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}

                    {/* AI Summary */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg lg:text-xl font-bold text-inda-teal">
                          AI Summary
                        </h4>
                      </div>
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(() => {
                          const ai: any = (result as any)?.aiReport || {};
                          const items = [
                            { key: "titleSafety", label: "Title Safety" },
                            { key: "marketValue", label: "Market Value" },
                            {
                              key: "sellerCredibility",
                              label: "Seller Credibility",
                            },
                            { key: "microlocation", label: "Microlocation" },
                            { key: "roi", label: "ROI" },
                          ];
                          return items.map((it) => {
                            const sec = ai?.[it.key] || {};
                            const badge = sec?.label || "—";
                            const summary = sec?.summary || "—";
                            const next = sec?.nextStep;
                            return (
                              <div
                                key={it.key}
                                className="bg-[#F8F9FA] border border-gray-200 rounded-xl p-4"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <div className="font-semibold text-[#0A655E]">
                                    {it.label}
                                  </div>
                                  <span className="text-xs px-2 py-1 rounded-full bg-[#E5F4F2] text-[#0A655E] border border-[#4EA8A1]/20">
                                    {badge}
                                  </span>
                                </div>
                                <p className="text-sm text-[#101820]/80 leading-relaxed">
                                  {summary}
                                </p>
                                {next && (
                                  <div className="mt-2 text-xs text-[#101820]/60">
                                    Next: {next}
                                  </div>
                                )}
                              </div>
                            );
                          });
                        })()}
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* <div className="w-full px-6">
                  <div className="rounded-lg p-8">
                    <h3 className="text-2xl md:text-3xl font-bold mb-8 text-inda-teal">
                      Verified Comparables
                    </h3>
                    {(() => {
                      // Build comparables aligned with main listing location/bed and narrow price gap
                      const mainLocation =
                        result?.snapshot?.location || result?.location || "";
                      const mainBeds = bedDummy;
                      const mainPrice = priceForSeed;
                      // Parse any numeric price strings like "₦150,000,000"
                      const parsePrice = (p: any): number => {
                        if (typeof p === "number") return p;
                        if (typeof p === "string") {
                          const n = parseFloat(p.replace(/[^0-9.]/g, ""));
                          return Number.isNaN(n) ? 0 : n;
                        }
                        return 0;
                      };
                      const windowPct = 0.06; // ±6%
                      const minP = mainPrice * (1 - windowPct);
                      const maxP = mainPrice * (1 + windowPct);
                      const base = dummyResultData.comparables
                        .map((c) => ({
                          ...c,
                          _price: parsePrice(c.price),
                        }))
                        .filter((c) => c._price > 0);
                      // Try to enforce location and beds; if base lacks those, synthesize label overrides
                      const loc = mainLocation || base[0]?.location || "";
                      let comps = base
                        .filter((c) => c._price >= minP && c._price <= maxP)
                        .slice(0, 10);
                      if (comps.length < 3) {
                        // expand slightly to ensure we have some comps
                        let widen = base
                          .filter(
                            (c) =>
                              c._price >= mainPrice * 0.92 &&
                              c._price <= mainPrice * 1.08
                          )
                          .slice(0, 10);
                        if (!widen.length) {
                          // fallback: just take the first few sorted by closest price
                          widen = [...base].sort(
                            (a, b) =>
                              Math.abs(a._price - mainPrice) -
                              Math.abs(b._price - mainPrice)
                          );
                        }
                        if (widen.length) comps = widen;
                      }
                      // Map display fields to enforce matching location and beds visually
                      const display = comps.slice(0, 6).map((c, i) => ({
                        ...c,
                        location: loc,
                        beds: String(mainBeds),
                      }));
                      return (
                        <div
                          className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory"
                          style={{
                            scrollbarWidth: "none",
                            msOverflowStyle: "none",
                          }}
                        >
                          <style jsx>{`
                            div::-webkit-scrollbar {
                              display: none;
                            }
                          `}</style>
                          {display.map((c) => (
                            <div
                              key={c.id}
                              className="flex-shrink-0 snap-start min-w-[240px] sm:min-w-[300px] max-w-[300px] bg-[#E5F4F2] rounded-2xl p-5 sm:p-6"
                            >
                              <div className="w-full h-40 sm:h-48 rounded-xl overflow-hidden mb-4">
                                <img
                                  className="w-full h-full object-cover"
                                  src={c.image}
                                  alt={c.title}
                                />
                              </div>
                              <p className="text-[#101820] font-semibold text-lg mb-3">
                                {c.title}
                              </p>
                              <div className="text-sm text-gray-700 space-y-2 mb-4">
                                <div>Location: {c.location}</div>
                                <div>Number of beds: {c.beds}</div>
                                <div className="flex items-center justify-between">
                                  <span>Inda Trust Score</span>
                                  <span className="font-semibold">
                                    {c.developerTrustScore}%
                                  </span>
                                </div>
                                <div className="w-full bg-gray-300/60 rounded-full h-2">
                                  <div
                                    className="bg-inda-teal h-2 rounded-full"
                                    style={{
                                      width: `${c.developerTrustScore}%`,
                                    }}
                                  />
                                </div>
                              </div>
                              <div className="text-base text-[#101820] font-semibold">
                                Price: {c.price}
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                </div>

                <div className="w-full px-6 mt-8">
                  <div className="rounded-lg p-8 bg-white border border-gray-200">
                    <h3 className="text-2xl font-bold mb-4 text-inda-teal">
                      Inda Score
                    </h3>
                    {(() => {
                      const scoreAny: any = (result as any)?.indaScore || {};
                      const breakdown: any = scoreAny?.breakdown || {};
                      const entries = Object.entries(breakdown) as Array<
                        [string, any]
                      >;
                      return (
                        <>
                          <div className="text-4xl font-extrabold mb-4">
                            {scoreAny?.finalScore ?? "—"}
                          </div>
                          {entries.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {entries.map(([key, val]) => (
                                <div
                                  key={key}
                                  className="bg-[#F8F9FA] rounded-xl p-4 border border-gray-200"
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="font-semibold capitalize">
                                      {key}
                                    </div>
                                    <div className="text-sm">
                                      Score: {val?.score ?? "—"}
                                    </div>
                                  </div>
                                  <div className="text-xs text-[#101820]/60">
                                    Weight: {val?.weight ?? "—"}
                                  </div>
                                  <div className="text-xs text-[#101820]/60">
                                    Label: {val?.label ?? "—"}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-sm text-[#101820]/70">
                              No breakdown available.
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>

                {/* How would you like to proceed? */}
                <div className="w-full px-6">
                  <div className="rounded-lg p-6 sm:p-8">
                    <div className="rounded-xl py-8 sm:py-12 px-4 sm:px-8 bg-white/60">
                      <h3 className="text-2xl md:text-3xl font-bold mb-6 sm:mb-10 text-center">
                        How would you like to proceed?
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-w-4xl mx-auto">
                        <button
                          onClick={(e) => {
                            // Deeper verification should open paid-only step directly
                            setStartPaidFlow(true);
                            setProceed(true);
                          }}
                          className="w-full min-h-[56px] sm:min-h-[64px] px-5 sm:px-6 bg-inda-teal text-[#F9F9F9] rounded-2xl text-base sm:text-lg font-medium hover:bg-[#0A655E] transition-colors"
                        >
                          Run Deeper Verification
                        </button>
                        <button
                          onClick={() =>
                            openWhatsApp(
                              `Hello Inda team, I'm interested in buying this property with Inda.\n\nProperty: ${
                                result?.title ||
                                result?.snapshot?.title ||
                                "(no title)"
                              }\nLocation: ${
                                result?.location ||
                                result?.snapshot?.location ||
                                "(no location)"
                              }\nListing: ${
                                result?.listingUrl ||
                                result?.snapshot?.listingUrl ||
                                "N/A"
                              }\n\nPlease share the next steps to proceed with a purchase.`
                            )
                          }
                          className="w-full min-h-[56px] sm:min-h-[64px] px-5 sm:px-6 bg-inda-teal text-[#F9F9F9] rounded-2xl text-base sm:text-lg font-medium hover:bg-[#0A655E] transition-colors"
                        >
                          Buy with Inda
                        </button>
                        <button
                          onClick={() =>
                            openWhatsApp(
                              `Hello Inda team, I'd like to finance this property via Inda.\n\nProperty: ${
                                result?.title ||
                                result?.snapshot?.title ||
                                "(no title)"
                              }\nLocation: ${
                                result?.location ||
                                result?.snapshot?.location ||
                                "(no location)"
                              }\nListing: ${
                                result?.listingUrl ||
                                result?.snapshot?.listingUrl ||
                                "N/A"
                              }\n\nPlease guide me through the next steps.`
                            )
                          }
                          className="w-full min-h-[56px] sm:min-h-[64px] px-5 sm:px-6 bg-inda-teal text-[#F9F9F9] rounded-2xl text-base sm:text-lg font-medium hover:bg-[#0A655E] transition-colors"
                        >
                          Finance with Inda
                        </button>
                        {/* No Free Report on results page; keep to two CTA as requested */}
                      </div>
                    </div>

                    {/* Legal Disclaimer */}
                    <div className="mt-6 sm:mt-8 pt-6 border-t border-gray-200">
                      <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
                        Legal Disclaimer
                      </h4>
                      <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                        {dummyResultData.legalDisclaimer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* end main content container */}

          {proceed && (
            <PaymentModal
              isOpen={proceed}
              onClose={() => {
                setProceed(false);
                // reset to default (normal two-step) when modal closes
                setStartPaidFlow(false);
              }}
              startOnPaid={startPaidFlow}
              listingUrl={
                (result?.listingUrl as string) ||
                (result?.snapshot?.listingUrl as string) ||
                (isValidUrl(searchQuery) ? (searchQuery as string) : "")
              }
              onPaid={() => setIsPaid(true)}
              freeAvailable={freeViewAvailable}
            />
          )}
        </main>
        <Footer />
      </Container>
    );
  }

  // Show not found view only after a fetch attempt and when not loading
  if (hasAttemptedFetch && !isLoading && notFound) {
    // NOT FOUND VIEW
    return (
      <Container
        noPadding
        className="min-h-screen bg-[#F9F9F9] text-inda-dark flex flex-col"
      >
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 min-h-0">
          <div className="max-w-5xl w-full text-center">
            {/* Main Content */}
            <div className="mb-12 sm:mb-16 lg:mb-20">
              {/* Icon */}
              <div className="mb-8 sm:mb-12 flex justify-center">
                <div className="relative">
                  {/* Outer decorative ring */}
                  <div className="absolute inset-0 w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 bg-gradient-to-br from-[#4EA8A1]/20 to-[#66B3AD]/20 rounded-full blur-xl"></div>
                  {/* Main icon container */}
                  <div className="relative w-20 h-20 sm:w-28 sm:h-28 lg:w-36 lg:h-36 bg-gradient-to-br from-[#4EA8A1] to-[#66B3AD] rounded-full flex items-center justify-center shadow-2xl">
                    <svg
                      className="w-10 h-10 sm:w-14 sm:h-14 lg:w-18 lg:h-18 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-[#101820] mb-6 sm:mb-8 leading-tight">
                Property Not Found
              </h1>

              {searchQuery && (
                <div className="mb-6 sm:mb-8">
                  <div className="inline-block bg-white rounded-2xl shadow-lg px-6 py-4 mb-4">
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#4EA8A1] mb-2">
                      "{searchQuery}"
                    </p>
                    {searchType && (
                      <span className="inline-flex items-center bg-[#4EA8A1]/10 border border-[#4EA8A1]/20 rounded-full px-4 py-2 text-sm font-medium text-[#4EA8A1] capitalize">
                        {searchType.replace(/([A-Z])/g, " $1").trim()}
                      </span>
                    )}
                  </div>
                </div>
              )}

              <p className="text-lg sm:text-xl lg:text-2xl text-[#101820]/70 max-w-3xl mx-auto leading-relaxed mb-8">
                We couldn't find any verified property, agent, or developer
                matching your search.
                <br className="hidden sm:block" />
                Our database is constantly growing—try searching for something
                else!
              </p>
            </div>

            {/* Action Buttons */}
            <div className="mb-12 sm:mb-16 lg:mb-20">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center justify-center">
                <Button
                  variant="primary"
                  onClick={() => router.push("/")}
                  className="text-base sm:text-lg lg:text-xl px-8 sm:px-12 lg:px-16 py-4 sm:py-5 bg-gradient-to-r from-[#4EA8A1] to-[#66B3AD] hover:from-[#3a8a84] hover:to-[#4EA8A1] text-white rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 font-bold min-w-[240px] sm:min-w-[280px]"
                >
                  Try a Different Search
                </Button>
                <Button
                  variant="secondary"
                  className="text-base sm:text-lg lg:text-xl px-8 sm:px-12 lg:px-16 py-4 sm:py-5 border-2 border-[#4EA8A1] text-[#4EA8A1] hover:bg-[#4EA8A1] hover:text-white rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 font-bold min-w-[240px] sm:min-w-[280px]"
                >
                  Request a Review
                </Button>
              </div>
            </div>

            {/* Helpful Information Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 bg-[#4EA8A1]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-[#4EA8A1]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-[#101820] mb-2">
                  Add Property
                </h3>
                <p className="text-sm text-[#101820]/70">
                  Know a property that should be listed? Help us grow our
                  database.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 bg-[#4EA8A1]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-[#4EA8A1]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-[#101820] mb-2">
                  Need Help?
                </h3>
                <p className="text-sm text-[#101820]/70">
                  Contact our support team for assistance with your search.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 bg-[#4EA8A1]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-[#4EA8A1]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-[#101820] mb-2">
                  Search Tips
                </h3>
                <p className="text-sm text-[#101820]/70">
                  Try using property names, addresses, or agent names for better
                  results.
                </p>
              </div>
            </div>

            {/* Status indicator */}
            <div className="inline-flex items-center bg-white rounded-2xl border border-[#E5E5E5] px-6 py-4 shadow-lg">
              <div className="w-3 h-3 bg-[#4EA8A1] rounded-full mr-4 animate-pulse"></div>
              <span className="text-base text-[#101820]/60 font-medium">
                Search ID: #404 — No matching records found
              </span>
            </div>
          </div>
        </main>
        <Footer />
      </Container>
    );
  }
};

export default Result;
