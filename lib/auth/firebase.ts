// lib/auth/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyCx_iIbZ-kFdPqP-rtG3ggJCJsa4HrsoRg",
  authDomain: "si-umkm.firebaseapp.com",
  projectId: "si-umkm",
  storageBucket: "si-umkm.appspot.com",
  messagingSenderId: "554466562085",
  appId: "1:554466562085:web:fbc02b458491a054d7efcc",
  measurementId: "G-YH4J42BW2M"
}

// Pastikan tidak inisialisasi dua kali (penting di Next.js)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

// Auth Firebase (yang dipakai untuk login/register)
export const auth = getAuth(app)
