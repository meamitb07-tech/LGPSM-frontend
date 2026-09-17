import { apiClient, ApiResponse } from "./apiClient";

// ─────────────────────────────────────────────
// Event API Types
// ─────────────────────────────────────────────

export interface EventPayload {
  title: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  rsvpDeadline?: string;
  location?: string;
  venueDetails?: string;
  maxAttendees?: number;
  isPublic?: boolean;
  templateId?: string;
  sessions?: SessionPayload[];
  settings?: EventSettings;
}

export interface SessionPayload {
  name: string;
  startTime?: string;
  endTime?: string;
  maxAttendees?: number;
  accessType?: "single" | "multiple";
}

export interface EventSettings {
  allowWalkIns?: boolean;
  requireApproval?: boolean;
  sendReminders?: boolean;
}

export interface EventData {
  id: string;
  title: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  rsvpDeadline?: string;
  location?: string;
  venueDetails?: string;
  maxAttendees?: number;
  isPublic?: boolean;
  status?: "draft" | "published" | "cancelled";
  organizerId?: string;
  sessions?: SessionPayload[];
  settings?: EventSettings;
  createdAt?: string;
  updatedAt?: string;
}

export interface EventsListData {
  events: EventData[];
  total?: number;
  page?: number;
  limit?: number;
}

// ─────────────────────────────────────────────
// Media Presign Types (S3 — isolated until configured)
// ─────────────────────────────────────────────

export interface PresignPayload {
  fileName: string;
  fileType: string;
  folder?: string;
}

export interface PresignData {
  uploadUrl: string;
  fileKey: string;
  publicUrl?: string;
}

// ─────────────────────────────────────────────
// Event Service
// ─────────────────────────────────────────────

export const eventService = {
  /**
   * Create a new event
   * POST /api/v1/events
   */
  async createEvent(payload: EventPayload): Promise<ApiResponse<EventData>> {
    return apiClient<EventData>("/api/v1/events", {
      method: "POST",
      body: JSON.stringify(payload),
    }, true);
  },

  /**
   * Get all events for the authenticated organizer
   * GET /api/v1/events
   */
  async getEvents(params?: { page?: number; limit?: number }): Promise<ApiResponse<EventsListData>> {
    const queryString = params
      ? `?${new URLSearchParams(
          Object.fromEntries(
            Object.entries(params)
              .filter(([, v]) => v !== undefined)
              .map(([k, v]) => [k, String(v)])
          )
        ).toString()}`
      : "";
    return apiClient<EventsListData>(`/api/v1/events${queryString}`, {
      method: "GET",
    }, true);
  },

  /**
   * Get a single event by ID
   * GET /api/v1/events/:eventId
   */
  async getEvent(eventId: string): Promise<ApiResponse<EventData>> {
    return apiClient<EventData>(`/api/v1/events/${eventId}`, {
      method: "GET",
    }, true);
  },

  /**
   * Update an existing event
   * PATCH /api/v1/events/:eventId
   */
  async updateEvent(eventId: string, payload: Partial<EventPayload>): Promise<ApiResponse<EventData>> {
    return apiClient<EventData>(`/api/v1/events/${eventId}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }, true);
  },

  /**
   * Delete an event
   * DELETE /api/v1/events/:eventId
   */
  async deleteEvent(eventId: string): Promise<ApiResponse> {
    return apiClient(`/api/v1/events/${eventId}`, {
      method: "DELETE",
    }, true);
  },

  /**
   * Get presigned URL for media upload
   * POST /api/v1/media/presign
   *
   * NOTE: S3 storage is not yet configured/testable.
   * This method is isolated and ready for integration
   * once S3 credentials are confirmed.
   */
  async presignMedia(payload: PresignPayload): Promise<ApiResponse<PresignData>> {
    return apiClient<PresignData>("/api/v1/media/presign", {
      method: "POST",
      body: JSON.stringify(payload),
    }, true);
  },
};
