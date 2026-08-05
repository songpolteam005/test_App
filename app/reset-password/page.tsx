"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FDFBF7] text-black font-sans flex items-center justify-center">
          <Loader2 className="animate-spin" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [recoveryCode, setRecoveryCode] = useState<string | null>(null);
  const [tokenHash, setTokenHash] = useState<string | null>(null);
  const [type, setType] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get("code");
    const hash = searchParams.get("token_hash");
    const msgType = searchParams.get("type");

    setRecoveryCode(code);
    setTokenHash(hash);
    setType(msgType);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password,
          code: recoveryCode,
          token_hash: tokenHash,
          type,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Unable to reset password.");
      }

      setMessage("Your password has been updated successfully.");
      setPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err.message || "Unable to reset password.");
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
          <div>
            <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-zinc-400">
              Account Security
            </p>
            <h1 className="text-3xl md:text-4xl font-serif mt-2">
              Set a new password
            </h1>
          </div>

          {error && (
            <div className="border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {message && (
            <div className="border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 flex items-center gap-2">
              <CheckCircle2 size={16} /> {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="group relative">
              <label className="absolute -top-3 left-0 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 transition-all">
                New Password
              </label>
              <input
                required
                type="password"
                placeholder="••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full py-4 border-b border-zinc-200 bg-transparent text-xl font-serif placeholder:font-sans placeholder:text-zinc-200 placeholder:text-base focus:outline-none focus:border-black transition-all duration-500 pt-2"
              />
            </div>

            <div className="group relative">
              <label className="absolute -top-3 left-0 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 transition-all">
                Confirm Password
              </label>
              <input
                required
                type="password"
                placeholder="••••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full py-4 border-b border-zinc-200 bg-transparent text-xl font-serif placeholder:font-sans placeholder:text-zinc-200 placeholder:text-base focus:outline-none focus:border-black transition-all duration-500 pt-2"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white h-14 flex items-center justify-center gap-3 disabled:bg-zinc-600 transition-all duration-500"
            >
              <span className="text-xs font-bold tracking-[0.2em] uppercase">
                {isLoading ? "Updating..." : "Reset Password"}
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
