import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { PropertyReport, PropertyReportData } from "@/components/reports/PropertyReport";
import apiClient from "@/api";
import { trackChannelClick } from "@/api/channels";
import LoadingScreen from "@/views/result/sections/LoadingScreen";
import NotFoundScreen from "@/views/result/sections/NotFoundScreen";
import { mapListingToPropertyDetail } from "@/views/property-details/utils";

const PropertyDetailsPage: React.FC = () => {
  const router = useRouter();
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
  };

  return <PropertyReport property={property} onBack={() => router.back()} />;
};

export default PropertyDetailsPage;
