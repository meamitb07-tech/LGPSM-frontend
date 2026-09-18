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

interface WheelColumnProps {
  items: string[];
  selectedIndex: number;
  onChange: (index: number) => void;
}

function WheelColumn({ items, selectedIndex, onChange }: WheelColumnProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const startYRef = useRef(0);
  const startScrollTopRef = useRef(0);
  const ITEM_HEIGHT = 40; // 40px row height

  // Sync scroll position when selectedIndex changes
  useEffect(() => {
    if (containerRef.current) {
      const targetScroll = selectedIndex * ITEM_HEIGHT;
      if (Math.abs(containerRef.current.scrollTop - targetScroll) > 2) {
        containerRef.current.scrollTo({
          top: targetScroll,
          behavior: "smooth",
        });
      }
    }
  }, [selectedIndex]);

  const handleScroll = () => {
    if (!containerRef.current) return;
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
      {/* Top Spacer: 60px height to align 1st row in vertical center of 160px box */}
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

      {/* Bottom Spacer: 60px height */}
      <div style={{ height: 60 }} className="shrink-0 pointer-events-none" />
    </div>
  );
}

export default function DateTimePickerModal({
  isOpen,
  onClose,
  onSave,
  initialValue = "15/01/26 09.00 AM",
}: DateTimePickerModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const [selectedDay, setSelectedDay] = useState(15);
  const [selectedHourIndex, setSelectedHourIndex] = useState(8); // "09"
  const [selectedMinIndex, setSelectedMinIndex] = useState(0);   // "00"
  const [selectedAmpmIndex, setSelectedAmpmIndex] = useState(0);  // "AM"

  useEffect(() => {
    if (initialValue) {
      const parts = initialValue.trim().split(" ");
      if (parts.length >= 3) {
        const dayPart = parts[0].split("/")[0];
        const parsedDay = parseInt(dayPart, 10);
        if (!isNaN(parsedDay)) setSelectedDay(parsedDay);

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

  const handleSave = () => {
    const dayStr = selectedDay < 10 ? `0${selectedDay}` : `${selectedDay}`;
    const hourStr = HOURS[selectedHourIndex];
    const minStr = MINUTES[selectedMinIndex];
    const ampmStr = AMPM[selectedAmpmIndex];
    const result = `${dayStr}/01/26 ${hourStr}.${minStr} ${ampmStr}`;
    onSave(result);
    onClose();
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto font-sans"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col my-auto border border-gray-100"
      >
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
          <div className="sm:col-span-7 bg-[#F4F5F8] p-4 rounded-xl border border-gray-100">
            {/* Header: Chevrons + Month */}
            <div className="flex items-center justify-between mb-3 px-1">
              <button className="text-[#FF5B22] hover:opacity-80 text-sm font-bold cursor-pointer px-1">
                &lt;
              </button>
              <span className="text-xs font-bold text-gray-900">Jan 2026</span>
              <button className="text-[#FF5B22] hover:opacity-80 text-sm font-bold cursor-pointer px-1">
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
              {/* Previous Month (Orange light) */}
              <span className="text-[#FDBA74]">30</span>
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

              {/* Day 15 (Selected with Blue Underline) */}
              <button
                onClick={() => setSelectedDay(15)}
                className={`mx-auto flex items-center justify-center text-xs font-bold cursor-pointer transition-colors ${
                  selectedDay === 15
                    ? "text-[#2563EB] border-b-2 border-[#2563EB] pb-0.5"
                    : "hover:text-[#FF5B22] text-gray-900"
                }`}
              >
                15
              </button>

              <span>16</span>
              <span>17</span>
              <span>18</span>
              <span>19</span>
              <span>20</span>

              <span>21</span>
              <span>22</span>
              <span>23</span>
              <span>24</span>
              <span>25</span>
              <span>26</span>
              <span>27</span>

              <span>28</span>
              <span>29</span>
              <span>30</span>
              <span>31</span>

              {/* Next Month (Orange light) */}
              <span className="text-[#FDBA74]">01</span>
              <span className="text-[#FDBA74]">02</span>
              <span className="text-[#FDBA74]">03</span>
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
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
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
