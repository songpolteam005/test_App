import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { cookies } from "next/headers"; // เพิ่มการนำเข้า cookies จาก next/headers

export async function POST(request: Request) {
  try {
    const { email, password, firstname, lastname } = await request.json();

    if (!email || !password || !firstname || !lastname) {
      return NextResponse.json(
        { error: "Please fill in all fields" },
        { status: 400 },
      );
    }

    // เรียกใช้ cookieStore ของ Next.js โดยตรง
    // เรียกใช้ cookieStore ของ Next.js โดยตรง
    const cookieStore = await cookies();

    // 💡 เพิ่ม .trim() เพื่อป้องกันปัญหาช่องว่างหรือ Enter ที่มองไม่เห็นจากไฟล์ .env
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!.trim();
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!.trim();

    // ปริ้นต์เช็คใน Terminal ว่าดึง URL มาได้ถูกต้องจริงๆ
    console.log("🔗 URL ที่ใช้เชื่อมต่อ:", supabaseUrl);

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
      // ปริ้นต์ Error ออก Terminal เพื่อให้รู้สาเหตุที่แท้จริงถ้าสมัครไม่ผ่าน
      console.log("🚨 Supabase SignUp Error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // 2. ถ้าสมัครผ่านแต่ยังไม่มี session ให้ลองสั่ง Login อัตโนมัติทันที
    if (data.user && !data.session) {
      const { data: signInData, error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (signInError) {
        console.log("🚨 Supabase SignIn Error:", signInError.message);
        return NextResponse.json(
          {
            message:
              "Registration successful, but email confirmation is required before login.",
            user: data.user,
          },
          { status: 201 },
        );
      }

      // ส่งกลับได้เลย Cookie จะถูกจัดการโดย next/headers อัตโนมัติ
      return NextResponse.json(
        {
          message: "Registration successful!",
          user: signInData.user,
          session: signInData.session,
        },
        { status: 201 },
      );
    }

    // 3. ถ้าปิด Confirm Email ไว้ สมาชิกจะสมัครเสร็จพร้อม Session ทันที
    return NextResponse.json(
      {
        message: "Registration successful!",
        user: data.user,
        session: data.session,
      },
      { status: 201 },
    );
  } catch (err: any) {
    console.log("🚨 Internal Server Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
