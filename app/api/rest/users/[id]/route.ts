// app/api/rest/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/connectDB'
import UserModel from '@/models/user'

export const dynamic = 'force-dynamic' // opsional, jika perlu SSR/DB

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Await params untuk Next.js 15
  const { id } = await params
  
  await connectDB()
  
  try {
    const user = await UserModel.findById(id).select('-password')
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }
    return NextResponse.json(user)
  } catch (err) {
    console.error('Error retrieving user:', err)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}