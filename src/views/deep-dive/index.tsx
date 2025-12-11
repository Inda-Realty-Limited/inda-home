import React, { useRef } from "react";
import Head from "next/head";
import { Container, Footer, Navbar } from "@/components";
import {
  ReportHeader,
  ExecutiveSummary,
  LegalVerification,
  SurveyVerification,
  FinalVerdict,
} from "./sections";
import mockData from "@/data/mockDeepDiveReport.json";

type VerificationItem = {
  id: string;
  title: string;
  description: string;
  status: "verified" | "pending";
  icon: string;
};

const DeepDiveView: React.FC = () => {
  // For now, use mock data
  const data = mockData;
  const reportRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <Head>
        <title>Deep Dive Report • Inda</title>
      </Head>
      <Container noPadding className="min-h-screen bg-[#F9F9F9]">
        <Navbar />
        <main className="max-w-7xl mx-auto py-8" ref={reportRef}>
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
              propertyType={data.propertyOverview.propertyType}
              location={data.propertyOverview.location}
              landSize={data.propertyOverview.landSize}
              yearBuilt={data.propertyOverview.yearBuilt}
              keyFindings={data.keyFindings}
            />

            {/* Legal Verification */}
            <LegalVerification items={data.legalVerification as VerificationItem[]} />

            {/* Survey & Land Verification */}
            <SurveyVerification
              items={data.surveyVerification as VerificationItem[]}
              coordinates={data.propertyCoordinates}
            />

            {/* Final Verdict */}
            <FinalVerdict
              status={data.finalVerdict.status as "proceed" | "caution" | "decline"}
              message={data.finalVerdict.message}
              metrics={data.finalVerdict.metrics}
              downloadRef={reportRef}
              filename={`Inda-${data.reportId}.pdf`}
            />
          </div>
        </main>
        <Footer />
      </Container>
    </>
  );
};

export default DeepDiveView;
