"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Star, Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // 1. ตัวแปรเก็บข้อมูลฟอร์ม
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

  // 2. ฟังก์ชันอัปเดตข้อมูลเมื่อพิมพ์
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // 3. ฟังก์ชันสมัครสมาชิกผ่าน API Route
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        // สมัครผ่านปุ๊บ สั่ง Redirect ไปยัง Dashboard ทันทีโดยไม่ต้องรอตกลง Alert!
        window.location.href = "/dashboard";
      } else {
        setErrorMsg(data.error || "Something went wrong. Please try again.");
      }
    } catch (error: any) {
      setErrorMsg("Connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-white selection:text-black flex flex-col lg:flex-row overflow-hidden">
      {/* --- Part 1: The Visual (Left Side) --- */}
      <div className="hidden lg:flex w-[45%] relative flex-col justify-between p-12 border-r border-white/10">
        {/* Animated Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1536924940846-227afb31e2a5?q=80&w=2066&auto=format&fit=crop"
            className="w-full h-full object-cover opacity-40 grayscale hover:grayscale-0 transition-all duration-[2s] ease-in-out"
            alt="Artist Hands"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/50"></div>
        </div>

        {/* Floating Content */}
        <div className="relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-3 text-[10px] font-bold tracking-[0.3em] uppercase hover:text-zinc-300 transition-colors"
          >
            <ArrowLeft size={14} /> Back to Gallery
          </Link>
        </div>

        <div className="relative z-10 space-y-6">
          <h2 className="text-6xl font-serif leading-none mix-blend-screen">
            Create <br /> <i className="font-light text-zinc-400">Legacy.</i>
          </h2>
          <div className="h-[1px] w-20 bg-white/50"></div>
          <p className="text-xs font-mono text-zinc-400 max-w-xs leading-relaxed uppercase tracking-widest">
            Exclusively for curators, artists, and serious collectors. Access
            the unseen.
          </p>
        </div>
      </div>

      {/* --- Part 2: The Application Form (Right Side) --- */}
      <div className="w-full lg:w-[55%] relative flex flex-col justify-center bg-[#050505]">
        {/* Background Texture/Gradient */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

        <div className="max-w-xl mx-auto w-full p-10 z-10">
          {/* Form Header */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Star size={12} className="text-white fill-white animate-pulse" />
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-zinc-500">
                Membership Application
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif text-white">
              Apply for{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-600">
                Access
              </span>
            </h1>
          </div>

          {/* แสดงข้อความ Error ให้เข้ากับธีม */}
          {errorMsg && (
            <div className="mb-8 p-4 border border-red-900/50 bg-red-950/20 text-red-400 text-sm font-mono uppercase tracking-wider rounded">
              ⚠ {errorMsg}
            </div>
          )}

          {/* Luxurious Form */}
          <form onSubmit={handleRegister} className="space-y-10">
            {/* Name Row */}
            <div className="grid grid-cols-2 gap-10">
              <div className="group relative">
                <input
                  required
                  type="text"
                  id="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  className="peer w-full bg-transparent border-b border-white/20 py-3 text-xl font-serif text-white focus:outline-none focus:border-white transition-all placeholder:text-transparent"
                  placeholder="Name"
                />
                <label
                  htmlFor="firstname"
                  className="absolute left-0 -top-3 text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-zinc-600 peer-focus:-top-3 peer-focus:text-[10px] peer-focus:text-white transition-all cursor-text"
                >
                  First Name
                </label>
              </div>
              <div className="group relative">
                <input
                  required
                  type="text"
                  id="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  className="peer w-full bg-transparent border-b border-white/20 py-3 text-xl font-serif text-white focus:outline-none focus:border-white transition-all placeholder:text-transparent"
                  placeholder="Surname"
                />
                <label
                  htmlFor="lastname"
                  className="absolute left-0 -top-3 text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-zinc-600 peer-focus:-top-3 peer-focus:text-[10px] peer-focus:text-white transition-all cursor-text"
                >
                  Last Name
                </label>
              </div>
            </div>

            {/* Email */}
            <div className="group relative">
              <input
                required
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="peer w-full bg-transparent border-b border-white/20 py-3 text-xl font-serif text-white focus:outline-none focus:border-white transition-all placeholder:text-transparent"
                placeholder="Email"
              />
              <label
                htmlFor="email"
                className="absolute left-0 -top-3 text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-zinc-600 peer-focus:-top-3 peer-focus:text-[10px] peer-focus:text-white transition-all cursor-text"
              >
                Email Address
              </label>
            </div>

            {/* Password */}
            <div className="group relative">
              <input
                required
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                className="peer w-full bg-transparent border-b border-white/20 py-3 text-xl font-serif text-white focus:outline-none focus:border-white transition-all placeholder:text-transparent"
                placeholder="Password"
              />
              <label
                htmlFor="password"
                className="absolute left-0 -top-3 text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-zinc-600 peer-focus:-top-3 peer-focus:text-[10px] peer-focus:text-white transition-all cursor-text"
              >
                Set Password
              </label>
            </div>

            {/* Submit Area */}
            <div className="pt-8 flex items-center justify-between">
              <div className="text-zinc-500 text-xs max-w-[200px] leading-relaxed">
                By joining, you agree to our{" "}
                <a
                  href="#"
                  className="underline text-zinc-300 hover:text-white"
                >
                  Curator Terms
                </a>
                .
              </div>
              <button
                disabled={isLoading}
                className="bg-white text-black px-8 py-5 rounded-none flex items-center gap-4 hover:bg-zinc-200 hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <span className="text-xs font-bold tracking-[0.2em] uppercase">
                  {isLoading ? "Processing..." : "Join Now"}
                </span>
                {isLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <ArrowUpRight
                    size={18}
                    className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                  />
                )}
              </button>
            </div>
          </form>

          {/* Footer Link */}
          <div className="mt-16 border-t border-white/10 pt-6 text-center">
            <p className="text-zinc-500 text-xs tracking-widest uppercase">
              Already inside?{" "}
              <Link
                href="/login"
                className="text-white border-b border-white ml-2 pb-0.5 hover:text-zinc-300 hover:border-zinc-300 transition-all"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
