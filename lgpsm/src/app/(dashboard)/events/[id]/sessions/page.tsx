"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/context/AuthContext";

interface SessionItem {
  id: string;
  num: string;
  title: string;
  dateTime: string;
  totalInvitees: number;
  systemUsers: string;
  accessControl: string;
}

const SAMPLE_SESSIONS: SessionItem[] = [
  {
    id: "1",
    num: "01",
    title: "Entry Session",
    dateTime: "15/1/2026 10:00 AM",
    totalInvitees: 510,
    systemUsers: "04",
    accessControl: "No Restriction",
  },
  {
    id: "2",
    num: "02",
    title: "Drink Sessions",
    dateTime: "15/1/2026 8:30 PM to 09:30 PM",
    totalInvitees: 140,
    systemUsers: "09",
    accessControl: "Only Once",
  },
  {
    id: "3",
    num: "03",
    title: "Dinner Sessions",
    dateTime: "15/1/2026 10:00 PM to 11:30 PM",
    totalInvitees: 510,
    systemUsers: "25",
    accessControl: "No Restriction",
  },
];

export default function EventSessionsPage() {
  const params = useParams();
  const eventId = (params?.id as string) || "1";
  const { user } = useAuth();

  const [sessions, setSessions] = useState<SessionItem[]>(SAMPLE_SESSIONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State for Add Session Modal
  const [sessionName, setSessionName] = useState("");
  const [startTime, setStartTime] = useState("05/01/26 10:00 AM");
  const [endTime, setEndTime] = useState("05/01/26 04:30 PM");
  const [accessControl, setAccessControl] = useState("No Restrictions");
  const [keepSameInvitees, setKeepSameInvitees] = useState(false);
  const [selectedSameSession, setSelectedSameSession] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFileName(e.target.files[0].name);
    }
  };

  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionName.trim()) return;

    const newSess: SessionItem = {
      id: String(Date.now()),
      num: String(sessions.length + 1).padStart(2, "0"),
      title: sessionName,
      dateTime: `${startTime} to ${endTime}`,
      totalInvitees: 0,
      systemUsers: "01",
      accessControl: accessControl,
    };

    setSessions([...sessions, newSess]);
    setSessionName("");
    setIsAddModalOpen(false);
  };

  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-white text-gray-900 font-sans">
      {/* Sidebar Navigation */}
      <Sidebar activeItem="event-management" />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Top Navigation Bar */}
        <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-20">
          <h1 className="text-lg font-bold text-gray-900">Event Sessions</h1>
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

        {/* Page Content - Directly on page background without card container */}
        <main className="p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6 bg-white">
          {/* Controls Bar: Title, Search, Back, + Add Session */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-6 flex-1 max-w-xl">
              <h2 className="text-xl font-bold text-gray-900 shrink-0">Sessions</h2>

              {/* Search Bar */}
              <div className="relative flex-1">
                <svg className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search invitees"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-[#F8F9FA] border border-gray-200 rounded-md text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#FF5B22]"
                />
              </div>
            </div>

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

              {/* + Add Session Button */}
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FF5B22] hover:bg-[#E04B16] text-white text-xs font-semibold rounded-md transition-colors cursor-pointer shadow-2xs"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Session</span>
              </button>
            </div>
          </div>

          {/* Sessions Data Table matching Image 2 */}
          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead>
                <tr className="border-b border-gray-100 text-gray-500 font-medium text-[11px]">
                  <th className="py-3 px-3 w-12 font-medium">#</th>
                  <th className="py-3 px-4 font-medium">Session Title</th>
                  <th className="py-3 px-4 font-medium">Date & Time</th>
                  <th className="py-3 px-4 font-medium">Total Invitees</th>
                  <th className="py-3 px-4 font-medium">System Users</th>
                  <th className="py-3 px-4 font-medium">Access Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-800">
                {filteredSessions.map((sess) => (
                  <tr key={sess.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-4 px-3 font-medium text-gray-400">{sess.num}</td>
                    <td className="py-4 px-4 font-medium text-gray-900">{sess.title}</td>
                    <td className="py-4 px-4 text-gray-600 font-normal">{sess.dateTime}</td>
                    <td className="py-4 px-4 font-normal text-gray-800">{sess.totalInvitees}</td>
                    <td className="py-4 px-4 font-normal text-gray-800">{sess.systemUsers}</td>
                    <td className="py-4 px-4 font-normal text-gray-700">{sess.accessControl}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* Add Session Modal matching Image 1 */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsAddModalOpen(false)}
          />

          <div className="relative bg-white rounded-md shadow-2xl max-w-lg w-full p-6 space-y-5 z-10">
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900">Add Session</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-md"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleCreateSession} className="space-y-4 text-xs">
              <div>
                <label className="flex items-center justify-between text-xs font-semibold text-gray-800 mb-1">
                  <span>
                    Session Name<span className="text-[#FF5B22] ml-0.5">*</span>
                  </span>
                  <span className="text-gray-400 text-[10px]" title="Enter session name">ⓘ</span>
                </label>
                <input
                  type="text"
                  placeholder="Entry Session"
                  value={sessionName}
                  onChange={(e) => setSessionName(e.target.value)}
                  required
                  className="w-full p-2.5 bg-[#F8F9FA] border border-gray-200 rounded-md text-gray-800 focus:outline-none focus:border-[#FF5B22]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="flex items-center justify-between text-[11px] font-semibold text-gray-800 mb-1">
                    <span>Start Time<span className="text-[#FF5B22] ml-0.5">*</span></span>
                    <span className="text-gray-400 text-[10px]">ⓘ</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full p-2 pr-7 border border-gray-200 rounded-md text-gray-800 text-[11px] focus:outline-none focus:border-[#FF5B22]"
                    />
                    <svg className="w-3.5 h-3.5 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>

                <div>
                  <label className="flex items-center justify-between text-[11px] font-semibold text-gray-800 mb-1">
                    <span>End Time<span className="text-[#FF5B22] ml-0.5">*</span></span>
                    <span className="text-gray-400 text-[10px]">ⓘ</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full p-2 pr-7 border border-gray-200 rounded-md text-gray-800 text-[11px] focus:outline-none focus:border-[#FF5B22]"
                    />
                    <svg className="w-3.5 h-3.5 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>

                <div>
                  <label className="flex items-center justify-between text-[11px] font-semibold text-gray-800 mb-1">
                    <span>Access Control</span>
                    <span className="text-gray-400 text-[10px]">ⓘ</span>
                  </label>
                  <select
                    value={accessControl}
                    onChange={(e) => setAccessControl(e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-md text-gray-800 text-[11px] bg-white focus:outline-none focus:border-[#FF5B22]"
                  >
                    <option value="No Restrictions">No Restrictions</option>
                    <option value="Only Once">Only Once</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <label className="flex items-center gap-2 text-xs text-gray-700 font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={keepSameInvitees}
                    onChange={(e) => setKeepSameInvitees(e.target.checked)}
                    className="w-4 h-4 accent-[#FF5B22] rounded"
                  />
                  <span>Keep same invitees as</span>
                </label>

                {keepSameInvitees && (
                  <select
                    value={selectedSameSession}
                    onChange={(e) => setSelectedSameSession(e.target.value)}
                    className="px-3 py-1 border border-gray-200 rounded-md text-xs text-gray-700 bg-white"
                  >
                    <option value="">-select-</option>
                    <option value="Entry Session">Entry Session</option>
                  </select>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-800 mb-1">
                  Add Invitees List
                </label>
                <div className="border border-gray-200 rounded-md p-2.5 flex items-center justify-between bg-[#F8F9FA]">
                  <div className="flex items-center gap-3">
                    <label className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-semibold rounded cursor-pointer transition-colors">
                      Choose File
                      <input
                        type="file"
                        accept=".xlsx,.xls,.csv"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                    <span className="text-xs text-gray-500 truncate">
                      {uploadedFileName || "No file choosn"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-1.5 mt-2 text-xs">
                  <div className="w-4 h-4 rounded bg-emerald-600 text-white font-bold flex items-center justify-center text-[9px]">
                    X
                  </div>
                  <button
                    type="button"
                    className="text-gray-800 font-semibold underline hover:text-[#FF5B22]"
                  >
                    Download Excel Sample
                  </button>
                  <span className="text-gray-400 text-[10px]">ⓘ</span>
                </div>
              </div>

              {/* Submit button: Orange outlined button + Add Session matching Image 1 */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 border border-[#FF5B22] text-[#FF5B22] hover:bg-[#FF5B22]/5 text-xs font-semibold rounded-md transition-colors cursor-pointer inline-flex items-center gap-1.5 bg-white"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Add Session</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
