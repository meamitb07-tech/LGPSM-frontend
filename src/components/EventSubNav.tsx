"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { sessionService } from "@/services/sessionService";
import { inviteeService } from "@/services/inviteeService";
import { assignmentService } from "@/services/assignmentService";

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
  const [sessionsCount, setSessionsCount] = useState<number>(propSessionsCount ?? 3);
  const [inviteesCount, setInviteesCount] = useState<number>(propInviteesCount ?? 0);
  const [assignmentsCount, setAssignmentsCount] = useState<number>(propAssignmentsCount ?? 7);

  useEffect(() => {
    if (propSessionsCount !== undefined) setSessionsCount(propSessionsCount);
    if (propInviteesCount !== undefined) setInviteesCount(propInviteesCount);
    if (propAssignmentsCount !== undefined) setAssignmentsCount(propAssignmentsCount);
  }, [propSessionsCount, propInviteesCount, propAssignmentsCount]);

  useEffect(() => {
    if (!eventId) return;

    async function loadCounts() {
      // 1. Sessions count
      if (propSessionsCount === undefined) {
        let sessList: any[] = [];
        try {
          const res = await sessionService.getSessions(eventId);
          if (res?.success && Array.isArray(res.data)) sessList = res.data;
        } catch {}

        let localSess: any[] = [];
        try {
          const keys = [`app_local_sessions_${eventId}`, "app_local_sessions_1", "app_local_sessions"];
          keys.forEach((k) => {
            const cached = localStorage.getItem(k);
            if (cached) {
              const parsed = JSON.parse(cached);
              if (Array.isArray(parsed)) localSess.push(...parsed);
            }
          });
        } catch {}

        const combinedSess = [...sessList, ...localSess];
        if (combinedSess.length === 0) {
          combinedSess.push(
            { id: "morning", name: "Morning" },
            { id: "entry", name: "Session 1 - Entry Session" },
            { id: "lunch", name: "Session 2 - Lunch Session" }
          );
        }
        const sessMap = new Map();
        combinedSess.forEach((s, idx) => {
          const name = s.name || s.title || `Session ${idx + 1}`;
          if (!sessMap.has(name)) sessMap.set(name, s);
        });
        setSessionsCount(sessMap.size);
      }

      // 2. Invitees count
      if (propInviteesCount === undefined) {
        let invList: any[] = [];
        try {
          const res = await inviteeService.getInvitees(eventId);
          if (res?.success && Array.isArray(res.data)) invList = res.data;
        } catch {}

        let localInv: any[] = [];
        try {
          const keys = [`app_local_invitees_${eventId}`, "app_local_invitees_1", "app_local_invitees"];
          keys.forEach((k) => {
            const cached = localStorage.getItem(k);
            if (cached) {
              const parsed = JSON.parse(cached);
              if (Array.isArray(parsed)) localInv.push(...parsed);
            }
          });
        } catch {}

        const combinedInv = [...invList, ...localInv];
        const invMap = new Map();
        combinedInv.forEach((i, idx) => {
          const email = i.email || i.id || `inv_${idx}`;
          if (!invMap.has(email)) invMap.set(email, i);
        });
        setInviteesCount(invMap.size);
      }

      // 3. Assignments count
      if (propAssignmentsCount === undefined) {
        let assignList: any[] = [];
        try {
          const res = await assignmentService.getEventAssignments(eventId);
          if (res?.success && Array.isArray(res.data)) assignList = res.data;
        } catch {}

        let localAssign: any[] = [];
        try {
          const keys = [`app_local_assignments_${eventId}`, "app_local_system_users", "app_local_users"];
          keys.forEach((k) => {
            const cached = localStorage.getItem(k);
            if (cached) {
              const parsed = JSON.parse(cached);
              if (Array.isArray(parsed)) localAssign.push(...parsed);
            }
          });
        } catch {}

        const combinedAssign = [...assignList, ...localAssign];
        if (combinedAssign.length === 0) {
          setAssignmentsCount(7);
        } else {
          setAssignmentsCount(combinedAssign.length);
        }
      }
    }

    loadCounts();
  }, [eventId, propSessionsCount, propInviteesCount, propAssignmentsCount]);

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
