"use client";

import React, { useState, useRef, useEffect } from "react";

export interface CustomDropdownOption {
  value: string;
  label: string;
}

export interface CustomDropdownAction {
  label: string;
  onClick: () => void;
}

interface CustomDropdownProps {
  value: string;
  onChange: (val: string) => void;
  options: CustomDropdownOption[];
  placeholder?: string;
  topAction?: CustomDropdownAction;
  disabled?: boolean;
  className?: string;
}

export default function CustomDropdown({
  value,
  onChange,
  options,
  placeholder = "- Select -",
  topAction,
  disabled = false,
  className = "",
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative w-full text-left ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-3.5 py-2.5 text-xs font-medium rounded-md border transition-all duration-150 flex items-center justify-between cursor-pointer select-none ${disabled
            ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
            : isOpen
              ? "bg-white border-[#FF5B22] ring-1 ring-[#FF5B22] shadow-xs text-gray-800"
              : "bg-white border-gray-200/90 hover:border-[#FF5B22] hover:bg-white text-gray-700"
          }`}
      >
        <span className={selectedOption ? "text-gray-800 font-semibold" : "text-gray-400 font-normal"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          className={`w-4 h-4 text-gray-400 shrink-0 transform transition-transform duration-200 ${isOpen ? "rotate-180 text-[#FF5B22]" : ""
            }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Floating Menu Panel */}
      {isOpen && !disabled && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-gray-100 rounded-md shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
          {/* Top Banner Action */}
          {topAction && (
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                topAction.onClick();
              }}
              className="w-full text-left px-3.5 py-2.5 bg-[#FF5B22] hover:bg-[#e04f1d] text-white font-semibold text-xs transition-colors flex items-center justify-between cursor-pointer"
            >
              <span>{topAction.label}</span>
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          )}

          {/* Options List */}
          <div className="max-h-56 overflow-y-auto py-1 divide-y divide-gray-50">
            {options.length === 0 ? (
              <div className="px-3.5 py-3 text-xs text-gray-400 text-center">No options available</div>
            ) : (
              options.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs transition-colors flex items-center justify-between cursor-pointer ${isSelected
                        ? "bg-orange-50/80 text-[#FF5B22] font-bold"
                        : "text-gray-700 font-medium hover:bg-orange-50/50 hover:text-[#FF5B22]"
                      }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && (
                      <svg className="w-3.5 h-3.5 text-[#FF5B22]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
