"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";
import {
  LayoutDashboard,
  Image as ImageIcon,
  Heart,
  Settings,
  LogOut,
  Loader2,
  ArrowUpRight,
  Trash2,
  ExternalLink,
} from "lucide-react";

export default function FavoritesPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [favoriteItems, setFavoriteItems] = useState<any[]>([]);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  useEffect(() => {
    const fetchFavorites = async () => {
      // 1. ตรวจสอบสถานะ User
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }
      setUser(user);

      // 2. ดึงรายการ Favorites พร้อมข้อมูล Artwork และ Profile ของศิลปิน
      const { data, error } = await supabase
        .from("favorites")
        .select(
          "id, artwork_id, artworks(*, profiles(first_name, last_name, avatar_url))",
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        // กรองเอาเฉพาะชิ้นงานที่มีข้อมูลจริง (เผื่อ artwork ถูกลบไปแล้ว)
        const items = data
          .map((fav: any) => ({
            favorite_id: fav.id,
            ...fav.artworks,
          }))
          .filter((item: any) => item.id);

        setFavoriteItems(items);
      } else if (error) {
        console.error("Error fetching favorites:", error.message);
      }

      setLoading(false);
    };

    fetchFavorites();
  }, []);

  // ฟังก์ชันลบออกจากรายการโปรด
  const handleRemoveFavorite = async (
    e: React.MouseEvent,
    favoriteId: string,
    artworkId: string,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    // Optimistic UI update: เอาออกจากหน้าจอทันที
    setFavoriteItems((prev) =>
      prev.filter(
        (item) => item.favorite_id !== favoriteId && item.id !== artworkId,
      ),
    );

    // ลบออกจากฐานข้อมูล Supabase
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("id", favoriteId);
    if (error) {
      console.error("Failed to delete favorite:", error.message);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center text-[#8B6F47]">
        <Loader2 className="animate-spin mr-2" size={18} />
        <span className="text-xs tracking-[0.2em] uppercase">
          Loading your curated collection
        </span>
      </div>
    );
  }

  const displayName = user?.user_metadata?.first_name
    ? `${user.user_metadata.first_name} ${user.user_metadata.last_name || ""}`
    : user?.email || "Unknown Collector";

  const initial =
    user?.user_metadata?.first_name?.[0]?.toUpperCase() ||
    user?.email?.[0]?.toUpperCase() ||
    "U";

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
            active
          />
          <MenuItem
            href="/settings"
            icon={<Settings size={18} strokeWidth={1.75} />}
            label="Settings"
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
              Curated Saved Items
            </p>
            <h1 className="font-serif text-5xl md:text-6xl tracking-tight">
              My Favorites<span className="text-[#8B6F47]">.</span>
            </h1>
            <p className="text-sm text-zinc-500 mt-3">
              You have {favoriteItems.length} saved artwork
              {favoriteItems.length !== 1 && "s"} in your personal list.
            </p>
          </header>

          {/* Grid แสดงงานศิลปะที่บันทึกไว้ */}
          {favoriteItems.length === 0 ? (
            <div className="border border-dashed border-[#D9D2C4] p-16 text-center">
              <Heart
                size={32}
                className="mx-auto text-zinc-300 mb-4"
                strokeWidth={1.2}
              />
              <p className="font-serif italic text-lg text-zinc-400 mb-2">
                No saved artworks yet.
              </p>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto mb-6">
                Explore the marketplace to discover and save extraordinary art
                pieces to your personal collection.
              </p>
              <Link
                href="/marketplace"
                className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase border-b border-[#171412] pb-1 hover:text-[#8B6F47] hover:border-[#8B6F47] transition-colors"
              >
                Explore Marketplace <ArrowUpRight size={13} />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
              {favoriteItems.map((item) => (
                <Link
                  href={`/artwork/${item.id}`}
                  key={item.favorite_id || item.id}
                  className="group cursor-pointer block"
                >
                  <div className="relative overflow-hidden aspect-[4/5] mb-4 bg-zinc-100">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="bg-white/90 text-[#171412] p-3 rounded-full shadow-lg">
                        <ExternalLink size={15} />
                      </span>
                    </div>

                    {/* ปุ่มลบออกจาก Favorites */}
                    <button
                      onClick={(e) =>
                        handleRemoveFavorite(e, item.favorite_id, item.id)
                      }
                      title="Remove from favorites"
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center shadow-md hover:scale-110 transition-all z-10"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <h3 className="font-serif text-base italic tracking-tight line-clamp-1 group-hover:text-[#8B6F47] transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-[10px] text-zinc-400 uppercase tracking-wider mt-1 line-clamp-1">
                    by{" "}
                    {item.profiles?.first_name
                      ? `${item.profiles.first_name} ${item.profiles.last_name || ""}`
                      : "Unknown Artist"}
                  </p>

                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-[#F0ECE1]">
                    <p className="text-[10px] text-zinc-400 uppercase tracking-wider line-clamp-1">
                      {item.category || "Fine Art"}
                    </p>
                    <p className="text-xs font-bold tabular-nums">
                      ฿ {Number(item.price || 0).toLocaleString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
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
