"use client";

import React, { useState } from "react";

interface Step2SettingsProps {
  onNext: () => void;
  onBack: () => void;
}

export default function Step2Settings({ onNext, onBack }: Step2SettingsProps) {
  const [maxAttendees, setMaxAttendees] = useState("");
  const [acceptAll, setAcceptAll] = useState(true);
  const [allowNotResponded, setAllowNotResponded] = useState(false);
  const [allowDeclined, setAllowDeclined] = useState(false);
  const [askFoodPreference, setAskFoodPreference] = useState(true);

  const [prefTitle, setPrefTitle] = useState("Dietary Preference");
  const [option1, setOption1] = useState("Vegetarian");
  const [option2, setOption2] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 font-[family-name:var(--font-space-grotesk)] text-xs">
      {/* Attendee threshold limit */}
      <div>
        <label className="block font-semibold text-gray-900 mb-1">
          Attendee threshold limit
        </label>
        <input
          type="number"
          value={maxAttendees}
          onChange={(e) => setMaxAttendees(e.target.value)}
          placeholder="Enter Max Attendee count"
          className="w-full max-w-lg px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-gray-300 font-medium"
        />
      </div>

      {/* Checkbox Options List */}
      <div className="space-y-3">
        {/* Accept all invited attendees */}
        <div className="p-3.5 border border-gray-200 rounded-lg bg-white flex items-center justify-between">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={acceptAll}
              onChange={(e) => setAcceptAll(e.target.checked)}
              className="w-4 h-4 text-[#FF5B22] rounded border-gray-300 focus:ring-0 cursor-pointer"
            />
            <span className="font-semibold text-gray-900">Accept all invited attendees</span>
          </label>
          <span className="w-3.5 h-3.5 text-gray-400 border border-gray-400 rounded-full flex items-center justify-center text-[9px] font-bold">
            i
          </span>
        </div>

        {/* Allow not-responded invitees */}
        <div className="p-3.5 border border-gray-200 rounded-lg bg-white flex items-center justify-between">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={allowNotResponded}
              onChange={(e) => setAllowNotResponded(e.target.checked)}
              className="w-4 h-4 text-[#FF5B22] rounded border-gray-300 focus:ring-0 cursor-pointer"
            />
            <span className="font-medium text-gray-700">Allow not-responded invitees</span>
          </label>
          <span className="w-3.5 h-3.5 text-gray-400 border border-gray-400 rounded-full flex items-center justify-center text-[9px] font-bold">
            i
          </span>
        </div>

        {/* Allow RSVP declined invitees */}
        <div className="p-3.5 border border-gray-200 rounded-lg bg-white flex items-center justify-between">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={allowDeclined}
              onChange={(e) => setAllowDeclined(e.target.checked)}
              className="w-4 h-4 text-[#FF5B22] rounded border-gray-300 focus:ring-0 cursor-pointer"
            />
            <span className="font-medium text-gray-700">Allow RSVP declined invitees</span>
          </label>
          <span className="w-3.5 h-3.5 text-gray-400 border border-gray-400 rounded-full flex items-center justify-center text-[9px] font-bold">
            i
          </span>
        </div>

        {/* Ask for food preference */}
        <div className="p-4 border border-gray-200 rounded-lg bg-white space-y-4">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={askFoodPreference}
                onChange={(e) => setAskFoodPreference(e.target.checked)}
                className="w-4 h-4 text-[#FF5B22] rounded border-gray-300 focus:ring-0 cursor-pointer"
              />
              <span className="font-semibold text-gray-900">Ask for food preference</span>
            </label>
            <span className="w-3.5 h-3.5 text-gray-400 border border-gray-400 rounded-full flex items-center justify-center text-[9px] font-bold">
              i
            </span>
          </div>

          {askFoodPreference && (
            <div className="pt-2 pl-7 space-y-4 border-t border-gray-100">
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                  Write title (e.g. Preference Category)
                </label>
                <input
                  type="text"
                  value={prefTitle}
                  onChange={(e) => setPrefTitle(e.target.value)}
                  placeholder="Dietary Preference"
                  className="w-full max-w-md px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-medium focus:outline-none"
                />
              </div>

              {/* Radio Options */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-[#FF5B22] flex items-center justify-center">
                    <span className="w-1.5 h-1.5 bg-[#FF5B22] rounded-full" />
                  </span>
                  <input
                    type="text"
                    value={option1}
                    onChange={(e) => setOption1(e.target.value)}
                    placeholder="Vegetarian"
                    className="border-b border-gray-300 focus:border-[#FF5B22] focus:outline-none px-1 py-0.5 text-xs text-gray-800 font-medium"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <span className="w-3.5 h-3.5 rounded-full border border-gray-300" />
                  <input
                    type="text"
                    value={option2}
                    onChange={(e) => setOption2(e.target.value)}
                    placeholder="Option 2"
                    className="border-b border-gray-200 focus:border-[#FF5B22] focus:outline-none px-1 py-0.5 text-xs text-gray-500"
                  />
                  <button
                    type="button"
                    className="text-[#FF5B22] font-semibold hover:underline ml-2 text-[11px] cursor-pointer"
                  >
                    Add another option?
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  className="px-5 py-1.5 bg-[#FF5B22] hover:bg-[#E04B16] text-white font-bold rounded-md shadow-2xs transition-all cursor-pointer"
                >
                  Save
                </button>
              </div>

              <div className="pt-3">
                <button
                  type="button"
                  className="px-4 py-2 border border-[#FF5B22] text-[#FF5B22] hover:bg-[#FF5B22]/5 font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span className="text-base font-normal">+</span> Add Another
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Footer Actions */}
      <div className="pt-6 border-t border-gray-100 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-800 font-bold rounded-lg transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-8 py-2.5 bg-[#FF5B22] hover:bg-[#E04B16] text-white font-bold rounded-lg shadow-xs transition-all cursor-pointer"
        >
          Next
        </button>
      </div>
    </form>
  );
}
