"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/context/AuthContext";

interface SystemUserRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  assignedCountText: string;
  eventsList?: {
    eventName: string;
    sessions: { name: string; time: string }[];
  }[];
}

const SAMPLE_SYSTEM_USERS: SystemUserRow[] = [
  {
    id: "1",
    name: "Moloy Roy",
    email: "tanya.hill@example.com",
    phone: "9674259986",
    assignedCountText: "2 Events & 3 Sessions",
    eventsList: [
      {
        eventName: "Nivita Birthday - 3rd June 2026",
        sessions: [
          { name: "LUNCH SESSION", time: "12:30 PM TO 4:30 PM" },
          { name: "ENTRY SESSION", time: "06:30 PM TO 12:00 AM" },
        ],
      },
      {
        eventName: "Sumanta Marriage Anniversary - 3rd Aug 2026",
        sessions: [{ name: "DINNER SESSION", time: "08:30 PM TO 11:30 PM" }],
      },
    ],
  },
  { id: "2", name: "Wade Warren", email: "willie.jennings@example.com", phone: "(671) 555-0110", assignedCountText: "1 Event & 2 Sessions" },
  { id: "3", name: "Guy Hawkins", email: "bill.sanders@example.com", phone: "(316) 555-0116", assignedCountText: "4 Events & 4 Sessions" },
  { id: "4", name: "Marvin McKinney", email: "tim.jennings@example.com", phone: "(219) 555-0114", assignedCountText: "2 Events & 2 Sessions" },
  { id: "5", name: "Albert Flores", email: "dolores.chambers@example.com", phone: "(702) 555-0122", assignedCountText: "0 Event & 0 Session" },
  { id: "6", name: "Eleanor Pena", email: "michelle.rivera@example.com", phone: "(684) 555-0102", assignedCountText: "3 Events & 4 Sessions" },
  { id: "7", name: "Eleanor Pena", email: "michelle.rivera@example.com", phone: "(684) 555-0102", assignedCountText: "4 Events & 7 Sessions" },
  { id: "8", name: "Suzana Parveen", email: "michelle.rivera@example.com", phone: "(684) 555-0102", assignedCountText: "2 Events & 3 Sessions" },
];

export default function AssignSystemUsersPage() {
  const params = useParams();
  const eventId = (params?.id as string) || "1";
  const { user } = useAuth();

  const [users] = useState<SystemUserRow[]>(SAMPLE_SYSTEM_USERS);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>(["1", "3", "4", "6", "8"]);
  const [expandedUserIds, setExpandedUserIds] = useState<string[]>(["1"]);
  const [searchQuery, setSearchQuery] = useState("");

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState("Sharmistha Birthday Event 2026");
  const [selectedSession, setSelectedSession] = useState("Entry Session");

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

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone.includes(searchQuery)
  );

  const isAllSelected = selectedUserIds.length === users.length && users.length > 0;

  return (
    <div className="flex min-h-screen bg-white text-gray-900 font-sans">
      {/* Sidebar Navigation */}
      <Sidebar activeItem="user-management" />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Top Navigation Bar */}
        <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-20">
          <h1 className="text-lg font-bold text-gray-900">
            {isAssignModalOpen ? "Assign System Users" : "Assign Attendees"}
          </h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200/80 px-3 py-1.5 rounded-full cursor-pointer transition-colors">
              <div className="w-7 h-7 rounded-full bg-gray-400 text-white flex items-center justify-center font-semibold text-xs">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-xs font-semibold text-gray-800">
                {user?.fullName || "Jane Doe"}
              </span>
              <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6 relative pb-24 bg-white">
          {/* Controls Bar: Title + Search Bar on Left, Action Buttons on Right */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Title & Search Bar inline */}
            <div className="flex items-center gap-6 flex-1 max-w-xl">
              <h2 className="text-xl font-bold text-gray-900 shrink-0">System Users</h2>

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
                  className="w-full pl-9 pr-4 py-2 bg-[#F8F9FA] border border-gray-200 rounded-md text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#FF5B22]"
                />
              </div>
            </div>

            {/* Buttons on Right */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Back to Dashboard */}
              <Link
                href={`/events/${eventId}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 border border-[#FF5B22] text-[#FF5B22] hover:bg-[#FF5B22]/5 text-xs font-semibold rounded-md transition-colors cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to Dashboard</span>
              </Link>

              {/* + Add User Button */}
              <button className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FF5B22] hover:bg-[#E04B16] text-white text-xs font-semibold rounded-md transition-colors cursor-pointer shadow-2xs">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add User</span>
              </button>
            </div>
          </div>

          {/* Select All Row */}
          <div className="flex items-center gap-2.5 text-xs text-gray-700 font-medium pt-2 pb-2">
            <div
              onClick={handleSelectAll}
              className={`w-4 h-4 rounded-md border flex items-center justify-center cursor-pointer transition-colors ${
                isAllSelected
                  ? "bg-[#10B981] border-[#10B981]"
                  : "bg-white border-gray-300"
              }`}
            >
              {isAllSelected && (
                <svg className="w-3 h-3 text-white stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className="cursor-pointer select-none" onClick={handleSelectAll}>
              Select All
            </span>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead>
                <tr className="border-b border-gray-100 text-gray-500 font-medium text-[11px]">
                  <th className="py-3 px-2 w-8"></th>
                  <th className="py-3 px-4 font-medium">User Name</th>
                  <th className="py-3 px-4 font-medium">Assigned Events & Sessions</th>
                  <th className="py-3 px-4 font-medium">Email</th>
                  <th className="py-3 px-4 font-medium">Phone Number</th>
                  <th className="py-3 px-2 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-800">
                {filteredUsers.map((u) => {
                  const isExpanded = expandedUserIds.includes(u.id);
                  const isSelected = selectedUserIds.includes(u.id);

                  return (
                    <React.Fragment key={u.id}>
                      <tr className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-4 px-2">
                          <div
                            onClick={() => toggleSelectUser(u.id)}
                            className={`w-4 h-4 rounded-md border flex items-center justify-center cursor-pointer transition-colors ${
                              isSelected
                                ? "bg-[#10B981] border-[#10B981]"
                                : "bg-white border-gray-300"
                            }`}
                          >
                            {isSelected && (
                              <svg className="w-3 h-3 text-white stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4 font-medium text-gray-900">{u.name}</td>

                        {/* Assigned Events & Sessions with Expand toggle */}
                        <td className="py-4 px-4">
                          <button
                            onClick={() => toggleExpand(u.id)}
                            className="flex items-center gap-2 font-bold text-gray-800 hover:text-[#FF5B22] transition-colors cursor-pointer"
                          >
                            <svg
                              className={`w-3.5 h-3.5 text-gray-700 transform transition-transform ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                            <span>{u.assignedCountText}</span>
                          </button>

                          {/* Expanded Card preview matching Image 1 */}
                          {isExpanded && u.eventsList && (
                            <div className="mt-3 space-y-3 max-w-md">
                              {u.eventsList.map((evItem, idx) => (
                                <div
                                  key={idx}
                                  className="bg-white border border-gray-200 rounded-md p-3 shadow-2xs space-y-2 text-left whitespace-normal"
                                >
                                  <h5 className="font-semibold text-xs text-gray-800">
                                    {evItem.eventName}
                                  </h5>
                                  <div className="space-y-1.5">
                                    {evItem.sessions.map((sessItem, sIdx) => (
                                      <div key={sIdx} className="flex items-center gap-2">
                                        <div className="inline-flex items-center bg-[#FF5B22] text-white px-2.5 py-1 rounded-md text-[10px] font-bold tracking-tight">
                                          • {sessItem.name} | {sessItem.time}
                                        </div>
                                        <button
                                          type="button"
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

                        <td className="py-4 px-2 text-right">
                          <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M6 10a2 2 0 110 4 2 2 0 010-4zm6 0a2 2 0 110 4 2 2 0 010-4zm6 0a2 2 0 110 4 2 2 0 010-4z" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Bottom Row: Pagination & Sticky Action Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-gray-100 text-xs">
            {/* Pagination controls */}
            <div className="flex items-center gap-1.5">
              <button className="w-7 h-7 flex items-center justify-center bg-[#E5E7EB] text-gray-400 rounded-md font-semibold text-xs cursor-not-allowed">
                ‹
              </button>
              <button className="w-7 h-7 flex items-center justify-center border border-[#FF5B22] text-[#FF5B22] rounded-md font-bold text-xs">
                1
              </button>
              <button className="w-7 h-7 flex items-center justify-center border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-md font-medium text-xs">
                2
              </button>
              <span className="px-1 text-gray-400 font-medium">...</span>
              <button className="w-7 h-7 flex items-center justify-center border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-md font-medium text-xs">
                4
              </button>
              <button className="w-7 h-7 flex items-center justify-center border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-md font-medium text-xs">
                5
              </button>
              <button className="w-7 h-7 flex items-center justify-center border border-gray-200 text-gray-500 hover:bg-gray-50 rounded-md font-medium text-xs">
                ›
              </button>
            </div>

            {/* Bottom Right Sticky Action Button matching Image 1 */}
            {selectedUserIds.length > 0 && (
              <button
                onClick={() => setIsAssignModalOpen(true)}
                className="px-5 py-2 border border-[#FF5B22] text-[#FF5B22] bg-white hover:bg-[#FF5B22]/5 font-semibold text-xs rounded-md shadow-2xs transition-colors cursor-pointer inline-flex items-center gap-2"
              >
                <span>Assign {selectedUserIds.length} users</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            )}
          </div>
        </main>
      </div>

      {/* Assign System Users Modal (Matching Image 2) */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsAssignModalOpen(false)}
          />

          <div className="relative bg-white rounded-md shadow-2xl max-w-md w-full p-6 space-y-5 z-10">
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900">Assign System Users</h3>
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <div className="space-y-4 text-xs">
              {/* Event Select */}
              <div>
                <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                  Event<span className="text-[#FF5B22] ml-0.5">*</span>
                </label>
                <select
                  value={selectedEvent}
                  onChange={(e) => setSelectedEvent(e.target.value)}
                  className="w-full p-2.5 border border-gray-200 rounded-md text-gray-800 bg-[#F8F9FA] focus:outline-none focus:border-[#FF5B22]"
                >
                  <option value="Sharmistha Birthday Event 2026">
                    Sharmistha Birthday Event 2026
                  </option>
                  <option value="Product Launch Event 2025">Product Launch Event 2025</option>
                </select>
              </div>

              {/* Session Select */}
              <div>
                <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                  Session<span className="text-[#FF5B22] ml-0.5">*</span>
                </label>
                <select
                  value={selectedSession}
                  onChange={(e) => setSelectedSession(e.target.value)}
                  className="w-full p-2.5 border border-gray-200 rounded-md text-gray-800 bg-[#F8F9FA] focus:outline-none focus:border-[#FF5B22]"
                >
                  <option value="Entry Session">Entry Session</option>
                  <option value="Lunch Session">Lunch Session</option>
                </select>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="py-2 px-5 border border-gray-300 rounded-md text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="py-2 px-5 bg-[#FF5B22] hover:bg-[#E04B16] rounded-md text-xs font-semibold text-white transition-colors cursor-pointer shadow-2xs"
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
