import React from "react";

type Props = {
  finalScore?: number;
  maxScore?: number;
  recommendation?: string;
  marketValue?: number;
  marketValueMax?: number;
  sellerCredibility?: number;
  sellerCredibilityMax?: number;
  microlocation?: number;
  microlocationMax?: number;
  demand?: number;
  demandMax?: number;
  roiPotential?: number;
  roiPotentialMax?: number;
};

const FinalIndaScore: React.FC<Props> = ({
  finalScore = 75,
  maxScore = 100,
  recommendation = "Strong Buy",
  marketValue = 18,
  marketValueMax = 25,
  sellerCredibility = 12,
  sellerCredibilityMax = 25,
  microlocation = 16,
  microlocationMax = 25,
  demand = 15,
  demandMax = 25,
  roiPotential = 14,
  roiPotentialMax = 25,
}) => {
  const percentage = (finalScore / maxScore) * 100;
  const circumference = 2 * Math.PI * 100;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getRecommendationColor = (rec: string) => {
    if (rec.toLowerCase().includes("strong buy")) return "bg-inda-teal";
    if (rec.toLowerCase().includes("buy")) return "bg-inda-teal";
    if (rec.toLowerCase().includes("hold")) return "bg-inda-teal";
    if (rec.toLowerCase().includes("caution")) return "bg-inda-teal";
    return "bg-inda-teal";
  };

  const metrics = [
    {
      label: "Market Value",
      value: marketValue,
      max: marketValueMax,
    },
    {
      label: "Seller Credibility",
      value: sellerCredibility,
      max: sellerCredibilityMax,
    },
    {
      label: "Microlocation",
      value: microlocation,
      max: microlocationMax,
    },
    {
      label: "Demand",
      value: demand,
      max: demandMax,
    },
    {
      label: "ROI Potential",
      value: roiPotential,
      max: roiPotentialMax,
    },
  ];

  return (
    <div className="w-full px-6">
      <div className="bg-white/80 border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="mb-6">
          <h3 className="text-2xl md:text-3xl font-bold text-inda-teal mb-2">
            Final Inda Score
          </h3>
          <p className="text-gray-600">
            Comprehensive property performance across core metrics
          </p>
        </div>

        <div className="flex flex-col items-center mb-8">
          <div className="relative w-64 h-64 mb-6">
            <svg
              className="transform -rotate-90"
              width="256"
              height="256"
              viewBox="0 0 256 256"
            >
              <circle
                cx="128"
                cy="128"
                r="100"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="24"
              />
              <circle
                cx="128"
                cy="128"
                r="100"
                fill="none"
                stroke="#4EA8A1"
                strokeWidth="24"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-5xl font-bold text-gray-900">{finalScore}</p>
              <p className="text-xl text-gray-600">/{maxScore}</p>
            </div>
          </div>

          <div
            className={`${getRecommendationColor(
              recommendation
            )} text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg`}
          >
            {recommendation}
          </div>
        </div>

        <div className="space-y-4">
          {metrics.map((metric, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-900">
                  {metric.label}
                </span>
                <span className="font-bold text-gray-900">
                  {metric.value}/{metric.max}
                </span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-inda-teal transition-all duration-1000 ease-out rounded-full"
                  style={{ width: `${(metric.value / metric.max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FinalIndaScore;

