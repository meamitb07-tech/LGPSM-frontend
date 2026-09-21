"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { InviteeLog, AccessLog, SessionReport } from "@/types/reports";
import ReportsHeaderControls from "@/components/reports/ReportsHeaderControls";
import ReportsStatsCards from "@/components/reports/ReportsStatsCards";
import ReportsCharts from "@/components/reports/ReportsCharts";
import UserNavDropdown from "@/components/common/UserNavDropdown";
import ReportsLogsTable from "@/components/reports/ReportsLogsTable";
import { eventService } from "@/services/eventService";
import { userService } from "@/services/userService";
import { sessionService } from "@/services/sessionService";
import { inviteeService } from "@/services/inviteeService";

export default function ReportsPage() {
  const { user } = useAuth();
  const [selectedOrganizer, setSelectedOrganizer] = useState("");
  const [selectedEventId, setSelectedEventId] = useState("");
  const [selectedEventTitle, setSelectedEventTitle] = useState("Test Event");
  const [selectedEventDates, setSelectedEventDates] = useState({
    start: "25/11/2026 09:30 AM",
    end: "26/11/2026 06:00 PM",
  });
  const [activeTab, setActiveTab] = useState<"invitees" | "access" | "sessions">("invitees");
  const [searchQuery, setSearchQuery] = useState("");
  const [tableSearch, setTableSearch] = useState("");

  const [organizerOptions, setOrganizerOptions] = useState<{ value: string; label: string }[]>([]);
  const [eventOptions, setEventOptions] = useState<{ value: string; label: string }[]>([]);
  const [allEventsList, setAllEventsList] = useState<any[]>([]);

  const [inviteeLogs, setInviteeLogs] = useState<InviteeLog[]>([]);
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([]);
  const [sessionsReport, setSessionsReport] = useState<SessionReport[]>([]);
  const [systemUsersCount, setSystemUsersCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Organizers & Events List
  useEffect(() => {
    async function loadInitialData() {
      let orgs: { value: string; label: string }[] = [{ value: "", label: "All Organizers" }];
      try {
        const uRes = await userService.getUsers();
        if (uRes?.success && Array.isArray(uRes.data)) {
          setSystemUsersCount(uRes.data.length);
          uRes.data.forEach((u: any) => {
            if (u.role === "organizer" || u.role === "user") {
              orgs.push({ value: u._id || u.id, label: u.fullName || u.name || u.email });
            }
          });
        }
      } catch (e) {}

      try {
        const savedOrgs = localStorage.getItem("app_local_organizers");
        if (savedOrgs) {
          const parsed = JSON.parse(savedOrgs);
          parsed.forEach((o: any) => {
            if (!orgs.some((item) => item.label === o.name)) {
              orgs.push({ value: o.id, label: o.name });
            }
          });
        }
      } catch (e) {}
      setOrganizerOptions(orgs);

      // Load Events
      let evts: any[] = [];
      try {
        const eRes = await eventService.getEvents();
        if (eRes?.success && Array.isArray(eRes.data)) {
          evts = eRes.data;
        }
      } catch (e) {}

      try {
        const savedEvts = localStorage.getItem("app_local_events");
        if (savedEvts) {
          const parsed = JSON.parse(savedEvts);
          parsed.forEach((e: any) => {
            if (!evts.some((item) => (item._id || item.id) === (e._id || e.id))) {
              evts.push(e);
            }
          });
        }
      } catch (e) {}

      if (evts.length === 0) {
        evts = [{ id: "1", title: "Test Event", startDate: "25/11/2026 09:30 AM", endDate: "26/11/2026 06:00 PM" }];
      }

      setAllEventsList(evts);

      const formattedEvtOptions = evts.map((e) => ({
        value: e._id || e.id || "1",
        label: e.title || e.eventName || "Untitled Event",
      }));

      setEventOptions(formattedEvtOptions);

      if (formattedEvtOptions.length > 0) {
        const firstEvt = evts[0];
        setSelectedEventId(formattedEvtOptions[0].value);
        setSelectedEventTitle(formattedEvtOptions[0].label);
        setSelectedEventDates({
          start: firstEvt.startDate || firstEvt.schedule?.start || "25/11/2026 09:30 AM",
          end: firstEvt.endDate || firstEvt.schedule?.end || "26/11/2026 06:00 PM",
        });
      }
    }

    loadInitialData();
  }, []);

  // 2. Load Data for Selected Event
  useEffect(() => {
    if (!selectedEventId) return;

    async function loadEventDetails() {
      setLoading(true);
      const matchedEvt = allEventsList.find((e) => (e._id || e.id) === selectedEventId);
      if (matchedEvt) {
        setSelectedEventTitle(matchedEvt.title || matchedEvt.eventName || "Untitled Event");
        setSelectedEventDates({
          start: matchedEvt.startDate || matchedEvt.schedule?.start || "25/11/2026 09:30 AM",
          end: matchedEvt.endDate || matchedEvt.schedule?.end || "26/11/2026 06:00 PM",
        });
      }

      // Fetch invitees
      let invitees: any[] = [];
      try {
        const invRes = await inviteeService.getInvitees(selectedEventId);
        if (invRes?.success && Array.isArray(invRes.data)) {
          invitees = invRes.data;
        }
      } catch (e) {}

      if (invitees.length === 0) {
        const keysToTry = [
          `app_local_invitees_${selectedEventId}`,
          "app_local_invitees_1",
          "app_local_invitees_draft",
          "app_local_invitees",
        ];
        for (const k of keysToTry) {
          const cached = localStorage.getItem(k);
          if (cached) {
            try {
              const parsed = JSON.parse(cached);
              if (Array.isArray(parsed) && parsed.length > 0) {
                invitees = parsed;
                break;
              }
            } catch (err) {}
          }
        }
      }

      const formattedInvLogs: InviteeLog[] = invitees.map((inv, idx) => ({
        id: inv._id || inv.id || `inv_${idx + 1}`,
        name: inv.name || `Invitee ${idx + 1}`,
        mobile: inv.mobile || inv.phone || "+919000000000",
        invitationStatus: inv.status !== "Sending Failed" ? "Successfully Send" : "Sending failed",
        rsvpStatus: inv.rsvpStatus === "declined" ? "Declined" : inv.rsvpStatus === "accepted" ? "Accepted" : "Pending",
        checkInStatus: inv.entry !== false ? "Checked-in" : "Not Checked-in",
        lastCheckInTime: "10.15 am",
        entrySession: inv.entry !== false,
        lunchSession: inv.lunch !== false,
      }));

      // Fetch sessions
      let sessions: any[] = [];
      try {
        const sRes = await sessionService.getSessions(selectedEventId);
        if (sRes?.success && Array.isArray(sRes.data)) {
          sessions = sRes.data;
        }
      } catch (e) {}

      if (sessions.length === 0) {
        try {
          const cachedSess = localStorage.getItem(`app_local_sessions_${selectedEventId}`) || localStorage.getItem("app_local_sessions_1");
          if (cachedSess) sessions = JSON.parse(cachedSess);
        } catch (e) {}
      }

      if (sessions.length === 0) {
        sessions = [
          { id: "1", name: "Session 1 - Entry Session", accessControl: "No Restrictions", invitesCount: invitees.length },
          { id: "2", name: "Session 2 - Lunch Session", accessControl: "Only Once", invitesCount: invitees.length },
        ];
      }

      const formattedSessLogs: SessionReport[] = sessions.map((s, idx) => ({
        id: idx + 1,
        name: s.name || s.title || `Session ${idx + 1}`,
        dateTime: s.startTime || "25/11/2026 10.00 am",
        invitees: s.invitesCount || invitees.length,
        attendees: Math.floor((s.invitesCount || invitees.length) * 0.85),
        accessControl: s.accessControl || "No Restrictions",
        systemUsers: String(systemUsersCount || 5),
      }));

      // Access logs mock/real
      const formattedAccessLogs: AccessLog[] = [
        { id: "acc_1", userType: "Admin", dateTime: "25/11/2026 10:12 AM", action: "Invitee List Exported", status: "Successful" },
        { id: "acc_2", userType: "System User", dateTime: "25/11/2026 10:30 AM", action: "Invitee Checked In", status: "Successful" },
        { id: "acc_3", userType: "Event Organizer", dateTime: "25/11/2026 11:00 AM", action: "Session Updated", status: "Successful" },
      ];

      setInviteeLogs(formattedInvLogs);
      setSessionsReport(formattedSessLogs);
      setAccessLogs(formattedAccessLogs);
      setLoading(false);
    }

    loadEventDetails();
  }, [selectedEventId]);

  const downloadReportCSV = () => {
    let content = "";
    if (activeTab === "invitees") {
      content = "Invitee Name,Mobile No.,Invitation Status,RSVP Status,Check-in Status,Last Check-in Time,Entry Session,Lunch Session\n" +
        inviteeLogs.map(i => `"${i.name}","${i.mobile}","${i.invitationStatus}","${i.rsvpStatus}","${i.checkInStatus}","${i.lastCheckInTime}",${i.entrySession ? "Yes" : "No"},${i.lunchSession ? "Yes" : "No"}`).join("\n");
    } else if (activeTab === "access") {
      content = "User Type,Date & Time,Action,Status\n" +
        accessLogs.map(a => `"${a.userType}","${a.dateTime}","${a.action}","${a.status}"`).join("\n");
    } else {
      content = "#,Session Name,Date & Time,Invitees,Attendees,Access Control,System Users\n" +
        sessionsReport.map(s => `${s.id},"${s.name}","${s.dateTime}",${s.invitees},${s.attendees},"${s.accessControl}","${s.systemUsers}"`).join("\n");
    }

    const blob = new Blob([content], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `report_${activeTab}_logs.csv`;
    a.click();
  };

  const filteredInviteeLogs = inviteeLogs.filter(i =>
    i.name.toLowerCase().includes(tableSearch.toLowerCase()) || i.mobile.includes(tableSearch)
  );

  const filteredAccessLogs = accessLogs.filter(a =>
    a.userType.toLowerCase().includes(tableSearch.toLowerCase()) || a.action.toLowerCase().includes(tableSearch.toLowerCase())
  );

  const filteredSessions = sessionsReport.filter(s =>
    s.name.toLowerCase().includes(tableSearch.toLowerCase())
  );

  const checkedInAttendeesCount = inviteeLogs.filter((i) => i.checkInStatus === "Checked-in").length;

  return (
    <div className="w-full min-h-full bg-white text-gray-900 font-sans select-none">
      <header className="h-20 bg-white border-b border-gray-200 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-20 shrink-0">
        <h1 className="text-xl font-bold text-gray-900">Reports</h1>
        <UserNavDropdown />
      </header>

      <div className="p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6 bg-white pb-24">
        <ReportsHeaderControls
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedOrganizer={selectedOrganizer}
          setSelectedOrganizer={setSelectedOrganizer}
          selectedEvent={selectedEventId}
          setSelectedEvent={setSelectedEventId}
          onDownloadReport={downloadReportCSV}
          organizerOptions={organizerOptions}
          eventOptions={eventOptions}
        />

        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{selectedEventTitle}</h2>
            <span className="border border-orange-400 text-[#FF5B22] rounded-md px-2 py-0.5 text-[10px] font-semibold bg-orange-50/50">
              Personal Event
            </span>
          </div>
          <p className="text-xs text-gray-500 font-medium">
            <span className="font-semibold text-gray-700">Start:</span> {selectedEventDates.start} | <span className="font-semibold text-gray-700">End:</span> {selectedEventDates.end}
          </p>
        </div>

        <ReportsStatsCards
          totalInvitees={inviteeLogs.length}
          totalAttendees={checkedInAttendeesCount || inviteeLogs.length}
          totalSessions={sessionsReport.length}
          systemUsers={systemUsersCount || 5}
        />

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
