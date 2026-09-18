"use client";

import React, { useState, useRef, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import gsap from "gsap";

interface AssignedSession {
  id: string;
  name: string;
  time: string;
}

interface AssignedEvent {
  id: string;
  title: string;
  sessions: AssignedSession[];
}

interface SystemUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  events: AssignedEvent[];
}

const INITIAL_USERS: SystemUser[] = [
  {
    id: "usr-1",
    name: "Wade Warren",
    email: "willie.jennings@example.com",
    phone: "(671) 555-0110",
    events: [
      {
        id: "evt-1",
        title: "Nivita Birthday - 3rd June 2026",
        sessions: [
          { id: "ses-1", name: "LUNCH SESSION", time: "12:30 PM TO 4:30 PM" },
          { id: "ses-2", name: "ENTRY SESSION", time: "06:30 PM TO 12:00 AM" },
        ],
      },
    ],
  },
  {
    id: "usr-2",
    name: "Guy Hawkins",
    email: "bill.sanders@example.com",
    phone: "(316) 555-0116",
    events: [
      {
        id: "evt-2",
        title: "Product Launch Event 2026",
        sessions: [
          { id: "ses-3", name: "KEYNOTE SESSION", time: "10:00 AM TO 01:00 PM" },
          { id: "ses-4", name: "NETWORKING SESSION", time: "02:00 PM TO 05:00 PM" },
        ],
      },
    ],
  },
  {
    id: "usr-3",
    name: "Marvin McKinney",
    email: "tim.jennings@example.com",
    phone: "(219) 555-0114",
    events: [
      {
        id: "evt-3",
        title: "Annual Business Meetup",
        sessions: [
          { id: "ses-5", name: "MORNING SESSION", time: "09:00 AM TO 12:00 PM" },
        ],
      },
    ],
  },
  {
    id: "usr-4",
    name: "Albert Flores",
    email: "dolores.chambers@example.com",
    phone: "(702) 555-0122",
    events: [],
  },
  {
    id: "usr-5",
    name: "Eleanor Pena",
    email: "michelle.rivera@example.com",
    phone: "(684) 555-0102",
    events: [
      {
        id: "evt-4",
        title: "Tech Summit 2026",
        sessions: [
          { id: "ses-6", name: "ENTRY SESSION", time: "09:00 AM TO 06:00 PM" },
        ],
      },
    ],
  },
  {
    id: "usr-6",
    name: "Eleanor Pena",
    email: "michelle.rivera@example.com",
    phone: "(684) 555-0102",
    events: [
      {
        id: "evt-5",
        title: "Executive Workshop",
        sessions: [
          { id: "ses-7", name: "AFTERNOON SESSION", time: "02:00 PM TO 05:00 PM" },
        ],
      },
    ],
  },
  {
    id: "usr-7",
    name: "Suzana Parveen",
    email: "michelle.rivera@example.com",
    phone: "(684) 555-0102",
    events: [],
  },
  {
    id: "usr-8",
    name: "Sincere Carlson",
    email: "michelle.rivera@example.com",
    phone: "(684) 555-0102",
    events: [],
  },
];

export default function UserManagementPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  // Redirect if unauthenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/signin");
    }
  }, [isLoading, isAuthenticated, router]);

  // Main State
  const [users, setUsers] = useState<SystemUser[]>(INITIAL_USERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [activeActionMenuId, setActiveActionMenuId] = useState<string | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingUserIds, setDeletingUserIds] = useState<string[]>([]);

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assigningUserIds, setAssigningUserIds] = useState<string[]>([]);

  // Form Fields
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const [assignData, setAssignData] = useState({
    event: "Product Launch Event 2026",
    session: "Entry Session",
  });

  // Modal Refs for GSAP
  const addModalBackdropRef = useRef<HTMLDivElement>(null);
  const addModalCardRef = useRef<HTMLDivElement>(null);

  const editModalBackdropRef = useRef<HTMLDivElement>(null);
  const editModalCardRef = useRef<HTMLDivElement>(null);

  const deleteModalBackdropRef = useRef<HTMLDivElement>(null);
  const deleteModalCardRef = useRef<HTMLDivElement>(null);

  const assignModalBackdropRef = useRef<HTMLDivElement>(null);
  const assignModalCardRef = useRef<HTMLDivElement>(null);

  // GSAP helper for opening modals
  const animateModalOpen = (
    backdrop: HTMLDivElement | null,
    card: HTMLDivElement | null
  ) => {
    if (!backdrop || !card) return;
    gsap.fromTo(
      backdrop,
      { opacity: 0 },
      { opacity: 1, duration: 0.25, ease: "power2.out" }
    );
    gsap.fromTo(
      card,
      { scale: 0.85, opacity: 0, y: 15 },
      { scale: 1, opacity: 1, y: 0, duration: 0.35, ease: "back.out(1.2)" }
    );
  };

  // Animate Modal Triggers
  useEffect(() => {
    if (isAddModalOpen) {
      animateModalOpen(addModalBackdropRef.current, addModalCardRef.current);
    }
  }, [isAddModalOpen]);

  useEffect(() => {
    if (isEditModalOpen) {
      animateModalOpen(editModalBackdropRef.current, editModalCardRef.current);
    }
  }, [isEditModalOpen]);

  useEffect(() => {
    if (isDeleteModalOpen) {
      animateModalOpen(
        deleteModalBackdropRef.current,
        deleteModalCardRef.current
      );
    }
  }, [isDeleteModalOpen]);

  useEffect(() => {
    if (isAssignModalOpen) {
      animateModalOpen(
        assignModalBackdropRef.current,
        assignModalCardRef.current
      );
    }
  }, [isAssignModalOpen]);

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.phone.toLowerCase().includes(q)
    );
  });

  // Select All Logic
  const isAllSelected =
    filteredUsers.length > 0 &&
    filteredUsers.every((u) => selectedUserIds.includes(u.id));

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(filteredUsers.map((u) => u.id));
    }
  };

  const handleToggleSelectUser = (id: string) => {
    if (selectedUserIds.includes(id)) {
      setSelectedUserIds(selectedUserIds.filter((item) => item !== id));
    } else {
      setSelectedUserIds([...selectedUserIds, id]);
    }
  };

  // Add User Handlers
  const handleOpenAddModal = () => {
    setFormData({ name: "", phone: "", email: "" });
    setIsAddModalOpen(true);
  };

  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email) return;

    const newUser: SystemUser = {
      id: `usr-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      events: [],
    };

    setUsers([newUser, ...users]);
    setIsAddModalOpen(false);
  };

  // Edit User Handlers
  const handleOpenEditModal = (userToEdit: SystemUser) => {
    setEditingUser(userToEdit);
    setFormData({
      name: userToEdit.name,
      phone: userToEdit.phone,
      email: userToEdit.email,
    });
    setActiveActionMenuId(null);
    setIsEditModalOpen(true);
  };

  const handleEditUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser || !formData.name || !formData.phone || !formData.email)
      return;

    setUsers(
      users.map((u) =>
        u.id === editingUser.id
          ? {
              ...u,
              name: formData.name,
              phone: formData.phone,
              email: formData.email,
            }
          : u
      )
    );
    setIsEditModalOpen(false);
    setEditingUser(null);
  };

  // Delete User Handlers
  const handleOpenDeleteModal = (ids: string[]) => {
    setDeletingUserIds(ids);
    setActiveActionMenuId(null);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    setUsers(users.filter((u) => !deletingUserIds.includes(u.id)));
    setSelectedUserIds(selectedUserIds.filter((id) => !deletingUserIds.includes(id)));
    setIsDeleteModalOpen(false);
    setDeletingUserIds([]);
  };

  // Assign Event Handlers
  const handleOpenAssignModal = (ids: string[]) => {
    setAssigningUserIds(ids);
    setActiveActionMenuId(null);
    setIsAssignModalOpen(true);
  };

  const handleConfirmAssign = (e: React.FormEvent) => {
    e.preventDefault();

    // Assign selected event and session to the targeted users
    setUsers(
      users.map((u) => {
        if (!assigningUserIds.includes(u.id)) return u;

        const existingEvent = u.events.find(
          (e) => e.title === assignData.event
        );
        let updatedEvents = [...u.events];

        if (existingEvent) {
          // Add session if not exists
          if (
            !existingEvent.sessions.some((s) => s.name === assignData.session)
          ) {
            updatedEvents = updatedEvents.map((e) =>
              e.title === assignData.event
                ? {
                    ...e,
                    sessions: [
                      ...e.sessions,
                      {
                        id: `ses-${Date.now()}`,
                        name: assignData.session,
                        time: "09:00 AM TO 05:00 PM",
                      },
                    ],
                  }
                : e
            );
          }
        } else {
          // Add new event
          updatedEvents.push({
            id: `evt-${Date.now()}`,
            title: assignData.event,
            sessions: [
              {
                id: `ses-${Date.now()}`,
                name: assignData.session,
                time: "09:00 AM TO 05:00 PM",
              },
            ],
          });
        }

        return { ...u, events: updatedEvents };
      })
    );

    setIsAssignModalOpen(false);
    setAssigningUserIds([]);
  };

  // Unassign Session
  const handleUnassignSession = (userId: string, eventId: string, sessionId: string) => {
    setUsers(
      users.map((u) => {
        if (u.id !== userId) return u;
        const updatedEvents = u.events
          .map((evt) => {
            if (evt.id !== eventId) return evt;
            return {
              ...evt,
              sessions: evt.sessions.filter((s) => s.id !== sessionId),
            };
          })
          .filter((evt) => evt.sessions.length > 0);
        return { ...u, events: updatedEvents };
      })
    );
  };

  const handleLogout = async () => {
    await logout();
    router.push("/signin");
  };

  // Helper to count total events and sessions for display
  const getEventSessionSummary = (user: SystemUser) => {
    const totalEvents = user.events.length;
    const totalSessions = user.events.reduce(
      (acc, evt) => acc + evt.sessions.length,
      0
    );
    const eventText = `${totalEvents} ${totalEvents === 1 ? "Event" : "Events"}`;
    const sessionText = `${totalSessions} ${
      totalSessions === 1 ? "Session" : "Sessions"
    }`;
    return `${eventText} & ${sessionText}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F5F8]">
        <div className="flex items-center gap-3 text-gray-600 text-sm font-semibold">
          <svg className="animate-spin h-5 w-5 text-[#FF5B22]" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading User Management...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#F4F5F8] font-sans text-gray-800">
      {/* Sidebar */}
      <Sidebar activeItem="user-management" />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200/80 px-6 sm:px-8 flex items-center justify-between shrink-0 relative z-10">
          <h1 className="text-lg font-bold text-gray-900 tracking-tight">
            User Management
          </h1>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2.5 cursor-pointer focus:outline-none"
            >
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 text-xs font-bold uppercase">
                {user?.fullName ? user.fullName.substring(0, 2) : "JD"}
              </div>
              <span className="text-xs font-bold text-gray-900">
                {user?.fullName || "Jane Doe"}
              </span>
              <svg
                className="w-3.5 h-3.5 text-gray-500 ml-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1.5 z-50 text-xs text-gray-700">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="font-semibold text-gray-900 truncate">
                    {user?.fullName || "Jane Doe"}
                  </p>
                  <p className="text-gray-500 text-[11px] truncate">
                    {user?.email || "jane.doe@example.com"}
                  </p>
                  <p className="text-[10px] text-[#FF5B22] font-semibold uppercase mt-0.5">
                    {user?.role || "ORGANIZER"}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 font-semibold transition-colors cursor-pointer flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Log out
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 sm:p-8 flex-1 max-w-[1500px] w-full mx-auto">
          {/* Controls Bar: Heading, Search Bar, Add User Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 shrink-0">
              System Users
            </h2>

            <div className="flex flex-1 items-center justify-between gap-4 max-w-3xl ml-0 sm:ml-6">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-xl">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-md text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#FF5B22] focus:border-[#FF5B22] shadow-2xs transition-all"
                />
              </div>

              {/* + Add User Button */}
              <button
                onClick={handleOpenAddModal}
                className="py-2.5 px-4 bg-[#FF5B22] hover:bg-[#E04B16] text-white text-xs font-semibold rounded-md flex items-center gap-1.5 transition-all shadow-xs cursor-pointer shrink-0"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add User</span>
              </button>
            </div>
          </div>

          {/* Main Container: Blank State or User Table */}
          <div className="bg-white rounded-lg border border-gray-200/80 shadow-xs min-h-[500px] flex flex-col justify-between relative overflow-hidden">
            {filteredUsers.length === 0 ? (
              /* BLANK STATE (um_01-1.png) */
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center my-auto">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-5">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-600 max-w-sm mb-6 leading-relaxed">
                  No user added yet. Add users to your event to get started.
                </p>
                <button
                  onClick={handleOpenAddModal}
                  className="py-2 px-6 bg-[#F4F5F8] hover:bg-[#FFEBE5] text-[#FF5B22] font-semibold text-xs rounded-md transition-colors border border-transparent hover:border-[#FF5B22]/20 cursor-pointer"
                >
                  Add User
                </button>
              </div>
            ) : (
              /* USER TABLE STATE (um_03-1.png, um_04-1.png, um_07-1.png) */
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[900px]">
                  <thead>
                    <tr className="border-b border-gray-100 text-[11px] text-gray-400 font-medium">
                      <th className="py-3.5 px-4 w-10">
                        <input
                          type="checkbox"
                          checked={isAllSelected}
                          onChange={handleSelectAll}
                          className="w-4 h-4 accent-[#FF5B22] rounded cursor-pointer border-gray-300"
                        />
                      </th>
                      <th className="py-3.5 px-3 font-medium text-gray-500 min-w-[180px]">
                        <div className="flex items-center gap-2">
                          <span>Select All</span>
                        </div>
                      </th>
                      <th className="py-3.5 px-4 font-normal text-gray-400">
                        User Name
                      </th>
                      <th className="py-3.5 px-4 font-normal text-gray-400">
                        Assigned Events & Sessions
                      </th>
                      <th className="py-3.5 px-4 font-normal text-gray-400">
                        Email
                      </th>
                      <th className="py-3.5 px-4 font-normal text-gray-400">
                        Phone Number
                      </th>
                      <th className="py-3.5 px-4 text-right font-normal text-gray-400 pr-6">
                        <div className="flex items-center justify-end gap-2">
                          {selectedUserIds.length > 0 && (
                            <button
                              onClick={() => handleOpenDeleteModal(selectedUserIds)}
                              className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                              title="Delete Selected Users"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.8}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          )}
                          <span>Action</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs text-gray-800 font-medium">
                    {filteredUsers.map((u) => {
                      const isSelected = selectedUserIds.includes(u.id);
                      const isExpanded = expandedUserId === u.id;

                      return (
                        <React.Fragment key={u.id}>
                          <tr className={`hover:bg-gray-50/70 transition-colors ${isSelected ? "bg-orange-50/20" : ""}`}>
                            <td className="py-4 px-4">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleToggleSelectUser(u.id)}
                                className="w-4 h-4 accent-[#10B981] rounded cursor-pointer border-gray-300"
                              />
                            </td>
                            <td className="py-4 px-3 font-semibold text-gray-900">
                              {u.name}
                            </td>
                            <td className="py-4 px-4">
                              {/* Assigned Events Accordion Button */}
                              <button
                                onClick={() => setExpandedUserId(isExpanded ? null : u.id)}
                                className="flex items-center gap-1.5 text-xs font-semibold text-gray-800 hover:text-[#FF5B22] transition-colors cursor-pointer"
                              >
                                <svg
                                  className={`w-3.5 h-3.5 text-gray-600 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                                <span>{getEventSessionSummary(u)}</span>
                              </button>
                            </td>
                            <td className="py-4 px-4 text-gray-600 font-normal">
                              {u.email}
                            </td>
                            <td className="py-4 px-4 text-gray-600 font-normal">
                              {u.phone}
                            </td>
                            <td className="py-4 px-4 text-right pr-6 relative">
                              <div className="inline-block relative">
                                <button
                                  onClick={() => setActiveActionMenuId(activeActionMenuId === u.id ? null : u.id)}
                                  className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
                                >
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                                  </svg>
                                </button>

                                {/* Action Dropdown Menu */}
                                {activeActionMenuId === u.id && (
                                  <div className="absolute right-0 mt-1 w-44 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-30 text-left text-xs text-gray-700">
                                    <button
                                      onClick={() => handleOpenEditModal(u)}
                                      className="w-full text-left px-3.5 py-2 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                                    >
                                      <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                      </svg>
                                      Edit User
                                    </button>
                                    <button
                                      onClick={() => handleOpenAssignModal([u.id])}
                                      className="w-full text-left px-3.5 py-2 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                                    >
                                      <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                      </svg>
                                      Assign Events
                                    </button>
                                    <div className="border-t border-gray-100 my-1"></div>
                                    <button
                                      onClick={() => handleOpenDeleteModal([u.id])}
                                      className="w-full text-left px-3.5 py-2 hover:bg-red-50 text-red-600 font-medium flex items-center gap-2 cursor-pointer"
                                    >
                                      <svg className="w-3.5 h-3.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>
                                      Delete User
                                    </button>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>

                          {/* Expanded Row Popover Card (um_07-1.png) */}
                          {isExpanded && (
                            <tr className="bg-gray-50/50">
                              <td colSpan={7} className="px-8 py-4">
                                {u.events.length === 0 ? (
                                  <div className="p-4 bg-white border border-gray-200 rounded-md text-center text-xs text-gray-500 max-w-md">
                                    No events or sessions assigned to this user yet.
                                    <button
                                      onClick={() => handleOpenAssignModal([u.id])}
                                      className="ml-2 text-[#FF5B22] font-semibold hover:underline"
                                    >
                                      Assign now
                                    </button>
                                  </div>
                                ) : (
                                  <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-2xs max-w-lg space-y-3">
                                    {u.events.map((evt) => (
                                      <div key={evt.id} className="space-y-2">
                                        <h4 className="text-xs font-bold text-gray-800">
                                          {evt.title}
                                        </h4>
                                        <div className="space-y-1.5 pl-1">
                                          {evt.sessions.map((ses) => (
                                            <div
                                              key={ses.id}
                                              className="flex items-center justify-between text-[11px]"
                                            >
                                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#FF5B22] text-white font-bold rounded-full text-[10px]">
                                                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                                                {ses.name} | {ses.time}
                                              </span>
                                              <button
                                                onClick={() => handleUnassignSession(u.id, evt.id, ses.id)}
                                                className="text-[11px] text-[#FF5B22] font-semibold hover:underline cursor-pointer"
                                              >
                                                Unassign
                                              </button>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination & Sticky Assign Button Footer */}
            {filteredUsers.length > 0 && (
              <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-white relative">
                {/* Pagination Controls */}
                <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                  <button className="w-8 h-8 rounded border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 bg-gray-50 cursor-pointer disabled:opacity-50">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button className="w-8 h-8 rounded border border-[#FF5B22] bg-white text-[#FF5B22] font-bold flex items-center justify-center cursor-pointer shadow-2xs">
                    1
                  </button>
                  <button className="w-8 h-8 rounded border border-gray-200 bg-white text-gray-700 font-semibold flex items-center justify-center hover:bg-gray-50 cursor-pointer">
                    2
                  </button>
                  <span className="px-1 text-gray-400">...</span>
                  <button className="w-8 h-8 rounded border border-gray-200 bg-white text-gray-700 font-semibold flex items-center justify-center hover:bg-gray-50 cursor-pointer">
                    9
                  </button>
                  <button className="w-8 h-8 rounded border border-gray-200 bg-white text-gray-700 font-semibold flex items-center justify-center hover:bg-gray-50 cursor-pointer">
                    10
                  </button>
                  <button className="w-8 h-8 rounded border border-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-900 bg-white cursor-pointer">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {/* Floating/Sticky Assign Users Button when items checked (um_04-1.png) */}
                {selectedUserIds.length > 0 && (
                  <button
                    onClick={() => handleOpenAssignModal(selectedUserIds)}
                    className="py-2 px-4 border border-[#FF5B22] text-[#FF5B22] hover:bg-[#FF5B22] hover:text-white font-bold text-xs rounded-md flex items-center gap-2 transition-all cursor-pointer shadow-xs"
                  >
                    <span>Assign {selectedUserIds.length} users</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ========================================================================= */}
      {/* ADD USER MODAL (um_02-1.png) */}
      {/* ========================================================================= */}
      {isAddModalOpen && (
        <div
          ref={addModalBackdropRef}
          onClick={(e) => {
            if (e.target === addModalBackdropRef.current) setIsAddModalOpen(false);
          }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            ref={addModalCardRef}
            className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100 relative"
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900">Add User</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAddUserSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  User Name<span className="text-red-500 ml-0.5">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter User Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-md text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#FF5B22] focus:border-[#FF5B22] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Contact No<span className="text-red-500 ml-0.5">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter Contact No"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-md text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#FF5B22] focus:border-[#FF5B22] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Email<span className="text-red-500 ml-0.5">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="Enter Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-md text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#FF5B22] focus:border-[#FF5B22] transition-all"
                />
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2 border border-gray-300 text-gray-700 font-semibold text-xs rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#FF5B22] hover:bg-[#E04B16] text-white font-semibold text-xs rounded-md shadow-xs transition-colors cursor-pointer"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* EDIT USER MODAL (um_08-1.png) */}
      {/* ========================================================================= */}
      {isEditModalOpen && (
        <div
          ref={editModalBackdropRef}
          onClick={(e) => {
            if (e.target === editModalBackdropRef.current) setIsEditModalOpen(false);
          }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            ref={editModalCardRef}
            className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100 relative"
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900">Edit User</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleEditUserSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  User Name<span className="text-red-500 ml-0.5">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-md text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FF5B22] focus:border-[#FF5B22] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Contact No<span className="text-red-500 ml-0.5">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-md text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FF5B22] focus:border-[#FF5B22] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Email<span className="text-red-500 ml-0.5">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-md text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FF5B22] focus:border-[#FF5B22] transition-all"
                />
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2 border border-gray-300 text-gray-700 font-semibold text-xs rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#FF5B22] hover:bg-[#E04B16] text-white font-semibold text-xs rounded-md shadow-xs transition-colors cursor-pointer"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DELETE USER CONFIRMATION MODAL (um_06-1.png) */}
      {/* ========================================================================= */}
      {isDeleteModalOpen && (
        <div
          ref={deleteModalBackdropRef}
          onClick={(e) => {
            if (e.target === deleteModalBackdropRef.current) setIsDeleteModalOpen(false);
          }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            ref={deleteModalCardRef}
            className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100 relative text-center"
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between text-left">
              <h3 className="text-base font-bold text-gray-900">Delete System Users</h3>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-500 mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>

              <h4 className="text-lg font-bold text-gray-900 mb-2">Warning</h4>

              <p className="text-xs text-gray-600 leading-relaxed max-w-xs mb-6">
                Are you sure you want to delete this user?
                <br />
                By deleting this user, you won't be able to access the system.
              </p>

              {/* Actions */}
              <div className="flex items-center justify-center gap-3 w-full">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs rounded-md transition-colors cursor-pointer"
                >
                  No, Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-6 py-2.5 bg-[#FF5B22] hover:bg-[#E04B16] text-white font-semibold text-xs rounded-md shadow-xs transition-colors cursor-pointer"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ASSIGN SYSTEM USER MODAL (um_05-1.png) */}
      {/* ========================================================================= */}
      {isAssignModalOpen && (
        <div
          ref={assignModalBackdropRef}
          onClick={(e) => {
            if (e.target === assignModalBackdropRef.current) setIsAssignModalOpen(false);
          }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            ref={assignModalCardRef}
            className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100 relative"
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900">Assign System User</h3>
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleConfirmAssign} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Event<span className="text-red-500 ml-0.5">*</span>
                </label>
                <select
                  value={assignData.event}
                  onChange={(e) => setAssignData({ ...assignData, event: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-md text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FF5B22] focus:border-[#FF5B22] transition-all cursor-pointer"
                >
                  <option value="Product Launch Event 2026">Product Launch Event 2026</option>
                  <option value="Annual Business Meetup">Annual Business Meetup</option>
                  <option value="Nivita Birthday - 3rd June 2026">Nivita Birthday - 3rd June 2026</option>
                  <option value="Tech Summit 2026">Tech Summit 2026</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Session<span className="text-red-500 ml-0.5">*</span>
                </label>
                <select
                  value={assignData.session}
                  onChange={(e) => setAssignData({ ...assignData, session: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-md text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FF5B22] focus:border-[#FF5B22] transition-all cursor-pointer"
                >
                  <option value="Entry Session">Entry Session</option>
                  <option value="Lunch Session">Lunch Session</option>
                  <option value="Keynote Session">Keynote Session</option>
                  <option value="Networking Session">Networking Session</option>
                  <option value="VIP Dinner Session">VIP Dinner Session</option>
                </select>
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="px-5 py-2 border border-gray-300 text-gray-700 font-semibold text-xs rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#FF5B22] hover:bg-[#E04B16] text-white font-semibold text-xs rounded-md shadow-xs transition-colors cursor-pointer"
                >
                  Assign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
