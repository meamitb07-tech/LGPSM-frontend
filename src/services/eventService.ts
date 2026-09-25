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

  const rawAddress = typeof payload.location === "string"
    ? payload.location
    : (payload.location?.address || payload.venue || "");
  const address = typeof rawAddress === "string" ? rawAddress.trim() : "";

  return {
    title,
    description: payload.description || title,
    format: "PHYSICAL",
    schedule: {
      start: startISO,
      end: endISO,
    },
    // Only send a venue the user actually entered
    ...(address ? { location: { address } } : {}),
  };
}

// Strict parse for user-entered dates: ISO strings or the picker format "DD/MM/YY hh.mm AM".
// Returns null instead of silently substituting "now".
function parseUserDate(value: unknown): Date | null {
  if (!value) return null;
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value;
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (/^\d{1,2}\/\d{1,2}\/\d{2,4}/.test(trimmed)) {
    const parsed = parseCustomDateTime(trimmed);
    return isNaN(parsed.getTime()) ? null : parsed;
  }
  const direct = new Date(trimmed);
  return isNaN(direct.getTime()) ? null : direct;
}

function formatUpdatePayload(payload: any) {
  const body: any = {};
  if (payload.title || payload.eventName) body.title = payload.title || payload.eventName;
  if (payload.description) body.description = payload.description;

  const start = parseUserDate(payload.startDate || payload.schedule?.start);
  const end = parseUserDate(payload.endDate || payload.schedule?.end);
  if (start && end && end > start) {
    body.schedule = {
      start: start.toISOString(),
      end: end.toISOString(),
    };
  }

  // An edited venue (string) takes precedence over the stored location object
  const address = typeof payload.venue === "string"
    ? payload.venue.trim()
    : typeof payload.location === "string"
      ? payload.location.trim()
      : payload.location?.address;
  if (address) {
    body.location = { address };
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
  async getEvents(params?: { page?: number; limit?: number; organizerId?: string }): Promise<ApiResponse<EventsListData>> {
    // Backend defaults to 10 per page; callers here render full lists/dropdowns
    const effectiveParams = { limit: 100, ...(params || {}) };
    const queryString = effectiveParams
      ? `?${new URLSearchParams(
          Object.fromEntries(
            Object.entries(effectiveParams)
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
