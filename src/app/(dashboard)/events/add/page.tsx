"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { eventService } from "@/services/eventService";
import { getDynamicEventStatus } from "@/utils/eventUtils";
import { gsap } from "gsap";
import StepHeader from "@/components/add-event/StepHeader";
import Step1EventDetails from "@/components/add-event/Step1EventDetails";
import Step2Settings from "@/components/add-event/Step2Settings";
import Step3Sessions from "@/components/add-event/Step3Sessions";
import MobileCardPreview from "@/components/add-event/MobileCardPreview";

import SelectTemplateModal from "@/components/add-event/modals/SelectTemplateModal";
import DateTimePickerModal from "@/components/add-event/modals/DateTimePickerModal";
import InviteesPreviewModal from "@/components/add-event/modals/InviteesPreviewModal";
import SuccessModal from "@/components/add-event/modals/SuccessModal";

function getFormattedCurrentDateTime(offsetHours: number = 0): string {
  const date = new Date(Date.now() + offsetHours * 3600 * 1000);
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yy = String(date.getFullYear()).slice(-2);
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  const hh = String(hours).padStart(2, "0");
  return `${dd}/${mm}/${yy} ${hh}.${minutes} ${ampm}`;
}

export default function AddEventPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  const stepContentRef = useRef<HTMLDivElement>(null);

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTemplateSrc, setSelectedTemplateSrc] = useState("https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&q=80");

  // Form Date State default to exact current date & time
  const [startDate, setStartDate] = useState(() => getFormattedCurrentDateTime(0));
  const [endDate, setEndDate] = useState(() => getFormattedCurrentDateTime(0));
  const [rsvpDate, setRsvpDate] = useState(() => getFormattedCurrentDateTime(0));

  const [eventDetails, setEventDetails] = useState({
    title: "",
    description: "",
    category: "Corporate",
    subcategory: "",
    contactNumber: "",
    venue: "Grand Ballroom, Tech City",
  });

  // Modal Control States
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isDatePickerModalOpen, setIsDatePickerModalOpen] = useState(false);
  const [activeDateField, setActiveDateField] = useState<"start" | "end" | "rsvp">("start");
  const [isInviteesPreviewOpen, setIsInviteesPreviewOpen] = useState(false);
  const [activePreviewSession, setActivePreviewSession] = useState("Session 1 - Entry Session");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // GSAP Step Transition
  useEffect(() => {
    if (stepContentRef.current) {
      gsap.fromTo(
        stepContentRef.current,
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.35, ease: "power2.out" }
      );
    }
  }, [currentStep]);

  // Auth Guard
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/signin");
    }
  }, [isLoading, isAuthenticated, router]);

  const [datePickerCallback, setDatePickerCallback] = useState<((val: string) => void) | null>(null);

  const handleOpenDatePicker = (field: "start" | "end" | "rsvp", callback?: (val: string) => void) => {
    setActiveDateField(field);
    setDatePickerCallback(() => (callback ? callback : null));
    setIsDatePickerModalOpen(true);
  };

  const handleSaveDatePicker = (val: string) => {
    if (activeDateField === "start") setStartDate(val);
    else if (activeDateField === "end") setEndDate(val);
    else if (activeDateField === "rsvp") setRsvpDate(val);

    if (datePickerCallback) {
      datePickerCallback(val);
      setDatePickerCallback(null);
    }
  };

  const [activePreviewInvitees, setActivePreviewInvitees] = useState<any[]>([]);

  const handleOpenInviteesPreview = (sessionName: string, inviteesList?: any[]) => {
    setActivePreviewSession(sessionName);
    if (inviteesList && inviteesList.length > 0) {
      setActivePreviewInvitees(inviteesList);
    } else {
      const cached = localStorage.getItem("app_local_invitees_draft") || localStorage.getItem("app_local_invitees_1");
      if (cached) {
        try {
          setActivePreviewInvitees(JSON.parse(cached));
        } catch (e) {}
      }
    }
    setIsInviteesPreviewOpen(true);
  };

  const handleFinishEvent = async () => {
    const finalTitle = eventDetails.title.trim() || "New Tech Event 2026";
    const finalVenue = eventDetails.venue.trim() || "Grand Ballroom, Tech City";

    let createdId = "evt_" + Math.random().toString(36).substring(2, 9);
    try {
      const res = await eventService.createEvent({
        title: finalTitle,
        description: eventDetails.description || finalTitle,
        startDate: startDate,
        endDate: endDate,
        rsvpDeadline: rsvpDate,
        location: finalVenue,
        isPublic: true,
      });
      if (res?.data?.id || (res?.data as any)?._id || (res?.data as any)?.eventId) {
        createdId = res.data?.id || (res.data as any)?._id || (res.data as any)?.eventId;
      }
    } catch (e: any) {
      console.warn("Backend event creation network error, saving to local cache:", e);
    }

    // Always cache created event in localStorage so it displays instantly
    const newEventItem = {
      id: createdId,
      eventId: `#${String(createdId).slice(-4).toUpperCase()}`,
      eventName: finalTitle,
      title: finalTitle,
      organizer: user?.fullName || "Super Admin",
      createdOn: new Date().toLocaleDateString(),
      category: eventDetails.category || "Corporate",
      startDate: startDate,
      endDate: endDate,
      status: getDynamicEventStatus(startDate, endDate, "Upcoming"),
      venue: finalVenue,
    };

    try {
      const existing = JSON.parse(localStorage.getItem("app_local_events") || "[]");
      localStorage.setItem("app_local_events", JSON.stringify([newEventItem, ...existing]));

      const inviteesToSave = activePreviewInvitees.length > 0 ? activePreviewInvitees : JSON.parse(localStorage.getItem("app_local_invitees_draft") || "[]");
      if (inviteesToSave.length > 0) {
        localStorage.setItem(`app_local_invitees_${createdId}`, JSON.stringify(inviteesToSave));
        localStorage.setItem(`app_local_invitees_1`, JSON.stringify(inviteesToSave));
      }
    } catch (err) {
      console.error("Failed to write to localStorage:", err);
    }

    router.push(`/events/${createdId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F5F8]">
        <div className="flex items-center gap-3 text-gray-600 text-xs font-semibold">
          <svg className="animate-spin h-5 w-5 text-[#FF5B22]" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading Add Event...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-full bg-[#F4F5F8] font-sans text-gray-800">
      {/* ── Main Work Area ── */}
      <div className="flex-1 flex flex-col min-h-full overflow-x-hidden">
        {/* Top Navbar Header */}
        <header className="h-20 bg-white border-b border-gray-200 px-6 sm:px-8 flex items-center justify-between shrink-0">
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Add Event</h1>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-2 text-xs font-semibold text-gray-800 hover:text-gray-900 focus:outline-none cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold overflow-hidden border border-gray-300">
                <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
              <span>{user?.fullName || "Jane Doe"}</span>
              <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border border-gray-100 py-1.5 z-40 text-xs">
                <button
                  onClick={async () => {
                    await logout();
                    router.push("/signin");
                  }}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 font-semibold cursor-pointer"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </header>

        {/* ── Main Layout: Split 65% / 35% ── */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-white">
          {/* Left Side: Step Stepper & Active Step Form (65% width) */}
          <div className="w-full lg:w-[65%] flex flex-col overflow-y-auto">
            <StepHeader currentStep={currentStep} onStepClick={(step) => setCurrentStep(step)} />

            <div ref={stepContentRef} className="flex-1">
              {currentStep === 1 && (
                <Step1EventDetails
                  onNext={() => setCurrentStep(2)}
                  onOpenDatePicker={handleOpenDatePicker}
                  startDate={startDate}
                  endDate={endDate}
                  rsvpDate={rsvpDate}
                  initialData={eventDetails}
                  onDataChange={(data) => setEventDetails((prev) => ({ ...prev, ...data }))}
                />
              )}

              {currentStep === 2 && (
                <Step2Settings
                  onNext={() => setCurrentStep(3)}
                  onBack={() => setCurrentStep(1)}
                />
              )}

              {currentStep === 3 && (
                <Step3Sessions
                  onFinish={handleFinishEvent}
                  onBack={() => setCurrentStep(2)}
                  onOpenInviteesPreview={handleOpenInviteesPreview}
                  onOpenDatePicker={handleOpenDatePicker}
                  startDate={startDate}
                  endDate={endDate}
                />
              )}
            </div>
          </div>

          {/* Right Side: Smartphone Card Live Preview (35% width) */}
          <div className="w-full lg:w-[35%] shrink-0 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)]">
            <MobileCardPreview
              selectedTemplateSrc={selectedTemplateSrc}
              onOpenTemplateModal={() => setIsTemplateModalOpen(true)}
            />
          </div>
        </div>
      </div>

      {/* ── Interactive Modals ── */}
      <SelectTemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSelectTemplate={(src) => setSelectedTemplateSrc(src)}
      />

      <DateTimePickerModal
        isOpen={isDatePickerModalOpen}
        onClose={() => setIsDatePickerModalOpen(false)}
        onSave={handleSaveDatePicker}
      />

      <InviteesPreviewModal
        isOpen={isInviteesPreviewOpen}
        onClose={() => setIsInviteesPreviewOpen(false)}
        sessionName={activePreviewSession}
        inviteesList={activePreviewInvitees}
        onSave={(updatedList) => {
          setActivePreviewInvitees(updatedList);
          try {
            localStorage.setItem("app_local_invitees_draft", JSON.stringify(updatedList));
            localStorage.setItem("app_local_invitees_1", JSON.stringify(updatedList));
          } catch (e) {}
        }}
      />

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
      />
    </div>
  );
}
