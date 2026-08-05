"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Unable to send reset link.");
      }

      setMessage(
        "Reset link has been sent to your email. Please check your inbox.",
      );
      setEmail("");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-black font-sans flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-xl bg-white border border-zinc-200 shadow-sm p-8 md:p-10">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.3em] uppercase text-zinc-400 hover:text-black transition-colors"
        >
          <ArrowLeft size={14} /> Back to Sign In
        </Link>

        <div className="mt-8 space-y-6">
          <div className="flex items-center gap-3 text-black">
            <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center">
              <Mail size={16} />
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-zinc-400">
                Account Recovery
              </p>
              <h1 className="text-3xl md:text-4xl font-serif">
                Forgot your password?
              </h1>
            </div>
          </div>

          <p className="text-sm text-zinc-600">
            Enter your email address and we will send you a secure reset link.
          </p>

          {error && (
            <div className="border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {message && (
            <div className="border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="group relative">
              <label className="absolute -top-3 left-0 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 transition-all">
                Email Address
              </label>
              <input
                required
                type="email"
                placeholder="collector@artspace.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-4 border-b border-zinc-200 bg-transparent text-xl font-serif placeholder:font-sans placeholder:text-zinc-200 placeholder:text-base focus:outline-none focus:border-black transition-all duration-500 pt-2"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white h-14 flex items-center justify-center gap-3 disabled:bg-zinc-600 transition-all duration-500"
            >
              <span className="text-xs font-bold tracking-[0.2em] uppercase">
                {isLoading ? "Sending..." : "Send Reset Link"}
              </span>
              {isLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : null}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
