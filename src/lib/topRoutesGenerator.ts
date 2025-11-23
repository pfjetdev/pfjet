import { supabase } from './supabase';
import { TopRoute, getTopRoutesForContinent, defaultCityByContinent } from '@/data/topRoutes';
import { Continent } from './continents';

export interface TopRouteWithImage extends TopRoute {
  fromCity: string;
  image: string;
  fromCityFull: string;
  toCityFull: string;
}

/**
 * Get city image from Supabase
 */
async function getCityImage(cityName: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('cities')
      .select('image')
      .ilike('name', cityName)
      .limit(1)
      .single();

    if (error || !data) {
      console.warn(`No image found for city: ${cityName}`);
      return null;
    }

    return data.image;
  } catch (error) {
    console.error(`Error fetching image for ${cityName}:`, error);
    return null;
  }
}

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

  // Get all unique city names for batch fetching
  const cityNames = new Set<string>();
  routes.forEach(route => {
    cityNames.add(route.toCity);
  });
  // Add the fromCity to fetch its image if needed
  cityNames.add(fromCity);

  // Fetch all city images in one query for better performance
  const { data: citiesData, error } = await supabase
    .from('cities')
    .select('name, image')
    .in('name', Array.from(cityNames));

  if (error) {
    console.error('Error fetching city images:', error);
  }

  // Create a map of city names to images
  const cityImageMap = new Map<string, string>();
  citiesData?.forEach(city => {
    if (city.image) {
      cityImageMap.set(city.name.toLowerCase(), city.image);
    }
  });

  // Map routes with images
  const routesWithImages = await Promise.all(
    routes.map(async (route) => {
      const toCity = route.toCity;

      // Get image for destination city (priority)
      let image = cityImageMap.get(toCity.toLowerCase());

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
    })
  );

  return routesWithImages;
}

/**
 * Format price for display
 */
export function formatRoutePrice(price: number): string {
  return `from $ ${price.toLocaleString()}`;
}
