import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from './edge-jwt'

/**
 * Middleware untuk halaman Admin (App Router level middleware)
 */
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

    // Token valid & role admin
    return NextResponse.next()
  } catch (err) {
    console.log('[Middleware] Token tidak valid:', err)
    return NextResponse.redirect(new URL('/login', req.url))
  }
}

/**
 * Fungsi untuk digunakan di API Route, untuk ambil user dari token cookie
 */
export async function getUserFromRequest(req: NextRequest) {
  const token = req.cookies.get('token')?.value

  if (!token) {
    console.log('[getUserFromRequest] Tidak ada token')
    return null
  }

  try {
    const decoded = await verifyToken(token)
    console.log('[getUserFromRequest] Decoded:', decoded)
    return decoded // { email, role, iat, exp }
  } catch (err) {
    console.log('[getUserFromRequest] Token tidak valid:', err)
    return null
  }
}
