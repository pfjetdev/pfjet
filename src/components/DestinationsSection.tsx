"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronDown, MoveRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { supabase } from "@/lib/supabase";

interface Country {
  code: string;
  name: string;
  flag: string;
}

interface CityFromDB {
  id: string;
  name: string;
  image: string;
  country_code: string;
  countries: {
    name: string;
    continent: string;
    code: string;
  }[];
}

interface City {
  id: string;
  name: string;
  image: string;
  country_code: string;
  country_name: string;
}

const displayContinents = ['Europe', 'Asia', 'North America', 'South America', 'Africa', 'Oceania'];

export default function DestinationsSection() {
  const router = useRouter();
  const [selectedContinent, setSelectedContinent] = useState<string>('Europe');
  const [countries, setCountries] = useState<Country[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        // Load countries for selected continent
        const { data: countriesData, error: countriesError } = await supabase
          .from('countries')
          .select('code, name, flag')
          .eq('continent', selectedContinent)
          .order('name');

        if (countriesError) throw countriesError;

        // Load top cities for selected continent
        const { data: citiesData, error: citiesError } = await supabase
          .from('cities')
          .select(`
            id,
            name,
            image,
            country_code,
            countries!inner (
              name,
              continent,
              code
            )
          `)
          .eq('countries.continent', selectedContinent)
          .not('image', 'is', null)
          .limit(15);

        if (citiesError) throw citiesError;

        // Transform cities data
        const transformedCities: City[] = (citiesData || []).map((city: CityFromDB) => ({
          id: city.id,
          name: city.name,
          image: city.image,
          country_code: city.country_code,
          country_name: city.countries[0]?.name || '',
        }));

        setCountries(countriesData || []);
        setCities(transformedCities);
      } catch (error) {
        console.error('Error loading destinations:', error);
        setCountries([]);
        setCities([]);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [selectedContinent]);

  const handleViewAll = () => {
    router.push(`/countries?continent=${selectedContinent}`);
  };

  if (loading) {
    return (
      <section className="py-8 md:py-16 pl-4 pr-0 bg-background">
        <div className="max-w-7xl mx-auto pr-0">
          <div className="flex items-center justify-between mb-4 md:mb-12">
            <h2 className="text-3xl md:text-6xl font-medium text-foreground" style={{ fontFamily: 'Clash Display, sans-serif' }}>
              {selectedContinent}
            </h2>
          </div>
          {/* Desktop loading */}
          <div className="hidden md:flex flex-wrap gap-3 mb-8">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="w-16 h-10 bg-muted animate-pulse rounded" />
            ))}
          </div>
          {/* Mobile loading - two rows */}
          <div className="md:hidden space-y-3 mb-4">
            <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
              <div className="flex gap-3 pb-2">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="w-12 h-12 bg-muted animate-pulse rounded flex-shrink-0" />
                ))}
              </div>
            </div>
            <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
              <div className="flex gap-3 pb-2">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="w-12 h-12 bg-muted animate-pulse rounded flex-shrink-0" />
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="w-64 h-64 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Split countries into two rows for mobile
  const midPoint = Math.ceil(countries.length / 2);
  const firstRowCountries = countries.slice(0, midPoint);
  const secondRowCountries = countries.slice(midPoint);

  return (
    <section className="py-8 md:py-16 pl-4 pr-0 bg-background">
      <div className="max-w-7xl mx-auto pr-0">
        {/* Header with Continent Selector and View all button */}
        <div className="flex items-center justify-between mb-4 md:mb-12">
          <Select
            value={selectedContinent}
            onValueChange={(value) => setSelectedContinent(value)}
          >
            <SelectTrigger
              className="!border-0 !p-0 !h-auto !w-auto !shadow-none !bg-transparent !outline-none focus-visible:!ring-0 focus-visible:!ring-offset-0 focus:!ring-0 focus:!ring-offset-0 hover:opacity-80 transition-opacity [&>svg]:hidden data-[state=open]:!bg-transparent data-[state=closed]:!bg-transparent"
              style={{ border: 'none', boxShadow: 'none', background: 'transparent' }}
            >
              <h2 className="text-3xl md:text-6xl font-medium text-foreground flex items-center gap-2 md:gap-3 cursor-pointer" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                {selectedContinent}
                <ChevronDown className="w-6 h-6 md:w-8 md:h-8 opacity-70" />
              </h2>
            </SelectTrigger>
            <SelectContent className="min-w-[200px]">
              {displayContinents.map((continent) => (
                <SelectItem
                  key={continent}
                  value={continent}
                  className="text-lg cursor-pointer"
                >
                  {continent}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* View all button */}
          <button
            onClick={handleViewAll}
            className="flex items-center gap-1 md:gap-2 px-3 md:px-6 py-2 md:py-3 border border-foreground md:border-2 text-foreground hover:bg-foreground hover:text-background transition-all duration-300 rounded-lg group"
          >
            <span className="font-semibold text-sm md:text-lg" style={{ fontFamily: 'Clash Display, sans-serif' }}>
              View all
            </span>
            <MoveRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Country Flags - Desktop: flex-wrap, Mobile: two horizontal scrolling rows */}
        <div className="mb-4 md:mb-8">
          {/* Desktop version - flex wrap */}
          <div className="hidden md:flex flex-wrap gap-3">
            {countries.map((country) => (
              <Link
                key={country.code}
                href={`/countries/${country.code}`}
                className="text-4xl hover:scale-110 transition-transform cursor-pointer"
                title={country.name}
              >
                {country.flag}
              </Link>
            ))}
          </div>

          {/* Mobile version - two scrolling rows */}
          <div className="md:hidden space-y-3">
            {/* First row */}
            <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
              <div className="flex gap-3 pb-2">
                {firstRowCountries.map((country) => (
                  <Link
                    key={country.code}
                    href={`/countries/${country.code}`}
                    className="text-3xl active:scale-95 transition-transform cursor-pointer flex-shrink-0"
                    title={country.name}
                  >
                    {country.flag}
                  </Link>
                ))}
              </div>
            </div>

            {/* Second row */}
            <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
              <div className="flex gap-3 pb-2">
                {secondRowCountries.map((country) => (
                  <Link
                    key={country.code}
                    href={`/countries/${country.code}`}
                    className="text-3xl active:scale-95 transition-transform cursor-pointer flex-shrink-0"
                    title={country.name}
                  >
                    {country.flag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Cities Carousel */}
        {cities.length > 0 && (
          <Carousel
            opts={{
              align: "start",
              loop: false,
              skipSnaps: false,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-3">
              {cities.map((city) => (
                  <CarouselItem
                    key={city.id}
                    className="pl-2 md:pl-3 basis-[60%] sm:basis-[48%] md:basis-[33%] lg:basis-[25%]"
                  >
                    <div className="p-1">
                      <Link
                        href={`/countries/${city.country_code}/${encodeURIComponent(city.name)}`}
                        className="block"
                      >
                        <div className="relative h-48 md:h-64 rounded-lg overflow-hidden group cursor-pointer active:scale-[0.98] md:hover:scale-[1.02] transition-transform duration-300">
                          <img
                            src={city.image || '/placeholder-city.jpg'}
                            alt={city.name}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300" />
                          <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4 text-white">
                            <h3 className="text-base md:text-lg font-semibold mb-1 drop-shadow-lg">
                              {city.name}
                            </h3>
                            <div className="flex items-center gap-1.5 md:gap-2">
                              <span className="text-xl md:text-2xl">{countries.find(c => c.code === city.country_code)?.flag || ''}</span>
                              <span className="text-xs md:text-sm font-medium drop-shadow-lg">
                                {city.country_name}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden lg:flex -left-4 xl:-left-12" />
              <CarouselNext className="hidden lg:flex -right-4 xl:-right-12" />
            </Carousel>
        )}
      </div>
    </section>
  );
}
