"use client";

import React from "react";
import { PriceHistoryRecord } from "@/types/priceRate";

interface PriceHistoryTableProps {
  history: PriceHistoryRecord[];
}

export default function PriceHistoryTable({ history }: PriceHistoryTableProps) {
  const handleExportCSV = () => {
    const headers = "Date & Time,Previous Rate,New Rate,Change Type,Status\n";
    const rows = history
      .map(
        (r) =>
          `"${r.dateTime}",$${r.previousRate},$${r.newRate},${r.changeType},${r.status}`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "price-change-history.csv";
    a.click();
  };

  return (
    <div className="bg-white rounded-md border border-gray-200/80 p-6 shadow-xs space-y-4">
      {/* Table Header Row */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-gray-800">Price Change History</h2>
        <button
          onClick={handleExportCSV}
          className="text-xs font-semibold text-[#FF5B22] hover:underline transition-all"
        >
          Export CSV
        </button>
      </div>

      {/* History Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-gray-400 font-medium">
              <th className="py-3 px-4 font-normal">Date & Time</th>
              <th className="py-3 px-4 font-normal">Previous Rate</th>
              <th className="py-3 px-4 font-normal">New Rate</th>
              <th className="py-3 px-4 font-normal">Change Type</th>
              <th className="py-3 px-4 font-normal">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {history.map((item) => {
              const isIncrease = item.changeType === "Increase";
              const isActive = item.status === "Active";

              return (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-3.5 px-4 font-medium text-gray-800">
                    {item.dateTime}
                  </td>
                  <td className="py-3.5 px-4 text-gray-600">${item.previousRate}</td>
                  <td className="py-3.5 px-4 font-semibold text-gray-800">
                    ${item.newRate}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 font-medium ${
                        isIncrease ? "text-emerald-600" : "text-amber-600"
                      }`}
                    >
                      {item.changeType}
                      <span>{isIncrease ? "↑" : "↓"}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`font-semibold ${
                        isActive ? "text-emerald-600" : "text-amber-600"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
