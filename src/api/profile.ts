import apiClient from ".";

export interface UserProfileUpdatePayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  company?: string;
  howDidYouHearAboutUs?: string;
  todo?: string;
  role?: string;
  companyName?: string;
  companyType?: string;
  registrationNumber?: string;
  phoneNumber?: string;
}

export const getProfile = () => {
  return apiClient.get("/profile").then((res) => res.data);
};

export const updateProfile = (data: UserProfileUpdatePayload) => {
  return apiClient.put("/profile", data).then((res) => res.data);
};

export const deleteProfile = () => {
  return apiClient.delete("/profile").then((res) => res.data);
};
