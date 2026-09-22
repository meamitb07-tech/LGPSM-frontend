"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { authService } from "@/services/authService";

type ForgotStage = "04A" | "04B" | "04C" | "04D";

function ForgotPasswordContent() {
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get("token") || "";

  const [stage, setStage] = useState<ForgotStage>("04A");
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  useEffect(() => {
    if (tokenFromUrl) {
      setResetToken(tokenFromUrl);
      setStage("04C");
    }
  }, [tokenFromUrl]);

  const handleStageA = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setInfoMessage("");
    setIsSubmitting(true);

    try {
      const res = await authService.forgotPassword(email);
      if (res.success) {
        setInfoMessage(res.message || "If the email exists, a reset link has been generated.");
        setStage("04B");
      } else {
        setErrorMessage(res.message || "Failed to process request. Please try again.");
      }
    } catch {
      setErrorMessage("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStageC = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setInfoMessage("");

    if (newPassword !== repeatPassword) {
      setErrorMessage("Passwords do not match. Please re-enter.");
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    if (!resetToken) {
      setErrorMessage("Password reset token is required. Please check your reset link.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await authService.resetPassword(resetToken, newPassword);
      if (res.success) {
        setStage("04D");
      } else {
        setErrorMessage(res.message || "Failed to reset password. Token may be invalid or expired.");
      }
    } catch {
      setErrorMessage("An error occurred during password reset.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen lg:h-screen flex bg-white font-[family-name:var(--font-space-grotesk)] relative overflow-hidden">
      {/* ── Stage Selector Tabs (Top Right for easy previewing of 04A, 04B, 04C, 04D) ── */}
      <div className="absolute top-4 right-4 z-50 bg-white/90 backdrop-blur border border-gray-200 p-1.5 rounded-md shadow-lg flex items-center gap-1 text-xs font-semibold text-gray-700">
        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider px-2">Flow Stage:</span>
        <button
          onClick={() => setStage("04A")}
          className={`px-2.5 py-1 rounded-lg transition-all ${stage === "04A" ? "bg-[#FF5B22] text-white shadow-sm" : "hover:bg-gray-100"
            }`}
        >
          04A: Email
        </button>
        <button
          onClick={() => setStage("04B")}
          className={`px-2.5 py-1 rounded-lg transition-all ${stage === "04B" ? "bg-[#FF5B22] text-white shadow-sm" : "hover:bg-gray-100"
            }`}
        >
          04B: Sent
        </button>
        <button
          onClick={() => setStage("04C")}
          className={`px-2.5 py-1 rounded-lg transition-all ${stage === "04C" ? "bg-[#FF5B22] text-white shadow-sm" : "hover:bg-gray-100"
            }`}
        >
          04C: Reset
        </button>
        <button
          onClick={() => setStage("04D")}
          className={`px-2.5 py-1 rounded-lg transition-all ${stage === "04D" ? "bg-[#FF5B22] text-white shadow-sm" : "hover:bg-gray-100"
            }`}
        >
          04D: Success
        </button>
      </div>

      {/* ── Left Hero Side (Orange Panel) ── */}
      <div className="hidden lg:flex w-[40%] xl:w-[42%] bg-[#FF5B22] items-center relative shrink-0 h-full">
        {/* Soft Radial Sunburst Ray Background */}
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

        {/* Overlapping Image Card */}
        <div className="relative z-20 w-[100%] h-[85vh] max-h-[720px] rounded-[12px] overflow-hidden shadow-[0_15px_30px_rgba(0,0,0,0.35)] border border-white/20 ml-8 xl:ml-12 shrink-0 my-auto">
          <Image
            src="/images/auth/Auth.png"
            alt="Admin Auth Banner"
            fill
            priority
            className="object-cover object-center"
          />
        </div>
      </div>

      {/* ── Right Content Side ── */}
      <div className="w-full lg:w-[60%] xl:w-[58%] flex flex-col justify-center p-6 sm:p-10 lg:py-6 lg:pl-32 lg:pr-16 max-w-[700px] relative z-10 my-auto overflow-y-auto lg:overflow-y-visible">
        <div className="w-full">
          {/* Brand Logo */}
          <div className="mb-6">
            <Link href="/" className="inline-block">
              <Image
                src="/images/navbar/Nav_logo.png"
                alt="LGPSM Logo"
                width={160}
                height={40}
                className="h-10 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Back Link */}
          {stage !== "04D" && (
            <div className="mb-8">
              <button
                type="button"
                onClick={() => {
                  if (stage === "04B") setStage("04A");
                  else if (stage === "04C") setStage("04B");
                  else window.location.href = "/signin";
                }}
                className="inline-flex items-center gap-2 text-xs font-semibold text-gray-900 hover:text-[#FF5B22] transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back
              </button>
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-xs sm:text-sm rounded-lg flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Info Banner */}
          {infoMessage && (
            <div className="mb-6 p-3 bg-blue-50 border border-blue-200 text-blue-700 text-xs sm:text-sm rounded-lg flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{infoMessage}</span>
            </div>
          )}

          {/* ───────────── STAGE 04A: ENTER EMAIL ───────────── */}
          {stage === "04A" && (
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-2">
                Forgot password
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 font-normal leading-relaxed mb-8">
                No worries! Enter email address below, and we&apos;ll send you a link to reset your password.
              </p>

              <form onSubmit={handleStageA} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                    Email Address<span className="text-[#FF5B22] ml-0.5">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="hello@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 bg-white border border-gray-200/90 rounded-lg text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-gray-300 transition-all font-[family-name:var(--font-space-grotesk)] disabled:opacity-60"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-[#FF5B22] hover:bg-[#E04B16] text-white text-sm font-bold rounded-lg shadow-sm transition-all cursor-pointer mt-4 disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </form>
            </div>
          )}

          {/* ───────────── STAGE 04B: CHECK EMAIL ───────────── */}
          {stage === "04B" && (
            <div className="pt-2">
              <div className="w-16 h-16 rounded-full bg-[#FF5B22]/10 flex items-center justify-center mb-6">
                <div className="w-10 h-10 rounded-full bg-[#FF5B22] flex items-center justify-center text-white shadow-sm">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-2">
                Check your email
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 font-normal leading-relaxed mb-8 max-w-md">
                We sent a password reset link to your email. Please check your inbox.
              </p>

              <button
                type="button"
                onClick={() => setStage("04C")}
                className="w-full py-3.5 bg-[#FF5B22] hover:bg-[#E04B16] text-white text-sm font-bold rounded-lg shadow-sm transition-all cursor-pointer mb-6"
              >
                Proceed to Reset Password
              </button>

              <div className="text-center text-xs text-gray-500">
                Didn&apos;t receive the email?{" "}
                <button
                  type="button"
                  onClick={() => setStage("04A")}
                  className="text-[#FF5B22] font-semibold underline cursor-pointer"
                >
                  Resend
                </button>
              </div>
            </div>
          )}

          {/* ───────────── STAGE 04C: CREATE NEW PASSWORD ───────────── */}
          {stage === "04C" && (
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-2">
                Create a new password
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 font-normal leading-relaxed mb-8">
                Enter your new password below to complete the reset process. Ensure it&apos;s strong and secure.
              </p>

              <form onSubmit={handleStageC} className="space-y-4">
                {!tokenFromUrl && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                      Reset Token<span className="text-[#FF5B22] ml-0.5">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Paste your reset token"
                      value={resetToken}
                      onChange={(e) => setResetToken(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 bg-white border border-gray-200/90 rounded-lg text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-gray-300 transition-all font-[family-name:var(--font-space-grotesk)] disabled:opacity-60"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                    New Password<span className="text-[#FF5B22] ml-0.5">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      required
                      placeholder="Type your new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 bg-white border border-gray-200/90 rounded-lg text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-gray-300 transition-all pr-10 font-[family-name:var(--font-space-grotesk)] disabled:opacity-60"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                    >
                      {showNewPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.05 10.05 0 013.98-1.063c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21M3 3l18 18" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                    Repeat New Password<span className="text-[#FF5B22] ml-0.5">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type={showRepeatPassword ? "text" : "password"}
                      required
                      placeholder="Repeat your password"
                      value={repeatPassword}
                      onChange={(e) => setRepeatPassword(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 bg-white border border-gray-200/90 rounded-lg text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-gray-300 transition-all pr-10 font-[family-name:var(--font-space-grotesk)] disabled:opacity-60"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                      className="absolute right-3 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                    >
                      {showRepeatPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.05 10.05 0 013.98-1.063c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21M3 3l18 18" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-[#FF5B22] hover:bg-[#E04B16] text-white text-sm font-bold rounded-lg shadow-sm transition-all cursor-pointer mt-6 disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? "Resetting Password..." : "Submit"}
                </button>
              </form>
            </div>
          )}

          {/* ───────────── STAGE 04D: SUCCESS RESET ───────────── */}
          {stage === "04D" && (
            <div className="pt-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-2 max-w-sm">
                Your password has been successfully reset!
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 font-normal leading-relaxed mb-8 max-w-md">
                You can now log in with your new password. If you encounter any issues, please contact support.
              </p>

              <Link
                href="/signin"
                className="block w-full text-center py-3.5 bg-[#FF5B22] hover:bg-[#E04B16] text-white text-sm font-bold rounded-lg shadow-sm transition-all"
              >
                Back to login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm font-semibold">Loading...</div>}>
      <ForgotPasswordContent />
    </Suspense>
  );
}
