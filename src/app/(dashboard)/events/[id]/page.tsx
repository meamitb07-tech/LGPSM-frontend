"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { eventService } from "@/services/eventService";
import { sessionService } from "@/services/sessionService";
import { inviteeService } from "@/services/inviteeService";
import { assignmentService } from "@/services/assignmentService";
import EventSubNav from "@/components/EventSubNav";
import UserNavDropdown from "@/components/common/UserNavDropdown";
import { getDynamicEventStatus } from "@/utils/eventUtils";

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

  useEffect(() => {
    const fetchData = async () => {
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
            eventObj = {
              ...raw,
              title: raw.title || raw.name || raw.eventName,
              category: raw.category || raw.categoryId?.name || "Corporate",
              organizer: raw.organizerId?.fullName || raw.organizer || user?.fullName || "Super Admin",
              organizerId: { fullName: raw.organizerId?.fullName || raw.organizer || user?.fullName || "Super Admin" },
              startDate: raw.startDate || raw.schedule?.start,
              endDate: raw.endDate || raw.schedule?.end,
              status: raw.status || "Upcoming",
              venue: raw.venue || raw.location || "Grand Ballroom, Tech City",
            };
          }
        }
        if (sessionsRes?.success && Array.isArray(sessionsRes.data) && sessionsRes.data.length > 0) {
          sessionsList = sessionsRes.data;
        }
        if (inviteesRes?.success && Array.isArray(inviteesRes.data) && inviteesRes.data.length > 0) {
          inviteesList = inviteesRes.data;
        }
        if (assignmentsRes?.success && Array.isArray(assignmentsRes.data) && assignmentsRes.data.length > 0) {
          assignmentsList = assignmentsRes.data;
        }
      } catch (error) {
        console.error("Failed to fetch event data:", error);
      }

      // Check localStorage for app_local_events if eventObj is missing or title is undefined
      if (!eventObj || !eventObj.title) {
        try {
          const savedEvents = localStorage.getItem("app_local_events");
          if (savedEvents) {
            const parsed = JSON.parse(savedEvents);
            const searchTarget = String(eventId).toLowerCase().replace('#', '');
            const found = parsed.find((item: any) => {
              const itemId = String(item.id || '').toLowerCase().replace('#', '');
              const itemEvtId = String(item.eventId || '').toLowerCase().replace('#', '');
              return itemId === searchTarget || itemEvtId === searchTarget || itemId.endsWith(searchTarget) || itemEvtId.endsWith(searchTarget);
            }) || parsed[0];

            if (found) {
              eventObj = {
                title: found.eventName || found.title || "Test Event",
                category: found.category || "Corporate",
                organizer: found.organizer || user?.fullName || "Super Admin",
                organizerId: { fullName: found.organizer || user?.fullName || "Super Admin" },
                startDate: found.startDate || "23/01/26 03.00 PM",
                endDate: found.endDate || "23/01/26 11.00 PM",
                status: found.status || "Upcoming",
                venue: found.venue || "Grand Ballroom, Tech City",
              };
            }
          }
        } catch (e) { }
      }

      // Fallback event object if still empty
      if (!eventObj || !eventObj.title) {
        eventObj = {
          title: "Test Event",
          category: "Corporate",
          organizer: user?.fullName || "Super Admin",
          organizerId: { fullName: user?.fullName || "Super Admin" },
          startDate: "23/01/26 03.00 PM",
          endDate: "23/01/26 11.00 PM",
          status: "Upcoming",
          venue: "Grand Ballroom, Tech City",
        };
      }

      // Check localStorage for local sessions if sessionsList is empty
      if (sessionsList.length === 0) {
        try {
          const savedSessions = localStorage.getItem(`app_local_sessions_${eventId}`);
          if (savedSessions) {
            sessionsList = JSON.parse(savedSessions);
          }
        } catch (e) { }
      }
      if (sessionsList.length === 0) {
        sessionsList = [
          { id: "morning", name: "Morning", startTime: "2026-09-21T09:00:00", maxAttendees: 0 },
          { id: "entry", name: "Session 1 - Entry Session", startTime: "2026-09-21T12:00:00", maxAttendees: 0 },
          { id: "lunch", name: "Session 2 - Lunch Session", startTime: "2026-09-21T14:00:00", maxAttendees: 0 },
        ];
      }

      // Check localStorage for local invitees if inviteesList is empty
      if (inviteesList.length === 0) {
        try {
          const savedInvitees = localStorage.getItem(`app_local_invitees_${eventId}`);
          if (savedInvitees) {
            inviteesList = JSON.parse(savedInvitees);
          }
        } catch (e) { }
      }

      // Check localStorage for local assignments if assignmentsList is empty
      if (assignmentsList.length === 0) {
        try {
          const savedAssignments = localStorage.getItem(`app_local_assignments_${eventId}`);
          if (savedAssignments) {
            assignmentsList = JSON.parse(savedAssignments);
          }
        } catch (e) { }
      }
      if (assignmentsList.length === 0) {
        assignmentsList = new Array(7).fill({});
      }

      setEventData(eventObj);
      const computedStatus = getDynamicEventStatus(eventObj?.startDate, eventObj?.endDate, eventObj?.status);
      setEventStatus(computedStatus as any);

      setSessions(sessionsList);
      setInvitees(inviteesList);
      setAssignments(assignmentsList);
      setIsLoading(false);
    };

    if (eventId) {
      fetchData();
    }
  }, [eventId, user]);

  if (isLoading) {
    return (
      <div className="w-full min-h-full flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-[#FF5B22] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-full bg-white text-gray-900 font-sans">
      {/* Top Navigation Bar */}
      <header className="h-20 bg-white border-b border-gray-200 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-20 shrink-0">
        <h1 className="text-xl font-bold text-gray-900">Event</h1>
        <UserNavDropdown />
      </header>

      {/* Page Content */}
      <div className="p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6 pb-24">
          {/* Header Bar: Title, Category Pill, Status Badge & Edit Button */}
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

            <div className="flex items-center gap-3 shrink-0">
              <select
                value={eventStatus}
                onChange={(e) => setEventStatus(e.target.value as any)}
                className="px-2 py-1.5 border border-gray-200 rounded-md text-xs text-gray-700 bg-white font-medium focus:outline-none cursor-pointer"
              >
                <option value="Ongoing">Status: Ongoing</option>
                <option value="Upcoming">Status: Upcoming</option>
                <option value="Invitation not send">Status: Invitation not send</option>
              </select>

              <Link
                href={`/events/${eventId}/edit`}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FF5B22] hover:bg-[#E04B16] text-white text-xs font-semibold rounded-md transition-colors cursor-pointer shadow-2xs"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>Edit</span>
              </Link>
            </div>
          </div>

          {/* Sub-Navigation Tabs Bar */}
          <EventSubNav
            eventId={eventId}
            activeTab="overview"
            sessionsCount={sessions.length}
            inviteesCount={invitees.length}
            assignmentsCount={assignments.length}
          />

          {/* Main Grid: Left Metric & Log Section (8 cols), Right Poster Card (4 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 8 Columns */}
            <div className="lg:col-span-8 space-y-6">
              {/* 3 Metric Cards Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* 1. Total Invitees */}
                <Link
                  href={`/events/${eventId}/invitees`}
                  className="bg-white border border-gray-200 rounded-md p-5 relative shadow-2xs hover:shadow-md transition-all group block"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#FF5B22]/10 text-[#FF5B22] flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <svg className="w-4 h-4 text-gray-800 group-hover:text-[#FF5B22] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H9M17 7V15" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 tracking-tight">{invitees.length.toString().padStart(2, '0')}</h3>
                  <p className="text-xs text-gray-500 font-medium mt-1">Total Invitees</p>
                </Link>

                {/* 2. Total System Users */}
                <Link
                  href={`/events/${eventId}/assign-users`}
                  className="bg-white border border-gray-200 rounded-md p-5 relative shadow-2xs hover:shadow-md transition-all group block"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                    </div>
                    <svg className="w-4 h-4 text-gray-800 group-hover:text-emerald-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H9M17 7V15" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 tracking-tight">
                    {assignments.length.toString().padStart(2, '0')}
                  </h3>
                  <p className="text-xs text-gray-500 font-medium mt-1">Assigned System Users</p>
                </Link>

                {/* 3. Total Sessions */}
                <Link
                  href={`/events/${eventId}/sessions`}
                  className="bg-white border border-gray-200 rounded-md p-5 relative shadow-2xs hover:shadow-md transition-all group block"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <svg className="w-4 h-4 text-gray-800 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H9M17 7V15" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 tracking-tight">{sessions.length.toString().padStart(2, '0')}</h3>
                  <p className="text-xs text-gray-500 font-medium mt-1">Total Sessions</p>
                </Link>
              </div>

              {/* Middle Section: Guest Logs & Sessions Table */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6">
                {/* Guest Logs Donut Chart (5 cols) */}
                <div className="sm:col-span-5 bg-white border border-gray-200 rounded-md p-5 shadow-2xs flex flex-col justify-between overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-bold text-gray-900">Guest Logs</h3>
                    <svg className="w-4 h-4 text-gray-800 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H9M17 7V15" />
                    </svg>
                  </div>

                  <div className="flex items-center justify-center flex-1 py-12 text-sm text-gray-500">
                    No data available
                  </div>
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
                            <tr key={session._id || index}>
                              <td className="py-3 pr-4 font-bold text-gray-900">{index + 1}</td>
                              <td className="py-3 pr-6 font-semibold text-gray-900">{session.name || "Unnamed Session"}</td>
                              <td className="py-3 pr-6 text-gray-600">
                                {session.startTime ? new Date(session.startTime).toLocaleString() : "N/A"}
                              </td>
                              <td className="py-3 text-right text-gray-900 font-semibold pr-6">{session.maxAttendees || "N/A"}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="py-6 text-center text-gray-500">
                              No sessions found
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

                {/* Card Poster Container */}
                <div className="bg-[#FFF5F2] border border-orange-100 rounded-md p-3 flex flex-col items-center justify-center text-center">
                  <div className="w-full h-80 rounded-md overflow-hidden relative shadow-xs bg-amber-900/10 flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-b from-[#8B1E24] to-[#5C1116] p-4 text-amber-200 flex flex-col justify-between items-center text-center">
                      <div className="text-xl tracking-widest text-amber-300 mt-2">卐</div>
                      <div>
                        <p className="text-[10px] tracking-widest text-amber-200 uppercase">{eventData?.title || "EVENT"}</p>
                        <h4 className="font-serif text-lg text-amber-300 mt-1">{eventData?.organizerId?.fullName || eventData?.organizer || user?.fullName || "Organizer"}</h4>
                        <p className="text-[9px] text-amber-200/80 mt-1">{eventData?.category || "Corporate"}</p>
                        <p className="text-[8px] text-amber-200/60 font-medium mt-1">
                          {eventData?.startDate || "Date TBD"}
                        </p>
                      </div>
                      <div className="text-[8px] text-amber-200/70 border-t border-amber-300/30 pt-2 w-full truncate px-2">
                        {eventData?.venue || eventData?.location || "Grand Ballroom, Tech City"}
                      </div>
                    </div>
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
                  No data available
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
    </div>
  );
}
