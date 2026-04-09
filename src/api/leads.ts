import apiClient from "./index";

export type LeadStatus =
  | "new_lead"
  | "contacted"
  | "viewing_scheduled"
  | "offer_made"
  | "closed_won"
  | "closed_lost";
export type LeadPriority = "low" | "medium" | "high";
export type ActivityType =
  | "inquiry"
  | "status_change"
  | "view"
  | "note"
  | "call"
  | "email"
  | "whatsapp"
  | "reminder";

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
  channel: string | null;
  name: string | null;
  email: string | null;
  phone?: string | null;
  message?: string | null;
  listingId?:
    | string
    | {
        _id: string;
        title: string | null;
        microlocationStd?: string | null;
        lga?: string | null;
        indaTag?: string | null;
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
  propertyTitle?: string | null;
  propertyLocation?: string | null;
  createdAt: string;
  updatedAt: string;
  source?: string | null;
  isHot?: boolean;
  contactedAt?: string | null;
}

export interface LeadStats {
  total: number;
  hotLeads: number;
  offersMade: number;
  closedWon: number;
  byStatus: Record<string, number>;
  byPriority: Record<string, number>;
  currentMonth: number;
  previousMonth: number;
  monthOverMonthChangePct: number;
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

  getStats: async (): Promise<{ success: boolean; data: LeadStats }> => {
    const response = await apiClient.get("/api/leads/stats");
    return response.data;
  },

  getLead: async (id: string): Promise<{ success: boolean; data: Lead }> => {
    const response = await apiClient.get(`/api/leads/${id}`);
    return response.data;
  },

  updateLead: async (
    id: string,
    updates: {
      status?: LeadStatus;
      priority?: LeadPriority;
      budget?: LeadBudget;
      offerAmount?: number;
      offerPercent?: string;
      reminderDate?: string;
      isHot?: boolean;
    }
  ): Promise<{ success: boolean; data: Lead }> => {
    const payload: Record<string, unknown> = {
      status: updates.status,
      priority: updates.priority,
      offerAmount: updates.offerAmount,
      offerPercent: updates.offerPercent,
      reminderDate: updates.reminderDate,
      isHot: updates.isHot,
      budgetMin: updates.budget?.min,
      budgetMax: updates.budget?.max,
      budgetCurrency: updates.budget?.currency,
    };

    const response = await apiClient.patch(`/api/leads/${id}`, payload);
    return response.data;
  },

  addNote: async (id: string, content: string): Promise<{ success: boolean; data: Lead }> => {
    const response = await apiClient.post(`/api/leads/${id}/notes`, { content });
    return response.data;
  },

  addActivity: async (
    id: string,
    type: ActivityType,
    content: string
  ): Promise<{ success: boolean; data: Lead }> => {
    const response = await apiClient.post(`/api/leads/${id}/activity`, { type, content });
    return response.data;
  },

  setReminder: async (id: string, reminderDate: string): Promise<{ success: boolean; data: Lead }> => {
    const response = await apiClient.post(`/api/leads/${id}/reminder`, { reminderDate });
    return response.data;
  },

  deleteLead: async (id: string): Promise<{ success: boolean; data: { message: string } }> => {
    const response = await apiClient.delete(`/api/leads/${id}`);
    return response.data;
  },
};

export default leadsApi;
