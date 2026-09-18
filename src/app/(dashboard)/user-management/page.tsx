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
    assignedCountText: "3 Events & 4 Sessions",
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
      {
        eventName: "Frankline Airline AGM 2026 - 15 Jul 2026",
        sessions: [{ name: "ENTRY SESSION", time: "01:00 PM TO 03:00 PM" }],
      },
    ],
  },
  { id: "2", name: "Guy Hawkins", email: "bill.sanders@example.com", phone: "(316) 555-0116", assignedCountText: "4 Events & 4 Sessions" },
  { id: "3", name: "Marvin McKinney", email: "tim.jennings@example.com", phone: "(219) 555-0114", assignedCountText: "2 Events & 2 Sessions" },
  { id: "4", name: "Eleanor Pena", email: "michelle.rivera@example.com", phone: "(684) 555-0102", assignedCountText: "3 Events & 4 Sessions" },
  { id: "5", name: "Suzana Parveen", email: "michelle.rivera@example.com", phone: "(684) 555-0102", assignedCountText: "2 Events & 3 Sessions" },
];

export default function UserManagementPage() {
  const params = useParams();
  const eventId = (params?.id as string) || "1";
  const { user } = useAuth();

  const [users] = useState<SystemUserRow[]>(SAMPLE_SYSTEM_USERS);
  const [expandedUserIds, setExpandedUserIds] = useState<string[]>(["1"]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [activeActionId, setActiveActionId] = useState<string | null>("1");

  const toggleExpand = (id: string) => {
    if (expandedUserIds.includes(id)) {
      setExpandedUserIds(expandedUserIds.filter((i) => i !== id));
    } else {
      setExpandedUserIds([...expandedUserIds, id]);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone.includes(searchQuery)
  );

  return (
    <div className="flex min-h-screen bg-white text-gray-900 font-sans">
      {/* Sidebar Navigation */}
      <Sidebar activeItem="all-users" />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Top Navigation Bar */}
        <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-20">
          <h1 className="text-lg font-bold text-gray-900">Event</h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200/80 px-3 py-1.5 rounded-full cursor-pointer transition-colors">
              <div className="w-7 h-7 rounded-full bg-gray-400 text-white flex items-center justify-center font-semibold text-xs">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-xs font-semibold text-gray-800">Super Admin</span>
              <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6 bg-white">
          {/* Controls Bar: Title + Search Bar + Dropdown on Left, Action Button on Right */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Title & Search Bar inline */}
            <div className="flex items-center gap-4 flex-1 max-w-2xl">
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
                  placeholder="Search system user"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-[#F8F9FA] border border-gray-200 rounded-md text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#FF5B22]"
                />
              </div>

              {/* All Dropdown Filter */}
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-md text-xs text-gray-700 bg-white font-medium focus:outline-none cursor-pointer shrink-0"
              >
                <option value="All">All</option>
                <option value="Active">Active</option>
              </select>
            </div>

            {/* + Add User Button on Right */}
            <div className="flex items-center gap-3 shrink-0">
              <button className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FF5B22] hover:bg-[#E04B16] text-white text-xs font-semibold rounded-md transition-colors cursor-pointer shadow-2xs">
                <span>Add User</span>
              </button>
            </div>
          </div>

          {/* Users Table Container */}
          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead>
                <tr className="border-b border-gray-100 text-gray-500 font-medium text-[11px]">
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
                  const isActionActive = activeActionId === u.id;

                  return (
                    <tr key={u.id} className="hover:bg-gray-50/80 transition-colors">
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

                        {/* Expanded Card preview matching Image 5 */}
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

                      {/* Action Column with Dark "Edit User" Popover Tooltip (Image 5) */}
                      <td className="py-4 px-2 text-right relative">
                        <button
                          onClick={() => setActiveActionId(isActionActive ? null : u.id)}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6 10a2 2 0 110 4 2 2 0 010-4zm6 0a2 2 0 110 4 2 2 0 010-4zm6 0a2 2 0 110 4 2 2 0 010-4z" />
                          </svg>
                        </button>

                        {isActionActive && (
                          <div className="absolute right-0 top-12 z-30 bg-[#1E232A] text-white text-[11px] font-semibold px-3 py-2 rounded-md shadow-xl border border-gray-700 animate-in fade-in duration-150 flex items-center gap-1.5 cursor-pointer hover:bg-gray-800">
                            <span>Edit User</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
