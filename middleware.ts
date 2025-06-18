// middleware.ts
import { authMiddleware } from '@/lib/auth/middleware'
import { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname

  if (pathname.startsWith('/dashboard/admin')) {
    return authMiddleware(req)
  }

  return 
}

export const config = {
    matcher: [
      '/dashboard/admin/:path*',
      '/api/rest/:path*',
    ],
  }
