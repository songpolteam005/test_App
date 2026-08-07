"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";
import {
  ArrowLeft,
  Loader2,
  Tag,
  Calendar,
  User,
  ShieldCheck,
} from "lucide-react";

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
      // เช็ก user ปัจจุบัน
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
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center text-[#8B6F47]">
        <Loader2 className="animate-spin mr-2" size={18} />
        <span className="text-xs tracking-[0.2em] uppercase">
          Inspecting Artwork Details
        </span>
      </div>
    );
  }

  if (error || !artwork) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center gap-4 text-[#171412]">
        <p className="text-zinc-400 italic font-serif text-lg">{error}</p>
        <Link
          href="/dashboard"
          className="text-xs font-bold tracking-[0.2em] uppercase border-b border-[#171412] pb-1 hover:text-[#8B6F47] hover:border-[#8B6F47] transition-colors"
        >
          Return to Overview
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
    <div className="min-h-screen bg-[#FAF9F6] text-[#171412] font-sans">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Navigation Back Button */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-zinc-400 hover:text-[#171412] transition-colors mb-10"
        >
          <ArrowLeft size={14} /> Back to Gallery
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Artwork Display */}
          <div className="relative border border-[#E4DFD5] bg-white p-4 shadow-sm">
            <div className="relative overflow-hidden aspect-[4/5] bg-zinc-100">
              <img
                src={artwork.image_url}
                alt={artwork.title}
                className="w-full h-full object-cover"
              />
              {/* Gallery Museum Corner Frame Details */}
              <span className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-white/70" />
              <span className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-white/70" />
            </div>
          </div>

          {/* Artwork Meta & Details */}
          <div className="flex flex-col h-full justify-between pt-2">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.25em] uppercase text-[#8B6F47] mb-3">
                <Tag size={13} strokeWidth={2} />
                <span>{artwork.category || "Fine Art"}</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-serif tracking-tight mb-4 italic">
                {artwork.title}
              </h1>

              {/* Artist Tag */}
              <div className="flex items-center gap-3 pb-6 border-b border-[#E4DFD5] mb-6">
                <div className="w-8 h-8 rounded-full bg-[#171412] text-white flex items-center justify-center text-xs font-serif uppercase flex-shrink-0">
                  {artwork.profiles?.first_name?.[0]?.toUpperCase() || "A"}
                </div>
                <p className="text-xs text-zinc-500">
                  Created by{" "}
                  <span className="font-medium text-[#171412] uppercase tracking-wider ml-1">
                    {artwork.profiles?.first_name
                      ? `${artwork.profiles.first_name} ${artwork.profiles.last_name || ""}`
                      : "Unknown Artist"}
                  </span>
                </p>
              </div>

              {/* Price Tag */}
              <div className="mb-8">
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-400 mb-1">
                  Valuation / Price
                </p>
                <p className="text-4xl font-serif tracking-tight tabular-nums text-[#171412]">
                  ฿ {Number(artwork.price || 0).toLocaleString()}
                </p>
              </div>

              {/* Description Box */}
              <div className="bg-white border border-[#E4DFD5] p-6 mb-8">
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#8B6F47] mb-3">
                  Artwork Description
                </p>
                {artwork.description ? (
                  <p className="text-sm text-zinc-600 leading-relaxed whitespace-pre-wrap font-sans">
                    {artwork.description}
                  </p>
                ) : (
                  <p className="text-xs text-zinc-400 italic">
                    No additional commentary available for this artwork.
                  </p>
                )}
              </div>

              {/* Post Date */}
              <div className="flex items-center gap-2 text-[10px] text-zinc-400 uppercase tracking-widest mb-8">
                <Calendar size={13} />
                <span>Acquired / Listed on {createdDate}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-[#E4DFD5]">
              {isOwner ? (
                <div className="flex items-center justify-center gap-2 py-4 border border-[#E4DFD5] bg-[#FAF9F6] text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                  <ShieldCheck size={16} className="text-[#8B6F47]" />
                  <span>You are the registered owner of this work</span>
                </div>
              ) : (
                <button className="w-full py-4 bg-[#171412] text-white hover:bg-[#8B6F47] text-xs font-bold tracking-[0.25em] uppercase transition-colors duration-300">
                  Contact Artist / Inquire
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
