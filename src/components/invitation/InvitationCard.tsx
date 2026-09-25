"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import QRCode from "qrcode";

export interface CardSessionData {
  id?: string;
  name: string;
  startTime: string;
  endTime?: string;
}

export interface InvitationCardData {
  invitee: {
    id?: string;
    name: string;
    companyName?: string;
    mobile?: string;
  };
  event: {
    id?: string;
    title: string;
    subtitle?: string;
    date?: string;
    dayOfWeek?: string;
    startTime?: string;
    timeSub?: string;
    venue?: string;
    locationSub?: string;
  };
  sessions: CardSessionData[];
  qrDataUrl?: string;
  invitationUrl?: string;
}

interface InvitationCardProps {
  data: InvitationCardData;
  className?: string;
}

export default function InvitationCard({ data, className = "" }: InvitationCardProps) {
  const [generatedQr, setGeneratedQr] = useState<string>("");

  useEffect(() => {
    if (data.qrDataUrl) {
      setGeneratedQr(data.qrDataUrl);
    } else if (data.invitationUrl) {
      QRCode.toDataURL(data.invitationUrl, { errorCorrectionLevel: "H", margin: 1 })
        .then((url) => setGeneratedQr(url))
        .catch(() => {});
    } else {
      // Sample QR for preview
      const sampleUrl = `https://lgpsm.app/invitation/sample-token-${data.invitee.id || "preview"}`;
      QRCode.toDataURL(sampleUrl, { errorCorrectionLevel: "H", margin: 1 })
        .then((url) => setGeneratedQr(url))
        .catch(() => {});
    }
  }, [data.qrDataUrl, data.invitationUrl, data.invitee.id]);

  // Split title into main and year (if year present)
  const fullTitle = (data.event?.title || "TECH SUMMIT 2026").trim();
  const titleWords = fullTitle.split(" ");
  let mainTitlePart = fullTitle;
  let yearPart = "";
  if (titleWords.length > 1 && /^\d{4}$/.test(titleWords[titleWords.length - 1])) {
    yearPart = titleWords.pop() || "";
    mainTitlePart = titleWords.join(" ");
  }

  const subtitleText = data.event?.subtitle || "INNOVATE  |  COLLABORATE  |  LEAD";
  const dateMain = data.event?.date || "15 OCT 2026";
  const dateSub = data.event?.dayOfWeek || "THURSDAY";
  const timeMain = data.event?.startTime || "09:00 AM";
  const timeSub = data.event?.timeSub || "ONWARDS";
  const venueMain = data.event?.venue || "RCCIIT AUDITORIUM";
  const venueSub = data.event?.locationSub || "KOLKATA, WB";
  const inviteeName = data.invitee?.name || "Subrata Saha";

  const sessions = data.sessions && data.sessions.length > 0
    ? data.sessions
    : [
        { name: "Opening Ceremony", startTime: "10:00 AM", endTime: "11:00 AM" },
        { name: "Technical Session", startTime: "11:30 AM", endTime: "01:00 PM" },
        { name: "Networking Session", startTime: "02:00 PM", endTime: "03:30 PM" }
      ];

  return (
    <div
      className={`relative w-full max-w-[720px] min-h-fit bg-[#FFFBF9] text-[#232222] font-sans overflow-hidden shadow-2xl rounded-2xl select-none flex flex-col justify-between ${className}`}
      style={{ background: "linear-gradient(180deg, #FFFBF9 0%, #F8F2ED 100%)" }}
    >
      {/* 1. TOP LIGHT CREAM SECTION */}
      <div className="relative pt-6 px-6 sm:px-10 shrink-0 z-10">
        {/* Top-Left Diagonal Orange Accent Lines */}
        <div className="absolute top-0 left-0 w-44 h-32 opacity-90 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 200 160" fill="none">
            <polygon points="0,0 180,0 80,160 0,160" fill="#CF5317" fillOpacity="0.12" />
            <line x1="-20" y1="120" x2="220" y2="-40" stroke="#CF5317" strokeWidth="10" />
            <line x1="10" y1="150" x2="250" y2="-10" stroke="#CF5317" strokeWidth="10" />
            <line x1="40" y1="180" x2="280" y2="20" stroke="#CF5317" strokeWidth="10" />
            <line x1="70" y1="210" x2="310" y2="50" stroke="#CF5317" strokeWidth="10" />
          </svg>
        </div>

        {/* Top-Right Navigation Text */}
        <div className="absolute top-5 right-6 sm:right-10 text-right">
          <div className="text-[9px] sm:text-[11px] font-bold text-[#232222] tracking-[0.25em] leading-tight">
            <div>PEOPLE</div>
            <div>EVENTS</div>
            <div>IDEAS</div>
            <div>TOGETHER</div>
          </div>
          <div className="mt-1 w-10 h-[2px] bg-[#CF5317] ml-auto"></div>
        </div>

        {/* Center Logo */}
        <div className="flex flex-col items-center justify-center pt-1 pb-1">
          <div className="relative w-40 sm:w-56 h-12 sm:h-16">
            <Image
              src="/images/branding/Logo.png"
              alt="LGPSM Logo"
              fill
              className="object-contain"
              priority
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
          </div>
        </div>

        {/* Event Main Title */}
        <div className="text-center mt-2 sm:mt-4">
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-[#232222]">
            {mainTitlePart}{" "}
            {yearPart && <span className="text-[#CF5317]">{yearPart}</span>}
          </h2>
          <p className="text-[9px] sm:text-[11px] font-bold text-[#232222] tracking-[0.3em] uppercase mt-1.5">
            {subtitleText}
          </p>
          <div className="w-40 sm:w-56 h-[1.5px] bg-[#CF5317] mx-auto mt-2"></div>
        </div>

        {/* Event Details Row (3 Columns) */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-3 sm:mt-5 pb-1 text-center max-w-xl mx-auto items-center">
          {/* Column 1: Date */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-2">
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg bg-[#CF5317] text-white flex items-center justify-center shrink-0 shadow-xs">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="text-left">
              <div className="text-[10px] sm:text-xs font-extrabold text-[#232222] leading-tight">{dateMain}</div>
              <div className="text-[8px] sm:text-[10px] font-bold text-gray-500 tracking-wider uppercase">{dateSub}</div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-l border-r border-gray-300 px-1 py-0.5">
            {/* Column 2: Time */}
            <div className="flex items-center justify-center gap-1.5 sm:gap-2">
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-[#CF5317] text-white flex items-center justify-center shrink-0 shadow-xs">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="text-[10px] sm:text-xs font-extrabold text-[#232222] leading-tight">{timeMain}</div>
                <div className="text-[8px] sm:text-[10px] font-bold text-gray-500 tracking-wider uppercase">{timeSub}</div>
              </div>
            </div>
          </div>

          {/* Column 3: Venue */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-2">
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg bg-[#CF5317] text-white flex items-center justify-center shrink-0 shadow-xs">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="text-left">
              <div className="text-[10px] sm:text-xs font-extrabold text-[#232222] leading-tight line-clamp-1">{venueMain}</div>
              <div className="text-[8px] sm:text-[10px] font-bold text-gray-500 tracking-wider uppercase">{venueSub}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. CURVED SWOOSH WAVE DIVIDER */}
      <div className="relative w-full h-14 sm:h-20 -mt-1 z-20 shrink-0">
        <svg className="w-full h-full preserve-3d" viewBox="0 0 1000 120" preserveAspectRatio="none" fill="none">
          {/* Orange Outer Curve */}
          <path d="M -10,20 C 350,110 750,-10 1010,40 L 1010,80 C 750,30 350,130 -10,50 Z" fill="#CF5317" />
          {/* Main Dark Body */}
          <path d="M -10,45 C 350,125 750,15 1010,65 L 1010,130 L -10,130 Z" fill="#232222" />
        </svg>
      </div>

      {/* 3. LOWER DARK CHARCOAL INVITATION AREA */}
      <div className="relative bg-[#232222] text-white flex-1 px-5 sm:px-10 pb-6 flex flex-col justify-between -mt-1 z-30 space-y-4">
        {/* Subtle Diagonal Texture Lines */}
        <div className="absolute inset-0 pointer-events-none opacity-10 overflow-hidden">
          <svg className="w-full h-full" stroke="#CF5317" strokeWidth="1.5">
            <line x1="-100" y1="100" x2="400" y2="600" />
            <line x1="-100" y1="160" x2="340" y2="600" />
            <line x1="700" y1="100" x2="1200" y2="600" />
            <line x1="760" y1="100" x2="1260" y2="600" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col items-center text-center space-y-3.5 sm:space-y-5">
          {/* Personal Invitation Heading */}
          <div className="flex items-center gap-2.5 w-full justify-center">
            <div className="w-10 sm:w-16 h-[2px] bg-[#CF5317]"></div>
            <span className="text-[9px] sm:text-[11px] font-bold tracking-[0.3em] uppercase text-white">
              PERSONAL INVITATION FOR
            </span>
            <div className="w-10 sm:w-16 h-[2px] bg-[#CF5317]"></div>
          </div>

          {/* Invitee Name & Company */}
          <div className="space-y-0.5">
            <h1 className="text-xl sm:text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-md">
              {inviteeName}
            </h1>
            <p className="text-[11px] sm:text-xs font-bold text-[#CF5317] tracking-[0.2em] uppercase">
              {data.invitee?.companyName || "LGPSM"}
            </p>
          </div>

          {/* Invitation Text */}
          <div className="space-y-0.5">
            <p className="text-[11px] sm:text-xs font-medium text-gray-300">You are cordially invited to attend</p>
            <p className="text-xs sm:text-sm font-extrabold text-[#CF5317] tracking-wide">{fullTitle}</p>
          </div>

          {/* 4. HIGH QUALITY QR CODE CONTAINER */}
          <div className="p-2.5 sm:p-3 bg-white rounded-xl border-4 sm:border-6 border-[#CF5317] shadow-xl flex items-center justify-center shrink-0">
            {generatedQr ? (
              <img
                src={generatedQr}
                alt="Invitation Entry QR Pass"
                className="w-32 h-32 sm:w-44 sm:h-44 object-contain rounded-md"
              />
            ) : (
              <div className="w-32 h-32 sm:w-44 sm:h-44 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400 font-mono">
                Generating QR...
              </div>
            )}
          </div>

          {/* QR Scan Instruction */}
          <div>
            <div className="flex items-center gap-2.5 justify-center">
              <div className="w-8 sm:w-14 h-[1.5px] bg-[#CF5317]"></div>
              <span className="text-[9px] sm:text-[11px] font-extrabold tracking-[0.25em] text-white uppercase">
                SCAN THIS QR CODE
              </span>
              <div className="w-8 sm:w-14 h-[1.5px] bg-[#CF5317]"></div>
            </div>
            <p className="text-[8px] sm:text-[10px] font-bold text-gray-400 tracking-wider mt-0.5">
              AT THE EVENT ENTRANCE
            </p>
          </div>

          {/* 5. YOUR SESSIONS SECTION */}
          <div className="w-full pt-1">
            <div className="flex items-center gap-2.5 justify-center mb-2.5">
              <div className="w-10 sm:w-16 h-[1.5px] bg-[#CF5317]"></div>
              <span className="text-[9px] sm:text-[11px] font-extrabold tracking-[0.3em] text-white uppercase">
                YOUR SESSIONS
              </span>
              <div className="w-10 sm:w-16 h-[1.5px] bg-[#CF5317]"></div>
            </div>

            {/* Session Cards Row / Grid */}
            <div className={`grid gap-2 sm:gap-3 w-full max-w-xl mx-auto ${
              sessions.length === 1 ? "grid-cols-1" : sessions.length === 2 ? "grid-cols-2" : "grid-cols-1 sm:grid-cols-3"
            }`}>
              {sessions.slice(0, 6).map((sess, idx) => {
                const numStr = (idx + 1).toString().padStart(2, "0");
                const timeStr = sess.endTime ? `${sess.startTime} – ${sess.endTime}` : sess.startTime;

                return (
                  <div
                    key={sess.id || idx}
                    className="relative bg-[#1A1919] border border-[#CF5317] rounded-lg p-2 sm:p-2.5 flex items-center gap-2 text-left shadow-sm hover:border-orange-400 transition-colors"
                  >
                    {/* Orange Circle with Session Number */}
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#CF5317] text-white flex items-center justify-center shrink-0 text-[10px] sm:text-xs font-extrabold shadow-2xs">
                      {numStr}
                    </div>

                    <div className="overflow-hidden flex-1">
                      <div className="text-[8px] sm:text-[10px] font-bold text-[#CF5317] tracking-tight">
                        {timeStr}
                      </div>
                      <div className="text-[10px] sm:text-xs font-bold text-white truncate">
                        {sess.name}
                      </div>
                    </div>

                    {/* Bottom Accent Bar */}
                    <div className="absolute bottom-1 left-9 right-2 h-[1px] bg-[#CF5317]/60"></div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 6. FOOTER */}
        <div className="relative pt-4 text-center shrink-0 z-10">
          <p className="text-[9px] sm:text-[11px] font-black tracking-[0.35em] text-white uppercase">
            SEE YOU AT THE EVENT
          </p>
          <div className="w-10 h-[2px] bg-[#CF5317] mx-auto mt-1"></div>
        </div>

        {/* Bottom Corner Orange Geometric Polygon Accents */}
        <div className="absolute bottom-0 left-0 w-20 h-20 pointer-events-none opacity-90">
          <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
            <polygon points="0,100 100,100 0,0" fill="#CF5317" />
            <polygon points="0,100 70,100 0,30" fill="#E86221" />
          </svg>
        </div>
        <div className="absolute bottom-0 right-0 w-20 h-20 pointer-events-none opacity-90">
          <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
            <polygon points="100,100 0,100 100,0" fill="#CF5317" />
            <polygon points="100,100 30,100 100,30" fill="#E86221" />
          </svg>
        </div>
      </div>
    </div>
  );
}
