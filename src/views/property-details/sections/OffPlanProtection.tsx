import { CheckCircle2, AlertTriangle, Clock, Shield, TrendingUp, AlertCircle } from "lucide-react";
import { Property } from "../data/propertyData";

interface OffPlanProtectionProps {
  property: Property;
}

export function OffPlanProtection({ property }: OffPlanProtectionProps) {
  if (!property.isOffPlan || !property.offPlanData) {
    return null;
  }

  const { offPlanData } = property;
  const hasDiscrepancy = offPlanData.developerClaimedCompletion !== offPlanData.indaVerifiedCompletion;
  const discrepancyPercent = Math.abs(offPlanData.developerClaimedCompletion - offPlanData.indaVerifiedCompletion);

  return (
    <div className="space-y-6">
      {/* Off-Plan Badge Header */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-5 h-5 text-blue-600" />
          <h4 className="text-blue-900">🏗️ Off-Plan Property - Protected by Inda</h4>
        </div>
        <p className="text-sm text-blue-700">
          Your money is safe with milestone-based escrow. We verify construction progress before any payment is released to the developer.
        </p>
      </div>

      {/* Completion Progress Comparison */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-gray-900">Construction Progress</h4>
          <span className="text-sm text-gray-600">
            Last verified: {offPlanData.lastVerificationDate}
          </span>
        </div>

        {/* Progress Bars */}
        <div className="space-y-4 mb-4">
          {/* Developer Claimed */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Developer Claims:</span>
              <span className="text-sm font-semibold text-gray-900">
                {offPlanData.developerClaimedCompletion}%
              </span>
            </div>
            <div className="relative h-3 bg-gray-200 rounded-full">
              <div 
                className="absolute h-3 bg-gray-400 rounded-full transition-all"
                style={{ width: `${offPlanData.developerClaimedCompletion}%` }}
              />
            </div>
          </div>
        </div>

        {/* Discrepancy Alert */}
        {hasDiscrepancy && discrepancyPercent > 10 && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h5 className="text-red-900 mb-1">⚠️ Significant Discrepancy Detected</h5>
                <p className="text-sm text-red-700">
                  Developer claimed {offPlanData.developerClaimedCompletion}% but Inda verified only {offPlanData.indaVerifiedCompletion}%. 
                  Your escrow funds remain protected until actual progress matches developer claims.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Expected Handover */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Expected Handover:</span>
            <span className="text-sm font-semibold text-gray-900">{offPlanData.expectedHandoverDate}</span>
          </div>
        </div>
      </div>

      {/* Milestone Tracker */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h4 className="text-gray-900 mb-4">Construction Milestones</h4>
        
        <div className="space-y-3">
          {offPlanData.milestones.map((milestone) => (
            <div 
              key={milestone.number}
              className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                milestone.status === "Complete" ? "bg-green-50" :
                milestone.status === "In Progress" ? "bg-yellow-50" :
                milestone.status === "Disputed" ? "bg-red-50" :
                "bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-3 flex-1">
                {/* Status Icon */}
                {milestone.status === "Complete" && (
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                )}
                {milestone.status === "In Progress" && (
                  <Clock className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                )}
                {milestone.status === "Not Started" && (
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0" />
                )}
                {milestone.status === "Disputed" && (
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                )}

                {/* Milestone Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h5 className="text-gray-900">
                      {milestone.number}. {milestone.name}
                    </h5>
                    {milestone.discrepancy && (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
                        Disputed
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    <span>Developer: {milestone.developerClaimed}%</span>
                    <span>•</span>
                    <span className="text-[#50b8b1] font-semibold">Inda: {milestone.indaVerified}%</span>
                    {milestone.verificationDate && (
                      <>
                        <span>•</span>
                        <span>Verified {milestone.verificationDate}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Payment Status */}
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900 mb-1">
                    {milestone.paymentPercentage}% Payment
                  </div>
                  {milestone.paymentReleased ? (
                    <span className="text-xs text-green-600 font-semibold">✓ Released</span>
                  ) : (
                    <span className="text-xs text-gray-500">🔒 Protected</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}