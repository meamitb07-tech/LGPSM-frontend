"use client";

import React from "react";
import { InviteeLog, AccessLog, SessionReport } from "@/types/reports";

interface ReportsLogsTableProps {
  activeTab: "invitees" | "access" | "sessions";
  setActiveTab: (tab: "invitees" | "access" | "sessions") => void;
  tableSearch: string;
  setTableSearch: (val: string) => void;
  onDownloadCSV: () => void;
  inviteeLogs: InviteeLog[];
  accessLogs: AccessLog[];
  sessionsReport: SessionReport[];
}

export default function ReportsLogsTable({
  activeTab,
  setActiveTab,
  tableSearch,
  setTableSearch,
  onDownloadCSV,
  inviteeLogs,
  accessLogs,
  sessionsReport,
}: ReportsLogsTableProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-md shadow-2xs overflow-hidden">
      {/* Tabs Header */}
      <div className="border-b border-gray-200 px-6 pt-4 flex items-center gap-8 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab("invitees")}
          className={`pb-3 font-semibold transition-colors cursor-pointer relative ${activeTab === "invitees"
              ? "text-gray-900 border-b-2 border-[#FF5B22]"
              : "text-gray-500 hover:text-gray-800"
            }`}
        >
          Invitee Logs
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("access")}
          className={`pb-3 font-semibold transition-colors cursor-pointer relative ${activeTab === "access"
              ? "text-gray-900 border-b-2 border-[#FF5B22]"
              : "text-gray-500 hover:text-gray-800"
            }`}
        >
          Access Logs
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("sessions")}
          className={`pb-3 font-semibold transition-colors cursor-pointer relative ${activeTab === "sessions"
              ? "text-gray-900 border-b-2 border-[#FF5B22]"
              : "text-gray-500 hover:text-gray-800"
            }`}
        >
          Sessions
        </button>
      </div>

      {/* Table Search & Actions Bar */}
      <div className="p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
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
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-md text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#FF5B22] transition-colors"
            />
          </div>

          <button
            type="button"
            onClick={onDownloadCSV}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#FF5B22] hover:text-[#E04B16] cursor-pointer"
          >
            <svg className="w-4 h-4 text-[#FF5B22]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Download List</span>
          </button>
        </div>

        {/* Table Render */}
        <div className="overflow-x-auto">
          {activeTab === "invitees" && (
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 font-medium text-[11px]">
                  <th className="py-3 px-4 font-medium">Invitee Name</th>
                  <th className="py-3 px-4 font-medium">Mobile No.</th>
                  <th className="py-3 px-4 font-medium">Invitation Status</th>
                  <th className="py-3 px-4 font-medium">RSVP Status</th>
                  <th className="py-3 px-4 font-medium">Check-in Status</th>
                  <th className="py-3 px-4 font-medium">Last Check-in Time</th>
                  <th className="py-3 px-4 font-medium">Entry Session</th>
                  <th className="py-3 px-4 font-medium">Lunch Session</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-gray-800">
                {inviteeLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-4 px-4 font-semibold text-gray-900">{log.name}</td>
                    <td className="py-4 px-4 text-gray-600">{log.mobile}</td>
                    <td className="py-4 px-4">
                      {log.invitationStatus === "Successfully Send" ? (
                        <span className="bg-emerald-100/70 text-emerald-700 px-3 py-1 rounded-full text-[11px] font-semibold inline-block">
                          Successfully Send
                        </span>
                      ) : (
                        <span className="bg-orange-100/70 text-orange-700 px-3 py-1 rounded-full text-[11px] font-semibold inline-block">
                          Sending failed
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      {log.rsvpStatus === "Accepted" && (
                        <span className="bg-blue-100/70 text-blue-700 px-3 py-1 rounded-full text-[11px] font-semibold inline-block">
                          Accepted
                        </span>
                      )}
                      {log.rsvpStatus === "Pending" && (
                        <span className="bg-amber-100/70 text-amber-700 px-3 py-1 rounded-full text-[11px] font-semibold inline-block">
                          Pending
                        </span>
                      )}
                      {log.rsvpStatus === "Declined" && (
                        <span className="bg-red-100/70 text-red-700 px-3 py-1 rounded-full text-[11px] font-semibold inline-block">
                          Declined
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      {log.checkInStatus === "Checked-in" && (
                        <span className="bg-emerald-600 text-white px-3 py-1 rounded-full text-[11px] font-semibold inline-block">
                          Checked-in
                        </span>
                      )}
                      {log.checkInStatus === "Not Checked-in" && (
                        <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-[11px] font-semibold inline-block">
                          Not Checked-in
                        </span>
                      )}
                      {log.checkInStatus === "Partially Checked-in" && (
                        <span className="border border-emerald-500 text-emerald-600 px-3 py-1 rounded-full text-[11px] font-semibold inline-block bg-emerald-50/30">
                          Partially Checked-in
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-gray-600">{log.lastCheckInTime}</td>
                    <td className="py-4 px-4 text-center">
                      {log.entrySession ? (
                        <svg className="w-4 h-4 text-emerald-600 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-orange-500 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {log.lunchSession ? (
                        <svg className="w-4 h-4 text-emerald-600 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-orange-500 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === "access" && (
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 font-medium text-[11px]">
                  <th className="py-3 px-4 font-medium">User Type</th>
                  <th className="py-3 px-4 font-medium">Date & Time</th>
                  <th className="py-3 px-4 font-medium">Action</th>
                  <th className="py-3 px-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-gray-800">
                {accessLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-4 px-4 font-semibold text-gray-900">{log.userType}</td>
                    <td className="py-4 px-4 text-gray-600">{log.dateTime}</td>
                    <td className="py-4 px-4 text-gray-700 font-medium">{log.action}</td>
                    <td className="py-4 px-4">
                      {log.status === "Successful" ? (
                        <span className="bg-emerald-100/70 text-emerald-700 px-3 py-1 rounded-full text-[11px] font-semibold inline-block">
                          Successful
                        </span>
                      ) : (
                        <span className="bg-orange-100/70 text-orange-700 px-3 py-1 rounded-full text-[11px] font-semibold inline-block">
                          failed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === "sessions" && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-gray-900">Sessions</h4>
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500 font-medium text-[11px]">
                    <th className="py-3 px-4 font-medium w-12">#</th>
                    <th className="py-3 px-4 font-medium">Session Name</th>
                    <th className="py-3 px-4 font-medium">Date & Time</th>
                    <th className="py-3 px-4 font-medium">Invitees</th>
                    <th className="py-3 px-4 font-medium">Attendees</th>
                    <th className="py-3 px-4 font-medium">Access Control</th>
                    <th className="py-3 px-4 font-medium">System Users</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-gray-800">
                  {sessionsReport.map((sess) => (
                    <tr key={sess.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-4 px-4 font-semibold text-gray-600">{sess.id}</td>
                      <td className="py-4 px-4 font-semibold text-gray-900">{sess.name}</td>
                      <td className="py-4 px-4 text-gray-600">{sess.dateTime}</td>
                      <td className="py-4 px-4 font-medium text-gray-900">{sess.invitees}</td>
                      <td className="py-4 px-4 font-medium text-gray-900">{sess.attendees}</td>
                      <td className="py-4 px-4 text-gray-700 font-medium">{sess.accessControl}</td>
                      <td className="py-4 px-4 font-medium text-gray-900">{sess.systemUsers}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
