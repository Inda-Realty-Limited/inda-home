import React from "react";
import DownloadReportButton from "@/components/inc/DownloadReportButton";
import { FiCheck, FiDownload, FiInfo } from "react-icons/fi";

type Props = {
  confidenceScoreBreakdown: {
    overallScore: number;
    sections: { label: string; score: number; note: string }[];
    weightedCalculation: { label: string; weight: string; calculation: string }[];
    analystNote: string;
  };
  finalVerdict: {
    status: string;
    statusLabel: string;
    message: string;
    investmentGrade: string;
    stars: number;
  };
  downloadRef?: React.RefObject<HTMLElement>;
  filename?: string;
};

const FinalVerdict: React.FC<Props> = ({ confidenceScoreBreakdown, finalVerdict, downloadRef, filename }) => {
  return (
    <div className="w-full px-6">
      {/* Confidence Score Breakdown */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
        <svg width="24" height="30" viewBox="0 0 24 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.5833 15.9173C22.5833 22.5839 17.9167 25.9173 12.37 27.8506C12.0796 27.949 11.7641 27.9443 11.4767 27.8373C5.91667 25.9173 1.25 22.5839 1.25 15.9173V6.58393C1.25 6.23031 1.39048 5.89117 1.64052 5.64112C1.89057 5.39108 2.22971 5.2506 2.58333 5.2506C5.25 5.2506 8.58333 3.6506 10.9033 1.62393C11.1858 1.3826 11.5451 1.25 11.9167 1.25C12.2882 1.25 12.6475 1.3826 12.93 1.62393C15.2633 3.66393 18.5833 5.2506 21.25 5.2506C21.6036 5.2506 21.9428 5.39108 22.1928 5.64112C22.4429 5.89117 22.5833 6.23031 22.5833 6.58393V15.9173Z" stroke="#101820" stroke-opacity="0.9" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>

          Confidence Score Breakdown
        </h2>
        
        {/* Score Breakdown Bars */}
        <div className="space-y-6 mb-8">
          {confidenceScoreBreakdown.sections.map((section, idx) => (
            <div key={idx}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-base font-semibold text-gray-900">{section.label}</span>
                <span className="text-base font-bold text-gray-900">{section.score}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                <div
                  className="bg-inda-teal h-3 rounded-full transition-all duration-500"
                  style={{ width: `${section.score}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">{section.note}</p>
            </div>
          ))}
        </div>

        {/* Overall Confidence Circle */}
        <div className="flex justify-end items-center my-12">
          <div className="relative">
            <div className="text-center mb-4">
              <p className="text-lg font-semibold text-gray-900">Overall Confidence</p>
            </div>
            <div className="relative w-80 h-80 flex items-center justify-center">
              {/* Outermost light circle */}
              <div className="absolute w-80 h-80 rounded-full bg-gradient-to-br from-inda-teal/30 to-inda-teal/10 opacity-40"></div>
              
              {/* Second layer - lighter teal */}
              <div className="absolute w-72 h-72 rounded-full bg-gradient-to-br from-inda-teal/50 to-inda-teal/30  shadow-lg"></div>
              
              {/* Third layer - medium teal with progress arc */}
              <div className="absolute w-64 h-64 rounded-full bg-gradient-to-br from-inda-teal/70 to-inda-teal/50  shadow-xl">
                {/* Progress arc */}
                <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                  <circle
                    cx="128"
                    cy="128"
                    r="120"
                    fill="none"
                    stroke="#4EA8A1"
                    strokeWidth="12"
                    strokeDasharray={`${2 * Math.PI * 120}`}
                    strokeDashoffset={`${2 * Math.PI * 120 * (1 - confidenceScoreBreakdown.overallScore / 100)}`}
                    className="transition-all duration-1000 ease-out"
                    strokeLinecap="round"
                    opacity="0.8"
                  />
                </svg>
              </div>
              
              {/* Fourth layer - darker teal with shadow */}
              <div className="absolute w-52 h-52 rounded-full bg-gradient-to-br from-inda-teal/90 to-inda-teal/70 shadow-2xl">
                {/* Inner shadow effect */}
                <div className="absolute inset-0 rounded-full shadow-inner"></div>
              </div>
              
              {/* Center circle with percentage */}
              <div className="absolute w-40 h-40 rounded-full bg-inda-teal flex items-center justify-center shadow-2xl">
                <span className="text-5xl font-bold text-white">
                  {confidenceScoreBreakdown.overallScore}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Weighted Score Calculation */}
        <div className="mt-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Weighted Score Calculation
          </h3>
          <div className="space-y-3 mb-4">
            {confidenceScoreBreakdown.weightedCalculation.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center p-4 border-2 border-inda-teal rounded-xl bg-white"
              >
                <span className="text-sm font-medium text-gray-900">{item.label}</span>
                <span className="text-sm text-gray-600">{item.calculation}</span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-base font-bold text-gray-900">Total</span>
              <span className="text-base font-bold text-gray-900">{confidenceScoreBreakdown.overallScore}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-inda-teal h-3 rounded-full transition-all duration-500"
                style={{ width: `${confidenceScoreBreakdown.overallScore}%` }}
              ></div>
            </div>
          </div>

          {/* Investment Grade */}
          <div className="border-2 border-gray-200 rounded-xl p-6 bg-white">
            <h4 className="text-base font-bold text-gray-900 mb-3">Investment Grade</h4>
            <div className="flex items-center gap-2 mb-2">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill={i < finalVerdict.stars ? "#FFD700" : "none"}
                  stroke={i < finalVerdict.stars ? "#FFD700" : "#D1D5DB"}
                  strokeWidth="2"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
              ))}
            </div>
            <p className="text-sm text-inda-teal font-medium">{finalVerdict.investmentGrade}</p>
          </div>
        </div>
      </div>

      {/* Final Verdict Section */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0.75 13.25H4.5M22 13.25H25.75M13.25 25.75V22M13.25 4.5V0.75" stroke="#101820" stroke-opacity="0.9" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M10.75 13.25H15.75M13.25 15.75V10.75" stroke="#101820" stroke-opacity="0.9" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M7 2.42252C8.89931 1.32342 11.0556 0.746398 13.25 0.750017C20.1537 0.750017 25.75 6.34627 25.75 13.25C25.75 20.1538 20.1537 25.75 13.25 25.75C6.34625 25.75 0.75 20.1538 0.75 13.25C0.75 10.9738 1.35875 8.83752 2.4225 7.00002" stroke="#101820" stroke-opacity="0.9" stroke-width="1.5" stroke-linecap="round"/>
        </svg>

          Final Verdict
        </h2>

        {/* Strong Buy Card */}
        <div className="bg-inda-teal rounded-2xl p-8 text-center text-white mb-6">
          <div className="flex justify-center mb-4">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="32" cy="32" r="30" stroke="white" strokeWidth="4"/>
              <path d="M20 32L28 40L44 24" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 className="text-3xl font-bold mb-3">STRONG BUY</h3>
          <p className="text-lg opacity-90">{finalVerdict.message}</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <div className="flex justify-center mb-2">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#4EA8A1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="#4EA8A1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="#4EA8A1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h4 className="text-sm font-semibold text-gray-900 mb-1">Legal Compliance</h4>
            <p className="text-sm text-gray-600">95% Complete</p>
          </div>

          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <div className="flex justify-center mb-2">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="#4EA8A1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="10" r="3" stroke="#4EA8A1" strokeWidth="2"/>
              </svg>
            </div>
            <h4 className="text-sm font-semibold text-gray-900 mb-1">Survey Verified</h4>
            <p className="text-sm text-gray-600">100% Accurate</p>
          </div>

          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <div className="flex justify-center mb-2">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#4EA8A1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="7" r="4" stroke="#4EA8A1" strokeWidth="2"/>
              </svg>
            </div>
            <h4 className="text-sm font-semibold text-gray-900 mb-1">Seller Verified</h4>
            <p className="text-sm text-gray-600">82% Reliable</p>
          </div>

          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <div className="flex justify-center mb-2">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="#4EA8A1" strokeWidth="2"/>
                <circle cx="8.5" cy="8.5" r="1.5" fill="#4EA8A1"/>
                <path d="M21 15L16 10L5 21" stroke="#4EA8A1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h4 className="text-sm font-semibold text-gray-900 mb-1">Site Inspected</h4>
            <p className="text-sm text-gray-600">85% Quality</p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            How would you like to proceed?
          </h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <DownloadReportButton
              targetRef={downloadRef as React.RefObject<HTMLElement>}
              filename={filename}
              className="bg-inda-teal text-white px-8 py-3 rounded-xl font-semibold hover:bg-inda-teal/90 transition-colors"
            >
              Download Report
            </DownloadReportButton>
            <button className="bg-inda-teal text-white px-8 py-3 rounded-xl font-semibold hover:bg-inda-teal/90 transition-colors">
              Schedule Follow-Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalVerdict;

