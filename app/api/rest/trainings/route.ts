
// app/api/rest/trainings/route.ts
import { connectDB } from '@/lib/db/connectDB'
import Training from '@/models/training'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  await connectDB()
  const trainings = await Training.find()
  return NextResponse.json(trainings)
}

export async function POST(req: NextRequest) {
  await connectDB()
  const data = await req.json()
  const newTraining = await Training.create(data)
  return NextResponse.json(newTraining)
}
