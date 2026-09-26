"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { sessionService } from "@/services/sessionService";
import { inviteeService } from "@/services/inviteeService";
import { assignmentService } from "@/services/assignmentService";

export function notifyDbUpdate() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("lgpsm-db-update"));
  }
}

interface EventSubNavProps {
  eventId: string;
  activeTab: "overview" | "sessions" | "invitees" | "assign-users";
  sessionsCount?: number;
  inviteesCount?: number;
  assignmentsCount?: number;
}

export default function EventSubNav({
  eventId,
  activeTab,
  sessionsCount: propSessionsCount,
  inviteesCount: propInviteesCount,
  assignmentsCount: propAssignmentsCount,
}: EventSubNavProps) {
  const [sessionsCount, setSessionsCount] = useState<number>(propSessionsCount ?? 0);
  const [inviteesCount, setInviteesCount] = useState<number>(propInviteesCount ?? 0);
  const [assignmentsCount, setAssignmentsCount] = useState<number>(propAssignmentsCount ?? 0);

  // Fallback counts live in a ref so parent re-renders do not trigger another round of requests
  const fallbackCounts = useRef({ propSessionsCount, propInviteesCount, propAssignmentsCount });
  useEffect(() => {
    fallbackCounts.current = { propSessionsCount, propInviteesCount, propAssignmentsCount };
  }, [propSessionsCount, propInviteesCount, propAssignmentsCount]);

  const fetchUnifiedCounts = useCallback(async () => {
    const { propSessionsCount, propInviteesCount, propAssignmentsCount } = fallbackCounts.current;
    if (!eventId || eventId === "1" || eventId === "select") return;

    try {
      const [sessRes, invRes, assignRes] = await Promise.all([
        sessionService.getSessions(eventId),
        inviteeService.getInvitees(eventId),
        assignmentService.getEventAssignments(eventId),
      ]);

      if (sessRes?.success) {
        const sCount = (sessRes as any).meta?.total ?? (Array.isArray(sessRes.data) ? sessRes.data.length : 0);
        setSessionsCount(sCount);
      } else if (propSessionsCount !== undefined) {
        setSessionsCount(propSessionsCount);
      }

      if (invRes?.success) {
        const iCount = (invRes as any).meta?.total ?? (Array.isArray(invRes.data) ? invRes.data.length : 0);
        setInviteesCount(iCount);
      } else if (propInviteesCount !== undefined) {
        setInviteesCount(propInviteesCount);
      }

      if (assignRes?.success) {
        const aCount = Array.isArray(assignRes.data) ? assignRes.data.length : 0;
        setAssignmentsCount(aCount);
      } else if (propAssignmentsCount !== undefined) {
        setAssignmentsCount(propAssignmentsCount);
      }
    } catch (err) {
      console.error("Error loading subnav counts from database:", err);
    }
  }, [eventId]);

  useEffect(() => {
    fetchUnifiedCounts();

    const handleUpdate = () => {
      fetchUnifiedCounts();
    };

    window.addEventListener("lgpsm-db-update", handleUpdate);
    window.addEventListener("focus", handleUpdate);

    return () => {
      window.removeEventListener("lgpsm-db-update", handleUpdate);
      window.removeEventListener("focus", handleUpdate);
    };
  }, [fetchUnifiedCounts]);

  const formatCount = (count: number) => count.toString().padStart(2, "0");

  return (
    <div className="flex items-center gap-2 border-b border-gray-200 pb-1 text-xs font-semibold overflow-x-auto">
      <Link
        href={`/events/${eventId}`}
        className={`px-4 py-2 border-b-2 transition-colors shrink-0 flex items-center gap-2 ${
          activeTab === "overview"
            ? "text-[#FF5B22] border-[#FF5B22] font-bold"
            : "text-gray-500 hover:text-gray-900 border-transparent"
        }`}
      >
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Overview</span>
      </Link>

      <Link
        href={`/events/${eventId}/sessions`}
        className={`px-4 py-2 border-b-2 transition-colors shrink-0 flex items-center gap-2 ${
          activeTab === "sessions"
            ? "text-[#FF5B22] border-[#FF5B22] font-bold"
            : "text-gray-500 hover:text-gray-900 border-transparent"
        }`}
      >
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Sessions ({formatCount(sessionsCount)})</span>
      </Link>

      <Link
        href={`/events/${eventId}/invitees`}
        className={`px-4 py-2 border-b-2 transition-colors shrink-0 flex items-center gap-2 ${
          activeTab === "invitees"
            ? "text-[#FF5B22] border-[#FF5B22] font-bold"
            : "text-gray-500 hover:text-gray-900 border-transparent"
        }`}
      >
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <span>Invitees List ({formatCount(inviteesCount)})</span>
      </Link>

      <Link
        href={`/events/${eventId}/assign-users`}
        className={`px-4 py-2 border-b-2 transition-colors shrink-0 flex items-center gap-2 ${
          activeTab === "assign-users"
            ? "text-[#FF5B22] border-[#FF5B22] font-bold"
            : "text-gray-500 hover:text-gray-900 border-transparent"
        }`}
      >
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <span>Assign System Users ({formatCount(assignmentsCount)})</span>
      </Link>
    </div>
  );
}
