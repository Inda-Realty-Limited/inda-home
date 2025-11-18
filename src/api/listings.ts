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
