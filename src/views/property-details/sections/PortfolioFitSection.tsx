import { PieChart, Target, TrendingUp } from "lucide-react";

const investmentHorizon = [
  { period: "Short-term (1-3 years)", suitability: "Moderate", color: "bg-yellow-500" },
  { period: "Medium-term (3-5 years)", suitability: "Good", color: "bg-green-400" },
  { period: "Long-term (5+ years)", suitability: "Excellent", color: "bg-green-600" }
];

export function PortfolioFitSection() {
  return (
    <div className="space-y-6">
      {/* Portfolio Diversification */}
      <div className="bg-gradient-to-r from-[#e8f5f4] to-[#f0fdf4] rounded-lg p-6 border-2 border-[#50b8b1]">
        <div className="flex items-center gap-2 mb-4">
          <PieChart className="w-5 h-5 text-[#50b8b1]" />
          <h4 className="text-gray-900">Portfolio Diversification Benefits</h4>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-lg p-3">
            <div className="text-sm text-gray-600 mb-1">Asset Class</div>
            <div className="text-[#50b8b1]">Real Estate</div>
            <div className="text-xs text-gray-500 mt-1">Inflation hedge</div>
          </div>
          <div className="bg-white rounded-lg p-3">
            <div className="text-sm text-gray-600 mb-1">Geography</div>
            <div className="text-[#50b8b1]">Lekki, Lagos</div>
            <div className="text-xs text-gray-500 mt-1">Prime location</div>
          </div>
          <div className="bg-white rounded-lg p-3">
            <div className="text-sm text-gray-600 mb-1">Price Point</div>
            <div className="text-[#50b8b1]">Mid-tier</div>
            <div className="text-xs text-gray-500 mt-1">Risk/reward balance</div>
          </div>
          <div className="bg-white rounded-lg p-3">
            <div className="text-sm text-gray-600 mb-1">Income Stream</div>
            <div className="text-[#50b8b1]">6-8% Yield</div>
            <div className="text-xs text-gray-500 mt-1">Passive income</div>
          </div>
        </div>
      </div>

      {/* Investment Horizon */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-5 h-5 text-[#50b8b1]" />
          <h4 className="text-gray-900">Investment Horizon Suitability</h4>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          This property is best suited for long-term investors (5+ years) who want to maximize appreciation 
          and rental income benefits.
        </p>
        
        <div className="space-y-3">
          {investmentHorizon.map((horizon, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-gray-900">{horizon.period}</h4>
                <span className={`px-3 py-1 rounded text-sm text-white ${
                  horizon.suitability === "Excellent" ? "bg-green-600" :
                  horizon.suitability === "Good" ? "bg-green-400" :
                  "bg-yellow-500"
                }`}>
                  {horizon.suitability}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`${horizon.color} h-2 rounded-full transition-all`}
                  style={{ 
                    width: horizon.suitability === "Excellent" ? "100%" :
                           horizon.suitability === "Good" ? "70%" : "50%" 
                  }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {horizon.period.includes("Short-term") && "Transaction costs reduce returns; consider if you need quick liquidity"}
                {horizon.period.includes("Medium-term") && "Good balance of appreciation and rental income; captures infrastructure benefits"}
                {horizon.period.includes("Long-term") && "Maximizes appreciation, rental income, and infrastructure project benefits"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Investment Recommendation */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-5 h-5 text-[#50b8b1]" />
          <h4 className="text-gray-900">AI Investment Recommendation</h4>
        </div>
        <div className="space-y-3 text-sm text-gray-700">
          <div className="flex items-start gap-2">
            <span className="text-green-600 mt-1">✓</span>
            <div>
              <strong>Strong Buy for Long-term Investors:</strong> Excellent appreciation potential 
              combined with steady rental income makes this ideal for 5+ year hold periods.
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-600 mt-1">✓</span>
            <div>
              <strong>Good Diversification Asset:</strong> Real estate in prime Lagos location provides 
              inflation hedge and geographic diversification benefits.
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-yellow-600 mt-1">⚠</span>
            <div>
              <strong>Consider Alternatives If:</strong> You need short-term liquidity (less than 3 years) 
              or prefer higher-yielding but riskier investments.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}