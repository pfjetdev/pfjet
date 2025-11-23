import { Continent } from '@/lib/continents';

export interface TopRoute {
  id: string;
  toCity: string;
  price: number;
}

/**
 * Default city for each continent (used when user's city is not available)
 */
export const defaultCityByContinent: Record<Continent, string> = {
  'Europe': 'London',
  'Asia': 'Dubai',
  'North America': 'New York',
  'South America': 'São Paulo',
  'Africa': 'Johannesburg',
  'Oceania': 'Sydney',
};

/**
 * Top 10 popular destinations for each continent
 * Prices are in USD (average from major cities in the continent)
 * The 'from' city will be dynamically set based on user's location
 */
export const topRoutesByContinent: Record<Continent, TopRoute[]> = {
  'Europe': [
    { id: 'eur-1', toCity: 'Paris', price: 8500 },
    { id: 'eur-2', toCity: 'Monaco', price: 7200 },
    { id: 'eur-3', toCity: 'Courchevel', price: 6800 },
    { id: 'eur-4', toCity: 'Ibiza', price: 9400 },
    { id: 'eur-5', toCity: 'Mykonos', price: 11200 },
    { id: 'eur-6', toCity: 'St. Moritz', price: 5900 },
    { id: 'eur-7', toCity: 'Sardinia', price: 7800 },
    { id: 'eur-8', toCity: 'Mallorca', price: 6200 },
    { id: 'eur-9', toCity: 'Dubai', price: 18500 },
    { id: 'eur-10', toCity: 'Salzburg', price: 4500 },
  ],

  'Asia': [
    { id: 'asia-1', toCity: 'Maldives', price: 15800 },
    { id: 'asia-2', toCity: 'Bali', price: 12400 },
    { id: 'asia-3', toCity: 'Tokyo', price: 16200 },
    { id: 'asia-4', toCity: 'Phuket', price: 8900 },
    { id: 'asia-5', toCity: 'Dubai', price: 13500 },
    { id: 'asia-6', toCity: 'Seoul', price: 14200 },
    { id: 'asia-7', toCity: 'Hong Kong', price: 11800 },
    { id: 'asia-8', toCity: 'Seychelles', price: 17600 },
    { id: 'asia-9', toCity: 'Singapore', price: 16400 },
    { id: 'asia-10', toCity: 'Doha', price: 9800 },
  ],

  'North America': [
    { id: 'na-1', toCity: 'Miami', price: 14500 },
    { id: 'na-2', toCity: 'Las Vegas', price: 8200 },
    { id: 'na-3', toCity: 'Bahamas', price: 12800 },
    { id: 'na-4', toCity: 'Los Angeles', price: 22500 },
    { id: 'na-5', toCity: 'New York', price: 11400 },
    { id: 'na-6', toCity: 'Cancun', price: 13900 },
    { id: 'na-7', toCity: 'Aspen', price: 15200 },
    { id: 'na-8', toCity: 'Chicago', price: 16800 },
    { id: 'na-9', toCity: 'Cabo San Lucas', price: 11700 },
    { id: 'na-10', toCity: 'Dallas', price: 12300 },
  ],

  'South America': [
    { id: 'sa-1', toCity: 'Rio de Janeiro', price: 8600 },
    { id: 'sa-2', toCity: 'Punta del Este', price: 9400 },
    { id: 'sa-3', toCity: 'Cusco', price: 7800 },
    { id: 'sa-4', toCity: 'Cartagena', price: 8200 },
    { id: 'sa-5', toCity: 'Mendoza', price: 6900 },
    { id: 'sa-6', toCity: 'Florianópolis', price: 7200 },
    { id: 'sa-7', toCity: 'Bariloche', price: 9800 },
    { id: 'sa-8', toCity: 'Miami', price: 24500 },
    { id: 'sa-9', toCity: 'Galápagos', price: 12400 },
    { id: 'sa-10', toCity: 'Aruba', price: 8900 },
  ],

  'Africa': [
    { id: 'af-1', toCity: 'Cape Town', price: 9200 },
    { id: 'af-2', toCity: 'Nairobi', price: 15800 },
    { id: 'af-3', toCity: 'Sharm El Sheikh', price: 6800 },
    { id: 'af-4', toCity: 'Zanzibar', price: 8400 },
    { id: 'af-5', toCity: 'Casablanca', price: 5600 },
    { id: 'af-6', toCity: 'Accra', price: 7200 },
    { id: 'af-7', toCity: 'Addis Ababa', price: 8900 },
    { id: 'af-8', toCity: 'Mauritius', price: 13500 },
    { id: 'af-9', toCity: 'Victoria Falls', price: 9800 },
    { id: 'af-10', toCity: 'Marrakech', price: 5400 },
  ],

  'Oceania': [
    { id: 'oc-1', toCity: 'Melbourne', price: 8900 },
    { id: 'oc-2', toCity: 'Queenstown', price: 7600 },
    { id: 'oc-3', toCity: 'Bali', price: 12400 },
    { id: 'oc-4', toCity: 'Gold Coast', price: 4800 },
    { id: 'oc-5', toCity: 'Fiji', price: 15200 },
    { id: 'oc-6', toCity: 'Tasmania', price: 6900 },
    { id: 'oc-7', toCity: 'Auckland', price: 14500 },
    { id: 'oc-8', toCity: 'Great Barrier Reef', price: 5400 },
    { id: 'oc-9', toCity: 'Singapore', price: 16800 },
    { id: 'oc-10', toCity: 'Wellington', price: 5800 },
  ],
};

/**
 * Get top routes for a specific continent
 */
export function getTopRoutesForContinent(continent: Continent): TopRoute[] {
  return topRoutesByContinent[continent] || topRoutesByContinent['Europe'];
}
