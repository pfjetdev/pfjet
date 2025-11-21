import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { getAllCountries } from '@/lib/data';
import CountriesClient from './CountriesClient';
import Footer from '@/components/Footer';

export type Continent = 'Europe' | 'Asia' | 'North America' | 'South America' | 'Africa' | 'Oceania';

export interface Country {
  name: string;
  flag: string;
  code: string;
  continent: string;
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <main className="pt-6 px-4 pb-12">
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <Skeleton className="h-14 w-96 mb-2" />
            <Skeleton className="h-5 w-[600px]" />
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-full" />
            ))}
          </div>
          <div className="space-y-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-6 w-8" />
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <Skeleton key={j} className="h-12 w-full rounded-lg" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

async function CountriesContent() {
  const countries = await getAllCountries();

  // Group countries by continent
  const countriesByContinent: Record<string, Country[]> = {};
  countries.forEach((country) => {
    if (!countriesByContinent[country.continent]) {
      countriesByContinent[country.continent] = [];
    }
    countriesByContinent[country.continent].push(country);
  });

  return (
    <>
      <CountriesClient countriesByContinent={countriesByContinent} />
      <Footer />
    </>
  );
}

export default function CountriesPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <CountriesContent />
    </Suspense>
  );
}
