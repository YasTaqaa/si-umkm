
// app/api/rest/products/[id]/route.ts
import { connectDB } from '@/lib/db/connectDB'
import Product from '@/models/product'
import { NextRequest, NextResponse } from 'next/server'

interface RouteContext {
  params: { id: string }
}

// GET /api/rest/products/[id]
export async function GET(_req: NextRequest, context: RouteContext) {
  await connectDB()
  const product = await Product.findById(context.params.id)
  return NextResponse.json(product)
}

// PUT /api/rest/products/[id]
export async function PUT(req: NextRequest, context: RouteContext) {
  await connectDB()
  const data = await req.json()
  const updated = await Product.findByIdAndUpdate(context.params.id, data, { new: true })
  return NextResponse.json(updated)
}

// DELETE /api/rest/products/[id]
export async function DELETE(_req: NextRequest, context: RouteContext) {
  await connectDB()
  await Product.findByIdAndDelete(context.params.id)
  return NextResponse.json({ message: 'Deleted' })
}
