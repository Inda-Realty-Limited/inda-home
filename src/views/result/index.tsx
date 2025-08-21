import { getComputedListingByUrl } from "@/api/listings";
import { Button, Container, Footer, Navbar } from "@/components";
import { dummyResultData } from "@/data/resultData";
import { getToken } from "@/helpers";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  FaBuilding,
  FaCheckCircle,
  FaChevronDown,
  FaChevronUp,
  FaClock,
  FaExclamationTriangle,
  FaMapMarkerAlt,
  FaPhone,
  FaShare,
  FaStar,
  FaTimes,
  FaWhatsapp,
} from "react-icons/fa";

const Result = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [result, setResult] = useState<any | null>(null);

  // Always show not found view instead of results
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [isPriceSummaryOpen, setIsPriceSummaryOpen] = useState(false);
  const [isLocationSummaryOpen, setIsLocationSummaryOpen] = useState(false);
  const [isDocumentsSummaryOpen, setIsDocumentsSummaryOpen] = useState(false);
  const [isROISummaryOpen, setIsROISummaryOpen] = useState(false);
  const [notFound, setNotFound] = useState(true);

  // Helper: validate only http(s) URLs
  const isValidUrl = (value: string) => {
    try {
      const u = new URL(value.trim());
      return u.protocol === "http:" || u.protocol === "https:";
    } catch {
      return false;
    }
  };

  // Get search parameters from URL
  useEffect(() => {
    if (router.isReady) {
      const { q, type } = router.query;
      const query = (q as string) || "";
      setSearchQuery(query);
      setSearchType((type as string) || "");

      // Check if user is authenticated
      const token = getToken();
      if (!token) {
        // User is not authenticated, redirect to auth with search query
        router.push(
          `/auth?q=${encodeURIComponent(query)}&type=${(type as string) || ""}`
        );
        return;
      }

      // Only support pasted links for now
      if (query && (type as string) === "link" && isValidUrl(query)) {
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

  // Show loading state
  if (isLoading) {
    return (
      <Container
        noPadding
        className="min-h-screen bg-[#F9F9F9] text-inda-dark flex flex-col"
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

    return (
      <Container noPadding className="min-h-screen bg-[#F9F9F9] text-inda-dark">
        <Navbar />
        <main className="flex-1 py-6">
          <div className="w-full md:w-4/5 md:mx-auto space-y-6">
            {/* Inda Verdict (Top Card) */}
            <div className="w-full px-4 sm:px-6">
              <div className="bg-inda-teal text-white rounded-lg p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold">Inda Verdict</h3>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <FaExclamationTriangle className="text-yellow-300 text-lg" />
                  <span className="text-base font-medium">
                    Overpriced. Moderate Legal Risk
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Inda Trust Score</span>
                    <span className="text-sm font-semibold">
                      {Math.round(result?.indaScore?.finalScore ?? 0)}%
                    </span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div
                      className="bg-white h-2 rounded-full"
                      style={{
                        width: `${Math.round(
                          result?.indaScore?.finalScore ?? 0
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* Intro Header */}
            <div className="px-4 sm:px-6">
              <h2 className="text-2xl font-extrabold text-[#101820] mb-2">
                Hi there,
              </h2>
              <p className="text-[#101820]/80">
                Here's what we found based on your search.
              </p>
              {(result?.listingUrl || result?.snapshot?.listingUrl) && (
                <p className="text-sm mt-3">
                  Results for the following link:{" "}
                  <a
                    className="text-inda-teal underline"
                    href={result?.listingUrl || result?.snapshot?.listingUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {result?.listingUrl || result?.snapshot?.listingUrl}
                  </a>
                </p>
              )}
            </div>
            {/* Gallery */}
            <div className="w-full px-4 sm:px-6">
              <h3 className="text-xl font-bold mb-4">Gallery</h3>
              <div
                className="flex gap-4 overflow-x-auto pb-2"
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
                      className="flex-shrink-0 w-80 h-48 md:w-96 md:h-64 lg:w-[28rem] lg:h-80 rounded-lg overflow-hidden"
                    >
                      <img
                        src={url}
                        alt={`property-${idx}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
              </div>
              {/* Chips under gallery */}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {typeof result?.snapshot?.bedrooms === "number" && (
                  <span className="px-3 py-1 bg-[#E5F4F2] text-inda-teal rounded-full text-xs font-medium">
                    {result.snapshot.bedrooms} Bed(s)
                  </span>
                )}
                {typeof result?.snapshot?.bathrooms === "number" && (
                  <span className="px-3 py-1 bg-[#E5F4F2] text-inda-teal rounded-full text-xs font-medium">
                    {result.snapshot.bathrooms} Bath(s)
                  </span>
                )}
                {result?.snapshot?.propertyTypeStd && (
                  <span className="px-3 py-1 bg-[#E5F4F2] text-inda-teal rounded-full text-xs font-medium">
                    {result.snapshot.propertyTypeStd}
                  </span>
                )}
                <span className="px-3 py-1 bg-[#E5F4F2] text-inda-teal rounded-full text-xs font-medium">
                  Amenities
                </span>
              </div>
            </div>

            {/* Action Buttons Row */}
            <div className="w-full px-4 sm:px-6">
              <div className="flex flex-wrap gap-2">
                <button className="flex items-center gap-2 px-4 py-2 bg-inda-teal text-white rounded-full text-sm hover:bg-teal-600 transition-colors">
                  <FaWhatsapp className="text-xs" />
                  WhatsApp Seller
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-inda-teal text-white rounded-full text-sm hover:bg-teal-600 transition-colors">
                  <FaPhone className="text-xs" />
                  Call Seller
                </button>
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-inda-teal text-white rounded-full text-sm hover:bg-teal-600 transition-colors"
                  onClick={() =>
                    window.open(
                      result?.listingUrl || result?.snapshot?.listingUrl || "#",
                      "_blank"
                    )
                  }
                >
                  <FaShare className="text-xs" />
                  View Source
                </button>
              </div>
            </div>

            {/* Smart Summary */}
            <div className="w-full px-4 sm:px-6">
              <div className="">
                <h2 className="text-xl font-bold mb-6 text-inda-teal">
                  Smart Summary
                </h2>

                {/* Desktop Table View */}
                <div className="hidden md:block">
                  <div className="space-y-2">
                    {/* Table Header */}
                    <div className="grid grid-cols-3 gap-6 py-3 px-4 bg-[#E5E5E566] rounded-lg text-sm font-semibold text-gray-700">
                      <div>Info</div>
                      <div>Details</div>
                      <div>Status</div>
                    </div>

                    {/* Bedroom/Bathrooms Row */}
                    <div className="grid grid-cols-3 gap-6 py-4 px-4 bg-[#E5E5E566] rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-inda-teal/10 rounded-lg flex items-center justify-center">
                          <FaBuilding className="text-inda-teal text-sm" />
                        </div>
                        <span className="text-sm font-medium">
                          Bedroom/Bathrooms
                        </span>
                      </div>
                      <div className="text-sm font-semibold">
                        {result?.snapshot?.bedrooms ?? dummyResultData.bedrooms}
                        Bed./
                        {result?.snapshot?.bathrooms ??
                          dummyResultData.bathrooms}{" "}
                        Bath.
                      </div>
                      <div className="text-sm text-gray-600">
                        From listing/docs.
                      </div>
                    </div>

                    {/* Title Row */}
                    <div className="grid grid-cols-3 gap-6 py-4 px-4 bg-[#E5E5E566] rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-inda-teal/10 rounded-lg flex items-center justify-center">
                          <FaCheckCircle className="text-inda-teal text-sm" />
                        </div>
                        <span className="text-sm font-medium">Title</span>
                      </div>
                      <div className="text-sm font-semibold flex items-center gap-2">
                        {result?.aiReport?.titleSafety?.label ||
                          dummyResultData.title_status}
                        <FaCheckCircle className="text-green-500 text-sm" />
                      </div>
                      <div className="text-sm text-inda-teal cursor-pointer hover:underline">
                        Verify here
                      </div>
                    </div>

                    {/* Developer Row */}
                    <div className="grid grid-cols-3 gap-6 py-4 px-4 bg-[#E5E5E566] rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-inda-teal/10 rounded-lg flex items-center justify-center">
                          <FaBuilding className="text-inda-teal text-sm" />
                        </div>
                        <span className="text-sm font-medium">Developer</span>
                      </div>
                      <div className="text-sm font-semibold">
                        {dummyResultData.developer.name}
                      </div>
                      <div className="text-sm text-inda-teal cursor-pointer hover:underline">
                        View Profile here
                      </div>
                    </div>

                    {/* Delivery Date Row */}
                    <div className="grid grid-cols-3 gap-6 py-4 px-4 bg-[#E5E5E566] rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-inda-teal/10 rounded-lg flex items-center justify-center">
                          <FaClock className="text-inda-teal text-sm" />
                        </div>
                        <span className="text-sm font-medium">
                          Delivery Date
                        </span>
                      </div>
                      <div className="text-sm font-semibold">
                        {dummyResultData.deliveryDate}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-inda-teal">
                        <div className="w-3 h-3 bg-inda-teal rounded-full"></div>
                        {dummyResultData.status}
                      </div>
                    </div>

                    {/* Status Row */}
                    <div className="grid grid-cols-3 gap-6 py-4 px-4 bg-[#E5E5E566] rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-inda-teal/10 rounded-lg flex items-center justify-center">
                          <FaMapMarkerAlt className="text-inda-teal text-sm" />
                        </div>
                        <span className="text-sm font-medium">Status</span>
                      </div>
                      <div className="text-sm font-semibold">
                        {dummyResultData.status}/Completed
                      </div>
                      <div className="flex items-center gap-2 text-sm text-inda-teal">
                        <div className="w-3 h-3 bg-inda-teal rounded-full"></div>
                        {dummyResultData.status}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-2">
                  {/* Bedroom/Bathrooms Card */}
                  <div className="bg-[#E5E5E566] rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-inda-teal/10 rounded-lg flex items-center justify-center">
                        <FaBuilding className="text-inda-teal text-base" />
                      </div>
                      <h4 className="font-semibold text-base">
                        Bedroom/Bathrooms
                      </h4>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-gray-500">Details: </span>
                        <span className="font-semibold text-sm">
                          {result?.snapshot?.bedrooms ??
                            dummyResultData.bedrooms}
                          Bed./
                          {result?.snapshot?.bathrooms ??
                            dummyResultData.bathrooms}{" "}
                          Bath.
                        </span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Status: </span>
                        <span className="text-sm">From listing/docs.</span>
                      </div>
                    </div>
                  </div>

                  {/* Title Card */}
                  <div className="bg-[#E5E5E566] rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-inda-teal/10 rounded-lg flex items-center justify-center">
                        <FaCheckCircle className="text-inda-teal text-base" />
                      </div>
                      <h4 className="font-semibold text-base">Title</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Details: </span>
                        <span className="font-semibold text-sm">
                          {result?.aiReport?.titleSafety?.label ||
                            dummyResultData.title_status}
                        </span>
                        <FaCheckCircle className="text-green-500 text-sm" />
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Status: </span>
                        <span className="text-sm text-inda-teal cursor-pointer hover:underline">
                          Verify here
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Developer Card */}
                  <div className="bg-[#E5E5E566] rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-inda-teal/10 rounded-lg flex items-center justify-center">
                        <FaBuilding className="text-inda-teal text-base" />
                      </div>
                      <h4 className="font-semibold text-base">Developer</h4>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-gray-500">Details: </span>
                        <span className="font-semibold text-sm">
                          {dummyResultData.developer.name}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Status: </span>
                        <span className="text-sm text-inda-teal cursor-pointer hover:underline">
                          View Profile here
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Date Card */}
                  <div className="bg-[#E5E5E566] rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-inda-teal/10 rounded-lg flex items-center justify-center">
                        <FaClock className="text-inda-teal text-base" />
                      </div>
                      <h4 className="font-semibold text-base">Delivery Date</h4>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-gray-500">Details: </span>
                        <span className="font-semibold text-sm">
                          {dummyResultData.deliveryDate}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Status: </span>
                        <div className="w-3 h-3 bg-inda-teal rounded-full"></div>
                        <span className="text-sm text-inda-teal">
                          {dummyResultData.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Card */}
                  <div className="bg-[#E5E5E566] rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-inda-teal/10 rounded-lg flex items-center justify-center">
                        <FaMapMarkerAlt className="text-inda-teal text-base" />
                      </div>
                      <h4 className="font-semibold text-base">Status</h4>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-gray-500">Details: </span>
                        <span className="font-semibold text-sm">
                          {dummyResultData.status}/Completed
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Status: </span>
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
            <div className="w-full">
              <div className="rounded-lg p-6">
                <h3 className="text-xl font-bold mb-6">Amenities</h3>
                <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4">
                  {/* Keeping placeholder amenities for now */}
                  <div className="flex-shrink-0 w-48 h-36 rounded-xl overflow-hidden relative shadow-lg">
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

                  <div className="flex-shrink-0 w-48 h-36 rounded-xl overflow-hidden relative shadow-lg">
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

                  <div className="flex-shrink-0 w-48 h-36 rounded-xl overflow-hidden relative shadow-lg">
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

                  <div className="flex-shrink-0 w-48 h-36 rounded-xl overflow-hidden relative shadow-lg">
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

                  <div className="flex-shrink-0 w-48 h-36 rounded-xl overflow-hidden relative shadow-lg">
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
            <div className="w-full px-4 sm:px-6">
              <div className="bg-gray-100 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-6 text-inda-teal">
                  Feedback & Complaints
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Ratings Overview */}
                  <div className="bg-white rounded-lg p-6">
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-4xl font-extrabold text-gray-900">
                        {dummyResultData.overallRating.toFixed(1)}
                      </span>
                      <span className="text-sm text-gray-600">/ 5</span>
                    </div>
                    <div className="flex items-center gap-1 mb-3">
                      {Array.from({ length: 5 }).map((_, i) => {
                        const active =
                          i < Math.round(dummyResultData.overallRating);
                        return (
                          <FaStar
                            key={i}
                            className={
                              active ? "text-yellow-400" : "text-gray-300"
                            }
                          />
                        );
                      })}
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Based on {dummyResultData.totalReviews} reviews
                    </p>
                    <div className="space-y-2">
                      {dummyResultData.ratingBreakdown.map((r, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <span className="w-10 text-sm text-gray-700">
                            {r.stars}★
                          </span>
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-2 bg-inda-teal"
                              style={{ width: `${r.percentage}%` }}
                            ></div>
                          </div>
                          <span className="w-10 text-right text-sm text-gray-600">
                            {r.percentage}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Reviews List */}
                  <div className="md:col-span-2 space-y-4">
                    {dummyResultData.reviews.map((rev) => (
                      <div key={rev.id} className="bg-white rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-semibold text-gray-900">
                              {rev.reviewer}
                            </p>
                            <p className="text-xs text-gray-500">
                              {rev.location} • {rev.timeAgo}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <FaStar
                                key={i}
                                className={
                                  i < rev.rating
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                                }
                              />
                            ))}
                          </div>
                        </div>
                        <p className="font-medium text-gray-900 mb-1">
                          {rev.title}
                        </p>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {rev.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Summary */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h4 className="text-lg font-bold text-gray-900 mb-2">
                    AI Summary
                  </h4>
                  <p className="text-gray-700 text-base leading-relaxed">
                    {result?.aiReport?.sellerCredibility?.summary ||
                      dummyResultData.aiSummary}
                  </p>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="w-full px-4 sm:px-6">
              <div className="bg-gray-100 rounded-lg p-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                  {/* Price Card */}
                  <div className="bg-white rounded-lg p-6 text-center">
                    <h4 className="text-lg font-bold mb-2 text-gray-900">
                      Price
                    </h4>
                    <p className="text-3xl font-bold text-gray-900">
                      {price ? `₦${price.toLocaleString()}` : "—"}
                    </p>
                  </div>

                  {/* Fair Market Value Card */}
                  <div className="bg-white rounded-lg p-6 text-center">
                    <h4 className="text-lg font-bold mb-2 text-gray-900">
                      Fair Market Value
                    </h4>
                    <p className="text-3xl font-bold text-gray-900">
                      {fairValue ? fairValue.toLocaleString() : "—"}
                    </p>
                  </div>

                  {/* Market Position Card */}
                  <div className="bg-white rounded-lg p-6 text-center">
                    <h4 className="text-lg font-bold mb-2 text-gray-900">
                      Market Position
                    </h4>
                    <p
                      className={
                        `text-2xl font-bold ` +
                        (marketDelta == null
                          ? "text-gray-600"
                          : marketDelta > 0
                          ? "text-red-500"
                          : marketDelta < 0
                          ? "text-green-600"
                          : "text-gray-900")
                      }
                    >
                      {marketDelta == null
                        ? "—"
                        : `${Math.abs(marketDelta)}% ${
                            marketDelta > 0
                              ? "Overpriced"
                              : marketDelta < 0
                              ? "Underpriced"
                              : "Fairly Priced"
                          }`}
                    </p>
                  </div>
                </div>

                {/* AI Summary Collapsible */}
                <div className="border-t border-gray-300 pt-4">
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => setIsPriceSummaryOpen(!isPriceSummaryOpen)}
                  >
                    <h4 className="text-lg font-bold text-inda-teal">
                      AI Summary
                    </h4>
                    <div className="text-inda-teal">
                      {isPriceSummaryOpen ? (
                        <FaChevronUp className="text-sm" />
                      ) : (
                        <FaChevronDown className="text-sm" />
                      )}
                    </div>
                  </div>

                  {isPriceSummaryOpen && (
                    <div className="mt-4 p-4 bg-white rounded-lg">
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {result?.aiReport?.marketValue?.summary ||
                          dummyResultData.priceAnalysis.aiSummary}
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
            <div className="w-full px-4 sm:px-6">
              <div className="bg-gray-100 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-6 text-inda-teal">
                  Location & Micro-Market
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <div className="h-64 md:h-80 rounded-lg overflow-hidden bg-white">
                      <iframe
                        title="map"
                        className="w-full h-full"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        src={`https://www.google.com/maps?q=${encodeURIComponent(
                          (result?.snapshot?.address as string) ||
                            (result?.snapshot?.location as string) ||
                            "Lagos, Nigeria"
                        )}&output=embed`}
                      ></iframe>
                    </div>
                  </div>
                  <div>
                    <div
                      className="flex items-center justify-between cursor-pointer mb-2"
                      onClick={() =>
                        setIsLocationSummaryOpen(!isLocationSummaryOpen)
                      }
                    >
                      <h4 className="text-lg font-bold text-inda-teal">
                        AI Summary
                      </h4>
                      {isLocationSummaryOpen ? (
                        <FaChevronUp className="text-inda-teal" />
                      ) : (
                        <FaChevronDown className="text-inda-teal" />
                      )}
                    </div>
                    {isLocationSummaryOpen && (
                      <div className="bg-white rounded-lg p-4">
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

            {/* Documents & Trust Indicators */}
            <div className="w-full px-4 sm:px-6">
              <div className="bg-gray-100 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-6 text-inda-teal">
                  Documents & Trust Indicators
                </h3>
                {/* Desktop Table */}
                <div className="hidden md:block bg-white rounded-lg overflow-hidden">
                  <div className="grid grid-cols-3 gap-4 px-4 py-3 border-b text-sm font-semibold text-gray-700">
                    <div>Document</div>
                    <div>Status</div>
                    <div>Notes</div>
                  </div>
                  <div>
                    {dummyResultData.documents.map((doc, idx) => (
                      <div
                        key={idx}
                        className="grid grid-cols-3 gap-4 px-4 py-3 border-b last:border-0 text-sm"
                      >
                        <div className="font-medium text-gray-900">
                          {doc.name}
                        </div>
                        <div className="flex items-center gap-2">
                          {doc.status === "verified" && (
                            <FaCheckCircle className="text-green-500" />
                          )}
                          {doc.status === "not-provided" && (
                            <FaTimes className="text-red-500" />
                          )}
                          {doc.status === "in-review" && (
                            <FaClock className="text-yellow-500" />
                          )}
                          <span className="capitalize">
                            {doc.status.replace("-", " ")}
                          </span>
                        </div>
                        <div className="text-gray-600">{doc.notes}</div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Mobile Cards */}
                <div className="md:hidden space-y-3">
                  {dummyResultData.documents.map((doc, idx) => (
                    <div key={idx} className="bg-white rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-gray-900">
                          {doc.name}
                        </p>
                        <div className="flex items-center gap-2">
                          {doc.status === "verified" && (
                            <FaCheckCircle className="text-green-500" />
                          )}
                          {doc.status === "not-provided" && (
                            <FaTimes className="text-red-500" />
                          )}
                          {doc.status === "in-review" && (
                            <FaClock className="text-yellow-500" />
                          )}
                          <span className="text-sm capitalize">
                            {doc.status.replace("-", " ")}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">{doc.notes}</p>
                    </div>
                  ))}
                </div>

                {/* Legal Note */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h4 className="text-lg font-bold text-gray-900 mb-2">
                    Legal Note
                  </h4>
                  <p className="text-gray-700 text-base leading-relaxed">
                    {dummyResultData.legalNote}
                  </p>
                </div>
              </div>
            </div>

            {/* ROI Panel */}
            <div className="w-full px-4 sm:px-6">
              <div className="bg-gray-100 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-6 text-inda-teal">
                  Investment ROI
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  {dummyResultData.roiMetrics.map((m, idx) => (
                    <div key={idx} className="bg-white rounded-lg p-4">
                      <p className="text-sm text-gray-500">{m.label}</p>
                      <p className="text-xl font-bold text-gray-900">
                        {m.value}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => setIsROISummaryOpen(!isROISummaryOpen)}
                  >
                    <h4 className="text-lg font-bold text-inda-teal">
                      AI Summary
                    </h4>
                    {isROISummaryOpen ? (
                      <FaChevronUp className="text-inda-teal" />
                    ) : (
                      <FaChevronDown className="text-inda-teal" />
                    )}
                  </div>
                  {isROISummaryOpen && (
                    <div className="mt-3 bg-white rounded-lg p-4">
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {result?.aiReport?.roi?.summary ||
                          dummyResultData.roiSummary}
                      </p>
                      <button className="mt-3 text-inda-teal text-sm hover:underline font-medium">
                        More Details
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Verified Comparables */}
            <div className="w-full px-4 sm:px-6">
              <div className="bg-gray-100 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-6 text-inda-teal">
                  Verified Comparables
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {dummyResultData.comparables.map((c) => (
                    <div key={c.id} className="bg-white rounded-lg p-4">
                      <p className="font-semibold text-gray-900 mb-1">
                        {c.title}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <FaMapMarkerAlt className="text-inda-teal" />
                        <span>{c.location}</span>
                      </div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-lg font-bold text-gray-900">
                          {c.price}
                        </span>
                        <span className="text-sm text-gray-600">
                          {c.pricePerSqm}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="px-2 py-1 bg-[#E5F4F2] text-inda-teal rounded-full text-xs font-medium">
                          {c.yield}
                        </span>
                        <span className="px-2 py-1 bg-[#E5F4F2] text-inda-teal rounded-full text-xs font-medium">
                          {c.riskLevel}
                        </span>
                        <span className="px-2 py-1 bg-[#E5F4F2] text-inda-teal rounded-full text-xs font-medium">
                          Trust {c.developerTrustScore}%
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <span
                          className={`inline-flex items-center gap-1 ${
                            c.hasVerifiedDocuments
                              ? "text-green-600"
                              : "text-gray-500"
                          }`}
                        >
                          <FaCheckCircle /> Docs
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 ${
                            c.hasVerifiedAgent
                              ? "text-green-600"
                              : "text-gray-500"
                          }`}
                        >
                          <FaCheckCircle /> Agent
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* How would you like to proceed? */}
            <div className="w-full px-4 sm:px-6">
              <div className="bg-gray-100 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-inda-teal">
                  How would you like to proceed?
                </h3>
                <div className="flex flex-wrap gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 bg-inda-teal text-white rounded-full text-sm hover:bg-teal-600 transition-colors">
                    <FaWhatsapp className="text-xs" /> WhatsApp Seller
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-inda-teal text-white rounded-full text-sm hover:bg-teal-600 transition-colors">
                    <FaPhone className="text-xs" /> Call Seller
                  </button>
                  <button className="px-4 py-2 border border-inda-teal text-inda-teal rounded-full text-sm hover:bg-[#E5F4F2]">
                    Request Legal Review
                  </button>
                  <button className="px-4 py-2 border border-inda-teal text-inda-teal rounded-full text-sm hover:bg-[#E5F4F2]">
                    Save for Later
                  </button>
                </div>

                {/* Legal Disclaimer */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h4 className="text-lg font-bold text-gray-900 mb-2">
                    Legal Disclaimer
                  </h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {dummyResultData.legalDisclaimer}
                  </p>
                </div>
              </div>
            </div>
          </div>
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

  // (No fallback "else" block; result and notFound branches handle all cases)
};

export default Result;
