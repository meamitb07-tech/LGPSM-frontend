"use client";

import React, { useState } from "react";
import { defaultEventSettings } from "@/data/settingsData";
import { EventSettingsOptions } from "@/types/settings";
import { useAuth } from "@/context/AuthContext";

export default function EventSettingsPage() {
  const { user } = useAuth();
  const [options, setOptions] = useState<EventSettingsOptions>(defaultEventSettings);
  const [savedMessage, setSavedMessage] = useState(false);

  const toggleOption = (key: keyof EventSettingsOptions) => {
    setOptions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  const settingsList: { key: keyof EventSettingsOptions; label: string }[] = [
    { key: "allowEventRSVP", label: "Option to allow Event RSVP" },
    { key: "acceptInvitedAttendees", label: "Option to choose accept invited attendees" },
    { key: "chooseNotRespondedInvitees", label: "Option to choose not-responded invitees" },
    { key: "chooseRSVPDeclinedInvitees", label: "Option to choose RSVP declined invitees" },
    { key: "askFoodPreference", label: "Option to ask for food preference" },
  ];

  return (
    <div className="w-full min-h-full bg-white">
      {/* Header */}
      <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between shrink-0 sticky top-0 z-20">
        <h1 className="text-base font-bold text-gray-800">Event Settings</h1>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600">
            <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
          <span className="text-xs font-semibold text-gray-700">{user?.fullName || user?.email || "Account Name"}</span>
        </div>
      </header>

      {/* Content */}
      <div className="p-6 max-w-4xl w-full mx-auto space-y-6 pb-24">
        {savedMessage && (
          <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-md text-xs font-semibold transition-all">
            Event Settings updated successfully!
          </div>
        )}

        <div className="bg-white rounded-md border border-gray-200/80 p-6 shadow-xs space-y-6">
          <h2 className="text-base font-bold text-gray-800">Setting options</h2>

          <div className="space-y-4">
            {settingsList.map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
              >
                <span className="text-xs font-medium text-gray-700">{item.label}</span>

                <button
                  type="button"
                  onClick={() => toggleOption(item.key)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    options[item.key] ? "bg-[#FF5B22]" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      options[item.key] ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-[#FF5B22] text-white text-xs font-semibold rounded-md hover:bg-[#e04f1d] transition-colors shadow-xs"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
