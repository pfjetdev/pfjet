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
