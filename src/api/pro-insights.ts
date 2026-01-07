import apiClient from "./index";

export const ProInsightsService = {
  getMarketTrends: async (params?: any) => {
    const response = await apiClient.get('/api/insights/market', { params });
    return response.data;
  },

  getUserPerformance: async (userId: string) => {
    const response = await apiClient.get(`/api/insights/user/${userId}/performance`);
    return response.data;
  }
};
