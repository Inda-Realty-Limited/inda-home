import apiClient from "./index";

export const ProReportsService = {
  getUserReports: async (userId: string) => {
    const response = await apiClient.get('/api/reports', {
      params: { userId }
    });
    return response.data;
  },

  generateReport: async (data: any) => {
    const response = await apiClient.post('/api/reports', data);
    return response.data;
  },

  getReport: async (reportId: string) => {
    const response = await apiClient.get(`/api/reports/${reportId}`);
    return response.data;
  }
};
