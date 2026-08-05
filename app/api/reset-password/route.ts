import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { password, code, token_hash, type } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: "Please provide a new password." },
        { status: 400 },
      );
    }

    const response = NextResponse.json(
      { message: "Password updated successfully." },
      { status: 200 },
    );

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

    if (code) {
      const { error: exchangeError } =
        await supabase.auth.exchangeCodeForSession(code);
      if (exchangeError) {
        return NextResponse.json(
          { error: exchangeError.message },
          { status: 400 },
        );
      }
    }

    if (token_hash && type) {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        token_hash,
        type: type as any,
      });

      if (verifyError) {
        return NextResponse.json(
          { error: verifyError.message },
          { status: 400 },
        );
      }
    }

    const { data, error } = await supabase.auth.updateUser({ password });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      {
        message: "Password updated successfully.",
        user: data.user,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
