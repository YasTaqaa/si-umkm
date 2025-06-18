// app/page.tsx
'use client'

import Navbar from './navbar/page'
import ProductList from './components/productlist'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function HomePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const [searchQuery, setSearchQuery] = useState(initialQuery)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/?q=${searchQuery}`)
  }

  useEffect(() => {
    setSearchQuery(initialQuery)
  }, [initialQuery])

  return (
    <>
      <Navbar />
      <main className="mt-10 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen pb-12">
        <section className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-green-700 tracking-tight mb-4">
            🛍️ Produk UMKM
          </h1>

          <form 
            onSubmit={handleSearch} 
            className="max-w-lg mx-auto flex shadow-md rounded-lg overflow-hidden bg-white"
          >
            <input
              type="text"
              placeholder="Cari produk UMKM..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white font-medium hover:bg-green-700 transition duration-300"
            >
              Cari
            </button>
          </form>
        </section>

        <ProductList />
      </main>
    </>
  )
}
