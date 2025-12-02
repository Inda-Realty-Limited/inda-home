import React from "react";
import { FiHome, FiMapPin, FiMaximize, FiCalendar, FiUser } from "react-icons/fi";

type Props = {
  propertyType: string;
  location: string;
  landSize: string;
  yearBuilt: string;
  keyFindings: string[];
  siteVisitDate?: string;
  inspector?: string;
};

const ExecutiveSummary: React.FC<Props> = ({
  propertyType,
  location,
  landSize,
  yearBuilt,
  keyFindings,
  siteVisitDate,
  inspector,
}) => {
  return (
    <div className="w-full px-6">
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <svg width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.875 3.875V24.5417C3.875 25.2268 4.14717 25.8839 4.63164 26.3684C5.11611 26.8528 5.77319 27.125 6.45833 27.125H27.125" stroke="#111111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M23.25 21.9583V11.625" stroke="#111111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16.792 21.959V6.45898" stroke="#111111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10.333 21.959V18.084" stroke="#111111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Executive Summary
        </h2>

        {/* Property Overview */}
        <div className="mb-8">
        <div className="border border-inda-teal/50 rounded-2xl p-6 sm:p-8 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Property Overview
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="border bg-[#E5E5E5CC] border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <FiHome className="text-black" size={18} />
                <span className="text-xs font-bold text-gray-800">Property Type</span>
              </div>
              <p className="text-sm text-gray-900">{propertyType}</p>
            </div>

            <div className="border bg-[#E5E5E5CC] border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <FiMapPin className="text-black" size={18} />
                <span className="text-xs  font-bold text-gray-900">Location</span>
              </div>
              <p className="text-sm text-gray-900">{location}</p>
            </div>

            <div className="border bg-[#E5E5E5CC] border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <FiMaximize className="text-black" size={18} />
                <span className="text-xs font-bold text-gray-900">Land Size</span>
              </div>
              <p className="text-sm text-gray-900">{landSize}</p>
            </div>

            <div className="border bg-[#E5E5E5CC] border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <FiCalendar className="text-black" size={18} />
                <span className="text-xs font-bold text-gray-900">Year Built</span>
              </div>
              <p className="text-sm text-gray-900">{yearBuilt}</p>
            </div>

            {siteVisitDate && (
              <div className="border bg-[#E5E5E5CC] border-gray-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-xs font-bold text-gray-900">Site Visit Date</span>
                </div>
                <p className="text-sm text-gray-900">{siteVisitDate}</p>
              </div>
            )}

            {inspector && (
              <div className="border bg-[#E5E5E5CC] border-gray-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FiUser className="text-black" size={18} />
                  <span className="text-xs font-bold text-gray-900">Inspector</span>
                </div>
                <p className="text-sm text-gray-900">{inspector}</p>
              </div>
            )}
          </div>
          </div>
        </div>

        {/* Key Findings */}
        <div className="bg-[#E5E5E5CC] rounded-xl p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Key Findings</h3>
          <ul className="space-y-3">
            {keyFindings.map((finding, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-inda-teal/20 flex items-center justify-center mt-0.5">
                  <span className="text-inda-teal text-xs">✓</span>
                </span>
                <span className="text-sm text-gray-700">{finding}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveSummary;

