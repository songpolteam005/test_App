"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
// 1. เปลี่ยนตัว Import มาใช้ของ @supabase/ssr ที่อ่านคุกกี้เก่งๆ
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
  Sparkles,
  CalendarRange,
  Clock3,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  // เก็บผลงานจริงที่ดึงมาจากตาราง artworks (แทน mock data เดิม)
  const [artItems, setArtItems] = useState<any[]>([]);

  // 2. สร้าง Supabase Client ตัวใหม่ที่ตั้งค่าให้อ่านคุกกี้ได้
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const quickNotes = [
    {
      title: "Collector Spotlight",
      detail:
        "Your latest submission is featured in the weekly local artists showcase.",
      icon: <Sparkles size={16} />,
    },
    {
      title: "Upcoming Review",
      detail: "Curator review scheduled for tomorrow at 14:00.",
      icon: <CalendarRange size={16} />,
    },
    {
      title: "Live Activity",
      detail: "2 new wishlist saves and 1 follower request this morning.",
      icon: <Clock3 size={16} />,
    },
  ];

  useEffect(() => {
    const checkUser = async () => {
      // 3. ตอนนี้มันจะอ่านข้อมูลจากคุกกี้ได้แล้ว!
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = "/login";
        return;
      }
      setUser(user);

      // 4. ดึงผลงานล่าสุดจากตาราง artworks แทน mock data
      const { data: artworks, error } = await supabase
        .from("artworks")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(8);

      if (!error && artworks) {
        setArtItems(artworks);
      } else if (error) {
        console.error("Failed to load artworks:", error.message);
      }

      setLoading(false);
    };
    checkUser();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center text-zinc-400">
        <Loader2 className="animate-spin mr-2" /> Loading Artspace...
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
            active
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
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div>
            <h1 className="text-3xl font-serif font-medium mb-1">Overview</h1>
            <p className="text-xs font-bold tracking-[0.2em] text-zinc-400 uppercase">
              Hello, {shortName}. Here is your gallery update.
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 border-b border-zinc-200 pb-1 px-2">
              <Search size={16} className="text-zinc-400" />
              <input
                type="text"
                placeholder="Search art..."
                className="bg-transparent focus:outline-none text-sm w-48"
              />
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
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <StatCard
            title="Portfolio Value"
            value={`฿ ${artItems
              .reduce((sum, item) => sum + Number(item.price || 0), 0)
              .toLocaleString()}`}
            trend="Live total"
          />
          <StatCard
            title="Items for Sale"
            value={String(artItems.length)}
            trend="Active Listings"
          />
          <StatCard title="Total Views" value="1.2k" trend="Across all works" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-16">
          {quickNotes.map((note) => (
            <div
              key={note.title}
              className="bg-white border border-zinc-100 p-6 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-3">
                <span className="text-black">{note.icon}</span>
                {note.title}
              </div>
              <p className="text-sm text-zinc-700 leading-6">{note.detail}</p>
            </div>
          ))}
        </div>

        <div className="space-y-8 mb-16">
          <div className="flex justify-between items-end border-b border-zinc-200 pb-4">
            <h2 className="text-2xl font-serif">Marketplace Preview</h2>
            <Link
              href="#"
              className="text-xs font-bold tracking-[0.2em] uppercase hover:underline"
            >
              View All
            </Link>
          </div>

          {artItems.length === 0 ? (
            <div className="bg-white border border-zinc-100 p-12 text-center">
              <p className="text-zinc-400 italic font-serif">
                ยังไม่มีผลงานที่โพสต์ — ลองกด "Post New Work" เพื่อเริ่มต้น
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {artItems.map((item) => (
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
                  </div>
                  <h3 className="font-serif text-base line-clamp-1">
                    {item.title}
                  </h3>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider line-clamp-1">
                      {item.category}
                    </p>
                    <p className="text-xs font-bold">
                      ฿ {Number(item.price).toLocaleString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="flex justify-between items-end border-b border-zinc-200 pb-4">
              <h2 className="text-xl font-serif">Recent Sales Activity</h2>
            </div>
            <div className="bg-white border border-zinc-100 p-8 text-center flex flex-col items-center justify-center gap-3">
              <p className="text-zinc-400 italic font-serif">
                No sales data recorded this week.
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex justify-between items-end border-b border-zinc-200 pb-4">
              <h2 className="text-xl font-serif">System Log</h2>
            </div>
            <div className="space-y-6">
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

function StatCard({
  title,
  value,
  trend,
  trendPositive = true,
}: {
  title: string;
  value: string;
  trend: string;
  trendPositive?: boolean;
}) {
  return (
    <div className="bg-white p-6 border border-zinc-100 shadow-sm hover:shadow-md transition duration-300">
      <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-400 mb-2">
        {title}
      </p>
      <h3 className="text-2xl font-serif font-medium mb-2">{value}</h3>
      <div
        className={`text-[10px] font-bold uppercase tracking-widest ${trendPositive ? "text-green-600" : "text-zinc-400"}`}
      >
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
        className={`w-1.5 h-1.5 rounded-full mt-2 ${highlight ? "bg-black" : "bg-zinc-200"}`}
      ></div>
      <div className="flex-1">
        <p className="text-xs font-bold text-black uppercase tracking-tight">
          {action}
        </p>
        <p className="text-xs text-zinc-500">{target}</p>
      </div>
      <span className="text-[10px] text-zinc-300 font-mono">{time}</span>
    </div>
  );
}
