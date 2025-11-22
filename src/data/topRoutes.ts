import { Continent } from '@/lib/continents';

export interface TopRoute {
  id: string;
  fromCity: string;
  toCity: string;
  price: number;
}

/**
 * Top 10 popular routes for each continent
 * Prices are in USD
 */
export const topRoutesByContinent: Record<Continent, TopRoute[]> = {
  'Europe': [
    { id: 'eur-1', fromCity: 'London', toCity: 'Paris', price: 8500 },
    { id: 'eur-2', fromCity: 'Paris', toCity: 'Monaco', price: 7200 },
    { id: 'eur-3', fromCity: 'Geneva', toCity: 'Courchevel', price: 6800 },
    { id: 'eur-4', fromCity: 'Nice', toCity: 'Ibiza', price: 9400 },
    { id: 'eur-5', fromCity: 'Milan', toCity: 'Mykonos', price: 11200 },
    { id: 'eur-6', fromCity: 'Zurich', toCity: 'St. Moritz', price: 5900 },
    { id: 'eur-7', fromCity: 'Rome', toCity: 'Sardinia', price: 7800 },
    { id: 'eur-8', fromCity: 'Barcelona', toCity: 'Mallorca', price: 6200 },
    { id: 'eur-9', fromCity: 'Moscow', toCity: 'Dubai', price: 18500 },
    { id: 'eur-10', fromCity: 'Vienna', toCity: 'Salzburg', price: 4500 },
  ],

  'Asia': [
    { id: 'asia-1', fromCity: 'Dubai', toCity: 'Maldives', price: 15800 },
    { id: 'asia-2', fromCity: 'Singapore', toCity: 'Bali', price: 12400 },
    { id: 'asia-3', fromCity: 'Hong Kong', toCity: 'Tokyo', price: 16200 },
    { id: 'asia-4', fromCity: 'Bangkok', toCity: 'Phuket', price: 8900 },
    { id: 'asia-5', fromCity: 'Mumbai', toCity: 'Dubai', price: 13500 },
    { id: 'asia-6', fromCity: 'Tokyo', toCity: 'Seoul', price: 14200 },
    { id: 'asia-7', fromCity: 'Shanghai', toCity: 'Hong Kong', price: 11800 },
    { id: 'asia-8', fromCity: 'Dubai', toCity: 'Seychelles', price: 17600 },
    { id: 'asia-9', fromCity: 'Singapore', toCity: 'Maldives', price: 16400 },
    { id: 'asia-10', fromCity: 'Doha', toCity: 'Dubai', price: 9800 },
  ],

  'North America': [
    { id: 'na-1', fromCity: 'New York', toCity: 'Miami', price: 14500 },
    { id: 'na-2', fromCity: 'Los Angeles', toCity: 'Las Vegas', price: 8200 },
    { id: 'na-3', fromCity: 'Miami', toCity: 'Bahamas', price: 12800 },
    { id: 'na-4', fromCity: 'New York', toCity: 'Los Angeles', price: 22500 },
    { id: 'na-5', fromCity: 'Toronto', toCity: 'New York', price: 11400 },
    { id: 'na-6', fromCity: 'Houston', toCity: 'Cancun', price: 13900 },
    { id: 'na-7', fromCity: 'San Francisco', toCity: 'Aspen', price: 15200 },
    { id: 'na-8', fromCity: 'Chicago', toCity: 'Miami', price: 16800 },
    { id: 'na-9', fromCity: 'Los Angeles', toCity: 'Cabo San Lucas', price: 11700 },
    { id: 'na-10', fromCity: 'Dallas', toCity: 'Las Vegas', price: 12300 },
  ],

  'South America': [
    { id: 'sa-1', fromCity: 'São Paulo', toCity: 'Rio de Janeiro', price: 8600 },
    { id: 'sa-2', fromCity: 'Buenos Aires', toCity: 'Punta del Este', price: 9400 },
    { id: 'sa-3', fromCity: 'Lima', toCity: 'Cusco', price: 7800 },
    { id: 'sa-4', fromCity: 'Bogotá', toCity: 'Cartagena', price: 8200 },
    { id: 'sa-5', fromCity: 'Santiago', toCity: 'Mendoza', price: 6900 },
    { id: 'sa-6', fromCity: 'Rio de Janeiro', toCity: 'Florianópolis', price: 7200 },
    { id: 'sa-7', fromCity: 'Buenos Aires', toCity: 'Bariloche', price: 9800 },
    { id: 'sa-8', fromCity: 'São Paulo', toCity: 'Miami', price: 24500 },
    { id: 'sa-9', fromCity: 'Quito', toCity: 'Galápagos', price: 12400 },
    { id: 'sa-10', fromCity: 'Caracas', toCity: 'Aruba', price: 8900 },
  ],

  'Africa': [
    { id: 'af-1', fromCity: 'Johannesburg', toCity: 'Cape Town', price: 9200 },
    { id: 'af-2', fromCity: 'Dubai', toCity: 'Nairobi', price: 15800 },
    { id: 'af-3', fromCity: 'Cairo', toCity: 'Sharm El Sheikh', price: 6800 },
    { id: 'af-4', fromCity: 'Nairobi', toCity: 'Zanzibar', price: 8400 },
    { id: 'af-5', fromCity: 'Marrakech', toCity: 'Casablanca', price: 5600 },
    { id: 'af-6', fromCity: 'Lagos', toCity: 'Accra', price: 7200 },
    { id: 'af-7', fromCity: 'Addis Ababa', toCity: 'Nairobi', price: 8900 },
    { id: 'af-8', fromCity: 'Cape Town', toCity: 'Mauritius', price: 13500 },
    { id: 'af-9', fromCity: 'Johannesburg', toCity: 'Victoria Falls', price: 9800 },
    { id: 'af-10', fromCity: 'Casablanca', toCity: 'Marrakech', price: 5400 },
  ],

  'Oceania': [
    { id: 'oc-1', fromCity: 'Sydney', toCity: 'Melbourne', price: 8900 },
    { id: 'oc-2', fromCity: 'Auckland', toCity: 'Queenstown', price: 7600 },
    { id: 'oc-3', fromCity: 'Perth', toCity: 'Bali', price: 12400 },
    { id: 'oc-4', fromCity: 'Brisbane', toCity: 'Gold Coast', price: 4800 },
    { id: 'oc-5', fromCity: 'Sydney', toCity: 'Fiji', price: 15200 },
    { id: 'oc-6', fromCity: 'Melbourne', toCity: 'Tasmania', price: 6900 },
    { id: 'oc-7', fromCity: 'Auckland', toCity: 'Sydney', price: 14500 },
    { id: 'oc-8', fromCity: 'Cairns', toCity: 'Great Barrier Reef', price: 5400 },
    { id: 'oc-9', fromCity: 'Sydney', toCity: 'Bali', price: 16800 },
    { id: 'oc-10', fromCity: 'Wellington', toCity: 'Auckland', price: 5800 },
  ],
};

/**
 * Get top routes for a specific continent
 */
export function getTopRoutesForContinent(continent: Continent): TopRoute[] {
  return topRoutesByContinent[continent] || topRoutesByContinent['Europe'];
}
