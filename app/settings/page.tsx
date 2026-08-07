"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";
import {
  LayoutDashboard,
  Image as ImageIcon,
  Heart,
  Settings as SettingsIcon,
  LogOut,
  Loader2,
  CheckCircle2,
  User,
} from "lucide-react";

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = "/login";
        return;
      }
      setUser(user);

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("first_name, last_name")
        .eq("id", user.id)
        .single();

      if (!profileError && profile) {
        setFirstName(profile.first_name || "");
        setLastName(profile.last_name || "");
      }

      setLoading(false);
    };
    load();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!firstName.trim()) {
      setError("First name is required.");
      return;
    }

    setSaving(true);

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
      })
      .eq("id", user.id);

    if (updateError) {
      setError(updateError.message || "Unable to update profile.");
    } else {
      setMessage("Profile updated successfully.");
    }

    setSaving(false);
  };

  const displayName = firstName
    ? `${firstName} ${lastName || ""}`
    : user?.email || "Unknown Collector";

  const initial =
    firstName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center text-[#8B6F47]">
        <Loader2 className="animate-spin mr-2" size={18} />
        <span className="text-xs tracking-[0.2em] uppercase">
          Loading Settings
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#171412] font-sans flex overflow-hidden">
      {/* ---------- Sidebar ---------- */}
      <aside className="w-20 lg:w-64 fixed h-screen border-r border-[#E4DFD5] bg-white z-50 flex flex-col justify-between transition-all duration-300">
        <div className="h-24 flex items-center justify-center lg:justify-start lg:px-8 border-b border-[#E4DFD5]">
          <Link href="/" className="font-serif text-2xl tracking-tight italic">
            Art<span className="text-[#8B6F47] not-italic">.</span>
          </Link>
        </div>

        <nav className="flex-1 py-10 space-y-1 px-4">
          <p className="hidden lg:block px-4 mb-3 text-[10px] font-bold tracking-[0.25em] uppercase text-zinc-400">
            Collection
          </p>
          <MenuItem
            href="/dashboard"
            icon={<LayoutDashboard size={18} strokeWidth={1.75} />}
            label="Overview"
          />
          <MenuItem
            href="/marketplace"
            icon={<ImageIcon size={18} strokeWidth={1.75} />}
            label="Marketplace"
          />
          <MenuItem
            href="/favorites"
            icon={<Heart size={18} strokeWidth={1.75} />}
            label="My Favorites"
          />
          <MenuItem
            href="/settings"
            icon={<SettingsIcon size={18} strokeWidth={1.75} />}
            label="Settings"
            active
          />
        </nav>

        <div className="p-4 border-t border-[#E4DFD5] bg-[#FAF9F6]">
          <div className="flex items-center gap-3 p-3">
            <div className="w-9 h-9 rounded-full bg-[#171412] text-white flex items-center justify-center font-serif text-base uppercase flex-shrink-0">
              {initial}
            </div>
            <div className="hidden lg:block overflow-hidden">
              <p className="text-sm font-medium truncate">{displayName}</p>
              <p className="text-[10px] text-[#8B6F47] truncate uppercase tracking-widest">
                Collector
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full mt-1 flex items-center gap-2 text-[11px] font-medium text-zinc-400 hover:text-[#171412] uppercase tracking-widest justify-center lg:justify-start px-4 py-3 transition-colors"
          >
            <LogOut size={13} strokeWidth={1.75} />
            <span className="hidden lg:inline">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ---------- Main Content ---------- */}
      <main className="flex-1 ml-20 lg:ml-64 overflow-y-auto h-screen">
        <div className="max-w-[1400px] mx-auto p-8 lg:p-14">
          {/* Header */}
          <header className="pb-8 border-b border-[#E4DFD5] mb-12">
            <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#8B6F47] mb-3">
              Account Management
            </p>
            <h1 className="font-serif text-5xl md:text-6xl tracking-tight">
              Settings<span className="text-[#8B6F47]">.</span>
            </h1>
            <p className="text-sm text-zinc-500 mt-3">
              Update your collector identity and personal profile details.
            </p>
          </header>

          {/* Settings Form Container */}
          <div className="max-w-2xl bg-white border border-[#E4DFD5] p-8 md:p-12 shadow-sm">
            <h2 className="font-serif text-2xl tracking-tight mb-8 pb-4 border-b border-[#E4DFD5]">
              Profile Information
            </h2>

            {error && (
              <div className="mb-6 border border-red-200 bg-red-50/50 p-4 text-xs font-medium text-red-600">
                {error}
              </div>
            )}

            {message && (
              <div className="mb-6 border border-emerald-200 bg-emerald-50/50 p-4 text-xs font-medium text-emerald-700 flex items-center gap-2">
                <CheckCircle2 size={16} /> {message}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B6F47] mb-2">
                    First Name
                  </label>
                  <input
                    required
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full py-3 px-4 border border-[#E4DFD5] bg-[#FAF9F6] text-sm focus:outline-none focus:border-[#171412] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B6F47] mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full py-3 px-4 border border-[#E4DFD5] bg-[#FAF9F6] text-sm focus:outline-none focus:border-[#171412] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-2">
                  Registered Email
                </label>
                <input
                  disabled
                  type="email"
                  value={user?.email || ""}
                  className="w-full py-3 px-4 border border-[#E4DFD5] bg-zinc-100 text-sm text-zinc-400 cursor-not-allowed"
                />
                <p className="text-[10px] text-zinc-400 mt-2 tracking-wide">
                  Email addresses are managed via authentication security.
                </p>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#171412] text-white px-8 py-4 flex items-center justify-center gap-3 disabled:bg-zinc-400 text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#8B6F47] transition-colors duration-300"
                >
                  <span>{saving ? "Saving Changes..." : "Save Profile"}</span>
                  {saving && <Loader2 size={15} className="animate-spin" />}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

function MenuItem({
  icon,
  label,
  active = false,
  href = "#",
}: {
  icon: any;
  label: string;
  active?: boolean;
  href?: string;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-4 px-4 py-3 cursor-pointer transition-all group border-l-2 ${
        active
          ? "border-[#171412] bg-[#FAF9F6] text-[#171412]"
          : "border-transparent text-zinc-400 hover:border-[#D9D2C4] hover:text-[#171412]"
      }`}
    >
      {icon}
      <span
        className={`text-sm hidden lg:block ${active ? "font-medium" : ""}`}
      >
        {label}
      </span>
    </Link>
  );
}
