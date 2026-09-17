"use client";

import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";

interface DateTimePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dateTimeString: string) => void;
  initialValue?: string;
}

export default function DateTimePickerModal({
  isOpen,
  onClose,
  onSave,
  initialValue = "15/01/26 10.00 AM",
}: DateTimePickerModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const [selectedDay, setSelectedDay] = useState(15);
  const [hour, setHour] = useState("09");
  const [minute, setMinute] = useState("00");
  const [ampm, setAmpm] = useState<"AM" | "PM">("AM");

  useEffect(() => {
    if (isOpen && overlayRef.current && modalRef.current) {
      const ctx = gsap.context(() => {
        gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25 });
        gsap.fromTo(
          modalRef.current,
          { scale: 0.8, opacity: 0, y: 15 },
          { scale: 1, opacity: 1, y: 0, duration: 0.35, ease: "back.out(1.2)" }
        );
      });
      return () => ctx.revert();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const hours = ["07", "08", "09", "10", "11"];
  const minutes = ["00", "15", "30", "45"];

  const handleSave = () => {
    const dayStr = selectedDay < 10 ? `0${selectedDay}` : `${selectedDay}`;
    const result = `${dayStr}/01/26 ${hour}.${minute} ${ampm}`;
    onSave(result);
    onClose();
  };

  return (
    <div ref={overlayRef} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto font-[family-name:var(--font-space-grotesk)]">
      <div ref={modalRef} className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col my-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">Select Date & Time</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content Body: Calendar (Left) + Wheel Picker (Right) */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
          {/* Left Side: Calendar Grid */}
          <div className="sm:col-span-7 bg-gray-50/70 p-4 rounded-xl border border-gray-100">
            <div className="flex items-center justify-between mb-3 px-1">
              <button className="text-gray-500 hover:text-gray-800 text-xs font-bold cursor-pointer">
                &lt;
              </button>
              <span className="text-xs font-bold text-gray-900">Jan 2026</span>
              <button className="text-gray-500 hover:text-gray-800 text-xs font-bold cursor-pointer">
                &gt;
              </button>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 text-center text-[10px] font-bold text-gray-400 mb-2">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* Month Days Grid */}
            <div className="grid grid-cols-7 text-center gap-y-1 text-xs font-medium text-gray-700">
              <span className="text-gray-300">28</span>
              <span className="text-gray-300">29</span>
              <span className="text-gray-300">30</span>
              <span className="text-gray-300">31</span>
              <span>01</span>
              <span>02</span>
              <span>03</span>

              <span>04</span>
              <span>05</span>
              <span>06</span>
              <span>07</span>
              <span>08</span>
              <span>09</span>
              <span>10</span>

              <span>11</span>
              <span>12</span>
              <span>13</span>
              <span>14</span>

              {/* Selected Day 15 */}
              {Array.from({ length: 17 }).map((_, i) => {
                const day = i + 15;
                const isSelected = day === selectedDay;
                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`h-7 w-7 mx-auto rounded-full flex items-center justify-center text-xs font-semibold cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-[#FF5B22] text-white font-bold shadow-xs"
                        : "hover:bg-gray-200 text-gray-800"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Side: Hour / Minute / AM-PM Picker */}
          <div className="sm:col-span-5 flex items-center justify-center gap-3 bg-gray-50/70 p-4 rounded-xl border border-gray-100">
            {/* Hours Column */}
            <div className="flex flex-col items-center space-y-2 max-h-44 overflow-y-auto pr-1">
              {hours.map((h) => (
                <button
                  key={h}
                  onClick={() => setHour(h)}
                  className={`text-sm font-bold px-2 py-1 rounded transition-colors cursor-pointer ${
                    hour === h ? "bg-white text-gray-900 shadow-xs border border-gray-200" : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {h}
                </button>
              ))}
            </div>

            <span className="text-base font-bold text-gray-400">:</span>

            {/* Minutes Column */}
            <div className="flex flex-col items-center space-y-2 max-h-44 overflow-y-auto px-1">
              {minutes.map((m) => (
                <button
                  key={m}
                  onClick={() => setMinute(m)}
                  className={`text-sm font-bold px-2 py-1 rounded transition-colors cursor-pointer ${
                    minute === m ? "bg-white text-gray-900 shadow-xs border border-gray-200" : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            {/* AM / PM Column */}
            <div className="flex flex-col items-center space-y-2 pl-1">
              <button
                onClick={() => setAmpm("AM")}
                className={`text-xs font-bold px-2 py-1 rounded transition-colors cursor-pointer ${
                  ampm === "AM" ? "bg-[#FF5B22] text-white shadow-xs" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                AM
              </button>
              <button
                onClick={() => setAmpm("PM")}
                className={`text-xs font-bold px-2 py-1 rounded transition-colors cursor-pointer ${
                  ampm === "PM" ? "bg-[#FF5B22] text-white shadow-xs" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                PM
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 border border-gray-300 text-gray-700 font-bold text-xs rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-[#FF5B22] hover:bg-[#E04B16] text-white font-bold text-xs rounded-lg transition-all shadow-xs cursor-pointer"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
