import React from "react";
import Head from "next/head";
import { Container, Footer, Navbar } from "@/components";
import { ReportHeader, ExpertMarketAnalysis, LegalInsights } from "./sections";
import mockData from "@/data/mockDeeperDiveReport.json";
import {
  PriceAnalysis,
  MapInsights,
  DemandInsights,
} from "@/views/result/sections";

const DeeperDiveView: React.FC = () => {
  // For now, use mock data
  const data = mockData;

  return (
    <>
      <Head>
        <title>Deeper Dive Report • Inda</title>
      </Head>
      <Container noPadding className="min-h-screen bg-[#F9F9F9]">
        <Navbar />
        <main className="max-w-7xl mx-auto py-8">
          {/* Report Header */}
          <ReportHeader
            title={data.title}
            location={data.location}
            price={data.price}
            propertyType={data.propertyType}
            bedrooms={data.bedrooms}
            bathrooms={data.bathrooms}
            size={data.size}
            imageUrls={data.imageUrls}
            listingUrl={data.listingUrl}
          />

          {/* Sections */}
          <div className="mt-8 space-y-8">
            {/* Executive Summary */}
            <div className="w-full px-6">
              <div className="bg-white/80 border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-inda-teal">
                  Executive Summary
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-gray-700">
                      Overall Score
                    </span>
                    <span className="text-3xl font-bold text-inda-teal">
                      {data.aiSummary.overallScore}/100
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-gray-700">
                      Recommendation
                    </span>
                    <span className="text-xl font-bold text-gray-900">
                      {data.aiSummary.recommendation}
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Key Insights
                  </h3>
                  <ul className="space-y-2">
                    {data.aiSummary.keyInsights.map((insight, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-inda-teal mt-1">✓</span>
                        <span className="text-gray-700">{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Potential Risks
                  </h3>
                  <ul className="space-y-2">
                    {data.aiSummary.risks.map((risk, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-amber-500 mt-1">⚠</span>
                        <span className="text-gray-700">{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Expert Market Analysis - Unique to Deeper Dive */}
            <ExpertMarketAnalysis
              marketTrends={data.expertAnalysis.marketTrends}
            />

            {/* Legal Insights - Unique to Deeper Dive */}
            <LegalInsights legalInsights={data.expertAnalysis.legalInsights} />

            {/* Investment Risk Assessment */}
            <div className="w-full px-6">
              <div className="bg-white/80 border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-inda-teal">
                  Investment Risk Assessment
                </h2>

                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Overall Risk Level
                    </h3>
                    <p className="text-2xl font-bold text-amber-600">
                      {data.expertAnalysis.investmentRiskAssessment.overallRisk}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 mb-1">Risk Score</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {data.expertAnalysis.investmentRiskAssessment.riskScore}/100
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {data.expertAnalysis.investmentRiskAssessment.factors.map(
                    (factor, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-xl p-4"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-gray-900">
                            {factor.category}
                          </h4>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              factor.level === "Low"
                                ? "bg-green-100 text-green-800"
                                : factor.level === "Medium"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {factor.level}
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm">
                          {factor.description}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Price Analysis */}
            <PriceAnalysis
              price={data.price}
              fmv={data.priceAnalysis.fairMarketValue}
              months={data.priceAnalysis.priceHistory.map((h) => h.month)}
              fmvSeries={data.priceAnalysis.priceHistory.map((h) => h.fmv)}
              priceSeries={data.priceAnalysis.priceHistory.map((h) => h.price)}
              windowLabel="Last 5 Months"
              last6ChangePct={5.1}
              marketPositionPct={data.priceAnalysis.priceVsFMV}
              selectedBar={null}
              setSelectedBar={() => {}}
              dataPoints={data.priceAnalysis.dataPoints}
            />

            {/* Market Insights */}
            <MapInsights isOpen={true} toggle={() => {}} aiSummary={null} />

            {/* Demand Insights */}
            <DemandInsights
              buyers={data.demandInsights.customerSegments[0].percentage}
              longTermRenters={data.demandInsights.customerSegments[1].percentage}
              shortTermRenters={data.demandInsights.customerSegments[2].percentage}
              landBankers={data.demandInsights.customerSegments[3].percentage}
              investment={data.demandInsights.purchasePurpose.investment}
              owners={data.demandInsights.purchasePurpose.owners}
              supplyDemandRatio={data.demandInsights.supplyDemandRatio}
            />

            {/* Neighborhood Development Plans */}
            <div className="w-full px-6">
              <div className="bg-white/80 border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-inda-teal">
                  Neighborhood Development Plans
                </h2>

                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Upcoming Projects
                  </h3>
                  <ul className="space-y-3">
                    {data.expertAnalysis.neighborhoodDevelopment.upcomingProjects.map(
                      (project, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 bg-indigo-50 rounded-lg p-3"
                        >
                          <span className="text-inda-teal mt-1">🏗️</span>
                          <span className="text-gray-700">{project}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-6">
                  <h4 className="font-bold text-gray-900 mb-2">
                    Impact Assessment
                  </h4>
                  <p className="text-gray-700">
                    {data.expertAnalysis.neighborhoodDevelopment.impactAssessment}
                  </p>
                </div>
              </div>
            </div>

            {/* Exit Strategy Recommendations */}
            <div className="w-full px-6">
              <div className="bg-white/80 border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-inda-teal">
                  Exit Strategy Recommendations
                </h2>

                <div className="mb-6 bg-indigo-50 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        Recommended Hold Period
                      </h3>
                      <p className="text-2xl font-bold text-inda-teal">
                        {data.expertAnalysis.exitStrategy.recommendedHoldPeriod}
                      </p>
                    </div>
                    <div className="text-right">
                      <h3 className="text-lg font-bold text-gray-900">
                        Optimal Exit Timing
                      </h3>
                      <p className="text-xl font-bold text-gray-900">
                        {data.expertAnalysis.exitStrategy.optimalExitTiming}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {data.expertAnalysis.exitStrategy.strategies.map(
                    (strategy, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-xl p-6"
                      >
                        <h4 className="text-xl font-bold text-gray-900 mb-2">
                          {strategy.type}
                        </h4>
                        <p className="text-gray-700 mb-4">
                          {strategy.description}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="font-semibold text-gray-900 mb-2">
                              Pros:
                            </p>
                            <ul className="space-y-1">
                              {strategy.pros.map((pro, i) => (
                                <li key={i} className="text-sm text-gray-700">
                                  • {pro}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 mb-2">
                              Cons:
                            </p>
                            <ul className="space-y-1">
                              {strategy.cons.map((con, i) => (
                                <li key={i} className="text-sm text-gray-700">
                                  • {con}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="mt-4 bg-teal-50 rounded-lg p-3">
                          <p className="font-semibold text-gray-900">
                            Estimated Return:{" "}
                            <span className="text-inda-teal">
                              {strategy.estimatedReturn}
                            </span>
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Priority Support */}
            <div className="w-full px-6">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-6 sm:p-8 shadow-sm">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-inda-teal">
                  🎯 Priority Support
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      Dedicated Analyst
                    </p>
                    <p className="text-xl font-bold text-gray-900">
                      {data.prioritySupport.dedicatedAnalyst}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Response Time</p>
                    <p className="text-xl font-bold text-gray-900">
                      {data.prioritySupport.responseTime}
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="font-semibold text-gray-900 mb-2">
                    Contact Email:
                  </p>
                  <a
                    href={`mailto:${data.prioritySupport.contactEmail}`}
                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    {data.prioritySupport.contactEmail}
                  </a>
                </div>

                <div>
                  <p className="font-semibold text-gray-900 mb-3">
                    Additional Services:
                  </p>
                  <ul className="space-y-2">
                    {data.prioritySupport.additionalServices.map(
                      (service, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-inda-teal mt-1">✓</span>
                          <span className="text-gray-700">{service}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </Container>
    </>
  );
};

export default DeeperDiveView;

