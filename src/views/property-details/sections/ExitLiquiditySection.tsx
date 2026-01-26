import { TrendingUp, Clock, Users } from "lucide-react";

const timelineData = [
  { period: "0-3 months", percentage: 45, label: "Fast Exit" },
  { period: "3-6 months", percentage: 44, label: "Standard" },
  { period: "6-12 months", percentage: 7, label: "Extended" },
  { period: "12+ months", percentage: 4, label: "Slow" }
];

const exitOptions = [
  {
    option: "Resale",
    timeline: "3-6 months",
    potential: "High",
    description: "Strong demand in Lekki with 89% properties sold within 6 months"
  },
  {
    option: "Long-term Rental",
    timeline: "Immediate",
    potential: "Medium",
    description: "6-8% annual yield, steady income stream"
  },
  {
    option: "Short-term Rental",
    timeline: "Immediate",
    potential: "High",
    description: "10-12% potential yield through Airbnb/short lets"
  },
  {
    option: "Developer Buyback",
    timeline: "After 3 years",
    potential: "Medium",
    description: "Buyback option at market rate after 3-year hold period"
  }
];

export function ExitLiquiditySection() {
  return (
    <div className="space-y-6">
      {/* Liquidity Score */}
      <div className="bg-gradient-to-r from-[#e8f5f4] to-[#f0fdf4] rounded-lg p-6 border-2 border-[#50b8b1]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-gray-900 mb-1">Liquidity Score</h4>
            <p className="text-sm text-gray-600">Top 15% for liquidity in Lagos</p>
          </div>
          <div className="text-center">
            <div className="text-4xl text-[#50b8b1] mb-1">8.2/10</div>
            <div className="text-xs text-gray-600">High Liquidity</div>
          </div>
        </div>
        
        {/* Score Breakdown */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-white/50 rounded p-2">
            <div className="text-gray-600 text-xs mb-1">Prime Location</div>
            <div className="text-[#50b8b1]">9/10</div>
          </div>
          <div className="bg-white/50 rounded p-2">
            <div className="text-gray-600 text-xs mb-1">Strong Demand</div>
            <div className="text-[#50b8b1]">8/10</div>
          </div>
          <div className="bg-white/50 rounded p-2">
            <div className="text-gray-600 text-xs mb-1">Price Accessibility</div>
            <div className="text-[#50b8b1]">8/10</div>
          </div>
          <div className="bg-white/50 rounded p-2">
            <div className="text-gray-600 text-xs mb-1">Market Depth</div>
            <div className="text-[#50b8b1]">8/10</div>
          </div>
        </div>
      </div>

      {/* Resale Timeline Visual */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-5 h-5 text-[#50b8b1]" />
          <h4 className="text-gray-900">Historical Resale Timeline</h4>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Market data shows 45% of similar properties sell within 3 months, 89% within 6 months. 
          Average time on market: 4.2 months.
        </p>
        
        <div className="space-y-3">
          {timelineData.map((item, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">{item.period}</span>
                <span className="text-[#50b8b1]">{item.percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-[#50b8b1] h-2 rounded-full transition-all"
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500">{item.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-[#fef3c7] rounded-lg p-3 mt-4">
          <p className="text-sm text-gray-700">
            <span className="text-[#f59e0b]">📅 Peak Selling Season:</span> January-March and September-November
          </p>
        </div>
      </div>

      {/* Exit Options */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-5 h-5 text-[#50b8b1]" />
          <h4 className="text-gray-900">Exit Strategy Options</h4>
        </div>
        
        <div className="space-y-3">
          {exitOptions.map((exit, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:border-[#50b8b1] transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-gray-900">{exit.option}</h4>
                <span className={`px-2 py-1 rounded text-xs ${
                  exit.potential === "High" 
                    ? "bg-green-100 text-green-700" 
                    : "bg-[#e8f5f4] text-[#50b8b1]"
                }`}>
                  {exit.potential} Potential
                </span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{exit.timeline}</span>
              </div>
              <p className="text-sm text-gray-600">{exit.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Secondary Market Options */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-5 h-5 text-[#50b8b1]" />
          <h4 className="text-gray-900">Co-Investment & Secondary Market</h4>
        </div>
        <p className="text-sm text-gray-600 mb-3">
          Multiple liquidity options beyond traditional resale:
        </p>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-[#50b8b1] mt-1">•</span>
            <span>Fractional ownership platforms allow selling partial stakes</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#50b8b1] mt-1">•</span>
            <span>Property investment clubs often seek completed units</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#50b8b1] mt-1">•</span>
            <span>REITs may acquire quality properties for their portfolio</span>
          </li>
        </ul>
      </div>
    </div>
  );
}