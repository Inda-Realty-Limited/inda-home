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
    _id?: string;
    id: string;
    description?: string | null;
    title: string | null;
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

export interface PublicAgentProfile {
    id: string;
    slug: string;
    displayName: string;
    companyName?: string | null;
    phoneNumber?: string | null;
    title?: string | null;
    bio?: string | null;
    avatarUrl?: string;
    logoLightUrl?: string;
    listingCount: number;
}

export const getChannelStats = async (): Promise<ChannelStatsItem[]> => {
    const res = await apiClient.get("/channels/stats");
    const data = res.data?.data;

    // Handle new object format: { channels: { whatsapp: { clicks, leads }, ... } }
    if (data?.channels && typeof data.channels === 'object') {
        return Object.entries(data.channels).map(([channel, stats]: [string, any]) => ({
            _id: '',
            userId: '',
            channel,
            clicks: stats?.clicks || 0,
            leads: stats?.leads || 0,
            createdAt: '',
            updatedAt: '',
        }));
    }

    // Fallback for old array format
    return (data || []) as ChannelStatsItem[];
};

export const trackChannelClick = async (userId: string, channel: string): Promise<void> => {
    await apiClient.post("/channels/track-click", { userId, channel });
};

export const trackChannelLead = async (userId: string, channel: string): Promise<void> => {
    await apiClient.post("/channels/track-lead", { userId, channel });
};

export const getPublicListings = async (userId: string): Promise<PublicListing[]> => {
    const res = await apiClient.get(`/channels/listings/${userId}`);
    return (res.data?.data || []) as PublicListing[];
};

export const getPublicProfileBySlug = async (slug: string): Promise<PublicAgentProfile> => {
    const res = await apiClient.get(`/channels/profile/${slug}`);
    return res.data?.data as PublicAgentProfile;
};

export const getPublicListingsBySlug = async (slug: string): Promise<PublicListing[]> => {
    const res = await apiClient.get(`/channels/profile/${slug}/listings`);
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
    const res = await apiClient.post("/channels/inquiry", payload);
    return (res.data?.data || { agentPhone: null, agentName: 'Agent' }) as InquiryResponse;
};

export const getPublicListingById = async (listingId: string): Promise<PublicListing | null> => {
    const res = await apiClient.get(`/channels/listing/${listingId}`);
    return (res.data?.data || null) as PublicListing | null;
};

export const getPublicListingBySlug = async (slug: string, listingId: string): Promise<PublicListing | null> => {
    const res = await apiClient.get(`/channels/profile/${slug}/listings/${listingId}`);
    return (res.data?.data || null) as PublicListing | null;
};
