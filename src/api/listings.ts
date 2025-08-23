import apiClient from ".";

export interface ComputedListingByUrlResponse<T = any> {
  status: string;
  data: T;
}

export const getComputedListingByUrl = async (url: string) => {
  const res = await apiClient.get<ComputedListingByUrlResponse>(
    "/listings/computed/by-url",
    { params: { url } }
  );
  return res.data;
};
