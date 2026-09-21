"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserData, tokenStorage } from "@/services/tokenStorage";
import { authService, LoginPayload, RegisterPayload } from "@/services/authService";
import { userService, UpdateProfilePayload } from "@/services/userService";
import { ApiResponse } from "@/services/apiClient";

interface AuthContextType {
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginPayload) => Promise<ApiResponse>;
  register: (payload: RegisterPayload) => Promise<ApiResponse>;
  logout: () => Promise<void>;
  updateProfile: (payload: UpdateProfilePayload) => Promise<ApiResponse>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    const storedUser = tokenStorage.getUser();
    if (storedUser) setUser(storedUser);

    const token = tokenStorage.getAccessToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const res = await userService.getProfile();
      if (res.success && res.data) {
        setUser(res.data);
        tokenStorage.setUser(res.data);
      }
    } catch {
      // keep stored user if network error occurs temporarily
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (credentials: LoginPayload): Promise<ApiResponse> => {
    const res = await authService.login(credentials);
    if (res.success && res.data?.user) {
      setUser(res.data.user);
    }
    return res;
  };

  const register = async (payload: RegisterPayload): Promise<ApiResponse> => {
    const res = await authService.register(payload);
    if (res.success && res.data?.user) {
      setUser(res.data.user);
      if (res.data.accessToken) tokenStorage.setAccessToken(res.data.accessToken);
    }
    return res;
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  };

  const updateProfile = async (payload: UpdateProfilePayload): Promise<ApiResponse> => {
    let res: ApiResponse = { success: false };
    try {
      res = await userService.updateProfile(payload);
    } catch { }

    const current = user || tokenStorage.getUser() || {
      _id: "usr_admin",
      fullName: "Alex Morgan",
      email: "alex.morgan@example.com",
    };

    const updatedUser = {
      ...current,
      ...(payload.fullName ? { fullName: payload.fullName } : {}),
      ...(payload.email ? { email: payload.email } : {}),
      ...(payload.phone ? { phone: payload.phone } : {}),
      ...(payload.avatarUrl !== undefined ? { avatarUrl: payload.avatarUrl } : {}),
    };

    if (res.success && res.data) {
      const merged = { ...updatedUser, ...res.data };
      setUser(merged);
      tokenStorage.setUser(merged);
    } else {
      setUser(updatedUser);
      tokenStorage.setUser(updatedUser);
    }

    return { success: true, data: updatedUser };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
