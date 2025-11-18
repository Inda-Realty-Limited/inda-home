import React from "react";
import { FaShieldAlt, FaBalanceScale, FaBuilding } from "react-icons/fa";

type Props = {
  sellerName?: string;
  yearsInBusiness?: number;
  completedProjects?: number;
  onTimeDelivery?: number;
  clientRating?: number;
  deliveryScore?: number;
  indaScore?: number;
  litigationHistory?: string;
  registeredLocation?: string;
};

const SellerCredibility: React.FC<Props> = ({
  sellerName = "Landmark Properties Ltddf",
  yearsInBusiness = 8,
  completedProjects = 24,
  onTimeDelivery = 92,
  clientRating = 4.6,
  deliveryScore = 60,
  indaScore = 75,
  litigationHistory = "1 Minor Dispute founddf",
  registeredLocation = "Redan, CACdf",
}) => {
  // Get initials from seller name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div id="seller-credibility" className="w-full px-6 ">
      <div className="rounded-lg p-6 bg-[#4EA8A114] rounded-lg">
        <h3 className="text-2xl md:text-3xl font-bold mb-8 text-[#4EA8A1]">
          Seller Credibility
        </h3>

        {/* Seller Info Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-20 h-20 rounded-full bg-[#4EA8A1] flex items-center justify-center text-white text-2xl font-bold">
            {getInitials(sellerName)}
          </div>
          <div>
            <h4 className="text-xl md:text-2xl font-bold text-[#101820]">
              {sellerName}
            </h4>
            <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
              <span>{yearsInBusiness} years in Business</span>
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
              <span>{completedProjects} Completed projects</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-[#D9E9E8] rounded-2xl p-6 sm:p-8">
            <h5 className="text-4xl sm:text-5xl font-bold text-[#4EA8A1] mb-2">
              {onTimeDelivery}%
            </h5>
            <p className="text-base sm:text-lg text-gray-700 font-medium">
              On-Time Delivery
            </p>
          </div>
          <div className="bg-[#D9E9E8] rounded-2xl p-6 sm:p-8">
            <h5 className="text-4xl sm:text-5xl font-bold text-[#101820] mb-2">
              {clientRating.toFixed(1)}
            </h5>
            <p className="text-base sm:text-lg text-gray-700 font-medium">
              Client Rating
            </p>
          </div>
        </div>

        {/* Credibility Metrics */}
        <div className="space-y-4">
          {/* Inda Score */}
          <div className="flex items-center justify-between py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <FaShieldAlt className="text-gray-600 text-xl" />
              <span className="text-base sm:text-lg font-semibold text-[#101820]">
                Inda Score
              </span>
            </div>
            <span className="px-4 py-2 bg-[#4EA8A1] text-white rounded-full text-sm font-semibold">
              {indaScore}%
            </span>
          </div>

          {/* Litigation History */}
          <div className="flex items-center justify-between py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <FaBalanceScale className="text-gray-600 text-xl" />
              <span className="text-base sm:text-lg font-semibold text-[#101820]">
                Litigation History
              </span>
            </div>
            <span className="px-4 py-2 bg-[#E5F4F2] text-[#4EA8A1] rounded-full text-sm font-medium border border-[#4EA8A1]/20">
              {litigationHistory}
            </span>
          </div>

          {/* Registered Seller */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <FaBuilding className="text-gray-600 text-xl" />
              <span className="text-base sm:text-lg font-semibold text-[#101820]">
                Registered Seller
              </span>
            </div>
            <span className="px-4 py-2 bg-[#4EA8A1] text-white rounded-full text-sm font-semibold">
              {registeredLocation}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerCredibility;

