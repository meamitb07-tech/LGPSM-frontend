"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { userService } from "@/services/userService";
import { eventService } from "@/services/eventService";
import UserNavDropdown from "@/components/common/UserNavDropdown";

export interface AssignedSession {
  id: string;
  name: string;
  time?: string;
}

export interface AssignedEventCard {
  id: string;
  eventName: string;
  dateStr?: string;
  sessions: AssignedSession[];
}

export interface SystemUserRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  assignedEvents: AssignedEventCard[];
  assignedCountText?: string;
}

export const getAssignedCountText = (assignedEvents: AssignedEventCard[] = []): string => {
  const eventCount = assignedEvents.length;
  let sessionCount = 0;
  assignedEvents.forEach((e) => {
    sessionCount += e.sessions?.length || 0;
  });

  const eventLabel = eventCount === 1 ? "1 Event" : `${eventCount} Events`;
  const sessionLabel = sessionCount === 1 ? "1 Session" : sessionCount === 0 ? "0 Session" : `${sessionCount} Sessions`;
  return `${eventLabel} & ${sessionLabel}`;
};

export default function AssignSystemUsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<SystemUserRow[]>([]);
  const [expandedUserIds, setExpandedUserIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeActionId, setActiveActionId] = useState<string | null>(null);

  // Modals
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isAssignSuccessModalOpen, setIsAssignSuccessModalOpen] = useState(false);

  // Form states
  const [addUserData, setAddUserData] = useState({ userName: "", contactNo: "", email: "" });
  const [eventsList, setEventsList] = useState<{ id: string; name: string }[]>([]);
  const [selectedEvent, setSelectedEvent] = useState("Product Launch Event 2026");
  const [selectedSession, setSelectedSession] = useState("Entry Session");

  const saveUsersToLocal = (updatedUsers: SystemUserRow[]) => {
    try {
      const keys = ["app_local_system_users", "app_local_users"];
      keys.forEach((k) => {
        localStorage.setItem(k, JSON.stringify(updatedUsers));
      });
    } catch (e) {
      console.error("Error saving users to local storage:", e);
    }
  };

  const fetchUsers = async () => {
    let apiUsers: SystemUserRow[] = [];
    try {
      const res = await userService.getUsers();
      const rawList = Array.isArray(res?.data) ? res.data : ((res?.data as any)?.users || []);
      if (res?.success && Array.isArray(rawList) && rawList.length > 0) {
        apiUsers = rawList.map((u: any, idx: number) => ({
          id: u._id || u.id || `api_usr_${idx}`,
          name: u.fullName || u.name || "System User",
          email: u.email || "",
          phone: u.phone || u.contactNo || "",
          assignedEvents: u.assignedEvents || [],
        }));
      }
    } catch (e) { }

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
  };

  // Fetch dynamic events for dropdown
  const fetchEvents = async () => {
    try {
      const res = await eventService.getEvents();
      if (res?.success && res.data) {
        const list = Array.isArray(res.data) ? res.data : (res.data as any).events;
        if (Array.isArray(list) && list.length > 0) {
          const mapped = list.map((e: any) => ({
            id: e.id || e._id,
            name: e.title || e.name || "Untitled Event",
          }));

          setEventsList((prev) => {
            const uniqueMap = new Map();
            [...prev, ...mapped].forEach((item) => uniqueMap.set(item.name, item));
            return Array.from(uniqueMap.values());
          });
        }
      }
    } catch (e) { }

    // Check local storage events
    try {
      const cachedEvts = localStorage.getItem("app_local_events");
      if (cachedEvts) {
        const parsed = JSON.parse(cachedEvts);
        if (Array.isArray(parsed)) {
          const localMapped = parsed.map((e: any) => ({
            id: e.id || e._id || `loc_evt_${Math.random()}`,
            name: e.title || e.name || "Custom Event",
          }));
          setEventsList((prev) => {
            const uniqueMap = new Map();
            [...prev, ...localMapped].forEach((item) => uniqueMap.set(item.name, item));
            return Array.from(uniqueMap.values());
          });
        }
      }
    } catch (e) { }
  };

  useEffect(() => {
    fetchUsers();
    fetchEvents();
  }, []);

  const handleAddUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addUserData.userName) return;

    const newUserObj: SystemUserRow = {
      id: `usr_${Date.now()}`,
      name: addUserData.userName,
      email: addUserData.email,
      phone: addUserData.contactNo,
      assignedEvents: [],
    };

    const updatedUsers = [newUserObj, ...users.filter((u) => u.email !== addUserData.email && u.name !== addUserData.userName)];
    setUsers(updatedUsers);
    saveUsersToLocal(updatedUsers);

    try {
      await userService.createUser({
        fullName: addUserData.userName,
        email: addUserData.email,
        phone: addUserData.contactNo,
        role: "SYSTEM_USER",
      });
    } catch (err) {
      console.error("Failed to create user in backend:", err);
    } finally {
      setIsAddUserModalOpen(false);
      setAddUserData({ userName: "", contactNo: "", email: "" });
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

  // Unassign a session from a user's assigned events
  const handleUnassignSession = (userId: string, eventCardId: string, sessionId: string) => {
    const updated = users.map((u) => {
      if (u.id !== userId) return u;

      const updatedEvents = u.assignedEvents
        .map((evt) => {
          if (evt.id !== eventCardId) return evt;
          const remainingSessions = evt.sessions.filter((s) => s.id !== sessionId);
          return { ...evt, sessions: remainingSessions };
        })
        .filter((evt) => evt.sessions.length > 0); // Remove event card if no sessions remain

      return { ...u, assignedEvents: updatedEvents };
    });

    setUsers(updated);
    saveUsersToLocal(updated);
  };

  // Assign selected users to the chosen Event & Session (Matching Image 2)
  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIds.length === 0) return;

    const eventNameClean = selectedEvent.trim() || "Product Launch Event 2026";
    const sessionNameClean = selectedSession.trim().toUpperCase() || "ENTRY SESSION";

    const updatedUsers = users.map((u) => {
      if (!selectedIds.includes(u.id)) return u;

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
    // Expand newly assigned users
    setExpandedUserIds((prev) => Array.from(new Set([...prev, ...selectedIds])));
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone.includes(searchQuery)
  );

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-white select-none">
        {/* Header */}
        <header className="h-20 bg-white border-b border-gray-200 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-20 shrink-0">
          <h1 className="text-xl font-bold text-gray-900">Assign System Users</h1>
          <UserNavDropdown />
        </header>

        {/* Page Content */}
        <main className="p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6 bg-white pb-24">
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
              checked={selectedIds.length === users.length && users.length > 0}
              onChange={toggleSelectAll}
              className="rounded border-gray-300 text-[#FF5B22] focus:ring-[#FF5B22] cursor-pointer"
            />
            <label htmlFor="selectAll" className="cursor-pointer">
              Select All
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
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-400 text-sm">
                      No users available for assignment.
                    </td>
                  </tr>
                )}
                {filteredUsers.map((u) => {
                  const isSelected = selectedIds.includes(u.id);
                  const isExpanded = expandedUserIds.includes(u.id);
                  const isActionActive = activeActionId === u.id;
                  const countText = getAssignedCountText(u.assignedEvents);

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

                      <td className="py-4 px-4 font-medium text-gray-900">{u.name}</td>

                      {/* Assigned Events & Sessions with Expandable Toggle Cards (Image 1 & 3) */}
                      <td className="py-4 px-4">
                        <button
                          type="button"
                          onClick={() => toggleExpandUser(u.id)}
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

                      {/* Action Column with Speech Bubble Tooltip matching Image 1 & 3 */}
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
                })}
              </tbody>
            </table>
          </div>

          {/* Bottom Control Bar */}
          <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Pagination Controls */}
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

            {/* "Assign X users ->" Button (Matching Image 1 & 2) */}
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
              <h3 className="text-base font-bold text-gray-900">Add User</h3>
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

            <form onSubmit={handleAddUserSubmit} className="px-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-800">
                  User Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter User Name"
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
                  className="px-6 py-2 bg-[#FF5B22] hover:bg-[#E04B16] text-white text-xs font-semibold rounded-md transition-colors cursor-pointer shadow-xs"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Assign Attendees Modal (Exact Image 2 Match) ── */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center p-4 animate-in fade-in duration-200">
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
                  {eventsList.map((evt) => (
                    <option key={evt.id} value={evt.name}>
                      {evt.name}
                    </option>
                  ))}
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
