import CryptoJS from "crypto-js";

const SECRET_KEY = "inda_super_secret_key";
export const TOKEN_KEY = "inda_token";

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
