import { apiClient, ApiResponse } from "./apiClient";
import { UserData, tokenStorage } from "./tokenStorage";

export interface UpdateProfilePayload {
  fullName?: string;
  phone?: string;
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
};
