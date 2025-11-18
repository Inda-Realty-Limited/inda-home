/**
 * @deprecated This file contains legacy localStorage-based auth functions.
 * Use AuthContext (src/contexts/AuthContext.tsx) and useAuth() hook instead.
 * These functions are kept for backwards compatibility during migration.
 */

import CryptoJS from "crypto-js";
import { env } from "@/config/env";

export const TOKEN_KEY = "inda_token";
export const USER_KEY = "inda_user";

const getSecretKey = () => env.security.encryptionSecret;

/**
 * @deprecated Import from src/types/auth.ts instead
 */
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

/**
 * @deprecated Use AuthContext instead. Tokens are now managed via httpOnly cookies.
 * This function is kept for backwards compatibility only.
 */
export function setToken(token: string) {
  console.warn("setToken is deprecated. Auth is now cookie-based via AuthContext.");
  try {
    const encrypted = CryptoJS.AES.encrypt(token, getSecretKey()).toString();
    localStorage.setItem(TOKEN_KEY, encrypted);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("inda:token-changed"));
    }
  } catch (e) {}
}

/**
 * @deprecated Use AuthContext instead. Tokens are now managed via httpOnly cookies.
 * This function is kept for backwards compatibility only.
 */
export function getToken(): string | null {
  console.warn("getToken is deprecated. Use useAuth() hook instead.");
  try {
    const encrypted = localStorage.getItem(TOKEN_KEY);
    if (!encrypted) return null;
    const bytes = CryptoJS.AES.decrypt(encrypted, getSecretKey());
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted || null;
  } catch (e) {
    return null;
  }
}

/**
 * @deprecated Use AuthContext.logout() instead.
 * This function is kept for backwards compatibility only.
 */
export function removeToken() {
  console.warn("removeToken is deprecated. Use AuthContext.logout() instead.");
  try {
    localStorage.removeItem(TOKEN_KEY);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("inda:token-removed"));
    }
  } catch (e) {}
}

/**
 * @deprecated Use AuthContext.setUser() instead.
 * This function is kept for backwards compatibility only.
 */
export function setUser(user: StoredUser) {
  console.warn("setUser is deprecated. Use AuthContext.setUser() instead.");
  try {
    const json = JSON.stringify(user);
    const encrypted = CryptoJS.AES.encrypt(json, getSecretKey()).toString();
    localStorage.setItem(USER_KEY, encrypted);
  } catch (e) {}
}

/**
 * @deprecated Use useAuth() hook to access user state.
 * This function is kept for backwards compatibility only.
 */
export function getUser(): StoredUser | null {
  console.warn("getUser is deprecated. Use useAuth() hook instead.");
  try {
    const encrypted = localStorage.getItem(USER_KEY);
    if (!encrypted) return null;
    const bytes = CryptoJS.AES.decrypt(encrypted, getSecretKey());
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    if (!decrypted) return null;
    return JSON.parse(decrypted) as StoredUser;
  } catch (e) {
    return null;
  }
}

/**
 * @deprecated Use AuthContext.setUser() with updated user object instead.
 * This function is kept for backwards compatibility only.
 */
export function updateUser(patch: Partial<StoredUser>): StoredUser | null {
  console.warn("updateUser is deprecated. Use AuthContext.setUser() instead.");
  try {
    const current = getUser() || ({} as StoredUser);
    const updated = { ...current, ...patch } as StoredUser;
    setUser(updated);
    return updated;
  } catch (e) {
    return null;
  }
}

/**
 * @deprecated Use AuthContext.logout() instead.
 * This function is kept for backwards compatibility only.
 */
export function removeUser() {
  console.warn("removeUser is deprecated. Use AuthContext.logout() instead.");
  try {
    localStorage.removeItem(USER_KEY);
  } catch (e) {}
}
