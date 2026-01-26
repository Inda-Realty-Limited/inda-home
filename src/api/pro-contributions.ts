import apiClient from "./index";

export interface ContributionPayload {
  transactionType: string;
  propertyType: string;
  address: string;
  amount: number;
  date: string;
  size?: string;
  bedrooms?: string;
  details?: string;
  documents?: File[];
}

export const ProContributionService = {
  getDashboard: async (userId: string) => {
    const response = await apiClient.get(`/api/contributions/user/${userId}/dashboard`);
    return response.data;
  },

  submit: async (data: any) => {
    const response = await apiClient.post('/api/contributions', data);
    return response.data;
  }
};
