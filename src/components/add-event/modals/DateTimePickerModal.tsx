"use client";

import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";

interface DateTimePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Receives the chosen instant as an ISO string
  onSave: (iso: string) => void;
  // Current value (ISO); the picker opens on it, or on "now" when empty
  value?: string | null;
  title?: string;
}

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export default function DateTimePickerModal({
  isOpen,
  onClose,
  onSave,
  value,
  title,
}: DateTimePickerModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // The parent remounts the picker (via key) each time it opens, so state starts from the current value
  const initial = (() => {
    const parsed = value ? new Date(value) : null;
    return parsed && !isNaN(parsed.getTime()) ? parsed : new Date();
  })();

  const [currentYear, setCurrentYear] = useState(() => initial.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(() => initial.getMonth()); // 0-indexed
  const [selectedDay, setSelectedDay] = useState(() => initial.getDate());

  // Time as "HH:MM" in 24-hour format — native <input type="time"> is the most reliable way to capture this
  const [timeValue, setTimeValue] = useState<string>(() => {
    const h = initial.getHours().toString().padStart(2, "0");
    const m = initial.getMinutes().toString().padStart(2, "0");
    return `${h}:${m}`;
  });

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

  // Calendar calculations
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun
  const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleSave = () => {
    // Parse time from "HH:MM"
    const [hourStr, minStr] = timeValue.split(":");
    const hour = parseInt(hourStr, 10) || 0;
    const minute = parseInt(minStr, 10) || 0;
    // Clamp day in case the month changed after picking e.g. the 31st
    const day = Math.min(selectedDay, daysInMonth);
    const chosen = new Date(currentYear, currentMonth, day, hour, minute, 0, 0);
    onSave(chosen.toISOString());
    onClose();
  };

  // Format time for display (12-hour AM/PM)
  const displayTime = (() => {
    const [h, m] = timeValue.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = (h % 12 || 12).toString().padStart(2, "0");
    return `${h12}:${(m || 0).toString().padStart(2, "0")} ${ampm}`;
  })();

  // Build grid items
  const calendarCells: React.ReactNode[] = [];

  // 1. Previous month padding
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const dayNum = prevMonthDays - i;
    calendarCells.push(
      <span key={`prev-${dayNum}`} className="text-[#FDBA74] py-1 cursor-default">
        {dayNum < 10 ? `0${dayNum}` : dayNum}
      </span>
    );
  }

  // 2. Current month days (ALL CLICKABLE)
  for (let day = 1; day <= daysInMonth; day++) {
    const isSelected = day === Math.min(selectedDay, daysInMonth);
    const dayDisplay = day < 10 ? `0${day}` : `${day}`;
    calendarCells.push(
      <button
        key={`curr-${day}`}
        type="button"
        onClick={() => setSelectedDay(day)}
        className={`mx-auto flex items-center justify-center text-xs font-bold cursor-pointer transition-colors py-1 ${
          isSelected
            ? "text-[#2563EB] border-b-2 border-[#2563EB] pb-0.5"
            : "hover:text-[#FF5B22] text-gray-900"
        }`}
      >
        {dayDisplay}
      </button>
    );
  }

  // 3. Next month padding
  const totalCellsSoFar = calendarCells.length;
  const remainingCells = (7 - (totalCellsSoFar % 7)) % 7;
  for (let i = 1; i <= remainingCells; i++) {
    calendarCells.push(
      <span key={`next-${i}`} className="text-[#FDBA74] py-1 cursor-default">
        {i < 10 ? `0${i}` : i}
      </span>
    );
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto font-sans"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-md border border-gray-200 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col my-auto"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-base font-bold text-gray-900">{title || "Select Date & Time"}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content Body: Calendar (Left) + Time Picker (Right) */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
          {/* Left Side: Calendar Grid */}
          <div className="sm:col-span-7 bg-[#F4F5F8] p-4 rounded-md border border-gray-200">
            {/* Header: Chevrons + Month */}
            <div className="flex items-center justify-between mb-3 px-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="text-[#FF5B22] hover:opacity-80 text-sm font-bold cursor-pointer px-1"
              >
                &lt;
              </button>
              <span className="text-xs font-bold text-gray-900">
                {MONTH_NAMES[currentMonth]} {currentYear}
              </span>
              <button
                type="button"
                onClick={handleNextMonth}
                className="text-[#FF5B22] hover:opacity-80 text-sm font-bold cursor-pointer px-1"
              >
                &gt;
              </button>
            </div>

            {/* Day Headers (Orange Font) */}
            <div className="grid grid-cols-7 text-center text-[11px] font-bold text-[#FF5B22] mb-2">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* Month Days Grid */}
            <div className="grid grid-cols-7 text-center gap-y-1.5 text-xs font-medium text-gray-800">
              {calendarCells}
            </div>
          </div>

          {/* Right Side: Time Picker */}
          <div className="sm:col-span-5 flex flex-col gap-4">
            {/* Selected date summary */}
            <div className="bg-[#FF5B22]/5 border border-[#FF5B22]/20 rounded-lg p-3 text-center">
              <p className="text-[11px] text-gray-500 font-medium mb-0.5">Selected Date</p>
              <p className="text-sm font-bold text-gray-900">
                {Math.min(selectedDay, daysInMonth).toString().padStart(2, "0")}{" "}
                {MONTH_NAMES[currentMonth]} {currentYear}
              </p>
            </div>

            {/* Time input */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700">
                Time
              </label>
              <div className="relative">
                <input
                  type="time"
                  value={timeValue}
                  onChange={(e) => setTimeValue(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border-2 border-[#FF5B22]/40 focus:border-[#FF5B22] rounded-lg text-sm font-bold text-gray-900 text-center outline-none transition-colors cursor-pointer"
                  style={{ colorScheme: "light" }}
                />
              </div>
              <p className="text-center text-xs font-semibold text-gray-500">
                {displayTime}
              </p>
            </div>

            {/* Quick time presets */}
            <div className="space-y-1.5">
              <p className="text-[11px] font-semibold text-gray-500">Quick Select</p>
              <div className="grid grid-cols-2 gap-1.5">
                {["09:00", "12:00", "15:00", "18:00", "20:00", "23:00"].map((t) => {
                  const [h, m] = t.split(":").map(Number);
                  const ampm = h >= 12 ? "PM" : "AM";
                  const h12 = (h % 12 || 12).toString().padStart(2, "0");
                  const label = `${h12}:${m.toString().padStart(2, "0")} ${ampm}`;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTimeValue(t)}
                      className={`py-1.5 px-2 text-[11px] font-bold rounded-md border transition-all cursor-pointer ${
                        timeValue === t
                          ? "bg-[#FF5B22] text-white border-[#FF5B22]"
                          : "bg-white text-gray-700 border-gray-200 hover:border-[#FF5B22] hover:text-[#FF5B22]"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 hover:bg-gray-50 text-gray-900 font-bold text-xs rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-7 py-2 bg-[#FF5B22] hover:bg-[#E04B16] text-white font-bold text-xs rounded-lg transition-all shadow-xs cursor-pointer"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
