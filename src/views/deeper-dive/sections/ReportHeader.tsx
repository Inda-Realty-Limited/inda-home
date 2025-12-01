import React from "react";

type Props = {
  reportId: string;
  client: string;
  analyst: string;
  reportDate: string;
  confidenceLevel: string;
  confidenceScore: number;
};

const ReportHeader: React.FC<Props> = ({
  reportId,
  client,
  analyst,
  reportDate,
  confidenceLevel,
  confidenceScore,
}) => {
  return (
    <div className="w-full px-6">
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-inda-teal mb-2">
            Deeper Dive Report
          </h1>
          <p className="text-gray-600 font-bold">
            Comprehensive due diligence by Inda
          </p>
          <p className="text-gray-600 flex items-center justify-center gap-1.5">
            ⭐
            Premium Analysis
            ⭐
          </p>
        </div>

        {/* Four Key Metrics Cards */}
        <div className="bg-[#E5E5E5CC] border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#4EA8A1]/60 rounded-xl p-4 text-center">
            <p className="text-xs text-white mb-1">Report ID</p>
            <p className="text-sm font-bold text-white">{reportId}</p>
          </div>
          <div className="bg-[#4EA8A1]/60 rounded-xl p-4 text-center">
            <p className="text-xs text-white mb-1">Client</p>
            <p className="text-sm font-bold text-white">{client}</p>
          </div>
          <div className="bg-[#4EA8A1]/60 rounded-xl p-4 text-center">
            <p className="text-xs text-white mb-1">Analyst</p>
            <p className="text-sm font-bold text-white">{analyst}</p>
          </div>
          <div className="bg-[#4EA8A1]/60 rounded-xl p-4 text-center">
            <p className="text-xs text-white mb-1">Date</p>
            <p className="text-sm font-bold text-white">{reportDate}</p>
          </div>
        </div>

        {/* Confidence Level */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Confidence Level
            </span>
            <span className="text-sm font-bold text-inda-teal">
              {confidenceLevel}
            </span>
          </div>
          <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-inda-teal rounded-full transition-all duration-500"
              style={{ width: `${confidenceScore}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportHeader;
