import apiClient from "./index";

export interface ChannelStatsItem {
    _id: string;
    userId: string;
    channel: string;
    clicks: number;
    leads: number;
    createdAt: string;
    updatedAt: string;
}

export interface PublicListing {
    _id: string;
    title: string;
    priceNGN?: number;
    priceOriginal?: number;
    state?: string;
    lga?: string;
    microlocationStd?: string;
    propertyTypeStd?: string;
    bedrooms?: number;
    bathrooms?: number;
    sizeSqm?: number;
    images?: string[];
    listingUrl?: string;
}

export const getChannelStats = async (): Promise<ChannelStatsItem[]> => {
    const res = await apiClient.get("/api/channels/stats");
    return (res.data?.data || []) as ChannelStatsItem[];
};

export const trackChannelClick = async (userId: string, channel: string): Promise<void> => {
    await apiClient.post("/api/channels/track-click", { userId, channel });
};

export const trackChannelLead = async (userId: string, channel: string): Promise<void> => {
    await apiClient.post("/api/channels/track-lead", { userId, channel });
};

export const getPublicListings = async (userId: string): Promise<PublicListing[]> => {
    const res = await apiClient.get(`/api/channels/listings/${userId}`);
    return (res.data?.data || []) as PublicListing[];
};

export interface InquiryPayload {
    agentUserId: string;
    channel: string;
    name: string;
    email: string;
    phone?: string;
    message?: string;
    listingId?: string;
}

export interface InquiryResponse {
    agentPhone: string | null;
    agentName: string;
}

export const submitInquiry = async (payload: InquiryPayload): Promise<InquiryResponse> => {
    const res = await apiClient.post("/api/channels/inquiry", payload);
    return (res.data?.data || { agentPhone: null, agentName: 'Agent' }) as InquiryResponse;
};

export const getPublicListingById = async (listingId: string): Promise<PublicListing | null> => {
    const res = await apiClient.get(`/api/channels/listing/${listingId}`);
    return (res.data?.data || null) as PublicListing | null;
};
