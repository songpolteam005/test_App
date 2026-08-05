"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // บังคับ Refresh หน้าเว็บเพื่อนำ Cookie ใหม่ไปใช้งาน
        window.location.href = "/dashboard";
      } else {
        // 🟢 ดักจับ Error Message จาก API มาโชว์บน UI
        setError(data.error || "Invalid email or password");
      }
    } catch (err: any) {
      setError("Connection error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-black font-sans selection:bg-black selection:text-white flex overflow-hidden">
      {/* --- Left Column: The Form (40%) --- */}
      <div className="w-full lg:w-[40%] flex flex-col justify-between p-8 md:p-16 relative z-10 bg-[#FDFBF7]">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-zinc-400 hover:text-black transition-colors group"
          >
            <ArrowLeft
              size={14}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back to Gallery
          </Link>
        </div>

        <div className="space-y-12">
          <div>
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-zinc-400 block mb-4">
              Member Access
            </span>
            <h1 className="text-5xl md:text-6xl font-serif font-medium leading-tight">
              Enter the <br /> <i className="font-light">Collection.</i>
            </h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-[10px] font-bold tracking-widest uppercase">
                ⚠ {error}
              </div>
            )}

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

            <div className="group relative">
              <div className="flex justify-between absolute -top-3 w-full">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 transition-all">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-black transition-colors z-10"
                >
                  Forgot?
                </Link>
              </div>
              <input
                required
                type="password"
                placeholder="••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full py-4 border-b border-zinc-200 bg-transparent text-xl font-serif placeholder:font-sans placeholder:text-zinc-200 placeholder:text-base focus:outline-none focus:border-black transition-all duration-500 pt-2"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group w-full bg-black text-white h-14 flex items-center justify-between px-6 rounded-none hover:bg-zinc-800 disabled:bg-zinc-600 transition-all duration-500 cursor-pointer"
            >
              <span className="text-xs font-bold tracking-[0.2em] uppercase">
                {isLoading ? "Verifying..." : "Sign In"}
              </span>
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-2 transition-transform duration-300"
                />
              )}
            </button>
          </form>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-zinc-400">Not a collector yet?</span>
          <Link
            href="/register"
            className="font-bold underline underline-offset-4 decoration-1 decoration-zinc-300 hover:decoration-black transition-all"
          >
            Apply for membership
          </Link>
        </div>
      </div>

      {/* --- Right Column --- */}
      <div className="hidden lg:block w-[60%] relative bg-zinc-100 overflow-hidden group">
        <img
          src="https://images.unsplash.com/photo-1545989253-02cc26577f88?q=80&w=2000&auto=format&fit=crop"
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-[2s] ease-in-out scale-105 group-hover:scale-100"
          alt="Fine Art"
        />
        <div className="absolute top-12 right-12 border border-white/20 backdrop-blur-md bg-white/10 text-white p-6 max-w-xs transition-opacity duration-500 group-hover:opacity-100 opacity-80">
          <p className="font-serif text-2xl italic mb-2">
            "Silence is golden."
          </p>
          <p className="text-[10px] tracking-[0.2em] uppercase opacity-70">
            Featured Exhibition • 2024
          </p>
        </div>
        <div className="absolute bottom-0 left-0 pointer-events-none">
          <h2 className="text-[12rem] leading-none font-black text-white/10 tracking-tighter mix-blend-overlay select-none">
            ART.
          </h2>
        </div>
      </div>
    </div>
  );
}
