import apiClient from ".";
import { ComputedListingApiResponse, ComputedListing } from "@/types/listing";

export interface ComputedListingByUrlResponse {
  status: string;
  data: ComputedListing;
}

export const getComputedListingByUrl = async (url: string) => {
  const res = await apiClient.get<ComputedListingApiResponse>(
    "/listings/computed/by-url",
    { params: { url } }
  );
  return res.data.data;
};

export interface ReactiveSearchResult {
  status: string;
  detail_url: string;
  merged_data: {
    created_at: string;
    source_site: string;
    detail_url: string;
    updated_at: string;
    added_on: string;
    title: string;
    price_naira: string;
    detail_beds: number;
    detail_baths: number;
    detail_toilets: number;
    pid: string;
    address: string;
    description_raw: string;
    latitude: number;
    longitude: number;
    // Nearby amenities distances in meters
    school_distance_meters: number;
    hospital_distance_meters: number;
    clinic_distance_meters: number;
    mall_distance_meters: number;
    pharmacy_distance_meters: number;
    police_station_distance_meters: number;
    aerodrome_distance_meters: number;
    // Property metadata
    id: string;
    amenities: string;
  };
  merge_summary: {
    status: string;
    merge_job_id: string;
    total_rows_affected: number;
    total_bytes_processed: number;
  };
}

export const getReactiveSearchResult = async (
  url: string
): Promise<ReactiveSearchResult | null> => {
  try {
    console.log("Calling reactive search via backend for URL:", url);
    
    // Call backend endpoint which wraps the external reactive search API
    const response = await apiClient.post<{ status: string; data: ReactiveSearchResult }>(
      "/scraper/reactive-search",
      { url }
    );

    console.log("Reactive search response status:", response.status);

    if (response.data?.data) {
      console.log("Reactive search succeeded");
      return response.data.data;
    }

    console.error("Reactive search returned empty data");
    return null;
  } catch (error) {
    console.error("Error calling reactive search:", error);
    return null;
  }
};
