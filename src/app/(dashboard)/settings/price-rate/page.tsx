"use client";

import React, { useState } from "react";
import PricePerHeadCard from "@/components/settings/PricePerHeadCard";
import PriceHistoryTable from "@/components/settings/PriceHistoryTable";
import { initialPriceHistory } from "@/data/priceRateData";
import { PriceHistoryRecord } from "@/types/priceRate";
import { useAuth } from "@/context/AuthContext";

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
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600">
            <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
          <span className="text-xs font-semibold text-gray-700">{user?.fullName || user?.email || "Account Name"}</span>
        </div>
      </header>

      {/* Page Content */}
      <div className="p-6 max-w-7xl w-full mx-auto space-y-6 pb-24">
        <PricePerHeadCard currentRate={currentRate} onSaveRate={handleSaveRate} />
        <PriceHistoryTable history={history} />
      </div>
    </div>
  );
}
