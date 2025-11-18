'use client';

import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import Footer from '@/components/Footer';
import { countriesByContinent, groupCountriesByLetter, type Continent, type Country } from '@/data/countries';

const continents: Continent[] = ['Europe', 'Asia', 'North America', 'South America', 'Africa', 'Oceania'];

export default function CountriesPage() {
  const [selectedContinent, setSelectedContinent] = useState<Continent>('Europe');

  const countries = countriesByContinent[selectedContinent];
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
                    <button
                      key={country.code}
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
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
