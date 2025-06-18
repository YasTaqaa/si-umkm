// app/api/rest/users/sync/route.ts
import { connectDB } from '@/lib/db/connectDB'
import User from '@/models/user'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const { email, role } = await req.json()

    if (!email || !role) {
      return NextResponse.json({ error: 'Email dan role wajib diisi' }, { status: 400 })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ message: 'User sudah ada' })
    }

    const newUser = new User({
      email,
      role,
      password: 'fromFirebase',
    })

    await newUser.save()

    return NextResponse.json({ message: 'User disimpan ke MongoDB' })
  } catch {
    return NextResponse.json({ error: 'Gagal menyimpan user' }, { status: 500 })
  }
}
