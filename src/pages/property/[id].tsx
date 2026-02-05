import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Container } from "@/components";
import { PropertyDetail } from "@/views/property-details/PropertyDetail";
import apiClient from "@/api";
import LoadingScreen from "@/views/result/sections/LoadingScreen";
import NotFoundScreen from "@/views/result/sections/NotFoundScreen";
import { mapListingToPropertyDetail } from "@/views/property-details/utils";

const PropertyDetailsPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [listing, setListing] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!router.isReady || !id) return;

    const fetchListing = async () => {
      try {
        setLoading(true);
        setError(null);

        let data = null;

        // Try to get listing directly by id (supports both _id and indaTag)
        try {
          const response = await apiClient.get(`/api/listings/${id}`);
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
  const { intelligenceData, ...property } = mappedData;

  return (
    <Container noPadding className="min-h-screen bg-gray-50">
      <PropertyDetail
        property={property}
        onBack={() => router.back()}
        intelligenceData={intelligenceData}
      />
    </Container>
  );
};

export default PropertyDetailsPage;
