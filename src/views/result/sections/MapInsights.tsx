import React, { useState } from "react";
import { FaArrowUp } from "react-icons/fa";
import Modal from "@/components/inc/Modal";
import MarketPerformanceModal from "./MarketPerformanceModal";

type Props = {
  isOpen: boolean;
  toggle: () => void;
  aiSummary?: string | null;
};

interface PropertyMixData {
  label: string;
  percentage: number;
  color: string;
}

interface InfrastructureData {
  label: string;
  percentage: number;
}

const MapInsights: React.FC<Props> = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const propertyMix: PropertyMixData[] = [
    { label: "Apartments", percentage: 45, color: "#4EA8A1" },
    { label: "Detached", percentage: 22, color: "#7BC4BE" },
    { label: "Semi-Detached", percentage: 18, color: "#E8D976" },
    { label: "Land/Plots", percentage: 10, color: "#B8D9D5" },
    { label: "Commercial", percentage: 5, color: "#97C7C2" },
  ];

  const infrastructure: InfrastructureData[] = [
    { label: "Road & Transport Infrastructure", percentage: 90 },
    { label: "Power & Utilities", percentage: 75 },
    { label: "Telecommunication & Digital Access", percentage: 82 },
    { label: "Social Infrastructure", percentage: 85 },
    { label: "Security & Emergency Services", percentage: 79 },
    { label: "Environmental & Sustainability Factors", percentage: 88 },
    { label: "Economic & Employment Access", percentage: 81 },
    { label: "Government & Development Plans", percentage: 80 },
  ];

  const infrastructureIndex = 84;

  const DonutChart = ({ data }: { data: PropertyMixData[] }) => {
    const size = 200;
    const strokeWidth = 40;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const center = size / 2;

    let cumulativePercent = 0;

    return (
      <svg width={size} height={size} className="transform -rotate-90">
        {data.map((item, index) => {
          const segmentPercent = item.percentage;
          const segmentLength = (segmentPercent / 100) * circumference;
          const offset = (cumulativePercent / 100) * circumference;

          const segment = (
            <circle
              key={index}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={item.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${segmentLength} ${circumference}`}
              strokeDashoffset={-offset}
            />
          );

          cumulativePercent += segmentPercent;
          return segment;
        })}
      </svg>
    );
  };

  const RadarChart = ({ data }: { data: InfrastructureData[] }) => {
    const size = 280; // Reduced for better mobile fit
    const center = size / 2;
    const maxRadius = 85; // Proportionally reduced
    const levels = 5;
    const labelOffset = 35; // Closer to the chart

    const angleStep = (2 * Math.PI) / data.length;

    const getPoint = (percentage: number, index: number) => {
      const angle = index * angleStep - Math.PI / 2;
      const r = (percentage / 100) * maxRadius;
      return {
        x: center + r * Math.cos(angle),
        y: center + r * Math.sin(angle),
      };
    };

    const getLabelPoint = (index: number) => {
      const angle = index * angleStep - Math.PI / 2;
      const r = maxRadius + labelOffset;
      return {
        x: center + r * Math.cos(angle),
        y: center + r * Math.sin(angle),
        angle: angle,
      };
    };

    const dataPoints = data.map((item, index) => getPoint(item.percentage, index));
    const pathData = dataPoints.map((point, i) => 
      `${i === 0 ? 'M' : 'L'} ${point.x},${point.y}`
    ).join(' ') + ' Z';

    const levelPaths = Array.from({ length: levels }, (_, i) => {
      const levelPercent = ((i + 1) / levels) * 100;
      const points = data.map((_, index) => getPoint(levelPercent, index));
      return points.map((point, i) => 
        `${i === 0 ? 'M' : 'L'} ${point.x},${point.y}`
      ).join(' ') + ' Z';
    });

    return (
      <div className="relative w-full flex justify-center">
        <div className="relative" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="absolute inset-0">
            {/* Grid levels */}
        {levelPaths.map((path, i) => (
          <path
            key={i}
            d={path}
            fill="none"
                stroke="#D1D5DB"
                strokeWidth="1.5"
                opacity={0.4}
          />
        ))}
        
            {/* Radial lines */}
        {data.map((_, index) => {
          const endPoint = getPoint(100, index);
          return (
            <line
              key={index}
              x1={center}
              y1={center}
              x2={endPoint.x}
              y2={endPoint.y}
                  stroke="#D1D5DB"
                  strokeWidth="1.5"
                  opacity={0.4}
            />
          );
        })}

            {/* Data area */}
        <path
          d={pathData}
              fill="rgba(78, 168, 161, 0.25)"
          stroke="#4EA8A1"
              strokeWidth="2.5"
          strokeLinejoin="round"
        />

            {/* Data points */}
        {dataPoints.map((point, i) => (
          <circle
            key={i}
            cx={point.x}
            cy={point.y}
                r="4"
            fill="#4EA8A1"
          />
        ))}
      </svg>

          {/* Labels as absolutely positioned divs */}
          {data.map((item, index) => {
            const labelPoint = getLabelPoint(index);
            
            // Determine text alignment and transform based on position
            let textAlign: 'left' | 'center' | 'right' = 'center';
            let transform = 'translate(-50%, -50%)';
            
            const dx = labelPoint.x - center;
            const dy = labelPoint.y - center;
            
            // Calculate if more horizontal or vertical
            if (Math.abs(dx) > Math.abs(dy)) {
              // More horizontal than vertical
              if (dx > 0) {
                // Right side
                textAlign = 'left';
                transform = 'translate(0%, -50%)';
              } else {
                // Left side
                textAlign = 'right';
                transform = 'translate(-100%, -50%)';
              }
            } else {
              // More vertical than horizontal
              if (dy > 0) {
                // Bottom
                transform = 'translate(-50%, 0%)';
              } else {
                // Top
                transform = 'translate(-50%, -100%)';
              }
            }
            
            return (
              <div
                key={index}
                className="absolute text-[9px] sm:text-[10px] font-medium text-gray-700 leading-tight"
                style={{
                  left: `${labelPoint.x}px`,
                  top: `${labelPoint.y}px`,
                  transform: transform,
                  textAlign: textAlign,
                  maxWidth: '100px',
                }}
              >
                {item.label}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full px-6">
      <div className="bg-inda-teal/10 border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <h3 className="text-2xl md:text-3xl font-bold mb-8 text-inda-teal">
          Micro-location Insights
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-6">
            <h4 className="text-xl font-bold text-gray-900">
              Property Mix in Area
            </h4>

            <div className="flex justify-center">
              <DonutChart data={propertyMix} />
            </div>

            <div className="space-y-3">
              {propertyMix.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div
                    className="w-6 h-6 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="flex-1 flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">
                      {item.label}
                    </span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all duration-500"
                        style={{
                          width: `${item.percentage}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-12 text-right">
                      {item.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#D5E9E7] rounded-xl p-4 mt-6">
              <div className="flex items-start gap-2">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="flex-shrink-0 mt-0.5"
                >
                  <path
                    d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                    fill="#4EA8A1"
                  />
                </svg>
                <div>
                  <h5 className="font-bold text-gray-900 mb-1">Rental Zone</h5>
                  <p className="text-sm text-gray-700">
                    Rental-dominant area with high liquidity and short resale cycles
                  </p>
            </div>
          </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-xl font-bold text-gray-900">
                Infrastructural Index
              </h4>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-inda-teal">
                  {infrastructureIndex}/100
                    </span>
                <FaArrowUp className="text-inda-teal text-xl" />
              </div>
            </div>

            <RadarChart data={infrastructure} />

            <div className="space-y-3 mt-6">
              {infrastructure.map((item, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700">{item.label}</span>
                    <span className="font-semibold text-gray-900">{item.percentage}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-inda-teal transition-all duration-500"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 bg-[#D5E9E7] rounded-2xl p-6">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full text-left text-gray-900 font-medium hover:text-inda-teal transition-colors bg-white rounded-xl px-6 py-4"
          >
            View more Insights
          </button>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        maxWidth="4xl"
      >
        <MarketPerformanceModal />
      </Modal>
    </div>
  );
};

export default MapInsights;
