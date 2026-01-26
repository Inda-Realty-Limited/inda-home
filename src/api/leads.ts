import apiClient from "./index";

export type LeadStatus = "new_lead" | "contacted" | "viewing_scheduled" | "offer_made" | "closed_won" | "closed_lost";
export type LeadPriority = "low" | "medium" | "high";
export type ActivityType = "inquiry" | "status_change" | "view" | "note" | "call" | "email" | "whatsapp" | "reminder";

export interface LeadActivity {
  _id?: string;
  type: ActivityType;
  content: string;
  createdAt: string;
}

export interface LeadNote {
  _id?: string;
  content: string;
  createdAt: string;
}

export interface LeadBudget {
  min?: number;
  max?: number;
  currency: string;
}

export interface Lead {
  _id: string;
  agentUserId: string;
  channel: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  listingId?: string | {
    _id: string;
    title: string;
    microlocationStd?: string;
    lga?: string;
    indaTag?: string;
    priceNGN?: number;
  };
  status: LeadStatus;
  priority: LeadPriority;
  notes: LeadNote[];
  activities: LeadActivity[];
  budget?: LeadBudget;
  offerAmount?: number;
  offerPercent?: string;
  reminderDate?: string;
  pageViews: number;
  lastActivityAt?: string;
  propertyTitle?: string;
  propertyLocation?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeadStats {
  total: number;
  hotLeads: number;
  offersMade: number;
  closedWon: number;
  byStatus: Record<string, number>;
  byPriority: Record<string, number>;
}

export interface LeadsResponse {
  success: boolean;
  data: {
    leads: Lead[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface LeadFilters {
  status?: LeadStatus;
  priority?: LeadPriority;
  search?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export const leadsApi = {
  // Get all leads with filters and pagination
  getLeads: async (filters: LeadFilters = {}): Promise<LeadsResponse> => {
    const params = new URLSearchParams();
    if (filters.status) params.append("status", filters.status);
    if (filters.priority) params.append("priority", filters.priority);
    if (filters.search) params.append("search", filters.search);
    if (filters.startDate) params.append("startDate", filters.startDate);
    if (filters.endDate) params.append("endDate", filters.endDate);
    if (filters.page) params.append("page", String(filters.page));
    if (filters.limit) params.append("limit", String(filters.limit));

    const response = await apiClient.get(`/api/leads?${params.toString()}`);
    return response.data;
  },

  // Get lead stats
  getStats: async (): Promise<{ success: boolean; data: LeadStats }> => {
    const response = await apiClient.get("/api/leads/stats");
    return response.data;
  },

  // Get single lead
  getLead: async (id: string): Promise<{ success: boolean; data: Lead }> => {
    const response = await apiClient.get(`/api/leads/${id}`);
    return response.data;
  },

  // Update lead
  updateLead: async (
    id: string,
    updates: {
      status?: LeadStatus;
      priority?: LeadPriority;
      budget?: LeadBudget;
      offerAmount?: number;
      offerPercent?: string;
      reminderDate?: string;
    }
  ): Promise<{ success: boolean; data: Lead }> => {
    const response = await apiClient.put(`/api/leads/${id}`, updates);
    return response.data;
  },

  // Add note to lead
  addNote: async (id: string, content: string): Promise<{ success: boolean; data: Lead }> => {
    const response = await apiClient.post(`/api/leads/${id}/notes`, { content });
    return response.data;
  },

  // Add activity to lead
  addActivity: async (
    id: string,
    type: ActivityType,
    content: string
  ): Promise<{ success: boolean; data: Lead }> => {
    const response = await apiClient.post(`/api/leads/${id}/activity`, { type, content });
    return response.data;
  },

  // Set reminder
  setReminder: async (id: string, reminderDate: string): Promise<{ success: boolean; data: Lead }> => {
    const response = await apiClient.post(`/api/leads/${id}/reminder`, { reminderDate });
    return response.data;
  },

  // Delete lead
  deleteLead: async (id: string): Promise<{ success: boolean; data: { message: string } }> => {
    const response = await apiClient.delete(`/api/leads/${id}`);
    return response.data;
  },
};

export default leadsApi;
