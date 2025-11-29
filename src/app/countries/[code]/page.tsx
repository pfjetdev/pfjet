import { notFound } from 'next/navigation'
import { getCountry, getCountryCities } from '@/lib/data'
import CountryClient from './CountryClient'
import { createCountryMetadata } from '@/lib/seo'
import { PlaceJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd'

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

    return (
      <>
        {/* JSON-LD Structured Data */}
        <PlaceJsonLd
          place={{
            name: country.name,
            description: country.description,
            image: country.image,
            url: `/countries/${countryCode}`,
            type: 'Country',
          }}
        />
        <BreadcrumbJsonLd
          items={[
            { name: 'Home', url: '/' },
            { name: 'Countries', url: '/countries' },
            { name: country.name, url: `/countries/${countryCode}` },
          ]}
        />
        <CountryClient country={country} cities={cities} />
      </>
    )
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
    return createCountryMetadata({
      code: countryCode,
      name: country.name,
      description: country.description,
      image: country.image,
    })
  } catch {
    return {
      title: 'Country Not Found',
    }
  }
}
