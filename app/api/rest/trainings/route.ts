// app/api/rest/trainings/route.ts
import { NextRequest, NextResponse } from 'next/server'
import Training from '@/models/training'
import { connectDB } from '@/lib/db/connectDB'
import { getUserFromRequest } from '@/lib/auth/middleware'

// ✅ Tambah pelatihan (khusus admin)
export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req)

  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized - admin only' }, { status: 401 })
  }

  const { title, description, youtubeUrl } = await req.json()

  // Validasi input
  if (!title || !description || !youtubeUrl) {
    return NextResponse.json({ error: 'Semua field wajib diisi' }, { status: 400 })
  }

  const isYoutube = youtubeUrl.startsWith('https://www.youtube.com') || youtubeUrl.startsWith('https://youtu.be')
  if (!isYoutube) {
    return NextResponse.json({ error: 'Link harus berupa URL YouTube' }, { status: 400 })
  }

  try {
    await connectDB()
    const newTraining = await Training.create({ title, description, youtubeUrl })
    return NextResponse.json(newTraining, { status: 201 })
  } catch (err) {
    console.error('Gagal menambah pelatihan:', err)
    return NextResponse.json({ error: 'Gagal menambahkan pelatihan' }, { status: 500 })
  }
}

// ✅ Ambil semua pelatihan (untuk semua user)
export async function GET() {
  try {
    await connectDB()
    const trainings = await Training.find().sort({ createdAt: -1 })
    return NextResponse.json(trainings)
  } catch (err) {
    console.error('Gagal mengambil data pelatihan:', err)
    return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 })
  }
}
