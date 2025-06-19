// app/api/rest/products/[id]/route.ts
import { connectDB } from '@/lib/db/connectDB'
import Product from '@/models/product'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest, context: { params: { id: string } }) {
  await connectDB()
  const product = await Product.findById(context.params.id)
  return NextResponse.json(product)
}

export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  await connectDB()
  const data = await req.json()
  const updated = await Product.findByIdAndUpdate(context.params.id, data, { new: true })
  return NextResponse.json(updated)
}

export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  await connectDB()
  await Product.findByIdAndDelete(context.params.id)
  return NextResponse.json({ message: 'Deleted' })
}
