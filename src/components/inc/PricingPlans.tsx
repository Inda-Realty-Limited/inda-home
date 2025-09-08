import { Text } from "@/components";
import React from "react";

type PricingPlansProps = {
  onChoosePlan?: (plan: string) => void;
};

const PricingPlans: React.FC<PricingPlansProps> = ({ onChoosePlan }) => {
  return (
    <div className="w-full">
      <div className="max-w-[1314px] mx-auto bg-white rounded-[24px] ">
        <div className="bg-[rgba(105,217,188,0.35)] rounded-[24px] sm:rounded-[32px] p-6 sm:p-10 shadow-xl">
          <div className="text-left mb-8">
            <Text className="text-inda-dark font-bold text-2xl sm:text-3xl mb-2">
              Plans & Pricing
            </Text>
            <p className="font-normal text-sm sm:text-md text-[#556457]">
              Inda Pricing Guide (Lagos Listings Only)
            </p>
          </div>

          <div className="bg-[#F9F9F980] rounded-[16px] sm:rounded-[24px] p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Free */}
            <div className="w-full">
              <div className="p-4 sm:p-6 h-full flex flex-col transition-all duration-300 rounded-lg border border-transparent hover:border-transparent outline-none ring-0 focus-within:ring-0 focus-within:outline-none">
                <div className="text-left mb-4 sm:mb-6">
                  <div className="font-bold text-3xl sm:text-4xl mb-2 text-gray-900">
                    ₦0
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                    Free Report
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-4">
                    Delivery Time: &lt; 20 seconds
                  </p>
                </div>
                <div className="flex-1 mb-4 sm:mb-6">
                  <h4 className="text-gray-900 mb-3 text-xs sm:text-sm font-semibold">
                    What You Get:
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
                    <li className="flex items-center gap-3">
                      <span className="text-[#4ea8a1] text-base sm:text-lg">
                        ✓
                      </span>
                      Inda Score
                    </li>
                  </ul>
                </div>
                <button
                  disabled
                  aria-disabled="true"
                  className="w-full bg-gray-300 text-gray-600 py-2.5 sm:py-3 px-4 sm:px-6 rounded-full font-medium cursor-not-allowed transition-all duration-300 text-sm sm:text-base outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 hover:outline-none"
                >
                  Choose plan
                </button>
              </div>
            </div>

            {/* Instant */}
            <div className="w-full">
              <div className="p-4 sm:p-6 h-full flex flex-col transition-all duration-300 rounded-lg border border-transparent hover:border-transparent outline-none ring-0 focus-within:ring-0 focus-within:outline-none ">
                <div className="text-left mb-4 sm:mb-6">
                  <div className="font-bold text-3xl sm:text-4xl mb-2 text-gray-900">
                    ₦3,000
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                    Inda Instant Report
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-4">
                    Delivery Time: &lt; 30 seconds (Instant)
                  </p>
                </div>
                <div className="flex-1 mb-4 sm:mb-6">
                  <h4 className="text-gray-900 mb-3 text-xs sm:text-sm font-semibold">
                    What You Get:
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
                    <li className="flex items-center gap-3">
                      <span className="text-[#4ea8a1] text-base sm:text-lg">
                        ✓
                      </span>
                      Inda Score
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-[#4ea8a1] text-base sm:text-lg">
                        ✓
                      </span>
                      Micro-location market data
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-[#4ea8a1] text-base sm:text-lg">
                        ✓
                      </span>
                      AI market valuation
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-[#4ea8a1] text-base sm:text-lg">
                        ✓
                      </span>
                      Overpricing check
                    </li>
                  </ul>
                </div>
                <button
                  onClick={() => onChoosePlan?.("instant")}
                  className="w-full bg-[#4ea8a1] text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-full font-medium hover:bg-[#3d8a84] transition-all duration-300 text-sm sm:text-base outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 hover:outline-none"
                >
                  Choose plan
                </button>
              </div>
            </div>

            {/* Deep Dive */}
            <div className="w-full">
              <div className="bg-[#2A2A2A] rounded-[16px] sm:rounded-[24px] p-4 sm:p-6 h-full flex flex-col shadow-2xl border border-transparent hover:border-transparent outline-none ring-0 focus-within:ring-0 focus-within:outline-none">
                <div className="text-left mb-4 sm:mb-6">
                  <div className="font-bold text-3xl sm:text-4xl mb-2 text-white">
                    ₦75,000
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                    Deep Dive Report
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-300 mb-4">
                    Delivery Time: 24-48 hours (via email PDF)
                  </p>
                </div>
                <div className="flex-1 mb-4 sm:mb-6">
                  <h4 className="text-white mb-2 text-xs sm:text-sm font-semibold">
                    What You Get:{" "}
                    <span className="font-normal text-gray-300">
                      Everything in Instant Report
                    </span>{" "}
                    <span className="text-white font-semibold">Plus:</span>
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-gray-300">
                    <li className="flex items-center gap-3">
                      <span className="text-white text-base sm:text-lg">✓</span>
                      Certificate of Occupancy (C of O) or Deed check
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-white text-base sm:text-lg">✓</span>
                      Governor's consent check
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-white text-base sm:text-lg">✓</span>
                      Zoning compliance check
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-white text-base sm:text-lg">✓</span>
                      Litigation search (court registry)
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-white text-base sm:text-lg">✓</span>
                      Survey plan verification (boundaries & location)
                    </li>
                  </ul>
                </div>
                <button
                  disabled
                  aria-disabled="true"
                  className="w-full bg-gray-500/40 text-white/70 py-2.5 sm:py-3 px-4 sm:px-6 rounded-full font-medium cursor-not-allowed transition-all duration-300 text-sm sm:text-base outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 hover:outline-none"
                >
                  Choose plan
                </button>
              </div>
            </div>

            {/* Deeper Dive */}
            <div className="w-full">
              <div className="p-4 sm:p-6 h-full flex flex-col transition-all duration-300 rounded-lg border border-transparent hover:border-transparent outline-none ring-0 focus-within:ring-0 focus-within:outline-none">
                <div className="text-left mb-4 sm:mb-6">
                  <div className="font-bold text-3xl sm:text-4xl mb-2 text-gray-900">
                    ₦100,000
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                    Deeper Dive
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-4">
                    Delivery Time: 2-4 Days
                  </p>
                </div>
                <div className="flex-1 mb-4 sm:mb-6">
                  <h4 className="text-gray-900 mb-3 text-xs sm:text-sm font-semibold">
                    What You Get:{" "}
                    <span className="font-normal text-gray-600">
                      Everything in Instant Report
                    </span>{" "}
                    <span className="text-[#4ea8a1] font-semibold">Plus:</span>
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
                    <li className="flex items-center gap-3">
                      <span className="text-[#4ea8a1] text-base sm:text-lg">
                        ✓
                      </span>
                      Seller identity verification
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-[#4ea8a1] text-base sm:text-lg">
                        ✓
                      </span>
                      On-site property visit
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-[#4ea8a1] text-base sm:text-lg">
                        ✓
                      </span>
                      Photo evidence
                    </li>
                  </ul>
                </div>
                <button
                  disabled
                  aria-disabled="true"
                  className="w-full bg-gray-300 text-gray-600 py-2.5 sm:py-3 px-4 sm:px-6 rounded-full font-medium cursor-not-allowed transition-all duration-300 text-sm sm:text-base outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 hover:outline-none"
                >
                  Choose plan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPlans;
