import { getComputedListingByUrl } from "@/api/listings";
import { getFreeViewStatus, hasPaid, verifyPayment } from "@/api/payments";
import { Container, Footer, Navbar } from "@/components";
import PaymentModal from "@/components/inc/PaymentModal";
import { useAuth } from "@/contexts/AuthContext";
import { ComputedListing } from "@/types/listing";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import {
  AISummaryBlocks,
  AmenitiesSection,
  DataCoverageModal,
  DemandInsights,
  Disclaimer,
  ExecutiveSummary,
  FeedbackComplaints,
  FinalIndaScore,
  GallerySection,
  LoadingScreen,
  MapInsights,
  NotFoundScreen,
  PriceAnalysis,
  ProceedActions,
  ROICalculator,
  SellerCredibility,
  ShareReport,
  SmartSummary,
  TrustScoreBar,
  VerifiedComparables
} from "./sections";

type SelectedBar = null | { series: "fmv" | "price"; index: number };

const isValidUrl = (value: string) => {
  try {
    const u = new URL(value.trim());
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
};

const formatNaira = (n: number) =>
  `₦${Math.round(n || 0).toLocaleString(undefined, {
    maximumFractionDigits: 0,
  })}`;
const formatPercent = (n: number) => `${Number(n || 0).toFixed(1)}%`;

const getRelativeTime = (timestamp?: number | string | Date): string => {
  if (!timestamp) return "just now";
  
  const now = Date.now();
  const then = typeof timestamp === "number" 
    ? timestamp 
    : new Date(timestamp).getTime();
  
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);
  
  if (diffMins < 1) return "a few moments ago";
  if (diffMins === 1) return "a minute ago";
  if (diffMins < 5) return "a few minutes ago";
  if (diffMins < 60) return `${diffMins} minutes ago`;
  if (diffHours === 1) return "an hour ago";
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays === 0) return "today";
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 14) return "a week ago";
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffMonths === 1) return "a month ago";
  if (diffMonths < 12) return `${diffMonths} months ago`;
  if (diffYears === 1) return "a year ago";
  
  return `${diffYears} years ago`;
};

// Calculate data points captured from the listing
const calculateDataPoints = (data: ComputedListing): number => {
  console.log("=== calculateDataPoints called ===");
  console.log("data:", data);
  
  let points = 0;
  const snapshot = data?.snapshot;
  const analytics = (data as any)?.analytics;
  const aiReport = (data as any)?.aiReport;
  
  console.log("snapshot:", snapshot);
  console.log("analytics:", analytics);
  console.log("aiReport:", aiReport);
  
  // Snapshot fields (each worth 5 points)
  if (snapshot?.title) points += 5;
  if (snapshot?.priceNGN) points += 5;
  if (snapshot?.bedrooms) points += 5;
  if (snapshot?.bathrooms) points += 5;
  if (snapshot?.sizeSqm) points += 5;
  if (snapshot?.propertyTypeStd) points += 5;
  if (snapshot?.microlocationStd) points += 5;
  if (snapshot?.agentName || snapshot?.agentCompanyName) points += 5;
  if (snapshot?.imageUrls && snapshot.imageUrls.length > 0) points += 10;
  if (snapshot?.description) points += 10;
  if ((snapshot as any)?.amenities && (snapshot as any).amenities.length > 0) points += 10;
  
  console.log("Points after snapshot fields:", points);
  
  // Analytics fields (each worth 10 points)
  if (analytics?.market?.fairValueNGN) points += 10;
  if (analytics?.market?.historyMonthly && analytics.market.historyMonthly.length > 0) points += 15;
  if (analytics?.price?.priceVsFmvPct) points += 10;
  if (analytics?.seller?.sellerCredibilityScore) points += 10;
  if (analytics?.yields?.longTermPct) points += 10;
  if (analytics?.yields?.shortTermPct) points += 10;
  
  console.log("Points after analytics fields:", points);
  
  // AI Report fields (each worth 15 points)
  if (aiReport?.marketValue?.summary) points += 15;
  if (aiReport?.sellerCredibility?.summary) points += 15;
  if (aiReport?.microlocation?.summary) points += 15;
  if (aiReport?.roi?.summary) points += 15;
  
  console.log("Points after aiReport fields:", points);
  
  // Inda Score fields (worth 20 points)
  if (data?.indaScore?.finalScore) points += 20;
  if (data?.indaScore?.breakdown) points += 20;
  
  console.log("Points after indaScore fields:", points);
  
  // Reviews (worth 10 points)
  if ((data as any)?.totalReviews) points += 10;
  if ((data as any)?.reviews && (data as any).reviews.length > 0) points += 10;
  
  const finalPoints = Math.min(points, 500);
  console.log("Final points (capped at 500):", finalPoints);
  
  return finalPoints;
};

const ResultPage: React.FC = () => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  // Query
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("");

  // Loading/not-found
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);
  const [notFound, setNotFound] = useState(false);

  // Data
  const [result, setResult] = useState<ComputedListing | null>(null);

  // Payment gating
  const [freeViewAvailable, setFreeViewAvailable] = useState<boolean>(false);
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [proceed, setProceed] = useState(false);
  const [startPaidFlow, setStartPaidFlow] = useState(false);

  // Data coverage modal
  const [showDataCoverageModal, setShowDataCoverageModal] = useState(false);
  const [dataPoints, setDataPoints] = useState(0);

  // Trust score animation
  const [trustScore, setTrustScore] = useState<number | null>(null);
  const [displayScore, setDisplayScore] = useState<number>(0);

  // Charts
  const [chartMonths, setChartMonths] = useState<string[]>([]);
  const [chartFMV, setChartFMV] = useState<number[]>([]);
  const [chartPriceSeries, setChartPriceSeries] = useState<number[]>([]);
  const [chartWindowLabel, setChartWindowLabel] = useState<string>("");
  const [last6ChangePct, setLast6ChangePct] = useState<number>(0);
  const [marketPositionPct, setMarketPositionPct] = useState<number>(0);
  const [selectedBar, setSelectedBar] = useState<SelectedBar>(null);

  // Collapsibles
  const [isPriceSummaryOpen, setIsPriceSummaryOpen] = useState(true);
  const [isLocationSummaryOpen, setIsLocationSummaryOpen] = useState(false);

  // ROI calculator state
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

  const [roiValues, setROIValues] = useState<Record<ROIFieldKey, number>>({
    purchasePrice: 0,
    financingRate: 0,
    financingTenureYears: 0,
    holdingPeriodYears: 0,
    yieldLong: 0,
    yieldShort: 0,
    expensePct: 0,
    appreciationLocalNominal: 0,
    appreciationLocalReal: 0,
    appreciationUsdAdj: 0,
  });
  const [editedFields, setEditedFields] = useState<
    Partial<Record<ROIFieldKey, boolean>>
  >({});
  const [openROIInfo, setOpenROIInfo] = useState<ROIFieldKey | null>(null);
  const [editingROIField, setEditingROIField] = useState<ROIFieldKey | null>(
    null
  );
  const [isCalculating, setIsCalculating] = useState(false);
  const [calcResult, setCalcResult] = useState<{
    profit: number;
    roiPct: number;
    annualIncome: number;
  } | null>(null);
  const [resultView, setResultView] = useState<"long" | "short">("long");
  const longTabRef = useRef<HTMLButtonElement>(null);
  const shortTabRef = useRef<HTMLButtonElement>(null);
  const [underlineStyle, setUnderlineStyle] = useState({ width: 0, left: 0 });
  const [appreciationTab, setAppreciationTab] = useState<
    "localNominal" | "localReal" | "usdAdj"
  >("localNominal");

  const roiFieldInfo: Record<ROIFieldKey, string> = {
    purchasePrice: "Price you pay for the property.",
    financingRate: "Annual interest rate for your financing (if any).",
    financingTenureYears: "Number of years to repay your financing.",
    holdingPeriodYears: "How long you plan to hold the asset.",
    yieldLong: "Expected annual rental yield for long-term rental.",
    yieldShort: "Expected annual rental yield for short-term rental.",
    expensePct: "Share of rental income spent on expenses (maintenance, fees).",
    appreciationLocalNominal:
      "Annual price growth in local currency (nominal).",
    appreciationLocalReal:
      "Annual price growth in local currency after inflation.",
    appreciationUsdAdj:
      "Annual price growth adjusted for FX + inflation into USD.",
  };

  const updateROIValue = (key: ROIFieldKey, raw: string | number) => {
    const val =
      typeof raw === "string"
        ? Number(raw.replace(/[^0-9.]/g, ""))
        : Number(raw);
    setROIValues((v) => ({ ...v, [key]: Number.isFinite(val) ? val : 0 }));
    setEditedFields((f) => ({ ...f, [key]: true }));
  };

  const handleCalculate = () => {
    if (isCalculating) return;
    setIsCalculating(true);
    setOpenROIInfo(null);
    setEditingROIField(null);
    setTimeout(() => {
      const price = roiValues.purchasePrice || 0;
      const incomePct =
        (resultView === "long" ? roiValues.yieldLong : roiValues.yieldShort) ||
        0;
      const expensesPct = roiValues.expensePct || 0;
      const netPct = Math.max(0, incomePct - expensesPct);
      const annualIncome = (price * netPct) / 100;
      const profit =
        annualIncome * Math.max(1, roiValues.holdingPeriodYears || 1);
      const roiPct = price > 0 ? (profit / price) * 100 : 0;
      setCalcResult({ profit, roiPct, annualIncome });
      setIsCalculating(false);
    }, 600);
  };

  // Payment helpers
  useEffect(() => {
    if (!router.isReady) return;
    getFreeViewStatus()
      .then((st) => setFreeViewAvailable(!!st?.freeViewAvailable))
      .catch(() => setFreeViewAvailable(false));
  }, [router.isReady]);

  // Verify payment on callback
  useEffect(() => {
    if (!router.isReady) return;
    const ref = (router.query["reference"] as string) || "";
    if (ref) {
      verifyPayment(ref)
        .then(() => setIsPaid(true))
        .catch(() => {})
        .finally(() => {
          // Clean reference from URL
          const { q, type } = router.query;
          router.replace(
            { pathname: router.pathname, query: { q, type } },
            undefined,
            { shallow: true }
          );
        });
    }
  }, [router.isReady, router.query]);

  // Fetch listing and pre-check payment
  useEffect(() => {
    if (!router.isReady) return;
    const { q, type } = router.query;
    const query = (q as string) || "";
    setSearchQuery(query);
    setSearchType((type as string) || "");

   // Redirect unauthenticated users to signup, preserving the intended instant report
    if (query && (type as string) === "link" && !isAuthenticated) {
      router.replace(`/auth/signup?q=${encodeURIComponent(query)}&type=link`);
      return;
    }

    if (query && (type as string) === "link" && isValidUrl(query)) {
      setIsLoading(true);
      setHasAttemptedFetch(true);
      const timers = [
        setTimeout(() => setCurrentStep(1), 1200),
        setTimeout(() => setCurrentStep(2), 2400),
        setTimeout(() => setCurrentStep(3), 3600),
      ];
      // Instant reports are free for authenticated users
      if (isAuthenticated) {
        setIsPaid(true);
        getComputedListingByUrl(query)
          .then((res) => {
            const data = res || null;
            if (!data) {
              setResult(null);
              setNotFound(true);
            } else {
              setResult(data);
              setNotFound(false);
              // Calculate data points captured
              const points = calculateDataPoints(data);
              console.log("Setting dataPoints to:", points);
              setDataPoints(points);
              // Show data coverage modal
              console.log("Opening data coverage modal");
              setShowDataCoverageModal(true);
            }
          })
          .catch(() => {
            setResult(null);
            setNotFound(true);
          })
          .finally(() => {
            setIsLoading(false);
            timers.forEach(clearTimeout);
          });
      } else {
        // Fallback: unauthenticated flow still checks payment status
        hasPaid(query, "instant")
          .then((p) => setIsPaid(!!p?.paid))
          .catch(() => setIsPaid(false))
          .finally(() => {
            getComputedListingByUrl(query)
              .then((res) => {
                const data = res || null;
                if (!data) {
                  setResult(null);
                  setNotFound(true);
                } else {
                  setResult(data);
                  setNotFound(false);
                  // Calculate data points captured
                  const points = calculateDataPoints(data);
                  console.log("Setting dataPoints to:", points);
                  setDataPoints(points);
                  // Show data coverage modal
                  console.log("Opening data coverage modal");
                  setShowDataCoverageModal(true);
                }
              })
              .catch(() => {
                setResult(null);
                setNotFound(true);
              })
              .finally(() => {
                setIsLoading(false);
                timers.forEach(clearTimeout);
              });
          });
      }
    } else if (query) {
      setResult(null);
      setNotFound(true);
      setIsLoading(false);
      setHasAttemptedFetch(true);
    }
  }, [router.isReady, router.query]);

  // Populate trust score and ROI defaults when result loads
  useEffect(() => {
    if (!result) return;
    const s =
      (result as any)?.indaScore?.finalScore ??
      (result as any)?.indaTrustScore ??
      null;
    setTrustScore(typeof s === "number" ? Math.max(0, Math.min(100, s)) : null);
    setDisplayScore(0);

    const price =
      result?.snapshot?.priceNGN ??
      (result as any)?.analytics?.market?.purchasePrice ??
      0;
    const holding =
      (result as any)?.analytics?.holding?.holdingPeriodYears ?? 3;
    const financingRate =
      (result as any)?.analytics?.financing?.interestRatePct ?? 0;
    const tenor = (result as any)?.analytics?.financing?.tenorYearsDefault ?? 0;
    const yLong = (result as any)?.analytics?.yields?.longTermPct ?? 0;
    const yShort = (result as any)?.analytics?.yields?.shortTermPct ?? 0;
    const expPct = (result as any)?.analytics?.expenses?.totalExpensesPct ?? 0;
    const apprNom = (result as any)?.analytics?.appreciation?.nominalPct ?? 0;
    const apprReal =
      (result as any)?.analytics?.appreciation?.realPct ?? apprNom;
    const apprUsd =
      (result as any)?.analytics?.appreciation?.usdFxInflAdjPct ?? apprReal;
    setROIValues({
      purchasePrice: Number(price) || 0,
      financingRate: Number(financingRate) || 0,
      financingTenureYears: Number(tenor) || 0,
      holdingPeriodYears: Number(holding) || 0,
      yieldLong: Number(yLong) || 0,
      yieldShort: Number(yShort) || 0,
      expensePct: Number(expPct) || 0,
      appreciationLocalNominal: Number(apprNom) || 0,
      appreciationLocalReal: Number(apprReal) || 0,
      appreciationUsdAdj: Number(apprUsd) || 0,
    });
  }, [result]);

  // Animate trust score
  useEffect(() => {
    if (trustScore == null) return;
    let raf: number;
    const start = performance.now();
    const animate = (now: number) => {
      const t = Math.min(1, (now - start) / 1200);
      const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; // easeInOut
      const val = Math.round((trustScore as number) * eased);
      setDisplayScore(val);
      if (t < 1) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [trustScore]);

  // Populate chart data from API if available (robust to different shapes)
  useEffect(() => {
    if (!result) {
      setChartMonths([]);
      setChartWindowLabel("");
      setChartFMV([]);
      setChartPriceSeries([]);
      setLast6ChangePct(0);
      setMarketPositionPct(0);
      return;
    }
    const price =
      result?.snapshot?.priceNGN ??
      (result as any)?.analytics?.market?.purchasePrice ??
      null;
    const fmvApi =
      (result as any)?.analytics?.market?.fairValueNGN ??
      (result as any)?.aiReport?.marketValue?.fairValueNGN ??
      (result as any)?.aiReport?.marketValue?.fairValue ??
      null;

    // Gather possible history arrays from known API shapes
    const histCandidates: any[][] = [
      ((result as any)?.analytics?.price?.historyMonthly as any[]) || [],
      ((result as any)?.analytics?.market?.historyMonthly as any[]) || [],
      ((result as any)?.analytics?.historyMonthly as any[]) || [],
      ((result as any)?.aiReport?.marketValue?.history as any[]) || [],
    ];
    const hist =
      histCandidates.find((arr) => Array.isArray(arr) && arr.length >= 2) || [];

    if (hist.length >= 2) {
      const lastN = hist.slice(-12);
      const months = lastN.map((h) => {
        const m = (h as any).monthLabel ?? (h as any).month;
        if (typeof m === "string" && m) return m;
        const ts = (h as any).timestamp ?? (h as any).date;
        if (typeof ts === "number") {
          const d = new Date(ts);
          return `${d.toLocaleString(undefined, {
            month: "short",
          })} ${d.getFullYear()}`;
        }
        return "";
      });
      const fmvSeries = lastN.map((h) =>
        Number(
          (h as any).fmv ??
            (h as any).fmvNGN ??
            (h as any).fairValueNGN ??
            (h as any).fairValue ??
            0
        )
      );
      const priceSeries = lastN.map((h) =>
        Number(
          (h as any).price ??
            (h as any).priceNGN ??
            (h as any).listPrice ??
            (h as any).askingPriceNGN ??
            0
        )
      );

      // Change over last 6 months (or best available window)
      const lastIdx = fmvSeries.length - 1;
      const baseIdx = Math.max(0, lastIdx - 6);
      const baseVal = fmvSeries[baseIdx] || fmvSeries[0] || 0;
      const lastVal = fmvSeries[lastIdx] || baseVal;
      const change6 = baseVal > 0 ? ((lastVal - baseVal) / baseVal) * 100 : 0;

      // Market position: compare price to FMV (prefer explicit API FMV else latest FMV in history)
      const fmvForMarket =
        typeof fmvApi === "number" ? fmvApi : lastVal > 0 ? lastVal : null;
      const marketPct = fmvForMarket
        ? (((price ?? 0) - fmvForMarket) / fmvForMarket) * 100
        : 0;

      setChartMonths(months.map((m) => String(m)));
      setChartWindowLabel(`${months[0]} - ${months[months.length - 1]}`);
      setChartFMV(fmvSeries.map((n) => Math.max(0, Math.round(n))));
      setChartPriceSeries(priceSeries.map((n) => Math.max(0, Math.round(n))));
      setLast6ChangePct(change6);
      setMarketPositionPct(marketPct);
    } else {
      // Fallback: synthesize a 12‑month series based on current price with FMV in ±20% band
      if (typeof price === "number" && price > 0) {
        const now = new Date();
        const months: string[] = [];
        for (let i = 11; i >= 0; i--) {
          const d = new Date(now);
          d.setMonth(d.getMonth() - i);
          months.push(
            `${d.toLocaleString(undefined, {
              month: "short",
            })} ${d.getFullYear()}`
          );
        }
        const priceSeries = Array.from({ length: 12 }, () =>
          Math.max(0, Math.round(price))
        );
        const fmvSeries = Array.from({ length: 12 }, () => {
          const factor = 0.8 + Math.random() * 0.4; // 0.8..1.2
          return Math.max(0, Math.round(price * factor));
        });

        const lastIdx = fmvSeries.length - 1;
        const baseIdx = Math.max(0, lastIdx - 6);
        const baseVal = fmvSeries[baseIdx] || fmvSeries[0] || 0;
        const lastVal = fmvSeries[lastIdx] || baseVal;
        const change6 = baseVal > 0 ? ((lastVal - baseVal) / baseVal) * 100 : 0;
        const marketPct =
          lastVal > 0 ? (((price ?? 0) - lastVal) / lastVal) * 100 : 0;

        setChartMonths(months);
        setChartWindowLabel(`${months[0]} - ${months[months.length - 1]}`);
        setChartFMV(fmvSeries);
        setChartPriceSeries(priceSeries);
        setLast6ChangePct(change6);
        setMarketPositionPct(marketPct);
      } else {
        setChartMonths([]);
        setChartWindowLabel("");
        setChartFMV([]);
        setChartPriceSeries([]);
        setLast6ChangePct(0);
        setMarketPositionPct(0);
      }
    }
  }, [result]);

  // Move underline indicator for ROI tabs
  useEffect(() => {
    const el = resultView === "long" ? longTabRef.current : shortTabRef.current;
    const parent = longTabRef.current?.parentElement;
    if (el && parent) {
      const rect = el.getBoundingClientRect();
      const parentRect = parent.getBoundingClientRect();
      setUnderlineStyle({
        width: rect.width,
        left: rect.left - parentRect.left,
      });
    }
  }, [resultView, longTabRef.current, shortTabRef.current]);

  const toQuarterLabel = (d: Date) => {
    const q = Math.floor(d.getMonth() / 3) + 1;
    return `Q${q} ${d.getFullYear()}`;
  };
  const isValidDateObj = (d: Date) => !Number.isNaN(d.getTime());

  const openWhatsApp = (text: string) => {
    const phone =
      process.env.NEXT_PUBLIC_WHATSAPP_JOSHUA ||
      process.env.NEXT_PUBLIC_INDA_WHATSAPP ||
      "2348102544302";
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    if (typeof window !== "undefined") window.open(url, "_blank");
  };

  if (isLoading) {
    return <LoadingScreen currentStep={currentStep} />;
  }

  if (hasAttemptedFetch && !isLoading && notFound) {
    return <NotFoundScreen searchQuery={searchQuery} searchType={searchType} />;
  }

  // Main render when result exists
  if (result) {
    const price =
      result?.snapshot?.priceNGN ?? result?.analytics?.market?.purchasePrice;
    const fairValue =
      (result as any)?.analytics?.market?.fairValueNGN ??
      (result as any)?.aiReport?.marketValue?.fairValueNGN ??
      (result as any)?.aiReport?.marketValue?.fairValue ??
      null;

    const deliveryLabel = (() => {
      const rawDelivery: any =
        (result?.snapshot as any)?.deliveryDate ||
        (result?.snapshot as any)?.expectedDeliveryDate ||
        (result as any)?.deliveryDate ||
        (result as any)?.expectedDeliveryDate ||
        (result as any)?.aiReport?.delivery?.expectedDate ||
        (result as any)?.aiReport?.timeline?.deliveryDate ||
        null;
      let label = "—";
      if (rawDelivery) {
        if (typeof rawDelivery === "string") {
          const parsed = new Date(rawDelivery);
          label = isValidDateObj(parsed)
            ? toQuarterLabel(parsed)
            : String(rawDelivery);
        } else if (typeof rawDelivery === "number") {
          const parsed = new Date(rawDelivery);
          label = isValidDateObj(parsed) ? toQuarterLabel(parsed) : label;
        }
      }
      if (label === "—") {
        const est = new Date();
        est.setMonth(est.getMonth() + 9);
        label = toQuarterLabel(est) + " (est.)";
      }
      return label;
    })();
    const deliverySource = (() => {
      const has =
        (result?.snapshot as any)?.deliveryDate ||
        (result?.snapshot as any)?.expectedDeliveryDate ||
        (result as any)?.deliveryDate ||
        (result as any)?.expectedDeliveryDate;
      return has ? "From listing/docs." : "Estimated";
    })();
    const listingStatus =
      (result?.snapshot as any)?.listingStatus ||
      (result?.snapshot as any)?.status ||
      (result as any)?.listingStatus ||
      (result as any)?.marketStatus ||
      (result as any)?.status ||
      null;

    const bedroomsDisplay = result?.snapshot?.bedrooms ?? "4";
    const bathroomsDisplay = result?.snapshot?.bathrooms ?? "5";
    const sizeDisplay = result?.snapshot?.sizeSqm ?? "450";
    const propertyTypeDisplay = result?.snapshot?.propertyTypeStd 
      ? result.snapshot.propertyTypeStd.toLowerCase() 
      : "duplexdf";
    const microlocationDisplay = result?.snapshot?.microlocationStd ?? "Lekki Phase 1df";
    const fallbackTitleDisplay = (result as any)?.title || (result as any)?.snapshot?.title || "";
    const fallbackLocationDisplay = (result as any)?.location || (result as any)?.snapshot?.location || "";
    const fallbackListingDisplay = (result as any)?.listingUrl || (result as any)?.snapshot?.listingUrl || "";

    return (
      <Container
        noPadding
        className="min-h-screen bg-[#F9F9F9] text-inda-dark"
      >
        <Navbar />
        <main className="flex-1 py-8">
          <div className="text-[#101820]/90 w-full max-w-7xl mx-auto space-y-6">
            {/* Header Section */}
            <div className="px-6">
              <div className="flex items-center justify-end gap-2 text-sm text-gray-600 mb-4">
                <div className="w-2 h-2 rounded-full bg-green-700 animate-pulse"></div>
                <span className="whitespace-nowrap">
                  Updated {getRelativeTime(
                    result?.updatedAt || 
                    result?.snapshot?.updatedAt || 
                    result?.createdAt ||
                    Date.now()
                  )}
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Side - Gallery */}
                <GallerySection imageUrls={result?.snapshot?.imageUrls ?? []} isHeaderGallery />

                {/* Right Side - Property Info */}
                <div className="bg-[#E8F4F3] rounded-3xl p-8 flex flex-col justify-between min-h-[500px]">
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-4xl font-bold mb-3 text-gray-900">
                        Hi {user?.firstName || "theredf"},
                      </h2>
                      <p className="text-lg text-gray-700">
                        Here's what we found based on your search.
                      </p>
                    </div>

                    {(result?.listingUrl || result?.snapshot?.listingUrl) && (
                      <div className="bg-inda-teal rounded-2xl p-5 space-y-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-white text-sm font-medium flex-shrink-0">
                            Results for the listing link
                          </span>
                          <a
                            className="text-white/90 underline text-sm hover:text-white transition-colors truncate flex-1 min-w-0"
                            href={result?.listingUrl || result?.snapshot?.listingUrl}
                            target="_blank"
                            rel="noreferrer"
                            title={result?.listingUrl || result?.snapshot?.listingUrl}
                          >
                            {result?.listingUrl || result?.snapshot?.listingUrl}
                          </a>
                        </div>

                        <div className="flex items-center justify-end">
                          <span className="text-white text-xs font-medium flex items-center gap-1.5">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                              <path d="M4 10h12M10 4l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Swipe
                          </span>
                        </div>

                        <div className="relative">
                          <div 
                            className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide scroll-smooth"
                            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                          >
                            <style jsx>{`
                              div::-webkit-scrollbar {
                                display: none;
                              }
                            `}</style>

                            <div className="flex items-center gap-2.5 bg-transparent border-2 border-white px-3 py-2 rounded-lg flex-shrink-0">
                              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-white">
                                <rect x="2" y="7" width="14" height="9" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                                <path d="M6 10h6M6 13h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                              </svg>
                              <span className="text-sm font-normal text-white">Bedrooms</span>
                              <span className="bg-white px-2.5 py-0.5 rounded text-sm font-bold text-gray-900">
                                {bedroomsDisplay}
                              </span>
                            </div>

                            <div className="flex items-center gap-2.5 bg-transparent border-2 border-white px-3 py-2 rounded-lg flex-shrink-0">
                              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-white">
                                <path d="M2 7h14M6 11v2M12 11v2M3 7V5a1 1 0 011-1h10a1 1 0 011 1v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                              </svg>
                              <span className="text-sm font-normal text-white">Bathrooms</span>
                              <span className="bg-white px-2.5 py-0.5 rounded text-sm font-bold text-gray-900">
                                {bathroomsDisplay}
                              </span>
                            </div>

                            <div className="flex items-center gap-2.5 bg-transparent border-2 border-white px-3 py-2 rounded-lg flex-shrink-0">
                              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-white">
                                <path d="M3 3h12v12H3V3z" stroke="currentColor" strokeWidth="1.5"/>
                                <path d="M3 9h12M9 3v12" stroke="currentColor" strokeWidth="1.5"/>
                              </svg>
                              <span className="text-sm font-normal text-white">Size</span>
                              <span className="bg-white px-2.5 py-0.5 rounded text-sm font-bold text-gray-900 whitespace-nowrap">
                                {`${sizeDisplay} m²`}
                              </span>
                            </div>

                            {result?.snapshot?.propertyTypeStd && (
                              <div className="flex items-center gap-2.5 bg-transparent border-2 border-white px-3 py-2 rounded-lg flex-shrink-0">
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-white">
                                  <path d="M2 9l7-6 7 6M4 7v7a1 1 0 001 1h8a1 1 0 001-1V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                </svg>
                                <span className="text-sm font-normal text-white">Type</span>
                                <span className="bg-white px-2.5 py-0.5 rounded text-xs font-bold text-gray-900 whitespace-nowrap">
                                  {result.snapshot.propertyTypeStd}
                                </span>
                              </div>
                            )}

                            {result?.snapshot?.addedOnDate && (
                              <div className="flex items-center gap-2.5 bg-transparent border-2 border-white px-3 py-2 rounded-lg flex-shrink-0">
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-white">
                                  <rect x="2" y="3" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                                  <path d="M2 7h14M6 1v4M12 1v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                </svg>
                                <span className="text-sm font-normal text-white">Year Built</span>
                                <span className="bg-white px-2.5 py-0.5 rounded text-sm font-bold text-gray-900">
                                  {new Date(result.snapshot.addedOnDate).getFullYear()}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 pt-2">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {result?.snapshot?.title || result?.title || "Property Titledf"}
                    </h3>
                    <p className="text-base text-gray-700 flex items-center gap-2">
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-inda-teal flex-shrink-0">
                        <path d="M9 9a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM9 16s6.75-5.063 6.75-9a6.75 6.75 0 10-13.5 0c0 3.938 6.75 9 6.75 9z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {microlocationDisplay}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Score */}
            <TrustScoreBar
              trustScore={trustScore}
              displayScore={displayScore}
            />


            {/* Smart Summary (Q&D) */}
            <SmartSummary
              result={result}
              deliveryLabel={deliveryLabel}
              deliverySource={deliverySource}
              listingStatus={listingStatus}
            />

            {/* Amenities */}
            <AmenitiesSection result={result} />

            {/* Reviews / Feedback & Complaints */}
            <FeedbackComplaints
              listingUrl={result?.listingUrl || result?.snapshot?.listingUrl}
              listingId={result?._id}
              average={(result as any)?.overallRating ?? null}
              total={(result as any)?.totalReviews ?? null}
              breakdown={(result as any)?.ratingBreakdown ?? null}
              reviews={(result as any)?.reviews ?? []}
              aiSummary={
                (result as any)?.aiReport?.sellerCredibility?.summary ?? null
              }
            />

            {/* Seller Credibility */}
            <SellerCredibility
              sellerName={result?.snapshot?.agentName || "Landmark Properties Ltddf"}
              yearsInBusiness={5}
              completedProjects={20}
              onTimeDelivery={92}
              clientRating={4.6}
              deliveryScore={result?.analytics?.seller?.sellerCredibilityScore || 60}
              indaScore={result?.indaScore?.finalScore || 75}
              litigationHistory="No disputes found"
              registeredLocation={
                result?.analytics?.seller?.agentRegistered ? "Registered with CAC" : "Not Registereddf"
              }
            />

            {/* Property Price Analysis with Interactive Chart */}
            <PriceAnalysis
              price={typeof price === "number" ? price : null}
              fmv={
                typeof fairValue === "number"
                  ? fairValue
                  : chartFMV.length > 0
                  ? chartFMV[chartFMV.length - 1]
                  : null
              }
              months={chartMonths}
              fmvSeries={chartFMV}
              priceSeries={chartPriceSeries}
              windowLabel={chartWindowLabel}
              last6ChangePct={last6ChangePct}
              marketPositionPct={marketPositionPct}
              selectedBar={selectedBar}
              setSelectedBar={setSelectedBar}
              dataPoints={dataPoints}
            />

            {/* Price Analysis AI Summary */}
            {/* <div className="w-full px-6">
              <div className="border-t border-gray-300 pt-6">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setIsPriceSummaryOpen(!isPriceSummaryOpen)}
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
                  <div className="mt-4 bg-transparent rounded-lg">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {(result as any)?.aiReport?.pricing?.summary ||
                        (result as any)?.aiReport?.marketValue?.summary ||
                        (result as any)?.aiReport?.summary ||
                        "—"}
                    </p>
                  </div>
                )}
              </div>
            </div> */}

            {/* Micro-Location Insights */}
            <MapInsights
              isOpen={isLocationSummaryOpen}
              toggle={() => setIsLocationSummaryOpen((v) => !v)}
              aiSummary={
                (result as any)?.aiReport?.microlocation?.summary ?? null
              }
            />

            {/* Demand Insights */}
            <DemandInsights />

            {/* Investment ROI Calculator */}
            <ROICalculator
              roiValues={roiValues}
              editedFlags={editedFields}
              roiFieldInfo={roiFieldInfo}
              openROIInfo={openROIInfo}
              setOpenROIInfo={setOpenROIInfo}
              editingROIField={editingROIField}
              setEditingROIField={setEditingROIField}
              updateROIValue={updateROIValue}
              formatNaira={formatNaira}
              formatPercent={formatPercent}
              handleCalculate={handleCalculate}
              isCalculating={isCalculating}
              calcResult={calcResult}
              aAny={(result as any)?.analytics}
              resultView={resultView}
              setResultView={setResultView}
              longTabRef={longTabRef}
              shortTabRef={shortTabRef}
              underlineStyle={underlineStyle}
              appreciationTab={appreciationTab}
              setAppreciationTab={setAppreciationTab}
            />

            {/* Additional AI Insights */}
            {/* <AISummaryBlocks aiReport={(result as any)?.aiReport} /> */}

            {/* Final Inda Score */}
            <FinalIndaScore
              finalScore={result?.indaScore?.finalScore || 75}
              maxScore={100}
              recommendation={
                (result?.indaScore?.finalScore || 75) >= 75
                  ? "Strong Buy"
                  : (result?.indaScore?.finalScore || 75) >= 60
                  ? "Buy"
                  : (result?.indaScore?.finalScore || 75) >= 45
                  ? "Hold"
                  : "Caution"
              }
              marketValue={result?.indaScore?.breakdown?.marketValue?.score || 18}
              marketValueMax={100}
              sellerCredibility={result?.indaScore?.breakdown?.sellerCredibility?.score || 12}
              sellerCredibilityMax={100}
              microlocation={result?.indaScore?.breakdown?.microlocation?.score || 16}
              microlocationMax={100}
              demand={15}
              demandMax={100}
              roiPotential={result?.indaScore?.breakdown?.roi?.score || 14}
              roiPotentialMax={100}
            />

            {/* Executive Summary */}
            <ExecutiveSummary
              propertyDescription={`This ${bedroomsDisplay}-bedroom ${propertyTypeDisplay} in ${microlocationDisplay} presents a`}
              investmentOpportunity="solid investment opportunity"
              indaScore={result?.indaScore?.finalScore || 75}
              indaScoreMax={100}
              priceVariance={
                result?.analytics?.price?.priceVsFmvPct || 11
              }
              priceVarianceAmount={
                result?.analytics?.price?.priceVsFmvAmountNGN
                  ? `₦${(result.analytics.price.priceVsFmvAmountNGN / 1000000).toFixed(0)}M`
                  : "₦135Mdf"
              }
            />

            {/* Verified Comparables */}
            <VerifiedComparables />

            {/* Call to Action Buttons */}
            <ProceedActions
              onDeeperVerification={() => {
                setStartPaidFlow(true);
                setProceed(true);
              }}
              onBuyWithInda={() =>
                openWhatsApp(
                  `Hello Inda team, I'm interested in buying this property with Inda.\n\nProperty: ${
                    fallbackTitleDisplay
                  }\nLocation: ${
                    fallbackLocationDisplay
                  }\nListing: ${
                    fallbackListingDisplay
                  }\n\nPlease share the next steps to proceed with a purchase.`
                )
              }
              onFinanceWithInda={() =>
                openWhatsApp(
                  `Hello Inda team, I'd like to finance this property via Inda.\n\nProperty: ${
                    fallbackTitleDisplay
                  }\nLocation: ${
                    fallbackLocationDisplay
                  }\nListing: ${
                    fallbackListingDisplay
                  }\n\nPlease guide me through the next steps.`
                )
              }
              legalDisclaimer={(result as any)?.legalDisclaimer}
            />

            {/* Disclaimer */}
            <Disclaimer />
          </div>
        </main>
        <Footer />
        
        {/* Data Coverage Modal */}
        <DataCoverageModal
          isOpen={showDataCoverageModal}
          onClose={() => setShowDataCoverageModal(false)}
          onUnlock={() => {
            setShowDataCoverageModal(false);
            // Optionally trigger payment modal or other actions
          }}
          dataPoints={dataPoints}
          maxDataPoints={500}
          listingUrl={result?.listingUrl || result?.snapshot?.listingUrl}
        />
        
        {proceed && (
          <PaymentModal
            isOpen={proceed}
            onClose={() => {
              setProceed(false);
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
      </Container>
    );
  }

  // Fallback (shouldn't happen often)
  return <NotFoundScreen searchQuery={searchQuery} searchType={searchType} />;
};

export default ResultPage;
