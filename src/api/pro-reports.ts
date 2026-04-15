import apiClient from "./index";

export interface CreateReportSharePayload {
  leadId?: string;
  channel?: string;
  expiresAt?: string;
}

export interface TrackReportEventPayload {
  eventType: "OPENED" | "VIEWED" | "ENGAGED";
  viewerToken?: string;
  sessionId?: string;
  metadata?: Record<string, unknown>;
}

export const ProReportsService = {
  getUserReports: async (userId: string) => {
    const response = await apiClient.get('/reports', {
      params: { userId }
    });
    return response.data;
  },

  generateReport: async (data: any) => {
    const response = await apiClient.post('/reports', data);
    return response.data;
  },

  getReport: async (reportId: string) => {
    const response = await apiClient.get(`/reports/${reportId}`);
    return response.data;
  },

  getAccessibleReport: async (reportId: string, viewerToken?: string) => {
    const response = await apiClient.get(`/reports/${reportId}/access`, {
      params: viewerToken ? { t: viewerToken } : undefined,
    });
    return response.data;
  },

  createShare: async (reportId: string, data: CreateReportSharePayload = {}) => {
    const response = await apiClient.post(`/reports/${reportId}/share`, data);
    return response.data;
  },

  createShareForListing: async (listingId: string, data: CreateReportSharePayload = {}) => {
    const response = await apiClient.post(`/reports/by-listing/${listingId}/share`, data);
    return response.data;
  },

  trackEvent: async (reportId: string, data: TrackReportEventPayload) => {
    const response = await apiClient.post(`/reports/${reportId}/events`, data);
    return response.data;
  },
};
