import {  Shield, TrendingDown, Clock } from "lucide-react";

interface RiskItem {
  category: string;
  level: "low" | "medium" | "high";
  description: string;
  icon: typeof Shield;
}

const risks: RiskItem[] = [
  {
    category: "Legal Risk",
    level: "low",
    description: "Property has verified C of O, clean title search, and 5-year title insurance.",
    icon: Shield
  },
  {
    category: "Market Risk",
    level: "medium",
    description: "Lagos market is stable but affected by economic downturns and FX volatility.",
    icon: TrendingDown
  },
  {
    category: "Operational Risk",
    level: "low",
    description: "Estate has established management and reliable utilities.",
    icon: Shield
  },
  {
    category: "Delivery Risk",
    level: "low",
    description: "Developer has 92% on-time delivery rate, project is 85% complete.",
    icon: Clock
  }
];

const getRiskColor = (level: string) => {
  switch (level) {
    case "low":
      return { bg: "bg-green-50", border: "border-green-500", text: "text-green-700", dot: "bg-green-500" };
    case "medium":
      return { bg: "bg-yellow-50", border: "border-yellow-500", text: "text-yellow-700", dot: "bg-yellow-500" };
    case "high":
      return { bg: "bg-red-50", border: "border-red-500", text: "text-red-700", dot: "bg-red-500" };
    default:
      return { bg: "bg-gray-50", border: "border-gray-500", text: "text-gray-700", dot: "bg-gray-500" };
  }
};

export function RiskAssessmentSection() {
  const lowRisks = risks.filter(r => r.level === "low").length;
  const mediumRisks = risks.filter(r => r.level === "medium").length;
  const highRisks = risks.filter(r => r.level === "high").length;

  return (
    <div className="space-y-6">
      {/* Overall Risk Score */}
      <div className="bg-[#e8f5f4] rounded-lg p-6 border-2 border-[#50b8b1]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-gray-900 mb-1">Overall Risk Score</h4>
            <p className="text-sm text-gray-600">Based on comprehensive analysis of 4 risk factors</p>
          </div>
          <div className="text-center">
            <div className="text-3xl text-[#50b8b1] mb-1">Low</div>
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              <div className="w-2 h-2 rounded-full bg-gray-300"></div>
            </div>
          </div>
        </div>
        
        {/* Risk Summary */}
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-gray-600">{lowRisks} Low Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-gray-600">{mediumRisks} Medium Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-gray-600">{highRisks} High Risk</span>
          </div>
        </div>
      </div>

      {/* Risk Dashboard */}
      <div className="space-y-3">
        {risks.map((risk, index) => {
          const colors = getRiskColor(risk.level);
          const Icon = risk.icon;
          
          return (
            <div
              key={index}
              className={`${colors.bg} border-l-4 ${colors.border} rounded-lg p-4`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${colors.bg}`}>
                  <Icon className={`w-5 h-5 ${colors.text}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-gray-900">{risk.category}</h4>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs ${colors.text}`}>
                      <div className={`w-2 h-2 rounded-full ${colors.dot}`}></div>
                      {risk.level.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{risk.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Risk Mitigation */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-5 h-5 text-[#50b8b1]" />
          <h4 className="text-gray-900">Risk Mitigation Measures</h4>
        </div>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-[#50b8b1] mt-1">✓</span>
            <span>5-year title insurance protecting against legal issues</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#50b8b1] mt-1">✓</span>
            <span>Escrow account protection with Sterling Bank</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#50b8b1] mt-1">✓</span>
            <span>10-year structural warranty on construction</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#50b8b1] mt-1">✓</span>
            <span>Diversification through prime Lagos location</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
