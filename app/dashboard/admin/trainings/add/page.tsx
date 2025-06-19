// app/dashboard/admin/trainings/add/page.tsx ====
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/app/components/Navbar'

export default function AddTrainingPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [youtubeUrl, setYoutubeUrl] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/rest/trainings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, youtubeUrl }),
    })

    if (res.ok) {
      alert('Pelatihan berhasil ditambahkan!')
      router.push('/dashboard/admin/trainings')
    } else {
      const data = await res.json()
      alert('Gagal menambah pelatihan: ' + data.error)
    }
  }

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto py-10 px-4">
        <h1 className="text-2xl font-bold text-green-700 mb-4">Tambah Pelatihan Baru</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Judul Pelatihan" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full border px-3 py-2 rounded" />
          <textarea placeholder="Deskripsi Pelatihan" value={description} onChange={(e) => setDescription(e.target.value)} required className="w-full border px-3 py-2 rounded" />
          <input type="url" placeholder="Link Video YouTube" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} required className="w-full border px-3 py-2 rounded" />
          <button type="submit" className="bg-green-600 text-white font-semibold px-4 py-2 rounded hover:bg-green-700">Tambah Pelatihan</button>
        </form>
      </main>
    </>
  )
}
