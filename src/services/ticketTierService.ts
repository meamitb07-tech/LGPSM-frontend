import { apiClient, ApiResponse } from "./apiClient";

export interface TicketTier {
  _id: string;
  eventId: string;
  name: string;
  price: number;
  currency: string;
  capacity: number;
  sold: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const ticketTierService = {
  async getTicketTiers(eventId: string, activeOnly: boolean = true): Promise<ApiResponse<TicketTier[]>> {
    // Event-scoped routes sit behind authentication on the backend, so send the token
    return apiClient<TicketTier[]>(`/api/v1/events/${eventId}/tickets?activeOnly=${activeOnly}`, { method: "GET" }, true);
  },

  async createTicketTier(
    eventId: string,
    payload: { name: string; price: number; capacity: number; currency?: string }
  ): Promise<ApiResponse<TicketTier>> {
    return apiClient<TicketTier>(
      `/api/v1/events/${eventId}/tickets`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      true
    );
  },

  async updateTicketTier(
    id: string,
    payload: { name?: string; price?: number; capacity?: number; currency?: string; isActive?: boolean }
  ): Promise<ApiResponse<TicketTier>> {
    return apiClient<TicketTier>(
      `/api/v1/tickets/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      },
      true
    );
  },

  async deleteTicketTier(id: string): Promise<ApiResponse<TicketTier>> {
    return apiClient<TicketTier>(
      `/api/v1/tickets/${id}`,
      {
        method: "DELETE",
      },
      true
    );
  },
};
