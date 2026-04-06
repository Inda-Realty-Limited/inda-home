import apiClient from './index';

export type DealStage =
  | 'LEAD_CAPTURED'
  | 'REPORT_VIEWED'
  | 'INQUIRY'
  | 'INSPECTION'
  | 'OFFER'
  | 'NEGOTIATION'
  | 'CLOSING'
  | 'LOST';

export interface DealActivity {
  id: string;
  dealId: string;
  type: string;
  description: string;
  createdAt: string;
}

export interface Deal {
  id: string;
  agentId: string;
  buyerName: string;
  buyerEmail: string | null;
  buyerPhone: string | null;
  propertyName: string;
  propertyLocation: string | null;
  budget: string | null;
  timeline: string | null;
  stage: DealStage;
  nextAction: string | null;
  notes: string | null;
  reportViewed: boolean;
  messagesCount: number;
  lastActivityAt: string;
  createdAt: string;
  updatedAt: string;
  activities: DealActivity[];
}

export interface CreateDealPayload {
  buyerName: string;
  buyerEmail?: string;
  buyerPhone?: string;
  propertyName: string;
  propertyLocation?: string;
  budget?: string;
  timeline?: string;
  stage?: DealStage;
  nextAction?: string;
  notes?: string;
}

export interface UpdateDealPayload {
  buyerName?: string;
  buyerEmail?: string;
  buyerPhone?: string;
  propertyName?: string;
  propertyLocation?: string;
  budget?: string;
  timeline?: string;
  stage?: DealStage;
  nextAction?: string;
  notes?: string;
  reportViewed?: boolean;
  messagesCount?: number;
}

export const DealsService = {
  getAll: async (): Promise<Deal[]> => {
    const res = await apiClient.get('/deals');
    return res.data.data;
  },

  create: async (payload: CreateDealPayload): Promise<Deal> => {
    const res = await apiClient.post('/deals', payload);
    return res.data.data;
  },

  update: async (id: string, payload: UpdateDealPayload): Promise<Deal> => {
    const res = await apiClient.patch(`/deals/${id}`, payload);
    return res.data.data;
  },

  addActivity: async (id: string, type: string, description: string): Promise<Deal> => {
    const res = await apiClient.post(`/deals/${id}/activities`, { type, description });
    return res.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/deals/${id}`);
  },
};
