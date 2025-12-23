/**
 * Authentication Types
 * shared across Login, Signup, and Dashboard layouts.
 */

export type UserRole = 'Agent' | 'Developer' | 'Investor'

export interface UserProfile {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    token?: string;
    avatar?: string;
    credits?: number;
}

export interface AuthResponse {
    user: UserProfile;
    message?: string;
}
