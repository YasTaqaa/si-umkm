/* eslint-disable @typescript-eslint/no-explicit-any */
// app/dashboard/umkm/page.tsx
'use client'

import { auth } from '@/lib/auth/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/app/components/Navbar'

export default function UmkmDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email) {
        setUser(user)
        fetchProducts(user.email)
      } else {
        router.push('/login')
      }
    })
    return () => unsubscribe()
  }, [router])

  const fetchProducts = async (email: string) => {
    try {
      const res = await fetch('/api/rest/products')
      const data = await res.json()
      const userProducts = data.filter((p: any) => p.emailUser === email)
      setProducts(userProducts)
    } catch (error) {
      console.error('Gagal mengambil produk:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus produk ini?')) return

    try {
      await fetch(`/api/rest/products/${id}`, {
        method: 'DELETE',
      })
      setProducts(products.filter((p) => p._id !== id))
    } catch (error) {
      console.error('Gagal menghapus produk:', error)
    }
  }

  const handleLogout = async () => {
    await signOut(auth)
    router.push('/login')
  }

  if (!user || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-lg">Loading dashboard...</p>
      </div>
    )
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white shadow-lg rounded-2xl p-6">
            <h1 className="text-3xl font-bold text-green-600">🎉 Selamat Datang di Dashboard UMKM</h1>
            <p className="text-gray-700 mb-4">
              Halo, <span className="font-semibold">{user.email}</span> 👋
            </p>
            <div className="flex justify-between items-center">
              <p className="text-gray-600">
                Kelola produk dan pelatihan UMKM Anda.
              </p>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">📦 Produk Saya</h2>
              <Link href="/dashboard/umkm/add-product">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">+ Tambah Produk</button>
              </Link>
            </div>

            {products.length === 0 ? (
              <p className="text-gray-500">Belum ada produk.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div key={product._id} className="bg-white p-4 rounded-xl shadow-md">
                    {product.gambar && (
                      <div className="w-full h-40 relative">
                        <Image src={product.gambar} alt={product.nama} fill className="object-cover rounded" />
                      </div>
                    )}
                    <h3 className="text-lg font-bold">{product.nama}</h3>
                    <p className="text-gray-600">{product.deskripsi}</p>
                    <p className="text-sm font-semibold">
                      Rp {Number(product.harga).toLocaleString()}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Link href={`/dashboard/umkm/edit-product/${product._id}`}>
                        <button className="bg-yellow-400 text-white px-3 py-1 rounded">Edit</button>
                      </Link>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
