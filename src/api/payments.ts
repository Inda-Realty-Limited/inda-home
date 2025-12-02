import {
  QuestionnaireFileRef,
  StartListingPaymentPayload,
  StartListingPaymentResponse,
} from "@/types/questionnaire";
import apiClient from "./index";

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
  const res = await apiClient.get("/payments/free-view-status");
  return (res.data?.data || {
    hasUsedFreeView: false,
    freeViewAvailable: true,
    freeViewDetails: null,
  }) as FreeViewStatus;
};

export type OrdersSummary = {
  totalOrders: number;
  totalListings: number;
  totalPayments: number;
  page: number;
  pageSize: number;
};

export type OrdersByListingItem = {
  listingId: string;
  listing: {
    _id?: string;
    title: string | null;
    listingUrl?: string | null;
    priceNGN?: number;
    priceOriginal?: number;
    state?: string;
    lga?: string;
    microlocationStd?: string;
    propertyTypeStd?: string;
    imageUrls?: string[];
  };
  plans: Array<{
    plan: string;
    reference: string;
    provider: string;
    paidAt?: string | null;
  }>;
  lastPaidAt?: string | null;
  firstPaidAt?: string | null;
};

export type OrdersApiResponse = {
  summary: OrdersSummary;
  orders: OrdersByListingItem[];
  payments: {
    total: number;
    page: number;
    pageSize: number;
    items: any[];
  };
};

export async function getOrdersAndPayments(params?: {
  status?: string;
  page?: number;
  limit?: number;
}): Promise<OrdersApiResponse> {
  const res = await apiClient.get("/payments/orders", { params });
  return res.data?.data as OrdersApiResponse;
}

export const uploadQuestionnaireFiles = async (
  files: File[]
): Promise<QuestionnaireFileRef[]> => {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  const res = await apiClient.post(
    "/payments/questionnaire/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return (res.data?.data || []) as QuestionnaireFileRef[];
};

export const startListingPayment = async (
  payload: StartListingPaymentPayload
): Promise<StartListingPaymentResponse> => {
  const res = await apiClient.post("/payments/start", payload);
  return (res.data?.data || {}) as StartListingPaymentResponse;
};
