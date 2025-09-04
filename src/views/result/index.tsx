import { getComputedListingByUrl } from "@/api/listings";
import { hasPaid, verifyPayment } from "@/api/payments";
import { Button, Container, Footer, Navbar } from "@/components";
import PaymentModal from "@/components/inc/PaymentModal";
// Removed StreetView (pano) in favor of aerial satellite embed
import { dummyResultData } from "@/data/resultData";
import { getToken, getUser } from "@/helpers";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import {
  FaBuilding,
  FaCheckCircle,
  FaChevronDown,
  FaChevronUp,
  FaClock,
  FaLockOpen,
  FaMapMarkerAlt,
  FaPhone,
  FaShare,
  FaStar,
  FaWhatsapp,
} from "react-icons/fa";
import { IoIosInformationCircle } from "react-icons/io";
import { RiEditFill } from "react-icons/ri";

type ResultProps = {
  hiddenMode?: boolean;
};

const Result: React.FC<ResultProps> = ({ hiddenMode = false }) => {
  // will be overridden after hasPaid check
  const [isPaid, setIsPaid] = useState(false);
  const isHidden = hiddenMode && !isPaid;
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [proceed, setProceed] = useState(false);
  const [open, setOpen] = useState<number | null>(0);
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

  // WhatsApp helper
  const INDA_WHATSAPP =
    process.env.NEXT_PUBLIC_INDA_WHATSAPP || "2349012345678"; // TODO: set real number in env
  const openWhatsApp = (text: string, phone: string = INDA_WHATSAPP) => {
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    if (typeof window !== "undefined") {
      window.open(url, "_blank");
    }
  };

  const [isROISummaryOpen, setIsROISummaryOpen] = useState(false);
  const [notFound, setNotFound] = useState(true);
  const [paymentCallbackUrl, setPaymentCallbackUrl] = useState<string | null>(
    null
  );
  const [isEmbedded, setIsEmbedded] = useState(false);

  useEffect(() => {
    const u = getUser();
    setUser(u);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      setIsEmbedded(window.self !== window.top);
    } catch {
      setIsEmbedded(true);
    }
  }, []);

  // Always show not found view instead of results
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [isPriceSummaryOpen, setIsPriceSummaryOpen] = useState(false);
  const [isLocationSummaryOpen, setIsLocationSummaryOpen] = useState(false);
  const [isDocumentsSummaryOpen, setIsDocumentsSummaryOpen] = useState(false);

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
    if (!roiHasEdited || isCalculating) return;
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
      const expensesTotal = principal * (expensePct / 100) * years;
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
    const fairValue =
      result?.analytics?.market?.fairValue ??
      result?.analytics?.market?.estimatedValue;
    const marketDelta =
      price && fairValue
        ? Math.round(((price - fairValue) / fairValue) * 100)
        : null;

    // INDA TRUST SCORE: derive 0-100 score with sensible fallbacks
    const trustScoreRaw =
      result?.analytics?.seller?.trustScore ??
      result?.aiReport?.sellerCredibility?.score ??
      result?.aiReport?.sellerCredibility?.trustScore ??
      result?.developer?.trustScore ??
      dummyResultData.indaTrustScore ??
      dummyResultData.developer.trustScore ??
      80;
    const trustScore = Math.max(0, Math.min(100, Math.round(trustScoreRaw)));

    return (
      <Container
        noPadding
        className={`min-h-screen bg-[#F9F9F9] text-inda-dark ${
          isHidden ? "h-screen overflow-hidden" : ""
        }`}
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
            <div className="w-full px-6 my-6">
              <div className="rounded-2xl p-6 md:p-8 bg-[#4EA8A1] text-white">
                <div className="flex items-center justify-between mb-4 md:mb-6">
                  <span className="text-lg md:text-xl font-semibold">
                    Inda Trust Score
                  </span>
                  <span className="text-lg md:text-xl font-semibold">
                    {trustScore}%
                  </span>
                </div>
                <div className="w-full h-4 bg-white rounded-full overflow-hidden">
                  <div
                    className="h-4 rounded-full"
                    style={{
                      width: `${trustScore}%`,
                      backgroundColor: "#3C8F89",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* BEGIN hidden blur scope */}
            <div className="relative">
              {isHidden && (
                <div className="absolute inset-0 z-10 pointer-events-none">
                  {/* Keep the unlock UI centered in the viewport while scrolling this section */}
                  <div className="sticky top-[60%] -translate-y-1/2 transform w-full">
                    <div className="mx-auto w-[200px] h-[200px] md:w-[240px] md:h-[240px] rounded-full bg-[#4EA8A1] flex flex-col items-center justify-center shadow-2xl pointer-events-auto">
                      <FaLockOpen className="text-white w-12 h-12 md:w-14 md:h-14 mb-4" />
                      <button
                        onClick={() => setProceed(true)}
                        className="px-4 py-1.5 md:px-6 md:py-2 rounded-full border border-white text-white text-sm md:text-base font-semibold hover:bg-white/10 transition"
                      >
                        Unlock here
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <div
                className={
                  isHidden ? "filter blur-sm pointer-events-none" : undefined
                }
              >
                {/* Gallery */}
                <div className="w-full px-6">
                  <h3 className="text-2xl md:text-3xl font-bold mb-6">
                    Gallery
                  </h3>
                  <div
                    className="flex gap-4 overflow-x-auto pb-4"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                  >
                    <style jsx>{`
                      div::-webkit-scrollbar {
                        display: none;
                      }
                    `}</style>
                    {(result?.snapshot?.imageUrls?.length
                      ? result.snapshot.imageUrls
                      : [
                          "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
                          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
                          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
                          "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
                        ]
                    )
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
                      ))}
                  </div>
                </div>

                {/* Action Buttons Row */}
                <div className="bg-[#4EA8A159] rounded-2xl py-6 pl-6 w-[96%] inline-block mx-6 my-6">
                  <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                    <button className="flex items-center gap-2 px-6 py-3 bg-inda-teal text-white rounded-full text-sm font-medium hover:bg-teal-600 transition-colors">
                      <FaWhatsapp className="text-sm" />
                      WhatsApp Seller
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 bg-inda-teal text-white rounded-full text-sm font-medium hover:bg-teal-600 transition-colors">
                      <FaPhone className="text-sm" />
                      Call Seller
                    </button>
                    <button
                      className="flex items-center gap-2 px-6 py-3 bg-inda-teal text-white rounded-full text-sm font-medium hover:bg-teal-600 transition-colors"
                      onClick={() =>
                        window.open(
                          result?.listingUrl ||
                            result?.snapshot?.listingUrl ||
                            "#",
                          "_blank"
                        )
                      }
                    >
                      <FaShare className="text-sm" />
                      View Source
                    </button>
                  </div>
                </div>

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
                        <div className="grid grid-cols-3 gap-12 py-6 px-6 bg-[#E5E5E566] font-normal text-base text-[#101820] rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-inda-teal/10 rounded-lg flex items-center justify-center">
                              <FaBuilding className="text-inda-teal text-lg" />
                            </div>
                            <span>Bedroom/Bathrooms</span>
                          </div>
                          <div>
                            {result?.snapshot?.bedrooms ??
                              dummyResultData.bedrooms}
                            Bed./
                            {result?.snapshot?.bathrooms ??
                              dummyResultData.bathrooms}{" "}
                            Bath.
                          </div>
                          <div>From listing/docs.</div>
                        </div>

                        {/* Developer Row */}
                        <div className="grid grid-cols-3 gap-12 py-6 px-6 bg-[#E5E5E566] font-normal text-base text-[#101820] rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-inda-teal/10 rounded-lg flex items-center justify-center">
                              <FaBuilding className="text-inda-teal text-lg" />
                            </div>
                            <span className="font-medium">Seller</span>
                          </div>
                          <div className="font-medium">
                            {dummyResultData.developer.name}
                          </div>
                          <div className="font-medium cursor-pointer hover:text-inda-teal">
                            View Profile here
                          </div>
                        </div>

                        {/* Delivery Date Row */}
                        <div className="grid grid-cols-3 gap-12 py-6 px-6 bg-[#E5E5E566] font-normal text-base text-[#101820] rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-inda-teal/10 rounded-lg flex items-center justify-center">
                              <FaClock className="text-inda-teal text-lg" />
                            </div>
                            <span className="font-medium">Delivery Date</span>
                          </div>
                          <div className="font-medium">
                            {dummyResultData.deliveryDate}
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-inda-teal rounded-full"></div>
                            <span>{dummyResultData.status}</span>
                          </div>
                        </div>

                        {/* Status Row */}
                        <div className="grid grid-cols-3 gap-12 py-6 px-6 bg-[#E5E5E566] font-normal text-base text-[#101820] rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-inda-teal/10 rounded-lg flex items-center justify-center">
                              <FaMapMarkerAlt className="text-inda-teal text-lg" />
                            </div>
                            <span className="font-medium">Status</span>
                          </div>
                          <div className="font-medium">
                            {dummyResultData.status}/Completed
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-inda-teal rounded-full"></div>
                            <span>{dummyResultData.status}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Mobile Card View */}
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
                              {result?.snapshot?.bedrooms ??
                                dummyResultData.bedrooms}
                              Bed./
                              {result?.snapshot?.bathrooms ??
                                dummyResultData.bathrooms}{" "}
                              Bath.
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

                      {/* Title Card */}
                      <div className="bg-[#E5E5E566] rounded-lg p-5">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 bg-inda-teal/10 rounded-lg flex items-center justify-center">
                            <FaCheckCircle className="text-inda-teal text-lg" />
                          </div>
                          <h4 className="font-semibold text-lg">Title</h4>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">
                              Details:{" "}
                            </span>
                            <span className="font-semibold text-base">
                              {result?.aiReport?.titleSafety?.label ||
                                dummyResultData.title_status}
                            </span>
                            <FaCheckCircle className="text-green-500 text-sm" />
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">
                              Status:{" "}
                            </span>
                            <span className="text-sm text-inda-teal cursor-pointer hover:underline">
                              Verify here
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Developer Card */}
                      <div className="bg-[#E5E5E566] rounded-lg p-5">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 bg-inda-teal/10 rounded-lg flex items-center justify-center">
                            <FaBuilding className="text-inda-teal text-lg" />
                          </div>
                          <h4 className="font-semibold text-lg">Developer</h4>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <span className="text-sm text-gray-500">
                              Details:{" "}
                            </span>
                            <span className="font-semibold text-base">
                              {dummyResultData.developer.name}
                            </span>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">
                              Status:{" "}
                            </span>
                            <span className="text-sm text-inda-teal cursor-pointer hover:underline">
                              View Profile here
                            </span>
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
                              {dummyResultData.deliveryDate}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">
                              Status:{" "}
                            </span>
                            <div className="w-3 h-3 bg-inda-teal rounded-full"></div>
                            <span className="text-sm text-inda-teal">
                              {dummyResultData.status}
                            </span>
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
                              {dummyResultData.status}/Completed
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">
                              Status:{" "}
                            </span>
                            <div className="w-3 h-3 bg-inda-teal rounded-full"></div>
                            <span className="text-sm text-inda-teal">
                              {dummyResultData.status}
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
                    <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4">
                      {/* Keeping placeholder amenities for now */}
                      <div className="flex-shrink-0 w-48 h-40 rounded-xl overflow-hidden relative shadow-lg">
                        <img
                          src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                          alt="Swimming Pool"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-end p-4">
                          <span className="text-white text-sm font-semibold">
                            Swimming Pool
                          </span>
                        </div>
                      </div>

                      <div className="flex-shrink-0 w-48 h-40 rounded-xl overflow-hidden relative shadow-lg">
                        <img
                          src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                          alt="Security"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-end p-4">
                          <span className="text-white text-sm font-semibold">
                            Security
                          </span>
                        </div>
                      </div>

                      <div className="flex-shrink-0 w-48 h-40 rounded-xl overflow-hidden relative shadow-lg">
                        <img
                          src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                          alt="Accessible Roads"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-end p-4">
                          <span className="text-white text-sm font-semibold">
                            Accessible Roads
                          </span>
                        </div>
                      </div>

                      <div className="flex-shrink-0 w-48 h-40 rounded-xl overflow-hidden relative shadow-lg">
                        <img
                          src="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                          alt="24 hours Electricity"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-end p-4">
                          <span className="text-white text-sm font-semibold">
                            24hrs Electricity
                          </span>
                        </div>
                      </div>

                      <div className="flex-shrink-0 w-48 h-40 rounded-xl overflow-hidden relative shadow-lg">
                        <img
                          src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                          alt="Well-Planned Layout"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-end p-4">
                          <span className="text-white text-sm font-semibold">
                            Well-Planned Layout
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Inda Verdict - moved to top */}

                {/* Feedback & Complaints */}
                <div className="w-full px-6">
                  <div className=" rounded-lg p-8">
                    <h3 className="text-2xl md:text-3xl font-bold mb-8 text-inda-teal">
                      Feedback & Complaints
                    </h3>
                    <div className="">
                      {/* Ratings Overview */}
                      <div className="flex flex-col lg:flex-row gap-8 rounded-lg p-6 mb-6">
                        <div className="flex-1">
                          <div className="flex flex-col lg:flex-row gap-8 w-1/2">
                            <div className="flex-shrink-0">
                              <div className="flex items-baseline gap-2 mb-2">
                                <span className="text-4xl font-black">0.0</span>
                              </div>
                              <div className="flex items-center gap-1 mb-3">
                                {Array.from({ length: 5 }).map((_, i) => {
                                  const active = false;
                                  return (
                                    <FaStar
                                      key={i}
                                      className={
                                        active
                                          ? "text-yellow-400 h-6 w-6"
                                          : "text-gray-300 h-6 w-6"
                                      }
                                    />
                                  );
                                })}
                              </div>
                              <p className="text-sm text-[#0F1417] font-normal">
                                0 reviews
                              </p>
                            </div>
                            <div className="space-y-2 flex-1">
                              {[5, 4, 3, 2, 1].map((stars) => (
                                <div
                                  key={stars}
                                  className="flex items-center gap-3"
                                >
                                  <span className="w-8 text-sm text-[#101820]">
                                    {stars}
                                  </span>
                                  <div className="flex-1 h-2 bg-[#E5E5E5] rounded-full overflow-hidden">
                                    <div
                                      className="h-2 bg-[#101820]/40 rounded-full"
                                      style={{ width: `0%` }}
                                    ></div>
                                  </div>
                                  <span className="w-12 text-right text-sm text-[#101820]/65">
                                    0%
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Reviews List */}
                      <div className="space-y-6">
                        <h1 className="font-bold text-xl">Reviews</h1>
                        <div className="max-w-full border border-[#4EA8A1] rounded-2xl h-64 flex items-center justify-center">
                          <p className="text-center text-lg font-medium">
                            No Reviews Yet
                          </p>
                        </div>
                        <button className="text-[#4EA8A1] text-lg font-semibold hover:underline">
                          Report Your Experience here &lt;&lt;
                        </button>
                      </div>
                    </div>

                    {/* AI Summary */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <h4 className="text-xl font-bold mb-4 text-inda-teal">
                        AI Summary
                      </h4>
                      <p className="text-gray-700 text-base leading-relaxed">
                        {result?.aiReport?.sellerCredibility?.summary ||
                          dummyResultData.aiSummary}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="w-full px-6">
                  <div className="bg-[#E5E5E533] rounded-2xl p-8">
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
                          {price
                            ? `₦${price.toLocaleString()}`
                            : "₦120,000,000"}
                        </p>
                      </div>

                      <div className="bg-[#4EA8A114] rounded-xl p-6">
                        <h4 className="text-base font-bold mb-2 text-[#101820]/70">
                          Fair Market Value
                        </h4>
                        <p className="text-2xl font-bold text-inda-teal">
                          {fairValue
                            ? `₦${fairValue.toLocaleString()}`
                            : "₦99,600,000"}
                        </p>
                      </div>
                    </div>

                    {/* Market Position moved into chart (top-right) */}

                    {/* Chart Section */}
                    <div className="bg-transparent rounded-xl p-6 mb-6">
                      {/* Header + Market Position row (same width as graph) */}
                      <div className="w-full max-w-4xl mx-auto flex items-start justify-between mb-5">
                        <div>
                          <p className="text-sm text-inda-teal font-medium mb-1">
                            ↑ 3.5% in the last 6 months
                          </p>
                          <p className="text-xs text-gray-500">
                            Sales from Aug 2024 - July 2025
                          </p>
                        </div>
                        <div className="bg-transparent border border-gray-200 rounded-lg px-4 py-3 ">
                          <div className="text-xs font-medium text-gray-600 mb-1">
                            Market Position
                          </div>
                          <div className="text-sm font-bold text-red-500">
                            17% Overpriced
                          </div>
                        </div>
                      </div>

                      {/* Chart Container with proper width */}
                      <div className="w-full max-w-4xl mx-auto mt-8">
                        <div
                          className="flex items-end justify-between h-48 bg-transparent rounded-lg p-6 pl-12 relative"
                          style={{
                            backgroundImage:
                              "repeating-linear-gradient(to top, rgba(78,168,161,0.1), rgba(78,168,161,0.1) 1px, transparent 1px, transparent 32px)",
                          }}
                        >
                          {/* Y-axis labels */}
                          <div className="absolute left-0 top-6 bottom-6 w-10 flex flex-col justify-between text-[10px] sm:text-xs text-gray-500 pr-1 select-none">
                            <span className="text-right">100</span>
                            <span className="text-right">75</span>
                            <span className="text-right">50</span>
                            <span className="text-right">25</span>
                            <span className="text-right">0</span>
                          </div>
                          {/* X-axis baseline */}
                          <div className="absolute left-12 right-6 bottom-6 h-px bg-[#00000026]" />
                          {/* Y-axis */}
                          <div className="absolute top-6 bottom-6 left-12 w-px bg-[#00000026]" />
                          {[
                            "Aug",
                            "Sep",
                            "Oct",
                            "Nov",
                            "Dec",
                            "Jan",
                            "Feb",
                            "Mar",
                            "Apr",
                            "May",
                            "Jun",
                            "Jul",
                          ].map((month, index) => (
                            <div
                              key={month}
                              className="flex flex-col items-center flex-1"
                            >
                              {/* Bars share same baseline (align to bottom) */}
                              <div className="flex items-end gap-1 mb-2">
                                {/* FMV bar */}
                                <div
                                  className="bg-inda-teal rounded-t-sm w-3"
                                  style={{
                                    height: `${60 + index * 6}px`,
                                    minHeight: "20px",
                                  }}
                                />
                                {/* Price bar */}
                                <div
                                  className="bg-gray-300 rounded-t-sm w-3"
                                  style={{
                                    height: `${70 + index * 5}px`,
                                    minHeight: "25px",
                                  }}
                                />
                              </div>
                              {/* X-axis label/value */}
                              <span className="text-[10px] sm:text-xs text-gray-600 font-medium">
                                {month}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Chart Legend */}
                        <div className="flex items-center justify-start gap-6 mt-4">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-inda-teal rounded-sm"></div>
                            <span className="text-xs text-gray-600 font-medium">
                              FMV
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-gray-300 rounded-sm"></div>
                            <span className="text-xs text-gray-600 font-medium">
                              Price
                            </span>
                          </div>
                        </div>
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
                        <div className="mt-4 p-4 bg-transparent rounded-lg">
                          <p className="text-sm text-gray-600 leading-relaxed">
                            This 3-bed in Lekki is listed at ₦120M. Our engine
                            values it at ₦95M, based on 17 comparable sales from
                            2023-2024. ROI is 7.2% from current rent trends.
                          </p>
                          <button className="mt-3 text-inda-teal text-sm hover:underline font-medium">
                            More Details
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Map Section - Google Maps */}
                <div className="w-full px-6">
                  <div className=" rounded-lg p-8">
                    <h3 className="text-2xl md:text-3xl font-bold mb-8 text-inda-teal">
                      Microlocation Insights
                    </h3>
                    <div className="flex flex-col gap-6">
                      <div>
                        <div className="h-[700px] rounded-lg overflow-hidden bg-white">
                          {/* Aerial satellite view (keyless Google Maps embed) */}
                          <iframe
                            title="Property satellite view"
                            src="https://www.google.com/maps?q=6.4474,3.3903&t=k&z=20&output=embed"
                            className="w-full h-full border-0"
                            loading="lazy"
                            allowFullScreen
                            referrerPolicy="no-referrer-when-downgrade"
                          />
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
                          <div className="bg-transparent rounded-lg p-4">
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {result?.aiReport?.location?.summary ||
                                "Neighborhood is fairly connected with moderate access to schools, hospitals and shopping. Average commute time to CBD is 35–45 mins."}
                            </p>
                            <button className="mt-3 text-inda-teal text-sm hover:underline font-medium">
                              More Details
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ROI Panel */}
                <div className="w-full px-6">
                  <motion.div
                    className="rounded-lg p-8"
                    initial="hidden"
                    whileInView="show"
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

                    {/* Calculate button (enabled only after edit) */}
                    <div className="flex justify-end mb-8">
                      <motion.button
                        onClick={handleCalculate}
                        className={`py-3 px-8 rounded-lg text-base font-semibold transition text-white flex items-center gap-2 ${
                          roiHasEdited
                            ? "bg-[#4EA8A1] hover:bg-[#0A655E]"
                            : "bg-gray-300 cursor-not-allowed"
                        }`}
                        disabled={!roiHasEdited}
                        whileTap={roiHasEdited ? { scale: 0.98 } : undefined}
                        whileHover={roiHasEdited ? { y: -1 } : undefined}
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
                              {formatNaira(calcResult?.profit ?? 122_500_000)}
                            </div>
                          </div>
                          <div className="rounded-lg p-6">
                            <p className="text-lg mb-4 opacity-90">
                              Return on Investment (ROI)
                            </p>
                            <div className="inline-block bg-white text-[#0F5E57] px-6 py-4 rounded-xl font-bold text-xl shadow-sm">
                              {formatPercent(calcResult?.roiPct ?? 96.25)}
                            </div>
                          </div>
                          <div className="rounded-lg p-6">
                            <p className="text-lg mb-4 opacity-90">
                              Annual Rental Income
                            </p>
                            <div className="inline-block bg-white text-[#0F5E57] px-6 py-4 rounded-xl font-bold text-xl shadow-sm">
                              {formatNaira(
                                calcResult?.annualIncome ?? 7_500_000
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* AI Summary */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <div className="flex items-center justify-between cursor-pointer">
                        <h4 className="text-lg lg:text-xl font-bold text-inda-teal">
                          AI Summary
                        </h4>
                        <FaChevronDown className="text-inda-teal" />
                      </div>
                      <p className="text-sm text-[#101820]/70 leading-relaxed mt-4">
                        Summarize ROI projection using rental yield,
                        appreciation trends, and future resale value. Highlight
                        how it compares to micro location average and what kind
                        of buyer it suits (e.g., rental investor, flip buyer,
                        etc.).
                      </p>
                    </div>
                  </motion.div>
                </div>

                {/* Verified Comparables */}
                <div className="w-full px-6">
                  <div className="rounded-lg p-8">
                    <h3 className="text-2xl md:text-3xl font-bold mb-8 text-inda-teal">
                      Verified Comparables
                    </h3>
                    <div
                      className="flex gap-6 overflow-x-auto pb-4"
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
                      {dummyResultData.comparables.map((c) => (
                        <div
                          key={c.id}
                          className="flex-shrink-0 min-w-[320px] max-w-[320px] bg-[#E5F4F2] rounded-2xl p-6"
                        >
                          <div className="w-full h-48 rounded-xl overflow-hidden mb-4">
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
                                style={{ width: `${c.developerTrustScore}%` }}
                              />
                            </div>
                          </div>
                          <div className="text-base text-[#101820] font-semibold">
                            Price: {c.price}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* How would you like to proceed? */}
                <div className="w-full px-6">
                  <div className="rounded-lg p-8">
                    <div className=" rounded-xl py-12 px-8">
                      <h3 className="text-2xl md:text-3xl font-bold mb-10 text-center">
                        How would you like to proceed?
                      </h3>
                      <div className="flex flex-wrap gap-4 justify-center">
                        <button
                          onClick={(e) => setProceed(true)}
                          className="py-4 px-8 h-24 w-72 bg-inda-teal text-[#F9F9F9] rounded-2xl text-lg font-normal hover:bg-[#0A655E] transition-colors"
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
                          className="py-4 px-8 h-24 w-72 bg-inda-teal text-[#F9F9F9] rounded-2xl text-lg font-normal hover:bg-[#0A655E] transition-colors"
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
                          className="py-4 px-8 h-24 w-72 bg-inda-teal text-[#F9F9F9] rounded-2xl text-lg font-normal hover:bg-[#0A655E] transition-colors"
                        >
                          Finance with Inda
                        </button>
                      </div>
                    </div>

                    {/* Legal Disclaimer */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <h4 className="text-xl font-bold text-gray-900 mb-4">
                        Legal Disclaimer
                      </h4>
                      <p className="text-sm text-gray-700 leading-relaxed">
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
              onClose={() => setProceed(false)}
              listingUrl={
                (result?.listingUrl as string) ||
                (result?.snapshot?.listingUrl as string) ||
                (isValidUrl(searchQuery) ? (searchQuery as string) : "")
              }
              onPaid={() => setIsPaid(true)}
            />
          )}
        </main>
        <Footer />
      </Container>
    );
  }

  // Always show not found view
  if (notFound) {
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
                        strokeWidth={1.5}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
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
