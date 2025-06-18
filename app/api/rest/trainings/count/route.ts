// app/api/rest/trainings/count/route.ts
import { connectDB } from '@/lib/db/connectDB'
import Training from '@/models/training'
import { NextResponse } from 'next/server'

export async function GET() {
  await connectDB()
  const count = await Training.countDocuments()
  return NextResponse.json({ count })
}
