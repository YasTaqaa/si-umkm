// app/page.tsx
'use client'

import { Suspense } from 'react'
import Navbar from './components/Navbar'
import ProductList from './components/productlist'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// Komponen yang menggunakan useSearchParams untuk Search
function SearchSection() {
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
  )
}

// Loading fallback untuk SearchSection
function SearchFallback() {
  return (
    <section className="text-center mb-8">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-green-700 tracking-tight mb-4">
        🛍️ Produk UMKM
      </h1>
      
      <div className="max-w-lg mx-auto flex shadow-md rounded-lg overflow-hidden bg-white">
        <div className="w-full px-4 py-2 bg-gray-100 animate-pulse h-10"></div>
        <div className="px-4 py-2 bg-gray-300 animate-pulse w-16"></div>
      </div>
    </section>
  )
}

// Loading fallback untuk ProductList
function ProductListFallback() {
  return (
    <div className="mt-8 max-w-6xl mx-auto px-4">
      <h2 className="text-2xl font-bold text-green-700 mb-4">📦 Daftar Produk UMKM</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white p-4 rounded-xl shadow-md space-y-2 border">
            <div className="w-full h-40 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-6 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2"></div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="mt-10 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen pb-12">
        <Suspense fallback={<SearchFallback />}>
          <SearchSection />
        </Suspense>
        
        <Suspense fallback={<ProductListFallback />}>
          <ProductList />
        </Suspense>
      </main>
    </>
  )
}