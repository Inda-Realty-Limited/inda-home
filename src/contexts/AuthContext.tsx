import { login as loginApi, logout as logoutApi } from "@/api/auth";
import { AuthContextType, AuthState, StoredUser } from "@/types/auth";
import { useRouter } from "next/router";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import CryptoJS from "crypto-js";

const TOKEN_KEY = "inda_token";
const USER_KEY = "inda_user";

const getSecretKey = () => {
  if (typeof window === "undefined") return "fallback_key";
  return process.env.NEXT_PUBLIC_ENCRYPTION_SECRET || "inda_super_secret_key";
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });
  const router = useRouter();

  const setUser = useCallback((user: StoredUser | null, token?: string) => {
    try {
      if (user && token) {
        // Store user in localStorage (encrypted)
        const userJson = JSON.stringify(user);
        const encryptedUser = CryptoJS.AES.encrypt(userJson, getSecretKey()).toString();
        localStorage.setItem(USER_KEY, encryptedUser);
        
        // Store token (encrypted)
        const encryptedToken = CryptoJS.AES.encrypt(token, getSecretKey()).toString();
        localStorage.setItem(TOKEN_KEY, encryptedToken);
        
        setState(prev => ({
          ...prev,
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        }));
        
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("inda:auth-changed"));
        }
      } else {
        // Clear storage
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        
        setState(prev => ({
          ...prev,
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        }));
      }
    } catch (error) {
      console.error("Failed to set user:", error);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const response = await loginApi({ email, password });
      
      if (response?.user && response?.token) {
        setUser(response.user, response.token);
      } else {
        throw new Error("No user data or token returned from login");
      }
      
      return response;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Login failed";
      setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
      throw error;
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [setUser]);

  const logout = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      await logoutApi();
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      // Clear storage and state
      setUser(null);
      setState(prev => ({ ...prev, isLoading: false }));
      
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("inda:logout"));
      }
      
      router.push("/");
    }
  }, [setUser, router]);

  // Load user and token from localStorage on mount
  useEffect(() => {
    let isMounted = true;

    const initAuth = () => {
      setState((prev) => ({ ...prev, isLoading: true }));

      try {
        const encryptedUser = localStorage.getItem(USER_KEY);
        const encryptedToken = localStorage.getItem(TOKEN_KEY);

        if (encryptedUser && encryptedToken) {
          const bytes = CryptoJS.AES.decrypt(encryptedUser, getSecretKey());
          const decryptedUser = bytes.toString(CryptoJS.enc.Utf8);

          if (decryptedUser && isMounted) {
            const userData = JSON.parse(decryptedUser) as StoredUser;
            setState((prev) => ({
              ...prev,
              user: userData,
              isAuthenticated: true,
              isLoading: false,
            }));
            return;
          }
        }
      } catch (error) {
        console.error("Failed to load user from storage:", error);
      }

      if (isMounted) {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    initAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      // Re-check authentication when storage changes (e.g., logout in another tab)
      const encryptedUser = localStorage.getItem(USER_KEY);
      const encryptedToken = localStorage.getItem(TOKEN_KEY);
      
      if (!encryptedUser || !encryptedToken) {
        setUser(null);
      }
    };

    const handleLogout = () => {
      setUser(null);
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("inda:logout", handleLogout);
    window.addEventListener("inda:session-expired", handleLogout);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("inda:logout", handleLogout);
      window.removeEventListener("inda:session-expired", handleLogout);
    };
  }, [setUser]);

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
