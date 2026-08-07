"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";
import { ArrowLeft, ImagePlus, Loader2, Upload } from "lucide-react";

const CATEGORIES = ["Painting", "Sculpture", "Photography", "NFT"];

export default function PostNewWorkPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form States
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Painting");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

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
      setLoading(false);
    };
    checkUser();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (selected.size > 5 * 1024 * 1024) {
        setError("ขนาดไฟล์เกินขีดจำกัด 5MB");
        return;
      }
      setError(null);
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 1. ดึง User สดๆ เพื่อป้องกันปัญหา Session หลุดบนเบราว์เซอร์มือถือ
    const {
      data: { user: currentUser },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !currentUser) {
      setError("เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่อีกครั้ง");
      window.location.href = "/login";
      return;
    }

    if (!file) {
      setError("กรุณาเลือกรูปภาพผลงาน");
      return;
    }

    if (!title.trim() || !price) {
      setError("กรุณากรอกชื่อผลงานและราคาให้ครบถ้วน");
      return;
    }

    setSubmitting(true);

    try {
      // 2. ตั้งชื่อไฟล์รูปภาพไม่ให้ซ้ำกัน
      const fileExt = file.name.split(".").pop();
      const fileName = `${currentUser.id}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

      // 3. อัปโหลดไฟล์รูปไปยัง Supabase Storage (Bucket: artworks)
      const { error: uploadError } = await supabase.storage
        .from("artworks")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw new Error(
          `เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ: ${uploadError.message}`,
        );
      }

      // 4. ดึง Public URL ของรูปภาพ
      const { data: urlData } = supabase.storage
        .from("artworks")
        .getPublicUrl(fileName);

      const publicImageUrl = urlData.publicUrl;

      // 5. บันทึกข้อมูลลงตาราง artworks
      const { error: insertError } = await supabase.from("artworks").insert({
        user_id: currentUser.id,
        title: title.trim(),
        category,
        price: Number(price),
        description: description.trim(),
        image_url: publicImageUrl,
      });

      if (insertError) {
        throw new Error(`ไม่สามารถบันทึกข้อมูลได้: ${insertError.message}`);
      }

      // 6. เมื่อสำเร็จ นำผู้ใช้กลับไปหน้า Dashboard
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setError(
        err.message || "เกิดข้อผิดพลาดไม่ทราบสาเหตุ กรุณาลองใหม่อีกครั้ง",
      );
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center text-[#8B6F47]">
        <Loader2 className="animate-spin mr-2" size={18} />
        <span className="text-xs tracking-[0.2em] uppercase">
          Preparing Exhibition Form
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#171412] font-sans">
      <div className="max-w-4xl mx-auto p-8 lg:p-14">
        {/* Navigation Back */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-zinc-400 hover:text-[#171412] transition-colors mb-10"
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>

        {/* Header */}
        <header className="pb-8 border-b border-[#E4DFD5] mb-12">
          <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#8B6F47] mb-3">
            Exhibition Submission
          </p>
          <h1 className="font-serif text-5xl tracking-tight">
            Post New Work<span className="text-[#8B6F47]">.</span>
          </h1>
          <p className="text-sm text-zinc-500 mt-3">
            อัปโหลดและเสนอขายผลงานศิลปะชิ้นใหม่ของคุณสู่ Marketplace
          </p>
        </header>

        {/* Error Alert */}
        {error && (
          <div className="mb-8 border border-red-200 bg-red-50/50 p-4 text-xs font-medium text-red-600">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Image Upload Box */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B6F47] mb-3">
                Artwork Media File (Max 5MB) *
              </label>

              <label
                htmlFor="image-upload"
                className="relative border-2 border-dashed border-[#E4DFD5] bg-white aspect-[4/5] flex flex-col items-center justify-center p-6 hover:border-[#171412] transition-colors group cursor-pointer overflow-hidden block"
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <Upload
                      size={32}
                      className="mx-auto text-zinc-300 group-hover:text-[#8B6F47] transition-colors mb-4"
                      strokeWidth={1.5}
                    />
                    <p className="font-serif italic text-sm text-zinc-500 mb-1">
                      คลิกเพื่อเลือกไฟล์รูปภาพ
                    </p>
                    <p className="text-[10px] text-zinc-400 uppercase tracking-widest">
                      รองรับไฟล์ PNG, JPG, WEBP
                    </p>
                  </div>
                )}
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Inputs Metadata */}
            <div className="space-y-6 flex flex-col justify-between">
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B6F47] mb-2">
                    Artwork Title *
                  </label>
                  <input
                    required
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="เช่น Khlong Phra Udom Life"
                    className="w-full py-3 px-4 border border-[#E4DFD5] bg-white text-sm focus:outline-none focus:border-[#171412] transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B6F47] mb-2">
                      Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full py-3 px-4 border border-[#E4DFD5] bg-white text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-[#171412]"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B6F47] mb-2">
                      Price (฿) *
                    </label>
                    <input
                      required
                      type="number"
                      min="0"
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="12500"
                      className="w-full py-3 px-4 border border-[#E4DFD5] bg-white text-sm focus:outline-none focus:border-[#171412] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B6F47] mb-2">
                    Description
                  </label>
                  <textarea
                    rows={5}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="เขียนรายละเอียดหรือเรื่องราวแรงบันดาลใจของผลงานชิ้นนี้..."
                    className="w-full p-4 border border-[#E4DFD5] bg-white text-sm focus:outline-none focus:border-[#171412] transition-colors resize-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-[#171412] text-white hover:bg-[#8B6F47] disabled:bg-zinc-400 text-xs font-bold tracking-[0.25em] uppercase transition-colors duration-300 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Publishing Artwork...</span>
                  </>
                ) : (
                  <span>Publish Artwork</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
