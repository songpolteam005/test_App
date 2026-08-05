// app/api/artworks/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        },
      },
    },
  );

  // ตรวจสอบว่า login อยู่จริง
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const price = formData.get("price") as string;
  const file = formData.get("image") as File;

  if (!title || !category || !price || !file) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  // อัปโหลดรูปไป Supabase Storage
  const fileExt = file.name.split(".").pop();
  const fileName = `${user.id}/${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("artworks")
    .upload(fileName, file);

  if (uploadError) {
    return NextResponse.json(
      { error: `Upload failed: ${uploadError.message}` },
      { status: 500 },
    );
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("artworks").getPublicUrl(fileName);

  // บันทึกลงตาราง artworks
  const { data, error: insertError } = await supabase
    .from("artworks")
    .insert({
      user_id: user.id,
      title,
      description,
      category,
      price: parseFloat(price),
      image_url: publicUrl,
    })
    .select()
    .single();

  if (insertError) {
    return NextResponse.json(
      { error: `Insert failed: ${insertError.message}` },
      { status: 500 },
    );
  }

  return NextResponse.json({ artwork: data }, { status: 201 });
}
