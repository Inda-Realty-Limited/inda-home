import React from "react";
import { FaArrowUp } from "react-icons/fa";

interface MarketAbsorptionModalProps {
  absorptionRate?: number;
  qoqGrowth?: number;
  under30Days?: number;
  days31to60?: number;
  over60Days?: number;
  trendData?: { quarter: string; value: number }[];
}

const MarketAbsorptionModal: React.FC<MarketAbsorptionModalProps> = ({
  absorptionRate = 80,
  qoqGrowth = 5,
  under30Days = 60,
  days31to60 = 20,
  over60Days = 20,
  trendData = [
    { quarter: "Q1", value: 78 },
    { quarter: "Q2", value: 82 },
    { quarter: "Q3", value: 84 },
    { quarter: "Q4", value: 88 },
  ],
}) => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Market Absorption Rate
            </h2>
            <div className="flex items-center gap-2 text-inda-teal">
              <FaArrowUp className="text-lg" />
              <span className="text-base font-bold">+{qoqGrowth}% QoQ</span>
            </div>
          </div>

          <div className="bg-[#D5E9E7] rounded-2xl p-8 text-center">
            <p className="text-4xl font-bold text-gray-900 mb-2">
              {absorptionRate}%
            </p>
            <p className="text-base text-gray-700">
              Units sold within 60 days
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700">&lt; 30 days</span>
                <span className="font-semibold text-gray-900">{under30Days}%</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-inda-teal transition-all duration-500"
                  style={{ width: `${under30Days}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700">31 - 60 days</span>
                <span className="font-semibold text-gray-900">{days31to60}%</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#E8D976] transition-all duration-500"
                  style={{ width: `${days31to60}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700">&gt; 60 days</span>
                <span className="font-semibold text-gray-900">{over60Days}%</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#F4A5A5] transition-all duration-500"
                  style={{ width: `${over60Days}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900">
            Market Absorption Trend
          </h2>

          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="relative h-48">
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-sm text-gray-500">
                <span>90</span>
                <span>75</span>
                <span>60</span>
              </div>

              {/* Chart area */}
              <div className="ml-12 h-full pb-8 relative">
                <svg className="w-full h-full" viewBox="0 0 400 160" preserveAspectRatio="none">
                  {/* Line connecting points */}
                  <polyline
                    points="0,60 133,40 267,20 400,0"
                    fill="none"
                    stroke="#4EA8A1"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  
                  {/* Data points */}
                  <circle cx="0" cy="60" r="6" fill="#4EA8A1" />
                  <circle cx="133" cy="40" r="6" fill="#4EA8A1" />
                  <circle cx="267" cy="20" r="6" fill="#4EA8A1" />
                  <circle cx="400" cy="0" r="6" fill="#4EA8A1" />
                </svg>

                {/* X-axis labels */}
                <div className="absolute -bottom-2 left-0 right-0 flex justify-between text-sm text-gray-600">
                  {trendData.map((item, index) => (
                    <span key={index} className="flex-1 text-center">
                      {item.quarter}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketAbsorptionModal;

