'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import type { Continent, Country } from './page';

const continents: Continent[] = ['Europe', 'Asia', 'North America', 'South America', 'Africa', 'Oceania'];

// Mapping for continent names from DestinationsSection to Countries page
const continentMapping: Record<string, Continent> = {
  'Europe': 'Europe',
  'Asia': 'Asia',
  'Americas': 'North America',
  'Africa': 'Africa',
  'Oceania': 'Oceania',
};

interface CountriesClientProps {
  countriesByContinent: Record<string, Country[]>;
}

// Helper function to group countries by first letter
function groupCountriesByLetter(countries: Country[]): Record<string, Country[]> {
  const grouped: Record<string, Country[]> = {};

  countries.forEach(country => {
    const firstLetter = country.name[0].toUpperCase();
    if (!grouped[firstLetter]) {
      grouped[firstLetter] = [];
    }
    grouped[firstLetter].push(country);
  });

  return grouped;
}

export default function CountriesClient({ countriesByContinent }: CountriesClientProps) {
  const searchParams = useSearchParams();
  const continentParam = searchParams.get('continent');

  // Get initial continent from URL or default to 'Europe'
  const getInitialContinent = (): Continent => {
    if (continentParam) {
      const mappedContinent = continentMapping[continentParam];
      if (mappedContinent) {
        return mappedContinent;
      }
      // Check if it's a valid continent name directly
      if (continents.includes(continentParam as Continent)) {
        return continentParam as Continent;
      }
    }
    return 'Europe';
  };

  const [selectedContinent, setSelectedContinent] = useState<Continent>(getInitialContinent());

  // Update selected continent when URL parameter changes
  useEffect(() => {
    const newContinent = getInitialContinent();
    setSelectedContinent(newContinent);
  }, [continentParam]);

  const countries = countriesByContinent[selectedContinent] || [];
  const groupedCountries = groupCountriesByLetter(countries);
  const letters = Object.keys(groupedCountries).sort();

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <main className="pt-6 px-4 pb-12">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Title */}
          <h1
            className="text-5xl font-medium text-foreground tracking-[2.4px]"
            style={{ fontFamily: 'Clash Display, sans-serif' }}
          >
            Countries
          </h1>

          {/* Continent Selector */}
          <div className="flex flex-wrap gap-3">
            {continents.map((continent) => (
              <button
                key={continent}
                onClick={() => setSelectedContinent(continent)}
                className={`
                  px-6 py-3 rounded-full font-medium transition-all duration-200
                  ${selectedContinent === continent
                    ? 'bg-foreground text-background shadow-lg'
                    : 'bg-card text-foreground border border-border hover:bg-accent hover:shadow-md'
                  }
                `}
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {continent}
              </button>
            ))}
          </div>

          {/* Countries Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {letters.map((letter) => (
              <div key={letter} className="space-y-3">
                {/* Letter Header */}
                <h2
                  className="text-lg font-medium text-foreground"
                  style={{ fontFamily: 'Clash Display, sans-serif' }}
                >
                  {letter}
                </h2>

                {/* Countries under this letter */}
                <div className="space-y-2">
                  {groupedCountries[letter].map((country: Country) => (
                    <a
                      key={country.code}
                      href={`/countries/${country.code}`}
                      className="w-full flex items-center justify-between px-4 py-3 bg-card border border-border rounded-xl hover:bg-accent hover:shadow-md transition-all duration-200 group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{country.flag}</span>
                        <span
                          className="text-sm font-medium text-foreground"
                          style={{ fontFamily: 'Montserrat, sans-serif' }}
                        >
                          {country.name}
                        </span>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" strokeWidth={2} />
                    </a>
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
