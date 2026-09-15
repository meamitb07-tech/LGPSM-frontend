"use client";

import React from "react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer
      className="relative text-gray-300 py-16 lg:py-24 overflow-hidden"
      style={{
        backgroundImage: "url('/Footer.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="relative z-10 max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top CTA Banner */}
        <div className="text-center max-w-xl mx-auto pb-16 lg:pb-24">
          <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-medium text-white tracking-tight leading-tight font-[family-name:var(--font-space-grotesk)]">
            Get started today
          </h2>
          
          <p className="text-xs sm:text-sm text-gray-300 font-normal leading-relaxed mt-3 font-[family-name:var(--font-space-grotesk)]">
            Design, customize, and share stunning QR-based invitations for weddings, events, and celebrations all in one simple platform.
          </p>

          {/* Email Subscription Form */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto mt-6"
          >
            <input
              type="email"
              placeholder="hello@example.com"
              className="w-full sm:w-72 px-4 py-2.5 rounded-md text-xs sm:text-sm text-gray-900 bg-white placeholder:text-gray-400 focus:outline-none shadow-md font-[family-name:var(--font-space-grotesk)]"
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 bg-[#FF5B22] hover:bg-[#E04B16] text-white text-xs sm:text-sm font-bold rounded-md transition-colors shadow-md shrink-0 font-[family-name:var(--font-space-grotesk)] cursor-pointer"
            >
              Sign Up Free
            </button>
          </form>
        </div>

        {/* Bottom Footer Section */}
        <div className="text-center max-w-lg mx-auto pt-8 border-t border-gray-800/60">
          {/* LGPSM Logo */}
          <div className="flex justify-center mb-4">
            <Image
              src="/Nav_logo.png"
              alt="LGPSM Logo"
              width={140}
              height={36}
              className="h-22 w-auto object-contain"
            />
          </div>

          {/* Footer Description Paragraph */}
          <p className="text-xs text-gray-400 leading-relaxed font-[family-name:var(--font-space-grotesk)]">
            LGPSM helps you create elegant digital invitations with QR codes, RSVP tracking, guest management, and instant sharing. Perfect for weddings, birthdays, corporate events, and special occasions.
          </p>

          {/* Navigation Links */}
          <div className="flex items-center justify-center gap-6 mt-6 text-xs font-semibold text-gray-400 font-[family-name:var(--font-space-grotesk)]">
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#pricing" className="hover:text-white transition-colors">
              Pricing
            </a>
            <a href="#contact" className="hover:text-white transition-colors">
              Contact
            </a>
          </div>

          {/* Copyright Line */}
          <p className="text-[11px] text-gray-500 mt-6 font-[family-name:var(--font-space-grotesk)]">
            Copyright ©2026 LGPSM. All Rights Reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}

