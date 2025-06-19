// lib/auth/getUserFromCookie.ts
import { parse } from 'cookie'
import jwt from 'jsonwebtoken'

export function getUserFromCookie(): { email: string; role: string } | null {
  if (typeof document === 'undefined') return null

  const cookies = parse(document.cookie || '')
  const token = cookies.token
  if (!token) return null

  try {
    const decoded = jwt.decode(token) as { email: string; role: string }
    return decoded
  } catch {
    return null
  }
}
