"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { SAMPLE_INVITEE_LOGS, SAMPLE_ACCESS_LOGS, SAMPLE_SESSIONS_REPORT } from "@/data/reportsData";
import ReportsHeaderControls from "@/components/reports/ReportsHeaderControls";
import ReportsStatsCards from "@/components/reports/ReportsStatsCards";
import ReportsCharts from "@/components/reports/ReportsCharts";
import ReportsLogsTable from "@/components/reports/ReportsLogsTable";

export default function ReportsPage() {
  const { user } = useAuth();
  const [selectedOrganizer, setSelectedOrganizer] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("Product Launch Event 2026");
  const [activeTab, setActiveTab] = useState<"invitees" | "access" | "sessions">("invitees");
  const [searchQuery, setSearchQuery] = useState("");
  const [tableSearch, setTableSearch] = useState("");

  const downloadReportCSV = () => {
    let content = "";
    if (activeTab === "invitees") {
      content = "Invitee Name,Mobile No.,Invitation Status,RSVP Status,Check-in Status,Last Check-in Time,Entry Session,Lunch Session\n" +
        SAMPLE_INVITEE_LOGS.map(i => `"${i.name}","${i.mobile}","${i.invitationStatus}","${i.rsvpStatus}","${i.checkInStatus}","${i.lastCheckInTime}",${i.entrySession ? "Yes" : "No"},${i.lunchSession ? "Yes" : "No"}`).join("\n");
    } else if (activeTab === "access") {
      content = "User Type,Date & Time,Action,Status\n" +
        SAMPLE_ACCESS_LOGS.map(a => `"${a.userType}","${a.dateTime}","${a.action}","${a.status}"`).join("\n");
    } else {
      content = "#,Session Name,Date & Time,Invitees,Attendees,Access Control,System Users\n" +
        SAMPLE_SESSIONS_REPORT.map(s => `${s.id},"${s.name}","${s.dateTime}",${s.invitees},${s.attendees},"${s.accessControl}","${s.systemUsers}"`).join("\n");
    }

    const blob = new Blob([content], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `report_${activeTab}_logs.csv`;
    a.click();
  };

  const filteredInviteeLogs = SAMPLE_INVITEE_LOGS.filter(i =>
    i.name.toLowerCase().includes(tableSearch.toLowerCase()) || i.mobile.includes(tableSearch)
  );

  const filteredAccessLogs = SAMPLE_ACCESS_LOGS.filter(a =>
    a.userType.toLowerCase().includes(tableSearch.toLowerCase()) || a.action.toLowerCase().includes(tableSearch.toLowerCase())
  );

  const filteredSessions = SAMPLE_SESSIONS_REPORT.filter(s =>
    s.name.toLowerCase().includes(tableSearch.toLowerCase())
  );

  return (
    <div className="w-full min-h-full bg-white text-gray-900 font-sans select-none">
      <header className="h-20 bg-white border-b border-gray-200 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-20 shrink-0">
        <h1 className="text-xl font-bold text-gray-900">Reports</h1>
        <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full">
          <div className="w-7 h-7 rounded-full bg-gray-400 text-white flex items-center justify-center font-semibold text-xs">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-xs font-semibold text-gray-800">{user?.fullName || user?.email || "Account Name"}</span>
        </div>
      </header>

      <div className="p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6 bg-white pb-24">
        <ReportsHeaderControls
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedOrganizer={selectedOrganizer}
          setSelectedOrganizer={setSelectedOrganizer}
          selectedEvent={selectedEvent}
          setSelectedEvent={setSelectedEvent}
          onDownloadReport={downloadReportCSV}
        />

        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{selectedEvent}</h2>
            <span className="border border-orange-400 text-[#FF5B22] rounded-md px-2 py-0.5 text-[10px] font-semibold bg-orange-50/50">
              Personal Event
            </span>
          </div>
          <p className="text-xs text-gray-500 font-medium">
            <span className="font-semibold text-gray-700">Start:</span> 5/1/2026. 10.00 am | <span className="font-semibold text-gray-700">End:</span> 5/1/2026. 4.30 pm
          </p>
        </div>

        <ReportsStatsCards />
        <ReportsCharts />
        <ReportsLogsTable
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tableSearch={tableSearch}
          setTableSearch={setTableSearch}
          onDownloadCSV={downloadReportCSV}
          inviteeLogs={filteredInviteeLogs}
          accessLogs={filteredAccessLogs}
          sessionsReport={filteredSessions}
        />
      </div>
    </div>
  );
}
