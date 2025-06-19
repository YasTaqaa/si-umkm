/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/rest/products/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/connectDB'
import Product from '@/models/product'
import { IncomingForm, File as FormidableFile } from 'formidable'
import cloudinary from 'cloudinary'
import streamifier from 'streamifier'
import fs from 'fs/promises'

// Disable default body parser
export const config = {
  api: {
    bodyParser: false,
  },
}

// Konfigurasi Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// GET: Ambil semua produk, atau berdasarkan email user
export async function GET(req: NextRequest) {
  await connectDB()
  const email = req.nextUrl.searchParams.get('email')
  const filter = email ? { emailUser: email } : {}
  const products = await Product.find(filter)
  return NextResponse.json(products)
}

// Fungsi bantu upload gambar ke Cloudinary
function uploadToCloudinary(fileBuffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      { folder: 'si-umkm/products' },
      (error, result) => {
        if (error) return reject(error)
        resolve(result?.secure_url || '')
      }
    )
    streamifier.createReadStream(fileBuffer).pipe(uploadStream)
  })
}

// POST: Tambah produk baru dengan upload gambar ke Cloudinary
export async function POST(req: Request): Promise<Response> {
  await connectDB()

  const buffer = Buffer.from(await req.arrayBuffer())
  const headers = Object.fromEntries(req.headers.entries())

  return await new Promise((resolve) => {
    const form = new IncomingForm({ multiples: false, keepExtensions: true })
    const stream = streamifier.createReadStream(buffer)

    const fakeReq: any = stream
    fakeReq.headers = headers
    fakeReq.method = 'POST'
    fakeReq.url = '/'

    form.parse(fakeReq, async (err, fields, files) => {
      if (err) {
        console.error('Form parsing error:', err)
        resolve(NextResponse.json({ error: 'Gagal parsing form' }, { status: 400 }))
        return
      }

      try {
        const nama = Array.isArray(fields.nama) ? fields.nama[0] : fields.nama
        const deskripsi = Array.isArray(fields.deskripsi) ? fields.deskripsi[0] : fields.deskripsi
        const hargaRaw = Array.isArray(fields.harga) ? fields.harga[0] : fields.harga
        const harga = Number(hargaRaw)
        const emailUser = Array.isArray(fields.emailUser) ? fields.emailUser[0] : fields.emailUser

        const file = Array.isArray(files.gambar) ? files.gambar[0] : files.gambar
        const typedFile = file as FormidableFile

        const fileBuffer = await fs.readFile(typedFile.filepath)
        const imageUrl = await uploadToCloudinary(fileBuffer)

        const newProduct = await Product.create({
          nama,
          deskripsi,
          harga,
          gambar: imageUrl,
          emailUser,
        })

        resolve(NextResponse.json(newProduct, { status: 201 }))
      } catch (err) {
        console.error('Saving error:', err)
        resolve(NextResponse.json({ error: 'Gagal menyimpan produk' }, { status: 500 }))
      }
    })
  })
}
