"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { userService } from "@/services/userService";
import { eventService } from "@/services/eventService";
import { getAssignedCountText, SystemUserRow, AssignedEventCard, AssignedSession } from "@/app/(dashboard)/user-management/assign/page";

const DEFAULT_ALL_USERS: SystemUserRow[] = [
  {
    id: "1",
    name: "Moloy Roy",
    email: "tanya.hill@example.com",
    phone: "9674259986",
    assignedEvents: [
      {
        id: "evt_1",
        eventName: "Nivita Birthday",
        dateStr: "3rd June 2026",
        sessions: [
          { id: "s1", name: "LUNCH SESSION", time: "12:30 PM TO 4:30 PM" },
          { id: "s2", name: "ENTRY SESSION", time: "06:30 PM TO 12:00 AM" },
        ],
      },
      {
        id: "evt_2",
        eventName: "Sumanta Marriage Anniversary",
        dateStr: "3rd Aug 2026",
        sessions: [{ id: "s3", name: "DINNER SESSION", time: "08:30 PM TO 11:30 PM" }],
      },
    ],
  },
  {
    id: "2",
    name: "Wade Warren",
    email: "willie.jennings@example.com",
    phone: "(671) 555-0110",
    assignedEvents: [
      {
        id: "evt_3",
        eventName: "Product Launch Event 2026",
        dateStr: "10th May 2026",
        sessions: [
          { id: "s4", name: "ENTRY SESSION", time: "09:00 AM TO 12:00 PM" },
          { id: "s5", name: "KEYNOTE SESSION", time: "01:00 PM TO 04:00 PM" },
        ],
      },
    ],
  },
  {
    id: "3",
    name: "Guy Hawkins",
    email: "bill.sanders@example.com",
    phone: "(316) 555-0116",
    assignedEvents: [
      {
        id: "evt_4",
        eventName: "Annual Tech Summit",
        dateStr: "15th Aug 2026",
        sessions: [{ id: "s6", name: "MORNING SESSION", time: "09:00 AM TO 01:00 PM" }],
      },
      {
        id: "evt_5",
        eventName: "Developer Meetup",
        dateStr: "20th Sep 2026",
        sessions: [{ id: "s7", name: "AFTERNOON SESSION", time: "02:00 PM TO 06:00 PM" }],
      },
      {
        id: "evt_6",
        eventName: "Design Workshop",
        dateStr: "05th Oct 2026",
        sessions: [{ id: "s8", name: "WORKSHOP 1", time: "10:00 AM TO 01:00 PM" }],
      },
      {
        id: "evt_7",
        eventName: "AI Conference 2026",
        dateStr: "12th Nov 2026",
        sessions: [{ id: "s9", name: "KEYNOTE", time: "10:00 AM TO 02:00 PM" }],
      },
    ],
  },
  {
    id: "4",
    name: "Marvin McKinney",
    email: "tim.jennings@example.com",
    phone: "(219) 555-0114",
    assignedEvents: [
      {
        id: "evt_3",
        eventName: "Product Launch Event 2026",
        dateStr: "10th May 2026",
        sessions: [{ id: "s4", name: "ENTRY SESSION", time: "09:00 AM TO 12:00 PM" }],
      },
      {
        id: "evt_1",
        eventName: "Nivita Birthday",
        dateStr: "3rd June 2026",
        sessions: [{ id: "s3", name: "DINNER SESSION", time: "08:30 PM TO 11:30 PM" }],
      },
    ],
  },
  {
    id: "5",
    name: "Albert Flores",
    email: "dolores.chambers@example.com",
    phone: "(702) 555-0122",
    assignedEvents: [],
  },
  {
    id: "6",
    name: "Eleanor Pena",
    email: "michelle.rivera@example.com",
    phone: "(684) 555-0102",
    assignedEvents: [
      {
        id: "evt_8",
        eventName: "Global Innovators Expo",
        dateStr: "14th Apr 2026",
        sessions: [
          { id: "s10", name: "SESSION A", time: "10:00 AM TO 01:00 PM" },
          { id: "s11", name: "SESSION B", time: "02:00 PM TO 05:00 PM" },
        ],
      },
      {
        id: "evt_9",
        eventName: "Startup Pitch 2026",
        dateStr: "18th May 2026",
        sessions: [{ id: "s12", name: "PITCH SESSION", time: "11:00 AM TO 03:00 PM" }],
      },
      {
        id: "evt_10",
        eventName: "Frankline Airline AGM 2026",
        dateStr: "15 Jul 2026",
        sessions: [{ id: "s13", name: "ENTRY SESSION", time: "01:00 PM TO 03:00 PM" }],
      },
    ],
  },
  {
    id: "7",
    name: "Eleanor Pena",
    email: "michelle.rivera@example.com",
    phone: "(684) 555-0102",
    assignedEvents: [
      {
        id: "evt_1",
        eventName: "Nivita Birthday",
        dateStr: "3rd June 2026",
        sessions: [
          { id: "s1", name: "LUNCH SESSION", time: "12:30 PM TO 4:30 PM" },
          { id: "s2", name: "ENTRY SESSION", time: "06:30 PM TO 12:00 AM" },
        ],
      },
      {
        id: "evt_2",
        eventName: "Sumanta Marriage Anniversary",
        dateStr: "3rd Aug 2026",
        sessions: [{ id: "s3", name: "DINNER SESSION", time: "08:30 PM TO 11:30 PM" }],
      },
      {
        id: "evt_3",
        eventName: "Product Launch Event 2026",
        dateStr: "10th May 2026",
        sessions: [
          { id: "s4", name: "ENTRY SESSION", time: "09:00 AM TO 12:00 PM" },
          { id: "s5", name: "KEYNOTE SESSION", time: "01:00 PM TO 04:00 PM" },
        ],
      },
      {
        id: "evt_4",
        eventName: "Annual Tech Summit",
        dateStr: "15th Aug 2026",
        sessions: [
          { id: "s6", name: "MORNING SESSION", time: "09:00 AM TO 01:00 PM" },
          { id: "s7", name: "EVENING SESSION", time: "05:00 PM TO 09:00 PM" },
        ],
      },
    ],
  },
  {
    id: "8",
    name: "Suzana Parveen",
    email: "michelle.rivera@example.com",
    phone: "(684) 555-0102",
    assignedEvents: [
      {
        id: "evt_1",
        eventName: "Nivita Birthday",
        dateStr: "3rd June 2026",
        sessions: [
          { id: "s1", name: "LUNCH SESSION", time: "12:30 PM TO 4:30 PM" },
          { id: "s2", name: "ENTRY SESSION", time: "06:30 PM TO 12:00 AM" },
        ],
      },
      {
        id: "evt_2",
        eventName: "Sumanta Marriage Anniversary",
        dateStr: "3rd Aug 2026",
        sessions: [{ id: "s3", name: "DINNER SESSION", time: "08:30 PM TO 11:30 PM" }],
      },
    ],
  },
];

export default function AllUsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<SystemUserRow[]>(DEFAULT_ALL_USERS);
  const [expandedUserIds, setExpandedUserIds] = useState<string[]>(["1"]);
  const [searchQuery, setSearchQuery] = useState("");
  // Selected IDs matching reference Image 2: 5 selected users (1, 3, 4, 6, 8)
  const [selectedIds, setSelectedIds] = useState<string[]>(["1", "3", "4", "6", "8"]);
  const [activeActionId, setActiveActionId] = useState<string | null>(null);

  // Modals
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isAssignSuccessModalOpen, setIsAssignSuccessModalOpen] = useState(false);

  // Form selections
  const [eventsList, setEventsList] = useState<{ id: string; name: string }[]>([
    { id: "evt_3", name: "Product Launch Event 2026" },
    { id: "evt_1", name: "Nivita Birthday - 3rd June 2026" },
    { id: "evt_2", name: "Sumanta Marriage Anniversary - 3rd Aug 2026" },
    { id: "evt_10", name: "Frankline Airline AGM 2026 - 15 Jul 2026" },
  ]);
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
          email: u.email || "user@example.com",
          phone: u.phone || u.contactNo || "+919000000000",
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

    const combined = [...localUsers];
    DEFAULT_ALL_USERS.forEach((def) => {
      if (!combined.some((item) => item.name.toLowerCase() === def.name.toLowerCase() && item.email.toLowerCase() === def.email.toLowerCase())) {
        combined.push(def);
      }
    });

    apiUsers.forEach((apiU) => {
      if (!combined.some((item) => item.email.toLowerCase() === apiU.email.toLowerCase())) {
        combined.push(apiU);
      }
    });

    setUsers(combined);
  };

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

  const toggleExpand = (id: string) => {
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

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    const remaining = users.filter((u) => !selectedIds.includes(u.id));
    setUsers(remaining);
    saveUsersToLocal(remaining);
    setSelectedIds([]);
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
          <h1 className="text-xl font-bold text-gray-900">All Users</h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200/80 px-3 py-1.5 rounded-full cursor-pointer transition-colors">
              <div className="w-7 h-7 rounded-full bg-gray-400 text-white flex items-center justify-center font-semibold text-xs">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-xs font-semibold text-gray-800">{user?.fullName || user?.email || "Super Admin"}</span>
              <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6 bg-white pb-24">
          {/* Controls Bar: Title + Search Bar on Left, + Add User Button on Right */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1 max-w-2xl">
              <h2 className="text-lg font-bold text-gray-900 shrink-0">System Users</h2>

              {/* Search Bar */}
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

            {/* + Add User Button */}
            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/user-management/add"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FF5B22] hover:bg-[#E04B16] text-white text-xs font-semibold rounded-md transition-colors cursor-pointer shadow-2xs"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add User</span>
              </Link>
            </div>
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
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-400 text-sm">
                      No users to display. Create users using the Add User button.
                    </td>
                  </tr>
                )}
                {filteredUsers.map((u) => {
                  const isExpanded = expandedUserIds.includes(u.id);
                  const isSelected = selectedIds.includes(u.id);
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

                      {/* Assigned Events & Sessions */}
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

                        {/* Expanded Cards View matching Screenshot 1 & 2 */}
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

                      {/* Action Column */}
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
                          <div
                            onClick={() => {
                              setActiveActionId(null);
                              setIsAssignModalOpen(true);
                            }}
                            className="absolute right-4 top-12 z-30 bg-[#1E232A] text-white text-xs font-semibold px-3 py-2 rounded-md shadow-xl border border-gray-700 animate-in fade-in duration-150 flex items-center gap-2 cursor-pointer hover:bg-gray-800"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
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

          {/* Bottom Control Bar: Trash Icon + Dynamic "Assign X users ->" Button (Image 2) */}
          <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-end gap-3">
            {selectedIds.length > 0 && (
              <button
                type="button"
                onClick={handleDeleteSelected}
                title="Delete Selected Users"
                className="p-2 text-[#FF5B22] hover:bg-orange-50 rounded-md transition-colors cursor-pointer shrink-0"
              >
                <svg className="w-5 h-5 text-[#FF5B22]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsAssignModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#FF5B22] text-[#FF5B22] hover:bg-[#FF5B22] hover:text-white font-bold text-xs rounded-md transition-colors cursor-pointer shrink-0"
            >
              <span>
                Assign {selectedIds.length} {selectedIds.length === 1 ? "user" : "users"}
              </span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </main>

      {/* ── Assign User Modal (Image 3) ── */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-md border border-gray-200 shadow-2xl max-w-md w-full overflow-hidden space-y-6">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900">Assign User</h3>
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
              {/* Event Dropdown */}
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

              {/* Session Dropdown */}
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

      {/* ── Assigned Successfully! Modal (Image 4) ── */}
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
