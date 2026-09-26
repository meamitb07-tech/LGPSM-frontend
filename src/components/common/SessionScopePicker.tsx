"use client";

import React from "react";
import { SessionOption } from "@/hooks/useEventSessions";

interface SessionScopePickerProps {
  sessions: SessionOption[];
  loading?: boolean;
  error?: string | null;
  // null = every session of the event (sent to the backend as an empty list);
  // an array = only those sessions (an empty array is an incomplete choice the caller must block)
  value: string[] | null;
  onChange: (value: string[] | null) => void;
  label?: string;
}

// Explicit choice between "all sessions" and a specific subset for system-user assignments
export default function SessionScopePicker({
  sessions,
  loading = false,
  error,
  value,
  onChange,
  label = "Session access",
}: SessionScopePickerProps) {
  const mode = value === null ? "all" : "specific";
  const validSelected = (value || []).filter((id) => sessions.some((s) => s.id === id));

  return (
    <div className="space-y-1.5">
      <p className="text-xs font-semibold text-gray-800">{label}</p>
      {loading ? (
        <p className="text-xs text-gray-400">Loading sessions...</p>
      ) : error ? (
        <p className="text-xs text-rose-600 break-words">{error}</p>
      ) : (
        <div className="space-y-2 border border-gray-200 rounded-md p-3">
          <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
            <input
              type="radio"
              name="session-scope"
              checked={mode === "all"}
              onChange={() => onChange(null)}
              className="accent-[#FF5B22]"
            />
            <span>All sessions{sessions.length ? ` (${sessions.length})` : ""}</span>
          </label>
          <label className={`flex items-center gap-2 text-xs cursor-pointer ${sessions.length ? "text-gray-700" : "text-gray-300 cursor-not-allowed"}`}>
            <input
              type="radio"
              name="session-scope"
              disabled={sessions.length === 0}
              checked={mode === "specific"}
              onChange={() => onChange([])}
              className="accent-[#FF5B22]"
            />
            <span>Specific sessions only</span>
          </label>
          {mode === "specific" && (
            <div className="pl-5 space-y-2 max-h-40 overflow-y-auto">
              {sessions.map((s) => (
                <label key={s.id} className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer min-w-0">
                  <input
                    type="checkbox"
                    checked={validSelected.includes(s.id)}
                    onChange={(e) =>
                      onChange(e.target.checked ? [...validSelected, s.id] : validSelected.filter((id) => id !== s.id))
                    }
                    className="rounded border-gray-300 text-[#FF5B22] focus:ring-[#FF5B22] shrink-0"
                  />
                  <span className="truncate" title={s.name}>{s.name}</span>
                </label>
              ))}
              {validSelected.length === 0 && (
                <p className="text-[11px] text-amber-700">Select at least one session, or choose &quot;All sessions&quot;.</p>
              )}
            </div>
          )}
          {sessions.length === 0 && <p className="text-[11px] text-gray-400">This event has no sessions yet; staff can check guests in at the event entry.</p>}
        </div>
      )}
    </div>
  );
}
