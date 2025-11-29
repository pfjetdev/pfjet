import { siteConfig } from '@/lib/seo'

// Base JSON-LD component
interface JsonLdProps {
  data: Record<string, unknown>
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

// Organization Schema - use on homepage/layout
export function OrganizationJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    description: siteConfig.description,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: siteConfig.contact.phone,
      email: siteConfig.contact.email,
      contactType: 'customer service',
      availableLanguage: ['English'],
    },
    sameAs: [
      // Add social media URLs here
      // 'https://twitter.com/pfjet',
      // 'https://www.facebook.com/pfjet',
      // 'https://www.instagram.com/pfjet',
      // 'https://www.linkedin.com/company/pfjet',
    ].filter(Boolean),
  }

  return <JsonLd data={data} />
}

// LocalBusiness Schema - for charter services
export function LocalBusinessJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    image: `${siteConfig.url}${siteConfig.ogImage}`,
    description: siteConfig.description,
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    priceRange: '$$$$$',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '00:00',
      closes: '23:59',
    },
    areaServed: {
      '@type': 'Place',
      name: 'Worldwide',
    },
    serviceType: ['Private Jet Charter', 'Empty Leg Flights', 'Jet Sharing', 'VIP Travel'],
  }

  return <JsonLd data={data} />
}

// WebSite Schema with SearchAction
export function WebSiteJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteConfig.url}/search-results?from={from}&to={to}`,
      },
      'query-input': 'required name=from required name=to',
    },
  }

  return <JsonLd data={data} />
}

// Product Schema - for Aircraft
interface AircraftJsonLdProps {
  aircraft: {
    name: string
    slug: string
    category: string
    description?: string
    image?: string
    passengers?: string
    range?: string
    speed?: string
  }
}

export function AircraftJsonLd({ aircraft }: AircraftJsonLdProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: aircraft.name,
    description: aircraft.description || `${aircraft.category} private jet for charter`,
    image: aircraft.image,
    url: `${siteConfig.url}/jets/${aircraft.slug}`,
    brand: {
      '@type': 'Brand',
      name: aircraft.name.split(' ')[0], // First word as manufacturer
    },
    category: `${aircraft.category} Private Jet`,
    additionalProperty: [
      aircraft.passengers && {
        '@type': 'PropertyValue',
        name: 'Passenger Capacity',
        value: aircraft.passengers,
      },
      aircraft.range && {
        '@type': 'PropertyValue',
        name: 'Range',
        value: aircraft.range,
      },
      aircraft.speed && {
        '@type': 'PropertyValue',
        name: 'Cruise Speed',
        value: aircraft.speed,
      },
    ].filter(Boolean),
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      priceCurrency: 'USD',
      priceSpecification: {
        '@type': 'PriceSpecification',
        priceCurrency: 'USD',
        valueAddedTaxIncluded: false,
      },
      seller: {
        '@type': 'Organization',
        name: siteConfig.name,
      },
    },
  }

  return <JsonLd data={data} />
}

// Service Schema - for Empty Legs
interface EmptyLegJsonLdProps {
  emptyLeg: {
    id: string
    from_city: string
    from_airport?: string
    to_city: string
    to_airport?: string
    departure_date: string
    departure_time?: string
    aircraft_type?: string
    price?: number
    image?: string
  }
}

export function EmptyLegJsonLd({ emptyLeg }: EmptyLegJsonLdProps) {
  const departureDateTime = emptyLeg.departure_time
    ? `${emptyLeg.departure_date}T${emptyLeg.departure_time}`
    : emptyLeg.departure_date

  const data = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `Empty Leg Flight: ${emptyLeg.from_city} to ${emptyLeg.to_city}`,
    description: `Discounted private jet empty leg flight from ${emptyLeg.from_city} to ${emptyLeg.to_city}. ${emptyLeg.aircraft_type || 'Private jet'} available.`,
    url: `${siteConfig.url}/empty-legs/${emptyLeg.id}`,
    image: emptyLeg.image,
    serviceType: 'Empty Leg Flight',
    provider: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    areaServed: [
      { '@type': 'City', name: emptyLeg.from_city },
      { '@type': 'City', name: emptyLeg.to_city },
    ],
    ...(emptyLeg.price && {
      offers: {
        '@type': 'Offer',
        price: emptyLeg.price,
        priceCurrency: 'USD',
        availability: 'https://schema.org/LimitedAvailability',
        validFrom: new Date().toISOString(),
        validThrough: departureDateTime,
      },
    }),
    potentialAction: {
      '@type': 'ReserveAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteConfig.url}/empty-legs/${emptyLeg.id}`,
      },
    },
  }

  return <JsonLd data={data} />
}

// Service Schema - for Jet Sharing
interface JetSharingJsonLdProps {
  flight: {
    id: string
    from_city: string
    to_city: string
    departure_date: string
    departure_time?: string
    aircraft_type?: string
    price_per_seat?: number
    available_seats?: number
    image?: string
  }
}

export function JetSharingJsonLd({ flight }: JetSharingJsonLdProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `Jet Share: ${flight.from_city} to ${flight.to_city}`,
    description: `Share a private jet flight from ${flight.from_city} to ${flight.to_city}. ${flight.available_seats || ''} seats available on ${flight.aircraft_type || 'private jet'}.`,
    url: `${siteConfig.url}/jet-sharing/${flight.id}`,
    image: flight.image,
    serviceType: 'Jet Sharing',
    provider: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    areaServed: [
      { '@type': 'City', name: flight.from_city },
      { '@type': 'City', name: flight.to_city },
    ],
    ...(flight.price_per_seat && {
      offers: {
        '@type': 'Offer',
        price: flight.price_per_seat,
        priceCurrency: 'USD',
        availability: flight.available_seats && flight.available_seats > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/SoldOut',
        eligibleQuantity: {
          '@type': 'QuantitativeValue',
          value: flight.available_seats,
          unitText: 'seats',
        },
      },
    }),
  }

  return <JsonLd data={data} />
}

// Article Schema - for News
interface ArticleJsonLdProps {
  article: {
    slug: string
    title: string
    excerpt?: string
    content?: string
    image?: string
    author?: string
    published_date?: string
    category?: string
  }
}

export function ArticleJsonLd({ article }: ArticleJsonLdProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: article.image,
    url: `${siteConfig.url}/news/${article.slug}`,
    datePublished: article.published_date,
    dateModified: article.published_date,
    author: {
      '@type': 'Person',
      name: article.author || siteConfig.name,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteConfig.url}/news/${article.slug}`,
    },
    ...(article.category && {
      articleSection: article.category,
    }),
  }

  return <JsonLd data={data} />
}

// BreadcrumbList Schema
interface BreadcrumbItem {
  name: string
  url: string
}

interface BreadcrumbJsonLdProps {
  items: BreadcrumbItem[]
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${siteConfig.url}${item.url}`,
    })),
  }

  return <JsonLd data={data} />
}

// FAQ Schema
interface FAQItem {
  question: string
  answer: string
}

interface FAQJsonLdProps {
  items: FAQItem[]
}

export function FAQJsonLd({ items }: FAQJsonLdProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  return <JsonLd data={data} />
}

// Event Schema - for Events page
interface EventJsonLdProps {
  event: {
    id: string
    title: string
    description?: string
    date_from: string
    date_to?: string
    location: string
    image?: string
    price?: number
  }
}

export function EventJsonLd({ event }: EventJsonLdProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.description,
    image: event.image,
    url: `${siteConfig.url}/events`,
    startDate: event.date_from,
    endDate: event.date_to || event.date_from,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: event.location,
      address: {
        '@type': 'PostalAddress',
        name: event.location,
      },
    },
    organizer: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    ...(event.price && {
      offers: {
        '@type': 'Offer',
        price: event.price,
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        url: `${siteConfig.url}/events`,
      },
    }),
  }

  return <JsonLd data={data} />
}

// Place Schema - for Countries/Cities
interface PlaceJsonLdProps {
  place: {
    name: string
    description?: string
    image?: string
    url: string
    type?: 'Country' | 'City'
  }
}

export function PlaceJsonLd({ place }: PlaceJsonLdProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': place.type || 'Place',
    name: place.name,
    description: place.description || `Private jet charter services to ${place.name}`,
    image: place.image,
    url: place.url.startsWith('http') ? place.url : `${siteConfig.url}${place.url}`,
  }

  return <JsonLd data={data} />
}
