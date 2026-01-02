import { getComputedListingByUrl, getReactiveSearchResult, ReactiveSearchResult } from "@/api/listings";
import { verifyPayment } from "@/api/payments";
import { Container, Footer, Navbar } from "@/components";
import PaymentModal from "@/components/inc/PaymentModal";
import { getUser } from "@/helpers";
import { ComputedListing } from "@/types/listing";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import {
    LoadingScreen,
    NotFoundScreen,
    ReactiveSearchScreen,
} from "./sections";
import { PropertyDetailsView } from "../shared/PropertyDetailsView";

type SelectedBar = null | { series: "fmv" | "price"; index: number };

const isValidUrl = (value: string) => {
    try {
        const u = new URL(value.trim());
        return u.protocol === "http:" || u.protocol === "https:";
    } catch {
        return false;
    }
};

const scrollContainer = (container: HTMLElement | null, direction: 'left' | 'right') => {
    if (!container) return;
    const scrollAmount = direction === 'right' ? 300 : -300;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
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


const ResultPage: React.FC = () => {
    const router = useRouter();
    const user = useMemo(() => getUser(), []);

    // Query
    const [searchQuery, setSearchQuery] = useState("");
    const [searchType, setSearchType] = useState("");

    // Loading/not-found
    const [isLoading, setIsLoading] = useState(true);
    const [currentStep, setCurrentStep] = useState(0);
    const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);
    const [notFound, setNotFound] = useState(false);
    const [isSearchingReactive, setIsSearchingReactive] = useState(false);

    // Data
    const [result, setResult] = useState<ComputedListing | null>(null);
    const [reactiveResult, setReactiveResult] = useState<ReactiveSearchResult | null>(null);

    // Payment gating
    const [isPaid, setIsPaid] = useState<boolean>(false);
    const [proceed, setProceed] = useState(false);
    const [startPaidFlow, setStartPaidFlow] = useState(false);


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
    const badgesScrollRef = useRef<HTMLDivElement>(null);
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



    // Verify payment on callback
    useEffect(() => {
        if (!router.isReady) return;
        const ref = (router.query["reference"] as string) || "";
        if (ref) {
            verifyPayment(ref)
                .then(() => setIsPaid(true))
                .catch(() => { })
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

        if (query && (type as string) === "link" && isValidUrl(query)) {
            setIsLoading(true);
            setHasAttemptedFetch(true);
            const timers = [
                setTimeout(() => setCurrentStep(1), 1200),
                setTimeout(() => setCurrentStep(2), 2400),
                setTimeout(() => setCurrentStep(3), 3600),
            ];

            // Track if we should try reactive search
            let shouldTryReactive = false;

            getComputedListingByUrl(query)
                .then((res) => {
                    const data = res || null;
                    setResult(data);
                    setNotFound(false);
                    return null;
                })
                .catch((error) => {
                    // Check if it's a 404 error (property not found)
                    const is404 =
                        error.response?.status === 404 ||
                        error.response?.data?.message?.includes("not found");

                    if (is404) {
                        // Property not found in DB, try reactive search
                        console.log(
                            "Property not found in DB, trying reactive search for:",
                            query
                        );
                        shouldTryReactive = true;
                        return getReactiveSearchResult(query);
                    } else {
                        // Other error, propagate
                        throw error;
                    }
                })
                .then((reactiveData) => {
                    // Only process reactive data if we were trying reactive search
                    if (shouldTryReactive) {
                        if (reactiveData) {
                            // Reactive search succeeded
                            console.log("Reactive search succeeded, setting result");
                            setResult(null);
                            setReactiveResult(reactiveData);
                            setNotFound(false);
                        } else {
                            // Reactive search failed
                            console.log("Reactive search failed");
                            setResult(null);
                            setReactiveResult(null);
                            setNotFound(true);
                        }
                    }
                })
                .catch((error) => {
                    console.error("Error fetching listing or reactive search:", error);
                    setResult(null);
                    setReactiveResult(null);
                    setNotFound(true);
                })
                .finally(() => {
                    setIsLoading(false);
                    setIsSearchingReactive(false);
                    timers.forEach(clearTimeout);
                });
        } else if (query) {
            setResult(null);
            setReactiveResult(null);
            setNotFound(true);
            setIsLoading(false);
            setHasAttemptedFetch(true);
        }
    }, [router.isReady, router.query]);

    // Populate ROI defaults when result loads
    useEffect(() => {
        if (!result) return;

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
        const phone = process.env.NEXT_PUBLIC_INDA_WHATSAPP || "2347084960775";
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
        if (typeof window !== "undefined") window.open(url, "_blank");
    };

    if (isLoading) {
        return <LoadingScreen currentStep={currentStep} />;
    }

    if (hasAttemptedFetch && !isLoading && reactiveResult) {
        return (
            <ReactiveSearchScreen
                reactiveData={reactiveResult}
                searchQuery={searchQuery}
            />
        );
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

        const openWhatsApp = (text: string) => {
            const phone = process.env.NEXT_PUBLIC_INDA_WHATSAPP || "2347084960775";
            const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
            if (typeof window !== "undefined") window.open(url, "_blank");
        };

        return (
            <Container
                noPadding
                className="min-h-screen bg-[#F9F9F9] text-inda-dark"
            >
                <Navbar />
                <main className="flex-1 py-8">
                    <PropertyDetailsView
                        result={result}
                        price={typeof price === "number" ? price : null}
                        fairValue={
                            typeof fairValue === "number"
                                ? fairValue
                                : chartFMV.length > 0
                                    ? chartFMV[chartFMV.length - 1]
                                    : null
                        }
                        chartMonths={chartMonths}
                        chartFMV={chartFMV}
                        chartPriceSeries={chartPriceSeries}
                        chartWindowLabel={chartWindowLabel}
                        last6ChangePct={last6ChangePct}
                        marketPositionPct={marketPositionPct}
                        selectedBar={selectedBar}
                        setSelectedBar={setSelectedBar}
                        deliveryLabel={deliveryLabel}
                        deliverySource={deliverySource}
                        listingStatus={listingStatus}
                        bedroomsDisplay={bedroomsDisplay}
                        bathroomsDisplay={bathroomsDisplay}
                        sizeDisplay={sizeDisplay}
                        propertyTypeDisplay={propertyTypeDisplay}
                        microlocationDisplay={microlocationDisplay}
                        fallbackTitleDisplay={fallbackTitleDisplay}
                        fallbackLocationDisplay={fallbackLocationDisplay}
                        fallbackListingDisplay={fallbackListingDisplay}
                        onDeeperVerification={() => {
                            setStartPaidFlow(true);
                            setProceed(true);
                        }}
                        onBuyWithInda={() =>
                            openWhatsApp(
                                `Hello Inda team, I'm interested in buying this property with Inda.\n\nProperty: ${fallbackTitleDisplay
                                }\nLocation: ${fallbackLocationDisplay
                                }\nListing: ${fallbackListingDisplay
                                }\n\nPlease share the next steps to proceed with a purchase.`
                            )
                        }
                        onFinanceWithInda={() =>
                            openWhatsApp(
                                `Hello Inda team, I'd like to finance this property via Inda.\n\nProperty: ${fallbackTitleDisplay
                                }\nLocation: ${fallbackLocationDisplay
                                }\nListing: ${fallbackListingDisplay
                                }\n\nPlease guide me through the next steps.`
                            )
                        }
                    />
                </main>
                <Footer />

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
                    />
                )}
            </Container>
        );
    }

    // Fallback (shouldn't happen often)
    return <NotFoundScreen searchQuery={searchQuery} searchType={searchType} />;
};

export default ResultPage;
