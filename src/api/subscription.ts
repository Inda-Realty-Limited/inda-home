import apiClient from ".";

export const startSubscription = async (plan: string, callbackUrl: string) => {
    const response = await apiClient.post("/subscriptions/start", { plan, callbackUrl });
    return response.data;
};

export const verifySubscription = async (reference: string) => {
    const response = await apiClient.get(`/subscriptions/verify?reference=${reference}`);
    return response.data;
};
