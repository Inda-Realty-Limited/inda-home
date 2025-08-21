import { Button, Container, Footer, Navbar } from "@/components";
import { dummyResultData } from "@/data/resultData";
import { useState } from "react";
import { IoIosInformationCircle } from "react-icons/io";
import {
  FaBuilding,
  FaCheckCircle,
  FaChevronDown,
  FaChevronUp,
  FaClock,
  FaExclamationTriangle,
  FaInfoCircle,
  FaMapMarkerAlt,
  FaPhone,
  FaShare,
  FaStar,
  FaTimes,
  FaWhatsapp,
} from "react-icons/fa";

const Result = () => {
  // For demo purposes, we can toggle between found and not found
  const [hasResults, setHasResults] = useState(true);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [isPriceSummaryOpen, setIsPriceSummaryOpen] = useState(false);
  const [isLocationSummaryOpen, setIsLocationSummaryOpen] = useState(false);
  const [isDocumentsSummaryOpen, setIsDocumentsSummaryOpen] = useState(false);
  const [isROISummaryOpen, setIsROISummaryOpen] = useState(false);

  if (!hasResults) {
    // NOT FOUND VIEW
    return (
      <Container
        noPadding
        className="min-h-screen bg-[#F9F9F9] text-inda-dark flex flex-col"
      >
        <Navbar />
        <main
          className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 bg-cover bg-center bg-no-repeat min-h-0"
          style={{
            backgroundImage: "url('/assets/svgs/magnifier.svg')",
          }}
        >
          <div className="max-w-4xl w-full text-center">
            {/* Main Content */}
            <div className="mb-8 sm:mb-12 lg:mb-16">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-inda-dark mb-4 sm:mb-6">
                Oops, we didn't find that.
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
                We couldn't match your search to any verified property, agent,
                or developer. But we're growing every day.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="mb-8 sm:mb-12 lg:mb-16">
              <div className="flex flex-col gap-3 sm:gap-4 items-center">
                <Button
                  variant="primary"
                  className="text-xs sm:text-sm px-4 sm:px-6 py-2 sm:py-3 bg-inda-teal hover:bg-teal-600 text-white rounded-md transition-all duration-200 "
                >
                  Try a different search
                </Button>
                <Button
                  variant="secondary"
                  className="text-xs sm:text-sm px-4 sm:px-6 py-2 sm:py-3 border border-gray-400  text-gray-700 hover:bg-gray-100 rounded-md transition-all duration-200 "
                >
                  Request a Review
                </Button>
              </div>
            </div>

            {/* Error Code */}
            <div className="text-sm sm:text-base text-gray-500">
              Error code: 101 — No matching record found.
            </div>
          </div>
        </main>
        <Footer />
      </Container>
    );
  }

  // RESULT FOUND VIEW
  return (
    <Container noPadding className="min-h-screen bg-[#F9F9F9] text-inda-dark">
      <Navbar />
      <main className="flex-1 py-6">

        <div className="w-full md:w-4/5 md:mx-auto space-y-6">
        <div className="w-full px-4 sm:px-6"><h1 className="text-2xl font-semibold">Hi Ola,</h1>
        <p>Here's what we found based on your search</p></div>

        

 {/* Inda Verdict */}
          <div className="w-full px-4 sm:px-6">
            <div className="rounded-lg">
              <div className="bg-inda-teal text-white p-5 rounded-xl mb-5">
              <h3 className="text-xl font-bold mb-3 text-white">
                Inda Verdict
              </h3>

              {/* Warning Message */}
              <div className="flex items-center gap-3 mb-6">
                <FaExclamationTriangle className="text-yellow-300 text-lg" />
                <span className="text-base font-medium">
                  Overpriced. Moderate Legal Risk
                </span>
              </div></div>

              {/* Trust Score Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-base font-medium">Inda Trust Score <IoIosInformationCircle size={15} className="text-inda-teal inline-block" /></p>
                  <div className="text-3xl font-bold">
                    {dummyResultData.indaTrustScore}%
                  </div>
                </div>

                <div className="w-full bg-white/20 rounded-full h-4">
                  <div
                    className="bg-inda-teal h-4 rounded-full transition-all duration-500"
                    style={{ width: `${dummyResultData.indaTrustScore}%` }}
                  ></div>
                </div>

                {/* Tooltip Section */}
                <div className="mt-6 pt-4 border-t border-white/20">
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => setIsTooltipOpen(!isTooltipOpen)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                        <FaInfoCircle className="text-white text-sm" />
                      </div>
                      <span className="text-base text-white/90">Tooltip</span>
                    </div>
                    <div className="text-white/60">
                      {isTooltipOpen ? (
                        <FaChevronUp className="text-sm" />
                      ) : (
                        <FaChevronDown className="text-sm" />
                      )}
                    </div>
                  </div>

                  {/* Tooltip Content */}
                  {isTooltipOpen && (
                    <div className="mt-4 p-4 bg-white/10 rounded-lg">
                      <div className="space-y-3 text-sm text-white/90">
                        <div>
                          <h4 className="font-semibold mb-2">
                            Trust Score Breakdown:
                          </h4>
                          <ul className="space-y-1 text-xs">
                            <li>• Document Verification: 90%</li>
                            <li>• Developer History: 85%</li>
                            <li>• Legal Compliance: 75%</li>
                            <li>• Market Analysis: 82%</li>
                          </ul>
                        </div>
                        <div>
                          <p className="text-xs">
                            The Inda Trust Score is calculated using multiple
                            data points including document authenticity,
                            developer track record, legal compliance status, and
                            current market conditions. A score above 80%
                            indicates high reliability.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Property Images - Horizontal Scrollable */}
          <div className="w-full px-4 sm:px-6">
            <h1>Gallery</h1>
            <div
              className="flex gap-4 overflow-x-auto py-2 "
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <style jsx>{`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              <div className="flex-shrink-0 w-80 h-48 md:w-96 md:h-64 lg:w-[28rem] lg:h-80 rounded-xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Modern house exterior"
                  className="w-full h-full object-cover "
                />
              </div>
              <div className="flex-shrink-0 w-80 h-48 md:w-96 md:h-64 lg:w-[28rem] lg:h-80 rounded-xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Luxury living room"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-shrink-0 w-80 h-48 md:w-96 md:h-64 lg:w-[28rem] lg:h-80 rounded-xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Modern kitchen"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-shrink-0 w-80 h-48 md:w-96 md:h-64 lg:w-[28rem] lg:h-80 rounded-xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Master bedroom"
                  className="w-full h-full object-cover"
                />
              </div>
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
              <button className="flex items-center gap-2 px-4 py-2 bg-inda-teal text-white rounded-full text-sm hover:bg-teal-600 transition-colors">
                <FaShare className="text-xs" />
                Share Report
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
                      {dummyResultData.bedrooms}Bed./{dummyResultData.bathrooms}{" "}
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
                      {dummyResultData.title_status}
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
                      <span className="text-sm font-medium">Delivery Date</span>
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
                        {dummyResultData.bedrooms}Bed./
                        {dummyResultData.bathrooms} Bath.
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
                        {dummyResultData.title_status}
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
                <div className="flex-shrink-0 w-48 h-36 rounded-xl overflow-hidden relative shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
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
                    src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
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
                    src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
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
                    src="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
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
                    src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
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



          {/* Feedback & Complaints */}
          <div className="w-full px-4 sm:px-6">
            <div className="bg-gray-100 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-6 text-inda-teal">
                Feedback & Complaints
              </h3>

              {/* AI Summary Section */}
              <div className="mb-6">
                <h4 className="text-lg font-bold mb-3 text-gray-900">
                  AI Summary
                </h4>
                <p className="text-gray-700 text-base leading-relaxed">
                  ABC Properties has delivered 12 estates, 3 delayed by 6+
                  months. 2 complaints in the last year. Rated Medium Trust.
                </p>
              </div>

              {/* Rating Section */}
              <div className="flex items-start gap-8 mb-8">
                {/* Overall Rating */}
                <div className="text-center">
                  <div className="text-5xl font-bold text-gray-900 mb-2">
                    3.4
                  </div>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        className={
                          star <= 3
                            ? "text-yellow-400 text-lg"
                            : "text-gray-300 text-lg"
                        }
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">7 reviews</p>
                </div>

                {/* Rating Breakdown */}
                <div className="w-64 space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-sm w-2 text-gray-700">5</span>
                    <div className="w-32 bg-gray-300 rounded-full h-2">
                      <div
                        className="bg-gray-400 h-2 rounded-full"
                        style={{ width: "30%" }}
                      ></div>
                    </div>
                    <span className="text-sm w-8 text-gray-700">30%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm w-2 text-gray-700">4</span>
                    <div className="w-32 bg-gray-300 rounded-full h-2">
                      <div
                        className="bg-gray-400 h-2 rounded-full"
                        style={{ width: "30%" }}
                      ></div>
                    </div>
                    <span className="text-sm w-8 text-gray-700">30%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm w-2 text-gray-700">3</span>
                    <div className="w-32 bg-gray-300 rounded-full h-2">
                      <div
                        className="bg-gray-400 h-2 rounded-full"
                        style={{ width: "20%" }}
                      ></div>
                    </div>
                    <span className="text-sm w-8 text-gray-700">20%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm w-2 text-gray-700">2</span>
                    <div className="w-32 bg-gray-300 rounded-full h-2">
                      <div
                        className="bg-gray-400 h-2 rounded-full"
                        style={{ width: "10%" }}
                      ></div>
                    </div>
                    <span className="text-sm w-8 text-gray-700">10%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm w-2 text-gray-700">1</span>
                    <div className="w-32 bg-gray-300 rounded-full h-2">
                      <div
                        className="bg-gray-400 h-2 rounded-full"
                        style={{ width: "10%" }}
                      ></div>
                    </div>
                    <span className="text-sm w-8 text-gray-700">10%</span>
                  </div>
                </div>
              </div>

              {/* Review Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Review 1 */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">C</span>
                    </div>
                    <div>
                      <span className="font-semibold text-sm text-gray-900">
                        Chinedu O.
                      </span>
                      <p className="text-xs text-gray-500">2 months ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {[1, 2, 3, 4].map((star) => (
                      <FaStar key={star} className="text-yellow-400 text-xs" />
                    ))}
                    <FaStar className="text-gray-300 text-xs" />
                  </div>
                  <h5 className="font-semibold text-sm text-gray-900 mb-2">
                    Good finishing, but delayed delivery
                  </h5>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    I bought into one of ABC's estates off-plan. Delivery was 7
                    months late, which was frustrating. However, the property
                    quality was solid and their team was responsive when I had
                    issues.
                  </p>
                </div>

                {/* Review 2 */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">F</span>
                    </div>
                    <div>
                      <span className="font-semibold text-sm text-gray-900">
                        Fatima S. (Abuja, NG)
                      </span>
                      <p className="text-xs text-gray-500">1 month ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {[1, 2, 3].map((star) => (
                      <FaStar key={star} className="text-yellow-400 text-xs" />
                    ))}
                    <FaStar className="text-gray-300 text-xs" />
                    <FaStar className="text-gray-300 text-xs" />
                  </div>
                  <h5 className="font-semibold text-sm text-gray-900 mb-2">
                    Okay experience — not the best, not the worst
                  </h5>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Estate delivered eventually but there was a 6-month delay.
                    Customer service was hard to reach at times. I wouldn't
                    recommend for first-time buyers who need peace of mind.
                  </p>
                </div>

                {/* Review 3 */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">E</span>
                    </div>
                    <div>
                      <span className="font-semibold text-sm text-gray-900">
                        Emeka
                      </span>
                      <p className="text-xs text-gray-500">3 months ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {[1, 2, 3, 4].map((star) => (
                      <FaStar key={star} className="text-yellow-400 text-xs" />
                    ))}
                    <FaStar className="text-gray-300 text-xs" />
                  </div>
                  <h5 className="font-semibold text-sm text-gray-900 mb-2">
                    No issues at all
                  </h5>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    I bought into one of their estates and everything went
                    smoothly. The finishing was great and there was just lucky.
                  </p>
                </div>
              </div>

              {/* Report Experience Button */}
              <div className="flex items-center gap-2">
                <span className="text-inda-teal text-sm font-medium cursor-pointer hover:underline">
                  Report Your Experience here
                </span>
                <svg
                  width="16"
                  height="12"
                  viewBox="0 0 16 12"
                  fill="none"
                  className="text-inda-teal"
                >
                  <path
                    d="M10 1L15 6L10 11M15 6H1"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
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
                  <p className="text-3xl font-bold text-gray-900">₦120,000</p>
                </div>

                {/* Fair Market Value Card */}
                <div className="bg-white rounded-lg p-6 text-center">
                  <h4 className="text-lg font-bold mb-2 text-gray-900">
                    Fair Market Value
                  </h4>
                  <p className="text-3xl font-bold text-gray-900">95,000,000</p>
                </div>

                {/* Market Position Card */}
                <div className="bg-white rounded-lg p-6 text-center">
                  <h4 className="text-lg font-bold mb-2 text-gray-900">
                    Market Position
                  </h4>
                  <p className="text-2xl font-bold text-red-500">
                    17% Overpriced
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
                      {dummyResultData.priceAnalysis.aiSummary}
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
              <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.1766548068424!2d3.379205815173966!3d6.5243793954174765!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b2ae68280c1%3A0xdc9e87a367c3d9cb!2sLagos%2C%20Nigeria!5e0!3m2!1sen!2sus!4v1648123456789!5m2!1sen!2sus"
                  width="100%"
                  height="350"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Property Location - Lagos, Nigeria"
                  className="w-full"
                ></iframe>
              </div>

              {/* AI Summary Collapsible */}
              <div className="border-t border-gray-300 pt-4 mt-6">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() =>
                    setIsLocationSummaryOpen(!isLocationSummaryOpen)
                  }
                >
                  <h4 className="text-lg font-bold text-inda-teal">
                    AI Summary
                  </h4>
                  <div className="text-inda-teal">
                    {isLocationSummaryOpen ? (
                      <FaChevronUp className="text-sm" />
                    ) : (
                      <FaChevronDown className="text-sm" />
                    )}
                  </div>
                </div>

                {isLocationSummaryOpen && (
                  <div className="mt-4 p-4 bg-white rounded-lg">
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                      This property is located in a prime area of Lagos with
                      excellent connectivity and infrastructure. The location
                      offers strong resale potential due to ongoing urban
                      development and proximity to major business districts.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-semibold text-sm text-gray-900 mb-2">
                          Strengths:
                        </h5>
                        <ul className="text-xs text-gray-600 space-y-1">
                          <li>• Excellent road access and connectivity</li>
                          <li>• Low flood risk area</li>
                          <li>• Growing commercial activities</li>
                          <li>• Good security infrastructure</li>
                          <li>• Proximity to schools and hospitals</li>
                        </ul>
                      </div>

                      <div>
                        <h5 className="font-semibold text-sm text-gray-900 mb-2">
                          Considerations:
                        </h5>
                        <ul className="text-xs text-gray-600 space-y-1">
                          <li>• Traffic congestion during peak hours</li>
                          <li>• Ongoing construction in surrounding areas</li>
                          <li>• Higher property taxes due to prime location</li>
                          <li>• Limited parking in immediate vicinity</li>
                        </ul>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-green-50 rounded-lg">
                      <p className="text-sm font-medium text-green-800 mb-1">
                        Investment Outlook:
                      </p>
                      <p className="text-xs text-green-700">
                        Expected 8-12% annual appreciation based on current
                        market trends and infrastructure development. Strong
                        rental yield potential of 6-8% annually.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Documents & Trust Indicators */}
          <div className="w-full px-4 sm:px-6">
            <div className="rounded-lg p-6">
              <h3 className="text-xl font-bold mb-6 text-inda-teal">
                Documents & Trust Indicators
              </h3>

              {/* Desktop Table View */}
              <div className="hidden md:block">
                <div className="space-y-2">
                  {/* Table Header */}
                  <div className="grid grid-cols-3 gap-6 py-3 px-4 bg-[#E5E5E566] rounded-lg text-sm font-semibold text-gray-700">
                    <div>Document</div>
                    <div>Status</div>
                    <div>Notes</div>
                  </div>

                  {/* Document Rows */}
                  {dummyResultData.documents.map((doc, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-3 gap-6 py-4 px-4 bg-[#E5E5E566] rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-inda-teal/10 rounded-lg flex items-center justify-center">
                          {doc.status === "verified" && (
                            <FaCheckCircle className="text-green-500 text-sm" />
                          )}
                          {doc.status === "not-provided" && (
                            <FaTimes className="text-red-500 text-sm" />
                          )}
                          {doc.status === "in-review" && (
                            <FaClock className="text-orange-500 text-sm" />
                          )}
                        </div>
                        <span className="text-sm font-medium">{doc.name}</span>
                      </div>
                      <div className="text-sm font-semibold flex items-center gap-2">
                        {doc.status === "verified" && (
                          <FaCheckCircle className="text-green-500 text-sm" />
                        )}
                        {doc.status === "not-provided" && (
                          <FaTimes className="text-red-500 text-sm" />
                        )}
                        {doc.status === "in-review" && (
                          <FaClock className="text-orange-500 text-sm" />
                        )}
                        <span className="capitalize">
                          {doc.status.replace("-", " ")}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">{doc.notes}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-2">
                {dummyResultData.documents.map((doc, index) => (
                  <div key={index} className="bg-[#E5E5E566] rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-inda-teal/10 rounded-lg flex items-center justify-center">
                        {doc.status === "verified" && (
                          <FaCheckCircle className="text-green-500 text-base" />
                        )}
                        {doc.status === "not-provided" && (
                          <FaTimes className="text-red-500 text-base" />
                        )}
                        {doc.status === "in-review" && (
                          <FaClock className="text-orange-500 text-base" />
                        )}
                      </div>
                      <h4 className="font-semibold text-base">{doc.name}</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Status: </span>
                        {doc.status === "verified" && (
                          <FaCheckCircle className="text-green-500 text-sm" />
                        )}
                        {doc.status === "not-provided" && (
                          <FaTimes className="text-red-500 text-sm" />
                        )}
                        {doc.status === "in-review" && (
                          <FaClock className="text-orange-500 text-sm" />
                        )}
                        <span className="font-semibold text-sm capitalize">
                          {doc.status.replace("-", " ")}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Notes: </span>
                        <span className="text-sm">{doc.notes}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* AI Summary Collapsible */}
              <div className="border-t border-gray-300 pt-4 mt-6">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() =>
                    setIsDocumentsSummaryOpen(!isDocumentsSummaryOpen)
                  }
                >
                  <h4 className="text-lg font-bold text-inda-teal flex items-center gap-2">
                    <span className="text-xl">🛡️</span>
                    AI Summary
                  </h4>
                  <div className="text-inda-teal">
                    {isDocumentsSummaryOpen ? (
                      <FaChevronUp className="text-sm" />
                    ) : (
                      <FaChevronDown className="text-sm" />
                    )}
                  </div>
                </div>

                {isDocumentsSummaryOpen && (
                  <div className="mt-4 p-4 bg-white rounded-lg">
                    <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                      {dummyResultData.legalNote}
                    </p>
                    <div className="text-xs">
                      <p className="font-semibold mb-1">Legal Note</p>
                      <p className="text-gray-600">
                        All documents are anonymized under NDPR. Legal advice is
                        still strongly recommended.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ROI Panel */}
          <div className="w-full px-4 sm:px-6">
            <div className="bg-inda-teal rounded-lg p-6 lg:max-w-[59%] lg:mx-auto">
              <h3 className="text-xl font-bold mb-6 text-white">ROI Panel</h3>

              {/* White Container */}
              <div className="bg-white rounded-lg overflow-hidden mb-6">
                {/* Header */}
                <div className="bg-gray-200 px-6 py-4 flex justify-between items-center">
                  <span className="font-semibold text-gray-900">Metric</span>
                  <span className="font-semibold text-gray-900">Value</span>
                </div>

                {/* Metric Rows */}
                <div className="p-6 space-y-4">
                  {dummyResultData.roiMetrics.map((metric, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <span className="text-gray-900 font-medium">
                        {metric.label}
                      </span>
                      <div className="bg-gray-100 border border-gray-200 rounded-lg px-4 py-2 min-w-[120px] text-center">
                        <span className="font-semibold text-gray-900">
                          {metric.value}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Summary Collapsible */}
              <div className="border-t border-white/20 pt-4">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setIsROISummaryOpen(!isROISummaryOpen)}
                >
                  <h4 className="text-lg font-bold text-white">AI Summary</h4>
                  <div className="text-white">
                    {isROISummaryOpen ? (
                      <FaChevronUp className="text-sm" />
                    ) : (
                      <FaChevronDown className="text-sm" />
                    )}
                  </div>
                </div>

                {isROISummaryOpen && (
                  <div className="mt-4 p-4 bg-white rounded-lg">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {dummyResultData.roiSummary}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Verified Comparables */}
          <div className="w-full px-4 sm:px-6">
            <div className="rounded-lg p-6">
              <h3 className="text-xl font-bold mb-6 text-inda-teal">
                Verified Comparables
              </h3>

              {/* Desktop Grid Layout */}
              <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {dummyResultData.comparables.slice(0, 5).map((comp, index) => {
                  const imageUrls = [
                    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                    "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                    "https://images.unsplash.com/photo-1600047648093-3b9e55debc6b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                  ];

                  return (
                    <div
                      key={comp.id}
                      className="bg-[#E5F4F2] border border-gray-200 rounded-lg p-4"
                    >
                      <div className="h-32 rounded-lg mb-3 overflow-hidden bg-gray-200">
                        <img
                          src={imageUrls[index]}
                          alt={comp.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h4 className="font-bold text-sm mb-2 text-gray-900">
                        {comp.title}
                      </h4>
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-1">
                          <span className="text-green-600">
                            Verified Documents ✅
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-green-600">
                            Verified Agent ✅
                          </span>
                        </div>
                        <p className="text-green-600 font-medium">
                          {comp.riskLevel}
                        </p>
                        <p className="text-gray-700 text-xs">
                          Developer Trust Score{" "}
                          <span className="font-semibold">
                            {comp.developerTrustScore}%
                          </span>
                        </p>
                        <p className="font-bold text-gray-900 text-xs mt-2">
                          {comp.price} | {comp.pricePerSqm} | {comp.yield}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Mobile Horizontal Scroll Layout */}
              <div className="md:hidden">
                <div
                  className="flex gap-4 overflow-x-auto pb-2"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  <style jsx>{`
                    div::-webkit-scrollbar {
                      display: none;
                    }
                  `}</style>
                  {dummyResultData.comparables
                    .slice(0, 5)
                    .map((comp, index) => {
                      const imageUrls = [
                        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                        "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                        "https://images.unsplash.com/photo-1600047648093-3b9e55debc6b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                      ];

                      return (
                        <div
                          key={comp.id}
                          className="flex-shrink-0 w-64 bg-[#E5F4F2] border border-gray-200 rounded-lg p-4"
                        >
                          <div className="h-32 rounded-lg mb-3 overflow-hidden bg-gray-200">
                            <img
                              src={imageUrls[index]}
                              alt={comp.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <h4 className="font-bold text-sm mb-2 text-gray-900">
                            {comp.title}
                          </h4>
                          <div className="space-y-1 text-xs">
                            <div className="flex items-center gap-1">
                              <span className="text-green-600">
                                Verified Documents ✅
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-green-600">
                                Verified Agent ✅
                              </span>
                            </div>
                            <p className="text-green-600 font-medium">
                              {comp.riskLevel}
                            </p>
                            <p className="text-gray-700 text-xs">
                              Developer Trust Score{" "}
                              <span className="font-semibold">
                                {comp.developerTrustScore}%
                              </span>
                            </p>
                            <p className="font-bold text-gray-900 text-xs mt-2">
                              {comp.price} | {comp.pricePerSqm} | {comp.yield}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>

          {/* How would you like to proceed? */}
          <div className="w-full px-4 sm:px-6">
            <div className=" rounded-lg  p-6 text-center">
              <h3 className="text-lg font-bold mb-6">
                How would you like to proceed?
              </h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="secondary"
                  className="px-8 py-3 border border-gray-400 text-gray-700 hover:bg-gray-50"
                >
                  Report This Listing
                </Button>
                <Button
                  variant="primary"
                  className="px-8 py-3 bg-inda-teal hover:bg-teal-600 text-white"
                >
                  Save to My Portfolio
                </Button>
              </div>
            </div>
          </div>

          {/* Legal Disclaimer */}
          <div className="w-full px-4 sm:px-6">
            <div className="bg-gray-100 rounded-lg p-6">
              <h4 className="font-semibold mb-3">Legal Disclaimer</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                {dummyResultData.legalDisclaimer}
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </Container>
  );
};

export default Result;
