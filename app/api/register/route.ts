import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { email, password, firstname, lastname } = await request.json();

    if (!email || !password || !firstname || !lastname) {
      return NextResponse.json(
        { error: "Please fill in all fields" },
        { status: 400 },
      );
    }

    const cookieStore = await cookies();

    // เช็กและป้องกัน Error กรณีดึงค่า .env ไม่เจอ
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

    // 1. ทำการ สมัครสมาชิก (SignUp)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstname,
          last_name: lastname,
        },
      },
    });

    if (error) {
      console.log("🚨 Supabase SignUp Error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // 2. ถ้าสมัครผ่านแต่ยังไม่มี session ให้สั่ง Login อัตโนมัติทันที
    if (data.user && !data.session) {
      const { data: signInData, error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (signInError) {
        console.log("🚨 Supabase Auto-SignIn Error:", signInError.message);
        return NextResponse.json(
          {
            message:
              "Registration successful, but email confirmation is required before login.",
            user: data.user,
          },
          { status: 201 },
        );
      }

      return NextResponse.json(
        {
          message: "Registration successful!",
          user: signInData.user,
          session: signInData.session,
        },
        { status: 201 },
      );
    }

    // 3. ถ้าปิด Confirm Email ไว้ จะได้ User + Session ทันที
    return NextResponse.json(
      {
        message: "Registration successful!",
        user: data.user,
        session: data.session,
      },
      { status: 201 },
    );
  } catch (err: any) {
    console.log("🚨 Internal Register Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
