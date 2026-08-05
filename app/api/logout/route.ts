import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  // สร้าง Response เตรียมไว้
  const response = NextResponse.json({ message: "Logout successful" }, { status: 200 })

  // เรียกใช้ Supabase เพื่อดึงตัวจัดการ Cookie
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.headers.get('cookie')?.includes(name) ? name : undefined
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({ name, value, path: '/', ...options })
        },
        remove(name: string, options: CookieOptions) {
          // สั่งทำลาย Cookie อย่างหมดจด
          response.cookies.set({ name, value: '', path: '/', ...options })
        },
      },
    }
  )

  // สั่ง Sign Out จากฝั่ง Server
  await supabase.auth.signOut()

  return response
}