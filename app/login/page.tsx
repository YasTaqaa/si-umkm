// app/login/page.tsx
'use client'

import { useState } from 'react'
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth } from '@/lib/auth/firebase'
import { useRouter } from 'next/navigation'
import Navbar from '../navbar/page'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'umkm' | 'admin'>('umkm')

  const handleAdminLogin = async () => {
    try {
      const res = await fetch('/api/rest/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      })

      if (res.ok) {
        setTimeout(() => {
          router.push('/dashboard/admin')
        }, 300)
      } else {
        alert('Login admin gagal')
      }
    } catch (error) {
      console.error('Login error:', error)
      alert('Terjadi kesalahan saat login')
    }
  }

  const handleUmkmLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push('/dashboard/umkm')
    } catch {
      alert('Login UMKM gagal')
    }
  }

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
      router.push('/dashboard/umkm')
    } catch {
      alert('Login Google gagal')
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 space-y-6">
          <h1 className="text-2xl font-bold text-green-700 text-center">Masuk ke Akun</h1>

          {/* Role selector */}
          <div>
            <label htmlFor="role-select" className="block mb-1 text-sm font-medium text-gray-700">
              Masuk sebagai
            </label>
            <select
              id="role-select"
              onChange={(e) => setRole(e.target.value as 'umkm' | 'admin')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 text-black"
            >
              <option value="umkm">UMKM</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Email & Password */}
          <input
            type="email"
            placeholder="Email"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 text-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 text-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Login button */}
          <button
            onClick={role === 'admin' ? handleAdminLogin : handleUmkmLogin}
            className="w-full bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition"
          >
            Login sebagai {role.toUpperCase()}
          </button>

          {/* Google login */}
          {role === 'umkm' && (
            <button
              onClick={loginWithGoogle}
              className="w-full bg-red-500 text-white font-semibold py-2 rounded-lg hover:bg-red-600 transition"
            >
              Login dengan Google
            </button>
          )}

          {/* Link register */}
          <p className="text-center text-sm text-gray-600">
            Belum punya akun?{' '}
            <a href="/register" className="text-green-700 hover:underline font-medium">
              Daftar di sini
            </a>
          </p>
        </div>
      </main>
    </>
  )
}
