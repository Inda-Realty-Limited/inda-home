import {
  login as loginApi,
  logout as logoutApi,
  checkSession as checkSessionApi,
} from "@/api/auth";
import { AuthContextType, AuthState, StoredUser } from "@/types/auth";
import { useRouter } from "next/router";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import CryptoJS from "crypto-js";

// --- Constants and Helpers for JWT (localStorage) Auth ---
const TOKEN_KEY = "inda_token";
const USER_KEY = "inda_user";
const getSecretKey = () => {
  if (typeof window === "undefined") return "fallback_key";
  return process.env.NEXT_PUBLIC_ENCRYPTION_SECRET || "inda_super_secret_key";
};
// ---

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });
  const router = useRouter();

  /**
   * Unified function to set the authentication state.
   * - If 'token' is provided, it saves user/token to localStorage (JWT auth).
   * - If only 'user' is provided, it sets user state and clears localStorage (Session auth).
   * - If 'null' is provided, it clears all auth state and localStorage (Logout).
   */
  const setUser = useCallback((user: StoredUser | null, token?: string) => {
    try {
      if (user && token) {
        // JWT Auth: Encrypt and store user & token.
        const userJson = JSON.stringify(user);
        const encryptedUser = CryptoJS.AES.encrypt(
          userJson,
          getSecretKey()
        ).toString();
        localStorage.setItem(USER_KEY, encryptedUser);

        const encryptedToken = CryptoJS.AES.encrypt(
          token,
          getSecretKey()
        ).toString();
        localStorage.setItem(TOKEN_KEY, encryptedToken);

        setState({ user, isAuthenticated: true, isLoading: false, error: null });
      } else if (user) {
        // Session Auth: Set user state, but ensure localStorage is clean.
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setState({ user, isAuthenticated: true, isLoading: false, error: null });
      } else {
        // Logout/Unauthenticated: Clear storage and state.
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      console.error("AuthContext.setUser failed:", error);
      // Failsafe: clear everything.
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: "Failed to set auth state.",
      });
    }
  }, []);

  /**
   * Checks for a valid server-side session (cookie). Used for Google OAuth flow.
   */
  const checkSession = useCallback(async () => {
    try {
      const response = await checkSessionApi();
      if (response?.user) {
        setUser(response.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      // This is expected if there's no session cookie.
      setUser(null);
    }
  }, [setUser]);

  /**
   * On initial app load, determines auth state by checking for a JWT first,
   * then falling back to check for a server-side session.
   */
  useEffect(() => {
    const initAuth = async () => {
      setState((prev) => ({ ...prev, isLoading: true }));
      let isAuthedByToken = false;

      // 1. Check for JWT in localStorage
      const encryptedToken = localStorage.getItem(TOKEN_KEY);
      const encryptedUser = localStorage.getItem(USER_KEY);

      if (encryptedToken && encryptedUser) {
        try {
          const token = CryptoJS.AES.decrypt(
            encryptedToken,
            getSecretKey()
          ).toString(CryptoJS.enc.Utf8);
          const user = JSON.parse(
            CryptoJS.AES.decrypt(encryptedUser, getSecretKey()).toString(
              CryptoJS.enc.Utf8
            )
          );

          if (user && token) {
            setState({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
isAuthedByToken = true;
          }
        } catch (error) {
          console.error("Clearing corrupted auth state from storage.", error);
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
        }
      }

      // 2. If no JWT, check for a session cookie
      if (!isAuthedByToken) {
        try {
          const response = await checkSessionApi();
          if (response?.user) {
            setUser(response.user); // Sets user, clears localStorage
          } else {
            // No token, no session -> not authenticated
            setState((prev) => ({
              ...prev,
              user: null,
              isAuthenticated: false,
              isLoading: false,
            }));
          }
        } catch (error) {
          setState((prev) => ({
            ...prev,
            user: null,
            isAuthenticated: false,
            isLoading: false,
          }));
        }
      }
    };

    initAuth();
  }, [setUser]);

  /**
   * Handles email/password login. Stores returned JWT in localStorage.
   */
  const login = useCallback(
    async (email: string, password: string) => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));
        const response = await loginApi({ email, password });

        if (response?.user && response?.token) {
          setUser(response.user, response.token); // Store JWT and user
        } else {
          throw new Error("Login failed: No user or token in response.");
        }

        return response;
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.message || error?.message || "Login failed";
        setState((prev) => ({ ...prev, error: errorMessage, isLoading: false }));
        throw error;
      }
    },
    [setUser]
  );

  /**
   * Handles logout for both JWT and session auth.
   */
  const logout = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      await logoutApi(); // Destroys backend session cookie
    } catch (error) {
      console.error(
        "Logout API call failed, but clearing client-side state anyway:",
        error
      );
    } finally {
      setUser(null); // Clears localStorage and local state
      router.push("/");
    }
  }, [setUser, router]);

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    setUser,
    checkSession,
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