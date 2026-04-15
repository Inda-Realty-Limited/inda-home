import apiClient from "./index";

export const ProInsightsService = {
  getMarketTrends: async (params?: any) => {
    const response = await apiClient.get('/insights/market', { params });
    return response.data;
  },

  getUserPerformance: async (userId: string) => {
    const response = await apiClient.get(`/insights/user/${userId}/performance`);
    return response.data;
  }
};
