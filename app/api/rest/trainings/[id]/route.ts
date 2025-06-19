// app/api/rest/trainings/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/connectDB'
import Training from '@/models/training'
import { getUserFromRequest } from '@/lib/auth/middleware'

// ⬅️ WAJIB untuk mendukung dynamic route handler
export const dynamic = 'force-dynamic'

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } } // ⬅️ inline destructure, TANPA type alias
) {
  const user = await getUserFromRequest(req)

  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await connectDB()

    const deletedTraining = await Training.findByIdAndDelete(params.id)

    if (!deletedTraining) {
      return NextResponse.json({ error: 'Pelatihan tidak ditemukan' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Berhasil dihapus' }, { status: 200 })
  } catch (err) {
    console.error('Gagal menghapus pelatihan:', err)
    return NextResponse.json({ error: 'Gagal menghapus pelatihan' }, { status: 500 })
  }
}
