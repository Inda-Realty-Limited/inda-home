import apiClient from ".";

export interface UserProfileUpdatePayload {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  companyName?: string;
}

export interface NotificationPreferences {
  whatsapp?: boolean;
  emailReports?: boolean;
  sms?: boolean;
  marketing?: boolean;
}

export const getProfile = () =>
  apiClient.get("/profile").then((res) => res.data);

export const updateProfile = (data: UserProfileUpdatePayload) =>
  apiClient.put("/profile", data).then((res) => res.data);

export const getNotificationPreferences = (): Promise<NotificationPreferences> =>
  apiClient.get("/profile/notifications").then((res) => res.data?.data ?? {});

export const updateNotificationPreferences = (data: NotificationPreferences) =>
  apiClient.put("/profile/notifications", data).then((res) => res.data);
