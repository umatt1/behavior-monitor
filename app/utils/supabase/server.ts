import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies'
import { Database } from '../types/supabase'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          const cookie = await cookieStore.get(name)
          return cookie?.value
        },
        async set(name: string, value: string, options: CookieOptions) {
          try {
            await cookieStore.set(name, value, options as ResponseCookie)
          } catch {}
        },
        async remove(name: string, options: CookieOptions) {
          try {
            await cookieStore.set(name, '', { ...options, maxAge: 0 } as ResponseCookie)
          } catch {}
        },
      },
    }
  )
}
