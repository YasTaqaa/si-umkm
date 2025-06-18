// lib/auth/jwt.ts

import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret'

export function signToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '2h' })
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch {
    return null
  }
}
