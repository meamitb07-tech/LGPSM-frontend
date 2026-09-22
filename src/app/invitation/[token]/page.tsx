"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { invitationService, PublicInvitationData } from "@/services/invitationService";

export default function PublicInvitationPage() {
  const params = useParams();
  const token = params?.token as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [invitationData, setInvitationData] = useState<PublicInvitationData | null>(null);

  const [selectedRsvp, setSelectedRsvp] = useState<"ACCEPTED" | "DECLINED">("ACCEPTED");
  const [dietaryPref, setDietaryPref] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccessMsg, setSubmitSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError("Invitation token is missing.");
      setLoading(false);
      return;
    }

    async function fetchInvitation() {
      try {
        setLoading(true);
        const res = await invitationService.getPublicInvitation(token);
        
        let data: PublicInvitationData | null = null;
        if (res?.data && (res.data as any).event) {
          data = res.data as PublicInvitationData;
        } else if ((res as any)?.event) {
          data = res as unknown as PublicInvitationData;
        }

        if (data && data.event && data.invitee) {
          setInvitationData(data);
          if (data.invitee.rsvpStatus === "DECLINED") {
            setSelectedRsvp("DECLINED");
          } else {
            setSelectedRsvp("ACCEPTED");
          }
          if (data.invitee.dietaryPreference) {
            setDietaryPref(data.invitee.dietaryPreference);
          }
        } else {
          setError(res.message || "Invitation not found or link is invalid.");
        }
      } catch (err: any) {
        setError(err.message || "Failed to load invitation.");
      } finally {
        setLoading(false);
      }
    }

    fetchInvitation();
  }, [token]);

  const handleSubmitRsvp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      setSubmitting(true);
      setSubmitSuccessMsg(null);
      setError(null);

      const res = await invitationService.submitRsvp(token, {
        rsvpStatus: selectedRsvp,
        dietaryPreference: dietaryPref,
      });

      if (res.success || (res as any).data?.message) {
        setSubmitSuccessMsg("Thank you! Your RSVP has been saved.");
        // Re-fetch to reflect persisted backend data
        const updated = await invitationService.getPublicInvitation(token);
        const updatedData = (updated?.data && (updated.data as any).event)
          ? (updated.data as PublicInvitationData)
          : (updated as unknown as PublicInvitationData);
        
        if (updatedData && updatedData.invitee) {
          setInvitationData(updatedData);
        }
      } else {
        setError(res.message || "Failed to submit RSVP. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to submit RSVP.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#FF5B22] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-slate-500 font-medium">Loading invitation details...</p>
        </div>
      </div>
    );
  }

  if (error && !invitationData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-xl border border-slate-100 text-center space-y-4">
          <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-800">Invitation Not Found</h2>
          <p className="text-sm text-slate-600">{error}</p>
        </div>
      </div>
    );
  }

  const { event, invitee } = invitationData!;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        {/* Header Hero Banner */}
        <div className="bg-gradient-to-r from-[#FF5B22] to-[#ff7b4d] p-6 text-white text-center relative">
          <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
            Event Invitation
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight">{event.title}</h1>
          {event.format && (
            <p className="text-xs text-white/90 font-medium mt-1 uppercase tracking-wide">
              Format: {event.format}
            </p>
          )}
        </div>

        {/* Card Content */}
        <div className="p-6 space-y-6">
          {/* Invitee Welcome */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium">Invited Guest</p>
              <h2 className="text-base font-bold text-slate-800">{invitee.name}</h2>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium mb-0.5">RSVP Status</p>
              {invitee.rsvpStatus === "ACCEPTED" ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                  ACCEPTED
                </span>
              ) : invitee.rsvpStatus === "DECLINED" ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-700">
                  DECLINED
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
                  PENDING
                </span>
              )}
            </div>
          </div>

          {/* Event Details */}
          <div className="space-y-3">
            {event.description && (
              <p className="text-xs text-slate-600 leading-relaxed">{event.description}</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              {event.location && (
                <div className="flex items-start gap-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <svg className="w-4 h-4 text-[#FF5B22] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-slate-700">Location</p>
                    <p className="text-slate-500">{event.location}</p>
                  </div>
                </div>
              )}

              {event.schedule && (
                <div className="flex items-start gap-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <svg className="w-4 h-4 text-[#FF5B22] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-slate-700">Date & Time</p>
                    <p className="text-slate-500">
                      {event.schedule.startDate ? new Date(event.schedule.startDate).toLocaleDateString() : "TBD"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* RSVP Form */}
          <form onSubmit={handleSubmitRsvp} className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800">Respond to Invitation</h3>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-600">
                {error}
              </div>
            )}

            {submitSuccessMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-700 font-medium">
                {submitSuccessMsg}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedRsvp("ACCEPTED")}
                className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  selectedRsvp === "ACCEPTED"
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                    : "bg-white text-slate-700 border-slate-200 hover:border-emerald-300"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Accept</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRsvp("DECLINED")}
                className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  selectedRsvp === "DECLINED"
                    ? "bg-rose-600 text-white border-rose-600 shadow-sm"
                    : "bg-white text-slate-700 border-slate-200 hover:border-rose-300"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Decline</span>
              </button>
            </div>

            {/* Dietary Preference Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">Dietary Preference (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Vegetarian, Jain, Vegan, No Nuts..."
                value={dietaryPref}
                onChange={(e) => setDietaryPref(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#FF5B22] focus:bg-white transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 bg-[#FF5B22] hover:bg-[#E04B16] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving RSVP...</span>
                </>
              ) : (
                <span>Submit Response</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
