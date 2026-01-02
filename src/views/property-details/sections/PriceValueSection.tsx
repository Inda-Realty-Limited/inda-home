import { TrendingUp, DollarSign, PieChart, BarChart3, Info } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RePieChart, Pie, Cell } from "recharts";

const costBreakdown = [
  { name: "Purchase Price", value: 78.5, color: "#50b8b1" },
  { name: "Legal Fees", value: 2.0, color: "#f59e0b" },
  { name: "Agency Fees", value: 3.9, color: "#6366f1" },
  { name: "Documentation", value: 0.5, color: "#ec4899" },
  { name: "Stamp Duty", value: 1.2, color: "#8b5cf6" }
];

const totalCost = costBreakdown.reduce((sum, item) => sum + item.value, 0);

const appreciationTimeline = [
  { year: "2024", value: 78.5 },
  { year: "2025", value: 90.3 },
  { year: "2026", value: 103.8 },
  { year: "2027", value: 119.4 },
  { year: "2028", value: 137.3 }
];

export function PriceValueSection() {
  return (
    <div className="space-y-6">
      {/* Fair Market Value - Hero Section */}
      <div className="bg-gradient-to-br from-[#50b8b1] to-[#45a69f] rounded-lg p-6 text-white">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-6 h-6" />
              <h3 className="text-white text-xl">Fair Market Value</h3>
            </div>
            <p className="text-white/80 text-sm">Based on 47 comparable properties in the area</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold mb-1">₦82.5M</div>
            <div className="text-sm text-white/80">Listed: ₦78.5M</div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
            <div className="text-xs text-white/70 mb-1">Discount</div>
            <div className="text-lg font-semibold text-green-300">-5%</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
            <div className="text-xs text-white/70 mb-1">FMV Range</div>
            <div className="text-sm font-semibold">₦79-86M</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
            <div className="text-xs text-white/70 mb-1">Confidence</div>
            <div className="text-sm font-semibold">High (92%)</div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 text-sm text-white/90 bg-white/10 rounded-lg p-3">
          <Info className="w-4 h-4 flex-shrink-0" />
          <span>This property is priced <strong>below market value</strong>, presenting a strong buying opportunity.</span>
        </div>
      </div>

      {/* Total Cost Breakdown - Pie Chart */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <PieChart className="w-5 h-5 text-[#50b8b1]" />
          <h4 className="text-gray-900">Total Investment Breakdown</h4>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <ResponsiveContainer width="100%" height={200}>
                <RePieChart>
                  <Pie
                    data={costBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {costBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `₦${value}M`} />
                </RePieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col justify-center space-y-2">
              {costBreakdown.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-gray-700">{item.name}</span>
                  </div>
                  <span className="text-gray-900">₦{item.value}M</span>
                </div>
              ))}
              <div className="pt-2 mt-2 border-t border-gray-200 flex items-center justify-between">
                <span className="text-gray-900">Total Investment</span>
                <span className="text-[#50b8b1]">₦{totalCost.toFixed(1)}M</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Appreciation Projection */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-5 h-5 text-[#50b8b1]" />
          <h4 className="text-gray-900">5-Year Value Projection</h4>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={appreciationTimeline}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="year" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} label={{ value: '₦ Million', angle: -90, position: 'insideLeft', fontSize: 12 }} />
              <Tooltip 
                formatter={(value: number) => `₦${value}M`}
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }}
              />
              <Bar dataKey="value" fill="#50b8b1" name="This Property" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-[#e8f5f4] rounded-lg">
              <div className="text-xs text-gray-600 mb-1">1-Year Gain</div>
              <div className="text-[#50b8b1]">+15%</div>
            </div>
            <div className="text-center p-3 bg-[#e8f5f4] rounded-lg">
              <div className="text-xs text-gray-600 mb-1">3-Year Gain</div>
              <div className="text-[#50b8b1]">+52%</div>
            </div>
            <div className="text-center p-3 bg-[#e8f5f4] rounded-lg">
              <div className="text-xs text-gray-600 mb-1">5-Year Gain</div>
              <div className="text-[#50b8b1]">+75%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Value Indicators */}
      <div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-[#50b8b1]" />
            <h4 className="text-gray-900">Annual Appreciation</h4>
          </div>
          <div className="text-2xl text-[#50b8b1] mb-1">15-18%</div>
          <p className="text-sm text-gray-600">Historical: 12% (Area avg)</p>
          <div className="mt-2 flex gap-1">
            <div className="flex-1 bg-green-500 h-2 rounded"></div>
            <div className="flex-1 bg-green-500 h-2 rounded"></div>
            <div className="flex-1 bg-green-400 h-2 rounded"></div>
            <div className="flex-1 bg-yellow-400 h-2 rounded"></div>
            <div className="flex-1 bg-gray-200 h-2 rounded"></div>
          </div>
        </div>
      </div>

      {/* Investment Score */}
      <div className="bg-gradient-to-r from-[#e8f5f4] to-[#f0fdf4] rounded-lg p-6 border-2 border-[#50b8b1]">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h4 className="text-gray-900 mb-1">Value for Money Score</h4>
            <p className="text-sm text-gray-600">Based on market analysis and projections</p>
          </div>
          <div className="text-center">
            <div className="text-4xl text-[#50b8b1] mb-1">9.2/10</div>
            <div className="text-xs text-gray-600">Excellent Value</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-white/50 rounded p-2">
            <div className="text-gray-600 text-xs mb-1">Below Market Price</div>
            <div className="text-green-600">✓ -5%</div>
          </div>
          <div className="bg-white/50 rounded p-2">
            <div className="text-gray-600 text-xs mb-1">Strong Appreciation</div>
            <div className="text-green-600">✓ 15-18%</div>
          </div>
          <div className="bg-white/50 rounded p-2">
            <div className="text-gray-600 text-xs mb-1">Good Location</div>
            <div className="text-green-600">✓ 9/10</div>
          </div>
          <div className="bg-white/50 rounded p-2">
            <div className="text-gray-600 text-xs mb-1">Rental Yield</div>
            <div className="text-green-600">✓ 6-8%</div>
          </div>
        </div>
      </div>
    </div>
  );
}