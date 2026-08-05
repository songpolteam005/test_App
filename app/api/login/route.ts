import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password } = body;

  // 1. สร้าง Response เตรียมไว้ล่วงหน้า
  const response = NextResponse.json(
    { message: "Login successful" },
    { status: 200 },
  );

  // 2. สร้าง Supabase Server Client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookieHeader = request.headers.get("cookie");
          if (!cookieHeader) return undefined;
          const cookies = cookieHeader.split("; ");
          const cookie = cookies.find((row) => row.startsWith(`${name}=`));
          return cookie ? cookie.split("=")[1] : undefined;
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({ name, value, path: "/", ...options });
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({ name, value: "", path: "/", ...options });
        },
      },
    },
  );

  // 3. 🟢 [ส่วนสำคัญที่ขาดไป] เรียกสั่งงาน Login กับ Supabase
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  // 4. ถ้า Login ไม่ผ่าน ให้คืนค่า 400/401 พร้อมส่ง Error Message
  if (error) {
    const message = error.message?.toLowerCase().includes("confirm")
      ? "Your account needs email confirmation before you can sign in."
      : error.message || "Invalid email or password";

    return NextResponse.json({ error: message }, { status: 401 });
  }

  // 5. ถ้า Login ผ่าน คืน response ที่ถูกแปะ Cookie Auth เรียบร้อยแล้ว
  return response;
}
