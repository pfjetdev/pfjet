'use client';

import { useEffect, useState } from 'react';
import TopRouteCard from './TopRouteCard';

interface TopRoute {
  id: string;
  fromCity: string;
  toCity: string;
  price: number;
  image: string;
}

interface GeolocationResult {
  city: string;
  countryCode: string;
}

export default function TopRoutesSection() {
  const [routes, setRoutes] = useState<TopRoute[]>([]);
  const [userCity, setUserCity] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch routes from API (geolocation is handled server-side based on request IP)
        const response = await fetch('/api/top-routes');
        const data = await response.json();

        if (data.routes) {
          setRoutes(data.routes);
        }
        if (data.userCity) {
          setUserCity(data.userCity);
        }
      } catch (error) {
        console.error('Error fetching top routes:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <section id="top-routes" className="py-8 md:py-16 px-4 bg-background scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4 md:mb-12">
          <h2 className="text-3xl md:text-6xl font-medium text-foreground" style={{ fontFamily: 'Clash Display, sans-serif' }}>
            Top Routes {userCity && (
              <span className="text-lg md:text-2xl text-muted-foreground ml-2">
                from {userCity}
              </span>
            )}
          </h2>
        </div>

        {/* Routes Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-6">
          {loading ? (
            // Skeleton loading
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] rounded-xl bg-muted animate-pulse" />
            ))
          ) : (
            routes.map((route) => (
              <TopRouteCard
                key={route.id}
                id={route.id}
                fromCity={route.fromCity}
                toCity={route.toCity}
                price={route.price}
                image={route.image}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
