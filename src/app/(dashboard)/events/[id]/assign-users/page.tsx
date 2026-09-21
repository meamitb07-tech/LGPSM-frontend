"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { sessionService } from "@/services/sessionService";
import EventSubNav from "@/components/EventSubNav";
import UserNavDropdown from "@/components/common/UserNavDropdown";
import { getAssignedCountText, SystemUserRow, AssignedEventCard, AssignedSession } from "@/app/(dashboard)/user-management/assign/page";
import { userService } from "@/services/userService";

export default function AssignSystemUsersPage() {
  const params = useParams();
  const eventId = (params?.id as string);
  const { user } = useAuth();

  const [users, setUsers] = useState<SystemUserRow[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [expandedUserIds, setExpandedUserIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeActionId, setActiveActionId] = useState<string | null>(null);

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isAssignSuccessModalOpen, setIsAssignSuccessModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState("Product Launch Event 2026");
  const [selectedSession, setSelectedSession] = useState("Entry Session");

  const saveUsersToLocal = (updatedUsers: SystemUserRow[]) => {
    try {
      const keys = ["app_local_system_users", "app_local_users"];
      keys.forEach((k) => {
        localStorage.setItem(k, JSON.stringify(updatedUsers));
      });
    } catch (e) { }
  };

  const fetchAssignmentsAndSessions = async () => {
    setIsLoading(true);

    // Fetch sessions
    let fetchedSessions: any[] = [];
    try {
      const res = await sessionService.getSessions(eventId);
      if (res?.success && Array.isArray(res.data)) {
        fetchedSessions = res.data;
      }
    } catch (e) { }

    let localSessions: any[] = [];
    try {
      const cached = localStorage.getItem(`app_local_sessions_${eventId}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) localSessions.push(...parsed);
      }
    } catch (e) { }

    const combinedSessions = [...fetchedSessions, ...localSessions];
    setSessions(combinedSessions);

    // Fetch system users from API and local storage
    let apiUsers: SystemUserRow[] = [];
    try {
      const res = await userService.getUsers();
      const rawList = Array.isArray(res?.data) ? res.data : ((res?.data as any)?.users || []);
      if (res?.success && Array.isArray(rawList)) {
        apiUsers = rawList.map((u: any, idx: number) => ({
          id: u._id || u.id || `api_usr_${idx}`,
          name: u.fullName || u.name || "System User",
          email: u.email || "",
          phone: u.phone || u.contactNo || "",
          assignedEvents: u.assignedEvents || [],
        }));
      }
    } catch (e) {}

    let localUsers: SystemUserRow[] = [];
    try {
      const keys = ["app_local_system_users", "app_local_users"];
      keys.forEach((key) => {
        const cached = localStorage.getItem(key);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed)) {
            parsed.forEach((u: any) => {
              const id = u.id || u._id || `loc_${Math.random()}`;
              const name = u.name || u.fullName || "User";
              const email = u.email || "";
              const phone = u.phone || u.contactNo || "";
              if (!localUsers.some((existing) => existing.email === email && existing.name === name)) {
                localUsers.push({
                  id,
                  name,
                  email,
                  phone,
                  assignedEvents: u.assignedEvents || [],
                });
              }
            });
          }
        }
      });
    } catch (e) { }

    const combinedMap = new Map();
    localUsers.forEach((u) => combinedMap.set(u.email || u.id, u));
    apiUsers.forEach((u) => combinedMap.set(u.email || u.id, u));

    setUsers(Array.from(combinedMap.values()));
    setIsLoading(false);
  };

  useEffect(() => {
    if (eventId) {
      fetchAssignmentsAndSessions();
    }
  }, [eventId]);

  const toggleExpand = (id: string) => {
    if (expandedUserIds.includes(id)) {
      setExpandedUserIds(expandedUserIds.filter((i) => i !== id));
    } else {
      setExpandedUserIds([...expandedUserIds, id]);
    }
  };

  const toggleSelectUser = (id: string) => {
    if (selectedUserIds.includes(id)) {
      setSelectedUserIds(selectedUserIds.filter((i) => i !== id));
    } else {
      setSelectedUserIds([...selectedUserIds, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedUserIds.length === users.length) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(users.map((u) => u.id));
    }
  };

  const handleUnassignSession = (userId: string, eventCardId: string, sessionId: string) => {
    const updated = users.map((u) => {
      if (u.id !== userId) return u;

      const updatedEvents = u.assignedEvents
        .map((evt) => {
          if (evt.id !== eventCardId) return evt;
          const remainingSessions = evt.sessions.filter((s) => s.id !== sessionId);
          return { ...evt, sessions: remainingSessions };
        })
        .filter((evt) => evt.sessions.length > 0);

      return { ...u, assignedEvents: updatedEvents };
    });

    setUsers(updated);
    saveUsersToLocal(updated);
  };

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUserIds.length === 0) return;

    const eventNameClean = selectedEvent.trim() || "Product Launch Event 2026";
    const sessionNameClean = selectedSession.trim().toUpperCase() || "ENTRY SESSION";

    const updatedUsers = users.map((u) => {
      if (!selectedUserIds.includes(u.id)) return u;

      let currentEvents = [...(u.assignedEvents || [])];
      let existingEvt = currentEvents.find(
        (e) => e.eventName.toLowerCase() === eventNameClean.toLowerCase() || eventNameClean.toLowerCase().includes(e.eventName.toLowerCase())
      );

      const newSessionObj: AssignedSession = {
        id: `sess_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        name: sessionNameClean.includes("SESSION") ? sessionNameClean : `${sessionNameClean} SESSION`,
        time: "09:00 AM TO 05:00 PM",
      };

      if (existingEvt) {
        if (!existingEvt.sessions.some((s) => s.name.toLowerCase() === newSessionObj.name.toLowerCase())) {
          existingEvt.sessions = [...existingEvt.sessions, newSessionObj];
        }
      } else {
        currentEvents.push({
          id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          eventName: eventNameClean,
          dateStr: "2026",
          sessions: [newSessionObj],
        });
      }

      return {
        ...u,
        assignedEvents: currentEvents,
      };
    });

    setUsers(updatedUsers);
    saveUsersToLocal(updatedUsers);
    setIsAssignModalOpen(false);
    setIsAssignSuccessModalOpen(true);
    setExpandedUserIds((prev) => Array.from(new Set([...prev, ...selectedUserIds])));
  };

  const filteredUsers = users.filter((u) => {
    return (
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone.includes(searchQuery)
    );
  });

  const isAllSelected = selectedUserIds.length === users.length && users.length > 0;

  return (
    <div className="w-full min-h-full bg-white text-gray-900 font-sans select-none">
      {/* Top Navigation Bar */}
      <header className="h-20 bg-white border-b border-gray-200 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-20 shrink-0">
        <h1 className="text-xl font-bold text-gray-900">Assign System Users</h1>
        <UserNavDropdown />
      </header>

      {/* Page Content */}
      <div className="p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6 relative pb-24 bg-white">
          {/* Sub-Navigation Tabs Bar */}
          <EventSubNav
            eventId={eventId}
            activeTab="assign-users"
            assignmentsCount={users.length}
            sessionsCount={sessions.length}
          />

          {/* Controls Bar: Title + Search Bar on Left, Action Buttons on Right */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-6 flex-1 max-w-xl">
              <h2 className="text-xl font-bold text-gray-900 shrink-0">System Users</h2>

              <div className="relative flex-1">
                <svg
                  className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-md text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#FF5B22]"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href={`/events/${eventId}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 border border-[#FF5B22] text-[#FF5B22] hover:bg-[#FF5B22]/5 text-xs font-semibold rounded-md transition-colors cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to Dashboard</span>
              </Link>

              <button
                type="button"
                onClick={() => setIsAssignModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FF5B22] hover:bg-[#E04B16] text-white text-xs font-semibold rounded-md transition-colors cursor-pointer shadow-2xs"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add User</span>
              </button>
            </div>
          </div>

          {/* Select All Row */}
          <div className="flex items-center gap-2.5 text-xs text-gray-700 font-medium pt-2 pb-2">
            <input
              type="checkbox"
              id="selectAll"
              checked={isAllSelected}
              onChange={handleSelectAll}
              className="rounded border-gray-300 text-[#FF5B22] focus:ring-[#FF5B22] cursor-pointer"
            />
            <label htmlFor="selectAll" className="cursor-pointer font-semibold text-gray-600">
              Select All
            </label>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 font-medium text-[11px]">
                  <th className="py-3 px-4 w-10"></th>
                  <th className="py-3 px-4 font-medium">User Name</th>
                  <th className="py-3 px-4 font-medium">Assigned Events & Sessions</th>
                  <th className="py-3 px-4 font-medium">Email</th>
                  <th className="py-3 px-4 font-medium">Phone Number</th>
                  <th className="py-3 px-4 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-gray-800">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-500 text-sm">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="w-6 h-6 border-2 border-[#FF5B22] border-t-transparent rounded-full animate-spin"></div>
                        <p>Loading system users...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-500 text-sm">
                      No users assigned. Assign system users to get started.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const isSelected = selectedUserIds.includes(u.id);
                    const isExpanded = expandedUserIds.includes(u.id);
                    const isActionActive = activeActionId === u.id;
                    const countText = getAssignedCountText(u.assignedEvents);

                    return (
                      <tr key={u.id} className="hover:bg-gray-50/80 transition-colors align-top">
                        <td className="py-4 px-4">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectUser(u.id)}
                            className="rounded border-gray-300 text-[#FF5B22] focus:ring-[#FF5B22] cursor-pointer mt-0.5"
                          />
                        </td>

                        <td className="py-4 px-4 font-medium text-gray-900">{u.name}</td>

                        {/* Assigned Events & Sessions with Expandable Cards */}
                        <td className="py-4 px-4">
                          <button
                            type="button"
                            onClick={() => toggleExpand(u.id)}
                            className="flex items-center gap-2 font-bold text-gray-800 hover:text-[#FF5B22] transition-colors cursor-pointer"
                          >
                            <svg
                              className={`w-3.5 h-3.5 text-gray-700 transform transition-transform duration-200 ${isExpanded ? "rotate-180" : ""
                                }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                            <span>{countText}</span>
                          </button>

                          {/* Expanded Cards View matching Screenshot 1 & Screenshot 3 */}
                          {isExpanded && u.assignedEvents && u.assignedEvents.length > 0 && (
                            <div className="mt-3 space-y-3 max-w-sm text-left">
                              {u.assignedEvents.map((evt) => (
                                <div
                                  key={evt.id}
                                  className="bg-white border border-gray-200 rounded-md p-3 shadow-2xs space-y-2 whitespace-normal"
                                >
                                  <div className="text-xs font-semibold text-gray-800">
                                    {evt.eventName} {evt.dateStr ? `- ${evt.dateStr}` : ""}
                                  </div>
                                  <div className="space-y-1.5">
                                    {evt.sessions.map((sess) => (
                                      <div key={sess.id} className="flex items-center gap-2 flex-wrap">
                                        <div className="inline-flex items-center bg-[#FF5B22] text-white px-2.5 py-1 rounded-md text-[10px] font-bold tracking-tight uppercase">
                                          • {sess.name} {sess.time ? `| ${sess.time}` : ""}
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => handleUnassignSession(u.id, evt.id, sess.id)}
                                          className="text-[#FF5B22] underline text-xs font-semibold hover:text-[#E04B16] cursor-pointer"
                                        >
                                          Unassign
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </td>

                        <td className="py-4 px-4 text-gray-600">{u.email}</td>
                        <td className="py-4 px-4 text-gray-600">{u.phone}</td>

                        <td className="py-4 px-4 text-right relative">
                          <button
                            type="button"
                            onClick={() => setActiveActionId(isActionActive ? null : u.id)}
                            className="p-1 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M6 10a2 2 0 110 4 2 2 0 010-4zm6 0a2 2 0 110 4 2 2 0 010-4zm6 0a2 2 0 110 4 2 2 0 010-4z" />
                            </svg>
                          </button>

                          {isActionActive && (
                            <div className="absolute right-4 top-12 z-30 bg-[#1E232A] text-white text-xs font-semibold px-3 py-2 rounded-md shadow-xl border border-gray-700 animate-in fade-in duration-150 flex items-center gap-2 cursor-pointer hover:bg-gray-800">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                />
                              </svg>
                              <span>Edit</span>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Bottom Control Bar */}
          <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-1 text-xs">
              <button className="w-8 h-8 rounded border border-gray-200 bg-gray-100 text-gray-400 flex items-center justify-center cursor-not-allowed">
                &lt;
              </button>
              <button className="w-8 h-8 rounded border border-[#FF5B22] text-[#FF5B22] font-bold flex items-center justify-center">
                1
              </button>
              <button className="w-8 h-8 rounded border border-gray-200 text-gray-600 flex items-center justify-center hover:bg-gray-50">
                2
              </button>
              <span className="px-1 text-gray-400">...</span>
              <button className="w-8 h-8 rounded border border-gray-200 text-gray-600 flex items-center justify-center hover:bg-gray-50">
                4
              </button>
              <button className="w-8 h-8 rounded border border-gray-200 text-gray-600 flex items-center justify-center hover:bg-gray-50">
                5
              </button>
              <button className="w-8 h-8 rounded border border-gray-200 text-gray-600 flex items-center justify-center hover:bg-gray-50">
                &gt;
              </button>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
              <button
                type="button"
                onClick={() => setIsAssignModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#FF5B22] text-[#FF5B22] hover:bg-[#FF5B22] hover:text-white font-bold text-xs rounded-md transition-colors cursor-pointer"
              >
                <span>Assign {selectedUserIds.length} users</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>

      {/* ── Assign Attendees Modal ── */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-md border border-gray-200 shadow-2xl max-w-md w-full overflow-hidden space-y-6">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900">Assign Attendees</h3>
              <button
                type="button"
                onClick={() => setIsAssignModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAssignSubmit} className="px-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-800">
                  Event<span className="text-[#FF5B22]">*</span>
                </label>
                <select
                  value={selectedEvent}
                  onChange={(e) => setSelectedEvent(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-md text-xs text-gray-800 focus:outline-none focus:border-[#FF5B22] cursor-pointer"
                >
                  <option value="Product Launch Event 2026">Product Launch Event 2026</option>
                  <option value="Nivita Birthday - 3rd June 2026">Nivita Birthday - 3rd June 2026</option>
                  <option value="Sumanta Marriage Anniversary - 3rd Aug 2026">Sumanta Marriage Anniversary - 3rd Aug 2026</option>
                  <option value="Frankline Airline AGM 2026 - 15 Jul 2026">Frankline Airline AGM 2026 - 15 Jul 2026</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-800">
                  Session<span className="text-[#FF5B22]">*</span>
                </label>
                <select
                  value={selectedSession}
                  onChange={(e) => setSelectedSession(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-md text-xs text-gray-800 focus:outline-none focus:border-[#FF5B22] cursor-pointer"
                >
                  <option value="Entry Session">Entry Session</option>
                  <option value="Lunch Session">Lunch Session</option>
                  <option value="Dinner Session">Dinner Session</option>
                  <option value="Morning Session">Morning Session</option>
                  <option value="Keynote Session">Keynote Session</option>
                </select>
              </div>

              <div className="pt-2 pb-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="px-5 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-md transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#FF5B22] hover:bg-[#E04B16] text-white text-xs font-semibold rounded-md transition-colors cursor-pointer shadow-xs"
                >
                  Assign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {isAssignSuccessModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-md border border-gray-200 shadow-2xl max-w-sm w-full p-8 text-center space-y-6">
            <div className="w-14 h-14 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h3 className="text-lg font-bold text-gray-900">Assigned Successfully!</h3>

            <button
              onClick={() => setIsAssignSuccessModalOpen(false)}
              className="w-full py-2.5 bg-[#FF5B22] hover:bg-[#E04B16] text-white font-bold text-xs rounded-md transition-colors cursor-pointer shadow-xs"
            >
              Okay
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
