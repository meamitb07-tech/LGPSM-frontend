import { apiClient, ApiResponse } from "./apiClient";

export interface SendInvitationsPayload {
  inviteeIds: string[];
  channel?: "EMAIL" | "SMS" | "WHATSAPP";
}

export interface ResendInvitationsPayload {
  invitationIds: string[];
}

export interface InvitationData {
  _id?: string;
  id?: string;
  eventId: string;
  inviteeId: string | { _id: string; name: string; email?: string; mobile?: string };
  channel: string;
  status: "SENT" | "PENDING" | "FAILED";
  sentAt?: string;
  token?: string;
  createdAt?: string;
}

export interface RsvpPayload {
  rsvpStatus: "ACCEPTED" | "DECLINED";
  dietaryPreference?: string;
}

export const invitationService = {
  /**
   * Send invitations to selected invitees
   * POST /api/v1/events/:eventId/invitations/send
   */
  async sendInvitations(
    eventId: string,
    payload: SendInvitationsPayload
  ): Promise<ApiResponse<{ sentCount?: number; details?: any }>> {
    return apiClient<{ sentCount?: number; details?: any }>(
      `/api/v1/events/${eventId}/invitations/send`,
      {
        method: "POST",
        body: JSON.stringify({
          channel: "EMAIL",
          ...payload,
        }),
      },
      true
    );
  },

  /**
   * Resend invitations
   * POST /api/v1/events/:eventId/invitations/resend
   */
  async resendInvitations(
    eventId: string,
    payload: ResendInvitationsPayload
  ): Promise<ApiResponse<{ resentCount?: number }>> {
    return apiClient<{ resentCount?: number }>(
      `/api/v1/events/${eventId}/invitations/resend`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      true
    );
  },

  /**
   * Get invitation history for an event
   * GET /api/v1/events/:eventId/invitations
   */
  async getInvitations(eventId: string): Promise<ApiResponse<InvitationData[]>> {
    return apiClient<InvitationData[]>(`/api/v1/events/${eventId}/invitations`, {
      method: "GET",
    }, true);
  },

  /**
   * Get public invitation by token (Unauthenticated)
   * GET /api/v1/public/invitations/:token
   */
  async getPublicInvitation(token: string): Promise<ApiResponse<InvitationData>> {
    return apiClient<InvitationData>(`/api/v1/public/invitations/${token}`, {
      method: "GET",
    }, false);
  },

  /**
   * Submit RSVP for public invitation token (Unauthenticated)
   * POST /api/v1/public/invitations/:token/rsvp
   */
  async submitRsvp(token: string, payload: RsvpPayload): Promise<ApiResponse> {
    return apiClient(`/api/v1/public/invitations/${token}/rsvp`, {
      method: "POST",
      body: JSON.stringify(payload),
    }, false);
  },
};
