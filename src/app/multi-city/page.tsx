'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState, Suspense } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import MultiCityForm from '@/components/MultiCityForm'
import Footer from '@/components/Footer'
import { Skeleton } from '@/components/ui/skeleton'

function MultiCityContent() {
  const { resolvedTheme } = useTheme()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [mounted, setMounted] = useState(false)

  // Use dark theme as default before hydration to prevent flash
  const theme = mounted ? resolvedTheme : 'dark'

  // Get initial form data from URL
  const initialFormData = {
    from: searchParams.get('from') || '',
    to: searchParams.get('to') || '',
    date: searchParams.get('date') || '',
    time: searchParams.get('time') || '',
    passengers: searchParams.get('passengers') || '2'
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Hero Section */}
      <section className="min-h-[60vh] flex items-center justify-center">
        {/* Content */}
        <div className="w-full px-4 py-12">
          {/* Back Button */}
          <div className="max-w-6xl mx-auto mb-8">
            <button
              onClick={() => router.push('/')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 border ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-600 text-gray-200 hover:bg-gray-700'
                  : 'bg-white border-gray-200 text-gray-800 hover:bg-gray-50'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-medium">Back to Home</span>
            </button>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-foreground mb-4 tracking-tight sm:tracking-[2.4px]"
              style={{ fontFamily: 'Clash Display, sans-serif' }}
            >
              Multi-City Flights
            </h1>
            <p className="text-sm sm:text-base lg:text-lg max-w-2xl mx-auto text-foreground/80 px-4">
              Plan your journey with multiple destinations. Add as many stops as you need.
            </p>
          </div>

          {/* Multi-City Form */}
          <MultiCityForm initialFormData={initialFormData} />
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default function MultiCityPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background">
        <section className="pt-6 px-4 pb-12">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-10 w-48" />
            </div>
            <div>
              <Skeleton className="h-14 w-80 mb-3" />
              <Skeleton className="h-5 w-96" />
            </div>
            <Skeleton className="h-96 w-full rounded-xl" />
          </div>
        </section>
      </div>
    }>
      <MultiCityContent />
    </Suspense>
  )
}
