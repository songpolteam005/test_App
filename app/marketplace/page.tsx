"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";
import {
  LayoutDashboard,
  Image as ImageIcon,
  Heart,
  Settings,
  LogOut,
  Plus,
  Search,
  TrendingUp,
  Loader2,
  ArrowUpRight,
  ExternalLink,
} from "lucide-react";

const CATEGORIES = ["All", "Painting", "Sculpture", "Photography", "NFT"];

export default function MarketplacePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [artItems, setArtItems] = useState<any[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState<"newest" | "price_asc" | "price_desc">(
    "newest",
  );

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

      // ดึงผลงานทั้งหมดจากตาราง artworks
      const { data: artworks, error } = await supabase
        .from("artworks")
        .select("*, profiles(first_name, last_name, avatar_url)")
        .order("created_at", { ascending: false });

      if (!error && artworks) {
        setArtItems(artworks);
      } else if (error) {
        console.error("Failed to load artworks:", error.message);
      }

      // ดึงรายการ favorites ของ user ปัจจุบัน
      const { data: favs, error: favError } = await supabase
        .from("favorites")
        .select("artwork_id")
        .eq("user_id", user.id);

      if (!favError && favs) {
        setFavoriteIds(new Set(favs.map((f) => f.artwork_id)));
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

  const toggleFavorite = async (e: React.MouseEvent, artworkId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;

    const isFav = favoriteIds.has(artworkId);

    // Optimistic UI update
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (isFav) {
        next.delete(artworkId);
      } else {
        next.add(artworkId);
      }
      return next;
    });

    if (isFav) {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("artwork_id", artworkId);
      if (error) {
        console.error("Failed to remove favorite:", error.message);
        setFavoriteIds((prev) => new Set(prev).add(artworkId)); // revert
      }
    } else {
      const { error } = await supabase
        .from("favorites")
        .insert({ user_id: user.id, artwork_id: artworkId });
      if (error) {
        console.error("Failed to add favorite:", error.message);
        setFavoriteIds((prev) => {
          const next = new Set(prev);
          next.delete(artworkId); // revert
          return next;
        });
      }
    }
  };

  const shortName =
    user?.user_metadata?.first_name || user?.email?.split("@")[0] || "Guest";
  const initial =
    user?.user_metadata?.first_name?.[0]?.toUpperCase() ||
    user?.email?.[0]?.toUpperCase() ||
    "U";
  const displayName = user?.user_metadata?.first_name
    ? `${user.user_metadata.first_name} ${user.user_metadata.last_name || ""}`
    : user?.email || "Unknown Collector";

  const visibleItems = useMemo(() => {
    let items = [...artItems];

    if (category !== "All") {
      items = items.filter((item) => item.category === category);
    }

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      items = items.filter((item) =>
        (item.title || "").toLowerCase().includes(q),
      );
    }

    if (sort === "price_asc") {
      items.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    } else if (sort === "price_desc") {
      items.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    }

    return items;
  }, [artItems, category, query, sort]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center text-[#8B6F47]">
        <Loader2 className="animate-spin mr-2" size={18} />
        <span className="text-xs tracking-[0.2em] uppercase">
          Curating Marketplace
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
            active
          />
          <MenuItem
            href="/favorites"
            icon={<Heart size={18} strokeWidth={1.75} />}
            label="My Favorites"
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
          <header className="flex flex-col md:flex-row justify-between items-start md:items-end pb-8 border-b border-[#E4DFD5] mb-10 gap-6">
            <div>
              <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#8B6F47] mb-3">
                Global Art Collection
              </p>
              <h1 className="font-serif text-5xl md:text-6xl tracking-tight">
                Marketplace<span className="text-[#8B6F47]">.</span>
              </h1>
              <p className="text-sm text-zinc-500 mt-3">
                Discovering {artItems.length} curated works from exceptional
                creators.
              </p>
            </div>

            <Link
              href="/dashboard/post"
              className="bg-[#171412] text-white px-6 py-3.5 flex items-center gap-2 hover:bg-[#8B6F47] transition-colors duration-300"
            >
              <Plus size={15} strokeWidth={2} />
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase">
                Post New Work
              </span>
            </Link>
          </header>

          {/* Filter Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 pb-6 border-b border-[#E4DFD5]">
            {/* Search Input */}
            <div className="flex items-center gap-2 border-b border-[#E4DFD5] focus-within:border-[#171412] pb-2 px-1 md:w-80 transition-colors">
              <Search size={15} className="text-zinc-400 flex-shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title..."
                className="bg-transparent focus:outline-none text-sm w-full placeholder:text-zinc-400"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 overflow-x-auto py-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] whitespace-nowrap transition-all duration-200 ${
                    category === cat
                      ? "bg-[#171412] text-white"
                      : "bg-white text-zinc-500 border border-[#E4DFD5] hover:border-[#171412] hover:text-[#171412]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sort Select */}
            <div>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}
                className="text-[10px] font-bold uppercase tracking-[0.2em] border border-[#E4DFD5] bg-white px-4 py-2.5 focus:outline-none focus:border-[#171412] text-[#171412]"
              >
                <option value="newest">Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Artworks Grid */}
          {visibleItems.length === 0 ? (
            <div className="border border-dashed border-[#D9D2C4] p-16 text-center">
              <p className="font-serif italic text-lg text-zinc-400">
                {artItems.length === 0
                  ? "No artworks have been posted yet."
                  : "No artworks match your search."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
              {visibleItems.map((item) => {
                const isFav = favoriteIds.has(item.id);
                return (
                  <Link
                    href={`/artwork/${item.id}`}
                    key={item.id}
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

                      {item.user_id === user?.id && (
                        <span className="absolute top-2 left-2 bg-[#171412] text-white text-[9px] font-bold uppercase tracking-widest px-2 py-1">
                          Your Work
                        </span>
                      )}

                      <button
                        onClick={(e) => toggleFavorite(e, item.id)}
                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-md hover:scale-110 transition-transform z-10"
                        aria-label={
                          isFav ? "Remove from favorites" : "Add to favorites"
                        }
                      >
                        <Heart
                          size={15}
                          className={
                            isFav
                              ? "text-red-500 fill-red-500"
                              : "text-zinc-400"
                          }
                        />
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
                );
              })}
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
  href,
}: {
  icon: any;
  label: string;
  active?: boolean;
  href?: string;
}) {
  return (
    <Link
      href={href || "#"}
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
