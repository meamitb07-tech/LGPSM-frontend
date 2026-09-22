"use client";

import React, { useState, useEffect, useCallback } from "react";
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

  const fetchUnifiedCounts = useCallback(async () => {
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
  }, [eventId, propSessionsCount, propInviteesCount, propAssignmentsCount]);

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
        className={`px-4 py-2 border-b-2 transition-colors shrink-0 ${
          activeTab === "overview"
            ? "text-[#FF5B22] border-[#FF5B22] font-bold"
            : "text-gray-500 hover:text-gray-900 border-transparent"
        }`}
      >
        Overview
      </Link>

      <Link
        href={`/events/${eventId}/sessions`}
        className={`px-4 py-2 border-b-2 transition-colors shrink-0 ${
          activeTab === "sessions"
            ? "text-[#FF5B22] border-[#FF5B22] font-bold"
            : "text-gray-500 hover:text-gray-900 border-transparent"
        }`}
      >
        Sessions ({formatCount(sessionsCount)})
      </Link>

      <Link
        href={`/events/${eventId}/invitees`}
        className={`px-4 py-2 border-b-2 transition-colors shrink-0 ${
          activeTab === "invitees"
            ? "text-[#FF5B22] border-[#FF5B22] font-bold"
            : "text-gray-500 hover:text-gray-900 border-transparent"
        }`}
      >
        Invitees List ({formatCount(inviteesCount)})
      </Link>

      <Link
        href={`/events/${eventId}/assign-users`}
        className={`px-4 py-2 border-b-2 transition-colors shrink-0 ${
          activeTab === "assign-users"
            ? "text-[#FF5B22] border-[#FF5B22] font-bold"
            : "text-gray-500 hover:text-gray-900 border-transparent"
        }`}
      >
        Assign System Users ({formatCount(assignmentsCount)})
      </Link>
    </div>
  );
}
