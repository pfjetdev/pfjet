import { cache } from 'react'
import 'server-only'
import { supabase } from './supabase'

// Кешированная функция для получения страны
export const getCountry = cache(async (countryCode: string) => {
  const { data, error } = await supabase
    .from('countries')
    .select('code, name, flag, image, description, continent')
    .eq('code', countryCode)
    .single()

  if (error) throw error
  return data
})

// Кешированная функция для получения городов страны
export const getCountryCities = cache(async (countryCode: string) => {
  const { data, error } = await supabase
    .from('cities')
    .select('id, name, image, description, is_capital, country_code')
    .eq('country_code', countryCode)
    .order('is_capital', { ascending: false })
    .order('name')

  if (error) throw error
  return data || []
})

// Кешированная функция для получения города
export const getCity = cache(async (countryCode: string, cityName: string) => {
  const { data, error } = await supabase
    .from('cities')
    .select('id, name, image, description, is_capital, country_code')
    .eq('country_code', countryCode)
    .ilike('name', cityName)
    .single()

  if (error) throw error
  return data
})

// Preload функции для prefetching
export const preloadCountry = (countryCode: string) => {
  void getCountry(countryCode)
}

export const preloadCountryCities = (countryCode: string) => {
  void getCountryCities(countryCode)
}

export const preloadCity = (countryCode: string, cityName: string) => {
  void getCity(countryCode, cityName)
}

// Кешированная функция для получения стран по континенту
export const getCountriesByContinent = cache(async (continent: string) => {
  const { data, error } = await supabase
    .from('countries')
    .select('code, name, flag')
    .eq('continent', continent)
    .order('name')

  if (error) throw error
  return data || []
})

// Кешированная функция для получения топ городов по континенту
export const getTopCitiesByContinent = cache(async (continent: string, limit: number = 5) => {
  const { data, error } = await supabase
    .from('cities')
    .select(`
      id,
      name,
      image,
      country_code,
      countries!inner (
        name,
        continent,
        code
      )
    `)
    .eq('countries.continent', continent)
    .not('image', 'is', null)
    .limit(limit)

  if (error) throw error
  return data || []
})

// Кешированная функция для получения всех стран
export const getAllCountries = cache(async () => {
  const { data, error } = await supabase
    .from('countries')
    .select('code, name, flag, continent')
    .order('name')

  if (error) throw error
  return data || []
})

// News functions

// Кешированная функция для получения всех опубликованных новостей
export const getAllNews = cache(async (limit?: number) => {
  const query = supabase
    .from('news')
    .select('id, slug, title, excerpt, image, category, author, published_date, read_time')
    .eq('published', true)
    .order('published_date', { ascending: false })

  if (limit) {
    query.limit(limit)
  }

  const { data, error } = await query

  if (error) throw error
  return data || []
})

// Кешированная функция для получения новостей по категории
export const getNewsByCategory = cache(async (category: string, limit?: number) => {
  const query = supabase
    .from('news')
    .select('id, slug, title, excerpt, image, category, author, published_date, read_time')
    .eq('published', true)
    .eq('category', category)
    .order('published_date', { ascending: false })

  if (limit) {
    query.limit(limit)
  }

  const { data, error } = await query

  if (error) throw error
  return data || []
})

// Кешированная функция для получения отдельной новости
export const getNewsBySlug = cache(async (slug: string) => {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (error) throw error
  return data
})

// Кешированная функция для получения последних новостей
export const getLatestNews = cache(async (limit: number = 3) => {
  const { data, error } = await supabase
    .from('news')
    .select('id, slug, title, excerpt, image, category, author, published_date, read_time')
    .eq('published', true)
    .order('published_date', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data || []
})

// Кешированная функция для получения всех категорий новостей
export const getNewsCategories = cache(async () => {
  const { data, error } = await supabase
    .from('news')
    .select('category')
    .eq('published', true)

  if (error) throw error

  // Get unique categories
  const categories = [...new Set(data?.map(item => item.category) || [])]
  return categories
})

// Preload функции для новостей
export const preloadAllNews = () => {
  void getAllNews()
}

export const preloadNewsBySlug = (slug: string) => {
  void getNewsBySlug(slug)
}

export const preloadLatestNews = (limit?: number) => {
  void getLatestNews(limit)
}
