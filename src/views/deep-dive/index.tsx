import React from "react";
import Head from "next/head";
import DeepDiveReport from "@/components/dashboard/reports/DeepDiveReport";
import mockData from "@/data/mockDeepDiveReport.json";

const DeepDiveView: React.FC = () => {
  const data = mockData as any;

  return (
    <>
      <Head>
        <title>Property Report • Inda</title>
      </Head>
      <DeepDiveReport data={data} />
    </>
  );
};

export default DeepDiveView;
