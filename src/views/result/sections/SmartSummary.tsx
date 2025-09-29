import React from "react";
import { FaBuilding, FaClock, FaMapMarkerAlt } from "react-icons/fa";

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
    result?.snapshot?.agentCompanyName || result?.snapshot?.agentName || "—";
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
          <div className="space-y-3">
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

            <div className="grid grid-cols-2 xl:grid-cols-3 gap-6 xl:gap-12 py-5 px-5 xl:py-6 xl:px-6 bg-[#E5E5E566] font-normal text-sm xl:text-base text-[#101820] rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-inda-teal/10 rounded-lg flex items-center justify-center">
                  <FaBuilding className="text-inda-teal text-lg" />
                </div>
                <span>Bedroom/Bathrooms</span>
              </div>
              <div>
                {bedrooms ?? "—"} Bed./{bathrooms ?? "—"} Bath.
              </div>
              <div>From listing/docs.</div>
            </div>

            <div className="grid grid-cols-2 xl:grid-cols-3 gap-6 xl:gap-12 py-5 px-5 xl:py-6 xl:px-6 bg-[#E5E5E566] font-normal text-sm xl:text-base text-[#101820] rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-inda-teal/10 rounded-lg flex items-center justify-center">
                  <FaBuilding className="text-inda-teal text-lg" />
                </div>
                <span className="font-medium">Seller</span>
              </div>
              <div className="font-medium">{sellerName}</div>
              <div className="font-medium">
                {sellerProfileUrl ? (
                  <a
                    className="text-inda-teal hover:underline"
                    href={sellerProfileUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View Profile here
                  </a>
                ) : (
                  <span>—</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 xl:grid-cols-3 gap-6 xl:gap-12 py-5 px-5 xl:py-6 xl:px-6 bg-[#E5E5E566] font-normal text-sm xl:text-base text-[#101820] rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-inda-teal/10 rounded-lg flex items-center justify-center">
                  <FaClock className="text-inda-teal text-lg" />
                </div>
                <span className="font-medium">Delivery Date</span>
              </div>
              <div className="font-medium">{deliveryLabel}</div>
              <div className="flex items-center gap-2">{deliverySource}</div>
            </div>

            <div className="grid grid-cols-2 xl:grid-cols-3 gap-6 xl:gap-12 py-5 px-5 xl:py-6 xl:px-6 bg-[#E5E5E566] font-normal text-sm xl:text-base text-[#101820] rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-inda-teal/10 rounded-lg flex items-center justify-center">
                  <FaMapMarkerAlt className="text-inda-teal text-lg" />
                </div>
                <span className="font-medium">Status</span>
              </div>
              <div className="font-medium">{listingStatus || "—"}</div>
              <div className="flex items-center gap-2">
                {listingStatus ? "From listing/docs." : "—"}
              </div>
            </div>
          </div>
        </div>

        <div className="md:hidden space-y-4">
          <div className="bg-[#E5E5E566] rounded-lg p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-inda-teal/10 rounded-lg flex items-center justify-center">
                <FaBuilding className="text-inda-teal text-lg" />
              </div>
              <h4 className="font-semibold text-lg">Bedroom/Bathrooms</h4>
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-500">Details: </span>
                <span className="font-semibold text-base">
                  {bedrooms ?? "—"} Bed./{bathrooms ?? "—"} Bath.
                </span>
              </div>
              <div>
                <span className="text-sm text-gray-500">Status: </span>
                <span className="text-sm">From listing/docs.</span>
              </div>
            </div>
          </div>

          <div className="bg-[#E5E5E566] rounded-lg p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-inda-teal/10 rounded-lg flex items-center justify-center">
                <FaBuilding className="text-inda-teal text-lg" />
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
                {sellerProfileUrl ? (
                  <a
                    className="text-sm text-inda-teal cursor-pointer hover:underline"
                    href={sellerProfileUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View Profile here
                  </a>
                ) : (
                  <span className="text-sm">—</span>
                )}
              </div>
            </div>
          </div>

          <div className="bg-[#E5E5E566] rounded-lg p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-inda-teal/10 rounded-lg flex items-center justify-center">
                <FaClock className="text-inda-teal text-lg" />
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

          <div className="bg-[#E5E5E566] rounded-lg p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-inda-teal/10 rounded-lg flex items-center justify-center">
                <FaMapMarkerAlt className="text-inda-teal text-lg" />
              </div>
              <h4 className="font-semibold text-lg">Status</h4>
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-500">Details: </span>
                <span className="font-semibold text-base">
                  {listingStatus || "—"}
                </span>
              </div>
              <div>
                <span className="text-sm text-gray-500">Status: </span>
                <span className="text-sm">
                  {listingStatus ? "From listing/docs." : "—"}
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
