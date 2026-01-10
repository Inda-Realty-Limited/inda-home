import { getComputedListingByUrl, getReactiveSearchResult, ReactiveSearchResult } from "@/api/listings";
import { verifyPayment } from "@/api/payments";
import { Container } from "@/components";
import { ComputedListing } from "@/types/listing";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import {
    LoadingScreen,
    NotFoundScreen,
    ReactiveSearchScreen,
} from "./sections";
import { PropertyDetail } from "../property-details/PropertyDetail";
import { mapListingToPropertyDetail } from "../property-details/utils";

const isValidUrl = (value: string) => {
    try {
        const u = new URL(value.trim());
        return u.protocol === "http:" || u.protocol === "https:";
    } catch {
        return false;
    }
};

const ResultPage: React.FC = () => {
    const router = useRouter();

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
    const [reactiveResult, setReactiveResult] = useState<ReactiveSearchResult | null>(null);

    // ROI calculator state (partial cleanup, keeping values for mapping if needed)
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

    const [_roiValues, setROIValues] = useState<Record<ROIFieldKey, number>>({
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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isCalculating, _setIsCalculating] = useState(false);
    const [_resultView] = useState<"long" | "short">("long");
    const _longTabRef = useRef<HTMLButtonElement>(null);
    const _shortTabRef = useRef<HTMLButtonElement>(null);

    // Verify payment on callback
    useEffect(() => {
        if (!router.isReady) return;
        const ref = (router.query["reference"] as string) || "";
        if (ref) {
            verifyPayment(ref)
                .then(() => { })
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
    }, [router.isReady, router.query, router]);

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
                        shouldTryReactive = true;
                        return getReactiveSearchResult(query);
                    } else {
                        throw error;
                    }
                })
                .then((reactiveData) => {
                    if (shouldTryReactive) {
                        if (reactiveData) {
                            setResult(null);
                            setReactiveResult(reactiveData);
                            setNotFound(false);
                        } else {
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
        const fallbackTitleDisplay = (result as any)?.title || (result as any)?.snapshot?.title || "";
        const fallbackLocationDisplay = (result as any)?.location || (result as any)?.snapshot?.location || "";
        const fallbackListingDisplay = (result as any)?.listingUrl || (result as any)?.snapshot?.listingUrl || "";

        const openWhatsApp = (text: string) => {
            const phone = process.env.NEXT_PUBLIC_INDA_WHATSAPP || "2347084960775";
            const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
            if (typeof window !== "undefined") window.open(url, "_blank");
        };

        // Map the result to PropertyDetail format
        const property = mapListingToPropertyDetail(result);

        return (
            <Container
                noPadding
                className="min-h-screen bg-gray-50"
            >
                <PropertyDetail
                    property={property}
                    onBack={() => router.back()}
                    onReserve={() => {
                        openWhatsApp(
                            `Hello Inda team, I'm interested in reserving this property.\n\nProperty: ${fallbackTitleDisplay}\nLocation: ${fallbackLocationDisplay}\nListing: ${fallbackListingDisplay}\n\nPlease share the next steps.`
                        );
                    }}
                />

            </Container>
        );
    }

    // Fallback (shouldn't happen often)
    return <NotFoundScreen searchQuery={searchQuery} searchType={searchType} />;
};

export default ResultPage;
