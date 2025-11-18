import React from "react";

type Props = {
  listingUrl?: string;
  propertyTitle?: string;
};

const ShareReport: React.FC<Props> = ({ listingUrl, propertyTitle }) => {
  const handleShare = () => {
    const shareUrl = window.location.href;
    const shareText = propertyTitle 
      ? `Check out this property report: ${propertyTitle}` 
      : "Check out this property report";

    if (navigator.share) {
      navigator
        .share({
          title: "Inda Property Report",
          text: shareText,
          url: shareUrl,
        })
        .catch((error) => console.log("Error sharing:", error));
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert("Link copied to clipboard!");
      });
    }
  };

  return (
    <div className="w-full px-6">
      <div className="bg-[#DDECEB] p-4 rounded-3xl">
        <button
          onClick={handleShare}
          className="w-full bg-white hover:bg-gray-50 transition-colors duration-200 rounded-2xl p-4 flex items-center gap-3 group shadow-sm"
        >
          <div className="w-10 h-10 bg-[#DDECEB] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
            <svg
              width="19"
              height="16"
              viewBox="0 0 19 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18.75 7.29167L11.4583 0V4.16667C4.16667 5.20833 1.04167 10.4167 0 15.625C2.60417 11.9792 6.25 10.3125 11.4583 10.3125V14.5833L18.75 7.29167Z"
                fill="#101820"
              />
            </svg>
          </div>
          <span className="text-[#101820] font-medium text-lg">
            Share Report
          </span>
        </button>
      </div>
    </div>
  );
};

export default ShareReport;

