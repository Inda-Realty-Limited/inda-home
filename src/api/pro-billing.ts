import apiClient from "./index";

export const ProBillingService = {
  getHistory: async (userId: string) => {
    const response = await apiClient.get(`/billing/user/${userId}`);
    return response.data;
  },

  getSubscription: async (userId: string) => {
    const response = await apiClient.get(`/billing/subscription/${userId}`);
    return response.data;
  }
};
