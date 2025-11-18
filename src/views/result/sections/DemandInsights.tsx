import React, { useState } from "react";
import Modal from "@/components/inc/Modal";
import MarketAbsorptionModal from "./MarketAbsorptionModal";

type Props = {
  diaspora?: number;
  localHNIS?: number;
  institutional?: number;
  investment?: number;
  owners?: number;
  supplyDemandRatio?: number;
};

const DemandInsights: React.FC<Props> = ({
  diaspora = 60,
  localHNIS = 25,
  institutional = 15,
  investment = 65,
  owners = 35,
  supplyDemandRatio = 1.2,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const PieChart = ({
    data,
  }: {
    data: { label: string; percentage: number; color: string }[];
  }) => {
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

  const buyerDemographics = [
    { label: "Diaspora", percentage: diaspora, color: "#4EA8A1" },
    { label: "Local HNIS", percentage: localHNIS, color: "#E8D976" },
    { label: "Institutional", percentage: institutional, color: "#B8D9D5" },
  ];

  const getSupplyStatus = (ratio: number) => {
    if (ratio < 1.0) return "Undersupply";
    if (ratio >= 1.0 && ratio <= 1.1) return "Neutral";
    return "Oversupply";
  };

  const currentStatus = getSupplyStatus(supplyDemandRatio);

  return (
    <div className="w-full px-6">
      <div className="bg-white/80 border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <h3 className="text-2xl md:text-3xl font-bold mb-8 text-inda-teal">
          Demand Insights
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-8">
            <div>
              <h4 className="text-xl font-bold text-gray-900 mb-6">
                Buyer Demographics
              </h4>

              <div className="flex items-center justify-between mb-6">
                <PieChart data={buyerDemographics} />

                <div className="flex flex-col gap-3">
                  {buyerDemographics.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div
                        className="w-6 h-6 rounded-full flex-shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">
                          {item.label}
                        </span>
                        <span className="text-lg font-bold text-gray-900">
                          {item.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xl font-bold text-gray-900 mb-4">
                Purchase Purpose
              </h4>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#D5E9E7] rounded-xl p-6">
                  <p className="text-base font-semibold text-gray-900">
                    Investment: <span className="font-bold">{investment}%</span>
                  </p>
                </div>
                <div className="bg-[#D5E9E7] rounded-xl p-6">
                  <p className="text-base font-semibold text-gray-900">
                    Owners: <span className="font-bold">{owners}%</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-xl font-bold text-gray-900">
              Supply Vs Demand Ratio
            </h4>

            <div className="relative">
              <div className="relative h-16 bg-gradient-to-r from-teal-800 via-teal-600 to-teal-400 rounded-full overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-between px-4 text-white text-sm font-medium">
                  <span>0.8x</span>
                  <span>1.0x</span>
                  <span>1.2x</span>
                </div>

                <div
                  className="absolute top-0 right-0 h-full"
                  style={{
                    width: `${((supplyDemandRatio - 0.8) / (1.2 - 0.8)) * 100}%`,
                  }}
                >
                  <div className="absolute -top-12 right-0 bg-inda-teal text-white px-4 py-2 rounded-lg font-bold text-lg shadow-lg">
                    {supplyDemandRatio}x
                  </div>
                  <div className="absolute top-0 right-0 w-1 h-full bg-white"></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="bg-[#D5E9E7] rounded-xl p-4 text-center">
                <p className="text-sm font-bold text-gray-900 mb-2">
                  Undersupply
                </p>
                <p className="text-sm text-gray-700">&lt; 1.0x</p>
              </div>
              <div className="bg-[#E8D976]/30 rounded-xl p-4 text-center">
                <p className="text-sm font-bold text-gray-900 mb-2">Neutral</p>
                <p className="text-sm text-gray-700">1.0x - 1.1x</p>
              </div>
              <div className="bg-[#F4C2C2]/30 rounded-xl p-4 text-center">
                <p className="text-sm font-bold text-gray-900 mb-2">
                  Oversupply
                </p>
                <p className="text-sm text-gray-700">&gt; 1.1x</p>
              </div>
            </div>

            <div className="bg-inda-teal text-white rounded-xl p-6 mt-6">
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold">Current: {currentStatus}</p>
                <p className="text-2xl font-bold">{supplyDemandRatio}x</p>
              </div>
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
        maxWidth="6xl"
      >
        <MarketAbsorptionModal />
      </Modal>
    </div>
  );
};

export default DemandInsights;

