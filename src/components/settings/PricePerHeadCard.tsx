"use client";

import React, { useState } from "react";

interface PricePerHeadCardProps {
  currentRate: number;
  onSaveRate: (newRate: number) => void;
}

export default function PricePerHeadCard({
  currentRate,
  onSaveRate,
}: PricePerHeadCardProps) {
  const [sliderVal, setSliderVal] = useState<number>(currentRate);

  const handleSave = () => {
    onSaveRate(sliderVal);
  };

  return (
    <div className="bg-white rounded-md border border-gray-200/80 p-6 shadow-xs space-y-4">
      {/* Title Header */}
      <div>
        <h2 className="text-base font-bold text-gray-800">Price Per-Head</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Per-head billing · ${currentRate.toFixed(2)} / invitee (current rate)
        </p>
      </div>

      {/* Main Grid Card */}
      <div className="border border-gray-100 rounded-md p-6 bg-gray-50/20 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Side Big Rate Display */}
        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-[#FF5B22]">
              ${currentRate.toFixed(2)}
            </span>
            <span className="text-xs font-semibold text-gray-500">Per head</span>
          </div>
          <p className="text-xs text-gray-500">
            Per-head billing · ${currentRate.toFixed(2)} / invitee (current rate)
          </p>
        </div>

        {/* Right Side Slider Adjuster */}
        <div className="w-full md:w-96 bg-gray-50/80 border border-gray-200/60 rounded-md p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider text-gray-500 uppercase">
              ADJUST RATE
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1 space-y-1">
              <input
                type="range"
                min={1}
                max={20}
                step={1}
                value={sliderVal}
                onChange={(e) => setSliderVal(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#FF5B22]"
              />
              <div className="flex justify-between text-[10px] font-medium text-gray-400">
                <span>$1</span>
                <span>$10</span>
                <span>$20</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 bg-[#FF5B22] text-white text-xs font-semibold rounded-md hover:bg-[#e04f1d] transition-colors shadow-xs shrink-0"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
