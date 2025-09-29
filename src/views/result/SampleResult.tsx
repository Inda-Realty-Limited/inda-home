import { Container, Footer, Navbar } from "@/components";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import {
  AISummaryBlocks,
  AmenitiesSection,
  FeedbackComplaints,
  GallerySection,
  MapInsights,
  PriceAnalysis,
  ProceedActions,
  ResultHeader,
  ROICalculator,
  SmartSummary,
  TrustScoreBar,
} from "./sections";

// Helper formatters
const formatNaira = (n: number) =>
  `₦${Math.round(n || 0).toLocaleString(undefined, {
    maximumFractionDigits: 0,
  })}`;
const formatPercent = (n: number) => `${Number(n || 0).toFixed(1)}%`;

const SampleResultPage: React.FC = () => {
  // Build the sample data based on user's specification
  const result = useMemo(() => {
    const sampleImages: string[] = [
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1600&auto=format&fit=crop",
    ];
    const base = {
      title: "Modern 2-Bedroom Apartment, Lekki Phase 1",
      location: "Lekki Phase 1, Lagos",
      price: "₦120,000,000",
      fairMarketValue: "₦142,000,000",
      overpriced: "15.5% Underpriced",
      bedrooms: 2,
      bathrooms: 2,
      status: "Completed",
      amenities: [
        "Swimming pool",
        "Fully furnished",
        "Walk in closet",
        "Private Terrace",
        "Outdoor Kitchen",
        "24/7 security guards",
        "Communal Gym",
        "24/7 Power supply",
      ],
      indaTrustScore: 85,
      overallRating: 3.5,
      totalReviews: 2,
      ratingBreakdown: [
        { stars: 5, percentage: 50 },
        { stars: 4, percentage: 0 },
        { stars: 3, percentage: 0 },
        { stars: 2, percentage: 50 },
        { stars: 1, percentage: 0 },
      ],
      reviews: [
        {
          id: "r1",
          reviewer: "Chioma",
          timeAgo: "recently",
          rating: 5,
          title: "Impressive finishing and secure estate",
          content:
            "I viewed the 2-bedroom flat yesterday, and honestly, I was impressed. The living room has great natural light, and the finishing is exactly as advertised — no cut corners. The estate itself feels secure with proper access control. I also like that the kitchen layout is modern and spacious, not the tiny galley style you sometimes get. The only thing I’d point out is that the parking looks like it might be tight if everyone has two cars, but overall, this place is definitely worth it.",
        },
        {
          id: "r2",
          reviewer: "Tolu",
          timeAgo: "recently",
          rating: 2,
          title: "Finishing didn’t meet expectations",
          content:
            "I came for inspection hoping to consider it as an investment property. While the exterior looks fine, the finishing inside didn’t meet my expectations — I noticed uneven tiles in one of the bathrooms and some cracks in the paint already. For the asking price, I think the developer could have done better. Rental demand in the area is good, but personally, I wouldn’t proceed unless they fix those details.",
        },
      ],
      aiSummary:
        "Developer active ~8 years; 5 projects completed (4 on time, 1 delayed by 6 months). No litigations; minor snagging historically resolved. Trusted (Low Risk).",
      legalDisclaimer:
        "This report is a sample demo and not financial advice. Always verify with licensed professionals before transacting.",
      roiMetricsTwo: [
        { label: "Avg. Rental Yield (Long Term)", value: "5.5%" },
        { label: "Avg. Rental Yield (Short Term)", value: "8.0" },
        { label: "Total Expense (% of Rent)", value: "18.0" },
      ],
      annualAppreciation: [
        {
          label: "Annual Appreciation (₦, Local Nominal)",
          value: "6.5",
          index: 1,
        },
        {
          label: "Annual Appreciation (₦, Local Real)",
          value: "3.0",
          index: 2,
        },
        {
          label: "Annual Appreciation (USD, $FX + Inflation Adjusted)",
          value: "2.5",
          index: 3,
        },
      ],
      aiReport: {
        marketValue: {
          label: "High Confidence",
          summary:
            "Asking ₦120M vs FMV ₦142M → ~15.5% below market. Benchmarks ₦950k–₦1.2M/sqm; unit ~₦820k/sqm (discount). Trend stable growth ~5–7% over last 12 months. Recommendation: Proceed; open at ₦115M; fair even at ₦120M.",
        },
        sellerCredibility: {
          label: "Trusted (Low Risk)",
          summary:
            "Developer active 8 years; 5 projects completed (4 on time, 1 delayed by 6 months). No litigations; permits in order; registered in Lagos. 85% likelihood of on-time delivery.",
        },
        microlocation: {
          label: "Emerging",
          summary:
            "Flood risk stable; roads & drainage upgraded; 15–18 hrs power plus backup. Crime down ~20% in estates. Proximity to amenities within 15 mins. Migration +7% p.a. with ongoing road expansions.",
        },
        roi: {
          label: "Improving",
          summary:
            "Short-let earns ₦80k–₦120k/night at 65–70% occupancy (~7–9% yield). Long-term leases ₦6–₦8M/yr (5–6% yield). Capital values up ~35% in 5 years (~6–7% CAGR).",
        },
        titleSafety: {
          label: "Manual Verification Required",
          summary:
            "Title docs require manual verification. Upload for review to unlock full 40-point checklist.",
          nextStep: "Provide title docs for verification",
        },
      },
      snapshot: {
        title: "Modern 2-Bedroom Apartment, Lekki Phase 1",
        location: "Lekki Phase 1, Lagos",
        bedrooms: 2,
        bathrooms: 2,
        amenities: [
          "Swimming pool",
          "Fully furnished",
          "Walk in closet",
          "Private Terrace",
          "Outdoor Kitchen",
          "24/7 security guards",
          "Communal Gym",
          "24/7 Power supply",
        ],
        agentCompanyName: "Pinnacle Properties",
        agentCompanyUrl: "#",
        imageUrls: sampleImages,
        listingUrl: "#",
      },
    } as any;
    return base;
  }, []);

  // Trust score animation
  const [trustScore] = useState<number | null>(
    Number.isFinite(result.indaTrustScore) ? result.indaTrustScore : null
  );
  const [displayScore, setDisplayScore] = useState(0);
  useEffect(() => {
    if (trustScore == null) return;
    let raf: number;
    const start = performance.now();
    const animate = (now: number) => {
      const t = Math.min(1, (now - start) / 1200);
      const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      const val = Math.round((trustScore as number) * eased);
      setDisplayScore(val);
      if (t < 1) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [trustScore]);

  // Charts state (mirror logic of live page with synthetic series)
  const [chartMonths, setChartMonths] = useState<string[]>([]);
  const [chartFMV, setChartFMV] = useState<number[]>([]);
  const [chartPriceSeries, setChartPriceSeries] = useState<number[]>([]);
  const [chartWindowLabel, setChartWindowLabel] = useState<string>("");
  const [last6ChangePct, setLast6ChangePct] = useState<number>(0);
  const [marketPositionPct, setMarketPositionPct] = useState<number>(0);
  const [selectedBar, setSelectedBar] = useState<null | {
    series: "fmv" | "price";
    index: number;
  }>(null);

  useEffect(() => {
    // Parse numeric price and FMV from sample strings
    const price = Number(String(result.price).replace(/[^0-9.]/g, "")) || 0;
    const fmvApi =
      Number(String(result.fairMarketValue).replace(/[^0-9.]/g, "")) || 0;
    // Synthesize a 12‑month series based on current price with FMV in ±20% band
    if (price > 0) {
      const now = new Date();
      const months: string[] = [];
      for (let i = 11; i >= 0; i--) {
        const d = new Date(now);
        d.setMonth(d.getMonth() - i);
        months.push(
          `${d.toLocaleString(undefined, {
            month: "short",
          })} ${d.getFullYear()}`
        );
      }
      const priceSeries = Array.from({ length: 12 }, () => price);
      const fmvSeries = Array.from({ length: 12 }, () => {
        // Center around provided FMV if present, else around price
        const base = fmvApi > 0 ? fmvApi : price;
        const factor = 0.8 + Math.random() * 0.4; // 0.8..1.2
        return Math.max(0, Math.round(base * factor));
      });
      const lastIdx = fmvSeries.length - 1;
      const baseIdx = Math.max(0, lastIdx - 6);
      const baseVal = fmvSeries[baseIdx] || fmvSeries[0] || 0;
      const lastVal = fmvSeries[lastIdx] || baseVal;
      const change6 = baseVal > 0 ? ((lastVal - baseVal) / baseVal) * 100 : 0;
      const marketPct = lastVal > 0 ? ((price - lastVal) / lastVal) * 100 : 0;

      setChartMonths(months);
      setChartWindowLabel(`${months[0]} - ${months[months.length - 1]}`);
      setChartFMV(fmvSeries);
      setChartPriceSeries(priceSeries);
      setLast6ChangePct(change6);
      setMarketPositionPct(marketPct);
    }
  }, [result]);

  // ROI state (minimal mirror of live page)
  type ROIFieldKey =
    | "purchasePrice"
    | "financingRate"
    | "financingTenureYears"
    | "holdingPeriodYears"
    | "yieldLong"
    | "yieldShort"
    | "expensePct"
    | "appreciationLocalNominal"
    | "appreciationLocalReal"
    | "appreciationUsdAdj";

  const [roiValues, setROIValues] = useState<Record<ROIFieldKey, number>>({
    purchasePrice: Number(String(result.price).replace(/[^0-9.]/g, "")) || 0,
    financingRate: 0,
    financingTenureYears: 0,
    holdingPeriodYears: 3,
    yieldLong:
      Number(
        String(
          result.roiMetricsTwo.find((m: { label: string; value: string }) =>
            /long/i.test(m.label || "")
          )?.value || "0"
        ).replace(/[^0-9.]/g, "")
      ) || 0,
    yieldShort:
      Number(
        String(
          result.roiMetricsTwo.find((m: { label: string; value: string }) =>
            /short/i.test(m.label || "")
          )?.value || "0"
        ).replace(/[^0-9.]/g, "")
      ) || 0,
    expensePct:
      Number(
        String(
          result.roiMetricsTwo.find((m: { label: string; value: string }) =>
            /expense/i.test(m.label || "")
          )?.value || "0"
        ).replace(/[^0-9.]/g, "")
      ) || 0,
    appreciationLocalNominal:
      Number(
        String(
          result.annualAppreciation.find(
            (a: { index: number; value: string }) => a.index === 1
          )?.value || 0
        )
          .toString()
          .replace(/[^0-9.]/g, "")
      ) || 0,
    appreciationLocalReal:
      Number(
        String(
          result.annualAppreciation.find(
            (a: { index: number; value: string }) => a.index === 2
          )?.value || 0
        )
          .toString()
          .replace(/[^0-9.]/g, "")
      ) || 0,
    appreciationUsdAdj:
      Number(
        String(
          result.annualAppreciation.find(
            (a: { index: number; value: string }) => a.index === 3
          )?.value || 0
        )
          .toString()
          .replace(/[^0-9.]/g, "")
      ) || 0,
  });
  const [editedFields, setEditedFields] = useState<
    Partial<Record<ROIFieldKey, boolean>>
  >({});
  const [openROIInfo, setOpenROIInfo] = useState<ROIFieldKey | null>(null);
  const [editingROIField, setEditingROIField] = useState<ROIFieldKey | null>(
    null
  );
  const [isCalculating, setIsCalculating] = useState(false);
  const [calcResult, setCalcResult] = useState<{
    profit: number;
    roiPct: number;
    annualIncome: number;
  } | null>(null);
  const [resultView, setResultView] = useState<"long" | "short">("long");
  const longTabRef = useRef<HTMLButtonElement>(null);
  const shortTabRef = useRef<HTMLButtonElement>(null);
  const [underlineStyle, setUnderlineStyle] = useState({ width: 0, left: 0 });
  const [appreciationTab, setAppreciationTab] = useState<
    "localNominal" | "localReal" | "usdAdj"
  >("localNominal");

  const roiFieldInfo: Record<ROIFieldKey, string> = {
    purchasePrice: "Price you pay for the property.",
    financingRate: "Annual interest rate for your financing (if any).",
    financingTenureYears: "Number of years to repay your financing.",
    holdingPeriodYears: "How long you plan to hold the asset.",
    yieldLong: "Expected annual rental yield for long-term rental.",
    yieldShort: "Expected annual rental yield for short-term rental.",
    expensePct: "Share of rental income spent on expenses (maintenance, fees).",
    appreciationLocalNominal:
      "Annual price growth in local currency (nominal).",
    appreciationLocalReal:
      "Annual price growth in local currency after inflation.",
    appreciationUsdAdj:
      "Annual price growth adjusted for FX + inflation into USD.",
  };

  const updateROIValue = (key: ROIFieldKey, raw: string | number) => {
    const val =
      typeof raw === "string"
        ? Number(raw.replace(/[^0-9.]/g, ""))
        : Number(raw);
    setROIValues((v) => ({ ...v, [key]: Number.isFinite(val) ? val : 0 }));
    setEditedFields((f) => ({ ...f, [key]: true }));
  };

  const handleCalculate = () => {
    if (isCalculating) return;
    setIsCalculating(true);
    setOpenROIInfo(null);
    setEditingROIField(null);
    setTimeout(() => {
      const price = roiValues.purchasePrice || 0;
      const incomePct =
        (resultView === "long" ? roiValues.yieldLong : roiValues.yieldShort) ||
        0;
      const expensesPct = roiValues.expensePct || 0;
      const netPct = Math.max(0, incomePct - expensesPct);
      const annualIncome = (price * netPct) / 100;
      const profit =
        annualIncome * Math.max(1, roiValues.holdingPeriodYears || 1);
      const roiPct = price > 0 ? (profit / price) * 100 : 0;
      setCalcResult({ profit, roiPct, annualIncome });
      setIsCalculating(false);
    }, 600);
  };

  // Move underline indicator for ROI tabs
  useEffect(() => {
    const el = resultView === "long" ? longTabRef.current : shortTabRef.current;
    const parent = longTabRef.current?.parentElement;
    if (el && parent) {
      const rect = el.getBoundingClientRect();
      const parentRect = parent.getBoundingClientRect();
      setUnderlineStyle({
        width: rect.width,
        left: rect.left - parentRect.left,
      });
    }
  }, [resultView, longTabRef.current, shortTabRef.current]);

  // Collapsibles
  const [isPriceSummaryOpen, setIsPriceSummaryOpen] = useState(true);
  const [isLocationSummaryOpen, setIsLocationSummaryOpen] = useState(false);

  // Derived display values
  const priceNum = Number(String(result.price).replace(/[^0-9.]/g, "")) || 0;
  const fmvNum =
    Number(String(result.fairMarketValue).replace(/[^0-9.]/g, "")) || 0;

  // Delivery + status display (mirror of live page fallback style)
  const toQuarterLabel = (d: Date) => {
    const q = Math.floor(d.getMonth() / 3) + 1;
    return `Q${q} ${d.getFullYear()}`;
  };
  const isValidDateObj = (d: Date) => !Number.isNaN(d.getTime());
  const deliveryLabel = (() => {
    const rawDelivery: any = result.deliveryDate || null;
    let label = "—";
    if (rawDelivery) {
      if (typeof rawDelivery === "string") {
        const parsed = new Date(rawDelivery);
        label = isValidDateObj(parsed)
          ? toQuarterLabel(parsed)
          : String(rawDelivery);
      } else if (typeof rawDelivery === "number") {
        const parsed = new Date(rawDelivery);
        label = isValidDateObj(parsed) ? toQuarterLabel(parsed) : label;
      }
    }
    if (label === "—") {
      const est = new Date();
      est.setMonth(est.getMonth() + 9);
      label = toQuarterLabel(est) + " (est.)";
    }
    return label;
  })();
  const deliverySource = result.deliveryDate
    ? "From listing/docs."
    : "Estimated";
  const listingStatus = result.status || null;

  return (
    <Container noPadding className="min-h-screen bg-[#F9F9F9] text-inda-dark">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="text-[#101820]/90 w-full max-w-7xl mx-auto space-y-8">
          <div className="px-6">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Hi there,
            </h2>
            <p className="text-lg md:text-xl lg:text-2xl font-normal mb-6">
              Here's what we found based on your search.
            </p>
          </div>

          <TrustScoreBar trustScore={trustScore} displayScore={displayScore} />

          {/* Same section composition as live page, without locking/payment */}
          <ResultHeader title={result.title} address={result.location} />
          <GallerySection imageUrls={result?.snapshot?.imageUrls || []} />
          <SmartSummary
            result={result as any}
            deliveryLabel={deliveryLabel}
            deliverySource={deliverySource}
            listingStatus={listingStatus as any}
          />
          <AmenitiesSection result={result as any} />
          <FeedbackComplaints
            average={result.overallRating}
            total={result.totalReviews}
            breakdown={result.ratingBreakdown as any}
            reviews={result.reviews as any}
            aiSummary={(result as any)?.aiReport?.sellerCredibility?.summary}
          />
          <PriceAnalysis
            price={priceNum}
            fmv={
              fmvNum || (chartFMV.length ? chartFMV[chartFMV.length - 1] : null)
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

          <div className="w-full px-6">
            <div className="border-t border-gray-300 pt-6">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setIsPriceSummaryOpen(!isPriceSummaryOpen)}
              >
                <h4 className="text-xl font-bold text-inda-teal">AI Summary</h4>
                <div className="text-inda-teal">
                  {isPriceSummaryOpen ? (
                    <FaChevronUp className="text-base" />
                  ) : (
                    <FaChevronDown className="text-base" />
                  )}
                </div>
              </div>
              {isPriceSummaryOpen && (
                <div className="mt-4 bg-transparent rounded-lg">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {(result as any)?.aiReport?.marketValue?.summary ||
                      result.aiSummary ||
                      "—"}
                  </p>
                </div>
              )}
            </div>
          </div>

          <MapInsights
            isOpen={isLocationSummaryOpen}
            toggle={() => setIsLocationSummaryOpen((v) => !v)}
            aiSummary={(result as any)?.aiReport?.microlocation?.summary}
          />

          <ROICalculator
            roiValues={roiValues}
            editedFlags={editedFields}
            roiFieldInfo={roiFieldInfo}
            openROIInfo={openROIInfo}
            setOpenROIInfo={setOpenROIInfo}
            editingROIField={editingROIField}
            setEditingROIField={setEditingROIField}
            updateROIValue={updateROIValue}
            formatNaira={formatNaira}
            formatPercent={formatPercent}
            handleCalculate={handleCalculate}
            isCalculating={isCalculating}
            calcResult={calcResult}
            aAny={undefined}
            resultView={resultView}
            setResultView={setResultView}
            longTabRef={longTabRef}
            shortTabRef={shortTabRef}
            underlineStyle={underlineStyle}
            appreciationTab={appreciationTab}
            setAppreciationTab={setAppreciationTab}
          />

          <AISummaryBlocks aiReport={(result as any)?.aiReport} />

          <ProceedActions
            disabled
            onDeeperVerification={() => {}}
            onBuyWithInda={() => {}}
            onFinanceWithInda={() => {}}
            legalDisclaimer={result.legalDisclaimer}
          />
        </div>
      </main>
      <Footer />
    </Container>
  );
};

export default SampleResultPage;
