import React from "react";
import { FiCheckCircle, FiMapPin, FiTrendingUp, FiDownload, FiShoppingCart } from "react-icons/fi";
import { useRouter } from "next/router";

type Metric = {
  label: string;
  value: string;
  icon: string;
};

type Props = {
  status: "proceed" | "caution" | "decline";
  message: string;
  metrics: Metric[];
};

const getIcon = (iconName: string) => {
  const iconMap: { [key: string]: React.ReactNode } = {
    check: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.333 21.3327L25.333 10.666L29.333 21.3327C28.173 22.1993 26.773 22.666 25.333 22.666C23.893 22.666 22.493 22.1993 21.333 21.3327Z" stroke="#4EA8A1" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M2.66699 21.3327L6.66699 10.666L10.667 21.3327C9.50699 22.1993 8.10699 22.666 6.66699 22.666C5.22699 22.666 3.82699 22.1993 2.66699 21.3327Z" stroke="#4EA8A1" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M9.33301 28H22.6663" stroke="#4EA8A1" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M16 4V28" stroke="#4EA8A1" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M4 9.33268H6.66667C9.33333 9.33268 13.3333 7.99935 16 6.66602C18.6667 7.99935 22.6667 9.33268 25.3333 9.33268H28" stroke="#4EA8A1" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    ,
    location: <FiMapPin size={20} />,
    trending: <FiTrendingUp size={20} />,
  };
  return iconMap[iconName] || <FiCheckCircle size={20} />;
};

const FinalVerdict: React.FC<Props> = ({ status, message, metrics }) => {
  const router = useRouter();

  const getStatusColor = () => {
    switch (status) {
      case "proceed":
        return {
          bg: "bg-inda-teal",
          border: "border-inda-teal",
          text: "text-inda-teal",
        };
      case "caution":
        return {
          bg: "bg-amber-500",
          border: "border-amber-500",
          text: "text-amber-600",
        };
      case "decline":
        return {
          bg: "bg-red-500",
          border: "border-red-500",
          text: "text-red-600",
        };
      default:
        return {
          bg: "bg-inda-teal",
          border: "border-inda-teal",
          text: "text-inda-teal",
        };
    }
  };

  const colors = getStatusColor();

  return (
    <div className="w-full px-6">
      <div className="bg-inda-teal/10 border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span><svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.75 13.25H4.5M22 13.25H25.75M13.25 25.75V22M13.25 4.5V0.75" stroke="#101820" stroke-opacity="0.9" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M10.75 13.25H15.75M13.25 15.75V10.75" stroke="#101820" stroke-opacity="0.9" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M7 2.42252C8.89931 1.32342 11.0556 0.746398 13.25 0.750017C20.1537 0.750017 25.75 6.34627 25.75 13.25C25.75 20.1538 20.1537 25.75 13.25 25.75C6.34625 25.75 0.75 20.1538 0.75 13.25C0.75 10.9738 1.35875 8.83752 2.4225 7.00002" stroke="#101820" stroke-opacity="0.9" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
        </span>
            Final Verdict
        </h2>

        {/* Status Card */}
        <div className={`${colors.bg} rounded-2xl p-8 text-center mb-8`}>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <FiCheckCircle size={32} className="text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2 uppercase">
            {status}
          </h3>
          <p className="text-white/90 text-sm">{message}</p>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="text-center p-4 border border-gray-200 rounded-xl"
            >
              <div className="flex justify-center mb-2 text-inda-teal">
                {getIcon(metric.icon)}
              </div>
              <p className="text-xs text-gray-600 mb-1">{metric.label}</p>
              <p className="text-sm font-bold text-gray-900">{metric.value}</p>
            </div>
          ))}
        </div>

        {/* Action Section */}
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-900 mb-6">
            How would you like to proceed?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                // Handle download
                alert("Download functionality to be implemented");
              }}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-inda-teal text-white rounded-lg font-medium hover:bg-inda-teal/90 transition-colors"
            >
              <FiDownload size={18} />
              Download Report
            </button>
            <button
              onClick={() => {
                router.push("/");
              }}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-inda-teal text-white rounded-lg font-medium hover:bg-inda-teal/90 transition-colors"
            >
              <FiShoppingCart size={18} />
              Order Deeper Dive
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalVerdict;

