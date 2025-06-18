// File: lib/auth/edge-jwt.ts
import { jwtVerify } from 'jose'

const secret = new TextEncoder().encode('supersecret') // Ganti dengan env jika perlu

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload
  } catch (err) {
    console.error('[Middleware] JWT verify error:', err)
    return null
  }
}
