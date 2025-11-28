import { headers } from 'next/headers';
import { getSimpleGeolocation, getClientIP } from '@/lib/geolocation';
import { getContinentByCountryCode } from '@/lib/continents';
import { getTopRoutesWithImages } from '@/lib/topRoutesGenerator';
import TopRouteCard from './TopRouteCard';

export default async function TopRoutesSection() {
  // Get real client IP from headers (important for Vercel/CDN)
  const headersList = await headers();
  const clientIP = getClientIP(headersList);

  // Debug: log IP detection
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 Client IP detected:', clientIP);
  }

  // Get user's geolocation using real client IP
  const geolocation = await getSimpleGeolocation(clientIP || undefined);

  // Debug: log geolocation result
  if (process.env.NODE_ENV === 'development') {
    console.log('🌍 Geolocation:', geolocation);
  }

  // Determine continent (default to Europe if geolocation fails)
  const continent = geolocation
    ? getContinentByCountryCode(geolocation.countryCode)
    : 'Europe';

  // Get top routes for the user's continent with images from Supabase
  const routes = await getTopRoutesWithImages(continent, geolocation?.city);

  return (
    <section className="py-8 md:py-16 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4 md:mb-12">
          <h2 className="text-3xl md:text-6xl font-medium text-foreground" style={{ fontFamily: 'Clash Display, sans-serif' }}>
            Top Routes {geolocation && (
              <span className="text-lg md:text-2xl text-muted-foreground ml-2">
                from {geolocation.city}
              </span>
            )}
          </h2>
        </div>

        {/* Routes Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-6">
          {routes.map((route) => (
            <TopRouteCard
              key={route.id}
              id={route.id}
              fromCity={route.fromCity}
              toCity={route.toCity}
              price={route.price}
              image={route.image}
            />
          ))}
        </div>
      </div>
    </section>
  );
}