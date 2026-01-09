import React from "react";
import {
    ReportHeader,
    ExecutiveSummary,
    LegalVerification,
    SurveyVerification,
    FinalVerdict,
} from "../../../views/deep-dive/sections";

type VerificationItem = {
    id: string;
    title: string;
    description: string;
    status: "verified" | "pending" | "failed";
    icon: string;
};

interface DeepDiveReportData {
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
    };
    keyFindings: string[];
    legalVerification: VerificationItem[];
    surveyVerification: VerificationItem[];
    propertyCoordinates: { latitude: number; longitude: number };
    finalVerdict: {
        status: "proceed" | "caution" | "decline";
        message: string;
        metrics: any[];
    };
}

interface ReportProps {
    data: DeepDiveReportData;
    reportRef?: React.RefObject<HTMLDivElement | null>;
}

const DeepDiveReport: React.FC<ReportProps> = ({ data, reportRef }) => {
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

            {/* Sections */}
            <div className="mt-8 space-y-8">
                {/* Executive Summary */}
                <ExecutiveSummary
                    propertyType={data.propertyOverview?.propertyType || "N/A"}
                    location={data.propertyOverview?.location || "N/A"}
                    landSize={data.propertyOverview?.landSize || "N/A"}
                    yearBuilt={data.propertyOverview?.yearBuilt || "N/A"}
                    keyFindings={data.keyFindings || []}
                />

                {/* Legal Verification */}
                <LegalVerification items={data.legalVerification || []} />

                {/* Survey & Land Verification */}
                <SurveyVerification
                    items={data.surveyVerification || []}
                    coordinates={data.propertyCoordinates}
                />

                {/* Final Verdict */}
                <FinalVerdict
                    status={data.finalVerdict?.status || "caution"}
                    message={data.finalVerdict?.message || "Verification in progress."}
                    metrics={data.finalVerdict?.metrics || []}
                    downloadRef={reportRef}
                    filename={`Inda-${data.reportId}.pdf`}
                />
            </div>
        </div>
    );
};

export default DeepDiveReport;
export type { DeepDiveReportData as ReportData };
