import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useRouter } from 'next/router';
import { Container, Footer, Navbar } from '@/components';
import { PropertyDetailsView } from '@/views/shared/PropertyDetailsView';
import apiClient from '@/api';
import LoadingScreen from '@/views/result/sections/LoadingScreen';
import NotFoundScreen from '@/views/result/sections/NotFoundScreen';

const PropertyDetailsPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [listing, setListing] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [chartMonths, setChartMonths] = useState<string[]>([]);
  const [chartFMV, setChartFMV] = useState<number[]>([]);
  const [chartPriceSeries, setChartPriceSeries] = useState<number[]>([]);
  const [chartWindowLabel, setChartWindowLabel] = useState<string>("");
  const [last6ChangePct, setLast6ChangePct] = useState<number>(0);
  const [marketPositionPct, setMarketPositionPct] = useState<number>(0);
  const [selectedBar, setSelectedBar] = useState<null | { series: "fmv" | "price"; index: number }>(null);

  useEffect(() => {
    if (!router.isReady || !id) return;

    const fetchListing = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await apiClient.get('/listings', {
          params: { _id: id, limit: 1 }
        });
        const listings = response.data?.data?.items || response.data?.data?.listings || response.data?.listings || response.data?.data || [];
        const data = Array.isArray(listings) && listings.length > 0 ? listings[0] : null;
        
        if (!data) {
          setError('Listing not found');
          setLoading(false);
          return;
        }

        setListing(data);
        
        const price = data.priceNGN || data.purchasePrice || 0;
        const fmv = data.fmvNGN || data.fmv || data.analytics?.fmvNGN || null;

        const histCandidates: any[][] = [
          data.analytics?.price?.historyMonthly || [],
          data.analytics?.market?.historyMonthly || [],
          data.analytics?.historyMonthly || [],
        ];
        const hist = histCandidates.find((arr) => Array.isArray(arr) && arr.length >= 2) || [];

        if (hist.length >= 2) {
          const lastN = hist.slice(-12);
          const months = lastN.map((h: any) => {
            const m = h.monthLabel || h.month;
            if (typeof m === "string" && m) return m;
            const ts = h.timestamp || h.date;
            if (typeof ts === "number") {
              const d = new Date(ts);
              return `${d.toLocaleString(undefined, { month: "short" })} ${d.getFullYear()}`;
            }
            return "";
          });
          const fmvSeries = lastN.map((h: any) =>
            Number(h.fmv || h.fmvNGN || h.fairValueNGN || h.fairValue || 0)
          );
          const priceSeries = lastN.map((h: any) =>
            Number(h.price || h.priceNGN || h.listPrice || h.askingPriceNGN || 0)
          );

          const lastIdx = fmvSeries.length - 1;
          const baseIdx = Math.max(0, lastIdx - 6);
          const baseVal = fmvSeries[baseIdx] || fmvSeries[0] || 0;
          const lastVal = fmvSeries[lastIdx] || baseVal;
          const change6 = baseVal > 0 ? ((lastVal - baseVal) / baseVal) * 100 : 0;

          const fmvForMarket = typeof fmv === "number" ? fmv : lastVal > 0 ? lastVal : null;
          const marketPct = fmvForMarket ? (((price ?? 0) - fmvForMarket) / fmvForMarket) * 100 : 0;

          setChartMonths(months.map((m: string) => String(m)));
          setChartWindowLabel(`${months[0]} - ${months[months.length - 1]}`);
          setChartFMV(fmvSeries.map((n: number) => Math.max(0, Math.round(n))));
          setChartPriceSeries(priceSeries.map((n: number) => Math.max(0, Math.round(n))));
          setLast6ChangePct(change6);
          setMarketPositionPct(marketPct);
        } else if (typeof price === "number" && price > 0) {
          const now = new Date();
          const months: string[] = [];
          for (let i = 11; i >= 0; i--) {
            const d = new Date(now);
            d.setMonth(d.getMonth() - i);
            months.push(
              `${d.toLocaleString(undefined, { month: "short" })} ${d.getFullYear()}`
            );
          }
          const priceSeries = Array.from({ length: 12 }, () => Math.max(0, Math.round(price)));
          const fmvSeries = Array.from({ length: 12 }, () => {
            const factor = 0.8 + Math.random() * 0.4;
            return Math.max(0, Math.round(price * factor));
          });

          const lastIdx = fmvSeries.length - 1;
          const baseIdx = Math.max(0, lastIdx - 6);
          const baseVal = fmvSeries[baseIdx] || fmvSeries[0] || 0;
          const lastVal = fmvSeries[lastIdx] || baseVal;
          const change6 = baseVal > 0 ? ((lastVal - baseVal) / baseVal) * 100 : 0;
          const marketPct = lastVal > 0 ? (((price ?? 0) - lastVal) / lastVal) * 100 : 0;

          setChartMonths(months);
          setChartWindowLabel(`${months[0]} - ${months[months.length - 1]}`);
          setChartFMV(fmvSeries);
          setChartPriceSeries(priceSeries);
          setLast6ChangePct(change6);
          setMarketPositionPct(marketPct);
        }
      } catch (err: any) {
        console.error('Failed to fetch listing:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load listing');
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [router.isReady, id]);

  const toQuarterLabel = (d: Date) => {
    const q = Math.floor(d.getMonth() / 3) + 1;
    return `Q${q} ${d.getFullYear()}`;
  };

  const isValidDateObj = (d: Date) => !Number.isNaN(d.getTime());

  const deliveryLabel = useMemo(() => {
    if (!listing) return "—";
    const rawDelivery: any =
      listing.deliveryDate ||
      listing.expectedDeliveryDate ||
      listing.analytics?.delivery?.expectedDate ||
      null;
    let label = "—";
    if (rawDelivery) {
      if (typeof rawDelivery === "string") {
        const parsed = new Date(rawDelivery);
        label = isValidDateObj(parsed) ? toQuarterLabel(parsed) : String(rawDelivery);
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
  }, [listing]);

  const deliverySource = useMemo(() => {
    if (!listing) return "Estimated";
    const has = listing.deliveryDate || listing.expectedDeliveryDate;
    return has ? "From listing/docs." : "Estimated";
  }, [listing]);

  const listingStatus = useMemo(() => {
    if (!listing) return null;
    return listing.listingStatus || listing.status || null;
  }, [listing]);

  const bedroomsDisplay = listing?.bedrooms ?? "4";
  const bathroomsDisplay = listing?.bathrooms ?? "5";
  const sizeDisplay = listing?.sizeSqm ?? "450";
  const propertyTypeDisplay = listing?.propertyTypeStd
    ? listing.propertyTypeStd.toLowerCase()
    : "property";
  const microlocationDisplay = listing?.microlocationStd || listing?.microlocation || "Lagos";
  const fallbackTitleDisplay = listing?.title || "";
  const fallbackLocationDisplay = listing?.location || listing?.microlocation || "";
  const fallbackListingDisplay = listing?.listingUrl || "";

  const price = listing?.priceNGN ?? listing?.purchasePrice ?? null;
  const fairValue = listing?.fmvNGN || listing?.fmv || listing?.analytics?.fmvNGN || null;

  const openWhatsApp = (text: string) => {
    const phone = process.env.NEXT_PUBLIC_INDA_WHATSAPP || "2347084960775";
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    if (typeof window !== "undefined") window.open(url, "_blank");
  };

  if (loading) {
    return (
      <Container noPadding className="min-h-screen bg-[#F9F9F9]">
        <Navbar />
        <LoadingScreen currentStep={0} />
      </Container>
    );
  }

  if (error || !listing) {
    return (
      <Container noPadding className="min-h-screen bg-[#F9F9F9]">
        <Navbar />
        <NotFoundScreen searchQuery={id as string} searchType="id" />
      </Container>
    );
  }

  const result = {
    ...listing,
    snapshot: listing,
    analytics: listing.analytics || {},
    indaScore: listing.indaScore || { finalScore: listing.indaScore || 75 },
  };

  return (
    <Container noPadding className="min-h-screen bg-[#F9F9F9] text-inda-dark">
      <Navbar />
      <main className="flex-1 py-8">
        <PropertyDetailsView
          result={result}
          price={typeof price === "number" ? price : null}
          fairValue={
            typeof fairValue === "number"
              ? fairValue
              : chartFMV.length > 0
                ? chartFMV[chartFMV.length - 1]
                : null
          }
          chartMonths={chartMonths}
          chartFMV={chartFMV}
          chartPriceSeries={chartPriceSeries}
          chartWindowLabel={chartWindowLabel}
          last6ChangePct={last6ChangePct}
          marketPositionPct={marketPositionPct}
          selectedBar={selectedBar}
          setSelectedBar={setSelectedBar}
          deliveryLabel={deliveryLabel}
          deliverySource={deliverySource}
          listingStatus={listingStatus}
          bedroomsDisplay={bedroomsDisplay}
          bathroomsDisplay={bathroomsDisplay}
          sizeDisplay={sizeDisplay}
          propertyTypeDisplay={propertyTypeDisplay}
          microlocationDisplay={microlocationDisplay}
          fallbackTitleDisplay={fallbackTitleDisplay}
          fallbackLocationDisplay={fallbackLocationDisplay}
          fallbackListingDisplay={fallbackListingDisplay}
          onBuyWithInda={() =>
            openWhatsApp(
              `Hello Inda team, I'm interested in buying this property with Inda.\n\nProperty: ${fallbackTitleDisplay}\nLocation: ${fallbackLocationDisplay}\nListing: ${fallbackListingDisplay}\n\nPlease share the next steps to proceed with a purchase.`
            )
          }
          onFinanceWithInda={() =>
            openWhatsApp(
              `Hello Inda team, I'd like to finance this property via Inda.\n\nProperty: ${fallbackTitleDisplay}\nLocation: ${fallbackLocationDisplay}\nListing: ${fallbackListingDisplay}\n\nPlease guide me through the next steps.`
            )
          }
        />
      </main>
      <Footer />
    </Container>
  );
};

export default PropertyDetailsPage;

