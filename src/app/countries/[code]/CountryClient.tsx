'use client'

import { useTheme } from 'next-themes'
import Link from 'next/link'
import ImageWithFallback from '@/components/ImageWithFallback'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import Footer from '@/components/Footer'
import type { Country, City } from '@/lib/supabase'

interface CountryClientProps {
  country: Country
  cities: City[]
}

export default function CountryClient({ country, cities }: CountryClientProps) {
  const { resolvedTheme } = useTheme()

  // Use dark theme as default to prevent flash
  const theme = resolvedTheme || 'dark'

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <main className="pt-6 px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <Link
            href="/countries"
            className={`inline-flex items-center gap-2 mb-6 text-sm transition-colors ${
              theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            ← Back to Countries
          </Link>

          {/* Main Content Container */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - 70% */}
            <div className="flex-1 lg:w-[70%]">
              {/* Country Header */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-6xl">{country.flag}</span>
                <h1
                  className={`text-5xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                  style={{ fontFamily: 'Clash Display, sans-serif' }}
                >
                  {country.name}
                </h1>
              </div>

              {/* Country Image */}
              <div className="relative w-full h-[400px] rounded-2xl overflow-hidden mb-6">
                <ImageWithFallback
                  src={country.image}
                  alt={country.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Description */}
              <div className={`rounded-xl p-6 ${
                theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'
              }`}>
                <h2 className={`text-2xl font-semibold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`} style={{ fontFamily: 'Clash Display, sans-serif' }}>
                  About {country.name}
                </h2>
                <p className={`text-lg leading-relaxed ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {country.description}
                </p>
              </div>
            </div>

            {/* Right Column - 30% */}
            <div className="lg:w-[30%]">
              <div className={`rounded-xl p-6 sticky top-6 ${
                theme === 'dark' ? 'bg-gray-800/50 border border-gray-700' : 'bg-gray-50 border border-gray-200'
              }`}>
                <h3 className={`text-xl font-semibold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`} style={{ fontFamily: 'Clash Display, sans-serif' }}>
                  Popular Cities {cities.length > 0 && `(${cities.length})`}
                </h3>

                {cities.length === 0 ? (
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    No cities available yet
                  </p>
                ) : (
                  <div className="space-y-0">
                    {cities.map((city, index) => (
                      <div key={city.id}>
                        <Link
                          href={`/countries/${country.code}/${encodeURIComponent(city.name.toLowerCase().replace(/\s+/g, '-'))}`}
                          className={`flex items-center justify-between px-3 py-2.5 transition-colors ${
                            theme === 'dark'
                              ? 'hover:bg-gray-700/50 text-gray-200'
                              : 'hover:bg-gray-100 text-gray-900'
                          }`}
                        >
                          <span className="text-sm font-medium">{city.name}</span>
                          {city.is_capital && (
                            <Badge variant="secondary" className="text-xs">
                              Capital
                            </Badge>
                          )}
                        </Link>
                        {index < cities.length - 1 && <Separator />}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
