// app/api/rest/users/count.ts
import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/connectDB'
import User from '@/models/user'

export async function GET() {
  await connectDB()
  const count = await User.countDocuments({ role: 'umkm' })
  return NextResponse.json({ count })
}
