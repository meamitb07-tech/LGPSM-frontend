import { apiClient, ApiResponse } from "./apiClient";
import { parseCustomDateTime } from "./sessionService";

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
  _id?: string;
  title: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  schedule?: {
    start: string;
    end: string;
  };
  rsvpDeadline?: string;
  location?: string | { address?: string };
  venueDetails?: string;
  maxAttendees?: number;
  isPublic?: boolean;
  status?: "draft" | "published" | "cancelled" | "completed" | "DRAFT" | "PUBLISHED" | "CANCELLED" | "COMPLETED";
  operationalDataCleared?: boolean;
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
function formatEventPayload(payload: any) {
  const title = payload.title || payload.eventName || "Untitled Event";
  
  const startInput = payload.startDate || payload.schedule?.start;
  const startDateObj = startInput ? parseCustomDateTime(startInput) : new Date();
  const startISO = startDateObj.toISOString();

  const endInput = payload.endDate || payload.schedule?.end;
  let endDateObj = endInput ? parseCustomDateTime(endInput) : new Date(startDateObj.getTime() + 8 * 3600 * 1000);

  if (isNaN(endDateObj.getTime()) || endDateObj <= startDateObj) {
    endDateObj = new Date(startDateObj.getTime() + 8 * 3600 * 1000);
  }
  const endISO = endDateObj.toISOString();

  const address = typeof payload.location === "string"
    ? payload.location
    : (payload.location?.address || payload.venue || "Grand Ballroom, Tech City");

  return {
    title,
    description: payload.description || "Event Description",
    format: "PHYSICAL",
    schedule: {
      start: startISO,
      end: endISO,
    },
    location: {
      address,
    },
  };
}

function formatUpdatePayload(payload: any) {
  const body: any = {};
  if (payload.title || payload.eventName) body.title = payload.title || payload.eventName;
  if (payload.description) body.description = payload.description;

  if (payload.startDate || payload.endDate || payload.schedule) {
    const startVal = payload.startDate || payload.schedule?.start || new Date().toISOString();
    const endVal = payload.endDate || payload.schedule?.end || new Date(Date.now() + 8 * 3600 * 1000).toISOString();

    let startISO = new Date(startVal).toISOString();
    let endISO = new Date(endVal).toISOString();
    if (isNaN(new Date(startISO).getTime())) startISO = new Date().toISOString();
    if (isNaN(new Date(endISO).getTime())) endISO = new Date(Date.now() + 8 * 3600 * 1000).toISOString();

    if (new Date(endISO) <= new Date(startISO)) {
      endISO = new Date(new Date(startISO).getTime() + 8 * 3600 * 1000).toISOString();
    }

    body.schedule = {
      start: startISO,
      end: endISO,
    };
  }

  if (payload.location || payload.venue) {
    const address = typeof payload.location === "string"
      ? payload.location
      : (payload.location?.address || payload.venue);
    if (address) {
      body.location = { address };
    }
  }

  if (payload.status) {
    const st = payload.status.toUpperCase();
    if (st === "DRAFT" || st === "PUBLISHED" || st === "CANCELLED" || st === "COMPLETED") {
      body.status = st;
    }
  }

  return body;
}

export const eventService = {
  /**
   * Create a new event
   * POST /api/v1/events
   */
  async createEvent(payload: EventPayload): Promise<ApiResponse<EventData>> {
    const formatted = formatEventPayload(payload);
    return apiClient<EventData>("/api/v1/events", {
      method: "POST",
      body: JSON.stringify(formatted),
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
    const formatted = formatUpdatePayload(payload);
    return apiClient<EventData>(`/api/v1/events/${eventId}`, {
      method: "PATCH",
      body: JSON.stringify(formatted),
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
   * Perform operational data cleanup for a completed event (ADMIN ONLY)
   * POST /api/v1/events/:eventId/cleanup
   */
  async cleanupEventData(eventId: string): Promise<ApiResponse<EventData>> {
    return apiClient<EventData>(`/api/v1/events/${eventId}/cleanup`, {
      method: "POST",
    }, true);
  },

  /**
   * Get presigned URL for media upload
   * POST /api/v1/media/presign
   */
  async presignMedia(payload: PresignPayload): Promise<ApiResponse<PresignData>> {
    return apiClient<PresignData>("/api/v1/media/presign", {
      method: "POST",
      body: JSON.stringify(payload),
    }, true);
  },
};
