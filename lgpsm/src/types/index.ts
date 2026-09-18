// ── Shared TypeScript Types ────────────────────────────────────────────────

// ── Auth ──────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  avatar?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

// ── Events ────────────────────────────────────────────────────────────────
export interface Event {
  id: string;
  title: string;
  description?: string;
  date?: string;
  time?: string;
  location?: string;
  createdAt?: string;
}

// ── Invitees ──────────────────────────────────────────────────────────────
export interface Invitee {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status?: "pending" | "accepted" | "declined";
}

// ── API ───────────────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  limit: number;
}
