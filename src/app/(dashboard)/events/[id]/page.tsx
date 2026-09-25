"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { eventService } from "@/services/eventService";
import { sessionService, parseCustomDateTime } from "@/services/sessionService";
import { inviteeService } from "@/services/inviteeService";
import { assignmentService } from "@/services/assignmentService";
import EventSubNav from "@/components/EventSubNav";
import UserNavDropdown from "@/components/common/UserNavDropdown";
import EventCleanupModal from "@/components/events/EventCleanupModal";
import { getDynamicEventStatus } from "@/utils/eventUtils";

function formatSessionDateTime(session: any, eventData?: any): string {
  if (!session) return "N/A";

  const rawStart = session.schedule?.start || session.schedule?.startTime || session.startTime || session.startDate || session.date;
  const rawEnd = session.schedule?.end || session.schedule?.endTime || session.endTime || session.endDate;

  if (rawStart) {
    const startDate = parseCustomDateTime(rawStart);
    if (!isNaN(startDate.getTime())) {
      const formattedDate = startDate.toLocaleDateString([], { month: "numeric", day: "numeric", year: "numeric" });
      const formattedTime = startDate.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true });

      if (rawEnd) {
        const endDate = parseCustomDateTime(rawEnd);
        if (!isNaN(endDate.getTime())) {
          const endTimeStr = endDate.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true });
          return `${formattedDate}, ${formattedTime} - ${endTimeStr}`;
        }
      }
      return `${formattedDate}, ${formattedTime}`;
    }
  }

  if (session.date || session.time) {
    return `${session.date || ""} ${session.time || ""}`.trim();
  }

  if (eventData?.startDate) {
    return eventData.startDate;
  }

  return "N/A";
}

function GuestLogsDonutChart({ invitees }: { invitees: any[] }) {
  const total = invitees.length;

  let accepted = 0;
  let pending = 0;
  let declined = 0;

  invitees.forEach((inv) => {
    const rsvp = (inv.rsvpStatus || "").toUpperCase();
    const reg = (inv.registrationStatus || "").toLowerCase();
    const invStat = (inv.invitationStatus || "").toUpperCase();

    if (rsvp === "ACCEPTED" || rsvp === "CONFIRMED" || reg === "confirmed") {
      accepted++;
    } else if (rsvp === "DECLINED" || invStat === "FAILED") {
      declined++;
    } else {
      pending++;
    }
  });

  const R = 36;
  const C = 2 * Math.PI * R;

  const pAccepted = total > 0 ? (accepted / total) * C : 0;
  const pPending = total > 0 ? (pending / total) * C : total === 0 ? C : 0;
  const pDeclined = total > 0 ? (declined / total) * C : 0;

  const offAccepted = 0;
  const offPending = pAccepted;
  const offDeclined = pAccepted + pPending;

  return (
    <div className="flex flex-col items-center justify-center space-y-3 py-2 w-full font-sans">
      <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={R}
            fill="transparent"
            stroke="#F3F4F6"
            strokeWidth="12"
          />

          {pAccepted > 0 && (
            <circle
              cx="50"
              cy="50"
              r={R}
              fill="transparent"
              stroke="#10B981"
              strokeWidth="12"
              strokeDasharray={`${pAccepted} ${C}`}
              strokeDashoffset={-offAccepted}
              className="transition-all duration-500"
            />
          )}

          {pPending > 0 && (
            <circle
              cx="50"
              cy="50"
              r={R}
              fill="transparent"
              stroke="#F59E0B"
              strokeWidth="12"
              strokeDasharray={`${pPending} ${C}`}
              strokeDashoffset={-offPending}
              className="transition-all duration-500"
            />
          )}

          {pDeclined > 0 && (
            <circle
              cx="50"
              cy="50"
              r={R}
              fill="transparent"
              stroke="#EF4444"
              strokeWidth="12"
              strokeDasharray={`${pDeclined} ${C}`}
              strokeDashoffset={-offDeclined}
              className="transition-all duration-500"
            />
          )}
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-lg font-bold text-gray-900 leading-none">{total}</span>
          <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider mt-0.5">
            {total === 1 ? "Guest" : "Guests"}
          </span>
        </div>
      </div>

      <div className="w-full pt-1 grid grid-cols-3 gap-1 text-center text-[10px] font-medium text-gray-600">
        <div className="flex items-center justify-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
          <span>Accepted ({accepted})</span>
        </div>
        <div className="flex items-center justify-center gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
          <span>Pending ({pending})</span>
        </div>
        <div className="flex items-center justify-center gap-1">
          <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
          <span>Declined ({declined})</span>
        </div>
      </div>
    </div>
  );
}

export default function EventDetailsDashboardPage() {
  const params = useParams();
  const eventId = (params?.id as string) || "1";
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [eventData, setEventData] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [invitees, setInvitees] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);

  const [eventStatus, setEventStatus] = useState<"Invitation not send" | "Upcoming" | "Ongoing" | "Completed">("Upcoming");
  const [selectedSessionFilter, setSelectedSessionFilter] = useState("Entry Session");

  // Cleanup Modal State
  const [isCleanupModalOpen, setIsCleanupModalOpen] = useState<boolean>(false);
  const [cleanupSuccessMessage, setCleanupSuccessMessage] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    let eventObj: any = null;
    let sessionsList: any[] = [];
    let inviteesList: any[] = [];
    let assignmentsList: any[] = [];

    try {
      const [eventRes, sessionsRes, inviteesRes, assignmentsRes] = await Promise.all([
        eventService.getEvent(eventId),
        sessionService.getSessions(eventId),
        inviteeService.getInvitees(eventId),
        assignmentService.getEventAssignments(eventId),
      ]);

      if (eventRes?.success && eventRes?.data) {
        const raw = (eventRes.data as any).event || eventRes.data;
        if (raw && (raw.title || raw.name || raw.eventName)) {
          const startVal = raw.schedule?.start || raw.startDate;
          const endVal = raw.schedule?.end || raw.endDate;
          const locVal = typeof raw.location === "string" ? raw.location : raw.location?.address;

          eventObj = {
            ...raw,
            title: raw.title || raw.name || raw.eventName,
            category: raw.category || raw.categoryId?.name || "Corporate",
            organizer: raw.organizerId?.fullName || raw.organizer || user?.fullName || "Organizer",
            organizerId: { fullName: raw.organizerId?.fullName || raw.organizer || user?.fullName || "Organizer" },
            startDate: startVal ? new Date(startVal).toLocaleString() : "TBD",
            endDate: endVal ? new Date(endVal).toLocaleString() : "TBD",
            status: raw.status || "Upcoming",
            venue: locVal || "Grand Ballroom, Tech City",
            operationalDataCleared: raw.operationalDataCleared ?? false,
          };
        }
      }
      if (sessionsRes?.success && Array.isArray(sessionsRes.data)) {
        sessionsList = sessionsRes.data;
      }
      if (inviteesRes?.success && Array.isArray(inviteesRes.data)) {
        inviteesList = inviteesRes.data;
      }
      if (assignmentsRes?.success && Array.isArray(assignmentsRes.data)) {
        assignmentsList = assignmentsRes.data;
      }
    } catch (error) {
      console.error("Failed to fetch event data:", error);
    }

    setEventData(eventObj);
    if (eventObj) {
      const computedStatus = getDynamicEventStatus(eventObj.startDate, eventObj.endDate, eventObj.status);
      setEventStatus(computedStatus as any);

      // Check if event is ended and ADMIN cleanup prompt should show
      if (user?.role === "ADMIN") {
        const now = new Date();
        const endRaw = eventObj.schedule?.end || eventObj.endDate;
        const endDate = endRaw ? new Date(endRaw) : null;
        const isEnded = (endDate && !isNaN(endDate.getTime()) && now > endDate) || computedStatus === "Completed" || eventObj.status === "COMPLETED";

        const isCleared = eventObj.operationalDataCleared === true;
        const isDismissed = sessionStorage.getItem(`dismiss_cleanup_${eventId}`) === "true";

        if (isEnded && !isCleared && !isDismissed) {
          setIsCleanupModalOpen(true);
        }
      }
    }

    setSessions(sessionsList);
    setInvitees(inviteesList);
    setAssignments(assignmentsList);
    setIsLoading(false);
  }, [eventId, user]);

  useEffect(() => {
    if (eventId) {
      fetchData();
    }
  }, [eventId, fetchData]);

  if (isLoading) {
    return (
      <div className="w-full min-h-full flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-[#FF5B22] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const isEventEnded = () => {
    if (!eventData) return false;
    const now = new Date();
    const endRaw = eventData.schedule?.end || eventData.endDate;
    const endDate = endRaw ? new Date(endRaw) : null;
    return (endDate && !isNaN(endDate.getTime()) && now > endDate) || eventStatus === "Completed" || eventData.status === "COMPLETED";
  };

  return (
    <div className="w-full min-h-full bg-white text-gray-900 font-sans">
      {/* Top Navigation Bar */}
      <header className="h-20 bg-white border-b border-gray-200 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-20 shrink-0">
        <div className="flex items-center gap-3">
          <svg className="w-7 h-7 text-[#FF5B22] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h1 className="text-xl font-bold text-gray-900">Event Overview</h1>
        </div>
        <UserNavDropdown />
      </header>

      {/* Page Content */}
      <div className="p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6 pb-24">
        {/* Success Banner if Cleanup Was Performed */}
        {cleanupSuccessMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center justify-between animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-semibold">{cleanupSuccessMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setCleanupSuccessMessage(null)}
              className="text-emerald-600 hover:text-emerald-900 text-xs font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Operational Data Cleared Banner Notice */}
        {eventData?.operationalDataCleared && (
          <div className="p-4 bg-gray-100 border border-gray-300 rounded-lg text-xs text-gray-700 flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <span className="font-bold text-gray-900">Operational Data Cleared:</span> The event-specific sessions, invitees, invitations, and staff assignments for this completed event have been cleared by an administrator. Global user accounts and event reference records remain preserved.
            </div>
          </div>
        )}

        {/* Header Bar: Title, Category Pill, Status Badge & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-2xl font-bold text-gray-900">{eventData?.title || "Test Event"}</h2>
              <span className="px-2.5 py-0.5 border border-[#FF5B22] text-[#FF5B22] text-[11px] font-medium rounded-md bg-[#FF5B22]/5">
                {eventData?.category || "Event"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-2 font-normal flex-wrap">
              {eventStatus === "Invitation not send" && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-amber-100 text-amber-700">
                  Invitation not send
                </span>
              )}
              {eventStatus === "Upcoming" && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-100 text-emerald-700">
                  Upcoming
                </span>
              )}
              {eventStatus === "Ongoing" && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-indigo-100 text-indigo-700">
                  Ongoing
                </span>
              )}
              {eventStatus === "Completed" && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-red-100 text-red-600">
                  Completed
                </span>
              )}
              <span className="text-gray-600 font-medium">Organized by: <span className="font-semibold text-gray-800">{eventData?.organizerId?.fullName || eventData?.organizer || user?.fullName || "Super Admin"}</span></span>
              <span className="text-gray-300">|</span>
              <span><span className="font-semibold text-gray-700">Start:</span> {eventData?.startDate || 'N/A'}</span>
              <span className="text-gray-300">|</span>
              <span><span className="font-semibold text-gray-700">End:</span> {eventData?.endDate || 'N/A'}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Manual Admin Cleanup Button if Event Ended & Not Cleared */}
            {user?.role === "ADMIN" && isEventEnded() && !eventData?.operationalDataCleared && (
              <button
                type="button"
                onClick={() => setIsCleanupModalOpen(true)}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-md shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>Clear Event Data</span>
              </button>
            )}

            <Link
              href={`/events/${eventId}/edit`}
              className="px-4 py-2 bg-white border-2 border-[#FF5B22] text-[#FF5B22] hover:bg-[#FF5B22] hover:text-white text-xs font-bold rounded-md shadow-xs transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>Edit Event</span>
            </Link>
          </div>
        </div>

        {/* Secondary Navigation Tabs */}
        <EventSubNav
          eventId={eventId}
          activeTab="overview"
          sessionsCount={sessions.length}
          inviteesCount={invitees.length}
          assignmentsCount={assignments.length}
        />

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left 8 Columns - Metrics & Sessions */}
          <div className="lg:col-span-8 space-y-6">
            {/* 3 Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white border border-gray-200 rounded-md p-5 shadow-2xs">
                <p className="text-xs font-medium text-gray-500">Total Invitees</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{invitees.length}</h3>
              </div>
              <div className="bg-white border border-gray-200 rounded-md p-5 shadow-2xs">
                <p className="text-xs font-medium text-gray-500">Total Sessions</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{sessions.length}</h3>
              </div>
              <div className="bg-white border border-gray-200 rounded-md p-5 shadow-2xs">
                <p className="text-xs font-medium text-gray-500">Assigned System Users</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{assignments.length}</h3>
              </div>
            </div>

            {/* Guest Logs & Sessions Table */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6">
              {/* Guest Logs Donut Chart (5 cols) */}
              <div className="sm:col-span-5 bg-white border border-gray-200 rounded-md p-5 shadow-2xs flex flex-col justify-between overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold text-gray-900">Guest Logs</h3>
                  <svg className="w-4 h-4 text-gray-800 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H9M17 7V15" />
                  </svg>
                </div>

                {eventData?.operationalDataCleared ? (
                  <div className="flex items-center justify-center flex-1 py-12 text-sm text-gray-500">
                    Operational data cleared
                  </div>
                ) : (
                  <GuestLogsDonutChart invitees={invitees} />
                )}
              </div>

              {/* Sessions Table Card (7 cols) */}
              <div className="sm:col-span-7 bg-white border border-gray-200 rounded-md p-5 shadow-2xs">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-gray-900">Sessions</h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs whitespace-nowrap">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-500 font-medium text-[11px]">
                        <th className="py-2 pr-4 font-medium">#</th>
                        <th className="py-2 pr-6 font-medium">Session Name</th>
                        <th className="py-2 pr-6 font-medium">Date & Time</th>
                        <th className="py-2 text-right font-medium pr-6">No. of Guests</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-800">
                      {sessions.length > 0 ? (
                        sessions.map((session, index) => (
                          <tr key={session._id || session.id || index} className="hover:bg-gray-50/80 transition-colors">
                            <td className="py-3 pr-4 font-bold text-gray-900">{index + 1}</td>
                            <td className="py-3 pr-6 font-semibold text-gray-900">{session.name || session.title || "Unnamed Session"}</td>
                            <td className="py-3 pr-6 text-gray-600">
                              {formatSessionDateTime(session, eventData)}
                            </td>
                            <td className="py-3 text-right text-gray-900 font-semibold pr-6">
                              {invitees.length > 0 ? invitees.length : (session.invitesCount ?? session.maxAttendees ?? 0)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="py-6 text-center text-gray-500">
                            {eventData?.operationalDataCleared ? "No sessions found (operational data cleared)." : "No sessions found."}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Right 4 Columns - Card Preview */}
          <div className="lg:col-span-4 bg-white border border-gray-200 rounded-md p-5 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-gray-900">Card Preview</h3>
                <svg className="w-4 h-4 text-gray-800 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </div>

              {/* Dynamic Card Poster Container */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                <div className="w-full h-80 rounded-lg overflow-hidden relative shadow-md bg-slate-950 flex flex-col justify-between p-4 text-white">
                  {(() => {
                    const templateImg =
                      (typeof eventData?.templateId === "object" ? (eventData?.templateId as any)?.imageUrl || (eventData?.templateId as any)?.previewUrl || (eventData?.templateId as any)?.url : null) ||
                      (typeof eventData?.templateId === "string" && (eventData.templateId.startsWith("http") || eventData.templateId.startsWith("/")) ? eventData.templateId : null) ||
                      (eventData as any)?.templateUrl ||
                      (eventData as any)?.cardBgImage ||
                      null;

                    if (templateImg) {
                      return (
                        <Image
                          src={templateImg}
                          alt={eventData?.title || "Event Invitation Card"}
                          fill
                          priority
                          sizes="400px"
                          className="object-cover object-center rounded-lg"
                        />
                      );
                    }

                    return (
                      <div className="relative z-10 flex flex-col justify-between h-full w-full select-none">
                        <div className="flex items-center justify-between border-b border-white/20 pb-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF5B22] bg-white/90 px-2.5 py-0.5 rounded-full shadow-xs">
                            {eventData?.category || "Official Pass"}
                          </span>
                          <span className="text-[10px] text-gray-300 font-semibold">
                            {eventData?.isPublic ? "Public Event" : "Exclusive Pass"}
                          </span>
                        </div>

                        <div className="my-auto py-3">
                          <p className="text-[10px] font-bold text-[#FF5B22] uppercase tracking-widest">INVITATION PASS</p>
                          <h4 className="font-extrabold text-base text-white mt-1 leading-tight">{eventData?.title || "Tech Summit 2026"}</h4>
                          <p className="text-xs text-gray-300 font-medium mt-1">
                            Host: <span className="text-white font-bold">{eventData?.organizerId?.fullName || eventData?.organizer || user?.fullName || "Organizer"}</span>
                          </p>
                          <div className="mt-3 inline-block bg-white/10 backdrop-blur-xs px-3 py-1 rounded-md text-xs font-semibold text-white border border-white/20">
                            {eventData?.startDate ? new Date(eventData.startDate).toLocaleString() : "Date TBD"}
                          </div>
                        </div>

                        <div className="border-t border-white/20 pt-2 text-[10px] text-gray-300 font-medium truncate">
                          📍 {eventData?.venue || (typeof eventData?.location === "string" ? eventData.location : eventData?.location?.address) || "Main Venue Hall"}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Send Invitation Button */}
            <button
              type="button"
              className="w-full mt-4 py-2.5 bg-[#FF5B22] hover:bg-[#E04B16] text-white font-semibold text-xs rounded-md transition-colors shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
              <span>Send Invitation</span>
            </button>
          </div>
        </div>

        {/* Analysis Section Card */}
        <div className="bg-white border border-gray-200 rounded-md p-6 shadow-2xs space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900">Analysis</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium">Session:</span>
              <select
                value={selectedSessionFilter}
                onChange={(e) => setSelectedSessionFilter(e.target.value)}
                className="px-3 py-1.5 border border-gray-200 rounded-md text-xs text-gray-700 bg-white font-medium focus:outline-none cursor-pointer"
              >
                <option value="All">All Sessions</option>
                {sessions.map((s, idx) => (
                  <option key={s._id || idx} value={s.name || s._id}>{s.name || `Session ${idx + 1}`}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Session Health Overview Panel (5 cols) */}
            <div className="lg:col-span-5 border border-gray-200 rounded-md p-5 bg-white space-y-4">
              <h4 className="text-xs font-semibold text-gray-800">Session Health Overview Panel</h4>

              <div className="flex items-center justify-center py-6 text-sm text-gray-500">
                {eventData?.operationalDataCleared ? "Operational data cleared" : "No data available"}
              </div>
            </div>

            {/* Access Logs (7 cols) */}
            <div className="lg:col-span-7 border border-gray-200 rounded-md p-5 bg-white space-y-4">
              <h4 className="text-xs font-semibold text-gray-800">Access Logs</h4>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-500 font-medium text-[11px]">
                      <th className="py-2 px-3 font-medium">User Type</th>
                      <th className="py-2 px-3 font-medium">Date & Time</th>
                      <th className="py-2 px-3 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 text-gray-800">
                    <tr>
                      <td colSpan={3} className="py-6 text-center text-gray-500 text-xs">
                        No access logs available for this session yet.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Cleanup Modal */}
      <EventCleanupModal
        isOpen={isCleanupModalOpen}
        onClose={() => {
          setIsCleanupModalOpen(false);
          sessionStorage.setItem(`dismiss_cleanup_${eventId}`, "true");
        }}
        eventId={eventId}
        eventTitle={eventData?.title}
        onCleanupSuccess={async () => {
          setIsCleanupModalOpen(false);
          setCleanupSuccessMessage("Operational data for this event has been successfully cleared.");
          await fetchData();
        }}
      />
    </div>
  );
}
