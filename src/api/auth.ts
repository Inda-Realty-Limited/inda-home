import apiClient from ".";

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  howDidYouHearAboutUs: string;
  todo: string;
}

export const register = (data: RegisterPayload) => {
  return apiClient.post("/auth/register", data).then((res) => res.data);
};

export interface LoginPayload {
  email: string;
  password: string;
}

export const login = (data: LoginPayload) => {
  return apiClient.post("/auth/login", data).then((res) => res.data);
};

export interface VerifyOtpPayload {
  email: string;
  code: string;
}

export const verifyOtp = (data: VerifyOtpPayload) => {
  return apiClient.post("/auth/verify-otp", data).then((res) => res.data);
};

export interface RequestResetPasswordPayload {
  email: string;
}

export const requestResetPassword = (data: RequestResetPasswordPayload) => {
  return apiClient
    .post("/auth/request-password-reset", data)
    .then((res) => res.data);
};

export interface ResetPasswordPayload {
  email: string;
  code: string;
  newPassword: string;
}

export const resetPassword = (data: ResetPasswordPayload) => {
  return apiClient.post("/auth/reset-password", data).then((res) => res.data);
};
