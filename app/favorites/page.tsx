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

      // No .eq("user_id", ...) filter here on purpose — Marketplace shows
      // everyone's artworks, unlike the Dashboard overview.
      const { data: artworks, error } = await supabase
        .from("artworks")
        .select("*, profiles(first_name, last_name, avatar_url)")
        .order("created_at", { ascending: false });

      if (!error && artworks) {
        setArtItems(artworks);
      } else if (error) {
        console.error("Failed to load artworks:", error.message);
      }

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
    // "newest" is already the default order from the query.

    return items;
  }, [artItems, category, query, sort]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center text-zinc-400">
        <Loader2 className="animate-spin mr-2" /> Loading Marketplace...
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
            active
          />
          <MenuItem
            href="/favorites"
            icon={<Heart size={20} />}
            label="My Favorites"
          />
          <MenuItem icon={<TrendingUp size={20} />} label="Insights" />
          <MenuItem
            href="/settings"
            icon={<Settings size={20} />}
            label="Settings"
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
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-serif font-medium mb-1">
              Marketplace
            </h1>
            <p className="text-xs font-bold tracking-[0.2em] text-zinc-400 uppercase">
              {artItems.length} works from every artist on Artspace
            </p>
          </div>

          <Link
            href="/dashboard/post"
            className="bg-black text-white px-6 py-3 rounded-none flex items-center gap-2 hover:bg-zinc-800 transition shadow-lg shadow-black/10"
          >
            <Plus size={16} />{" "}
            <span className="text-xs font-bold tracking-[0.2em] uppercase">
              Post New Work
            </span>
          </Link>
        </header>

        {/* Filter bar */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-10 pb-6 border-b border-zinc-200">
          <div className="flex items-center gap-2 border-b border-zinc-200 pb-2 px-2 md:w-72">
            <Search size={16} className="text-zinc-400 flex-shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title..."
              className="bg-transparent focus:outline-none text-sm w-full"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 text-[10px] font-bold uppercase tracking-[0.15em] whitespace-nowrap transition-colors ${
                  category === cat
                    ? "bg-black text-white"
                    : "bg-white text-zinc-500 border border-zinc-200 hover:border-black hover:text-black"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="md:ml-auto">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="text-[10px] font-bold uppercase tracking-[0.15em] border border-zinc-200 bg-white px-4 py-2 focus:outline-none focus:border-black"
            >
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {visibleItems.length === 0 ? (
          <div className="bg-white border border-zinc-100 p-16 text-center">
            <p className="text-zinc-400 italic font-serif">
              {artItems.length === 0
                ? "No artworks have been posted yet."
                : "No artworks match your search."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {visibleItems.map((item) => {
              const isFav = favoriteIds.has(item.id);
              return (
                <Link
                  href={`/artwork/${item.id}`}
                  key={item.id}
                  className="group cursor-pointer block"
                >
                  <div className="relative overflow-hidden aspect-square mb-3 bg-zinc-100 shadow-sm">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button className="bg-white text-black p-3 rounded-full shadow-xl">
                        <ExternalLink size={16} />
                      </button>
                    </div>
                    {item.user_id === user?.id && (
                      <span className="absolute top-2 left-2 bg-black text-white text-[9px] font-bold uppercase tracking-widest px-2 py-1">
                        Your Work
                      </span>
                    )}
                    <button
                      onClick={(e) => toggleFavorite(e, item.id)}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                      aria-label={
                        isFav ? "Remove from favorites" : "Add to favorites"
                      }
                    >
                      <Heart
                        size={16}
                        className={
                          isFav ? "text-red-500 fill-red-500" : "text-zinc-400"
                        }
                      />
                    </button>
                  </div>
                  <h3 className="font-serif text-base line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-[10px] text-zinc-400 uppercase tracking-wider mt-0.5 line-clamp-1">
                    by{" "}
                    {item.profiles?.first_name
                      ? `${item.profiles.first_name} ${item.profiles.last_name || ""}`
                      : "Unknown Artist"}
                  </p>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider line-clamp-1">
                      {item.category}
                    </p>
                    <p className="text-xs font-bold">
                      ฿ {Number(item.price).toLocaleString()}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
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
