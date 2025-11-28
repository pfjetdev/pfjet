import { supabase } from './supabase';
import { TopRoute, getTopRoutesForContinent, defaultCityByContinent } from '@/data/topRoutes';
import { Continent } from './continents';
import { unstable_cache } from 'next/cache';

export interface TopRouteWithImage extends TopRoute {
  fromCity: string;
  image: string;
  fromCityFull: string;
  toCityFull: string;
}

/**
 * Fetch all city images from Supabase (cached)
 */
async function fetchAllCityImagesInner(): Promise<Record<string, string>> {
  try {
    const { data, error } = await supabase
      .from('cities')
      .select('name, image')
      .not('image', 'is', null);

    if (error || !data) {
      console.warn('Error fetching city images');
      return {};
    }

    const imageMap: Record<string, string> = {};
    data.forEach(city => {
      if (city.image) {
        imageMap[city.name.toLowerCase()] = city.image;
      }
    });

    return imageMap;
  } catch (error) {
    console.error('Error fetching city images:', error);
    return {};
  }
}

// Cached version - revalidates every hour
const fetchAllCityImages = unstable_cache(
  fetchAllCityImagesInner,
  ['top-routes-city-images'],
  { revalidate: 3600 }
);

/**
 * Get top routes with images for a continent
 * @param continent - The continent to get routes for
 * @param userCity - Optional user city to use as 'from' city (from IP geolocation)
 * @returns Array of routes with images
 */
export async function getTopRoutesWithImages(
  continent: Continent,
  userCity?: string
): Promise<TopRouteWithImage[]> {
  const routes = getTopRoutesForContinent(continent);

  // Determine the 'from' city: use user's city from geolocation, or default for continent
  const fromCity = userCity || defaultCityByContinent[continent];

  // Fetch all city images (cached)
  const cityImageMap = await fetchAllCityImages();

  // Map routes with images
  const routesWithImages = routes.map((route) => {
    const toCity = route.toCity;

    // Get image for destination city (priority)
    let image = cityImageMap[toCity.toLowerCase()];

    // Fallback to a default image if no city image found
    if (!image) {
      image = '/day.jpg'; // Default fallback image
    }

    return {
      ...route,
      fromCity,
      fromCityFull: fromCity,
      toCityFull: toCity,
      image
    };
  });

  return routesWithImages;
}

/**
 * Format price for display
 */
export function formatRoutePrice(price: number): string {
  return `from $ ${price.toLocaleString()}`;
}
