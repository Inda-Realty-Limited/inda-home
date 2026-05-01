import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { PropertyReport, PropertyReportData } from "@/components/reports/PropertyReport";
import apiClient from "@/api";
import { trackChannelClick } from "@/api/channels";
import LoadingScreen from "@/views/result/sections/LoadingScreen";
import NotFoundScreen from "@/views/result/sections/NotFoundScreen";
import { mapListingToPropertyDetail } from "@/views/property-details/utils";
import { useAuth } from "@/contexts/AuthContext";

const toNumber = (value: unknown): number | undefined => {
  if (value === null || typeof value === "undefined") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const buildIntelligenceDataFromRelations = (listing: any) => {
  const source =
    listing?.intelligenceData ||
    listing?.snapshot?.intelligenceData;
  if (source) return source;

  const locationIntelligence = listing?.locationIntelligence;
  const investmentAnalysis = listing?.investmentAnalysis;
  const valueProjection = listing?.valueProjection;
  const cashFlowForecast = listing?.cashFlowForecast;

  if (
    !locationIntelligence &&
    !investmentAnalysis &&
    !valueProjection &&
    !cashFlowForecast
  ) {
    return null;
  }

  return {
    location_intelligence: locationIntelligence
      ? {
          coordinates: locationIntelligence.coordinates,
          district: locationIntelligence.district,
          accessibility: locationIntelligence.accessibility,
          nearby_schools: locationIntelligence.nearbySchools,
          nearby_hospitals: locationIntelligence.nearbyHospitals,
          nearby_shopping: locationIntelligence.nearbyShopping,
          infrastructure_projects: locationIntelligence.infrastructureProjects,
          nearby_amenities: locationIntelligence.nearbyAmenities,
        }
      : undefined,
    investment_analysis: investmentAnalysis
      ? {
          total_investment_breakdown:
            investmentAnalysis.totalInvestmentBreakdown,
          annual_rental_income: investmentAnalysis.annualRentalIncome,
          meta: investmentAnalysis.meta,
        }
      : undefined,
    value_projection: valueProjection
      ? {
          annual_appreciation_pct: toNumber(
            valueProjection.annualAppreciationPct,
          ),
          historical_avg_pct: toNumber(valueProjection.historicalAvgPct),
          year_1: valueProjection.year1,
          year_2: valueProjection.year2,
          year_3: valueProjection.year3,
          year_4: valueProjection.year4,
          year_5: valueProjection.year5,
          projected_gain_5_year: toNumber(valueProjection.projectGain5Year),
        }
      : undefined,
    cash_flow_forecast: cashFlowForecast?.data,
  };
};

const PropertyDetailsPage: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { id, c: channel, agent } = router.query;
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [listing, setListing] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (
      router.isReady &&
      typeof agent === "string" &&
      typeof channel === "string"
    ) {
      sessionStorage.setItem("inda_channel_source", channel);
      sessionStorage.setItem("inda_agent_id", agent);

      trackChannelClick(agent, channel).catch((err) => {
        console.error("Failed to track channel click:", err);
      });
    }
  }, [router.isReady, agent, channel]);

  useEffect(() => {
    if (!router.isReady || !id) return;

    const fetchListing = async () => {
      try {
        setLoading(true);
        setError(null);

        let data = null;

        // Try to get listing directly by id (supports both _id and indaTag)
        try {
          const response = await apiClient.get(`/listings/${id}`);
          data = response.data?.data || response.data;
        } catch (err: any) {
          console.log("Failed to fetch listing by id:", err?.response?.status);
        }

        // If still no data, try computed listing endpoint (for scanned listings)
        if (!data) {
          try {
            const computedResponse = await apiClient.get(
              `/listings/computed/${id}`,
            );
            data = computedResponse.data?.data || computedResponse.data;
          } catch {
            console.log("Computed listing also not found");
          }
        }

        if (!data) {
          setError("Listing not found");
          setLoading(false);
          return;
        }

        setListing(data);
      } catch (err: unknown) {
        console.error("Failed to fetch listing:", err);
        setError(err instanceof Error ? err.message : "Failed to load listing");
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [router.isReady, id]);

  if (loading) {
    return <LoadingScreen currentStep={0} />;
  }

  if (error || !listing) {
    return <NotFoundScreen searchQuery={id as string} searchType="id" />;
  }

  const mappedData = mapListingToPropertyDetail(listing);
  const intelligenceData = buildIntelligenceDataFromRelations(listing);

  const property: PropertyReportData = {
    name: mappedData.name,
    location: mappedData.location,
    price: mappedData.priceNumeric,
    bed: mappedData.bedrooms || undefined,
    bath: mappedData.scannedData.bathrooms || undefined,
    size: mappedData.scannedData.landSize || undefined,
    type: mappedData.scannedData.propertyType || undefined,
    image: mappedData.images[0] || undefined,
    amenities: mappedData.scannedData.features.length > 0 ? mappedData.scannedData.features : undefined,
    isOffPlan: mappedData.isOffPlan,
    offPlanData: mappedData.offPlanData
      ? {
          indaVerifiedCompletion: mappedData.offPlanData.indaVerifiedCompletion,
          lastVerificationDate: mappedData.offPlanData.lastVerificationDate,
          expectedHandoverDate: mappedData.offPlanData.expectedHandoverDate,
        }
      : undefined,
    views: mappedData.socialProof.views || undefined,
  };

  const isOwner = user && listing?.userId && user._id === listing.userId;

  return (
    <PropertyReport
      property={property}
      intelligenceData={intelligenceData}
      sourceListing={listing}
      onBack={() => router.back()}
      onEdit={isOwner ? () => router.push(`/listings/edit?id=${listing.id || listing._id}`) : undefined}
    />
  );
};

export default PropertyDetailsPage;
