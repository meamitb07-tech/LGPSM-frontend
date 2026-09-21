"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import ChangePasswordModal from "@/components/settings/modals/ChangePasswordModal";
import AvatarSection from "@/components/settings/AvatarSection";

export default function AccountSettingsPage() {
  const { user, updateProfile } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName || "Alex Morgan");
  const [email, setEmail] = useState(user?.email || "alex.morgan@example.com");
  const [password, setPassword] = useState("••••••••••••••••");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    (user as any)?.avatarUrl || null
  );
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);

  useEffect(() => {
    if (user?.fullName) setFullName(user.fullName);
    if (user?.email) setEmail(user.email);
    if ((user as any)?.avatarUrl) setAvatarUrl((user as any).avatarUrl);
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({ fullName, email, avatarUrl } as any);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  const handleUpdatePassword = (_oldPass: string, newPass: string) => {
    if (newPass) {
      setPassword(newPass);
    }
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  const displayName = fullName || user?.fullName || user?.email || "Account Name";

  return (
    <div className="w-full min-h-full bg-white font-sans text-gray-900 select-none">
      {/* Header */}
      <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between shrink-0 sticky top-0 z-20">
        <h1 className="text-base font-bold text-gray-800">Account Settings</h1>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600 overflow-hidden shrink-0">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Header Avatar" className="w-full h-full object-cover" />
            ) : (
              <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            )}
          </div>
          <span className="text-xs font-semibold text-gray-700">{displayName}</span>
        </div>
      </header>

      {/* Content */}
      <div className="p-6 max-w-4xl w-full mx-auto space-y-6 pb-24">
        <h2 className="text-base font-bold text-gray-800">Edit Profile</h2>

        {savedMessage && (
          <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-md text-xs font-semibold transition-all">
            Account details updated successfully!
          </div>
        )}

        <form onSubmit={handleSave} className="bg-white rounded-md border border-gray-200/80 p-8 shadow-xs">
          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Interactive Avatar Area with Dropdown & Default Profile Icon */}
            <AvatarSection
              avatarUrl={avatarUrl}
              onAvatarChange={(newUrl) => {
                setAvatarUrl(newUrl);
                updateProfile({ fullName, email, avatarUrl: newUrl } as any);
              }}
            />

            {/* Profile Inputs */}
            <div className="flex-1 space-y-5 w-full">
              <h3 className="text-xl font-bold text-gray-900">{displayName}</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Account Name */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Account Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs border border-gray-200/90 rounded-md bg-white focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#FF5B22]"
                    required
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs border border-gray-200/90 rounded-md bg-white focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#FF5B22]"
                    required
                  />
                </div>

                {/* Password with inline Change Password link */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative max-w-md">
                    <input
                      type="password"
                      value={password}
                      readOnly
                      className="w-full px-3.5 py-2.5 pr-28 text-xs border border-gray-200/90 rounded-md bg-white text-gray-700 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setIsPasswordModalOpen(true)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#FF5B22] hover:underline cursor-pointer"
                    >
                      Change password
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#FF5B22] text-white text-xs font-semibold rounded-md hover:bg-[#e04f1d] transition-colors shadow-xs cursor-pointer"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onUpdate={handleUpdatePassword}
      />
    </div>
  );
}
