import apiClient from "./index";

type StartPaymentPayload = {
  listingUrl: string;
  plan: string;
  callbackUrl: string;
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
