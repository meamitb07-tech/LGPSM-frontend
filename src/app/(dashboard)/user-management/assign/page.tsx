"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { userService } from "@/services/userService";
import { eventService } from "@/services/eventService";
import { sessionService } from "@/services/sessionService";
import { assignmentService, AssignmentData } from "@/services/assignmentService";
import UserNavDropdown from "@/components/common/UserNavDropdown";
import { useAlert } from "@/context/AlertContext";
import { notifyDbUpdate } from "@/components/EventSubNav";

export interface AssignedSession {
  id: string;
  name: string;
  time?: string;
}

export interface AssignedEventCard {
  id: string;
  eventName: string;
  dateStr?: string;
  assignedBy?: string;
  assignedAt?: string;
  sessions: AssignedSession[];
}

export interface SystemUserRow {
  id: string; // User ID
  name: string;
  email: string;
  phone: string;
  role: string;
  assignments: {
    assignmentId: string;
    eventId: string;
    eventName: string;
    dateStr?: string;
    assignedBy?: string;
    assignedAt?: string;
    sessions: { id: string; name: string; time?: string }[];
  }[];
  assignedEvents?: AssignedEventCard[];
}

export const getAssignedCountText = (assignments: SystemUserRow["assignments"] = []): string => {
  const eventCount = assignments.length;
  let sessionCount = 0;
  assignments.forEach((a) => {
    sessionCount += a.sessions?.length || 0;
  });

  const eventLabel = eventCount === 1 ? "1 Event" : `${eventCount} Events`;
  const sessionLabel = sessionCount === 1 ? "1 Session" : `${sessionCount} Sessions`;
  return `${eventLabel} & ${sessionLabel}`;
};

export default function AssignSystemUsersPage() {
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const [users, setUsers] = useState<SystemUserRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedUserIds, setExpandedUserIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [errorFeedback, setErrorFeedback] = useState<string | null>(null);

  // Modals
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isAssignSuccessModalOpen, setIsAssignSuccessModalOpen] = useState(false);

  // Form states
  const [addUserData, setAddUserData] = useState({ userName: "", contactNo: "", email: "", password: "" });
  const [eventsList, setEventsList] = useState<{ id: string; title: string }[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [eventSessionsList, setEventSessionsList] = useState<{ id: string; name: string }[]>([]);
  const [selectedSessionIds, setSelectedSessionIds] = useState<string[]>([]);
  const [submittingAssign, setSubmittingAssign] = useState(false);
  const [submittingUser, setSubmittingUser] = useState(false);

  // Fetch real SYSTEM_USER accounts and their MongoDB assignments
  const loadData = async () => {
    try {
      setIsLoading(true);
      setErrorFeedback(null);

      // 1. Fetch system users only (role === SYSTEM_USER)
      const usersRes = await userService.getUsers("SYSTEM_USER");
      const rawUsers = Array.isArray(usersRes?.data) ? usersRes.data : [];
      
      // Filter out ADMIN & ORGANIZER strictly as UX defense
      const systemUsersOnly = rawUsers.filter(u => u.role === "SYSTEM_USER");

      // 2. Fetch events
      const eventsRes = await eventService.getEvents();
      const rawEvents = Array.isArray(eventsRes?.data) ? eventsRes.data : ((eventsRes?.data as any)?.events || []);
      const formattedEvents = rawEvents.map((ev: any) => ({
        id: ev._id || ev.id,
        title: ev.title || ev.eventName || "Untitled Event",
      }));
      setEventsList(formattedEvents);
      if (formattedEvents.length > 0 && !selectedEventId) {
        setSelectedEventId(formattedEvents[0].id);
      }

      // 3. Collect assignments across events
      const userAssignmentsMap: Record<string, SystemUserRow["assignments"]> = {};

      for (const ev of formattedEvents) {
        if (!ev.id) continue;
        try {
          const assignRes = await assignmentService.getAssignmentsByEvent(ev.id);
          const assignmentsList: AssignmentData[] = Array.isArray(assignRes?.data) ? assignRes.data : [];

          assignmentsList.forEach((asn) => {
            const userId = typeof asn.userId === "object" ? asn.userId?._id : asn.userId;
            if (!userId) return;

            if (!userAssignmentsMap[userId]) {
              userAssignmentsMap[userId] = [];
            }

            const sessions = (asn.sessionIds || []).map((s: any) => ({
              id: typeof s === "object" ? s._id : s,
              name: typeof s === "object" ? (s.name || "Session") : "Session",
              time: typeof s === "object" && s.schedule?.startTime ? `${s.schedule.startTime}` : undefined,
            }));

            const assignedByObj = typeof asn.assignedBy === "object" ? asn.assignedBy : null;
            const assignedByName = assignedByObj?.fullName || assignedByObj?.email || "Organizer";

            userAssignmentsMap[userId].push({
              assignmentId: asn._id,
              eventId: ev.id,
              eventName: ev.title,
              assignedBy: assignedByName,
              assignedAt: asn.createdAt ? new Date(asn.createdAt).toLocaleDateString() : undefined,
              sessions,
            });
          });
        } catch (e) {
          // Ignore individual event assignment fetch errors
        }
      }

      // Format final SystemUserRow list
      const formattedUserRows: SystemUserRow[] = systemUsersOnly.map((u: any) => ({
        id: u._id || u.id,
        name: u.fullName || u.name || "System User",
        email: u.email || "",
        phone: u.phone || u.contactNo || "--",
        role: u.role,
        assignments: userAssignmentsMap[u._id || u.id] || [],
      }));

      setUsers(formattedUserRows);
    } catch (err: any) {
      console.error("Error loading system users and assignments:", err);
      setErrorFeedback(err.message || "Failed to load system user assignments.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Fetch sessions when selected event changes in Assign modal
  useEffect(() => {
    if (!selectedEventId) return;

    async function loadSessions() {
      try {
        const res = await sessionService.getSessions(selectedEventId);
        if (res.success && Array.isArray(res.data)) {
          const mapped = res.data.map((s: any) => ({
            id: s._id || s.id,
            name: s.name || s.title || "Session",
          }));
          setEventSessionsList(mapped);
          if (mapped.length > 0) {
            setSelectedSessionIds([mapped[0].id]);
          } else {
            setSelectedSessionIds([]);
          }
        } else {
          setEventSessionsList([]);
          setSelectedSessionIds([]);
        }
      } catch (err) {
        setEventSessionsList([]);
        setSelectedSessionIds([]);
      }
    }

    loadSessions();
  }, [selectedEventId]);

  // Handle adding new SYSTEM_USER account via backend API
  const handleAddUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addUserData.userName || !addUserData.email) return;

    try {
      setSubmittingUser(true);
      setErrorFeedback(null);

      const res = await userService.createUser({
        fullName: addUserData.userName,
        email: addUserData.email,
        phone: addUserData.contactNo,
        password: addUserData.password || "Password123!",
        role: "SYSTEM_USER", // Strictly create as SYSTEM_USER
      });

      if (res.success) {
        setIsAddUserModalOpen(false);
        setAddUserData({ userName: "", contactNo: "", email: "", password: "" });
        await loadData();
      } else {
        setErrorFeedback(res.message || "Failed to create system user account.");
      }
    } catch (err: any) {
      setErrorFeedback(err.message || "Error creating system user.");
    } finally {
      setSubmittingUser(false);
    }
  };

  // Handle assigning selected users to selected event & sessions via backend API
  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIds.length === 0 || !selectedEventId) {
      showAlert("Please select at least one system user and an event.", "warning");
      return;
    }

    try {
      setSubmittingAssign(true);
      setErrorFeedback(null);

      const errorMessages: string[] = [];

      for (const targetUserId of selectedIds) {
        const res = await assignmentService.createAssignment(selectedEventId, {
          userId: targetUserId,
          sessionIds: selectedSessionIds,
        });

        if (!res.success && res.message) {
          errorMessages.push(res.message);
        }
      }

      if (errorMessages.length > 0) {
        setErrorFeedback(errorMessages.join(". "));
      }

      setIsAssignModalOpen(false);
      setIsAssignSuccessModalOpen(true);
      await loadData();
      notifyDbUpdate();
    } catch (err: any) {
      setErrorFeedback(err.message || "Failed to save assignment.");
    } finally {
      setSubmittingAssign(false);
    }
  };

  // Handle unassigning assignment via backend DELETE /api/v1/assignments/:assignmentId
  const handleUnassignAssignment = async (assignmentId: string) => {
    if (!confirm("Are you sure you want to remove this system user assignment?")) return;

    try {
      setErrorFeedback(null);
      const res = await assignmentService.deleteAssignment(assignmentId);
      if (res.success || (res as any).data?.deleted) {
        await loadData();
        notifyDbUpdate();
      } else {
        setErrorFeedback(res.message || "Failed to delete assignment.");
      }
    } catch (err: any) {
      setErrorFeedback(err.message || "Error removing assignment.");
    }
  };

  const toggleExpandUser = (id: string) => {
    if (expandedUserIds.includes(id)) {
      setExpandedUserIds(expandedUserIds.filter((i) => i !== id));
    } else {
      setExpandedUserIds([...expandedUserIds, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === users.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(users.map((u) => u.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone.includes(searchQuery)
  );

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-white select-none font-sans">
      {/* Header */}
      <header className="h-20 bg-white border-b border-gray-200 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-20 shrink-0">
        <h1 className="text-xl font-bold text-gray-900">Assign System Users</h1>
        <UserNavDropdown />
      </header>

      {/* Page Content */}
      <main className="p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6 bg-white pb-24">
        {/* Error Feedback Banner */}
        {errorFeedback && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between">
            <span>{errorFeedback}</span>
            <button
              onClick={() => setErrorFeedback(null)}
              className="font-bold text-rose-600 hover:text-rose-800 ml-4 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1 max-w-2xl">
            <h2 className="text-lg font-bold text-gray-900 shrink-0">System Users</h2>
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
                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-md text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#FF5B22] transition-colors"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsAddUserModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FF5B22] hover:bg-[#E04B16] text-white text-xs font-semibold rounded-md transition-colors cursor-pointer shrink-0 shadow-2xs"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add User</span>
          </button>
        </div>

        {/* Select All Checkbox */}
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 pt-1">
          <input
            type="checkbox"
            id="selectAll"
            checked={selectedIds.length === filteredUsers.length && filteredUsers.length > 0}
            onChange={toggleSelectAll}
            className="rounded border-gray-300 text-[#FF5B22] focus:ring-[#FF5B22] cursor-pointer"
          />
          <label htmlFor="selectAll" className="cursor-pointer">
            Select All ({selectedIds.length} selected)
          </label>
        </div>

        {/* Table Container */}
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
                  <td colSpan={6} className="py-12 text-center text-gray-400 text-sm">
                    No SYSTEM_USER accounts found. Click "Add User" to create a system user account.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isSelected = selectedIds.includes(u.id);
                  const isExpanded = expandedUserIds.includes(u.id);
                  const isActionActive = activeActionId === u.id;
                  const countText = getAssignedCountText(u.assignments);

                  return (
                    <tr key={u.id} className="hover:bg-gray-50/80 transition-colors align-top">
                      <td className="py-4 px-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectRow(u.id)}
                          className="rounded border-gray-300 text-[#FF5B22] focus:ring-[#FF5B22] cursor-pointer mt-0.5"
                        />
                      </td>

                      <td className="py-4 px-4 font-medium text-gray-900">
                        <div>{u.name}</div>
                        <span className="text-[10px] font-mono text-[#FF5B22] bg-[#FF5B22]/10 px-1.5 py-0.5 rounded">
                          SYSTEM_USER
                        </span>
                      </td>

                      {/* Assigned Events & Sessions Cards */}
                      <td className="py-4 px-4">
                        <button
                          type="button"
                          onClick={() => toggleExpandUser(u.id)}
                          className="flex items-center gap-2 font-bold text-gray-800 hover:text-[#FF5B22] transition-colors cursor-pointer"
                        >
                          <svg
                            className={`w-3.5 h-3.5 text-gray-700 transform transition-transform duration-200 ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                          <span>{countText}</span>
                        </button>

                        {/* Expanded Cards View */}
                        {isExpanded && u.assignments && u.assignments.length > 0 && (
                          <div className="mt-3 space-y-3 max-w-sm text-left">
                            {u.assignments.map((asn) => (
                              <div
                                key={asn.assignmentId}
                                className="bg-white border border-gray-200 rounded-md p-3 shadow-2xs space-y-2 whitespace-normal"
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <div className="text-xs font-semibold text-gray-800">
                                    {asn.eventName}
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleUnassignAssignment(asn.assignmentId)}
                                    className="text-rose-600 underline text-xs font-semibold hover:text-rose-800 cursor-pointer"
                                  >
                                    Unassign
                                  </button>
                                </div>

                                {asn.assignedBy && (
                                  <div className="text-[10px] text-gray-500">
                                    Assigned by: <span className="font-medium text-gray-700">{asn.assignedBy}</span>
                                    {asn.assignedAt ? ` on ${asn.assignedAt}` : ""}
                                  </div>
                                )}

                                <div className="space-y-1.5 pt-1">
                                  {asn.sessions.map((sess) => (
                                    <div key={sess.id} className="flex items-center gap-2 flex-wrap">
                                      <div className="inline-flex items-center bg-[#FF5B22] text-white px-2.5 py-1 rounded-md text-[10px] font-bold tracking-tight uppercase">
                                        • {sess.name} {sess.time ? `| ${sess.time}` : ""}
                                      </div>
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
                          <div className="absolute right-4 top-12 z-30 bg-[#1E232A] text-white text-xs font-semibold px-3 py-2 rounded-md shadow-xl border border-gray-700 flex items-center gap-2 cursor-pointer hover:bg-gray-800">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                              />
                            </svg>
                            <span>Edit User</span>
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
            <button className="w-8 h-8 rounded border border-[#FF5B22] text-[#FF5B22] font-bold flex items-center justify-center">
              1
            </button>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => setIsAssignModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#FF5B22] text-[#FF5B22] hover:bg-[#FF5B22] hover:text-white font-bold text-xs rounded-md transition-colors cursor-pointer"
            >
              <span>Assign {selectedIds.length} users</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </main>

      {/* ── Add User Modal ── */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-md border border-gray-200 shadow-2xl max-w-md w-full overflow-hidden space-y-6">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900">Add System User</h3>
              <button
                type="button"
                onClick={() => setIsAddUserModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAddUserSubmit} className="px-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-800">
                  User Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter Full Name"
                  value={addUserData.userName}
                  onChange={(e) => setAddUserData({ ...addUserData, userName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-md text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#FF5B22] transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-800">
                  Contact No<span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Enter Contact No"
                  value={addUserData.contactNo}
                  onChange={(e) => setAddUserData({ ...addUserData, contactNo: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-md text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#FF5B22] transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-800">
                  Email<span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="Enter Email"
                  value={addUserData.email}
                  onChange={(e) => setAddUserData({ ...addUserData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-md text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#FF5B22] transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-800">
                  Password<span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter Initial Password"
                  value={addUserData.password}
                  onChange={(e) => setAddUserData({ ...addUserData, password: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-md text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#FF5B22] transition-colors"
                />
              </div>

              <div className="pt-2 pb-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-5 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-md transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingUser}
                  className="px-6 py-2 bg-[#FF5B22] hover:bg-[#E04B16] text-white text-xs font-semibold rounded-md transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {submittingUser ? "Creating..." : "Add System User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Assign Attendees Modal ── */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-md border border-gray-200 shadow-2xl max-w-md w-full overflow-hidden space-y-6">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900">Assign System Users to Event</h3>
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
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-md text-xs text-gray-800 focus:outline-none focus:border-[#FF5B22] cursor-pointer"
                >
                  {eventsList.map((evt) => (
                    <option key={evt.id} value={evt.id}>
                      {evt.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-800">
                  Sessions<span className="text-[#FF5B22]">*</span>
                </label>
                {eventSessionsList.length > 0 ? (
                  <div className="space-y-2 border border-gray-200 rounded-md p-3 max-h-36 overflow-y-auto">
                    {eventSessionsList.map((s) => (
                      <label key={s.id} className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedSessionIds.includes(s.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedSessionIds([...selectedSessionIds, s.id]);
                            } else {
                              setSelectedSessionIds(selectedSessionIds.filter((id) => id !== s.id));
                            }
                          }}
                          className="rounded border-gray-300 text-[#FF5B22] focus:ring-[#FF5B22]"
                        />
                        <span>{s.name}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic">No sessions found for this event.</p>
                )}
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
                  disabled={submittingAssign}
                  className="px-6 py-2 bg-[#FF5B22] hover:bg-[#E04B16] text-white text-xs font-semibold rounded-md transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {submittingAssign ? "Saving..." : "Assign"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {isAssignSuccessModalOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center p-4 animate-in fade-in duration-200">
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
