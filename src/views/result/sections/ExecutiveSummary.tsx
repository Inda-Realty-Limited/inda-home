import React from "react";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

type Props = {
  propertyDescription?: string;
  investmentOpportunity?: string;
  indaScore?: number;
  indaScoreMax?: number;
  priceVariance?: number;
  priceVarianceAmount?: string;
  keyStrengths?: string[];
  riskFactors?: string[];
};

const ExecutiveSummary: React.FC<Props> = ({
  propertyDescription = "This 4-bedroom duplex in Lekki Phase 1 presents adf",
  investmentOpportunity = "solid investment opportunitydf",
  indaScore = 75,
  indaScoreMax = 100,
  priceVariance = 11,
  priceVarianceAmount = "₦135M",
  keyStrengths = [
    "Strong seller credibility (92% on-time delivery)df",
    "High-demand microlocation (+8% YoY growth)df",
    "Attractive rental yields (8.5% short-let, 6.2% long-let)df",
    "Area supported by strong infrastructure expansiondf",
  ],
  riskFactors = [
    "Slight oversupply (1.2× market ratio)df",
    "Asking price exceeds fair market rangedf",
    "Moderate inflation exposure in microlocation zonedf",
  ],
}) => {
  return (
    <div className="w-full px-6">
      <div className="bg-white/80 border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="mb-6">
          <h3 className="text-2xl md:text-3xl font-bold text-inda-teal mb-2">
            Executive Summary
          </h3>
          <p className="text-gray-600">
            Concise analysis of investment potential and next steps
          </p>
        </div>

        <div className="mb-8">
          <p className="text-gray-700 leading-relaxed">
            {propertyDescription}{" "}
            <span className="font-bold text-gray-900">
              {investmentOpportunity}
            </span>{" "}
            with an Inda Score of{" "}
            <span className="text-inda-teal font-bold">
              {indaScore}/{indaScoreMax}
            </span>
            . The property is currently overpriced by {Math.abs(priceVariance)}%
            compared to its Fair Market Value ({priceVarianceAmount}), creating
            room for negotiation.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <FaCheckCircle className="text-inda-teal text-xl" />
              <h4 className="text-xl font-bold text-gray-900">Key Strengths</h4>
            </div>
            <ul className="space-y-2 ml-8">
              {keyStrengths.map((strength, index) => (
                <li
                  key={index}
                  className="text-gray-700 leading-relaxed list-none"
                >
                  {strength}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <FaExclamationTriangle className="text-yellow-500 text-xl" />
              <h4 className="text-xl font-bold text-gray-900">Risk Factors</h4>
            </div>
            <ul className="space-y-2 ml-8">
              {riskFactors.map((risk, index) => (
                <li
                  key={index}
                  className="text-gray-700 leading-relaxed list-none"
                >
                  {risk}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveSummary;

