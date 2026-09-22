"use client";

import React, { useState } from "react";
import PricePerHeadCard from "@/components/settings/PricePerHeadCard";
import PriceHistoryTable from "@/components/settings/PriceHistoryTable";
import { initialPriceHistory } from "@/data/priceRateData";
import { PriceHistoryRecord } from "@/types/priceRate";
import { useAuth } from "@/context/AuthContext";
import UserNavDropdown from "@/components/common/UserNavDropdown";

export default function PriceRateSettingsPage() {
  const { user } = useAuth();
  const [currentRate, setCurrentRate] = useState<number>(3.0);
  const [history, setHistory] = useState<PriceHistoryRecord[]>(initialPriceHistory);

  const handleSaveRate = (newRateVal: number) => {
    if (newRateVal === currentRate) return;

    const record: PriceHistoryRecord = {
      id: Date.now().toString(),
      dateTime: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      previousRate: currentRate,
      newRate: newRateVal,
      changeType: newRateVal > currentRate ? "Increase" : "Decrease",
      status: "Active",
    };

    setHistory((prev) => [
      record,
      ...prev.map((item) => ({ ...item, status: "Suspended" as const })),
    ]);
    setCurrentRate(newRateVal);
  };

  return (
    <div className="w-full min-h-full bg-white">
      {/* Header */}
      <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between shrink-0 sticky top-0 z-20">
        <h1 className="text-base font-bold text-gray-800">Price Rate Settings</h1>
        <UserNavDropdown />
      </header>

      {/* Page Content */}
      <div className="p-6 max-w-7xl w-full mx-auto space-y-6 pb-24">
        <PricePerHeadCard currentRate={currentRate} onSaveRate={handleSaveRate} />
        <PriceHistoryTable history={history} />
      </div>
    </div>
  );
}
