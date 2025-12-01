import React from "react";

type MarketTrend = {
  currentTrend: string;
  confidence: number;
  drivers: string[];
  forecast: string;
};

type Props = {
  marketTrends: MarketTrend;
};

const ExpertMarketAnalysis: React.FC<Props> = ({ marketTrends }) => {
  return (
    <div className="w-full px-6">
      <div className="bg-white/80 border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-inda-teal">
          Expert Market Analysis
        </h2>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                Current Market Trend
              </h3>
              <p className="text-2xl font-bold text-inda-teal">
                {marketTrends.currentTrend}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">Confidence</p>
              <p className="text-3xl font-bold text-gray-900">
                {marketTrends.confidence}%
              </p>
            </div>
          </div>

          <div className="bg-indigo-50 rounded-xl p-6">
            <h4 className="font-bold text-gray-900 mb-3">Market Drivers</h4>
            <ul className="space-y-2">
              {marketTrends.drivers.map((driver, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-inda-teal mt-1">→</span>
                  <span className="text-gray-700">{driver}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6">
            <h4 className="font-bold text-gray-900 mb-2">Market Forecast</h4>
            <p className="text-gray-700">{marketTrends.forecast}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpertMarketAnalysis;




