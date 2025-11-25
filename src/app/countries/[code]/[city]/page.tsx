'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { AirportCombobox } from '@/components/AirportCombobox'
import { DateTimePicker } from '@/components/DateTimePicker'
import { PassengerPicker } from '@/components/PassengerPicker'
import { PlaneTakeoff, PlaneLanding, ArrowLeft } from 'lucide-react'
import Footer from '@/components/Footer'
import ImageWithFallback from '@/components/ImageWithFallback'
import { Skeleton } from '@/components/ui/skeleton'
import { supabase, type Country, type City } from '@/lib/supabase'

export default function CityDetailPage() {
  const { theme } = useTheme()
  const params = useParams()
  const router = useRouter()
  const countryCode = (params.code as string).toUpperCase()
  const citySlug = params.city as string

  const [country, setCountry] = useState<Country | null>(null)
  const [city, setCity] = useState<City | null>(null)
  const [loading, setLoading] = useState(true)

  // Form state
  const [from, setFrom] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [passengers, setPassengers] = useState('2')

  useEffect(() => {
    async function loadCityData() {
      try {
        // Загружаем данные страны
        const { data: countryData, error: countryError } = await supabase
          .from('countries')
          .select('*')
          .eq('code', countryCode)
          .single()

        if (countryError) throw countryError
        setCountry(countryData)

        // Декодируем URL slug и преобразуем обратно в название
        // Например: "p%C3%A9cs" -> "pécs", "new-york" -> "New York"
        const decodedSlug = decodeURIComponent(citySlug)
        const cityName = decodedSlug.split('-').map(word =>
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ')

        // Ищем город по точному совпадению названия
        const { data: cityData, error: cityError } = await supabase
          .from('cities')
          .select('*')
          .eq('country_code', countryCode)
          .ilike('name', cityName)
          .single()

        if (cityError) throw cityError
        setCity(cityData)
      } catch (error) {
        console.error('Error loading city data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadCityData()
  }, [countryCode, citySlug])

  const handleSearch = () => {
    if (!city) return

    const searchParams = new URLSearchParams({
      from,
      to: `${city.name}, ${countryCode}`,
      date,
      time,
      passengers
    })
    router.push(`/search-results?${searchParams.toString()}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background transition-colors duration-300">
        <main className="pt-6 px-4 pb-12">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumbs Skeleton */}
            <div className="flex items-center gap-2 mb-6">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-32" />
            </div>

            {/* Main Content Container */}
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Column Skeleton */}
              <div className="flex-1">
                {/* City Header Skeleton */}
                <div className="flex items-center gap-4 mb-6">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-10 w-48" />
                    <Skeleton className="h-6 w-32" />
                  </div>
                </div>

                {/* City Image Skeleton */}
                <Skeleton className="w-full h-[400px] rounded-2xl mb-6" />

                {/* Description Skeleton */}
                <div className={`rounded-xl p-6 ${
                  theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'
                }`}>
                  <Skeleton className="h-8 w-48 mb-4" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              </div>

              {/* Right Column Skeleton */}
              <div className="lg:w-[380px]">
                <div className={`rounded-xl p-6 ${
                  theme === 'dark' ? 'bg-gray-800/50 border border-gray-700' : 'bg-gray-50 border border-gray-200'
                }`}>
                  <Skeleton className="h-7 w-40 mb-6" />
                  <div className="space-y-4">
                    <div>
                      <Skeleton className="h-4 w-16 mb-2" />
                      <Skeleton className="h-12 w-full rounded-lg" />
                    </div>
                    <div>
                      <Skeleton className="h-4 w-16 mb-2" />
                      <Skeleton className="h-12 w-full rounded-lg" />
                    </div>
                    <div>
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-12 w-full rounded-lg" />
                    </div>
                    <div>
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-12 w-full rounded-lg" />
                    </div>
                    <Skeleton className="h-12 w-full rounded-lg mt-6" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!country || !city) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">City not found</h1>
          <Link href="/countries" className="text-primary hover:underline">
            ← Back to Countries
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <main className="pt-6 px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Back to Country Button */}
          <Link
            href={`/countries/${countryCode}`}
            className={`inline-flex items-center gap-2 mb-4 transition-colors ${
              theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to {country.name}</span>
          </Link>

          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 mb-6 text-sm">
            <Link
              href="/countries"
              className={`transition-colors ${
                theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Countries
            </Link>
            <span className={theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}>/</span>
            <Link
              href={`/countries/${countryCode}`}
              className={`transition-colors ${
                theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {country.name}
            </Link>
            <span className={theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}>/</span>
            <span className={theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}>{city.name}</span>
          </div>

          {/* Main Content Container */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Main Content */}
            <div className="flex-1">
              {/* City Header */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-5xl">{country.flag}</span>
                <div>
                  <h1
                    className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                    style={{ fontFamily: 'Clash Display, sans-serif' }}
                  >
                    {city.name}
                  </h1>
                  <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {country.name}
                  </p>
                </div>
              </div>

              {/* City Image */}
              <div className="relative w-full h-[400px] rounded-2xl overflow-hidden mb-6">
                <ImageWithFallback
                  src={city.image}
                  alt={city.name}
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
                  Explore {city.name}
                </h2>
                <p className={`text-lg leading-relaxed ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {city.description}
                </p>
              </div>
            </div>

            {/* Right Column - Search Form */}
            <div className="lg:w-[380px]">
              <div className={`rounded-xl p-6 sticky top-6 ${
                theme === 'dark' ? 'bg-gray-800/50 border border-gray-700' : 'bg-gray-50 border border-gray-200'
              }`}>
                <h3 className={`text-xl font-semibold mb-6 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`} style={{ fontFamily: 'Clash Display, sans-serif' }}>
                  Book Your Flight
                </h3>

                <div className="space-y-4">
                  {/* From Field */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      From
                    </label>
                    <div className={`rounded-lg border px-3 py-2.5 ${
                      theme === 'dark' ? 'border-gray-600' : 'border-gray-300'
                    }`}>
                      <AirportCombobox
                        value={from}
                        onValueChange={setFrom}
                        placeholder="Departure city"
                        icon={<PlaneTakeoff className="w-4 h-4" />}
                        fieldType="from"
                      />
                    </div>
                  </div>

                  {/* To Field - Pre-filled */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      To
                    </label>
                    <div className={`rounded-lg border px-4 py-3 flex items-center gap-3 ${
                      theme === 'dark'
                        ? 'border-gray-600 bg-gray-700/50'
                        : 'border-gray-300 bg-gray-100'
                    }`}>
                      <PlaneLanding className="w-4 h-4" />
                      <span className={theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}>
                        {city.name}, {countryCode}
                      </span>
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Date & Time
                    </label>
                    <div className={`rounded-lg border px-3 py-2.5 ${
                      theme === 'dark' ? 'border-gray-600' : 'border-gray-300'
                    }`}>
                      <DateTimePicker
                        date={date}
                        time={time}
                        onDateChange={setDate}
                        onTimeChange={setTime}
                      />
                    </div>
                  </div>

                  {/* Passengers */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Passengers
                    </label>
                    <div className={`rounded-lg border px-3 py-2.5 ${
                      theme === 'dark' ? 'border-gray-600' : 'border-gray-300'
                    }`}>
                      <PassengerPicker
                        value={passengers}
                        onChange={setPassengers}
                      />
                    </div>
                  </div>

                  {/* Search Button */}
                  <button
                    onClick={handleSearch}
                    className="w-full text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:opacity-90 mt-6"
                    style={{ backgroundColor: 'var(--brand-red)' }}
                  >
                    Search a Flight
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
