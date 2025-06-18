// app/api/rest/products/count/route.ts
import { connectDB } from '@/lib/db/connectDB'
import Product from '@/models/product'
import { NextResponse } from 'next/server'

export async function GET() {
  await connectDB()
  const count = await Product.countDocuments()
  return NextResponse.json({ count })
}
