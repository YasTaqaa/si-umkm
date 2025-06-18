// app/layout.tsx
import './globals.css'
import { Inter } from 'next/font/google'
import ApolloWrapper from './components/ApolloWrapper' // ✅ import client wrapper

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Si-UMKM',
  description: 'Sistem Informasi UMKM Berbasis Web',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={`${inter.className} bg-white text-black min-h-screen`}>
        <ApolloWrapper>{children}</ApolloWrapper>
      </body>
    </html>
  )
}
