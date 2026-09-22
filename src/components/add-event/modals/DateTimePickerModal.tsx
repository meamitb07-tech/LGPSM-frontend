"use client";

import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";

interface DateTimePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dateTimeString: string) => void;
  initialValue?: string;
}

const HOURS = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
const MINUTES = Array.from({ length: 60 }, (_, i) => (i < 10 ? `0${i}` : `${i}`));
const AMPM = ["AM", "PM"];
const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

interface WheelColumnProps {
  items: string[];
  selectedIndex: number;
  onChange: (index: number) => void;
}

function WheelColumn({ items, selectedIndex, onChange }: WheelColumnProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const isProgrammaticRef = useRef(false);
  const startYRef = useRef(0);
  const startScrollTopRef = useRef(0);
  const ITEM_HEIGHT = 40;

  useEffect(() => {
    if (containerRef.current) {
      const targetScroll = selectedIndex * ITEM_HEIGHT;
      isProgrammaticRef.current = true;
      containerRef.current.scrollTop = targetScroll;
      const timer = setTimeout(() => {
        isProgrammaticRef.current = false;
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [selectedIndex]);

  const handleScroll = () => {
    if (!containerRef.current || isProgrammaticRef.current) return;
    const scrollTop = containerRef.current.scrollTop;
    const index = Math.round(scrollTop / ITEM_HEIGHT);
    if (index >= 0 && index < items.length && index !== selectedIndex) {
      onChange(index);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
    if (!containerRef.current) return;
    containerRef.current.scrollTop += e.deltaY;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    startYRef.current = e.clientY;
    if (containerRef.current) {
      startScrollTopRef.current = containerRef.current.scrollTop;
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !containerRef.current) return;
    const deltaY = e.clientY - startYRef.current;
    containerRef.current.scrollTop = startScrollTopRef.current - deltaY;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="h-40 overflow-y-auto overscroll-contain snap-y snap-mandatory relative z-10 cursor-grab active:cursor-grabbing select-none no-scrollbar w-full"
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      <div style={{ height: 60 }} className="shrink-0 pointer-events-none" />

      {items.map((item, idx) => {
        const isSelected = idx === selectedIndex;
        return (
          <div
            key={idx}
            onClick={() => {
              onChange(idx);
              if (containerRef.current) {
                containerRef.current.scrollTo({
                  top: idx * ITEM_HEIGHT,
                  behavior: "smooth",
                });
              }
            }}
            style={{ height: ITEM_HEIGHT }}
            className={`snap-center flex items-center justify-center transition-all text-center cursor-pointer ${
              isSelected
                ? "text-base font-bold text-gray-900 scale-105"
                : "text-xs font-semibold text-gray-300 hover:text-gray-500"
            }`}
          >
            {item}
          </div>
        );
      })}

      <div style={{ height: 60 }} className="shrink-0 pointer-events-none" />
    </div>
  );
}

export default function DateTimePickerModal({
  isOpen,
  onClose,
  onSave,
  initialValue,
}: DateTimePickerModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const [currentYear, setCurrentYear] = useState(() => new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(() => new Date().getMonth()); // 0-indexed
  const [selectedDay, setSelectedDay] = useState(() => new Date().getDate());
  const [selectedHourIndex, setSelectedHourIndex] = useState(() => {
    let h = new Date().getHours() % 12;
    h = h ? h : 12;
    const hIdx = HOURS.findIndex((item) => parseInt(item, 10) === h);
    return hIdx !== -1 ? hIdx : 8;
  });
  const [selectedMinIndex, setSelectedMinIndex] = useState(() => {
    const m = new Date().getMinutes();
    const mIdx = MINUTES.findIndex((item) => parseInt(item, 10) === m);
    return mIdx !== -1 ? mIdx : 0;
  });
  const [selectedAmpmIndex, setSelectedAmpmIndex] = useState(() => (new Date().getHours() >= 12 ? 1 : 0));

  useEffect(() => {
    if (initialValue) {
      const parts = initialValue.trim().split(" ");
      if (parts.length >= 3) {
        const dateParts = parts[0].split("/");
        if (dateParts.length >= 3) {
          const parsedDay = parseInt(dateParts[0], 10);
          const parsedMonth = parseInt(dateParts[1], 10) - 1;
          let parsedYear = parseInt(dateParts[2], 10);
          if (parsedYear < 100) parsedYear += 2000;

          if (!isNaN(parsedDay) && parsedDay >= 1 && parsedDay <= 31) setSelectedDay(parsedDay);
          if (!isNaN(parsedMonth) && parsedMonth >= 0 && parsedMonth < 12) setCurrentMonth(parsedMonth);
          if (!isNaN(parsedYear)) setCurrentYear(parsedYear);
        }

        const timePart = parts[1].replace(".", ":");
        const [h, m] = timePart.split(":");

        const hIdx = HOURS.findIndex((item) => parseInt(item, 10) === parseInt(h, 10));
        if (hIdx !== -1) setSelectedHourIndex(hIdx);

        const mIdx = MINUTES.findIndex((item) => parseInt(item, 10) === parseInt(m, 10));
        if (mIdx !== -1) setSelectedMinIndex(mIdx);

        const ampm = parts[2].toUpperCase();
        const aIdx = AMPM.findIndex((item) => item === ampm);
        if (aIdx !== -1) setSelectedAmpmIndex(aIdx);
      }
    } else {
      const now = new Date();
      setSelectedDay(now.getDate());
      setCurrentMonth(now.getMonth());
      setCurrentYear(now.getFullYear());

      let h = now.getHours() % 12;
      h = h ? h : 12;
      const hIdx = HOURS.findIndex((item) => parseInt(item, 10) === h);
      if (hIdx !== -1) setSelectedHourIndex(hIdx);

      const mIdx = MINUTES.findIndex((item) => parseInt(item, 10) === now.getMinutes());
      if (mIdx !== -1) setSelectedMinIndex(mIdx);

      setSelectedAmpmIndex(now.getHours() >= 12 ? 1 : 0);
    }
  }, [isOpen, initialValue]);

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
    const dayStr = selectedDay < 10 ? `0${selectedDay}` : `${selectedDay}`;
    const monthNum = currentMonth + 1;
    const monthStr = monthNum < 10 ? `0${monthNum}` : `${monthNum}`;
    const yearShortStr = String(currentYear).slice(-2);
    const hourStr = HOURS[selectedHourIndex];
    const minStr = MINUTES[selectedMinIndex];
    const ampmStr = AMPM[selectedAmpmIndex];
    const result = `${dayStr}/${monthStr}/${yearShortStr} ${hourStr}.${minStr} ${ampmStr}`;
    onSave(result);
    onClose();
  };

  // Build grid items
  const calendarCells = [];

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
    const isSelected = day === selectedDay;
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

          {/* Right Side: Wheel Scroll Picker */}
          <div className="sm:col-span-5 relative flex items-center justify-center py-2 h-44">
            {/* Gray Highlight Active Row Bar spanning horizontally in background */}
            <div className="absolute inset-x-0 h-10 bg-[#E8E8E8] rounded-lg pointer-events-none z-0 top-1/2 -translate-y-1/2" />

            {/* 3 Wheel Columns: Hours, Minutes, AM/PM */}
            <div className="relative z-10 grid grid-cols-3 gap-2 text-center w-full px-1 items-center">
              <WheelColumn
                items={HOURS}
                selectedIndex={selectedHourIndex}
                onChange={setSelectedHourIndex}
              />
              <WheelColumn
                items={MINUTES}
                selectedIndex={selectedMinIndex}
                onChange={setSelectedMinIndex}
              />
              <WheelColumn
                items={AMPM}
                selectedIndex={selectedAmpmIndex}
                onChange={setSelectedAmpmIndex}
              />
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
