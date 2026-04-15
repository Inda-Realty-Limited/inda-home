import apiClient from ".";

export interface TrainingProgress {
  completedItemIds: string[];
}

export const getTrainingProgress = async (): Promise<TrainingProgress> =>
  apiClient.get("/profile/training-progress").then((res) => res.data?.data ?? { completedItemIds: [] });

export const updateTrainingProgress = async (data: TrainingProgress) =>
  apiClient.put("/profile/training-progress", data).then((res) => res.data?.data ?? data);
