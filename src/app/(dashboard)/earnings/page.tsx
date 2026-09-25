"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { EarningsRecord } from "@/types/earnings";
import EarningsOverviewCard from "@/components/earnings/EarningsOverviewCard";
import EarningsStatsRow from "@/components/earnings/EarningsStatsRow";
import EarningsTable from "@/components/earnings/EarningsTable";
import UserNavDropdown from "@/components/common/UserNavDropdown";
import { eventService } from "@/services/eventService";
import { userService } from "@/services/userService";

export default function EarningsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"organizer" | "event">("organizer");
  const [rate, setRate] = useState<number>(3.0);
  const [tempRate, setTempRate] = useState<number>(3.0);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("1/1/2026");
  const [endDate, setEndDate] = useState("30/4/2026");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  const [organizerRecords, setOrganizerRecords] = useState<EarningsRecord[]>([]);
  const [eventRecords, setEventRecords] = useState<EarningsRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEarnings() {
      setLoading(true);
      let events: any[] = [];
      try {
        const res = await eventService.getEvents();
        if (res?.success && Array.isArray(res.data)) {
          events = res.data;
        }
      } catch (e) {}

      try {
        const local = localStorage.getItem("app_local_events");
        if (local) {
          const parsed = JSON.parse(local);
          parsed.forEach((ev: any) => {
            const id = ev.id || ev._id;
            if (!events.some((e) => (e._id || e.id) === id)) {
              events.push(ev);
            }
          });
        }
      } catch (e) {}

      const mappedEventRecs: EarningsRecord[] = events.map((ev, idx) => {
        const evId = ev._id || ev.id || `evt_${idx}`;
        let inviteesCount = 0;
        try {
          const invData = localStorage.getItem(`app_local_invitees_${evId}`);
          if (invData) {
            const parsedInv = JSON.parse(invData);
            if (Array.isArray(parsedInv)) inviteesCount = parsedInv.length;
          }
        } catch (e) {}
        if (inviteesCount === 0) inviteesCount = 250;

        const currentRate = rate;
        return {
          id: `rec_evt_${idx + 1}`,
          organizer: ev.organizer || ev.organizerId?.fullName || "Admin",
          eventName: ev.title || ev.eventName || "Untitled Event",
          dateOfPayment: ev.createdAt ? new Date(ev.createdAt).toLocaleDateString() : "20/09/2026",
          invites: inviteesCount,
          rate: currentRate,
          amount: inviteesCount * currentRate,
        };
      });

      // Group by organizer for organizerRecords
      const orgMap = new Map<string, EarningsRecord>();
      mappedEventRecs.forEach((r) => {
        if (orgMap.has(r.organizer)) {
          const existing = orgMap.get(r.organizer)!;
          existing.invites += r.invites;
          existing.amount += r.amount;
        } else {
          orgMap.set(r.organizer, { ...r, id: `rec_org_${orgMap.size + 1}` });
        }
      });

      setEventRecords(mappedEventRecs);
      setOrganizerRecords(Array.from(orgMap.values()));
      setLoading(false);
    }

    loadEarnings();
  }, [rate]);

  const currentRecords = activeTab === "organizer" ? organizerRecords : eventRecords;

  const handleSaveRate = () => {
    setRate(tempRate);
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2500);

    setOrganizerRecords((prev) =>
      prev.map((r) => ({ ...r, rate: tempRate, amount: r.invites * tempRate }))
    );
    setEventRecords((prev) =>
      prev.map((r) => ({ ...r, rate: tempRate, amount: r.invites * tempRate }))
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === currentRecords.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(currentRecords.map((r) => r.id));
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
    if (activeTab === "organizer") {
      setOrganizerRecords((prev) => prev.filter((r) => !selectedIds.includes(r.id)));
    } else {
      setEventRecords((prev) => prev.filter((r) => !selectedIds.includes(r.id)));
    }
    setSelectedIds([]);
  };

  const exportCSV = () => {
    const headers = activeTab === "organizer"
      ? "Organizer,Event Name,Date of Payment,Invites,Rate,Amount\n"
      : "Event Name,Organizer,Date of Payment,Invites,Rate,Amount\n";

    const rows = currentRecords
      .map((r) =>
        activeTab === "organizer"
          ? `"${r.organizer}","${r.eventName}","${r.dateOfPayment}",${r.invites},$${r.rate},$${r.amount}`
          : `"${r.eventName}","${r.organizer}","${r.dateOfPayment}",${r.invites},$${r.rate},$${r.amount}`
      )
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `earnings_${activeTab}_report.csv`;
    a.click();
  };

  const filteredRecords = currentRecords.filter((r) =>
    r.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.eventName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full min-h-full bg-white">
      <header className="h-20 bg-white border-b border-gray-200 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-20 shrink-0">
        <div className="flex items-center gap-3">
          <svg className="w-7 h-7 text-[#FF5B22] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <h1 className="text-xl font-bold text-gray-900">Earnings</h1>
        </div>
        <UserNavDropdown />
      </header>

      <div className="p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6 bg-white pb-24">
        <EarningsOverviewCard
          rate={rate}
          tempRate={tempRate}
          setTempRate={setTempRate}
          onSaveRate={handleSaveRate}
          isSavedNotice={isSavedNotice}
        />

        <EarningsStatsRow />

        <EarningsTable
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          records={filteredRecords}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          selectedIds={selectedIds}
          toggleSelectAll={toggleSelectAll}
          toggleSelectRow={toggleSelectRow}
          onDeleteSelected={handleDeleteSelected}
          onExportCSV={exportCSV}
        />
      </div>
    </div>
  );
}
