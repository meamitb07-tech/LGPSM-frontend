"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = "/pages/signin";
  };

  return (
    <div className="min-h-screen lg:h-screen flex bg-white font-[family-name:var(--font-space-grotesk)] relative overflow-hidden">
      {/* ── Left Hero Side (Orange Panel) ── */}
      <div className="hidden lg:flex w-[40%] xl:w-[42%] bg-[#FF5B22] items-center relative shrink-0 h-full">
        {/* Soft Radial Sunburst Ray Background (Clipped inside the left orange panel) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <svg className="w-full h-full object-cover" viewBox="0 0 600 600" fill="none">
            {Array.from({ length: 24 }).map((_, i) => {
              const angle = (i * 360) / 24;
              const rad = (angle * Math.PI) / 180;
              return (
                <polygon
                  key={i}
                  points={`300,300 ${300 + 900 * Math.cos(rad - 0.1)},${300 + 900 * Math.sin(rad - 0.1)} ${300 + 900 * Math.cos(rad + 0.1)},${300 + 900 * Math.sin(rad + 0.1)}`}
                  fill="#FFFFFF"
                />
              );
            })}
          </svg>
        </div>

        {/* ── Overlapping Image Card: Sticks out to the right OVER the white background ── */}
        <div className="relative z-20 w-[100%] h-[85vh] max-h-[720px] rounded-[12px] overflow-hidden shadow-[0_15px_30px_rgba(0,0,0,0.35)] border border-white/20 ml-8 xl:ml-12 shrink-0 my-auto">
          <Image
            src="/Auth.png"
            alt="Admin Register Banner"
            fill
            priority
            className="object-cover object-center"
          />
        </div>
      </div>

      {/* ── Right Form Side (Compact layout fitting perfectly in 100vh with 0 scrolling) ── */}
      <div className="w-full lg:w-[60%] xl:w-[58%] flex flex-col justify-center p-4 sm:p-6 lg:py-4 lg:pl-28 xl:pl-32 lg:pr-12 max-w-[650px] relative z-10 my-auto overflow-y-auto lg:overflow-y-visible">
        <div className="w-full">
          {/* Brand Logo */}
          <div className="mb-2.5">
            <Link href="/" className="inline-block">
              <Image
                src="/Nav_logo.png"
                alt="LGPSM Logo"
                width={150}
                height={36}
                className="h-8 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Back to Home Link */}
          <div className="mb-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-900 hover:text-[#FF5B22] transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>

          {/* Title & Subtitle */}
          <div className="mb-3.5">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight mb-0.5">
              Create your account
            </h1>
            <p className="text-xs text-gray-500 font-normal">
              Register here and start sending invitations digitally
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-2.5">
            {/* Full Name */}
            <div>
              <label className="block text-[11px] sm:text-xs font-semibold text-gray-900 mb-0.5">
                Full Name<span className="text-[#FF5B22] ml-0.5">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Enter your name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#F8F9FA] border border-gray-200/90 rounded-lg text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-gray-300 transition-all font-[family-name:var(--font-space-grotesk)]"
              />
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-[11px] sm:text-xs font-semibold text-gray-900 mb-0.5">
                Email Address<span className="text-[#FF5B22] ml-0.5">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="hello@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#F8F9FA] border border-gray-200/90 rounded-lg text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-gray-300 transition-all font-[family-name:var(--font-space-grotesk)]"
              />
            </div>

            {/* Phone No */}
            <div>
              <label className="block text-[11px] sm:text-xs font-semibold text-gray-900 mb-0.5">
                Phone no<span className="text-[#FF5B22] ml-0.5">*</span>
              </label>
              <input
                type="tel"
                required
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#F8F9FA] border border-gray-200/90 rounded-lg text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-gray-300 transition-all font-[family-name:var(--font-space-grotesk)]"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-[11px] sm:text-xs font-semibold text-gray-900 mb-0.5">
                Password<span className="text-[#FF5B22] ml-0.5">*</span>
              </label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Type your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#F8F9FA] border border-gray-200/90 rounded-lg text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-gray-300 transition-all pr-10 font-[family-name:var(--font-space-grotesk)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.05 10.05 0 013.98-1.063c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21M3 3l18 18" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-[11px] sm:text-xs font-semibold text-gray-900 mb-0.5">
                Confirm Password<span className="text-[#FF5B22] ml-0.5">*</span>
              </label>
              <div className="relative flex items-center">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  placeholder="Type password again"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#F8F9FA] border border-gray-200/90 rounded-lg text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-gray-300 transition-all pr-10 font-[family-name:var(--font-space-grotesk)]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                >
                  {showConfirmPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.05 10.05 0 013.98-1.063c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21M3 3l18 18" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-[#FF5B22] hover:bg-[#E04B16] text-white text-xs sm:text-sm font-bold rounded-lg shadow-sm transition-all hover:shadow cursor-pointer mt-3.5"
            >
              Register
            </button>
          </form>

          {/* Bottom Sign in Link */}
          <div className="text-center pt-3 text-xs text-gray-500">
            Already registered?{" "}
            <Link href="/pages/signin" className="text-[#FF5B22] font-semibold underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
