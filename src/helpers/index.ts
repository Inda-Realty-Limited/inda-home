import CryptoJS from "crypto-js";

const SECRET_KEY = "inda_super_secret_key";
export const TOKEN_KEY = "inda_token";
export const USER_KEY = "inda_user";

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
  // Allow any extra fields from API without breaking types
  [key: string]: any;
};

export function setToken(token: string) {
  try {
    const encrypted = CryptoJS.AES.encrypt(token, SECRET_KEY).toString();
    localStorage.setItem(TOKEN_KEY, encrypted);
  } catch (e) {}
}

export function getToken(): string | null {
  try {
    const encrypted = localStorage.getItem(TOKEN_KEY);
    if (!encrypted) return null;
    const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted || null;
  } catch (e) {
    return null;
  }
}

export function removeToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (e) {}
}

// Encrypted user helpers
export function setUser(user: StoredUser) {
  try {
    const json = JSON.stringify(user);
    const encrypted = CryptoJS.AES.encrypt(json, SECRET_KEY).toString();
    localStorage.setItem(USER_KEY, encrypted);
  } catch (e) {}
}

export function getUser(): StoredUser | null {
  try {
    const encrypted = localStorage.getItem(USER_KEY);
    if (!encrypted) return null;
    const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    if (!decrypted) return null;
    return JSON.parse(decrypted) as StoredUser;
  } catch (e) {
    return null;
  }
}

export function updateUser(patch: Partial<StoredUser>): StoredUser | null {
  try {
    const current = getUser() || ({} as StoredUser);
    const updated = { ...current, ...patch } as StoredUser;
    setUser(updated);
    return updated;
  } catch (e) {
    return null;
  }
}

export function removeUser() {
  try {
    localStorage.removeItem(USER_KEY);
  } catch (e) {}
}
