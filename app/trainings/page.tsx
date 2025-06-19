/* eslint-disable @typescript-eslint/no-explicit-any */
// app/trainings/page.tsx
import Navbar from '@/app/components/Navbar'

function extractYouTubeEmbedUrl(url: string): string | null {
  if (!url || typeof url !== 'string') return null
  const regex =
    /^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regex)
  const videoId = match && match[1].length === 11 ? match[1] : null
  return videoId ? `https://www.youtube.com/embed/${videoId}` : null
}

async function getTrainings() {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

  const res = await fetch(`${baseUrl}/api/rest/trainings`, {
    cache: 'no-store',
  })

  if (!res.ok) {
    console.error('Failed to fetch trainings:', res.status)
    return []
  }

  return res.json()
}

export default async function TrainingListPage() {
  const trainings = await getTrainings()

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto py-10 px-4">
        <h1 className="text-2xl font-bold text-green-700 mb-6">📺 Pelatihan & Video Edukasi</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {trainings.map((training: any) => {
            const embedUrl = extractYouTubeEmbedUrl(training.youtubeUrl)

            return (
              <div key={training._id} className="bg-white border rounded-lg p-4 shadow">
                <h2 className="text-xl font-semibold text-green-700 mb-2">{training.title}</h2>
                <p className="text-gray-700 mb-4">{training.description}</p>

                {embedUrl ? (
                  <iframe
                    width="100%"
                    height="215"
                    src={embedUrl}
                    title={training.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded"
                  />
                ) : (
                  <p className="text-red-500 text-sm">⚠️ URL video tidak valid</p>
                )}
              </div>
            )
          })}
        </div>
      </main>
    </>
  )
}
