// app/components/Navbar.tsx
'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const [user, setUser] = useState<{ email: string; role: string } | null>(null)
  const [dashboardPath, setDashboardPath] = useState('/dashboard')

  useEffect(() => {
    const localUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null
    if (localUser) {
      const parsed = JSON.parse(localUser)
      setUser(parsed)
      setDashboardPath(parsed.role === 'admin' ? '/dashboard/admin' : '/dashboard/umkm')
    } else {
      setUser(null)
    }
  }, [])

  return (
    <nav className="sticky top-0 z-50 w-full bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <Link
          href="/"
          className="text-2xl font-extrabold text-green-600 hover:text-green-700 transition"
        >
          Si-UMKM
        </Link>

        <div className="flex gap-2 items-center">
          {user ? (
            <Link
              href={dashboardPath}
              className="text-green-600 font-semibold hover:underline"
            >
              🏠 Kembali ke Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-yellow-400 text-white px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
