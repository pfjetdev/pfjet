import Image from 'next/image';
import { getSimpleGeolocation } from '@/lib/geolocation';
import { getContinentByCountryCode } from '@/lib/continents';
import { getTopRoutesWithImages, formatRoutePrice } from '@/lib/topRoutesGenerator';

export default async function TopRoutesSection() {
  // Get user's geolocation
  const geolocation = await getSimpleGeolocation();

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
            <div
              key={route.id}
              className="relative h-40 md:h-64 rounded-lg overflow-hidden group cursor-pointer active:scale-[0.98] md:hover:scale-[1.02] transition-transform duration-300"
            >
              {/* Background Image */}
              <Image
                src={route.image}
                alt={route.toCityFull}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300" />

              {/* Content */}
              <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4 text-white">
                <h3 className="text-sm md:text-lg font-semibold mb-0.5 md:mb-1 drop-shadow-lg" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                  {route.fromCity} → {route.toCity}
                </h3>
                <p className="text-base md:text-xl font-bold drop-shadow-lg" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                  {formatRoutePrice(route.price)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}