import { getComputedListingByUrl, getReactiveSearchResult, ReactiveSearchResult } from "@/api/listings";
import { verifyPayment } from "@/api/payments";
import { ComputedListing } from "@/types/listing";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { LoadingScreen, NotFoundScreen, ReactiveSearchScreen } from "./sections";
import { PropertyReport, PropertyReportData } from "@/components/reports/PropertyReport";

const isValidUrl = (value: string) => {
    try {
        const u = new URL(value.trim());
        return u.protocol === "http:" || u.protocol === "https:";
    } catch {
        return false;
    }
};

function mapToPropertyReport(result: ComputedListing): PropertyReportData {
    const snap = result.snapshot;
    return {
        name: snap?.title || result.title || "Unnamed Property",
        location: [snap?.microlocationStd, snap?.lga, snap?.state].filter(Boolean).join(", ") || "",
        price: snap?.priceNGN || 0,
        bed: snap?.bedrooms || undefined,
        bath: snap?.bathrooms || undefined,
        size: snap?.sizeSqm ? `${snap.sizeSqm} sqm` : undefined,
        type: snap?.propertyTypeStd || undefined,
        image: snap?.imageUrls?.[0] || undefined,
        views: undefined,
    };
}

const ResultPage: React.FC = () => {
    const router = useRouter();

    const [searchQuery, setSearchQuery] = useState("");
    const [searchType, setSearchType] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [currentStep, setCurrentStep] = useState(0);
    const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);
    const [notFound, setNotFound] = useState(false);
    const [result, setResult] = useState<ComputedListing | null>(null);
    const [reactiveResult, setReactiveResult] = useState<ReactiveSearchResult | null>(null);

    // Verify payment on callback
    useEffect(() => {
        if (!router.isReady) return;
        const ref = (router.query["reference"] as string) || "";
        if (ref) {
            verifyPayment(ref)
                .catch(() => {})
                .finally(() => {
                    const { q, type } = router.query;
                    router.replace(
                        { pathname: router.pathname, query: { q, type } },
                        undefined,
                        { shallow: true }
                    );
                });
        }
    }, [router.isReady, router.query, router]);

    // Fetch listing
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

            let shouldTryReactive = false;

            getComputedListingByUrl(query)
                .then((res) => {
                    setResult(res || null);
                    setNotFound(false);
                    return null;
                })
                .catch((error) => {
                    const is404 =
                        error.response?.status === 404 ||
                        error.response?.data?.message?.includes("not found");
                    if (is404) {
                        shouldTryReactive = true;
                        return getReactiveSearchResult(query);
                    }
                    throw error;
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
                .catch(() => {
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

    if (isLoading) return <LoadingScreen currentStep={currentStep} />;

    if (hasAttemptedFetch && !isLoading && reactiveResult) {
        return <ReactiveSearchScreen reactiveData={reactiveResult} searchQuery={searchQuery} />;
    }

    if (hasAttemptedFetch && !isLoading && notFound) {
        return <NotFoundScreen searchQuery={searchQuery} searchType={searchType} />;
    }

    if (result) {
        const property = mapToPropertyReport(result);
        return (
            <PropertyReport
                property={property}
                intelligenceData={null}
                sourceListing={result.snapshot}
                onBack={() => router.back()}
            />
        );
    }

    return <NotFoundScreen searchQuery={searchQuery} searchType={searchType} />;
};

export default ResultPage;
