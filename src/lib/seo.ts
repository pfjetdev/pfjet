import type { Metadata } from 'next'

// Base URL for the site
export const siteConfig = {
  name: 'PF Jet',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://pfjet.com',
  ogImage: '/og-image.jpg',
  description: 'Book private jet flights worldwide. Empty legs, jet sharing, and luxury charter services.',
  keywords: [
    'private jet',
    'charter flight',
    'empty legs',
    'jet sharing',
    'luxury travel',
    'private aviation',
    'business jet',
    'VIP flight',
    'aircraft charter',
    'executive travel',
  ],
  authors: [{ name: 'PF Jet', url: 'https://pfjet.com' }],
  creator: 'PF Jet',
  publisher: 'PF Jet',
  locale: 'en_US',
  type: 'website' as const,
  twitterHandle: '@pfjet',

  // Contact info for structured data
  contact: {
    email: 'info@pfjet.com',
    phone: '+1-800-PF-JET',
    address: {
      streetAddress: '',
      addressLocality: '',
      addressRegion: '',
      postalCode: '',
      addressCountry: 'US',
    },
  },
}

// Default metadata for the entire site
export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} - Private Jet Charter`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: siteConfig.authors,
  creator: siteConfig.creator,
  publisher: siteConfig.publisher,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: siteConfig.type,
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} - Private Jet Charter`,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - Private Jet Charter`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} - Private Jet Charter`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: siteConfig.twitterHandle,
    site: siteConfig.twitterHandle,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: siteConfig.url,
  },
  verification: {
    // Add your verification codes here
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
}

// Helper to create page-specific metadata
interface CreateMetadataOptions {
  title: string
  description: string
  path?: string
  image?: string
  imageAlt?: string
  type?: 'website' | 'article'
  noIndex?: boolean
  keywords?: string[]
  publishedTime?: string
  modifiedTime?: string
  authors?: string[]
}

export function createMetadata({
  title,
  description,
  path = '',
  image,
  imageAlt,
  type = 'website',
  noIndex = false,
  keywords = [],
  publishedTime,
  modifiedTime,
  authors,
}: CreateMetadataOptions): Metadata {
  const url = `${siteConfig.url}${path}`
  const ogImage = image || siteConfig.ogImage
  const ogImageAlt = imageAlt || title

  const metadata: Metadata = {
    title,
    description,
    keywords: [...siteConfig.keywords, ...keywords],
    alternates: {
      canonical: url,
    },
    openGraph: {
      type,
      url,
      title,
      description,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: ogImageAlt,
        },
      ],
      ...(type === 'article' && {
        publishedTime,
        modifiedTime,
        authors,
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
      creator: siteConfig.twitterHandle,
      site: siteConfig.twitterHandle,
    },
  }

  if (noIndex) {
    metadata.robots = {
      index: false,
      follow: false,
    }
  }

  return metadata
}

// Metadata for specific page types
export const pageMetadata = {
  home: createMetadata({
    title: 'Private Jet Charter - Book Luxury Flights Worldwide',
    description: 'Book private jet flights worldwide with PF Jet. Access empty legs deals, jet sharing options, and premium charter services. Experience luxury travel.',
    path: '',
    keywords: ['book private jet', 'luxury flight booking', 'worldwide charter'],
  }),

  aircraft: createMetadata({
    title: 'Private Jets Fleet - Aircraft Categories & Models',
    description: 'Explore our private jet fleet. From light jets to heavy long-range aircraft. Find the perfect jet for your journey with detailed specifications.',
    path: '/aircraft',
    keywords: ['private jet fleet', 'aircraft models', 'jet categories', 'light jet', 'midsize jet', 'heavy jet'],
  }),

  emptyLegs: createMetadata({
    title: 'Empty Leg Flights - Discounted Private Jet Deals',
    description: 'Save up to 75% on private jet travel with empty leg flights. Browse available empty legs and book discounted luxury flights today.',
    path: '/empty-legs',
    keywords: ['empty leg flights', 'discounted private jet', 'cheap charter flights', 'one-way deals'],
  }),

  jetSharing: createMetadata({
    title: 'Jet Sharing - Share Private Flights & Split Costs',
    description: 'Share private jet flights and split costs with other travelers. Book seats on scheduled private flights at a fraction of charter prices.',
    path: '/jet-sharing',
    keywords: ['jet sharing', 'shared private flights', 'split flight costs', 'affordable private jet'],
  }),

  countries: createMetadata({
    title: 'Destinations - Private Jet Travel Worldwide',
    description: 'Discover private jet destinations worldwide. Browse countries and cities for your next luxury flight experience.',
    path: '/countries',
    keywords: ['private jet destinations', 'luxury travel locations', 'international charter'],
  }),

  news: createMetadata({
    title: 'Aviation News & Insights',
    description: 'Stay updated with the latest private aviation news, industry insights, and travel tips from PF Jet experts.',
    path: '/news',
    keywords: ['aviation news', 'private jet news', 'travel insights', 'industry updates'],
  }),

  events: createMetadata({
    title: 'Exclusive Events - VIP Travel Experiences',
    description: 'Discover exclusive events and VIP travel experiences. Book private jet packages for sports, entertainment, and luxury events.',
    path: '/events',
    keywords: ['VIP events', 'luxury travel experiences', 'private jet events', 'exclusive packages'],
  }),

  contact: createMetadata({
    title: 'Contact Us - Get in Touch',
    description: 'Contact PF Jet for private jet charter inquiries, quotes, and support. Our team is available 24/7 to assist with your travel needs.',
    path: '/contact',
    keywords: ['contact', 'private jet inquiry', 'charter quote', 'support'],
  }),

  multiCity: createMetadata({
    title: 'Multi-City Charter - Plan Complex Itineraries',
    description: 'Plan multi-city private jet itineraries. Book complex routes with multiple stops and optimize your business or leisure travel.',
    path: '/multi-city',
    keywords: ['multi-city charter', 'multiple destinations', 'complex itinerary', 'route planning'],
  }),
}

// Helper to create dynamic aircraft metadata
export function createAircraftMetadata(aircraft: {
  name: string
  slug: string
  category: string
  category_slug: string
  description?: string
  passengers?: string
  range?: string
  speed?: string
  image?: string
}): Metadata {
  const title = `${aircraft.name} - ${aircraft.category} Private Jet Charter`
  const description = aircraft.description
    || `Charter the ${aircraft.name}, a ${aircraft.category.toLowerCase()} jet. ${aircraft.passengers || ''} passengers, ${aircraft.range || ''} range, ${aircraft.speed || ''} cruise speed. Book now for your next flight.`

  return createMetadata({
    title,
    description: description.slice(0, 160),
    path: `/jets/${aircraft.slug}`,
    image: aircraft.image,
    imageAlt: `${aircraft.name} Private Jet`,
    keywords: [
      aircraft.name,
      aircraft.category,
      `${aircraft.category} jet`,
      'charter',
      'private jet rental',
    ],
  })
}

// Helper to create dynamic country metadata
export function createCountryMetadata(country: {
  code: string
  name: string
  description?: string
  image?: string
}): Metadata {
  const title = `Private Jet Charter to ${country.name}`
  const description = country.description
    || `Book private jet flights to ${country.name}. Explore airports, popular routes, and charter options for luxury travel to ${country.name}.`

  return createMetadata({
    title,
    description: description.slice(0, 160),
    path: `/countries/${country.code}`,
    image: country.image,
    imageAlt: `Private Jet to ${country.name}`,
    keywords: [
      `private jet ${country.name}`,
      `charter flight ${country.name}`,
      `luxury travel ${country.name}`,
    ],
  })
}

// Helper to create dynamic city metadata
export function createCityMetadata(city: {
  name: string
  country_code: string
  country_name: string
  description?: string
  image?: string
}): Metadata {
  const title = `Private Jet Charter to ${city.name}, ${city.country_name}`
  const description = city.description
    || `Fly private to ${city.name}, ${city.country_name}. Book charter flights, explore airports, and plan your luxury travel experience.`

  return createMetadata({
    title,
    description: description.slice(0, 160),
    path: `/countries/${city.country_code}/${city.name.toLowerCase().replace(/\s+/g, '-')}`,
    image: city.image,
    imageAlt: `Private Jet to ${city.name}`,
    keywords: [
      `private jet ${city.name}`,
      `charter flight ${city.name}`,
      `${city.name} airport`,
    ],
  })
}

// Helper to create news article metadata
export function createNewsMetadata(article: {
  slug: string
  title: string
  excerpt?: string
  image?: string
  author?: string
  published_date?: string
  category?: string
}): Metadata {
  return createMetadata({
    title: article.title,
    description: article.excerpt || `Read about ${article.title} on PF Jet aviation news.`,
    path: `/news/${article.slug}`,
    image: article.image,
    imageAlt: article.title,
    type: 'article',
    publishedTime: article.published_date,
    authors: article.author ? [article.author] : undefined,
    keywords: [
      article.category || 'aviation',
      'news',
      'private jet news',
    ],
  })
}

// Helper to create empty leg metadata
export function createEmptyLegMetadata(emptyLeg: {
  id: string
  from_city: string
  to_city: string
  departure_date: string
  aircraft_type?: string
  price?: number
  image?: string
}): Metadata {
  const title = `Empty Leg: ${emptyLeg.from_city} to ${emptyLeg.to_city}`
  const priceText = emptyLeg.price ? ` from $${emptyLeg.price.toLocaleString()}` : ''
  const description = `Book this empty leg flight from ${emptyLeg.from_city} to ${emptyLeg.to_city} on ${new Date(emptyLeg.departure_date).toLocaleDateString()}${priceText}. ${emptyLeg.aircraft_type || 'Private jet'} available.`

  return createMetadata({
    title,
    description,
    path: `/empty-legs/${emptyLeg.id}`,
    image: emptyLeg.image,
    keywords: [
      'empty leg',
      emptyLeg.from_city,
      emptyLeg.to_city,
      'discounted flight',
    ],
  })
}

// Helper to create jet sharing metadata
export function createJetSharingMetadata(flight: {
  id: string
  from_city: string
  to_city: string
  departure_date: string
  aircraft_type?: string
  price_per_seat?: number
  available_seats?: number
  image?: string
}): Metadata {
  const title = `Jet Share: ${flight.from_city} to ${flight.to_city}`
  const priceText = flight.price_per_seat ? ` from $${flight.price_per_seat.toLocaleString()}/seat` : ''
  const seatsText = flight.available_seats ? ` ${flight.available_seats} seats available.` : ''
  const description = `Share a private flight from ${flight.from_city} to ${flight.to_city} on ${new Date(flight.departure_date).toLocaleDateString()}${priceText}.${seatsText}`

  return createMetadata({
    title,
    description,
    path: `/jet-sharing/${flight.id}`,
    image: flight.image,
    keywords: [
      'jet sharing',
      flight.from_city,
      flight.to_city,
      'shared flight',
    ],
  })
}
