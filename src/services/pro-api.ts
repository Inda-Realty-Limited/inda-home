import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

// 1. API CONFIGURATION
// ----------------------------------------------------------------------------
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://inda-pro-backend.onrender.com';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Accept': 'application/json',
    },
    timeout: 30000,
});

// 2. INTERFACES (Types)
// ----------------------------------------------------------------------------
export interface ListingPayload {
    title: string;
    type: string;
    location: string;
    price: number;
    specs: { bed: string | number; bath: string | number; size: string | number; year?: string | number; };
    status?: string;
    constructionStatus?: string;
    features?: string;
    images?: File[];
}
export interface Listing extends ListingPayload { id?: string; indaTag?: string;[key: string]: any; }

export interface ContributionPayload {
    transactionType: string;
    propertyType: string;
    address: string;
    amount: number;
    date: string;
    size?: string;
    bedrooms?: string;
    details?: string;
    documents?: File[];
}

// 3. HELPER: CLEAN HTML ERRORS
// ----------------------------------------------------------------------------
const extractErrorFromHtml = (html: string) => {
    const preMatch = html.match(/<pre>([\s\S]*?)<\/pre>/);

    if (preMatch && preMatch[1]) {
        return preMatch[1]
            .replace(/<br\s*\/?>/gi, '')
            .replace(/&nbsp;/g, ' ')
            .replace(/^Error:\s*/i, '')
            .split('\n')[0]
            .trim();
    }
    return html.replace(/<[^>]*>?/gm, '').substring(0, 100).trim();
};

// 4. REQUEST INTERCEPTOR (Attaches the Token)
// ----------------------------------------------------------------------------
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('user');
            if (stored) {
                try {
                    const user = JSON.parse(stored);
                    let token = user.token || user.accessToken || user.data?.token;

                    if (token && typeof token === 'string') {
                        token = token.replace(/['"]+/g, '').trim();
                        config.headers.set('Authorization', `Bearer ${token}`);
                    }
                } catch (error) {
                    console.warn('API: Failed to parse user session:', error);
                }
            }
        }
        return config;
    },
    (error: AxiosError) => Promise.reject(error)
);

// 5. RESPONSE INTERCEPTOR (Handles Errors)
// ----------------------------------------------------------------------------
api.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError<any>) => {
        let errorMessage = 'An unknown error occurred';

        if (error.response?.data) {
            const data = error.response.data;

            if (typeof data === 'string') {
                if (data.trim().startsWith('<')) {
                    errorMessage = extractErrorFromHtml(data);
                    error.response.data = errorMessage;
                } else {
                    errorMessage = data;
                }
            }
            else if (data.message) {
                errorMessage = data.message;
            }
            else if (data.error) {
                errorMessage = data.error;
            }
        }
        else if (error.message) {
            errorMessage = error.message;
        }

        console.error("[API Error]", errorMessage);

        const customError = new Error(errorMessage);
        // @ts-ignore
        customError.response = error.response;
        return Promise.reject(customError);
    }
);

// 6. SERVICES
// ----------------------------------------------------------------------------

export const AuthService = {
    register: async (data: any) => (await api.post('/auth', data)).data,
    login: async (credentials: any) => (await api.post('/auth/login', credentials)).data,
    getProfile: async (id: string) => (await api.get(`/auth/${id}`)).data,
    updateProfile: async (id: string, data: any) => (await api.patch(`/auth/${id}`, data)).data,
    verifyOtp: async (data: { email: string; otp: string }) => (await api.post('/auth/verify-otp', data)).data
};

export const ListingsService = {
    getUserListings: async (userId: string) => (await api.get(`/listings/user/${userId}`)).data,
    getAllListings: async (page = 1, limit = 10, filters: Record<string, any> = {}) => {
        const response = await api.get('/listings', { params: { page, limit, ...filters } });
        return response.data;
    },
    getListing: async (indaTag: string) => (await api.get(`/listings/${indaTag}`)).data,
    deleteListing: async (indaTag: string) => {
        let storedId = '';
        if (typeof window !== 'undefined') {
            try {
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                storedId = user.id || user._id || '';
            } catch (e) { }
        }
        return (await api.delete(`/listings/${indaTag}`, { data: { userId: storedId } })).data;
    },
    create: async (data: any) => {
        if (data instanceof FormData) {
            return (await api.post('/listings', data)).data;
        }
        const formData = new FormData();
        let storedId = '';
        if (typeof window !== 'undefined') {
            try {
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                storedId = user.id || user._id || '';
            } catch (e) { }
        }
        if (storedId) formData.append('userId', storedId);

        Object.keys(data).forEach(key => {
            if (key === 'images' && Array.isArray(data.images)) {
                data.images.forEach((file: any) => formData.append('images', file));
            } else if (typeof data[key] === 'object' && data[key] !== null) {
                formData.append(key, JSON.stringify(data[key]));
            } else {
                formData.append(key, data[key]);
            }
        });

        return (await api.post('/listings', formData)).data;
    },
    updateListing: async (id: string, data: any) => {
        if (data instanceof FormData) {
            return (await api.put(`/listings/${id}`, data)).data;
        }
        return (await api.put(`/listings/${id}`, data)).data;
    }
};

export const ReportsService = {
    getUserReports: async (userId: string) => (await api.get(`/reports`, { params: { userId } })).data,
    generateReport: async (data: any) => (await api.post('/reports', data)).data,
    getReport: async (reportId: string) => (await api.get(`/reports/${reportId}`)).data
};

export const ContributionService = {
    getDashboard: async (userId: string) => (await api.get(`/contributions/user/${userId}/dashboard`)).data,
    submit: async (data: any) => (await api.post('/contributions', data)).data
};

export const BillingService = {
    getHistory: async (userId: string) => (await api.get(`/billing/user/${userId}`)).data,
    getSubscription: async (userId: string) => (await api.get(`/billing/subscription/${userId}`)).data
};

export const InsightsService = {
    getMarketTrends: async (params?: any) => (await api.get('/insights/market', { params })).data,
    getUserPerformance: async (userId: string) => (await api.get(`/insights/user/${userId}/performance`)).data
};

export default api;
