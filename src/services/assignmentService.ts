import { apiClient, ApiResponse } from "./apiClient";

export interface AssignmentData {
  _id?: string;
  id?: string;
  eventId: string;
  systemUserId: string | { _id: string; fullName: string; email: string };
  sessionIds: string[] | { _id: string; name: string }[];
  assignedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAssignmentPayload {
  userId?: string;
  systemUserId?: string;
  sessionIds: string[];
}

export const assignmentService = {
  /**
   * Create assignment (Assign sessions to a system user)
   * POST /api/v1/events/:eventId/assignments
   */
  async createAssignment(
    eventId: string,
    payload: CreateAssignmentPayload
  ): Promise<ApiResponse<AssignmentData>> {
    const userId = payload.userId || payload.systemUserId || "";
    return apiClient<AssignmentData>(`/api/v1/events/${eventId}/assignments`, {
      method: "POST",
      body: JSON.stringify({ userId, sessionIds: payload.sessionIds }),
    }, true);
  },

  /**
   * List assignments for event
   * GET /api/v1/events/:eventId/assignments
   */
  async getEventAssignments(eventId: string): Promise<ApiResponse<AssignmentData[]>> {
    return apiClient<AssignmentData[]>(`/api/v1/events/${eventId}/assignments`, {
      method: "GET",
    }, true);
  },

  /**
   * Update assignment
   * PATCH /api/v1/assignments/:assignmentId
   */
  async updateAssignment(
    assignmentId: string,
    payload: Partial<CreateAssignmentPayload>
  ): Promise<ApiResponse<AssignmentData>> {
    return apiClient<AssignmentData>(`/api/v1/assignments/${assignmentId}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }, true);
  },

  /**
   * Delete assignment
   * DELETE /api/v1/assignments/:assignmentId
   */
  async deleteAssignment(assignmentId: string): Promise<ApiResponse> {
    return apiClient(`/api/v1/assignments/${assignmentId}`, {
      method: "DELETE",
    }, true);
  },

  /**
   * Get assignments for currently logged-in SYSTEM_USER
   * GET /api/v1/users/me/assignments
   */
  async getMyAssignments(): Promise<ApiResponse<AssignmentData[]>> {
    return apiClient<AssignmentData[]>("/api/v1/users/me/assignments", {
      method: "GET",
    }, true);
  },
};
