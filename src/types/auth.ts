export type StoredUser = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive?: boolean;
  howDidYouHearAboutUs?: string;
  isVerified?: boolean;
  role: "Buyer" | "Investor" | "Agent" | "Developer" | "Admin";
  todo?: string;
  createdAt?: string;
  updatedAt?: string;
  subscriptionPlan?: "starter" | "growth" | "elite" | "partner";
  subscriptionStatus?: "active" | "expired" | "none";
  subscriptionExpiresAt?: string;
  [key: string]: any;
};

export interface AuthState {
  user: StoredUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
  setUser: (user: StoredUser | null, token?: string) => void;
}

