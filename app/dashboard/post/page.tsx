"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ImagePlus, Loader2 } from "lucide-react";
import Link from "next/link";

export default function PostNewWorkPage() {
  const router = useRouter();
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!file) {
      setError("กรุณาเลือกรูปภาพผลงาน");
      return;
    }

    setLoading(true);
    const formEl = e.currentTarget;
    const formData = new FormData(formEl);
    formData.set("image", file);

    try {
      const res = await fetch("/api/artworks", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();

      if (!res.ok) {
        setError(result.error || "เกิดข้อผิดพลาด กรุณาลองใหม่");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("เชื่อมต่อเซิร์ฟเวอร์ไม่สำเร็จ");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-black transition mb-8"
        >
          <ArrowLeft size={16} /> BACK TO DASHBOARD
        </Link>

        <h1 className="text-4xl font-medium tracking-tight mb-2">
          Post New Work
        </h1>
        <p className="text-zinc-500 mb-10">
          อัปโหลดผลงานใหม่เพื่อนำเสนอใน Marketplace
        </p>

        {error && (
          <div className="mb-6 px-4 py-3 border border-red-200 bg-red-50 text-red-600 text-sm rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Image Upload */}
          <div>
            <label className="block text-xs font-bold tracking-widest uppercase text-zinc-500 mb-2">
              Artwork Image
            </label>
            <label
              htmlFor="image-upload"
              className="flex flex-col items-center justify-center h-72 border-2 border-dashed border-zinc-200 rounded cursor-pointer hover:border-black transition overflow-hidden"
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center text-zinc-400">
                  <ImagePlus className="mx-auto mb-2" size={32} />
                  <p className="text-sm">คลิกเพื่อเลือกรูปภาพ</p>
                </div>
              )}
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              required
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold tracking-widest uppercase text-zinc-500 mb-2">
              Title
            </label>
            <input
              name="title"
              type="text"
              required
              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded focus:outline-none focus:border-black"
              placeholder="เช่น Khlong Phra Udom Life"
            />
          </div>

          {/* Category + Price */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold tracking-widest uppercase text-zinc-500 mb-2">
                Category
              </label>
              <select
                name="category"
                required
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded focus:outline-none focus:border-black"
              >
                <option value="">เลือกหมวดหมู่</option>
                <option value="Painting">Painting</option>
                <option value="Sculpture">Sculpture</option>
                <option value="Photography">Photography</option>
                <option value="NFT">NFT</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold tracking-widest uppercase text-zinc-500 mb-2">
                Price (฿)
              </label>
              <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                required
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded focus:outline-none focus:border-black"
                placeholder="12500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold tracking-widest uppercase text-zinc-500 mb-2">
              Description
            </label>
            <textarea
              name="description"
              rows={4}
              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded focus:outline-none focus:border-black resize-none"
              placeholder="รายละเอียดของผลงาน..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-black text-white rounded-full font-medium hover:bg-zinc-800 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} /> Uploading...
              </>
            ) : (
              "Publish Artwork"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
