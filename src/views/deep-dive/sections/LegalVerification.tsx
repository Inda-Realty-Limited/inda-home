import React from "react";
import {
  FiFileText,
  FiFile,
  FiAlertTriangle,
  FiHome as FiBuilding,
  FiAward,
} from "react-icons/fi";

type VerificationItem = {
  id: string;
  title: string;
  description: string;
  status: "verified" | "pending";
  icon: string;
};

type Props = {
  items: VerificationItem[];
};

const getIcon = (iconName: string) => {
  const iconMap: { [key: string]: React.ReactNode } = {
    certificate: <FiFileText size={20} />,
    document: <FiFile size={20} />,
    warning: <FiAlertTriangle size={20} />,
    building: <FiBuilding size={20} />,
    gavel: <FiAward size={20} />,
  };
  return iconMap[iconName] || <FiFileText size={20} />;
};

const LegalVerification: React.FC<Props> = ({ items }) => {
  return (
    <div className="w-full px-6">
      <div className="bg-gray-200/20 border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span>⚖️</span> Legal Verification
        </h2>

        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between gap-4 p-4 border bg-[#E5E5E5CC] border-gray-200 rounded-xl hover:border-inda-teal/30 transition-colors"
            >
              <div className="flex items-start gap-3 flex-1">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-700">
                  {getIcon(item.icon)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-gray-900 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </div>

              <div className="flex-shrink-0">
                {item.status === "verified" ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-inda-teal text-white border border-inda-teal/20">
                    Verified
                    <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 5L4.5 8.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-600 text-amber-200 border border-amber-200">
                    Pending
                    <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7.07466 0.310468C6.84976 -0.103489 6.15037 -0.103489 5.92548 0.310468L0.0755752 11.0708C0.0231137 11.1673 -0.00283621 11.2753 0.000245761 11.3844C0.00332773 11.4936 0.0353369 11.6 0.0931642 11.6936C0.150992 11.7871 0.232671 11.8644 0.33027 11.9181C0.427868 11.9718 0.538068 12 0.650165 12H12.35C12.4621 12.0002 12.5723 11.9722 12.6699 11.9185C12.7676 11.8649 12.8493 11.7876 12.9071 11.6941C12.9649 11.6005 12.9968 11.494 12.9998 11.3849C13.0027 11.2758 12.9766 11.1678 12.9239 11.0714L7.07466 0.310468ZM7.15005 10.1011H5.85008V8.83519H7.15005V10.1011ZM5.85008 7.56927V4.40446H7.15005L7.15071 7.56927H5.85008Z" fill="#F9F9F9"/>
                    </svg>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LegalVerification;

