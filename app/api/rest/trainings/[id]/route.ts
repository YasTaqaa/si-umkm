// app/api/rest/trainings/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/connectDB'
import Training from '@/models/training'
import { getUserFromRequest } from '@/lib/auth/middleware'

export const dynamic = 'force-dynamic'

export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } } // ✅ jangan gunakan `Record`, jangan pakai type alias
) {
  const { id } = context.params
  const user = await getUserFromRequest(req)

  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await connectDB()

    const deleted = await Training.findByIdAndDelete(id)
    if (!deleted) {
      return NextResponse.json({ error: 'Pelatihan tidak ditemukan' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Berhasil dihapus' })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Gagal menghapus pelatihan' }, { status: 500 })
  }
}
