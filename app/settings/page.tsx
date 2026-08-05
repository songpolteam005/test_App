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
  TrendingUp,
  Loader2,
  CheckCircle2,
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

  const shortName = firstName || user?.email?.split("@")[0] || "Guest";
  const initial =
    firstName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U";
  const displayName = firstName
    ? `${firstName} ${lastName || ""}`
    : user?.email || "Unknown Collector";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center text-zinc-400">
        <Loader2 className="animate-spin mr-2" /> Loading Settings...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-zinc-900 font-sans flex overflow-hidden">
      <aside className="w-20 lg:w-64 fixed h-screen border-r border-zinc-200 bg-white z-50 flex flex-col justify-between transition-all duration-300">
        <div className="h-24 flex items-center justify-center lg:justify-start lg:px-8 border-b border-zinc-100">
          <Link
            href="/"
            className="text-xl font-bold tracking-tighter uppercase"
          >
            Art<span className="text-zinc-400">.</span>
          </Link>
        </div>

        <nav className="flex-1 py-8 space-y-2 px-4">
          <MenuItem
            href="/dashboard"
            icon={<LayoutDashboard size={20} />}
            label="Overview"
          />
          <MenuItem
            href="/marketplace"
            icon={<ImageIcon size={20} />}
            label="Marketplace"
          />
          <MenuItem
            href="/favorites"
            icon={<Heart size={20} />}
            label="My Favorites"
          />
          <MenuItem icon={<TrendingUp size={20} />} label="Insights" />
          <MenuItem
            href="/settings"
            icon={<SettingsIcon size={20} />}
            label="Settings"
            active
          />
        </nav>

        <div className="p-4 border-t border-zinc-100 bg-zinc-50/50">
          <div className="flex items-center gap-4 p-3 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-serif text-lg uppercase flex-shrink-0">
              {initial}
            </div>
            <div className="hidden lg:block overflow-hidden">
              <p className="text-sm font-bold truncate">{displayName}</p>
              <p className="text-[10px] text-zinc-500 truncate uppercase tracking-widest">
                Collector
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full mt-2 flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-red-500 uppercase tracking-widest justify-center lg:justify-start px-4 py-2 transition-colors"
          >
            <LogOut size={14} />{" "}
            <span className="hidden lg:inline">Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-20 lg:ml-64 p-8 lg:p-12 overflow-y-auto h-screen">
        <header className="mb-10">
          <h1 className="text-3xl font-serif font-medium mb-1">Settings</h1>
          <p className="text-xs font-bold tracking-[0.2em] text-zinc-400 uppercase">
            Manage your profile
          </p>
        </header>

        <div className="max-w-xl bg-white border border-zinc-100 p-8 md:p-10 shadow-sm">
          <h2 className="text-xl font-serif mb-6">Profile Information</h2>

          {error && (
            <div className="mb-6 border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-6 border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 flex items-center gap-2">
              <CheckCircle2 size={16} /> {message}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="group relative">
                <label className="absolute -top-3 left-0 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                  First Name
                </label>
                <input
                  required
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full py-4 border-b border-zinc-200 bg-transparent text-lg font-serif focus:outline-none focus:border-black transition-all duration-500 pt-2"
                />
              </div>
              <div className="group relative">
                <label className="absolute -top-3 left-0 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full py-4 border-b border-zinc-200 bg-transparent text-lg font-serif focus:outline-none focus:border-black transition-all duration-500 pt-2"
                />
              </div>
            </div>

            <div className="group relative">
              <label className="absolute -top-3 left-0 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                Email Address
              </label>
              <input
                disabled
                type="email"
                value={user?.email || ""}
                className="w-full py-4 border-b border-zinc-200 bg-zinc-50 text-lg font-serif text-zinc-400 pt-2 cursor-not-allowed"
              />
              <p className="text-[10px] text-zinc-400 mt-2 tracking-wide">
                Email cannot be changed here.
              </p>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="bg-black text-white px-8 py-4 flex items-center justify-center gap-3 disabled:bg-zinc-600 transition-all duration-500"
            >
              <span className="text-xs font-bold tracking-[0.2em] uppercase">
                {saving ? "Saving..." : "Save Changes"}
              </span>
              {saving ? <Loader2 size={16} className="animate-spin" /> : null}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

function MenuItem({
  icon,
  label,
  active = false,
  href,
}: {
  icon: any;
  label: string;
  active?: boolean;
  href?: string;
}) {
  const content = (
    <div
      className={`flex items-center gap-4 px-4 py-3 cursor-pointer rounded-lg transition-all group ${active ? "bg-black text-white shadow-lg" : "text-zinc-500 hover:bg-zinc-100 hover:text-black"}`}
    >
      {icon}
      <span
        className={`text-sm font-medium hidden lg:block ${active ? "font-bold tracking-wide" : ""}`}
      >
        {label}
      </span>
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}
