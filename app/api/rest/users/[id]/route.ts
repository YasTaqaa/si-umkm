/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/rest/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import UserModel from '@/models/user'
import { connectDB } from '@/lib/db/connectDB'

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params

  await connectDB()

  try {
    const user = await UserModel.findById(id).select('-password') // hindari expose password
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }
    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({ message: 'Error retrieving user' }, { status: 500 })
  }
}
