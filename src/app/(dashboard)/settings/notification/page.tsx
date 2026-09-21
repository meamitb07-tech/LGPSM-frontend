"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import UserNavDropdown from "@/components/common/UserNavDropdown";

interface EmailNotificationOptions {
  newOrganizerRegistration: boolean;
  newEventAdded: boolean;
  deactivatedOrganizerBySuperAdmin: boolean;
  changeInPrice: boolean;
  invitationSendFailed: boolean;
  dayBeforeEventAlert: boolean;
  reportDownload: boolean;
  customTemplateRequest: boolean;
}

export default function NotificationSettingsPage() {
  const { user } = useAuth();
  const [options, setOptions] = useState<EmailNotificationOptions>({
    newOrganizerRegistration: false,
    newEventAdded: false,
    deactivatedOrganizerBySuperAdmin: true,
    changeInPrice: true,
    invitationSendFailed: false,
    dayBeforeEventAlert: true,
    reportDownload: true,
    customTemplateRequest: true,
  });

  const [savedMessage, setSavedMessage] = useState(false);

  const toggleOption = (key: keyof EmailNotificationOptions) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  const items: { key: keyof EmailNotificationOptions; label: string }[] = [
    { key: "newOrganizerRegistration", label: "New organizer registration" },
    { key: "newEventAdded", label: "New event added" },
    { key: "deactivatedOrganizerBySuperAdmin", label: "Deactivated organizer by super admin" },
    { key: "changeInPrice", label: "Change in price" },
    { key: "invitationSendFailed", label: "Invitation send failed" },
    { key: "dayBeforeEventAlert", label: "Day before event alert" },
    { key: "reportDownload", label: "Report Download" },
    { key: "customTemplateRequest", label: "Custom template request" },
  ];

  return (
    <div className="w-full min-h-full bg-white">
      {/* Header */}
      <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between shrink-0 sticky top-0 z-20">
        <h1 className="text-base font-bold text-gray-800">Notification Settings</h1>
        <UserNavDropdown />
      </header>

      {/* Content */}
      <div className="p-6 max-w-2xl w-full space-y-6 pb-24">
        {savedMessage && (
          <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-md text-xs font-semibold transition-all">
            Notification settings saved successfully!
          </div>
        )}

        <div className="bg-white rounded-md border border-gray-200/80 p-6 shadow-xs space-y-5">
          <h2 className="text-base font-bold text-gray-800">Email Notification</h2>

          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between py-1"
              >
                <span className="text-xs font-medium text-gray-700">
                  {item.label}
                </span>

                <button
                  type="button"
                  onClick={() => toggleOption(item.key)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${options[item.key] ? "bg-[#FF5B22]" : "bg-gray-200"
                    }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${options[item.key] ? "translate-x-5" : "translate-x-0"
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
