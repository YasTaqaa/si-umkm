// app/api/rest/users/login/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { signToken } from '@/lib/auth/jwt'

const ADMIN_USER = {
  email: 'admin@si-umkm.com',
  password: 'admin123',
  role: 'admin',
}

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  if (email === ADMIN_USER.email && password === ADMIN_USER.password) {
    const token = signToken({ email, role: 'admin' })

    const response = NextResponse.json({ message: 'Login berhasil' })
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // ⬅️ Aman di production
      maxAge: 60 * 60 * 2, // 2 jam
      path: '/',
      sameSite: 'lax',
    })

    return response
  }

  return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 })
}
