/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/rest/trainings/[id]/route.ts
import { connectDB } from '@/lib/db/connectDB'
import Training from '@/models/training'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(_: any, { params }: { params: { id: string } }) {
  await connectDB()
  const training = await Training.findById(params.id)
  return NextResponse.json(training)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB()
  const data = await req.json()
  const updated = await Training.findByIdAndUpdate(params.id, data, { new: true })
  return NextResponse.json(updated)
}

export async function DELETE(_: any, { params }: { params: { id: string } }) {
  await connectDB()
  await Training.findByIdAndDelete(params.id)
  return NextResponse.json({ message: 'Deleted' })
}
