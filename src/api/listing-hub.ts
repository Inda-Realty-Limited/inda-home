import apiClient from "./index";

// ============================================================================
// TYPES
// ============================================================================

export interface DisputeData {
  listingId: string;
  category: string;
  explanation: string;
  userId?: string;
}

export interface DisputeResponse {
  success: boolean;
  data?: {
    id: string;
    status: 'pending' | 'reviewing' | 'resolved' | 'rejected';
    createdAt: string;
  };
  message?: string;
}

export interface BuyerPreviewSettings {
  visibilityMode: "public" | "gated" | "invitation" | "hidden";
  requirePhone: boolean;
  badgeStyle: "full" | "minimal";
  showConfidenceScore: boolean;
}

export interface ListingAnalytics {
  views: number;
  uniqueViewers: number;
  leads: number;
  reportUnlocks: number;
  offers: number;
  engaged: number;
  averageEngagement: number;
  conversionRate: number;
  viewsByDay?: Array<{ date: string; count: number }>;
  leadsBySource?: Record<string, number>;
}

// ============================================================================
// DISPUTE SERVICE
// ============================================================================

export const DisputeService = {
  /**
   * Submit a dispute for a listing
   * Uses POST /api/listings/:listingId/disputes endpoint
   */
  submit: async (data: DisputeData): Promise<DisputeResponse> => {
    try {
      const response = await apiClient.post(`/api/listings/${data.listingId}/disputes`, {
        category: data.category,
        explanation: data.explanation,
        userId: data.userId
      });
      return response.data;
    } catch (error: any) {
      console.error('Failed to submit dispute:', error);
      throw error;
    }
  },

  /**
   * Get disputes for a listing
   * Fetches the listing and extracts disputes array
   */
  getByListing: async (listingId: string) => {
    try {
      const response = await apiClient.get(`/api/listings/${listingId}`);
      return {
        success: true,
        data: response.data?.data?.disputes || []
      };
    } catch (error: any) {
      console.error('Failed to get disputes:', error);
      return { success: false, data: [] };
    }
  }
};

// ============================================================================
// LISTING SETTINGS SERVICE
// ============================================================================

export const ListingSettingsService = {
  /**
   * Get buyer preview settings for a listing
   * Fetches the listing and extracts buyerPreviewSettings
   */
  getSettings: async (listingId: string): Promise<BuyerPreviewSettings | null> => {
    try {
      const response = await apiClient.get(`/api/listings/${listingId}`);
      return response.data?.data?.buyerPreviewSettings || null;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null; // Listing not found
      }
      console.error('Failed to get settings:', error);
      return null;
    }
  },

  /**
   * Save buyer preview settings for a listing
   * Uses PUT /api/listings/:listingId endpoint
   */
  saveSettings: async (listingId: string, settings: Partial<BuyerPreviewSettings>): Promise<boolean> => {
    try {
      await apiClient.put(`/api/listings/${listingId}`, {
        buyerPreviewSettings: settings
      });
      return true;
    } catch (error: any) {
      console.error('Failed to save settings:', error);
      return false;
    }
  }
};

// ============================================================================
// LISTING ANALYTICS SERVICE
// ============================================================================

export const ListingAnalyticsService = {
  /**
   * Get analytics for a listing
   * Uses GET /api/listings/:listingId/analytics endpoint
   */
  getAnalytics: async (listingId: string): Promise<ListingAnalytics> => {
    try {
      const response = await apiClient.get(`/api/listings/${listingId}/analytics`);
      return response.data?.data || {
        views: 0,
        uniqueViewers: 0,
        leads: 0,
        reportUnlocks: 0,
        offers: 0,
        engaged: 0,
        averageEngagement: 0,
        conversionRate: 0
      };
    } catch (error: any) {
      console.error('Failed to get analytics:', error);
      // Return defaults if endpoint doesn't exist or fails
      return {
        views: 0,
        uniqueViewers: 0,
        leads: 0,
        reportUnlocks: 0,
        offers: 0,
        engaged: 0,
        averageEngagement: 0,
        conversionRate: 0
      };
    }
  },

  /**
   * Track a view event (views are auto-incremented when fetching listing)
   */
  trackView: async (listingId: string) => {
    // Views are automatically tracked when getSingleListing is called
    // This is a no-op but kept for API compatibility
    try {
      await apiClient.get(`/api/listings/${listingId}`);
    } catch (error) {
      console.error('Failed to track view:', error);
    }
  }
};
