import { apiClient, ApiResponse } from "./apiClient";

export interface SessionData {
  _id?: string;
  id?: string;
  eventId: string;
  name: string;
  description?: string;
  speaker?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  maxAttendees?: number;
  accessControl?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSessionPayload {
  name: string;
  description?: string;
  speaker?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  maxAttendees?: number;
  accessControl?: string;
}

export const sessionService = {
  /**
   * Create a session for an event
   * POST /api/v1/events/:eventId/sessions
   */
  async createSession(eventId: string, payload: CreateSessionPayload): Promise<ApiResponse<SessionData>> {
    return apiClient<SessionData>(`/api/v1/events/${eventId}/sessions`, {
      method: "POST",
      body: JSON.stringify(payload),
    }, true);
  },

  /**
   * List sessions for an event
   * GET /api/v1/events/:eventId/sessions
   */
  async getSessions(eventId: string): Promise<ApiResponse<SessionData[]>> {
    return apiClient<SessionData[]>(`/api/v1/events/${eventId}/sessions`, {
      method: "GET",
    }, true);
  },

  /**
   * Get session by ID
   * GET /api/v1/sessions/:sessionId
   */
  async getSession(sessionId: string): Promise<ApiResponse<SessionData>> {
    return apiClient<SessionData>(`/api/v1/sessions/${sessionId}`, {
      method: "GET",
    }, true);
  },

  /**
   * Update session
   * PATCH /api/v1/sessions/:sessionId
   */
  async updateSession(sessionId: string, payload: Partial<CreateSessionPayload>): Promise<ApiResponse<SessionData>> {
    return apiClient<SessionData>(`/api/v1/sessions/${sessionId}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }, true);
  },

  /**
   * Delete / deactivate session
   * DELETE /api/v1/sessions/:sessionId
   */
  async deleteSession(sessionId: string): Promise<ApiResponse> {
    return apiClient(`/api/v1/sessions/${sessionId}`, {
      method: "DELETE",
    }, true);
  },
};
