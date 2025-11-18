import React from "react";
import { FaBuilding, FaClock, FaMapMarkerAlt } from "react-icons/fa";
import BedroomIcon from "@/components/icons/BedroomIcon";
import SellerIcon from "@/components/icons/SellerIcon";
import DeliveryIcon from "@/components/icons/DeliveryIcon";
import StatusIcon from "@/components/icons/StatusIcon";

type Props = {
  result: any;
  deliveryLabel: string;
  deliverySource: string;
  listingStatus: string | null;
};

const SmartSummary: React.FC<Props> = ({
  result,
  deliveryLabel,
  deliverySource,
  listingStatus,
}) => {
  const sellerName =
    result?.snapshot?.agentCompanyName || result?.snapshot?.agentName || "—df";
  const sellerProfileUrl =
    (result?.snapshot as any)?.agentCompanyUrl ||
    (result?.snapshot as any)?.agentUrl ||
    null;
  // Derive bedrooms/bathrooms strictly from available API/snapshot fields
  const bedrooms: number | string | null =
    (result?.snapshot as any)?.bedrooms ?? (result as any)?.bedrooms ?? null;
  const bathrooms: number | string | null =
    (result?.snapshot as any)?.bathrooms ?? (result as any)?.bathrooms ?? null;
  return (
    <div className="w-full px-6">
      <div className="">
        <div className="hidden md:block">
          <div className="space-y-0">
            {/* Title */}
            <h2 className="text-2xl font-bold mb-6 text-inda-teal">
              Smart Summary
            </h2>

            {/* Header Row */}
            <div className="bg-white rounded-t-2xl border-b border-gray-200">
              <div className="grid grid-cols-3 gap-8 py-4 px-6">
                <div className="text-base font-semibold text-gray-900">Info</div>
                <div className="text-base font-semibold text-gray-900">Details</div>
                <div className="text-base font-semibold text-gray-900">Status</div>
              </div>
            </div>

            {/* Data Rows */}

            <div className="bg-[#4EA8A114] border-b border-gray-200">
              <div className="grid grid-cols-3 gap-8 py-5 px-6 items-center">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-900">Seller</span>
                </div>
                <div className="text-sm text-gray-700">{sellerName}</div>
                <div className="text-sm">
                  <a
                    className="text-inda-teal hover:underline cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById('seller-credibility')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    View Profile here
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-[#4EA8A114] border-b border-gray-200">
              <div className="grid grid-cols-3 gap-8 py-5 px-6 items-center">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-900">Delivery Date</span>
                </div>
                <div className="text-sm text-gray-700">{deliveryLabel}</div>
                <div className="text-sm text-gray-700">{deliverySource}</div>
              </div>
            </div>

            <div className="bg-[#4EA8A114] rounded-b-2xl">
              <div className="grid grid-cols-3 gap-8 py-5 px-6 items-center">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-900">Status</span>
                </div>
                <div className="text-sm text-gray-700">{listingStatus || "—df"}</div>
                <div className="text-sm text-gray-700">
                  {listingStatus ? "Off-Plan/Completed" : "—df"}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="md:hidden space-y-4">
          <div className="bg-white/60 border border-gray-100 rounded-lg p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-inda-teal/10 rounded-lg flex items-center justify-center">
                <SellerIcon width={24} height={24} />
              </div>
              <h4 className="font-semibold text-lg">Seller</h4>
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-500">Details: </span>
                <span className="font-semibold text-base">{sellerName}</span>
              </div>
              <div>
                <span className="text-sm text-gray-500">Status: </span>
                <a
                  className="text-sm text-inda-teal cursor-pointer hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('seller-credibility')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  View Profile here
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white/60 border border-gray-100 rounded-lg p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-inda-teal/10 rounded-lg flex items-center justify-center">
                <DeliveryIcon width={24} height={20} />
              </div>
              <h4 className="font-semibold text-lg">Delivery Date</h4>
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-500">Details: </span>
                <span className="font-semibold text-base">{deliveryLabel}</span>
              </div>
              <div>
                <span className="text-sm text-gray-500">Status: </span>
                <span className="text-sm">{deliverySource}</span>
              </div>
            </div>
          </div>

          <div className="bg-white/60 border border-gray-100 rounded-lg p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-inda-teal/10 rounded-lg flex items-center justify-center">
                <StatusIcon width={24} height={24} />
              </div>
              <h4 className="font-semibold text-lg">Status</h4>
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-500">Details: </span>
                <span className="font-semibold text-base">
                  {listingStatus || "—df"}
                </span>
              </div>
              <div>
                <span className="text-sm text-gray-500">Status: </span>
                <span className="text-sm">
                  {listingStatus ? "From listing/docs." : "—df"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartSummary;
