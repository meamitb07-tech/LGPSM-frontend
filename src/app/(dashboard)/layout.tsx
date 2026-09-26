"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/Sidebar";

// Client-side route access per role. The backend enforces authorization independently;
// this only keeps users out of screens they cannot use.
function canAccess(role: string | undefined, pathname: string | null): boolean {
  const path = pathname || "";
  const within = (p: string) => path === p || path.startsWith(p + "/");

  if (role === "SYSTEM_USER") {
    return ["/dashboard", "/settings/account", "/notification", "/notifications"].some(within);
  }
  if (role === "ORGANIZER") {
    if (within("/user-management/assign")) return true;
    return !["/user-management", "/event-organizer", "/earnings", "/settings/price-rate"].some(within);
  }
  return true;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading } = useAuth();
  const allowed = !!user && canAccess(user.role, pathname);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace("/signin");
      return;
    }
    if (user && !canAccess(user.role, pathname)) {
      router.replace("/dashboard");
    }
  }, [isLoading, isAuthenticated, user, pathname, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F5F8]">
        <div className="flex items-center gap-3 text-gray-600 text-sm font-semibold font-[family-name:var(--font-space-grotesk)]">
          <svg className="animate-spin h-5 w-5 text-[#FF5B22]" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Verifying authorization...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Do not mount (and fetch data for) a page the role cannot use while the redirect happens
  if (!allowed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F5F8] text-xs font-semibold text-gray-500">
        Redirecting...
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#F8F9FA] overflow-hidden font-sans">
      <Sidebar />
      <main className="flex-1 overflow-y-auto min-w-0 flex flex-col">
        {children}
      </main>
    </div>
  );
}
