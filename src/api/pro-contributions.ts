import apiClient from './index';

export interface Contribution {
  id: string;
  userId: string;
  type: string;
  description: string | null;
  data: Record<string, unknown> | null;
  status: string;
  points: number;
  notes: string | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ContributionStats {
  totalSubmitted: number;
  approved: number;
  pending: number;
  creditsEarned: number;
}

export const ProContributionService = {
  getMyContributions: async (): Promise<Contribution[]> => {
    const res = await apiClient.get('/contributions/my-contributions');
    return res.data?.data ?? [];
  },

  getMyPoints: async (): Promise<number> => {
    const res = await apiClient.get('/contributions/my-points');
    return res.data?.data?.points ?? 0;
  },

  getStats: async (): Promise<ContributionStats> => {
    const [contributions, points] = await Promise.all([
      ProContributionService.getMyContributions(),
      ProContributionService.getMyPoints(),
    ]);

    return {
      totalSubmitted: contributions.length,
      approved: contributions.filter((c) => c.status === 'approved').length,
      pending: contributions.filter((c) => c.status === 'pending').length,
      creditsEarned: points,
    };
  },

  submit: async (payload: {
    type: string;
    description: string;
    location: string;
  }): Promise<Contribution> => {
    const res = await apiClient.post('/contributions', {
      type: payload.type,
      description: payload.description,
      data: { location: payload.location },
    });
    return res.data?.data;
  },
};
