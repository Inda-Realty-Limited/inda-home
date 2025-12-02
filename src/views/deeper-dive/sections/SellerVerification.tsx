import React from "react";

type Project = {
  title: string;
  deliveryDate: string;
  feedback: string;
  rating: number;
};

type Props = {
  developerProfile: {
    company: string;
    yearsInBusiness: string;
    cacRegistration: string;
    redanMembership: string;
  };
  riskAssessment: {
    financialStability: number;
    deliveryTrackRecord: number;
    customerSatisfaction: number;
  };
  confidenceScore: number;
  confidenceLabel: string;
  recentProjects: Project[];
};

const SellerVerification: React.FC<Props> = ({
  developerProfile,
  riskAssessment,
  confidenceScore,
  confidenceLabel,
  recentProjects,
}) => {
  return (
    <div className="w-full px-6">
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Seller Verification
        </h2>

        {/* Developer Profile */}
        <div className="bg-inda-teal/20 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Developer Profile
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">Company</span>
              <span className="text-sm font-medium text-gray-900">{developerProfile.company}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">Years in Business</span>
              <span className="text-sm font-medium text-gray-900">{developerProfile.yearsInBusiness}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">CAC Registration</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-inda-teal text-white">
                Verified
                <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 5L4.5 8.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">REDAN Membership</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-inda-teal text-white">
                Active
                <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 5L4.5 8.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </div>
          </div>
        </div>

        {/* Risk Assessment and Confidence Score */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Risk Assessment */}
          <div className="bg-[#E5E5E5CC] rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Risk Assessment
            </h3>
            <div className="space-y-4">
              <RiskBar
                label="Financial Stability"
                score={riskAssessment.financialStability}
              />
              <RiskBar
                label="Delivery Track Record"
                score={riskAssessment.deliveryTrackRecord}
              />
              <RiskBar
                label="Customer Satisfaction"
                score={riskAssessment.customerSatisfaction}
              />
            </div>
          </div>

          {/* Seller Confidence Score */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col justify-center">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Seller Confidence Score
            </h3>
            <div className="mb-2">
              <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                <div
                  className="bg-inda-teal h-3 rounded-full transition-all duration-500"
                  style={{ width: `${confidenceScore}%` }}
                ></div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-gray-900">{confidenceScore}%</span>
              </div>
            </div>
            <p className="text-sm text-gray-700 text-center mt-2">{confidenceLabel}</p>
          </div>
        </div>

        {/* Recent Project History */}
        <div className="bg-inda-teal/20 rounded-xl p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Recent Project History
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs font-bold text-gray-900 border-b border-gray-300">
                <tr>
                  <th className="px-4 py-3 text-left">Project Title</th>
                  <th className="px-4 py-3 text-left">Delivery Date</th>
                  <th className="px-4 py-3 text-left">Feedback</th>
                  <th className="px-4 py-3 text-left">Rating</th>
                </tr>
              </thead>
              <tbody>
                {recentProjects.map((project, index) => (
                  <tr key={index} className="border-b border-gray-200 last:border-0">
                    <td className="px-4 py-3 text-gray-900">
                      {project.title}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {project.deliveryDate}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {project.feedback}
                    </td>
                    <td className="px-4 py-3 text-gray-900 flex items-center gap-1">
                      <span>⭐</span>
                      <span>{project.rating}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const RiskBar = ({ label, score }: { label: string; score: number }) => (
  <div>
    <div className="flex justify-between mb-1">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <span className="text-sm font-bold text-gray-900">{score}%</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className={`h-2 rounded-full ${
          score > 80
            ? "bg-inda-teal"
            : score > 50
            ? "bg-amber-500"
            : "bg-red-500"
        }`}
        style={{ width: `${score}%` }}
      ></div>
    </div>
  </div>
);

export default SellerVerification;
