import apiClient from "./index";

export interface ListingPayload {
  title: string;
  type: string;
  location: string;
  price: number;
  specs: {
    bed: string | number;
    bath: string | number;
    size: string | number;
    year?: string | number;
  };
  status?: string;
  constructionStatus?: string;
  features?: string;
  images?: File[];
}

export interface Listing extends ListingPayload {
  id?: string;
  indaTag?: string;
  intelligenceData?: any;
  [key: string]: any;
}

export const ProListingsService = {
  getUserListings: async (userId: string) => {
    const response = await apiClient.get(`/api/listings/user/${userId}`);
    return response.data;
  },

  getAllListings: async (
    page = 1,
    limit = 10,
    filters: Record<string, any> = {},
  ) => {
    const response = await apiClient.get("/api/listings", {
      params: { page, limit, ...filters },
    });
    return response.data;
  },

  getListing: async (indaTag: string) => {
    const response = await apiClient.get(`/api/listings/${indaTag}`);
    return response.data;
  },

  deleteListing: async (indaTag: string, userId?: string) => {
    const response = await apiClient.delete(`/api/listings/${indaTag}`, {
      data: { userId },
    });
    return response.data;
  },

  create: async (data: any, userId?: string) => {
    if (data instanceof FormData) {
      if (userId) data.append("userId", userId);
      const response = await apiClient.post("/api/listings", data);
      return response.data;
    }

    const formData = new FormData();
    if (userId) formData.append("userId", userId);

    Object.keys(data).forEach((key) => {
      if (key === "images" && Array.isArray(data.images)) {
        data.images.forEach((file: any) => formData.append("images", file));
      } else if (typeof data[key] === "object" && data[key] !== null) {
        formData.append(key, JSON.stringify(data[key]));
      } else {
        formData.append(key, data[key]);
      }
    });

    const response = await apiClient.post("/api/listings", formData);
    return response.data;
  },

  updateListing: async (id: string, data: any) => {
    const response = await apiClient.put(`/api/listings/${id}`, data);
    return response.data;
  },

  refreshLocationIntelligence: async (indaTag: string) => {
    const response = await apiClient.post(
      `/api/listings/${indaTag}/refresh-location`,
    );
    return response.data;
  },
};
