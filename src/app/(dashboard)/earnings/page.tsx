"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { SAMPLE_ORGANIZER_RECORDS, SAMPLE_EVENT_RECORDS } from "@/data/earningsData";
import { EarningsRecord } from "@/types/earnings";
import EarningsOverviewCard from "@/components/earnings/EarningsOverviewCard";
import EarningsStatsRow from "@/components/earnings/EarningsStatsRow";
import EarningsTable from "@/components/earnings/EarningsTable";

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

  const [organizerRecords, setOrganizerRecords] = useState<EarningsRecord[]>(SAMPLE_ORGANIZER_RECORDS);
  const [eventRecords, setEventRecords] = useState<EarningsRecord[]>(SAMPLE_EVENT_RECORDS);

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
        <h1 className="text-xl font-bold text-gray-900">Earnings</h1>
        <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full cursor-pointer">
          <div className="w-7 h-7 rounded-full bg-gray-400 text-white flex items-center justify-center font-semibold text-xs">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-xs font-semibold text-gray-800">{user?.fullName || user?.email || "Account Name"}</span>
        </div>
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
