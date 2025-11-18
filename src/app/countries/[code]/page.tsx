import { notFound } from 'next/navigation'
import { getCountry, getCountryCities } from '@/lib/data'
import CountryClient from './CountryClient'

interface PageProps {
  params: Promise<{ code: string }>
}

export default async function CountryDetailPage({ params }: PageProps) {
  const { code } = await params
  const countryCode = code.toUpperCase()

  try {
    // Загружаем данные параллельно с использованием кеша
    const [country, cities] = await Promise.all([
      getCountry(countryCode),
      getCountryCities(countryCode),
    ])

    return <CountryClient country={country} cities={cities} />
  } catch (error) {
    console.error('Error loading country data:', error)
    notFound()
  }
}

// Генерация metadata для SEO
export async function generateMetadata({ params }: PageProps) {
  const { code } = await params
  const countryCode = code.toUpperCase()

  try {
    const country = await getCountry(countryCode)
    return {
      title: `${country.name} - Private Jet Travel`,
      description: country.description,
    }
  } catch {
    return {
      title: 'Country Not Found',
    }
  }
}
