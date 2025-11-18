import React from "react";

interface MarketPerformanceModalProps {
  yoyGrowth?: number;
  roadAccess?: number;
  avgDaysOnMarket?: number;
  yoyPriceGrowth?: number;
}

const MarketPerformanceModal: React.FC<MarketPerformanceModalProps> = ({
  yoyGrowth = 8,
  roadAccess = 47500,
  avgDaysOnMarket = 28,
  yoyPriceGrowth = 8,
}) => {
  const monthlyData = [
    { month: "Feb", value: 32 },
    { month: "Mar", value: 46 },
    { month: "April", value: 35 },
    { month: "May", value: 45 },
    { month: "June", value: 33 },
    { month: "July", value: 44 },
    { month: "Aug", value: 36 },
    { month: "Sept", value: 50 },
    { month: "Oct", value: 36 },
    { month: "Nov", value: 45 },
    { month: "Dec", value: 32 },
    { month: "Jan", value: 46 },
  ];

  const maxValue = 100;

  return (
    <div className="space-y-6">
      <div className="bg-[#E8F5F4] rounded-2xl p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Market Performance
          </h2>
          <div className="flex items-center gap-2 text-inda-teal">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-inda-teal">
              <path d="M7 17L12 12L17 17M7 11L12 6L17 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-xl font-semibold">+{yoyGrowth}% YoY</span>
          </div>
        </div>

        {/* Chart */}
        <div className="relative mb-8">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-12 flex flex-col justify-between text-sm text-gray-500 w-8">
            <span>100</span>
            <span>75</span>
            <span>50</span>
            <span>25</span>
            <span>0</span>
          </div>

          {/* Chart bars */}
          <div className="ml-12 h-64 flex items-end justify-between gap-1">
            {monthlyData.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center justify-end h-full">
                <div
                  className="w-full bg-inda-teal rounded-t-md"
                  style={{
                    height: `${(item.value / maxValue) * 100}%`,
                  }}
                />
              </div>
            ))}
          </div>

          {/* X-axis labels */}
          <div className="ml-12 flex justify-between mt-2">
            {monthlyData.map((item, index) => (
              <span key={index} className="flex-1 text-center text-xs text-gray-600">
                {item.month}
              </span>
            ))}
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-inda-teal flex-shrink-0">
                <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p className="text-sm text-gray-900">Road Access</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">+{roadAccess.toLocaleString()}</p>
              <p className="text-xs text-gray-500">5-year</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-inda-teal flex-shrink-0">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <p className="text-sm text-gray-900">Avg Days on Market</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">{avgDaysOnMarket} days</p>
              <p className="text-xs text-gray-500">5-year</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-inda-teal flex-shrink-0">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p className="text-sm text-gray-900">YoY Price Growth</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">+{yoyPriceGrowth}%</p>
              <p className="text-xs text-gray-500">5-year</p>
            </div>
          </div>
        </div>

        {/* Summary Text */}
        <p className="text-sm text-gray-700">
          Strong population inflow and quick turnover signal sustained buyer activity.
        </p>
      </div>
    </div>
  );
};

export default MarketPerformanceModal;

