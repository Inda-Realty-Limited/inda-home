import React from "react";

type Props = {
  disclaimerText?: string;
};

const Disclaimer: React.FC<Props> = ({ disclaimerText }) => {
  const defaultDisclaimer = `This report is provided for informational purposes only and does not constitute financial, legal, or investment advice. 
All data is sourced from publicly available listings and third-party APIs. Inda.ng makes reasonable efforts to ensure accuracy but does not 
guarantee completeness or timeliness. Property valuations, scores, and projections are estimates based on algorithmic analysis and should not 
be solely relied upon for purchase decisions. Users are strongly advised to conduct independent due diligence, verify all information, and 
consult qualified professionals (real estate agents, lawyers, surveyors, financial advisors) before making any investment or transaction. 
Inda.ng assumes no liability for decisions made based on this report.`;

  return (
    <div className="w-full px-6 pb-8">
      <div className="bg-gray-50 border border-gray-300 rounded-2xl p-6 sm:p-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Disclaimer</h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          {disclaimerText || defaultDisclaimer}
        </p>
      </div>
    </div>
  );
};

export default Disclaimer;

