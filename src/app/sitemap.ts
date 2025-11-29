import type { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase-client'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pfjet.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/aircraft`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/empty-legs`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/jet-sharing`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/countries`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/events`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/multi-city`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  // Dynamic pages - Aircraft
  const aircraftPages: MetadataRoute.Sitemap = []
  try {
    const { data: aircraft } = await supabase
      .from('aircraft')
      .select('slug, category_slug, updated_at')
      .order('name')

    if (aircraft) {
      for (const jet of aircraft) {
        // /jets/[slug] pages
        aircraftPages.push({
          url: `${baseUrl}/jets/${jet.slug}`,
          lastModified: jet.updated_at ? new Date(jet.updated_at) : new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
        })
        // /aircraft/[category]/[model] pages
        aircraftPages.push({
          url: `${baseUrl}/aircraft/${jet.category_slug}/${jet.slug}`,
          lastModified: jet.updated_at ? new Date(jet.updated_at) : new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
        })
      }
    }
  } catch (error) {
    console.error('Error fetching aircraft for sitemap:', error)
  }

  // Dynamic pages - Countries
  const countryPages: MetadataRoute.Sitemap = []
  try {
    const { data: countries } = await supabase
      .from('countries')
      .select('code')
      .order('name')

    if (countries) {
      for (const country of countries) {
        countryPages.push({
          url: `${baseUrl}/countries/${country.code}`,
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.7,
        })
      }
    }

    // Fetch cities for country/city pages
    const { data: cities } = await supabase
      .from('cities')
      .select('name, country_code')
      .order('name')

    if (cities) {
      for (const city of cities) {
        const citySlug = city.name.toLowerCase().replace(/\s+/g, '-')
        countryPages.push({
          url: `${baseUrl}/countries/${city.country_code}/${citySlug}`,
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.6,
        })
      }
    }
  } catch (error) {
    console.error('Error fetching countries for sitemap:', error)
  }

  // Dynamic pages - News
  const newsPages: MetadataRoute.Sitemap = []
  try {
    const { data: news } = await supabase
      .from('news')
      .select('slug, published_date')
      .eq('published', true)
      .order('published_date', { ascending: false })

    if (news) {
      for (const article of news) {
        newsPages.push({
          url: `${baseUrl}/news/${article.slug}`,
          lastModified: article.published_date ? new Date(article.published_date) : new Date(),
          changeFrequency: 'monthly',
          priority: 0.7,
        })
      }
    }
  } catch (error) {
    console.error('Error fetching news for sitemap:', error)
  }

  // Dynamic pages - Empty Legs
  const emptyLegsPages: MetadataRoute.Sitemap = []
  try {
    const { data: emptyLegs } = await supabase
      .from('empty_legs')
      .select('id, updated_at')
      .eq('is_active', true)
      .gte('departure_date', new Date().toISOString().split('T')[0])

    if (emptyLegs) {
      for (const leg of emptyLegs) {
        emptyLegsPages.push({
          url: `${baseUrl}/empty-legs/${leg.id}`,
          lastModified: leg.updated_at ? new Date(leg.updated_at) : new Date(),
          changeFrequency: 'daily',
          priority: 0.8,
        })
      }
    }
  } catch (error) {
    console.error('Error fetching empty legs for sitemap:', error)
  }

  // Dynamic pages - Jet Sharing
  const jetSharingPages: MetadataRoute.Sitemap = []
  try {
    const { data: jetSharing } = await supabase
      .from('jet_sharing')
      .select('id, updated_at')
      .eq('is_active', true)
      .gte('departure_date', new Date().toISOString().split('T')[0])

    if (jetSharing) {
      for (const share of jetSharing) {
        jetSharingPages.push({
          url: `${baseUrl}/jet-sharing/${share.id}`,
          lastModified: share.updated_at ? new Date(share.updated_at) : new Date(),
          changeFrequency: 'daily',
          priority: 0.8,
        })
      }
    }
  } catch (error) {
    console.error('Error fetching jet sharing for sitemap:', error)
  }

  return [
    ...staticPages,
    ...aircraftPages,
    ...countryPages,
    ...newsPages,
    ...emptyLegsPages,
    ...jetSharingPages,
  ]
}
