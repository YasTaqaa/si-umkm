// app/api/rest/users/count/route.ts
import { connectDB } from '@/lib/db/connectDB'
import User from '@/models/user'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  await connectDB()

  const { searchParams } = new URL(req.url)
  const role = searchParams.get('role')

  const filter = role ? { role } : {}
  const count = await User.countDocuments(filter)

  return NextResponse.json({ count })
}
