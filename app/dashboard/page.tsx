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
  Plus,
  Search,
  Loader2,
  ArrowUpRight,
  Sparkles,
  CalendarRange,
  Clock3,
  Trash2,
  ExternalLink,
} from "lucide-react";

// 🎨 15 ผลงานจำลองระดับมิวเซียม (Mock Data คัดรูปสวยหรู)
const MOCK_ARTWORKS = [
  {
    id: "mock-1",
    title: "Whispers of the Horizon",
    artist: "Clara Vance",
    category: "Painting",
    price: 45000,
    image_url:
      "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=800&auto=format&fit=crop",
    is_mock: true,
  },
  {
    id: "mock-2",
    title: "Monolith in Gold & Ash",
    artist: "Henrik Lindqvist",
    category: "Sculpture",
    price: 120000,
    image_url:
      "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop",
    is_mock: true,
  },
  {
    id: "mock-3",
    title: "Solitude at 04:00 AM",
    artist: "Aoi Takahashi",
    category: "Photography",
    price: 28000,
    image_url:
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=800&auto=format&fit=crop",
    is_mock: true,
  },
  {
    id: "mock-4",
    title: "Ethereal Resonance No. 7",
    artist: "Julian Thorne",
    category: "NFT",
    price: 85000,
    image_url:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop",
    is_mock: true,
  },
  {
    id: "mock-5",
    title: "Passage through Ochre",
    artist: "Camille Dubois",
    category: "Painting",
    price: 62000,
    image_url:
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=800&auto=format&fit=crop",
    is_mock: true,
  },
  {
    id: "mock-6",
    title: "Form & Void",
    artist: "Matteo Rossi",
    category: "Sculpture",
    price: 95000,
    image_url:
      "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=800&auto=format&fit=crop",
    is_mock: true,
  },
  {
    id: "mock-7",
    title: "Echoes of Kyoto",
    artist: "Kenji Sato",
    category: "Photography",
    price: 34000,
    image_url:
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=800&auto=format&fit=crop",
    is_mock: true,
  },
  {
    id: "mock-8",
    title: "Aura Synthesis",
    artist: "Nova Kaelen",
    category: "NFT",
    price: 110000,
    image_url:
      "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=800&auto=format&fit=crop",
    is_mock: true,
  },
  {
    id: "mock-9",
    title: "The Silent Conservatory",
    artist: "Eleanor Wright",
    category: "Painting",
    price: 53000,
    image_url:
      "https://images.unsplash.com/photo-1582562124811-c09040d0a901?q=80&w=800&auto=format&fit=crop",
    is_mock: true,
  },
  {
    id: "mock-10",
    title: "Gilded Marble Structure",
    artist: "Soren Mikkelsen",
    category: "Sculpture",
    price: 145000,
    image_url:
      "https://images.unsplash.com/photo-1578926375605-eaf7559b1458?q=80&w=800&auto=format&fit=crop",
    is_mock: true,
  },
  {
    id: "mock-11",
    title: "Dawn on Venetian Waters",
    artist: "Lucia Moretti",
    category: "Painting",
    price: 78000,
    image_url:
      "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=800&auto=format&fit=crop",
    is_mock: true,
  },
  {
    id: "mock-12",
    title: "Shadows over Concrete",
    artist: "David Miller",
    category: "Photography",
    price: 22000,
    image_url:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop",
    is_mock: true,
  },
  {
    id: "mock-13",
    title: "Celestial Algorithm",
    artist: "Zephyr Vox",
    category: "NFT",
    price: 98000,
    image_url:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop",
    is_mock: true,
  },
  {
    id: "mock-14",
    title: "Terra Cotta Dreams",
    artist: "Sofia Al-Mansoor",
    category: "Sculpture",
    price: 41000,
    image_url:
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?q=80&w=800&auto=format&fit=crop",
    is_mock: true,
  },
  {
    id: "mock-15",
    title: "Chronicles of Light",
    artist: "Gabriel Fontaine",
    category: "Photography",
    price: 39000,
    image_url:
      "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=800&auto=format&fit=crop",
    is_mock: true,
  },
];

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [myArtworks, setMyArtworks] = useState<any[]>([]);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const quickNotes = [
    {
      title: "Collector Spotlight",
      detail:
        "Your latest submission is featured in the weekly local artists showcase.",
      icon: <Sparkles size={15} strokeWidth={1.75} />,
    },
    {
      title: "Upcoming Review",
      detail: "Curator review scheduled for tomorrow at 14:00.",
      icon: <CalendarRange size={15} strokeWidth={1.75} />,
    },
    {
      title: "Live Activity",
      detail: "2 new wishlist saves and 1 follower request this morning.",
      icon: <Clock3 size={15} strokeWidth={1.75} />,
    },
  ];

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = "/login";
        return;
      }
      setUser(user);

      // ดึงเฉพาะผลงานจริงของ User
      const { data: artworks, error } = await supabase
        .from("artworks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && artworks) setMyArtworks(artworks);
      setLoading(false);
    };
    checkUser();
  }, []);

  const handleDeleteArtwork = async (
    e: React.MouseEvent,
    artworkId: string,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm("Are you sure you want to delete this artwork permanently?")) {
      return;
    }

    setMyArtworks((prev) => prev.filter((item) => item.id !== artworkId));

    const { error } = await supabase
      .from("artworks")
      .delete()
      .eq("id", artworkId);
    if (error) {
      console.error("Failed to delete artwork:", error.message);
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
          Preparing the gallery
        </span>
      </div>
    );
  }

  const displayName = user?.user_metadata?.first_name
    ? `${user.user_metadata.first_name} ${user.user_metadata.last_name || ""}`
    : user?.email || "Unknown Collector";

  const shortName =
    user?.user_metadata?.first_name || user?.email?.split("@")[0] || "Guest";
  const initial =
    user?.user_metadata?.first_name?.[0]?.toUpperCase() ||
    user?.email?.[0]?.toUpperCase() ||
    "U";

  // รวมรายการผลงานจริง + Mock เพื่อนำไปโชว์ใน Gallery
  const combinedGallery = [
    ...myArtworks,
    ...MOCK_ARTWORKS.slice(0, Math.max(0, 15 - myArtworks.length)),
  ];

  const portfolioValue = combinedGallery.reduce(
    (sum, item) => sum + Number(item.price || 0),
    0,
  );

  const accessionNumber = (index: number) => {
    const seq = String(index + 1).padStart(3, "0");
    return `AC.25.${seq}`;
  };

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
            icon={<LayoutDashboard size={18} strokeWidth={1.75} />}
            label="Overview"
            href="/dashboard"
            active
          />
          <MenuItem
            icon={<ImageIcon size={18} strokeWidth={1.75} />}
            label="Marketplace"
            href="/marketplace"
          />
          <MenuItem
            icon={<Heart size={18} strokeWidth={1.75} />}
            label="My Favorites"
            href="/favorites"
          />
          <MenuItem
            icon={<Settings size={18} strokeWidth={1.75} />}
            label="Settings"
            href="/settings"
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

      {/* ---------- Main ---------- */}
      <main className="flex-1 ml-20 lg:ml-64 overflow-y-auto h-screen">
        <div className="max-w-[1400px] mx-auto p-8 lg:p-14">
          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#E4DFD5] mb-12">
            <div>
              <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#8B6F47] mb-3">
                Collector Dashboard
              </p>
              <h1 className="font-serif text-5xl md:text-6xl tracking-tight">
                Overview<span className="text-[#8B6F47]">.</span>
              </h1>
              <p className="text-sm text-zinc-500 mt-3">
                Hello, {shortName} — here is your gallery update.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 border-b border-[#E4DFD5] focus-within:border-[#171412] pb-2 px-1 transition-colors">
                <Search size={15} className="text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search art..."
                  className="bg-transparent focus:outline-none text-sm w-40 placeholder:text-zinc-400"
                />
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
            </div>
          </header>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 mb-16 border-t border-l border-[#E4DFD5]">
            <StatCard
              title="Portfolio Value"
              value={`฿ ${portfolioValue.toLocaleString()}`}
              trend="Live total"
            />
            <StatCard
              title="Items for Sale"
              value={String(combinedGallery.length)}
              trend="Active gallery listings"
            />
            <StatCard
              title="Total Views"
              value="4.8k"
              trend="Across all works"
            />
          </div>

          {/* Quick notes */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-px bg-[#E4DFD5] mb-16 border border-[#E4DFD5]">
            {quickNotes.map((note) => (
              <div
                key={note.title}
                className="bg-white p-7 hover:bg-[#FAF9F6] transition-colors duration-300"
              >
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B6F47] mb-3">
                  {note.icon}
                  {note.title}
                </div>
                <p className="text-sm text-zinc-600 leading-6">{note.detail}</p>
              </div>
            ))}
          </div>

          {/* Gallery Showcase (15 Works) */}
          <div className="space-y-8 mb-16">
            <div className="flex justify-between items-end border-b border-[#E4DFD5] pb-4">
              <div>
                <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#8B6F47] mb-2">
                  Curated Collection
                </p>
                <h2 className="font-serif text-3xl tracking-tight">
                  Featured Gallery Showcase ({combinedGallery.length})
                </h2>
              </div>
              <Link
                href="/marketplace"
                className="flex items-center gap-1 text-xs font-bold tracking-[0.2em] uppercase hover:text-[#8B6F47] transition-colors"
              >
                View Marketplace <ArrowUpRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
              {combinedGallery.map((item, index) => (
                <Link
                  href={item.is_mock ? "/marketplace" : `/artwork/${item.id}`}
                  key={item.id}
                  className="group cursor-pointer block"
                >
                  <div className="relative overflow-hidden aspect-[4/5] mb-4 bg-zinc-100">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* แท็กแยกระหว่างงานของเรากับงานจำลอง */}
                    {!item.is_mock ? (
                      <>
                        <span className="absolute top-2 left-2 bg-[#171412] text-white text-[8px] font-bold uppercase tracking-widest px-2 py-1 z-10">
                          Your Work
                        </span>
                        <button
                          onClick={(e) => handleDeleteArtwork(e, item.id)}
                          title="Delete this artwork permanently"
                          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center shadow-md hover:scale-110 transition-all z-10"
                        >
                          <Trash2 size={13} />
                        </button>
                      </>
                    ) : (
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="bg-white/90 text-[#171412] p-2.5 rounded-full shadow-lg">
                          <ExternalLink size={14} />
                        </span>
                      </div>
                    )}

                    <span className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm text-white text-[9px] tracking-widest px-2 py-1">
                      {accessionNumber(index)}
                    </span>
                  </div>

                  <h3 className="font-serif text-base italic tracking-tight line-clamp-1 group-hover:text-[#8B6F47] transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-[10px] text-zinc-400 uppercase tracking-wider mt-1 line-clamp-1">
                    by {item.artist || "You"}
                  </p>

                  <div className="flex justify-between items-center mt-1.5 pt-1.5 border-t border-[#F0ECE1]">
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
          </div>

          {/* Activity */}
          <div className="grid lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex justify-between items-end border-b border-[#E4DFD5] pb-4">
                <h2 className="font-serif text-xl tracking-tight">
                  Recent Sales Activity
                </h2>
              </div>
              <div className="border border-dashed border-[#D9D2C4] p-10 text-center">
                <p className="text-zinc-400 italic font-serif">
                  No sales data recorded this week.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-end border-b border-[#E4DFD5] pb-4">
                <h2 className="font-serif text-xl tracking-tight">
                  System Log
                </h2>
              </div>
              <div className="space-y-5">
                <ActivityItem
                  action="Session Started"
                  target={`Logged in as ${shortName}`}
                  time="Just now"
                  highlight
                />
                <ActivityItem
                  action="Database Sync"
                  target="Connection established"
                  time="2m ago"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function MenuItem({
  icon,
  label,
  href = "#",
  active = false,
}: {
  icon: any;
  label: string;
  href?: string;
  active?: boolean;
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

function StatCard({
  title,
  value,
  trend,
}: {
  title: string;
  value: string;
  trend: string;
}) {
  return (
    <div className="bg-white p-8 border-b border-r border-[#E4DFD5]">
      <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-zinc-400 mb-4">
        {title}
      </p>
      <h3 className="font-serif text-4xl tracking-tight mb-3 tabular-nums">
        {value}
      </h3>
      <div className="text-[10px] font-bold uppercase tracking-widest text-[#8B6F47]">
        {trend}
      </div>
    </div>
  );
}

function ActivityItem({
  action,
  target,
  time,
  highlight = false,
}: {
  action: string;
  target: string;
  time: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-start gap-4 group">
      <div
        className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${
          highlight ? "bg-[#8B6F47]" : "bg-[#D9D2C4]"
        }`}
      ></div>
      <div className="flex-1">
        <p className="text-xs font-bold text-[#171412] uppercase tracking-tight">
          {action}
        </p>
        <p className="text-xs text-zinc-500">{target}</p>
      </div>
      <span className="text-[10px] text-zinc-300 font-mono tabular-nums">
        {time}
      </span>
    </div>
  );
}
