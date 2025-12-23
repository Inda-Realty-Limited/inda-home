import React from "react";
import { FiHome, FiZap, FiDroplet, FiShield } from "react-icons/fi";

type InspectionItem = {
  id: string;
  title: string;
  description: string;
  status: "verified" | "pending" | "failed";
  icon: string;
};

type Props = {
  items: InspectionItem[];
  photos: {
    exterior: string[];
    interior: string[];
    electrical?: string[];
    neighbourhood?: string[];
  };
};

const OnSiteInspection: React.FC<Props> = ({ items, photos }) => {
  return (
    <div className="w-full px-6">
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
            <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
            <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
            <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
            <circle cx="6.5" cy="6.5" r="1.5" fill="currentColor"/>
            <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/>
            <circle cx="6.5" cy="17.5" r="1.5" fill="currentColor"/>
            <circle cx="17.5" cy="17.5" r="1.5" fill="currentColor"/>
          </svg>
          On-Site Inspection Report
        </h2>

        {/* Inspection Checklist */}
        <div className="space-y-3 mb-8">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between gap-4 p-4 rounded-xl bg-[#E5E5E5CC]"
            >
              <div className="flex items-start gap-3 flex-1">
                <div className="flex-shrink-0 text-2xl mt-0.5">
                  {getIcon(item.icon)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-900 mb-1">
                    {item.title}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {item.description}
                  </p>
                </div>
              </div>
              <div className="flex-shrink-0">
                <StatusBadge status={item.status} />
              </div>
            </div>
          ))}
        </div>

        {/* Photo Documentation */}
        <div className="border-2 border-inda-teal rounded-2xl p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Photo Documentation
          </h3>
          
          <div className="space-y-6">
            {/* Top Row: Exterior View and Interior View */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Exterior View */}
              <div>
                <h4 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <FiHome size={18} />
                  Exterior View
                </h4>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {photos.exterior.map((src, i) => (
                    <div key={`ext-${i}`} className="aspect-square bg-[#E5F5F4] rounded-xl"></div>
                  ))}
                </div>
              </div>

              {/* Interior View */}
              <div>
                <h4 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Interior View
                </h4>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {photos.interior.map((src, i) => (
                    <div key={`int-${i}`} className="aspect-square bg-[#E5F5F4] rounded-xl"></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Row: Electrical Systems and Neighbourhood */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Electrical Systems */}
              {photos.electrical && (
                <div>
                  <h4 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <FiZap size={18} />
                    Electrical Systems
                  </h4>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    {photos.electrical.map((src, i) => (
                      <div key={`elec-${i}`} className="aspect-square bg-[#E5F5F4] rounded-xl"></div>
                    ))}
                  </div>
                </div>
              )}

              {/* Neighbourhood */}
              {photos.neighbourhood && (
                <div>
                  <h4 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Neighbourhood
                  </h4>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    {photos.neighbourhood.map((src, i) => (
                      <div key={`neigh-${i}`} className="aspect-square bg-[#E5F5F4] rounded-xl"></div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const getIcon = (type: string) => {
  switch (type) {
    case "structure": return "🏠";
    case "electrical": return "🔌";
    case "plumbing": return "🔧";
    case "finishes": return "🎨";
    case "security": return "🛡️";
    case "amenities": return "🏊";
    default: return "📋";
  }
};

const StatusBadge = ({ status }: { status: string }) => {
  if (status === "verified") {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-inda-teal text-white">
        Verified
        <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 5L4.5 8.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </span>
    );
  } else if (status === "pending") {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-500 text-white">
        Pending
        <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
           <path d="M7.07466 0.310468C6.84976 -0.103489 6.15037 -0.103489 5.92548 0.310468L0.0755752 11.0708C0.0231137 11.1673 -0.00283621 11.2753 0.000245761 11.3844C0.00332773 11.4936 0.0353369 11.6 0.0931642 11.6936C0.150992 11.7871 0.232671 11.8644 0.33027 11.9181C0.427868 11.9718 0.538068 12 0.650165 12H12.35C12.4621 12.0002 12.5723 11.9722 12.6699 11.9185C12.7676 11.8649 12.8493 11.7876 12.9071 11.6941C12.9649 11.6005 12.9968 11.494 12.9998 11.3849C13.0027 11.2758 12.9766 11.1678 12.9239 11.0714L7.07466 0.310468ZM7.15005 10.1011H5.85008V8.83519H7.15005V10.1011ZM5.85008 7.56927V4.40446H7.15005L7.15071 7.56927H5.85008Z" fill="white"/>
        </svg>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-red-500 text-white">
      Failed
    </span>
  );
};

export default OnSiteInspection;
