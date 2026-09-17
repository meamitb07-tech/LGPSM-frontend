"use client";

import React from "react";

interface StepHeaderProps {
  currentStep: number;
  onStepClick: (step: number) => void;
}

export default function StepHeader({ currentStep, onStepClick }: StepHeaderProps) {
  const steps = [
    { num: 1, label: "Event Details" },
    { num: 2, label: "Settings" },
    { num: 3, label: "Sessions" },
  ];

  return (
    <div className="w-full bg-white border-b border-gray-200 px-6 pt-4 pb-0 font-[family-name:var(--font-space-grotesk)]">
      <div className="flex items-center gap-8 relative">
        {steps.map((step) => {
          const isActive = currentStep === step.num;
          const isCompleted = currentStep > step.num;

          return (
            <button
              key={step.num}
              onClick={() => onStepClick(step.num)}
              className={`flex items-center gap-2 pb-3 text-xs font-bold transition-all relative cursor-pointer ${
                isActive
                  ? "text-gray-900"
                  : isCompleted
                  ? "text-gray-700"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {/* Checkmark or Circle Badge */}
              <div
                className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 ${
                  isCompleted || isActive
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {isCompleted || isActive ? (
                  <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.num
                )}
              </div>

              <span>{step.label}</span>

              {/* Active Orange Underline */}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#FF5B22] rounded-t-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
