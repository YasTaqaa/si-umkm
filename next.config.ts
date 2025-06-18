/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**', // Bisa diubah jika kamu tahu struktur folder tertentu di Cloudinary
      },
    ],
  },
}

export default nextConfig
