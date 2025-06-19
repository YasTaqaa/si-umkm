// app/login/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/app/components/Navbar'
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth'
import { auth } from '@/lib/auth/firebase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'umkm' | 'admin'>('umkm')

  // 🔐 LOGIN ADMIN
  const handleAdminLogin = async () => {
    try {
      const res = await fetch('/api/rest/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // ⬅️ agar cookie HttpOnly disimpan
        body: JSON.stringify({ email, password }),
      })

      if (res.ok) {
        const data = await res.json()

        // ✅ Simpan user ke localStorage agar dikenali oleh frontend (Navbar, dashboard, dll)
        localStorage.setItem('user', JSON.stringify({
          email: data.email,
          role: data.role,
        }))

        router.push('/dashboard/admin')
      } else {
        alert('Login admin gagal. Email atau password salah.')
      }
    } catch (err) {
      console.error('Error saat login admin:', err)
      alert('Terjadi kesalahan saat login admin.')
    }
  }

  // 🙋‍♂️ LOGIN UMKM via Firebase Email/Password
  const handleUmkmLogin = async () => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      localStorage.setItem('user', JSON.stringify({
        email: result.user.email,
        role: 'umkm',
      }))
      router.push('/dashboard/umkm')
    } catch {
      alert('Login UMKM gagal. Periksa email dan password.')
    }
  }

  // 🔓 LOGIN GOOGLE untuk UMKM
  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      localStorage.setItem('user', JSON.stringify({
        email: result.user.email,
        role: 'umkm',
      }))
      router.push('/dashboard/umkm')
    } catch {
      alert('Login Google gagal.')
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 space-y-6">
          <h1 className="text-2xl font-bold text-green-700 text-center">Masuk ke Akun</h1>

          {/* Pilih Role */}
          <div>
            <label htmlFor="role-select" className="block mb-1 text-sm font-medium text-gray-700">
              Masuk sebagai
            </label>
            <select
              id="role-select"
              value={role}
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

          {/* Tombol Login */}
          <button
            onClick={role === 'admin' ? handleAdminLogin : handleUmkmLogin}
            className="w-full bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition"
          >
            Login sebagai {role.toUpperCase()}
          </button>

          {/* Login Google hanya untuk UMKM */}
          {role === 'umkm' && (
            <button
              onClick={loginWithGoogle}
              className="w-full bg-red-500 text-white font-semibold py-2 rounded-lg hover:bg-red-600 transition"
            >
              Login dengan Google
            </button>
          )}

          {/* Link ke halaman Register */}
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
