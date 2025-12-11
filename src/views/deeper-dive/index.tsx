import React, { useRef, useState } from "react";
import Head from "next/head";
import { Container, Footer, Navbar } from "@/components";
import {
  ReportHeader,
  ExecutiveSummary,
  SellerVerification,
  OnSiteInspection,
  LegalVerification,
  SurveyVerification,
  FinalVerdict,
} from "./sections";
import mockData from "@/data/mockDeeperDiveReport.json";
import {
  PriceAnalysis,
  MapInsights,
  DemandInsights,
} from "@/views/result/sections";

// Types matching the component expectations
type VerificationItem = {
  id: string;
  title: string;
  description: string;
  status: "verified" | "pending" | "failed";
  icon: string;
};

const DeeperDiveView: React.FC = () => {
  // Cast mock data to verify types
  const data = mockData;
  const reportRef = useRef<HTMLDivElement>(null);
  const [selectedBar, setSelectedBar] = useState<{
    series: "fmv" | "price";
    index: number;
  } | null>(null);

  return (
    <>
      <Head>
        <title>Deeper Dive Report • Inda</title>
      </Head>
      <Container noPadding className="min-h-screen bg-[#F9F9F9]">
        <Navbar />
        <main className="max-w-7xl mx-auto py-8 space-y-8" ref={reportRef}>
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
            propertyType={data.propertyOverview.propertyType}
            location={data.propertyOverview.location}
            landSize={data.propertyOverview.landSize}
            yearBuilt={data.propertyOverview.yearBuilt}
            keyFindings={data.keyFindings}
            siteVisitDate={data.propertyOverview.siteVisitDate}
            inspector={data.propertyOverview.inspector}
          />

          {/* Legal Verification Details */}
          <LegalVerification
            items={data.legalVerification as VerificationItem[]}
          />

          {/* Survey Verification Details */}
          <SurveyVerification
            items={data.surveyVerification as VerificationItem[]}
            coordinates={data.propertyCoordinates}
            zoom={16}
          />

          {/* Seller Verification - Unique to Deeper Dive */}
          <SellerVerification
            developerProfile={data.sellerVerification.developerProfile}
            riskAssessment={data.sellerVerification.riskAssessment}
            confidenceScore={data.sellerVerification.confidenceScore}
            confidenceLabel={data.sellerVerification.confidenceLabel}
            recentProjects={data.sellerVerification.recentProjects}
          />

          {/* On-Site Inspection - Unique to Deeper Dive */}
          <OnSiteInspection
            items={data.onSiteInspection as VerificationItem[]}
            photos={data.photoDocumentation}
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
                          style={{ width: "89%" }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-12 text-right">
                        89%
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Noise Level</span>
                    <div className="flex items-center gap-3 flex-1 max-w-md">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-inda-teal h-2 rounded-full"
                          style={{ width: "25%" }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-12 text-right">
                        25%
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Flood Risk</span>
                    <div className="flex items-center gap-3 flex-1 max-w-md">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-inda-teal h-2 rounded-full"
                          style={{ width: "15%" }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-12 text-right">
                        15%
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
                  <div className="flex items-start gap-2">
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
                      Property shows excellent maintenance and modern finishes
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
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
                      All major systems operational and well-maintained
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
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
                      Neighbourhood infrastructure in excellent condition
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="mt-0.5 flex-shrink-0"
                    >
                      <path
                        d="M8 1L8 15M1 8L15 8"
                        stroke="#F59E0B"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <circle cx="8" cy="8" r="7" stroke="#F59E0B" strokeWidth="2" fill="none"/>
                    </svg>
                    <span className="text-sm text-gray-700">
                      Swimming pool completion expected within 4 weeks
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Final Verdict */}
          <FinalVerdict
            confidenceScoreBreakdown={data.confidenceScoreBreakdown}
            finalVerdict={data.finalVerdict}
            downloadRef={reportRef}
            filename={`Inda-${data.reportId}.pdf`}
          />
        </main>
        <Footer />
      </Container>
    </>
  );
};

export default DeeperDiveView;
