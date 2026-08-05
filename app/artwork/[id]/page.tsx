"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";
import { ArrowLeft, Loader2, Tag, User, Calendar } from "lucide-react";

export default function ArtworkDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [artwork, setArtwork] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  useEffect(() => {
    const load = async () => {
      // เช็ค user ปัจจุบัน (ไว้ใช้เทียบว่าเป็นเจ้าของผลงานหรือไม่)
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }
      setCurrentUserId(user.id);

      const { data, error: fetchError } = await supabase
        .from("artworks")
        .select("*, profiles(first_name, last_name, avatar_url)")
        .eq("id", id)
        .single();

      if (fetchError || !data) {
        setError("ไม่พบผลงานนี้ หรืออาจถูกลบไปแล้ว");
      } else {
        setArtwork(data);
      }
      setLoading(false);
    };

    if (id) load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center text-zinc-400">
        <Loader2 className="animate-spin mr-2" /> Loading artwork...
      </div>
    );
  }

  if (error || !artwork) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center gap-4">
        <p className="text-zinc-500 italic font-serif">{error}</p>
        <Link
          href="/dashboard"
          className="text-sm font-bold underline underline-offset-4"
        >
          กลับไปหน้า Dashboard
        </Link>
      </div>
    );
  }

  const createdDate = new Date(artwork.created_at).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const isOwner = currentUserId === artwork.user_id;

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-zinc-900 font-sans">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-black transition mb-8"
        >
          <ArrowLeft size={16} /> BACK
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* รูปภาพ */}
          <div className="bg-zinc-100 shadow-sm overflow-hidden aspect-square">
            <img
              src={artwork.image_url}
              alt={artwork.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* รายละเอียด */}
          <div className="flex flex-col">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-400 mb-3">
              <Tag size={12} /> {artwork.category}
            </span>

            <h1 className="text-4xl font-serif font-medium mb-2">
              {artwork.title}
            </h1>

            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-serif uppercase flex-shrink-0">
                {artwork.profiles?.first_name?.[0]?.toUpperCase() || "?"}
              </div>
              <p className="text-xs text-zinc-500">
                by{" "}
                <span className="font-bold text-zinc-800">
                  {artwork.profiles?.first_name
                    ? `${artwork.profiles.first_name} ${artwork.profiles.last_name || ""}`
                    : "Unknown Artist"}
                </span>
              </p>
            </div>

            <p className="text-3xl font-bold mb-8">
              ฿ {Number(artwork.price).toLocaleString()}
            </p>

            {artwork.description ? (
              <p className="text-zinc-600 leading-relaxed mb-8 whitespace-pre-wrap">
                {artwork.description}
              </p>
            ) : (
              <p className="text-zinc-400 italic mb-8">
                ไม่มีคำอธิบายเพิ่มเติมสำหรับผลงานนี้
              </p>
            )}

            <div className="flex items-center gap-2 text-xs text-zinc-400 uppercase tracking-widest mb-10">
              <Calendar size={14} />
              โพสต์เมื่อ {createdDate}
            </div>

            <div className="mt-auto flex flex-col gap-3">
              {isOwner ? (
                <div className="px-6 py-4 border border-zinc-200 text-center text-sm text-zinc-500">
                  นี่คือผลงานของคุณเอง
                </div>
              ) : (
                <button className="w-full py-4 bg-black text-white rounded-full font-medium hover:bg-zinc-800 transition">
                  Contact Seller
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
