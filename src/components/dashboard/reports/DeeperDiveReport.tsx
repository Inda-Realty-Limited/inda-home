import React from "react";
import {
    ReportHeader,
    ExecutiveSummary,
    SellerVerification,
    OnSiteInspection,
    LegalVerification,
    SurveyVerification,
    FinalVerdict,
} from "../../../views/deeper-dive/sections";

type VerificationItem = {
    id: string;
    title: string;
    description: string;
    status: "verified" | "pending" | "failed";
    icon: string;
};

interface DeeperDiveReportData {
    reportId: string;
    client: string;
    analyst: string;
    reportDate: string;
    confidenceLevel: string;
    confidenceScore: number;
    propertyOverview: {
        propertyType: string;
        location: string;
        landSize: string;
        yearBuilt: string;
        siteVisitDate: string;
        inspector: string;
    };
    keyFindings: string[];
    legalVerification: VerificationItem[];
    surveyVerification: VerificationItem[];
    propertyCoordinates: { latitude: number; longitude: number };
    sellerVerification: {
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
        recentProjects: Array<{
            title: string;
            deliveryDate: string;
            feedback: string;
            rating: number;
        }>;
    };
    onSiteInspection: VerificationItem[];
    photoDocumentation: {
        exterior: string[];
        interior: string[];
        electrical?: string[];
        neighbourhood?: string[];
    };
    environmentalAssessment?: {
        airQuality: number;
        noiseLevel: number;
        floodRisk: number;
    };
    inspectorNotes?: string[];
    confidenceScoreBreakdown: any;
    finalVerdict: any;
}

interface ReportProps {
    data: DeeperDiveReportData;
    reportRef?: React.RefObject<HTMLDivElement | null>;
}

const DeeperDiveReport: React.FC<ReportProps> = ({ data, reportRef }) => {
    if (!data) return null;

    return (
        <div className="space-y-8" ref={reportRef}>
            {/* Report Header */}
            <ReportHeader
                reportId={data.reportId}
                client={data.client}
                analyst={data.analyst}
                reportDate={data.reportDate}
                confidenceLevel={data.confidenceLevel}
                confidenceScore={data.confidenceScore}
            />

            {/* Executive Summary */}
            <ExecutiveSummary
                propertyType={data.propertyOverview?.propertyType || "N/A"}
                location={data.propertyOverview?.location || "N/A"}
                landSize={data.propertyOverview?.landSize || "N/A"}
                yearBuilt={data.propertyOverview?.yearBuilt || "N/A"}
                keyFindings={data.keyFindings || []}
                siteVisitDate={data.propertyOverview?.siteVisitDate || "N/A"}
                inspector={data.propertyOverview?.inspector || "N/A"}
            />

            {/* Legal Verification Details */}
            <LegalVerification
                items={data.legalVerification || []}
            />

            {/* Survey Verification Details */}
            <SurveyVerification
                items={data.surveyVerification || []}
                coordinates={data.propertyCoordinates}
                zoom={16}
            />

            {/* Seller Verification - Unique to Deeper Dive */}
            <SellerVerification
                developerProfile={data.sellerVerification?.developerProfile || { company: "N/A", yearsInBusiness: "N/A", cacRegistration: "N/A", redanMembership: "N/A" }}
                riskAssessment={data.sellerVerification?.riskAssessment || { financialStability: 0, deliveryTrackRecord: 0, customerSatisfaction: 0 }}
                confidenceScore={data.sellerVerification?.confidenceScore || 0}
                confidenceLabel={data.sellerVerification?.confidenceLabel || "N/A"}
                recentProjects={data.sellerVerification?.recentProjects || []}
            />

            {/* On-Site Inspection - Unique to Deeper Dive */}
            <OnSiteInspection
                items={data.onSiteInspection || []}
                photos={data.photoDocumentation || { exterior: [], interior: [] }}
            />

            {/* Environmental Assessment & Inspector Notes */}
            <div className="w-full px-6">
                <div className="border-2 border-inda-teal rounded-2xl p-6 sm:p-8 bg-white">
                    {/* Environmental Assessment */}
                    <div className="mb-8 bg-[#E5E5E5CC] rounded-xl p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                            Environmental Assessment
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-700">Air Quality</span>
                                <div className="flex items-center gap-3 flex-1 max-w-md">
                                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-inda-teal h-2 rounded-full"
                                            style={{ width: `${data.environmentalAssessment?.airQuality || 89}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-sm font-medium text-gray-900 w-12 text-right">
                                        {data.environmentalAssessment?.airQuality || 89}%
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-700">Noise Level</span>
                                <div className="flex items-center gap-3 flex-1 max-w-md">
                                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-inda-teal h-2 rounded-full"
                                            style={{ width: `${data.environmentalAssessment?.noiseLevel || 25}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-sm font-medium text-gray-900 w-12 text-right">
                                        {data.environmentalAssessment?.noiseLevel || 25}%
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-700">Flood Risk</span>
                                <div className="flex items-center gap-3 flex-1 max-w-md">
                                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-inda-teal h-2 rounded-full"
                                            style={{ width: `${data.environmentalAssessment?.floodRisk || 15}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-sm font-medium text-gray-900 w-12 text-right">
                                        {data.environmentalAssessment?.floodRisk || 15}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Inspector Notes */}
                    <div className="bg-[#E5E5E5CC] rounded-xl p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                            Inspector Notes
                        </h3>
                        <div className="space-y-2">
                            {(data.inspectorNotes || [
                                "Field inspection pending completion",
                                "Analyst has been assigned to the property site",
                                "Standard verification protocols in progress"
                            ]).map((note, idx) => (
                                <div key={idx} className="flex items-start gap-2">
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 16 16"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="mt-0.5 flex-shrink-0"
                                    >
                                        <path
                                            d="M13.3346 4L6.0013 11.3333L2.66797 8"
                                            stroke="#4EA8A1"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    <span className="text-sm text-gray-700">
                                        {note}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Final Verdict */}
            <FinalVerdict
                confidenceScoreBreakdown={data.confidenceScoreBreakdown || { overallScore: 0, sections: [], weightedCalculation: [] }}
                finalVerdict={data.finalVerdict || { status: "pending", statusLabel: "In Progress", message: "Verification results pending.", investmentGrade: "N/A", stars: 0 }}
                downloadRef={reportRef}
                filename={`Inda-${data.reportId}.pdf`}
            />
        </div>
    );
};

export default DeeperDiveReport;
export type { DeeperDiveReportData as DeeperReportData };
