/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/rest/products/[id]/route.ts
import { connectDB } from '@/lib/db/connectDB'
import Product from '@/models/product'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(_: any, { params }: { params: { id: string } }) {
  await connectDB()
  const product = await Product.findById(params.id)
  return NextResponse.json(product)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB()
  const data = await req.json()
  const updated = await Product.findByIdAndUpdate(params.id, data, { new: true })
  return NextResponse.json(updated)
}

export async function DELETE(_: any, { params }: { params: { id: string } }) {
  await connectDB()
  await Product.findByIdAndDelete(params.id)
  return NextResponse.json({ message: 'Deleted' })
}
