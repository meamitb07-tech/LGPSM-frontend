"use client";

import React from "react";
import Image from "next/image";

// Deterministic light gray tones for geometric mosaic grid background
const mosaicTiles = [
  "#F9FAFB", "#F3F4F6", "#E5E7EB", "#F9FAFB", "#EEF0F2", "#E2E8F0",
  "#E2E8F0", "#F8FAFC", "#F1F5F9", "#E5E7EB", "#F8FAFC", "#F1F5F9",
  "#F1F5F9", "#E5E7EB", "#F8FAFC", "#F3F4F6", "#E2E8F0", "#F9FAFB",
  "#F8FAFC", "#F1F5F9", "#E5E7EB", "#F8FAFC", "#F1F5F9", "#E2E8F0",
  "#E2E8F0", "#F8FAFC", "#F3F4F6", "#E5E7EB", "#F8FAFC", "#F1F5F9",
  "#F1F5F9", "#E5E7EB", "#F8FAFC", "#F1F5F9", "#E2E8F0", "#F8FAFC",
  "#F8FAFC", "#F1F5F9", "#E5E7EB", "#F8FAFC", "#F1F5F9", "#E2E8F0",
  "#E2E8F0", "#F8FAFC", "#F3F4F6", "#E5E7EB", "#F8FAFC", "#F1F5F9"
];

export default function ApplicationSection() {
  return (
    <section className="w-full relative overflow-hidden bg-white py-12 lg:py-16">
      {/* Container wrapping full section */}
      <div className="relative w-full min-h-[700px] lg:min-h-[780px] flex flex-col justify-between">
        
        {/* Split background layer */}
        <div className="absolute inset-0 flex w-full h-full pointer-events-none z-0">
          {/* Left ~62% Geometric Mosaic Tile Background */}
          <div className="w-[62%] h-full grid grid-cols-6 grid-rows-8 gap-0.5 opacity-80 border-r border-gray-200/50 overflow-hidden">
            {mosaicTiles.map((bg, idx) => (
              <div
                key={idx}
                style={{ backgroundColor: bg }}
                className="w-full h-full transition-opacity duration-300"
              />
            ))}
          </div>

          {/* Right ~38% Dark Slate Panel */}
          <div className="w-[38%] h-full bg-[#1C2228] relative">
            {/* Step numbers on far right edge */}
            <div className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 z-20">
              <span className="text-white text-xs font-bold font-[family-name:var(--font-space-grotesk)]">
                01
              </span>
              <div className="w-[2px] h-16 bg-gray-500/50 my-1" />
              <span className="text-gray-400 text-xs font-bold font-[family-name:var(--font-space-grotesk)]">
                05
              </span>
            </div>
          </div>
        </div>

        {/* Foreground Content Layer */}
        <div className="relative z-10 max-w-[1240px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex flex-col justify-between h-full">

          {/* Top Row: Upper right RSVP stats box sitting inside the dark panel area */}
          <div className="w-full flex justify-end mb-8">
            <div className="w-full max-w-xs lg:max-w-sm bg-[#1E252B]/90 backdrop-blur-md border border-gray-700/60 p-6 sm:p-7 shadow-xl">
              <p className="text-gray-400 text-xs font-medium tracking-wide mb-2 font-[family-name:var(--font-space-grotesk)]">
                RSVP Responses Collected
              </p>
              <p className="text-white text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight font-[family-name:var(--font-space-grotesk)]">
                500K+
              </p>
            </div>
          </div>

          {/* Center APPLICATION Section Badge */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="5" height="5" rx="1" fill="#FF5B22" />
              <rect x="9" y="2" width="5" height="5" rx="1" fill="#FF5B22" />
              <rect x="2" y="9" width="5" height="5" rx="1" fill="#FF5B22" />
              <rect x="9" y="9" width="5" height="5" rx="1" fill="#FF5B22" />
            </svg>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-gray-400 font-[family-name:var(--font-space-grotesk)]">
              APPLICATION
            </span>
          </div>

          {/* Main Registration Video & Form Card (Spans across both backgrounds) */}
          <div className="w-full max-w-[960px] mx-auto">
            <div className="rounded-[28px] p-4 sm:p-6 lg:p-7 bg-gradient-to-r from-[#FF7338] via-[#FF5B22] to-[#FF8546] shadow-2xl border border-orange-400/30">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                
                {/* Left Side: Laptop Typing Image with Play Overlay */}
                <div className="lg:col-span-5 relative rounded-2xl overflow-hidden min-h-[260px] sm:min-h-[300px] flex items-center justify-center bg-gray-900 group shadow-md">
                  {/* Laptop user typing image */}
                  <img
                    src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=800&q=80"
                    alt="LGPSM Video Preview"
                    className="w-full h-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

                  {/* Play Button Overlay */}
                  <div className="absolute z-10 w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-white/90 backdrop-blur-sm shadow-2xl flex items-center justify-center text-gray-800 transition-transform duration-300 group-hover:scale-110 cursor-pointer">
                    <svg className="w-7 h-7 text-gray-800 ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>

                {/* Right Side: Registration Form Card */}
                <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-7 shadow-xl flex flex-col justify-between">
                  <div>
                    {/* Header: Logo & Back Link */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Image
                          src="/Nav_logo.png"
                          alt="LGPSM Logo"
                          width={110}
                          height={28}
                          className="h-6 w-auto object-contain"
                        />
                      </div>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-0.5 font-[family-name:var(--font-space-grotesk)]">
                      Create your account
                    </h3>
                    <p className="text-xs text-gray-400 mb-4 font-[family-name:var(--font-space-grotesk)]">
                      Register here and start sending invitations digitally
                    </p>

                    {/* Google Sign-in button */}
                    <button className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors mb-3 cursor-pointer">
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                      </svg>
                      Sign in with Google
                    </button>

                    {/* OR Divider */}
                    <div className="flex items-center my-3">
                      <div className="flex-1 border-t border-gray-200" />
                      <span className="px-2 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                        OR
                      </span>
                      <div className="flex-1 border-t border-gray-200" />
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-3 text-left">
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                          Full Name*
                        </label>
                        <input
                          type="text"
                          readOnly
                          value="name@example.com"
                          className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg text-gray-400 bg-gray-50/50"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                          Email Address*
                        </label>
                        <input
                          type="text"
                          readOnly
                          value="name@example.com"
                          className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg text-gray-400 bg-gray-50/50"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                            Password*
                          </label>
                          <input
                            type="password"
                            readOnly
                            value="••••••••••••"
                            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg text-gray-400 bg-gray-50/50"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                            Confirm Password*
                          </label>
                          <input
                            type="password"
                            readOnly
                            value="••••••••••••"
                            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg text-gray-400 bg-gray-50/50"
                          />
                        </div>
                      </div>

                      {/* Checkbox and Forgot Password */}
                      <div className="flex items-center justify-between pt-1">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-[#FF5B22] focus:ring-[#FF5B22]"
                          />
                          <span className="text-[11px] text-gray-500 font-medium">
                            Remember me
                          </span>
                        </label>
                        <span className="text-[11px] font-medium text-gray-400 hover:text-gray-600 cursor-pointer">
                          Forgot Password?
                        </span>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button className="w-full mt-4 py-2.5 bg-[#FF5B22] hover:bg-[#E04B16] text-white text-xs font-bold rounded-lg shadow-md transition-colors cursor-pointer">
                      Register
                    </button>

                    <p className="text-[11px] text-gray-400 text-center mt-3">
                      Already registered?{" "}
                      <span className="text-[#FF5B22] font-semibold cursor-pointer hover:underline">
                        Sign In
                      </span>
                    </p>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

