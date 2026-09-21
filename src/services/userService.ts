import { apiClient, ApiResponse } from "./apiClient";
import { UserData, tokenStorage } from "./tokenStorage";

export interface UpdateProfilePayload {
  fullName?: string;
  email?: string;
  phone?: string;
  avatarUrl?: string | null;
}

export const userService = {
  async getProfile(): Promise<ApiResponse<UserData>> {
    const response = await apiClient<UserData>("/api/users/profile", { method: "GET" }, true);
    if (response.success && response.data) {
      tokenStorage.setUser(response.data);
    }
    return response;
  },

  async updateProfile(payload: UpdateProfilePayload): Promise<ApiResponse<UserData>> {
    const response = await apiClient<UserData>(
      "/api/users/profile",
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      },
      true
    );

    if (response.success && response.data) {
      tokenStorage.setUser(response.data);
    }
    return response;
  },

  /**
   * Create sub-user (ADMIN / ORGANIZER requirement)
   * POST /api/users/
   */
  async createUser(payload: {
    fullName: string;
    email: string;
    password?: string;
    role?: "ADMIN" | "ORGANIZER" | "SYSTEM_USER";
    phone?: string;
  }): Promise<ApiResponse<UserData>> {
    return apiClient<UserData>(
      "/api/users/",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      true
    );
  },

  async getUsers(): Promise<ApiResponse<UserData[]>> {
    return apiClient<UserData[]>("/api/users/", { method: "GET" }, true);
  },
};
