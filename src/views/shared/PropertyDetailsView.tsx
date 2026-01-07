import React, { useRef} from 'react';
import GallerySection from '../result/sections/GallerySection';
import SmartSummary from '../result/sections/SmartSummary';
import AmenitiesSection from '../result/sections/AmenitiesSection';
import PriceAnalysis from '../result/sections/PriceAnalysis';
import DemandInsights from '../result/sections/DemandInsights';
import ExecutiveSummary from '../result/sections/ExecutiveSummary';
import ComparableProperties from '../result/sections/ComparableProperties';
import ProceedActions from '../result/sections/ProceedActions';
import Disclaimer from '../result/sections/Disclaimer';
import { useAuth } from '@/contexts/AuthContext';

interface PropertyDetailsViewProps {
  result: any;
  price?: number | null;
  fairValue?: number | null;
  chartMonths: string[];
  chartFMV: number[];
  chartPriceSeries: number[];
  chartWindowLabel: string;
  last6ChangePct: number;
  marketPositionPct: number;
  selectedBar: null | { series: "fmv" | "price"; index: number };
  setSelectedBar: (v: null | { series: "fmv" | "price"; index: number }) => void;
  deliveryLabel: string;
  deliverySource: string;
  listingStatus: string | null;
  bedroomsDisplay: string | number;
  bathroomsDisplay: string | number;
  sizeDisplay: string | number;
  propertyTypeDisplay: string;
  microlocationDisplay: string;
  fallbackTitleDisplay: string;
  fallbackLocationDisplay: string;
  fallbackListingDisplay: string;
  onDeeperVerification?: () => void;
  onBuyWithInda?: () => void;
  onFinanceWithInda?: () => void;
}

export const PropertyDetailsView: React.FC<PropertyDetailsViewProps> = ({
  result,
  price,
  fairValue,
  chartMonths,
  chartFMV,
  chartPriceSeries,
  chartWindowLabel,
  last6ChangePct,
  marketPositionPct,
  selectedBar,
  setSelectedBar,
  deliveryLabel,
  deliverySource,
  listingStatus,
  bedroomsDisplay,
  bathroomsDisplay,
  sizeDisplay,
  propertyTypeDisplay,
  microlocationDisplay,
  onDeeperVerification,
  onBuyWithInda,
  onFinanceWithInda,
}) => {
  const badgesScrollRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const scrollContainer = (container: HTMLDivElement | null, direction: 'left' | 'right') => {
    if (!container) return;
    const scrollAmount = 200;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const getRelativeTime = (timestamp: number | string | Date) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return then.toLocaleDateString();
  };

  return (
    <div className="text-[#101820]/90 w-full max-w-7xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="px-6">
        <div className="flex items-center justify-end gap-2 text-sm text-gray-600 mb-4">
          <div className="w-2 h-2 rounded-full bg-green-700 animate-pulse"></div>
          <span className="whitespace-nowrap">
            Updated {getRelativeTime(
              result?.updatedAt ||
              result?.snapshot?.updatedAt ||
              result?.createdAt ||
              Date.now()
            )}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Side - Gallery */}
          <GallerySection imageUrls={result?.snapshot?.imageUrls ?? []} isHeaderGallery />

          {/* Right Side - Property Info */}
          <div className="bg-[#E8F4F3] rounded-3xl p-8 flex flex-col justify-between min-h-[500px]">
            <div className="space-y-6">
              <div>
                <h2 className="text-4xl font-bold mb-3 text-gray-900">
                  Hi {user?.firstName || "there"},
                </h2>
                <p className="text-lg text-gray-700">
                  Here's what we found based on your search.
                </p>
              </div>

              {(result?.listingUrl || result?.snapshot?.listingUrl) && (
                <div className="bg-inda-teal rounded-2xl p-5 space-y-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-white text-sm font-medium flex-shrink-0">
                      Results for the listing link
                    </span>
                    <a
                      className="text-white/90 underline text-sm hover:text-white transition-colors truncate flex-1 min-w-0"
                      href={result?.listingUrl || result?.snapshot?.listingUrl}
                      target="_blank"
                      rel="noreferrer"
                      title={result?.listingUrl || result?.snapshot?.listingUrl}
                    >
                      {result?.listingUrl || result?.snapshot?.listingUrl}
                    </a>
                  </div>

                  <div className="flex items-center justify-end">
                    <button
                      onClick={() => scrollContainer(badgesScrollRef.current, 'right')}
                      className="text-white text-xs font-medium flex items-center gap-1.5 hover:opacity-80 transition-opacity cursor-pointer"
                    >
                      <svg width="28" height="16" viewBox="0 0 28 16" fill="none">
                        <path d="M2 5l5 3-5 3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M10 5l5 3-5 3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M18 5l5 3-5 3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Swipe
                    </button>
                  </div>

                  <div className="relative">
                    <div
                      ref={badgesScrollRef}
                      className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide scroll-smooth"
                      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    >
                      <style jsx>{`
                        div::-webkit-scrollbar {
                          display: none;
                        }
                      `}</style>

                      <div className="flex items-center gap-2.5 bg-transparent border-2 border-white px-3 py-2 rounded-lg flex-shrink-0">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-white">
                          <rect x="2" y="7" width="14" height="9" rx="1" stroke="currentColor" strokeWidth="1.5" />
                          <path d="M6 10h6M6 13h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        <span className="text-sm font-normal text-white">Bedrooms</span>
                        <span className="bg-white px-2.5 py-0.5 rounded text-sm font-bold text-gray-900">
                          {bedroomsDisplay}
                        </span>
                      </div>

                      <div className="flex items-center gap-2.5 bg-transparent border-2 border-white px-3 py-2 rounded-lg flex-shrink-0">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-white">
                          <path d="M2 7h14M6 11v2M12 11v2M3 7V5a1 1 0 011-1h10a1 1 0 011 1v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        <span className="text-sm font-normal text-white">Bathrooms</span>
                        <span className="bg-white px-2.5 py-0.5 rounded text-sm font-bold text-gray-900">
                          {bathroomsDisplay}
                        </span>
                      </div>

                      <div className="flex items-center gap-2.5 bg-transparent border-2 border-white px-3 py-2 rounded-lg flex-shrink-0">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-white">
                          <path d="M3 3h12v12H3V3z" stroke="currentColor" strokeWidth="1.5" />
                          <path d="M3 9h12M9 3v12" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                        <span className="text-sm font-normal text-white">Size</span>
                        <span className="bg-white px-2.5 py-0.5 rounded text-sm font-bold text-gray-900 whitespace-nowrap">
                          {`${sizeDisplay} m²`}
                        </span>
                      </div>

                      {result?.snapshot?.propertyTypeStd && (
                        <div className="flex items-center gap-2.5 bg-transparent border-2 border-white px-3 py-2 rounded-lg flex-shrink-0">
                          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-white">
                            <path d="M2 9l7-6 7 6M4 7v7a1 1 0 001 1h8a1 1 0 001-1V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          </svg>
                          <span className="text-sm font-normal text-white">Type</span>
                          <span className="bg-white px-2.5 py-0.5 rounded text-xs font-bold text-gray-900 whitespace-nowrap">
                            {result.snapshot.propertyTypeStd}
                          </span>
                        </div>
                      )}

                      {result?.snapshot?.addedOnDate && (
                        <div className="flex items-center gap-2.5 bg-transparent border-2 border-white px-3 py-2 rounded-lg flex-shrink-0">
                          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-white">
                            <rect x="2" y="3" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
                            <path d="M2 7h14M6 1v4M12 1v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          </svg>
                          <span className="text-sm font-normal text-white">Year Built</span>
                          <span className="bg-white px-2.5 py-0.5 rounded text-sm font-bold text-gray-900">
                            {new Date(result.snapshot.addedOnDate).getFullYear()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3 pt-2">
              <h3 className="text-2xl font-bold text-gray-900">
                {result?.snapshot?.title || result?.title || "Property Title"}
              </h3>
              <p className="text-base text-gray-700 flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-inda-teal flex-shrink-0">
                  <path d="M9 9a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM9 16s6.75-5.063 6.75-9a6.75 6.75 0 10-13.5 0c0 3.938 6.75 9 6.75 9z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {microlocationDisplay}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Smart Summary */}
      <SmartSummary
        result={result}
        deliveryLabel={deliveryLabel}
        deliverySource={deliverySource}
        listingStatus={listingStatus}
      />

      {/* Amenities */}
      <AmenitiesSection result={result} />

      {/* Property Price Analysis with Interactive Chart */}
      <PriceAnalysis
        price={typeof price === "number" ? price : null}
        fmv={
          typeof fairValue === "number"
            ? fairValue
            : chartFMV.length > 0
              ? chartFMV[chartFMV.length - 1]
              : null
        }
        months={chartMonths}
        fmvSeries={chartFMV}
        priceSeries={chartPriceSeries}
        windowLabel={chartWindowLabel}
        last6ChangePct={last6ChangePct}
        marketPositionPct={marketPositionPct}
        selectedBar={selectedBar}
        setSelectedBar={setSelectedBar}
      />

      {/* Demand Insights */}
      <DemandInsights />

      {/* Executive Summary */}
      <ExecutiveSummary
        propertyDescription={`This ${bedroomsDisplay}-bedroom ${propertyTypeDisplay} in ${microlocationDisplay} presents a`}
        investmentOpportunity="solid investment opportunity"
        indaScore={result?.indaScore?.finalScore || 75}
        indaScoreMax={100}
        priceVariance={
          result?.analytics?.price?.priceVsFmvPct || 11
        }
        priceVarianceAmount={
          result?.analytics?.price?.priceVsFmvAmountNGN
            ? `₦${(result.analytics.price.priceVsFmvAmountNGN / 1000000).toFixed(0)}M`
            : "₦135M"
        }
      />

      {/* Comparable Properties */}
      <ComparableProperties />

      {/* Call to Action Buttons */}
      <ProceedActions
        onDeeperVerification={onDeeperVerification || (() => {})}
        onBuyWithInda={onBuyWithInda || (() => {})}
        onFinanceWithInda={onFinanceWithInda || (() => {})}
        legalDisclaimer={(result as any)?.legalDisclaimer}
      />

      {/* Disclaimer */}
      <Disclaimer />
    </div>
  );
};

