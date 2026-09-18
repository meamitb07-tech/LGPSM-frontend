"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { gsap } from "gsap";
import Sidebar from "@/components/Sidebar";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [showPopup, setShowPopup] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Automatically trigger the popup modal ONCE after signin or signup
  useEffect(() => {
    if (typeof window !== "undefined") {
      const shouldShow = sessionStorage.getItem("show_dashboard_popup");
      if (shouldShow === "true") {
        const timer = setTimeout(() => {
          setShowPopup(true);
          sessionStorage.removeItem("show_dashboard_popup");
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  // GSAP Smooth Zoom-in Entrance & Stagger Animation
  useEffect(() => {
    if (showPopup && overlayRef.current && modalRef.current) {
      const ctx = gsap.context(() => {
        // Overlay fade-in
        gsap.fromTo(
          overlayRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.35, ease: "power2.out" }
        );

        // Modal zoom-in (scale from 0.75 to 1 with smooth back.out bounce)
        gsap.fromTo(
          modalRef.current,
          { scale: 0.75, opacity: 0, y: 20 },
          {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: "back.out(1.2)",
          }
        );

        // Stagger list items inside modal
        if (listRef.current) {
          gsap.fromTo(
            listRef.current.children,
            { opacity: 0, x: -16 },
            {
              opacity: 1,
              x: 0,
              duration: 0.4,
              stagger: 0.06,
              delay: 0.2,
              ease: "power2.out",
            }
          );
        }
      });

      return () => ctx.revert();
    }
  }, [showPopup]);

  const handleClosePopup = () => {
    if (overlayRef.current && modalRef.current) {
      const tl = gsap.timeline({
        onComplete: () => setShowPopup(false),
      });

      tl.to(modalRef.current, {
        scale: 0.85,
        opacity: 0,
        y: 15,
        duration: 0.25,
        ease: "power2.in",
      }).to(
        overlayRef.current,
        {
          opacity: 0,
          duration: 0.2,
          ease: "power2.in",
        },
        "-=0.15"
      );
    } else {
      setShowPopup(false);
    }
  };

  // Route protection guard
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/signin");
    }
  }, [isLoading, isAuthenticated, router]);

  const handleLogout = async () => {
    await logout();
    router.push("/signin");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F5F8]">
        <div className="flex items-center gap-3 text-gray-600 text-sm font-semibold">
          <svg className="animate-spin h-5 w-5 text-[#FF5B22]" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading Dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#F4F5F8] font-sans text-gray-800">
      
      {/* ── Left Sidebar ── */}
      <Sidebar activeItem="dashboard" />

      {/* ── Main Dashboard Body ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-gray-200/80 px-6 sm:px-8 flex items-center justify-between shrink-0 relative">
          <h1 className="text-lg font-bold text-gray-900 tracking-tight">Dashboard</h1>
          
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-2.5 cursor-pointer focus:outline-none"
            >
              <div className="w-8 h-8 rounded-full bg-[#FF5B22] flex items-center justify-center text-white text-xs font-bold shadow-xs uppercase">
                {user?.fullName ? user.fullName.substring(0, 2) : "US"}
              </div>
              <span className="text-xs font-bold text-gray-900">{user?.fullName || "Authenticated User"}</span>
              <svg className="w-3.5 h-3.5 text-gray-500 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Profile Dropdown Menu */}
            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1.5 z-50 text-xs text-gray-700">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="font-semibold text-gray-900 truncate">{user?.fullName}</p>
                  <p className="text-gray-500 text-[11px] truncate">{user?.email}</p>
                  <p className="text-[10px] text-[#FF5B22] font-semibold uppercase mt-0.5">{user?.role || "ORGANIZER"}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 font-semibold transition-colors cursor-pointer flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Log out
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Grid Content Container matching 4-column exact layout */}
        <main className="p-5 sm:p-6 lg:p-8 flex-1 w-full max-w-[1500px]">
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-5">
            
            {/* ── CARD 1: Total Events ── */}
            <div className="bg-white rounded-md border border-gray-200 p-5 shadow-xs flex flex-col justify-between relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FFF0EB] flex items-center justify-center text-[#FF5B22] shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <button
                    onClick={() => setShowPopup(true)}
                    className="text-xs font-bold text-[#FF5B22] underline underline-offset-2 hover:opacity-80 cursor-pointer"
                  >
                    Create Events
                  </button>
                </div>
                {/* Long diagonal SVG top-right arrow matching design */}
                <svg className="w-4 h-4 text-gray-900 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M7 17L17 7M17 7H9M17 7V15" />
                </svg>
              </div>

              <div className="mt-5">
                <div className="text-[11px] text-gray-500 font-medium">
                  Last Event Created: <span className="text-[#FF5B22] font-bold">12 Mar 2026</span>
                </div>
                <div className="text-3xl sm:text-4xl font-medium text-gray-900 mt-2 tracking-tight">510</div>
                <div className="text-xs text-gray-500 font-medium mt-1">Total Events</div>
              </div>
            </div>

            {/* ── CARD 2: Total Invitations Send ── */}
            <div className="bg-white rounded-md border border-gray-200 p-5 shadow-xs flex flex-col justify-between relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#E6F9F3] flex items-center justify-center text-emerald-500 shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                  </div>
                  <button
                    onClick={() => setShowPopup(true)}
                    className="text-xs font-bold text-emerald-500 underline underline-offset-2 hover:opacity-80 cursor-pointer"
                  >
                    Add Invitees
                  </button>
                </div>
                {/* Long diagonal SVG top-right arrow matching design */}
                <svg className="w-4 h-4 text-gray-900 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M7 17L17 7M17 7H9M17 7V15" />
                </svg>
              </div>

              <div className="mt-5">
                <div className="text-[11px] text-gray-500 font-medium">
                  Accepted: <span className="text-emerald-500 font-bold">215</span> | Pending: <span className="text-[#FF5B22] font-bold">30</span>
                </div>
                <div className="text-3xl sm:text-4xl font-medium text-gray-900 mt-2 tracking-tight">2045</div>
                <div className="text-xs text-gray-500 font-medium mt-1">Total Invitations Send</div>
              </div>
            </div>

            {/* ── CARD 3: Total Payments ── */}
            <div className="bg-white rounded-md border border-gray-200 p-5 shadow-xs flex flex-col justify-between relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#EBF3FF] flex items-center justify-center text-blue-500 shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <button
                    onClick={() => setShowPopup(true)}
                    className="text-xs font-bold text-blue-500 underline underline-offset-2 hover:opacity-80 cursor-pointer"
                    >
                    Payments
                  </button>
                </div>
                {/* Long diagonal SVG top-right arrow matching design */}
                <svg className="w-4 h-4 text-gray-900 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M7 17L17 7M17 7H9M17 7V15" />
                </svg>
              </div>

              <div className="mt-5">
                <div className="text-[11px] text-gray-500 font-medium">
                  Last Payment: <span className="text-blue-600 font-bold">₹10,000</span> | Status: <span className="text-emerald-500 font-bold">Successful</span>
                </div>
                <div className="text-3xl sm:text-4xl font-medium text-gray-900 mt-2 tracking-tight">470</div>
                <div className="text-xs text-gray-500 font-medium mt-1">Total Payments</div>
              </div>
            </div>

            {/* ── CARD 4: Upcoming Events (04) - Spans col 4 across both rows ── */}
            <div className="bg-white rounded-md border border-gray-200 p-5 shadow-xs lg:row-span-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs sm:text-sm font-medium text-gray-900">Upcoming Events (04)</h3>
                  {/* Long diagonal SVG top-right arrow matching design */}
                  <svg className="w-4 h-4 text-gray-900 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M7 17L17 7M17 7H9M17 7V15" />
                  </svg>
                </div>

                <div className="space-y-3.5">
                  {/* Event 1 */}
                  <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                    <div className="w-11 h-11 rounded-md bg-[#FFEBE8] flex items-center justify-center shrink-0 overflow-hidden relative">
                      <Image
                        src="/images/auth/Auth.png"
                        alt="Event Thumbnail"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-gray-900 line-clamp-1">Annual Business Meetup</div>
                      <div className="text-[11px] text-gray-400 mt-0.5"><span className="font-semibold">Start:</span> 18 Mar 2026</div>
                    </div>
                  </div>

                  {/* Event 2 */}
                  <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                    <div className="w-11 h-11 rounded-md bg-[#FFEBE8] flex items-center justify-center shrink-0 overflow-hidden relative">
                      <Image
                        src="/images/auth/Auth.png"
                        alt="Event Thumbnail"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-gray-900 line-clamp-1">Product Launch Event 2026</div>
                      <div className="text-[11px] text-gray-400 mt-0.5"><span className="font-semibold">Start:</span> 22 Mar 2026</div>
                    </div>
                  </div>

                  {/* Event 3 */}
                  <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                    <div className="w-11 h-11 rounded-md bg-[#FFEBE8] flex items-center justify-center shrink-0 overflow-hidden relative">
                      <Image
                        src="/images/auth/Auth.png"
                        alt="Event Thumbnail"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-gray-900 line-clamp-1">Team Networking Event</div>
                      <div className="text-[11px] text-gray-400 mt-0.5"><span className="font-semibold">Start:</span> 30 Mar 2026</div>
                    </div>
                  </div>

                  {/* Event 4 */}
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-md bg-[#FFEBE8] flex items-center justify-center shrink-0 overflow-hidden relative">
                      <Image
                        src="/images/auth/Auth.png"
                        alt="Event Thumbnail"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-gray-900 line-clamp-1">Team Networking Event</div>
                      <div className="text-[11px] text-gray-400 mt-0.5"><span className="font-semibold">Start:</span> 30 Mar 2026</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── ROW 2: Invitees vs Attendees (Spans cols 1 & 2) ── */}
            <div className="bg-white rounded-md border border-gray-200 p-5 shadow-xs lg:col-span-2 flex flex-col justify-between">
              <div>
                <h3 className="text-xs sm:text-sm font-medium text-gray-900 mb-3">
                  Invitees vs Attendees (Latest 5)
                </h3>

                {/* Real working horizontal scrollbar container */}
                <div className="overflow-x-auto custom-scrollbar pb-2 relative">
                  <table className="w-full text-left border-collapse min-w-[560px]">
                    <thead>
                      <tr className="border-b border-gray-100 text-[11px] text-gray-400 font-medium">
                        <th className="py-2 px-2 font-normal w-12">#</th>
                        <th className="py-2 px-2 font-normal min-w-[140px]">Event</th>
                        <th className="py-2 px-2 font-normal min-w-[240px]">Date &amp; Time</th>
                        <th className="py-2 px-2 text-right font-normal min-w-[100px]">No. of Guests</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs text-gray-800 font-medium divide-y divide-gray-50">
                      <tr>
                        <td className="py-3 px-2 text-gray-400 font-normal">1</td>
                        <td className="py-3 px-2 font-medium text-gray-800 whitespace-nowrap">Business Meetup</td>
                        <td className="py-3 px-2 text-gray-500 whitespace-nowrap">5/1/2026 10:00 AM</td>
                        <td className="py-3 px-2 text-right font-medium text-gray-900 whitespace-nowrap">510</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-2 text-gray-400 font-normal">2</td>
                        <td className="py-3 px-2 font-medium text-gray-800 whitespace-nowrap">Product Launch</td>
                        <td className="py-3 px-2 text-gray-500 whitespace-nowrap">5/1/2026 10:00 AM to 03:00 PM</td>
                        <td className="py-3 px-2 text-right font-medium text-gray-900 whitespace-nowrap">400</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-2 text-gray-400 font-normal">3</td>
                        <td className="py-3 px-2 font-medium text-gray-800 whitespace-nowrap">Annual General Meeting</td>
                        <td className="py-3 px-2 text-gray-500 whitespace-nowrap">5/2/2026 11:30 AM</td>
                        <td className="py-3 px-2 text-right font-medium text-gray-900 whitespace-nowrap">350</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-2 text-gray-400 font-normal">4</td>
                        <td className="py-3 px-2 font-medium text-gray-800 whitespace-nowrap">Executive Workshop</td>
                        <td className="py-3 px-2 text-gray-500 whitespace-nowrap">5/3/2026 02:00 PM to 05:00 PM</td>
                        <td className="py-3 px-2 text-right font-medium text-gray-900 whitespace-nowrap">280</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-2 text-gray-400 font-normal">5</td>
                        <td className="py-3 px-2 font-medium text-gray-800 whitespace-nowrap">Tech Summit 2026</td>
                        <td className="py-3 px-2 text-gray-500 whitespace-nowrap">5/5/2026 09:00 AM to 06:00 PM</td>
                        <td className="py-3 px-2 text-right font-medium text-gray-900 whitespace-nowrap">620</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* ── ROW 2: Notifications (Spans col 3) ── */}
            <div className="bg-white rounded-md border border-gray-200 p-5 shadow-xs flex flex-col justify-between relative">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs sm:text-sm font-medium text-gray-900">Notifications</h3>
                  {/* Long diagonal SVG top-right arrow matching design */}
                  <svg className="w-4 h-4 text-gray-900 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M7 17L17 7M17 7H9M17 7V15" />
                  </svg>
                </div>

                {/* Real working vertical scrollbar container filling full card height */}
                <div className="space-y-3.5 pr-2 max-h-[240px] overflow-y-auto custom-scrollbar">
                  <div className="border-b border-gray-100 pb-3">
                    <div className="text-xs font-medium text-gray-900">QR codes generated successfully</div>
                    <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do...
                    </p>
                    <div className="text-[10px] text-gray-400 mt-1.5 font-medium">
                      Mar 04, 2026 | 19:45
                    </div>
                  </div>

                  <div className="border-b border-gray-100 pb-3">
                    <div className="text-xs font-medium text-gray-900">Payment Success</div>
                    <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod...
                    </p>
                    <div className="text-[10px] text-gray-400 mt-1.5 font-medium">
                      Mar 04, 2026 | 18:30
                    </div>
                  </div>

                  <div className="border-b border-gray-100 pb-3">
                    <div className="text-xs font-medium text-gray-900">New Invitee Accepted</div>
                    <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                      John Doe accepted your invitation to Business Meetup.
                    </p>
                    <div className="text-[10px] text-gray-400 mt-1.5 font-medium">
                      Mar 04, 2026 | 16:15
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-medium text-gray-900">Event Published</div>
                    <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                      Product Launch Event 2026 has been published.
                    </p>
                    <div className="text-[10px] text-gray-400 mt-1.5 font-medium">
                      Mar 03, 2026 | 11:20
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </main>
      </div>

      {/* ── CREATE AN EVENT POPUP MODAL (GSAP Animated Zoom-in) ── */}
      {showPopup && (
        <div
          ref={overlayRef}
          onClick={(e) => {
            if (e.target === overlayRef.current) {
              handleClosePopup();
            }
          }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            ref={modalRef}
            className="bg-white rounded-lg shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col md:flex-row relative"
          >
            
            {/* Left Content Side */}
            <div className="w-full md:w-1/2 p-8 sm:p-10 flex flex-col justify-center bg-white">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-8">
                Create an event
              </h2>

              <Link href="/events/add" className="block group">
                <ul ref={listRef} className="space-y-4 text-xs sm:text-sm font-semibold text-gray-800">
                  {/* 1. Create an event */}
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-[#FF5B22] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Create an event</span>
                  </li>

                  {/* 2. Add invitees to your events */}
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-[#FF5B22] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    <span>Add invitees to your events</span>
                  </li>

                  {/* 3. Make payment for your invitees */}
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-[#FF5B22] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>Make payment for your invitees</span>
                  </li>

                  {/* 4. Select invitation QR Card design */}
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-[#FF5B22] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Select invitation QR Card design</span>
                  </li>

                  {/* 5. Send QR Invitations */}
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-[#FF5B22] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    <span>Send QR Invitations</span>
                  </li>

                  {/* 6. View Reports */}
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-[#FF5B22] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>View Reports</span>
                  </li>
                </ul>

                <div className="mt-6">
                  <span className="inline-flex items-center justify-center py-2.5 px-5 bg-[#FF5B22] hover:bg-[#E04B16] text-white font-bold text-xs rounded-lg transition-all shadow-xs cursor-pointer gap-2">
                    <span>Start Creating Event</span>
                    <svg className="w-4 h-4 shrink-0 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </span>
                </div>
              </Link>
            </div>

            {/* Right Image Side with Close X Button */}
            <div className="w-full md:w-1/2 relative min-h-[320px] md:min-h-[420px] bg-gray-900">
              <button
                onClick={handleClosePopup}
                className="absolute top-4 right-4 z-20 text-white/90 hover:text-white transition-all cursor-pointer p-1"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <Image
                src="/images/dashboard/Dashboard_Popup.png"
                alt="Scanning QR code popup"
                fill
                priority
                className="object-cover object-center"
              />
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
