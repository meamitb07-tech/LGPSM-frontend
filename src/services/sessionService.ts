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

export function parseCustomDateTime(str?: any): Date {
  if (!str) return new Date();
  if (str instanceof Date) return isNaN(str.getTime()) ? new Date() : str;
  if (typeof str !== "string") return new Date();

  const trimmed = str.trim();
  // Try standard JS Date parsing first
  let d = new Date(trimmed);
  if (!isNaN(d.getTime())) return d;

  // Try parsing "DD/MM/YY HH.MM AM" or "DD/MM/YYYY HH:MM PM" format
  const match = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})(?:\s+(\d{1,2})[:.](\d{1,2})(?:[:.](\d{1,2}))?\s*(AM|PM)?)?/i);
  if (match) {
    let day = parseInt(match[1], 10);
    let month = parseInt(match[2], 10) - 1; // 0-indexed
    let year = parseInt(match[3], 10);
    if (year < 100) year += 2000;

    let hours = match[4] ? parseInt(match[4], 10) : 0;
    let minutes = match[5] ? parseInt(match[5], 10) : 0;
    let seconds = match[6] ? parseInt(match[6], 10) : 0;
    const ampm = match[7] ? match[7].toUpperCase() : null;

    if (ampm === "PM" && hours < 12) hours += 12;
    if (ampm === "AM" && hours === 12) hours = 0;

    d = new Date(year, month, day, hours, minutes, seconds);
    if (!isNaN(d.getTime())) return d;
  }

  // Fallback to current date
  return new Date();
}

function formatSessionPayload(payload: any) {
  const startDateObj = payload.schedule?.start
    ? (typeof payload.schedule.start === "string" ? parseCustomDateTime(payload.schedule.start) : payload.schedule.start)
    : parseCustomDateTime(payload.startTime);

  const startISO = startDateObj.toISOString();

  let endDateObj = payload.schedule?.end
    ? (typeof payload.schedule.end === "string" ? parseCustomDateTime(payload.schedule.end) : payload.schedule.end)
    : (payload.endTime ? parseCustomDateTime(payload.endTime) : new Date(startDateObj.getTime() + 4 * 3600 * 1000));

  if (isNaN(endDateObj.getTime()) || endDateObj <= startDateObj) {
    endDateObj = new Date(startDateObj.getTime() + 4 * 3600 * 1000);
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
