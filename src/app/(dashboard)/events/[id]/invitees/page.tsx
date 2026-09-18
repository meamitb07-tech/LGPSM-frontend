"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/context/AuthContext";

interface InviteeRow {
  id: string;
  name: string;
  email: string;
  mobile: string;
  status: "Successfully Send" | "Sending Failed";
  rsvpStatus: "Pending" | "Accepted" | "Declined";
  dietaryPreference: string;
  entry: boolean;
  lunch: boolean;
}

const SAMPLE_INVITEES: InviteeRow[] = [
  { id: "1", name: "Moloy Roy", email: "tanya.hill@example.com", mobile: "9674259986", status: "Successfully Send", rsvpStatus: "Pending", dietaryPreference: "--", entry: true, lunch: false },
  { id: "2", name: "Wade Warren", email: "willie.jennings@example.com", mobile: "(671) 555-0110", status: "Sending Failed", rsvpStatus: "Pending", dietaryPreference: "--", entry: true, lunch: false },
  { id: "3", name: "Guy Hawkins", email: "bill.sanders@example.com", mobile: "(316) 555-0116", status: "Successfully Send", rsvpStatus: "Pending", dietaryPreference: "--", entry: true, lunch: false },
  { id: "4", name: "Marvin McKinney", email: "tim.jennings@example.com", mobile: "(219) 555-0114", status: "Successfully Send", rsvpStatus: "Pending", dietaryPreference: "--", entry: true, lunch: false },
  { id: "5", name: "Albert Flores", email: "dolores.chambers@example.com", mobile: "(702) 555-0122", status: "Successfully Send", rsvpStatus: "Pending", dietaryPreference: "--", entry: true, lunch: false },
  { id: "6", name: "Eleanor Pena", email: "eleanor.pena@example.com", mobile: "(488) 666-1028", status: "Sending Failed", rsvpStatus: "Pending", dietaryPreference: "--", entry: true, lunch: false },
  { id: "7", name: "Cem Bingöl", email: "cem_bingol@example.com", mobile: "(589) 458-0102", status: "Sending Failed", rsvpStatus: "Pending", dietaryPreference: "--", entry: true, lunch: false },
  { id: "8", name: "Garrick Oscar", email: "garrick.oscar@example.com", mobile: "(684) 555-0102", status: "Successfully Send", rsvpStatus: "Pending", dietaryPreference: "--", entry: true, lunch: false },
  { id: "9", name: "Jameson Wolfe", email: "jameson.wolfe@example.com", mobile: "(555) 488-0698", status: "Successfully Send", rsvpStatus: "Pending", dietaryPreference: "--", entry: true, lunch: true },
  { id: "10", name: "River Barrett", email: "michelle.rivera@example.com", mobile: "(488) 666-1028", status: "Successfully Send", rsvpStatus: "Accepted", dietaryPreference: "+ Vegetarian", entry: true, lunch: true },
  { id: "11", name: "Andres Perry", email: "andres.perry@example.com", mobile: "(684) 659-0236", status: "Successfully Send", rsvpStatus: "Accepted", dietaryPreference: "+ Non-vegetarian", entry: true, lunch: true },
  { id: "12", name: "Zakai Holmes", email: "zakai.holmes@example.com", mobile: "(589) 458-0102", status: "Successfully Send", rsvpStatus: "Declined", dietaryPreference: "--", entry: true, lunch: true },
];

export default function InviteesManagementPage() {
  const params = useParams();
  const eventId = (params?.id as string) || "1";
  const { user } = useAuth();

  const [invitees] = useState<InviteeRow[]>(SAMPLE_INVITEES);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(invitees.map((item) => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const isAllSelected = selectedIds.length === invitees.length && invitees.length > 0;

  const filteredInvitees = invitees.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.mobile.includes(searchQuery)
  );

  return (
    <div className="flex min-h-screen bg-white text-gray-900 font-sans">
      {/* Sidebar Navigation */}
      <Sidebar activeItem="invitees-management" />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Top Navigation Bar */}
        <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-20">
          <h1 className="text-lg font-bold text-gray-900">Event Management</h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200/80 px-3 py-1.5 rounded-full cursor-pointer transition-colors">
              <div className="w-7 h-7 rounded-full bg-gray-400 text-white flex items-center justify-center font-semibold text-xs">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-xs font-semibold text-gray-800">
                {user?.fullName || "Jane Doe"}
              </span>
              <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </header>

        {/* Page Content - Directly on pure white page background */}
        <main className="p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6 bg-white">
          {/* Controls Bar: Heading + Search Bar on Left, Action Buttons on Right */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Title & Search Bar */}
            <div className="flex items-center gap-6 flex-1 max-w-2xl">
              <h2 className="text-xl font-bold text-gray-900 shrink-0">Invitees</h2>

              {/* Search Bar */}
              <div className="relative flex-1">
                <svg
                  className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search invitees"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-[#F8F9FA] border border-gray-200 rounded-md text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#FF5B22]"
                />
              </div>
            </div>

            {/* Top Action Buttons on Right */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Back to Dashboard (Orange Outline) */}
              <Link
                href={`/events/${eventId}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 border border-[#FF5B22] text-[#FF5B22] hover:bg-[#FF5B22]/5 text-xs font-semibold rounded-md transition-colors cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to Dashboard</span>
              </Link>

              {/* Add Invitees (Soft Peach Solid) */}
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FFAB85] hover:bg-[#FF9866] text-white text-xs font-semibold rounded-md transition-colors cursor-pointer shadow-2xs"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Invitees</span>
              </button>
            </div>
          </div>

          {/* Sub-controls Bar: Select All on Left, Resend Invitation on Right */}
          <div className="flex items-center justify-between pt-2">
            <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-600 select-none">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={handleSelectAll}
                className="w-4 h-4 rounded border-gray-300 text-[#FF5B22] focus:ring-[#FF5B22] cursor-pointer"
              />
              <span>Select All</span>
            </label>

            <button
              type="button"
              className="px-4 py-1.5 border border-[#FF5B22] text-[#FF5B22] hover:bg-[#FF5B22]/5 text-xs font-semibold rounded-md transition-colors cursor-pointer"
            >
              Resend Invitation
            </button>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead>
                <tr className="border-b border-gray-100 text-gray-500 font-medium text-[11px]">
                  <th className="py-3 px-3 w-10"></th>
                  <th className="py-3 px-4 font-medium">Name</th>
                  <th className="py-3 px-4 font-medium">Email</th>
                  <th className="py-3 px-4 font-medium">Mobile No.</th>
                  <th className="py-3 px-4 font-medium">Status</th>
                  <th className="py-3 px-4 font-medium">RSVP Status</th>
                  <th className="py-3 px-4 font-medium">Dietary Preference</th>
                  <th className="py-3 px-3 text-center font-medium">Entry</th>
                  <th className="py-3 px-3 text-center font-medium">Lunch</th>
                  <th className="py-3 px-2 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-800">
                {filteredInvitees.map((item) => {
                  const isChecked = selectedIds.includes(item.id);
                  return (
                    <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-4 px-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleSelectOne(item.id)}
                          className="w-4 h-4 rounded border-gray-300 text-[#FF5B22] focus:ring-[#FF5B22] cursor-pointer"
                        />
                      </td>
                      <td className="py-4 px-4 font-medium text-gray-900">{item.name}</td>
                      <td className="py-4 px-4 text-gray-600">{item.email}</td>
                      <td className="py-4 px-4 text-gray-600">{item.mobile}</td>

                      {/* Status Column */}
                      <td className="py-4 px-4">
                        {item.status === "Successfully Send" ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-700">
                            Successfully Send
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold bg-red-100 text-red-600">
                            Sending Failed
                          </span>
                        )}
                      </td>

                      {/* RSVP Status Column */}
                      <td className="py-4 px-4">
                        {item.rsvpStatus === "Pending" && (
                          <span className="inline-flex items-center px-3.5 py-1 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-700">
                            Pending
                          </span>
                        )}
                        {item.rsvpStatus === "Accepted" && (
                          <span className="inline-flex items-center px-3.5 py-1 rounded-full text-[11px] font-semibold bg-indigo-100 text-indigo-700">
                            Accepted
                          </span>
                        )}
                        {item.rsvpStatus === "Declined" && (
                          <span className="inline-flex items-center px-3.5 py-1 rounded-full text-[11px] font-semibold bg-red-100 text-red-600">
                            Declined
                          </span>
                        )}
                      </td>

                      {/* Dietary Preference Column */}
                      <td className="py-4 px-4">
                        {item.dietaryPreference === "--" ? (
                          <span className="text-gray-400 pl-3">--</span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium border border-gray-200 text-gray-700 bg-white shadow-2xs">
                            {item.dietaryPreference}
                          </span>
                        )}
                      </td>

                      {/* Entry Check/Cross */}
                      <td className="py-4 px-3 text-center">
                        {item.entry ? (
                          <span className="text-emerald-600 font-bold text-sm">✓</span>
                        ) : (
                          <span className="text-red-500 font-bold text-sm">✕</span>
                        )}
                      </td>

                      {/* Lunch Check/Cross */}
                      <td className="py-4 px-3 text-center">
                        {item.lunch ? (
                          <span className="text-emerald-600 font-bold text-sm">✓</span>
                        ) : (
                          <span className="text-red-500 font-bold text-sm">✕</span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-4 px-2 text-right">
                        <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6 10a2 2 0 110 4 2 2 0 010-4zm6 0a2 2 0 110 4 2 2 0 010-4zm6 0a2 2 0 110 4 2 2 0 010-4z" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer Pagination & Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-gray-100">
            {/* Pagination Controls */}
            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <button className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed">
                ‹
              </button>
              <button className="w-7 h-7 flex items-center justify-center rounded border border-[#FF5B22] text-[#FF5B22] font-semibold bg-white">
                1
              </button>
              <button className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 text-gray-700 hover:bg-gray-50">
                2
              </button>
              <span className="px-1 text-gray-400">...</span>
              <button className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 text-gray-700 hover:bg-gray-50">
                9
              </button>
              <button className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 text-gray-700 hover:bg-gray-50">
                10
              </button>
              <button className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 text-gray-700 hover:bg-gray-50">
                ›
              </button>
            </div>

            {/* Total Sending Failed summary text on right */}
            <div className="text-xs font-semibold text-gray-800">
              Total sending failed: <span className="text-[#FF5B22] font-bold">07</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
