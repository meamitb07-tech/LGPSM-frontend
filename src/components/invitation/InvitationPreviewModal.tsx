"use client";

import React, { useState } from "react";
import InvitationCard, { InvitationCardData } from "./InvitationCard";
import { invitationService } from "@/services/invitationService";

interface InvitationPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  cardData: InvitationCardData;
}

export default function InvitationPreviewModal({
  isOpen,
  onClose,
  cardData,
}: InvitationPreviewModalProps) {
  const [downloading, setDownloading] = useState(false);

  if (!isOpen) return null;

  const handleDownloadCard = async () => {
    try {
      setDownloading(true);
      const eventId = cardData.event.id || "1";
      const inviteeId = cardData.invitee.id || "preview";
      const blob = await invitationService.previewCardPNG(eventId, inviteeId);
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Invitation_${cardData.invitee.name.replace(/\s+/g, "_")}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.warn("Direct card download fallback:", err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200 font-sans">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col max-h-[94vh] my-auto">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-black text-white flex items-center justify-between border-b border-gray-800 shrink-0">
          <div>
            <h3 className="text-base font-bold flex items-center gap-2">
              Live Personalized Invitation Card Preview
            </h3>
            <p className="text-xs text-gray-300 mt-0.5">
              Canonical visual preview for Gmail attachments &amp; WhatsApp media
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Modal Body Container with Scrollable Viewport */}
        <div className="p-4 sm:p-6 bg-gray-950 flex-1 overflow-y-auto flex justify-center items-start">
          <div className="w-full max-w-[620px] my-auto shadow-2xl rounded-2xl overflow-hidden border border-gray-800">
            <InvitationCard data={cardData} />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-white border-t border-gray-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-gray-600 font-medium">
            Invitee: <strong className="text-gray-900">{cardData.invitee.name}</strong> &bull; Event: <strong className="text-gray-900">{cardData.event.title}</strong>
          </div>

          <div className="flex items-center gap-2.5 ml-auto">
            <button
              type="button"
              onClick={() => {
                const rawMobile = cardData.invitee.mobile || "+919903107102";
                let cleaned = rawMobile.replace(/\D/g, "").replace(/^0+/, "");
                if (cleaned.length === 10) cleaned = `91${cleaned}`;
                const passUrl = cardData.invitationUrl || window.location.href;
                const text = `Dear ${cardData.invitee.name},\n\nYou are cordially invited to ${cardData.event.title}!\n\n📅 Date: ${cardData.event.date || "TBA"}\n⏰ Time: ${cardData.event.startTime || "TBA"}\n📍 Venue: ${cardData.event.venue || "TBA"}\n\nView your official Invitation Pass & QR Code here:\n${passUrl}\n\nWe look forward to hosting you!`;
                window.open(`https://api.whatsapp.com/send?phone=${cleaned}&text=${encodeURIComponent(text)}`, "_blank");
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
              <span>Send via WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadCard}
              disabled={downloading}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-lg transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              <svg className="w-4 h-4 text-[#CF5317]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>{downloading ? "Downloading..." : "Download Card PNG"}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-[#CF5317] hover:bg-[#b04310] text-white font-bold text-xs rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              Close Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
