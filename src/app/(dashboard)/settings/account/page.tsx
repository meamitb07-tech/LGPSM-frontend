"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import ChangePasswordModal from "@/components/settings/modals/ChangePasswordModal";
import AvatarSection from "@/components/settings/AvatarSection";

import { authService } from "@/services/authService";
import { tokenStorage } from "@/services/tokenStorage";

import UserNavDropdown from "@/components/common/UserNavDropdown";

export default function AccountSettingsPage() {
  const { user, updateProfile } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("••••••••••••••••");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    (user as any)?.avatarUrl || null
  );
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (user?.fullName) setFullName(user.fullName);
    if (user?.email) setEmail(user.email);
    if ((user as any)?.avatarUrl) setAvatarUrl((user as any).avatarUrl);
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      await updateProfile({ fullName, email, avatarUrl } as any);
      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 3000);
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to update profile.");
    }
  };

  const handleUpdatePassword = async (_oldPass: string, newPass: string): Promise<boolean> => {
    setErrorMessage("");
    const token = tokenStorage.getAccessToken();
    if (!token) {
      setErrorMessage("Authentication token not found. Please log in again.");
      return false;
    }

    try {
      const res = await authService.resetPassword(token, newPass);
      if (res.success) {
        setPassword("••••••••••••••••");
        setSavedMessage(true);
        setTimeout(() => setSavedMessage(false), 3000);
        return true;
      } else {
        setErrorMessage(res.message || "Failed to update password in database.");
        return false;
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to update password in database.");
      return false;
    }
  };

  const displayName = fullName || user?.fullName || user?.email || "Account Name";

  return (
    <div className="w-full min-h-full bg-white font-sans text-gray-900 select-none">
      {/* Header */}
      <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between shrink-0 sticky top-0 z-20">
        <div className="flex items-center gap-2.5">
          <svg className="w-6 h-6 text-[#FF5B22] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <h1 className="text-base font-bold text-gray-800">Account Settings</h1>
        </div>
        <UserNavDropdown />
      </header>

      {/* Content */}
      <div className="p-6 max-w-4xl w-full mx-auto space-y-6 pb-24">
        <h2 className="text-base font-bold text-gray-800">Edit Profile</h2>

        {savedMessage && (
          <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-md text-xs font-semibold transition-all">
            Account details updated successfully!
          </div>
        )}

        {errorMessage && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-xs font-semibold transition-all">
            {errorMessage}
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
