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

function formatSessionPayload(payload: any) {
  const startISO = payload.schedule?.start || (payload.startTime ? new Date(payload.startTime).toISOString() : new Date().toISOString());
  let endDateObj = payload.schedule?.end || (payload.endTime ? new Date(payload.endTime) : new Date(Date.now() + 4 * 3600 * 1000));
  if (typeof endDateObj === "string") endDateObj = new Date(endDateObj);
  if (isNaN(endDateObj.getTime()) || endDateObj <= new Date(startISO)) {
    endDateObj = new Date(new Date(startISO).getTime() + 4 * 3600 * 1000);
  }
  const endISO = endDateObj.toISOString();

  let accessControlVal = "NO_RESTRICTION";
  if (payload.accessControl) {
    const raw = String(payload.accessControl).toUpperCase().replace(/\s+/g, "_");
    if (raw === "ONLY_ONCE") accessControlVal = "ONLY_ONCE";
  }

  return {
    name: payload.name,
    schedule: {
      start: startISO,
      end: endISO,
    },
    accessControl: accessControlVal,
    validateAgainstOtherSessions: false,
    inviteeSource: "NEW_LIST",
  };
}

export const sessionService = {
  /**
   * Create a session for an event
   * POST /api/v1/events/:eventId/sessions
   */
  async createSession(eventId: string, payload: CreateSessionPayload): Promise<ApiResponse<SessionData>> {
    const formatted = formatSessionPayload(payload);
    return apiClient<SessionData>(`/api/v1/events/${eventId}/sessions`, {
      method: "POST",
      body: JSON.stringify(formatted),
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
