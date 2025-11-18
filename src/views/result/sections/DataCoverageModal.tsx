import React from "react";
import Modal from "@/components/inc/Modal";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onUnlock: () => void;
  dataPoints: number;
  maxDataPoints?: number;
  listingUrl?: string;
};

const DataCoverageModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onUnlock,
  dataPoints,
  maxDataPoints = 500,
  listingUrl,
}) => {
  console.log("=== DataCoverageModal Props ===");
  console.log("dataPoints:", dataPoints);
  console.log("maxDataPoints:", maxDataPoints);
  console.log("listingUrl:", listingUrl);
  
  const percentage = Math.round((dataPoints / maxDataPoints) * 100);
  console.log("calculated percentage:", percentage);

  // Determine coverage level and color
  const getCoverageLevel = (pct: number) => {
    if (pct >= 86) return { color: "#4EA8A1" }; // Teal - Full Coverage
    if (pct >= 61) return { color: "#F59E0B" }; // Orange - High Coverage
    if (pct >= 31) return { color: "#EAB308" }; // Yellow - Partial Coverage
    return { color: "#EF4444" }; // Red - Low Coverage
  };

  const coverage = getCoverageLevel(percentage);

  // Calculate arc parameters for subdivided circular progress
  const radius = 85;
  const centerX = 104;
  const centerY = 104;
  
  // Arc spans from -225° to 45° (270° total, leaving 90° gap at right) - rotated 90° left
  const startAngle = -225;
  const endAngle = 45;
  const totalArcDegrees = endAngle - startAngle; // 270°
  
  // Calculate the colored portion (data points percentage)
  const coloredArcDegrees = (percentage / 100) * totalArcDegrees;
  const coloredEndAngle = startAngle + coloredArcDegrees;
  
  // Helper function to convert degrees to radians
  const toRadians = (deg: number) => (deg * Math.PI) / 180;
  
  // Helper function to get point on circle
  const getPoint = (angle: number, r: number) => {
    const rad = toRadians(angle);
    return {
      x: centerX + r * Math.cos(rad),
      y: centerY + r * Math.sin(rad),
    };
  };
  
  // Create SVG arc path
  const createArcPath = (startDeg: number, endDeg: number, r: number) => {
    const start = getPoint(startDeg, r);
    const end = getPoint(endDeg, r);
    const largeArc = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="md">
      <div className="flex flex-col items-center text-center px-4 py-2">
        {/* Greeting */}
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Hi there,
        </h2>
        
        {/* Description */}
        <p className="text-gray-700 mb-1">
          Here's what we found based on your search.
        </p>
        
        {/* Listing URL */}
        {listingUrl && (
          <p className="text-sm text-gray-600 mb-6">
            Results for the listing link{" "}
            <a
              href={listingUrl}
              target="_blank"
              rel="noreferrer"
              className="text-inda-teal hover:underline"
            >
              {listingUrl.length > 25 ? `${listingUrl.substring(0, 25)}...` : listingUrl}
            </a>
            .......
          </p>
        )}

        {/* Dark Card with Circular Progress Chart */}
        <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 rounded-3xl p-6 w-72 mb-6 shadow-2xl relative overflow-hidden">
          {/* Grid pattern overlay */}
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `
                radial-gradient(circle at 50% 50%, transparent 0%, transparent 48%, rgba(255,255,255,0.15) 48%, rgba(255,255,255,0.15) 50%, transparent 50%),
                repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(255,255,255,0.1) 19px, rgba(255,255,255,0.1) 20px),
                repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(255,255,255,0.1) 19px, rgba(255,255,255,0.1) 20px)
              `,
              backgroundSize: '100% 100%, 20px 20px, 20px 20px',
              backgroundPosition: 'center, center, center'
            }}
          />
          
          <div className="relative w-52 h-52 mx-auto mb-0">
            <svg width="208" height="208" viewBox="0 0 208 208">
              {/* Background arc (dark gray) - remaining portion */}
              <path
                d={createArcPath(coloredEndAngle, endAngle, radius)}
                fill="none"
                stroke="#4B5563"
                strokeWidth="16"
                strokeLinecap="round"
              />
              
              {/* Progress arc (colored based on coverage) - data points portion */}
              <path
                d={createArcPath(startAngle, coloredEndAngle, radius)}
                fill="none"
                stroke={coverage.color}
                strokeWidth="16"
                strokeLinecap="round"
              />
              
              {/* Outer circle outline (light beige/cream) */}
              <path
                d={createArcPath(startAngle, endAngle, radius + 8)}
                fill="none"
                stroke="#D1D5DB"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>

            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {/* Percentage indicator - positioned at center, above DATA POINTS */}
              <div className="text-sm font-medium text-gray-300 mb-3">
                ↑ {percentage}%
              </div>
              
              <div className="text-sm text-gray-300 mb-2 tracking-wider font-semibold">DATA POINTS</div>
              <div className="text-4xl font-bold text-inda-teal mb-3" style={{ fontFamily: 'system-ui, -apple-system' }}>
                {dataPoints}
              </div>
            </div>
          </div>
          
          {/* Bottom progress bar - outside the arc */}
          <div className="w-40 mx-auto">
            <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-500 rounded-full"
                style={{
                  width: `${percentage}%`,
                  background: 'linear-gradient(to right, #EAB308, #F59E0B)',
                }}
              />
            </div>
            <div className="text-xs text-gray-400 mt-1.5 text-center">
              {percentage}% of {maxDataPoints}
            </div>
          </div>
        </div>

        {/* Question */}
        <h3 className="text-xl font-bold text-gray-900 mb-5">
          How would you like to proceed?
        </h3>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center mb-2">
          <button
            onClick={onUnlock}
            className="px-8 py-3 bg-inda-teal text-white rounded-lg font-medium hover:bg-inda-teal/90 transition-colors flex items-center gap-2 shadow-md"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M12.6667 7.33333H3.33333C2.59695 7.33333 2 7.93029 2 8.66667V13.3333C2 14.0697 2.59695 14.6667 3.33333 14.6667H12.6667C13.403 14.6667 14 14.0697 14 13.3333V8.66667C14 7.93029 13.403 7.33333 12.6667 7.33333Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4.66667 7.33333V4.66667C4.66667 3.78261 5.01786 2.93477 5.64298 2.30964C6.2681 1.68452 7.11594 1.33333 8 1.33333C8.88406 1.33333 9.7319 1.68452 10.357 2.30964C10.9821 2.93477 11.3333 3.78261 11.3333 4.66667V7.33333"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Unlock
          </button>
          
          <button
            onClick={onClose}
            className="px-8 py-3 bg-inda-teal text-white rounded-lg font-medium hover:bg-inda-teal/90 transition-colors flex items-center gap-2 shadow-md"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M12.6667 8H3.33333M3.33333 8L7.33333 12M3.33333 8L7.33333 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DataCoverageModal;

