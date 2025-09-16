import apiClient from "./index";

type StartPaymentPayload = {
  listingUrl: string;
  plan: string; // "free" | "instant" | "deepDive" | "deeperDive"
  callbackUrl?: string; // optional for free plan (auto-completes)
};

// Starts a payment session and returns the provider session payload
export const startPayment = async (payload: StartPaymentPayload) => {
  const res = await apiClient.post("/payments/start", payload);
  // API returns { status: string, data: {...} }
  return res.data?.data;
};

export type StartPaymentResponse = Awaited<ReturnType<typeof startPayment>>;

export const hasPaid = async (listingUrl: string, plan: string) => {
  const res = await apiClient.get("/payments/has-paid", {
    params: { listingUrl, plan },
  });
  return res.data?.data as { paid: boolean; payment: any | null };
};

export const verifyPayment = async (reference: string) => {
  const res = await apiClient.get("/payments/verify", {
    params: { reference },
  });
  return res.data?.data;
};

// Free view status for the authenticated user
export type FreeViewStatus = {
  hasUsedFreeView: boolean;
  freeViewAvailable: boolean;
  freeViewDetails?: {
    usedOn?: string;
    usedAt?: string;
    reference?: string;
  } | null;
};

export const getFreeViewStatus = async (): Promise<FreeViewStatus> => {
  const res = await apiClient.get("/payments/free-status");
  return (res.data?.data || {
    hasUsedFreeView: false,
    freeViewAvailable: true,
    freeViewDetails: null,
  }) as FreeViewStatus;
};
