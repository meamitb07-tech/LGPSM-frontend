"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { SelectedTemplate } from "./eventDraft";
import { formatDateTime } from "@/utils/dateTime";

interface MobileCardPreviewProps {
  template: SelectedTemplate | null;
  eventTitle: string;
  eventStart: string;
  venue: string;
  onOpenTemplateModal: () => void;
}

const ZOOM_SCALE: Record<string, number> = { "100%": 1, "75%": 0.75, "50%": 0.5 };

// Live preview of the invitation using the selected template and the event details being entered
export default function MobileCardPreview({
  template,
  eventTitle,
  eventStart,
  venue,
  onOpenTemplateModal,
}: MobileCardPreviewProps) {
  const [zoomLevel, setZoomLevel] = useState("100%");
  const imageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (imageContainerRef.current) {
      gsap.fromTo(
        imageContainerRef.current,
        { opacity: 0.3, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.45, ease: "power2.out" }
      );
    }
  }, [template?.id]);

  return (
    <div className="w-full bg-white border-l border-gray-200 p-6 flex flex-col items-center justify-between min-h-full font-[family-name:var(--font-space-grotesk)]">
      {/* Top Controls Header */}
      <div className="w-full flex items-center justify-between mb-4">
        <span className="text-xs font-semibold px-3 py-1 bg-white border border-gray-200 rounded-md text-gray-700 shadow-2xs">
          Preview
        </span>

        <select
          value={zoomLevel}
          onChange={(e) => setZoomLevel(e.target.value)}
          aria-label="Preview zoom"
          className="text-xs font-semibold px-2 py-1 bg-white border border-gray-200 rounded-md text-gray-700 focus:outline-none cursor-pointer"
        >
          <option value="100%">100%</option>
          <option value="75%">75%</option>
          <option value="50%">50%</option>
        </select>
      </div>

      {/* Smartphone Outer Container */}
      <div className="my-auto py-2 flex flex-col items-center">
        <div
          className="relative w-[230px] sm:w-[250px] aspect-[9/18] bg-black rounded-[36px] p-2.5 shadow-2xl border-[3px] border-gray-800 origin-top transition-transform"
          style={{ transform: `scale(${ZOOM_SCALE[zoomLevel] ?? 1})` }}
        >
          {/* Speaker / Camera Notch */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-3 bg-black rounded-full z-20 flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-gray-900 rounded-full border border-gray-800" />
          </div>

          {/* Screen Display Area */}
          <div
            ref={imageContainerRef}
            className="relative w-full h-full rounded-[28px] overflow-hidden bg-gradient-to-br from-amber-100 via-rose-100 to-sky-100 flex items-center justify-center transition-all duration-300"
          >
            {template?.previewUrl ? (
              // Template previews can live on any host, so next/image domain allow-listing does not apply
              <img src={template.previewUrl} alt={template.name} className="absolute inset-0 w-full h-full object-cover" />
            ) : null}
            <div className="relative z-10 m-4 p-4 rounded-2xl bg-white/85 backdrop-blur-sm text-center space-y-2 shadow-md max-w-full">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#FF5B22]">You&apos;re invited</p>
              <p className="text-sm font-extrabold text-gray-900 leading-tight break-words line-clamp-3">
                {eventTitle.trim() || "Your event title"}
              </p>
              <p className="text-[11px] font-semibold text-gray-600">{formatDateTime(eventStart, "Date to be set")}</p>
              {venue.trim() && <p className="text-[10px] text-gray-500 break-words line-clamp-2">{venue}</p>}
              <p className="text-[10px] text-gray-400 font-medium pt-1 truncate">
                {template ? `Template: ${template.name}` : "No template selected"}
              </p>
            </div>
          </div>
        </div>

        {/* Change Template Button */}
        <button
          type="button"
          onClick={onOpenTemplateModal}
          className="mt-6 px-5 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 text-xs font-bold rounded-lg shadow-xs transition-all cursor-pointer"
        >
          {template ? "Change Template" : "Choose Template"}
        </button>

        <p className="text-[11px] text-gray-500 font-medium mt-3">
          Looking for custom card design?{" "}
          <Link href="/contact" className="text-[#FF5B22] font-semibold hover:underline">
            Contact us
          </Link>
        </p>
      </div>
    </div>
  );
}
