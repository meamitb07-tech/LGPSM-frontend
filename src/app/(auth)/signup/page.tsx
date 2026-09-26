"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { gsap } from "gsap";

export default function SignupPage() {
  const router = useRouter();
  const { register } = useAuth();

  // Mode Toggle State: "admin" | "user"
  const [authMode, setAuthMode] = useState<"admin" | "user">("admin");

  const heroRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Read mode from query param on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const modeParam = params.get("mode");
      if (modeParam === "user" || modeParam === "admin") {
        setAuthMode(modeParam);
      }
    }
  }, []);

  const handleModeSwitch = (mode: "admin" | "user") => {
    setAuthMode(mode);
    setErrorMessage("");
    setSuccessMessage("");
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("mode", mode);
      window.history.replaceState(null, "", url.pathname + url.search);
    }
  };

  useEffect(() => {
    if (authMode === "user") {
      const ctx = gsap.context(() => {
        if (heroRef.current) {
          gsap.fromTo(
            heroRef.current,
            { opacity: 0, x: -30, scale: 0.97 },
            { opacity: 1, x: 0, scale: 1, duration: 0.65, ease: "power2.out" }
          );
        }
        if (formRef.current) {
          gsap.fromTo(
            formRef.current.children,
            { opacity: 0, y: 16 },
            {
              opacity: 1,
              y: 0,
              duration: 0.45,
              stagger: 0.06,
              ease: "power2.out",
            }
          );
        }
      });
      return () => ctx.revert();
    }
  }, [authMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please try again.");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    setIsSubmitting(true);

    try {
      const targetRole = authMode === "admin" ? "ADMIN" : "ORGANIZER";
      const res = await register({
        fullName,
        email,
        password,
        role: targetRole,
        ...(phone.trim() ? { phone: phone.trim() } : {}),
      });

      if (res.success) {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("show_dashboard_popup", "true");
        }
        setSuccessMessage("Account created successfully! Redirecting...");
        setTimeout(() => {
          router.push("/dashboard");
        }, 800);
      } else {
        setErrorMessage(res.message || "Registration failed. Please check your inputs.");
      }
    } catch {
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col justify-between">
      {/* ── Mode Toggle Switcher Banner (Floating Header) ── */}
      <div className="w-full pt-4 pb-2 px-4 flex items-center justify-center z-30">
        <div className="bg-gray-200/80 p-1 rounded-full flex items-center gap-1 shadow-2xs border border-gray-300/60">
          <button
            type="button"
            onClick={() => handleModeSwitch("admin")}
            className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              authMode === "admin"
                ? "bg-[#FF5B22] text-white shadow-xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Admin
          </button>
          <button
            type="button"
            onClick={() => handleModeSwitch("user")}
            className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              authMode === "user"
                ? "bg-[#FF5B22] text-white shadow-xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            User / Organizer
          </button>
        </div>
      </div>

      {/* ── MODE 1: SUPER ADMIN CENTRED CARD ── */}
      {authMode === "admin" ? (
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-xs border border-gray-300 max-w-md w-full space-y-2">
            {/* Brand Logo Header */}
            <div className="text-center">
              <Link href="/" className="inline-block">
                <Image
                  src="/images/navbar/Nav_logo.png"
                  alt="LGPSM Logo"
                  width={180}
                  height={50}
                  priority
                  className="h-20 w-auto mx-auto object-contain"
                />
              </Link>
            </div>

            {/* Title & Subtitle */}
            <div className="text-center space-y-2">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                Admin Sign Up
              </h1>
              <p className="text-xs text-gray-400 font-medium">
                Create a new Super Admin account to access Dashboard
              </p>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-md flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Success Banner */}
            {successMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-md flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{successMessage}</span>
              </div>
            )}

            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-800 block">
                  Full Name<span className="text-[#FF5B22]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-md text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#FF5B22] transition-colors disabled:opacity-60"
                />
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-800 block">
                  Email Address<span className="text-[#FF5B22]">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="hello@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-md text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#FF5B22] transition-colors disabled:opacity-60"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-800 block">
                  Password<span className="text-[#FF5B22]">*</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="Type your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-md text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#FF5B22] transition-colors disabled:opacity-60"
                />
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-800 block">
                  Confirm Password<span className="text-[#FF5B22]">*</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-md text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#FF5B22] transition-colors disabled:opacity-60"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-[#FF5B22] hover:bg-[#E04B16] text-white text-xs sm:text-sm font-semibold rounded-md transition-colors cursor-pointer shadow-xs disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Creating Account...
                    </>
                  ) : (
                    "Sign up"
                  )}
                </button>
              </div>
            </form>

            {/* Bottom Link to Signin */}
            <div className="text-center pt-2 text-xs text-gray-400">
              Already have an admin account?{" "}
              <Link href="/signin?mode=admin" className="text-[#FF5B22] font-semibold hover:underline">
                Log in
              </Link>
            </div>
          </div>
        </div>
      ) : (
        /* ── MODE 2: USER / ORGANIZER REGISTER HERO MODE ── */
        <div className="flex-1 flex bg-white font-[family-name:var(--font-space-grotesk)] relative overflow-hidden">
          {/* Left Hero Side */}
          <div className="hidden lg:flex w-[40%] xl:w-[42%] bg-[#FF5B22] items-center relative shrink-0 h-full">
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
              <svg className="w-full h-full object-cover" viewBox="0 0 600 600" fill="none">
                {Array.from({ length: 24 }).map((_, i) => {
                  const angle = (i * 360) / 24;
                  const rad = (angle * Math.PI) / 180;
                  return (
                    <polygon
                      key={i}
                      points={`300,300 ${(300 + 900 * Math.cos(rad - 0.1)).toFixed(4)},${(300 + 900 * Math.sin(rad - 0.1)).toFixed(4)} ${(300 + 900 * Math.cos(rad + 0.1)).toFixed(4)},${(300 + 900 * Math.sin(rad + 0.1)).toFixed(4)}`}
                      fill="#FFFFFF"
                    />
                  );
                })}
              </svg>
            </div>

            <div ref={heroRef} className="relative z-20 w-[100%] h-[80vh] max-h-[680px] rounded-[12px] overflow-hidden shadow-[0_15px_30px_rgba(0,0,0,0.35)] border border-white/20 ml-8 xl:ml-12 shrink-0 my-auto">
              <Image
                src="/images/auth/Auth.png"
                alt="Register Banner"
                fill
                priority
                className="object-cover object-center"
              />
            </div>
          </div>

          {/* Right Form Side */}
          <div className="w-full lg:w-[60%] xl:w-[58%] flex flex-col justify-center p-4 sm:p-6 lg:py-4 lg:pl-24 xl:pl-28 lg:pr-12 max-w-[650px] relative z-10 my-auto overflow-y-auto">
            <div ref={formRef} className="w-full">
              {/* Brand Logo */}
              <div className="mb-2.5">
                <Link href="/" className="inline-block">
                  <Image
                    src="/images/navbar/Nav_logo.png"
                    alt="LGPSM Logo"
                    width={150}
                    height={36}
                    className="h-8 w-auto object-contain"
                  />
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

              {/* Error Banner */}
              {errorMessage && (
                <div className="mb-3 p-2.5 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg flex items-center gap-2">
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Success Banner */}
              {successMessage && (
                <div className="mb-3 p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-lg flex items-center gap-2">
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{successMessage}</span>
                </div>
              )}

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
                    disabled={isSubmitting}
                    className="w-full px-3.5 py-2 bg-white border border-gray-200/90 rounded-lg text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-gray-300 transition-all font-[family-name:var(--font-space-grotesk)] disabled:opacity-60"
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
                    disabled={isSubmitting}
                    className="w-full px-3.5 py-2 bg-white border border-gray-200/90 rounded-lg text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-gray-300 transition-all font-[family-name:var(--font-space-grotesk)] disabled:opacity-60"
                  />
                </div>

                {/* Phone No */}
                <div>
                  <label className="block text-[11px] sm:text-xs font-semibold text-gray-900 mb-0.5">
                    Phone no<span className="text-gray-400 font-normal ml-1">(optional)</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full px-3.5 py-2 bg-white border border-gray-200/90 rounded-lg text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-gray-300 transition-all font-[family-name:var(--font-space-grotesk)] disabled:opacity-60"
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
                      disabled={isSubmitting}
                      className="w-full px-3.5 py-2 bg-white border border-gray-200/90 rounded-lg text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-gray-300 transition-all pr-10 font-[family-name:var(--font-space-grotesk)] disabled:opacity-60"
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
                      disabled={isSubmitting}
                      className="w-full px-3.5 py-2 bg-white border border-gray-200/90 rounded-lg text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-gray-300 transition-all pr-10 font-[family-name:var(--font-space-grotesk)] disabled:opacity-60"
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
                  disabled={isSubmitting}
                  className="w-full py-3 bg-[#FF5B22] hover:bg-[#E04B16] text-white text-xs sm:text-sm font-bold rounded-lg shadow-sm transition-all hover:shadow cursor-pointer mt-3.5 disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Creating Account...
                    </>
                  ) : (
                    "Register"
                  )}
                </button>
              </form>

              {/* Bottom Sign in Link */}
              <div className="text-center pt-3 text-xs text-gray-500">
                Already registered?{" "}
                <Link href="/signin?mode=user" className="text-[#FF5B22] font-semibold underline">
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
