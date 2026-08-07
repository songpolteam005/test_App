import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Please provide both email and password" },
        { status: 400 },
      );
    }

    const cookieStore = await cookies();

    // ดึงค่าจาก .env หรือใช้ Fallback URL ที่แก้ไขตัวพิมพ์ผิด (gqgt...) แล้ว
    const supabaseUrl = (
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      "https://gqgtzeapgmtjznyogkio.supabase.co"
    ).trim();

    const supabaseKey = (
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxZ3R6ZWFwZ210anpueW9na2lvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0NTg5OTksImV4cCI6MjA4NzAzNDk5OX0.IT57Tg2MNvYDPBqrh-dVwHCFm4okqSWLelNgnWLqV3c"
    ).trim();

    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    });

    // เรียกสั่งงาน Login
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log("🚨 Supabase Login Error:", error.message);
      const message = error.message?.toLowerCase().includes("confirm")
        ? "Your account needs email confirmation before you can sign in."
        : error.message || "Invalid email or password";

      return NextResponse.json({ error: message }, { status: 401 });
    }

    return NextResponse.json(
      { message: "Login successful", user: data.user, session: data.session },
      { status: 200 },
    );
  } catch (err: any) {
    console.log("🚨 Internal Login Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
