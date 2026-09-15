"use client";

import React from "react";
import Image from "next/image";

export default function SubHeroIntro() {
  return (
    <section className="pt-16 pb-12 bg-white text-center">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Title */}
        <h2 className="text-4xl sm:text-5xl lg:text-[52px] font-medium tracking-tight leading-[1.15] font-[family-name:var(--font-space-grotesk)]">
          <span className="text-[#0D0D0D]">Everything you need in</span>
          <br />
          <span className="text-gray-400 font-normal">a simple, intuitive design.</span>
        </h2>

        {/* Description */}
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-gray-500 font-normal leading-relaxed font-[family-name:var(--font-space-grotesk)]">
          LGPSM helps you create elegant digital invitations with QR codes, RSVP tracking, guest management, and instant sharing. Perfect for weddings, birthdays, corporate events, and special occasions.
        </p>

        {/* Book a Demo Button & Spiralled Arrow SVG matching design */}
        <div className="pt-2 flex flex-col items-center justify-center relative">
          <button className="px-6 py-2.5 bg-[#171D22] hover:bg-[#0F1418] text-white text-sm font-normal rounded-[10px] shadow-sm transition-all active:scale-95 font-sans tracking-wide cursor-pointer">
            Book a Demo
          </button>
          
          {/* Orange Spiralled Arrow SVG matching Figma design */}
          <div className="mt-0 text-[#FF5B22] flex justify-center z-10">
            <svg
              className="w-14 h-20 text-[#FF5B22]"
              viewBox="0 0 60 80"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Arching line with smooth spiral loop */}
              <path d="M 38 2 C 24 4, 14 14, 14 26 C 14 36, 26 34, 24 24 C 22 16, 12 20, 11 30 C 10 42, 13 56, 14 66" />
              {/* Arrowhead */}
              <path d="M 8 58 L 14 67 L 20 58" />
            </svg>
          </div>
        </div>

        {/* Dashboard Preview Image */}
        <div className="pt-2 max-w-[900px] mx-auto">
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-100">
            <Image
              src="/mid_page.png"
              alt="LGPSM Interactive App Dashboard Preview"
              width={1200}
              height={700}
              className="w-full h-auto object-cover"
            />
          </div>
        </div>

      </div>
    </section>
  );
}
