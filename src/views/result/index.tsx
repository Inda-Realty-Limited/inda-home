import { getComputedListingByUrl } from "@/api/listings";
import { Button, Container, Footer, Navbar, Text } from "@/components";
import { dummyResultData } from "@/data/resultData";
import { getToken } from "@/helpers";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  FaBuilding,
  FaCheckCircle,
  FaChevronDown,
  FaChevronUp,
  FaClock,
  FaMapMarkerAlt,
  FaPhone,
  FaShare,
  FaStar,
  FaTimes,
  FaWhatsapp,
} from "react-icons/fa";
import { IoIosInformationCircle } from "react-icons/io";
import { RiEditFill } from "react-icons/ri";

const Result = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [proceed, setProceed] = useState(false);
  // Handler for selecting the Free plan
  const choseFree = () => {
    // Close the modal for now; wire up purchase flow here later
    setProceed(false);
  };
  const [open, setOpen] = useState(null);
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

  function toggler(index: any) {
    if (open === index) {
      setOpen(null);
    } else {
      setOpen(index);
    }
  }

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
          <div className="text-[#101820]/90 w-full md:w-4/5 md:mx-auto space-y-6">
            {/* Intro Header */}
            <div className="px-4 sm:px-6">
              <h2 className="text-[52px] font-bold mb-2">Hi there,</h2>
              <p className="text-[32px] font-normal">
                Here's what we found based on your search.
              </p>
              {(result?.listingUrl || result?.snapshot?.listingUrl) && (
                <p className="mt-10 flex items-center gap-2 font-normal whitespace-nowrap overflow-hidden text-[18px] sm:text-[24px] md:text-[28px]">
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

            {/* Inda Verdict (Top Card) */}
            <div className="w-full px-4 sm:px-6">
              <div>
                <div className="bg-inda-teal text-white rounded-lg p-6 mt-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[32px] font-medium mb-3">
                      Inda Trust Score{" "}
                      <IoIosInformationCircle
                        size={20}
                        className="text-inda-teal inline-block"
                      />
                    </span>
                    <span className="text-sm text-[32px] font-normal">
                      {Math.round(result?.indaScore?.finalScore ?? 0)}%
                    </span>
                  </div>
                  <div className="w-full bg-[#101820]/32 rounded-full h-2">
                    <div
                      className="bg-[#F9F9F9] h-2 rounded-full"
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

            {/* Gallery */}
            <div className="w-full px-4 sm:px-6">
              <h3 className="text-[40px] font-bold mb-4">Gallery</h3>
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
                        className="w-[450px] h-[380px] object-cover"
                      />
                    </div>
                  ))}
              </div>
              {/* Chips under gallery */}
              {/* <div className="mt-4 flex flex-wrap items-center gap-2">
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
              </div> */}
            </div>

            {/* Action Buttons Row */}
            <div className="overflow-x-hidden bg-[#4EA8A159] rounded-2xl py-5 sm:px-6">
              <div className="flex flex-wrap gap-2 w-screen">
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
                {/* Desktop Table View */}
                <div className="hidden md:block">
                  <div className="space-y-2">
                    {/* Table Header */}
                    <div className=" pt-[62px] pb-[34px] px-[41px]  bg-[#E5E5E566] rounded-[16px] text-sm font-semibold text-gray-700">
                      <h2 className="text-[52px] font-bold mb-6 text-inda-teal">
                        Smart Summary
                      </h2>
                      <div className="grid grid-cols-3 gap-[98px] text-[44px] font-semibold">
                        {" "}
                        <div>Info</div>
                        <div>Details</div>
                        <div>Status</div>
                      </div>
                    </div>

                    {/* Bedroom/Bathrooms Row */}
                    <div className="grid grid-cols-3 gap-[98px] py-4 px-[22px] bg-[#E5E5E566] font-normal text-[32px] text-[#101820] rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-inda-teal/10 rounded-lg flex items-center justify-center">
                          <FaBuilding className="text-inda-teal text-sm" />
                        </div>
                        <span>Bedroom/Bathrooms</span>
                      </div>
                      <div>
                        {result?.snapshot?.bedrooms ?? dummyResultData.bedrooms}
                        Bed./
                        {result?.snapshot?.bathrooms ??
                          dummyResultData.bathrooms}{" "}
                        Bath.
                      </div>
                      <div>From listing/docs.</div>
                    </div>

                    {/* Title Row
                    <div className="grid grid-cols-3 gap-6 py-4 px-4 bg-[#E5E5E566] font-normal text-[32px] text-[#101820] rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-inda-teal/10 rounded-lg flex items-center justify-center">
                          <FaCheckCircle className="text-inda-teal text-sm" />
                        </div>
                        <span>Title</span>
                      </div>
                      <div className="text-md font-medium flex items-center gap-2">
                        {result?.aiReport?.titleSafety?.label ||
                          dummyResultData.title_status}
                        <FaCheckCircle className="text-green-500 text-sm" />
                      </div>
                      <div className="cursor-pointer hover:text-inda-teal">
                        Verified
                      </div>
                    </div> */}

                    {/* Developer Row */}
                    <div className="grid grid-cols-3 gap-[98px] py-4 px-[22px] bg-[#E5E5E566] font-normal text-[32px] text-[#101820] rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-inda-teal/10 rounded-lg flex items-center justify-center">
                          <FaBuilding className="text-inda-teal text-sm" />
                        </div>
                        <span className="text-md font-medium">Developer</span>
                      </div>
                      <div className="text-md font-medium">
                        {dummyResultData.developer.name}
                      </div>
                      <div className="text-md font-medium cursor-pointer hover:text-inda-teal">
                        View Profile here
                      </div>
                    </div>

                    {/* Delivery Date Row */}
                    <div className="grid grid-cols-3 gap-[98px] py-4 px-[22px] bg-[#E5E5E566] font-normal text-[32px] text-[#101820] rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-inda-teal/10 rounded-lg flex items-center justify-center">
                          <FaClock className="text-inda-teal text-sm" />
                        </div>
                        <span className="text-md font-medium">
                          Delivery Date
                        </span>
                      </div>
                      <div className="text-md font-medium">
                        {dummyResultData.deliveryDate}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 text-md bg-inda-teal font-medium rounded-full"></div>
                        {dummyResultData.status}
                      </div>
                    </div>

                    {/* Status Row */}
                    <div className="grid grid-cols-3 gap-[98px] py-4 px-[22px] bg-[#E5E5E566] font-normal text-[32px] text-[#101820] rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-inda-teal/10 rounded-lg flex items-center justify-center">
                          <FaMapMarkerAlt className="text-inda-teal text-sm" />
                        </div>
                        <span className="text-md font-medium">Status</span>
                      </div>
                      <div className="text-md font-medium">
                        {dummyResultData.status}/Completed
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 text-md font-medium bg-inda-teal rounded-full"></div>
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
                <h3 className="text-[40px] font-bold mb-6">Amenities</h3>
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
                <h3 className="text-[52px] font-bold mb-6 text-inda-teal">
                  Feedback & Complaints
                </h3>
                <div className="">
                  {/* Ratings Overview */}
                  <div className="flex gap-20 rounded-lg p-6 mb-4">
                    <div className="flex-1">
                      <div className="flex gap-20">
                        <div>
                          <div className="flex items-baseline gap-2 mb-2">
                            <span className="text-[48px] font-black">
                              {dummyResultData.overallRating.toFixed(1)}
                            </span>
                            <span className="text-sm text-gray-600"></span>
                          </div>
                          <div className="flex items-center gap-1 mb-3">
                            {Array.from({ length: 5 }).map((_, i) => {
                              const active =
                                i < Math.round(dummyResultData.overallRating);
                              return (
                                <FaStar
                                  key={i}
                                  className={
                                    active
                                      ? "text-yellow-400 h-[31px] w-[31px]"
                                      : "text-gray-300 h-[31px] w-[31px]"
                                  }
                                />
                              );
                            })}
                          </div>
                          <p className="text-[16px] text-[#0F1417] font-normal">
                            {dummyResultData.totalReviews} reviews
                          </p>
                        </div>
                        <div className="space-y-2 w-full">
                          {dummyResultData.ratingBreakdown.map((r, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                              <span className="w-10 text-[16px] text-[#101820]">
                                {r.stars}
                              </span>
                              <div className="flex-1 h-[8px] bg-[#E5E5E5] rounded-full overflow-hidden">
                                <div
                                  className="h-[8px] bg-[#101820]/40 rounded-full"
                                  style={{ width: `${r.percentage}%` }}
                                ></div>
                              </div>
                              <span className="w-10 text-right text-[16px]  text-[#101820]/65">
                                {r.percentage}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex-1"> </div>
                  </div>

                  {/* Reviews List */}
                  <div className="md:col-span-2 space-y-4 h-[499px]">
                    <h1 className="font-bold text-[32px]">Reviews</h1>
                    <div className="w-[1224px] border-1 border-[#4EA8A1] rounded-[32px] h-[311px]">
                      <p className="text-center pt-[145px] text-[20px] font-medium">
                        No Reviews Yet
                      </p>
                    </div>
                    <button className="mt-[50px] ml-[30px] py-[8px] px-[3px] text-[#4EA8A1] text-[24px] font-semibold">
                      Report Your Experience here &lt; &lt;
                    </button>
                  </div>
                </div>

                {/* AI Summary */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h4 className="text-lg font-bold mb-2 text-inda-teal">
                    AI Summary
                  </h4>
                  <p className="text-gray-700 text-base leading-relaxed">
                    {result?.aiReport?.sellerCredibility?.summary ||
                      dummyResultData.aiSummary}
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full px-4 sm:px-6">
              <div className="bg-gray-100 rounded-[24px] p-8">
                <h3 className="text-[40px] font-bold mb-8 text-inda-teal">
                  Property Price Analysis
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
                  <div className="bg-[#E5F4F2] rounded-xl p-8 text-left">
                    <h4 className="text-[18px] font-bold mb-3 text-[#101820]/80">
                      Price
                    </h4>
                    <p className="text-[24px] font-semibold text-inda-teal">
                      {price ? `₦${price.toLocaleString()}` : "₦120,000,000"}
                    </p>
                  </div>

                  <div className="bg-[#E5F4F2] rounded-xl p-8 text-left">
                    <h4 className="text-[18px] font-bold mb-3 text-[#101820]/80">
                      Fair Market Value
                    </h4>
                    <p className="text-[24px] font-semibold text-inda-teal">
                      {fairValue
                        ? `₦${fairValue.toLocaleString()}`
                        : "₦99,600,000"}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end mb-12">
                  <div className="bg-transparent border border-gray-200 rounded-md px-4 py-3 text-right w-fit">
                    <div className="text-xs font-medium text-gray-600">
                      Market Position
                    </div>
                    <div
                      className={`text-sm font-semibold ${
                        marketDelta == null
                          ? "text-red-500"
                          : marketDelta > 0
                          ? "text-red-500"
                          : marketDelta < 0
                          ? "text-green-600"
                          : "text-amber-600"
                      }`}
                    >
                      {marketDelta == null
                        ? "17% Overpriced"
                        : `${Math.abs(marketDelta)}% ${
                            marketDelta > 0
                              ? "Overpriced"
                              : marketDelta < 0
                              ? "Underpriced"
                              : "Fairly Priced"
                          }`}
                    </div>
                  </div>
                </div>

                <div className="bg-transparent rounded-xl p-8 mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-sm text-inda-teal font-medium">
                        ↑ 3.5% in the last 6 months
                      </p>
                      <p className="text-xs text-gray-500">
                        Sales from Aug 2024 - July 2025
                      </p>
                    </div>
                  </div>

                  {/* Dual-series bars (deterministic) */}
                  <div
                    className="flex items-end justify-between h-40 bg-transparent rounded-lg p-4"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(to top, rgba(16,24,32,0.06), rgba(16,24,32,0.06) 1px, transparent 1px, transparent 24px)",
                    }}
                  >
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
                        <div className="flex items-end gap-1">
                          <div
                            className="bg-inda-teal rounded-t w-2"
                            style={{ height: `${50 + index * 4}px` }}
                          />
                          <div
                            className="bg-gray-300 rounded-t w-2"
                            style={{ height: `${56 + index * 4}px` }}
                          />
                        </div>
                        <span className="mt-2 text-[10px] text-gray-500">
                          {month}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-inda-teal rounded-full"></div>
                      <span className="text-xs text-gray-600">Last 3 days</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                      <span className="text-xs text-gray-600">Last Week</span>
                    </div>
                  </div>
                </div>

                {/* AI Summary Collapsible */}
                <div className="border-t border-gray-300 pt-4">
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => setIsPriceSummaryOpen(!isPriceSummaryOpen)}
                  >
                    <h4 className="text-[24px] font-bold text-inda-teal">
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
                    <div className="mt-4 p-4 bg-transparent rounded-lg">
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
                <div className="flex flex-col gap-6">
                  <div>
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
            <div className="w-full px-4 sm:px-6">
              <div className="rounded-lg p-6">
                <h3 className="text-[52px] font-bold mb-10 text-inda-teal">
                  Investment ROI Calculator
                </h3>
                <p className="text[#101820] font-regular text-[20px]">
                  Estimate your potential returns on investment properties with
                  our
                  <br /> comprehensive calculator
                </p>
                <h1 className="font-bold text-[32px] py-5">Property Details</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[73px] mb-10">
                  {dummyResultData.roiMetrics.map((m, idx) => (
                    <div key={idx}>
                      <div className="flex flex-wrap justify-between">
                        <p className="text-[20px] font-normal text-[#101820]/90 pb-3 inline-block">
                          {m.label}
                        </p>{" "}
                        <div className="inline-block">
                          <IoIosInformationCircle className="inline-block text-inda-teal mr-1 w-[22px] h-[21px]" />
                          <RiEditFill className="inline-block text-inda-teal mr-1 w-[22px] h-[21px]" />
                        </div>
                      </div>
                      <p className="bg-[#4EA8A159] h-[61px] rounded-lg p-4 text-lg text-center font-normal text-gray-600">
                        {m.value}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[41px] mb-4">
                  {dummyResultData.roiMetricsTwo.map((two, index) => {
                    return (
                      <div key={index}>
                        <div className="flex flex-wrap justify-between">
                          <p className="text-[20px] font-normal text-[#101820]/90 pb-3 inline-block">
                            {two.label}
                          </p>{" "}
                          <div className="inline-block">
                            <IoIosInformationCircle className="inline-block text-inda-teal mr-1 w-[22px] h-[21px]" />
                            <RiEditFill className="inline-block text-inda-teal mr-1 w-[22px] h-[21px]" />
                          </div>
                        </div>
                        <p className="bg-[#4EA8A159] h-[61px] rounded-lg p-4 text-lg text-center font-normal text-gray-600">
                          {two.value}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="flex gap-[50px] mt-10">
                  {dummyResultData.annualAppreciation.map((annual, index) => {
                    return (
                      <div
                        onClick={() => toggler({ index })}
                        className="flex-1"
                      >
                        {open === 1 ? (
                          <div>
                            <div className="flex justify-between">
                              <span className="text-[20px] text-[#101820]/80 font-normal">
                                {annual.label}
                              </span>
                              <span className="inline-block">
                                <IoIosInformationCircle className="inline-block text-inda-teal mr-1 w-[22px] h-[21px]" />
                              </span>
                            </div>
                            <div>
                              <p className="bg-[#4EA8A159] h-[61px] rounded-lg p-4 text-lg text-center font-normal text-gray-600">
                                {annual.value}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="flex justify-between">
                              <span className="text-[20px] text-[#101820]/80 font-normal">
                                {annual.label}
                              </span>
                              <span>
                                <IoIosInformationCircle className="inline-block text-inda-teal mr-1 w-[22px] h-[21px]" />
                              </span>
                            </div>
                            <div className="bg-[#4EA8A159] h-[61px] rounded-lg p-4 text-lg text-center font-normal text-gray-600"></div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* <div className="flex gap-[50px] mt-10">
                  <div onClick={() => toggler(1)} className="flex-1">
                    {open === 1 ? (
                      <div>
                        <div className="flex justify-between">
                          <span className="text-[20px] text-[#101820]/80 font-normal">
                            Annual Appreciation <br />
                            (₦, Local Nominal)
                          </span>
                          <span className="inline-block">
                            <IoIosInformationCircle className="inline-block text-inda-teal mr-1 w-[22px] h-[21px]" />
                          </span>
                        </div>
                        <div>
                          <p className="bg-[#4EA8A159] h-[61px] rounded-lg p-4 text-lg text-center font-normal text-gray-600">
                            3.2%
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex justify-between">
                          <span className="text-[20px] text-[#101820]/80 font-normal">
                            Annual Appreciation <br /> (₦, Local Nominal)
                          </span>
                          <span>
                            <IoIosInformationCircle className="inline-block text-inda-teal mr-1 w-[22px] h-[21px]" />
                          </span>
                        </div>
                        <div className="bg-[#4EA8A159] h-[61px] rounded-lg p-4 text-lg text-center font-normal text-gray-600"></div>
                      </div>
                    )}
                  </div>

                  <div className="flex-1" onClick={() => toggler(2)}>
                    {open === 2 ? (
                      <div>
                        <div className="flex justify-between">
                          <span className="text-[20px] text-[#101820]/80 font-normal">
                            Annual Appreciation (₦, <br /> Local Real)
                          </span>
                          <span>
                            <IoIosInformationCircle className="inline-block text-inda-teal mr-1 w-[22px] h-[21px]" />
                          </span>
                        </div>
                        <div>
                          <p className="bg-[#4EA8A159] h-[61px] rounded-lg p-4 text-lg text-center font-normal text-gray-600">
                            3.2%
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex justify-between">
                          <span className="text-[20px] text-[#101820]/80 font-normal">
                            Annual Appreciation (₦, <br /> Local Real)
                          </span>
                          <span>
                            <IoIosInformationCircle className="inline-block text-inda-teal mr-1 w-[22px] h-[21px]" />
                          </span>
                        </div>
                        <div className="bg-[#4EA8A159] h-[61px] rounded-lg p-4 text-lg text-center font-normal text-gray-600"></div>
                      </div>
                    )}
                  </div>
                  <div onClick={() => toggler(3)} className="flex-1">
                    {open === 3 ? (
                      <div className="">
                        <div className="flex justify-between">
                          <span className="text-[20px] text-[#101820]/80 font-normal">
                            Annual Appreciation <br /> (USD, $FX + Inflation
                            Adjusted)
                          </span>
                          <span>
                            <IoIosInformationCircle className="inline-block text-inda-teal mr-1 w-[22px] h-[21px]" />
                          </span>
                        </div>
                        <div>
                          <p className="bg-[#4EA8A159] h-[61px] rounded-lg p-4 text-lg text-center font-normal text-gray-600">
                            3.2%
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex justify-between">
                          <span className="text-[20px] text-[#101820]/80 font-normal">
                            Annual Appreciation <br /> (USD, $FX + Inflation
                            Adjusted)
                          </span>
                          <span>
                            <IoIosInformationCircle className="inline-block text-inda-teal mr-1 w-[22px] h-[21px]" />
                          </span>
                        </div>
                        <div className="bg-[#4EA8A159] h-[61px] rounded-lg p-4 text-lg text-center font-normal text-gray-600"></div>
                      </div>
                    )}
                  </div>
                </div> */}

                {/* <div className="border-t border-gray-200 pt-4">
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
                </div> */}
              </div>
            </div>

            {/* Verified Comparables */}
            <div className="w-full px-4 sm:px-6">
              <div className=" rounded-lg p-6">
                <h3 className="text-[52px] font-bold mb-6 text-inda-teal">
                  Verified Comparables
                </h3>
                <div
                  className="flex gap-4 overflow-x-auto pb-2"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  <style jsx>{`
                    div::-webkit-scrollbar {
                      display: none;
                    }
                  `}</style>
                  {dummyResultData.comparables.map((c) => (
                    <div
                      key={c.id}
                      className="flex-shrink-0 min-w-[320px] max-w-[320px] bg-[#E5F4F2] rounded-2xl p-4"
                    >
                      <div className="w-full h-40 rounded-xl overflow-hidden mb-4">
                        <img
                          className="w-full h-full object-cover"
                          src={c.image}
                          alt={c.title}
                        />
                      </div>
                      <p className="text-[#101820] font-semibold text-lg mb-2">
                        {c.title}
                      </p>
                      <div className="text-sm text-gray-700 space-y-1 mb-3">
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
                      <div className="text-sm text-[#101820] font-semibold">
                        Price: {c.price}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* How would you like to proceed? */}
            <div className="w-full px-4 sm:px-6">
              <div className="rounded-lg p-6">
                <div className="bg-gray-100 rounded-xl py-10">
                  <h3 className="text-[52px] font-bold mb-10 text-center">
                    How would you like to proceed?
                  </h3>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {/* <button className="flex items-center gap-2 px-4 py-2 bg-inda-teal text-white rounded-full text-sm hover:bg-teal-600 transition-colors">
                    <FaWhatsapp className="text-xs" /> WhatsApp Seller
                   </button>
                   <button className="flex items-center gap-2 px-4 py-2 bg-inda-teal text-white rounded-full text-sm hover:bg-teal-600 transition-colors">
                    <FaPhone className="text-xs" /> Call Seller
                   </button> */}
                    <button
                      onClick={(e) => setProceed(true)}
                      className="py-[12px] px-[42px] h-[121px] w-[339px] bg-inda-teal text-[#F9F9F9] rounded-2xl text-[24px] font-normal hover:bg-[#0A655E]"
                    >
                      Run Deeper Verification
                    </button>
                    <button className="py-[12px] px-[42px] h-[121px] w-[339px] bg-inda-teal text-[#F9F9F9] rounded-2xl text-[24px] font-normal hover:bg-[#0A655E]">
                      Buy with Inda
                    </button>
                    <button className="py-[12px] px-[42px] h-[121px] w-[339px] bg-inda-teal text-[#F9F9F9] rounded-2xl text-[24px] font-normal hover:bg-[#0A655E]">
                      Finance with Inda
                    </button>
                  </div>
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
          <div>
            {proceed && (
              <div className="fixed inset-0 backdrop-blur-sm bg-opacity-60 flex justify-center items-center z-50">
                <div className="max-h-[90vh] bg-white rounded-lg max-w-5xl w-full max-md:w-3/4 overflow-y-auto relative">
                  <motion.section
                    className="w-full py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  >
                    <div className="max-w-[80%] mx-auto ">
                      <motion.div
                        className="bg-[#1018200A] rounded-[48px] p-8 sm:p-12 shadow-xl"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                      >
                        <button
                          onClick={() => setProceed(false)}
                          className="absolute top-4 right-4 text-gray-600 hover:text-black"
                        >
                          <FaTimes size={30} />
                        </button>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: 0.2 }}
                          className="text-left mb-12"
                        >
                          <Text className="text-inda-dark font-bold text-2xl sm:text-3xl mb-2">
                            Plans & Pricing
                          </Text>
                          <p className="font-normal text-md text-[#556457]">
                            Inda Pricing Guide (Lagos Listings Only)
                          </p>
                        </motion.div>
                        <div className="bg-[#F9F9F980] rounded-[24px] p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-0">
                          {/* Deep Dive Report - Elevated */}
                          <motion.div
                            initial={{ opacity: 0, y: 40, scale: 0.85 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{
                              duration: 0.7,
                              delay: 0.4,
                              ease: "easeOut",
                            }}
                            whileHover={{
                              scale: 1.03,
                              y: -5,
                              transition: { duration: 0.3 },
                            }}
                            className="relative -mt-4 sm:-mt-8 lg:-mt-12 w-full"
                          >
                            <div className="bg-[#2A2A2A] rounded-[20px] sm:rounded-[32px] p-4 sm:p-6 h-full flex flex-col shadow-2xl hover:shadow-3xl transition-all duration-300 ">
                              <div className="text-left mb-4 sm:mb-6">
                                <motion.div
                                  className="font-bold text-3xl sm:text-4xl mb-2 text-white"
                                  initial={{ opacity: 0, x: -20 }}
                                  whileInView={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.5, delay: 0.6 }}
                                >
                                  ₦25,000
                                </motion.div>
                                <motion.h3
                                  className="text-lg sm:text-xl font-bold text-white mb-2"
                                  initial={{ opacity: 0, x: -20 }}
                                  whileInView={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.5, delay: 0.7 }}
                                >
                                  Deep Dive Report
                                </motion.h3>
                                <motion.p
                                  className="text-xs sm:text-sm text-gray-300 mb-4"
                                  initial={{ opacity: 0 }}
                                  whileInView={{ opacity: 1 }}
                                  transition={{ duration: 0.5, delay: 0.8 }}
                                >
                                  Delivery Time: 24-48 hours (via email PDF)
                                </motion.p>
                              </div>

                              <motion.div
                                className="flex-1 mb-4 sm:mb-6"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.9 }}
                              >
                                <h4 className="text-white mb-2 text-xs sm:text-sm font-semibold">
                                  What You Get:{" "}
                                  <span className="font-normal text-gray-300">
                                    Everything in Instant Report
                                  </span>
                                  <span className="text-white font-semibold">
                                    {" "}
                                    Plus:
                                  </span>
                                </h4>
                                <h5 className="text-white text-xs sm:text-sm font-semibold mb-3">
                                  Title & Legal Verification:
                                </h5>
                                <ul className="space-y-2">
                                  <motion.li
                                    className="flex items-center gap-3 text-xs sm:text-sm text-gray-300"
                                    initial={{ opacity: 0, x: -10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.4, delay: 1.0 }}
                                  >
                                    <span className="text-white text-base sm:text-lg">
                                      ✓
                                    </span>
                                    Certificate of Occupancy (C of O) or Deed
                                    check
                                  </motion.li>
                                  <motion.li
                                    className="flex items-center gap-3 text-xs sm:text-sm text-gray-300"
                                    initial={{ opacity: 0, x: -10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.4, delay: 1.1 }}
                                  >
                                    <span className="text-white text-base sm:text-lg">
                                      ✓
                                    </span>
                                    Governor's consent check
                                  </motion.li>
                                  <motion.li
                                    className="flex items-center gap-3 text-xs sm:text-sm text-gray-300"
                                    initial={{ opacity: 0, x: -10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.4, delay: 1.2 }}
                                  >
                                    <span className="text-white text-base sm:text-lg">
                                      ✓
                                    </span>
                                    Zoning compliance check
                                  </motion.li>
                                  <motion.li
                                    className="flex items-center gap-3 text-xs sm:text-sm text-gray-300"
                                    initial={{ opacity: 0, x: -10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.4, delay: 1.3 }}
                                  >
                                    <span className="text-white text-base sm:text-lg">
                                      ✓
                                    </span>
                                    Litigation search (court registry)
                                  </motion.li>
                                  <motion.li
                                    className="flex items-center gap-3 text-xs sm:text-sm text-gray-300"
                                    initial={{ opacity: 0, x: -10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.4, delay: 1.4 }}
                                  >
                                    <span className="text-white text-base sm:text-lg">
                                      ✓
                                    </span>
                                    Survey plan verification (boundaries &
                                    location)
                                  </motion.li>
                                </ul>
                              </motion.div>

                              <motion.button
                                className="w-full bg-[#4ea8a1] text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-full font-medium hover:bg-[#3d8a84] transition-all duration-300 text-sm sm:text-base"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 1.5 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                Choose plan
                              </motion.button>
                            </div>
                          </motion.div>

                          {/* Deeper Dive */}
                          <motion.div
                            initial={{ opacity: 0, y: 30, scale: 0.9 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{
                              duration: 0.6,
                              delay: 0.5,
                              ease: "easeOut",
                            }}
                            whileHover={{
                              scale: 1.02,
                              transition: { duration: 0.3 },
                            }}
                            className="w-full"
                          >
                            <div className="p-4 sm:p-6 h-full flex flex-col transition-all duration-300 hover:shadow-md rounded-lg sm:rounded-none">
                              <div className="text-left mb-4 sm:mb-6">
                                <motion.div
                                  className="font-bold text-3xl sm:text-4xl mb-2 text-gray-900"
                                  initial={{ opacity: 0, x: -20 }}
                                  whileInView={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.5, delay: 0.7 }}
                                >
                                  ₦75,000
                                </motion.div>
                                <motion.h3
                                  className="text-lg sm:text-xl font-bold text-gray-900 mb-2"
                                  initial={{ opacity: 0, x: -20 }}
                                  whileInView={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.5, delay: 0.8 }}
                                >
                                  Deeper Dive
                                </motion.h3>
                                <motion.p
                                  className="text-xs sm:text-sm text-gray-600 mb-4"
                                  initial={{ opacity: 0 }}
                                  whileInView={{ opacity: 1 }}
                                  transition={{ duration: 0.5, delay: 0.9 }}
                                >
                                  Delivery Time: 2-4 Days
                                </motion.p>
                              </div>

                              <motion.div
                                className="flex-1 mb-4 sm:mb-6"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 1.0 }}
                              >
                                <h4 className="text-gray-900 mb-3 text-xs sm:text-sm font-semibold">
                                  What You Get:{" "}
                                  <span className="font-normal text-gray-600">
                                    Everything in Instant Report
                                  </span>
                                  <span className="text-[#4ea8a1] font-semibold">
                                    {" "}
                                    Plus:
                                  </span>
                                </h4>
                                <ul className="space-y-2">
                                  <motion.li
                                    className="flex items-center gap-3 text-xs sm:text-sm text-gray-700"
                                    initial={{ opacity: 0, x: -10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.4, delay: 1.1 }}
                                  >
                                    <span className="text-[#4ea8a1] text-base sm:text-lg">
                                      ✓
                                    </span>
                                    Seller identity verification
                                  </motion.li>
                                  <motion.li
                                    className="flex items-center gap-3 text-xs sm:text-sm text-gray-700"
                                    initial={{ opacity: 0, x: -10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.4, delay: 1.2 }}
                                  >
                                    <span className="text-[#4ea8a1] text-base sm:text-lg">
                                      ✓
                                    </span>
                                    On-site property visit
                                  </motion.li>
                                  <motion.li
                                    className="flex items-center gap-3 text-xs sm:text-sm text-gray-700"
                                    initial={{ opacity: 0, x: -10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.4, delay: 1.3 }}
                                  >
                                    <span className="text-[#4ea8a1] text-base sm:text-lg">
                                      ✓
                                    </span>
                                    Photo evidence
                                  </motion.li>
                                </ul>
                              </motion.div>

                              <motion.button
                                className="w-full bg-[#4ea8a1] text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-full font-medium hover:bg-[#3d8a84] transition-all duration-300 text-sm sm:text-base"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 1.4 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                Choose plan
                              </motion.button>
                            </div>
                          </motion.div>
                        </div>
                      </motion.div>
                    </div>
                  </motion.section>
                </div>
              </div>
            )}
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

// {dummyResultData.reviews.map((rev) => (
//                       <div
//                         key={rev.id}
//                         className="bg-white rounded-lg p-4 flex flex-row w-[313px] mr-10 inline-block"
//                       >
//                         <div className="flex flex-col gap-5  w-[313px]">
//                           <div className="flex gap-5">
//                             <div className="flex flex-col gap-3">
//                               <div>
//                                 <div className="rounded-full w-[48px] h-[44px] bg-[#C6E3E1]"></div>
//                                 <span className="text-[14px] font-medium p-1">
//                                   Image
//                                 </span>
//                               </div>
//                               <div>
//                                 <span className="text-[14px] font-medium text-[#101820]">
//                                   Rating
//                                 </span>
//                                 <div className="flex items-center gap-1">
//                                   {Array.from({ length: 5 }).map((_, i) => (
//                                     <FaStar
//                                       key={i}
//                                       className={
//                                         i < rev.rating
//                                           ? "h-[16px] w-[19px] text-[#101820]/40"
//                                           : "h-[16px] w-[19px] text-[#989C9F]"
//                                       }
//                                     />
//                                   ))}
//                                 </div>
//                               </div>
//                             </div>
//                             <div className="flex items-center justify-between mb-2">
//                               <div>
//                                 <p className="font-medium text-[14px] text-[#101820]">
//                                   Name
//                                 </p>
//                                 <div className="w-[156px] h-[41px] rounded-[6px] bg-[#4EA8A152]/32"></div>
//                                 <div>
//                                   <p className="font-medium text-[14px] text-[#101820]">
//                                     Review date
//                                   </p>
//                                   <div className="w-[156px] h-[24px] rounded-[6px] bg-[#4EA8A152]/32"></div>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                           <div>
//                             <div>
//                               <p className="font-medium text-[14px] text-[#101820]">
//                                 Review
//                               </p>
//                               <div className="w-[269px] h-[77px] rounded-[6px] bg-[#4EA8A152]/32"></div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
