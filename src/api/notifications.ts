import apiClient, { getStoredToken } from ".";

export interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  link?: string | null;
  metadata?: Record<string, unknown> | null;
  readAt?: string | null;
  createdAt: string;
}

export const notificationsApi = {
  list: async (limit = 20): Promise<NotificationItem[]> => {
    const response = await apiClient.get(`/notifications?limit=${limit}`);
    return response.data?.data ?? [];
  },

  unreadCount: async (): Promise<number> => {
    const response = await apiClient.get("/notifications/unread-count");
    return response.data?.data?.count ?? 0;
  },

  markAsRead: async (id: string): Promise<NotificationItem> => {
    const response = await apiClient.patch(`/notifications/${id}/read`);
    return response.data?.data;
  },

  markAllAsRead: async (): Promise<void> => {
    await apiClient.patch("/notifications/read-all");
  },

  getStreamUrl: (): string | null => {
    const token = getStoredToken();
    if (!token) return null;

    const baseUrl = apiClient.defaults.baseURL ?? "";
    return `${baseUrl}/notifications/stream?token=${encodeURIComponent(token)}`;
  },
};

export default notificationsApi;
