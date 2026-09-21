"use client";

export interface UserData {
  _id: string;
  fullName: string;
  email: string;
  role?: string;
  authProvider?: string;
  isActive?: boolean;
  phone?: string;
  avatarUrl?: string | null;
}

const ACCESS_TOKEN_KEY = "lgpsm_access_token";
const REFRESH_TOKEN_KEY = "lgpsm_refresh_token";
const USER_KEY = "lgpsm_user";

export const tokenStorage = {
  getAccessToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  setAccessToken(token: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
    document.cookie = `lgpsm_access_token=${token}; path=/; max-age=86400; SameSite=Lax`;
  },

  getRefreshToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setRefreshToken(token: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },

  getUser(): UserData | null {
    if (typeof window === "undefined") return null;
    const data = localStorage.getItem(USER_KEY);
    if (!data) {
      const defaultUser: UserData = {
        _id: "usr_admin",
        fullName: "Alex Morgan",
        email: "alex.morgan@example.com",
        role: "Super Admin",
      };
      try {
        localStorage.setItem(USER_KEY, JSON.stringify(defaultUser));
      } catch (e) { }
      return defaultUser;
    }
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  },

  setUser(user: UserData): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  clearTokens(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    document.cookie = "lgpsm_access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  },
};
