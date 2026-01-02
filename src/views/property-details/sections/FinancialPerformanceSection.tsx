import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Sparkles } from "lucide-react";

const cashFlowData = [
  { year: "Y1", rental: 5.2, expenses: -0.54, net: 4.66 },
  { year: "Y2", rental: 5.6, expenses: -0.57, net: 5.03 },
  { year: "Y3", rental: 6.0, expenses: -0.60, net: 5.40 },
  { year: "Y4", rental: 6.5, expenses: -0.63, net: 5.87 },
  { year: "Y5", rental: 7.0, expenses: -0.66, net: 6.34 }
];

export function FinancialPerformanceSection() {
  const [rentGrowth, setRentGrowth] = useState(8);
  const [inflation, setInflation] = useState(15);

  const calculateReturn = () => {
    const baseReturn = 6.5;
    const adjustedReturn = baseReturn + (rentGrowth - 8) * 0.3 + (inflation - 15) * 0.15;
    return adjustedReturn.toFixed(1);
  };

  return (
    <div className="space-y-6">
      {/* Rental Yield */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-[#f59e0b]" />
          <h4 className="text-gray-900">Expected Rental Yield</h4>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Based on current market rates, this property can achieve a rental yield of 6-8% annually. 
          Similar properties rent for ₦4.5M - ₦6M per year.
        </p>
        <div className="bg-[#e8f5f4] rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Annual Rental Income</p>
              <p className="text-[#50b8b1]">₦5.2M - ₦6.3M</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Yield</p>
              <p className="text-[#50b8b1]">6.6% - 8.0%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Cash Flow Forecast */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-[#f59e0b]" />
          <h4 className="text-gray-900">Cash Flow Forecast (5 Years)</h4>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Year 1: -₦78.5M (purchase) + ₦5.2M (rent) - ₦540K (service charges). 
          By Year 5, cumulative rental income of ₦30M+ with property value at ₦150M+ creates strong positive ROI.
        </p>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={cashFlowData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="year" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                formatter={(value: number) => `₦${value}M`}
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }}
              />
              <Legend />
              <Bar dataKey="rental" fill="#50b8b1" name="Rental Income" />
              <Bar dataKey="expenses" fill="#f59e0b" name="Expenses" />
              <Bar dataKey="net" fill="#6366f1" name="Net Cash Flow" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Scenario Modeling */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-[#f59e0b]" />
          <h4 className="text-gray-900">Scenario Modeling</h4>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Adjust assumptions to see how different scenarios affect your investment returns.
        </p>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
          {/* Rent Growth Slider */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm text-gray-700">Annual Rent Increase</label>
              <span className="text-sm text-[#50b8b1]">{rentGrowth}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              value={rentGrowth}
              onChange={(e) => setRentGrowth(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#50b8b1]"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span>20%</span>
            </div>
          </div>

          {/* Inflation Slider */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm text-gray-700">Expected Inflation Rate</label>
              <span className="text-sm text-[#50b8b1]">{inflation}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="30"
              value={inflation}
              onChange={(e) => setInflation(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#50b8b1]"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>5%</span>
              <span>30%</span>
            </div>
          </div>

          {/* Projected Returns */}
          <div className="bg-[#e8f5f4] rounded-lg p-4 mt-4">
            <p className="text-sm text-gray-600 mb-2">Projected Total Annual Return</p>
            <p className="text-[#50b8b1]">{calculateReturn()}%</p>
            <p className="text-xs text-gray-500 mt-2">
              {rentGrowth < 5 ? "Conservative scenario" : rentGrowth < 10 ? "Moderate scenario" : "Optimistic scenario"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}