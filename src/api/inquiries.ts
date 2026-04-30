import apiClient from "./index";

export interface CreateVisitRequestPayload {
  listingId: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  preferredDate: string;
  preferredTime: string;
  message?: string;
}

export interface CreateOfferPayload {
  listingId: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  offerAmount: number;
  message?: string;
}

export const InquiriesService = {
  createVisitRequest: async (payload: CreateVisitRequestPayload) => {
    const res = await apiClient.post("/inquiries/visit", payload);
    return res.data;
  },
  createOffer: async (payload: CreateOfferPayload) => {
    const res = await apiClient.post("/inquiries/offer", payload);
    return res.data;
  },
};

export default InquiriesService;
