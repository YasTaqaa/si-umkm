// app/dashboard/admin/trainings/page.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Navbar from '@/app/components/Navbar'

interface Training {
  _id: string
  title: string
  description: string
  youtubeUrl: string
}

function extractYouTubeId(url?: string): string | null {
  if (!url || typeof url !== 'string') return null
  const regex =
    /^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regex)
  return match && match[1].length === 11 ? match[1] : null
}

export default function TrainingsPage() {
  const [trainings, setTrainings] = useState<Training[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchTrainings = async () => {
    try {
      const res = await fetch('/api/rest/trainings')
      if (!res.ok) throw new Error('Gagal mengambil data')
      const data = await res.json()
      setTrainings(data)
    } catch (err) {
      console.error('Gagal mengambil data pelatihan:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTrainings()
  }, [])

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm('Yakin ingin menghapus pelatihan ini?')
    if (!confirmDelete) return

    try {
      const res = await fetch(`/api/rest/trainings/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Gagal menghapus')

      alert('Pelatihan berhasil dihapus')
      fetchTrainings()
    } catch (err) {
      console.error('Gagal menghapus pelatihan:', err)
      alert('Terjadi kesalahan saat menghapus pelatihan')
    }
  }

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-green-700">📚 Kelola Pelatihan</h1>
          <Link
            href="/dashboard/admin/trainings/add"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-semibold"
          >
            ➕ Tambah Pelatihan
          </Link>
        </div>

        {isLoading ? (
          <p className="text-gray-500">Memuat data pelatihan...</p>
        ) : trainings.length === 0 ? (
          <p className="text-gray-600">Belum ada pelatihan yang ditambahkan.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trainings.map((item) => {
              const videoId = extractYouTubeId(item.youtubeUrl)
              const embedUrl = videoId
                ? `https://www.youtube.com/embed/${videoId}`
                : null

              return (
                <div
                  key={item._id}
                  className="p-4 bg-white border rounded-xl shadow space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold text-green-800">{item.title}</h2>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      🗑 Hapus
                    </button>
                  </div>
                  <p className="text-sm text-gray-700">{item.description}</p>
                  {embedUrl ? (
                    <div className="aspect-video">
                      <iframe
                        src={embedUrl}
                        title={item.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full rounded"
                      ></iframe>
                    </div>
                  ) : (
                    <p className="text-red-500 text-sm">⚠️ URL video tidak valid.</p>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </main>
    </>
  )
}
