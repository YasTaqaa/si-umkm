// lib/auth/middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from './edge-jwt'

export async function authMiddleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value
  console.log('[Middleware] Token:', token)

  if (!token) {
    console.log('[Middleware] Tidak ada token, redirect ke login')
    return NextResponse.redirect(new URL('/login', req.url))
  }

  try {
    const decoded = await verifyToken(token)
    console.log('[Middleware] Decoded Token:', decoded)

    if (decoded?.role !== 'admin') {
      console.log('[Middleware] Token valid tapi bukan admin')
      return NextResponse.redirect(new URL('/login', req.url))
    }

    return NextResponse.next()
  } catch (err) {
    console.log('[Middleware] Token tidak valid:', err)
    return NextResponse.redirect(new URL('/login', req.url))
  }
}
