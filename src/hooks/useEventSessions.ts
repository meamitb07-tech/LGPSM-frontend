"use client";

import { useEffect, useState } from "react";
import { sessionService } from "@/services/sessionService";

export interface SessionOption {
  id: string;
  name: string;
}

// Loads the sessions of one event. Responses for a previously selected event are ignored,
// so switching events quickly can never show (or submit) another event's sessions.
export function useEventSessions(eventId: string | null | undefined) {
  const [state, setState] = useState<{ eventId: string; sessions: SessionOption[]; error: string | null } | null>(null);

  useEffect(() => {
    if (!eventId) return;
    let cancelled = false;
    sessionService.getSessions(eventId).then((res) => {
      if (cancelled) return;
      const sessions = res.success && Array.isArray(res.data)
        ? res.data.map((s, idx) => ({ id: String(s._id || s.id), name: s.name || `Session ${idx + 1}` }))
        : [];
      setState({ eventId, sessions, error: res.success ? null : res.message || "Failed to load sessions." });
    });
    return () => {
      cancelled = true;
    };
  }, [eventId]);

  const current = state && state.eventId === eventId ? state : null;
  return {
    sessions: current?.sessions ?? [],
    loading: !!eventId && !current,
    error: current?.error ?? null,
  };
}
