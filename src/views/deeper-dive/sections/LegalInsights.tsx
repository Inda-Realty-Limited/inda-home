import React from "react";

type LegalInsights = {
  titleStatus: string;
  documentationScore: number;
  risks: string[];
  recommendations: string[];
};

type Props = {
  legalInsights: LegalInsights;
};

const LegalInsights: React.FC<Props> = ({ legalInsights }) => {
  return (
    <div className="w-full px-6">
      <div className="bg-white/80 border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-inda-teal">
          Legal Insights & Due Diligence
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-green-50 rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Title Status</h3>
            <p className="text-2xl font-bold text-green-600">
              {legalInsights.titleStatus}
            </p>
          </div>
          <div className="bg-blue-50 rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Documentation Score
            </h3>
            <p className="text-2xl font-bold text-blue-600">
              {legalInsights.documentationScore}/100
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">Legal Risks</h4>
            <ul className="space-y-2">
              {legalInsights.risks.map((risk, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">⚠</span>
                  <span className="text-gray-700">{risk}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">
              Recommendations
            </h4>
            <ul className="space-y-2">
              {legalInsights.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-inda-teal mt-1">✓</span>
                  <span className="text-gray-700">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalInsights;

