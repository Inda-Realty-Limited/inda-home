export type StoredUser = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive?: boolean;
  howDidYouHearAboutUs?: string;
  isVerified?: boolean;
  todo?: string;
  createdAt?: string;
  updatedAt?: string;
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
  logout: () => Promise<void>;
  setUser: (user: StoredUser | null, token?: string) => void;
  checkSession: () => Promise<void>;
}


