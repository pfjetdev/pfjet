import { Metadata } from 'next';
import SearchResultsClient from './SearchResultsClient';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase-client';
import airportsData from '@/data/airports-full.json';

export const metadata: Metadata = {
  title: 'Search Results - Find Your Perfect Private Jet',
  description: 'Browse available private jets for your route. Filter by category, range, and price.',
};

// Helper function to create a numeric seed from string
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// Seeded random generator for consistent "random" results
function createSeededRandom(seed: number) {
  let value = seed;
  return function() {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

// Helper function to extract city name from "City, CODE" format
function extractCityName(cityString: string): string {
  const commaIndex = cityString.indexOf(',');
  if (commaIndex > 0) {
    return cityString.substring(0, commaIndex).trim();
  }
  return cityString.trim();
}

// Helper function to find airport coordinates by city name
function findAirportByCity(cityName: string): { lat: number; lng: number } | null {
  const normalizedCity = cityName.toLowerCase().trim();

  // Search through airports
  for (const [code, airport] of Object.entries(airportsData)) {
    const airportCity = (airport as any).city?.toLowerCase().trim();
    if (airportCity === normalizedCity) {
      return {
        lat: (airport as any).lat,
        lng: (airport as any).lon
      };
    }
  }

  return null;
}

// Helper function to calculate distance between two airports (in nautical miles)
function calculateDistance(from: { lat: number; lng: number }, to: { lat: number; lng: number }): number {
  const R = 3440; // Earth's radius in nautical miles
  const lat1 = from.lat * Math.PI / 180;
  const lat2 = to.lat * Math.PI / 180;
  const deltaLat = (to.lat - from.lat) * Math.PI / 180;
  const deltaLng = (to.lng - from.lng) * Math.PI / 180;

  const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export default async function SearchResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string; date?: string; time?: string; passengers?: string; skipSearch?: string }>;
}) {
  // Get search parameters (await is required in Next.js 16+)
  const params = await searchParams;
  const from = params.from || 'London';
  const to = params.to || 'Amsterdam';
  const date = params.date || new Date().toISOString().split('T')[0];
  const time = params.time || '10:00';
  const passengers = parseInt(params.passengers || '1');
  const skipSearch = params.skipSearch === 'true';

  // Fetch all aircraft from database
  const { data: aircraft, error } = await supabase
    .from('aircraft')
    .select('*')
    .order('category', { ascending: true });

  if (error || !aircraft) {
    console.error('Error fetching aircraft:', error);
    return <div>Error loading aircraft</div>;
  }

  // Get airport coordinates from database
  const fromCity = extractCityName(from);
  const toCity = extractCityName(to);

  const fromCoords = findAirportByCity(fromCity);
  const toCoords = findAirportByCity(toCity);

  // If airports not found, use default London -> Amsterdam
  if (!fromCoords || !toCoords) {
    console.warn(`Airports not found: ${fromCity} or ${toCity}, using defaults`);
  }

  const finalFromCoords = fromCoords || { lat: 51.4700, lng: -0.4543 }; // London Heathrow
  const finalToCoords = toCoords || { lat: 52.3105, lng: 4.7683 }; // Amsterdam Schiphol
  const requiredDistance = calculateDistance(finalFromCoords, finalToCoords);

  // Filter aircraft by range (must be able to cover the distance)
  const allSuitableAircraft = aircraft.filter(jet => {
    // Extract range number from string like "1,550 nm"
    const rangeMatch = jet.range?.match(/[\d,]+/);
    if (!rangeMatch) return false;

    const jetRange = parseInt(rangeMatch[0].replace(/,/g, ''));
    return jetRange >= requiredDistance && parseInt(jet.passengers.match(/\d+/)?.[0] || '0') >= passengers;
  });

  // Create deterministic shuffle using seed based on route and today's date
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const seed = hashString(`${from}-${to}-${today}`);
  const random = createSeededRandom(seed);

  // Shuffle with seeded random for consistent results throughout the day
  const shuffled = [...allSuitableAircraft].sort(() => random() - 0.5);
  const suitableAircraft = shuffled.slice(0, 35);

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <main className="pt-6 px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          <SearchResultsClient
            initialAircraft={suitableAircraft}
            from={from}
            to={to}
            initialDate={date}
            initialTime={time}
            requiredDistance={requiredDistance}
            passengers={passengers}
            seed={seed}
            skipSearch={skipSearch}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
