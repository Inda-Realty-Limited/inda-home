import React, { useRef } from "react";
import Head from "next/head";
import { Container, Footer, Navbar } from "@/components";
import DeeperDiveReport from "@/components/dashboard/reports/DeeperDiveReport";
import mockData from "@/data/mockDeeperDiveReport.json";

const DeeperDiveView: React.FC = () => {
  // For now, use mock data
  const data = mockData as any;
  const reportRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <Head>
        <title>Deeper Dive Report • Inda</title>
      </Head>
      <Container noPadding className="min-h-screen bg-[#F9F9F9]">
        <Navbar />
        <main className="max-w-7xl mx-auto py-8">
          <DeeperDiveReport data={data} reportRef={reportRef} />
        </main>
        <Footer />
      </Container>
    </>
  );
};

export default DeeperDiveView;
