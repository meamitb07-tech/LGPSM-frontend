import { apiClient, ApiResponse } from "./apiClient";

export interface NotificationItem {
  _id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  entityType?: string;
  entityId?: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationListMeta {
  total: number;
  unreadCount: number;
  page: number;
  totalPages: number;
}

const CHANGED_EVENT = "lgpsm-notifications-changed";

// Lets other UI (e.g. the sidebar unread badge) refresh after notifications change
export function notifyNotificationsChanged() {
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent(CHANGED_EVENT));
}

export function onNotificationsChanged(listener: () => void): () => void {
  window.addEventListener(CHANGED_EVENT, listener);
  return () => window.removeEventListener(CHANGED_EVENT, listener);
}

export const notificationService = {
  async getUserNotifications(
    unreadOnly: boolean = false,
    page: number = 1,
    limit: number = 20
  ): Promise<ApiResponse<NotificationItem[]> & { meta?: NotificationListMeta }> {
    return apiClient<NotificationItem[]>(
      `/api/v1/notifications?unreadOnly=${unreadOnly}&page=${page}&limit=${limit}`,
      { method: "GET" },
      true
    );
  },

  async markAsRead(id: string): Promise<ApiResponse<NotificationItem>> {
    return apiClient<NotificationItem>(
      `/api/v1/notifications/${id}/read`,
      { method: "PATCH" },
      true
    );
  },

  async markAllAsRead(): Promise<ApiResponse<{ message: string }>> {
    return apiClient<{ message: string }>(
      "/api/v1/notifications/read-all",
      { method: "PATCH" },
      true
    );
  },

  async deleteNotification(id: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient<{ message: string }>(
      `/api/v1/notifications/${id}`,
      { method: "DELETE" },
      true
    );
  },

  async clearAllNotifications(): Promise<ApiResponse<{ message: string }>> {
    return apiClient<{ message: string }>(
      "/api/v1/notifications/clear-all",
      { method: "DELETE" },
      true
    );
  },
};
