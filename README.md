# 🎨 Artspace (Art.) — Digital Art Gallery & Marketplace

<p align="center">
  <b>A museum-grade digital gallery and marketplace platform for fine art collectors and creators.</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15%2B-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/Supabase-Auth%20%26%20Database-emerald?style=for-the-badge&logo=supabase" alt="Supabase" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.0-38bdf8?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel" alt="Vercel" />
</p>

---

## 📌 เกี่ยวกับโปรเจกต์ (Project Overview)

**Artspace (Art.)** เป็นเว็บแอปพลิเคชันตลาดซื้อขายและจัดแสดงงานศิลปะดิจิทัล ที่ได้รับการออกแบบในสไตล์ **Museum & Fine Art Gallery** เรียบหรู สะอาดตา มุ่งเน้นการมอบประสบการณ์ระดับพรีเมียมให้แก่ผู้สะสม (Collectors) และศิลปิน (Creators)

ระบบถูกพัฒนาขึ้นแบบ Full-Stack ด้วย **Next.js 15 (App Router)** และ **Supabase SSR** รองรับการจัดการสมาชิก, การอัปโหลดผลงาน, การคำนวณมูลค่าพอร์ตโฟลิโอแบบ Real-time, ตลอดจนระบบบันทึกผลงานที่ชื่นชอบ (Favorites) พร้อมสถาปัตยกรรมที่ปลอดภัยและประมวลผลได้อย่างรวดเร็ว

---

## 🌟 ฟีเจอร์หลักของระบบ (Key Features)

- 🏛️ **Landing & Exhibition Page:** หน้าแรกสไตล์มิวเซียมระดับโลก นำเสนอสโลแกน _"Pure Form"_ และ _"Silence is golden"_ พร้อมหมวดหมู่ผลงานยอดนิยม
- 🔐 **Authentication & Access Control:** ระบบเข้าสู่ระบบ (Sign In) และสมัครสมาชิก (Sign Up) ผ่าน Supabase Auth ปลอดภัยด้วย Cookie-based Session
- 📊 **Collector Dashboard (Overview):** หน้าสรุปข้อมูลส่วนตัวของผู้สะสม คำนวณมูลค่าพอร์ตโฟลิโอรวม (`Portfolio Value`), จำนวนรายการที่ลงขาย (`Items for Sale`), และสถิติการเข้าชม (`Total Views`)
- 🛒 **Global Marketplace:** ตลาดรวมผลงานศิลปะ สามารถค้นหาชื่อผลงาน, กรองตามหมวดหมู่ (_Painting, Sculpture, Photography, NFT_) และจัดเรียงตามราคาได้
- ❤️ **Curated Favorites:** ระบบบันทึกผลงานโปรดแบบ Optimistic UI (กดถูกใจแล้วอัปเดตหน้าจอทันที) สามารถจัดการและลบออกจากลิสต์ส่วนตัวได้ตลอดเวลา
- 📤 **Artwork Management:** ศิลปินสามารถอัปโหลดภาพผลงาน กำหนดราคา หมวดหมู่ และรายละเอียดเข้าสู่ระบบ Supabase Storage ได้โดยตรง
- ⚙️ **Profile Settings:** หน้าจัดการข้อมูลผู้ใช้งาน ปรับเปลี่ยนชื่อ-นามสกุล และอัปเดตโปรไฟล์บนระบบฐานข้อมูล

---

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

- **Frontend:** Next.js 15 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS, Lucide React Icons
- **Backend & Database:** Supabase PostgreSQL, Supabase SSR Auth, Supabase Storage
- **Deployment:** Vercel

---

## 🗄️ โครงสร้างฐานข้อมูล (Database Schema)

```sql
-- 1. ตารางข้อมูลโปรไฟล์ผู้ใช้งาน (Profiles)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ตารางผลงานศิลปะ (Artworks)
CREATE TABLE public.artworks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ตารางผลงานที่ชื่นชอบ (Favorites)
CREATE TABLE public.favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  artwork_id UUID REFERENCES public.artworks(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, artwork_id)
);
```
