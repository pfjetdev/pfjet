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
      <section className="py-16 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-6xl font-medium text-foreground" style={{ fontFamily: 'Clash Display, sans-serif' }}>
              {selectedContinent}
            </h2>
          </div>
          <div className="flex flex-wrap gap-3 mb-8">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="w-16 h-10 bg-muted animate-pulse rounded" />
            ))}
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

  return (
    <section className="py-16 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header with Continent Selector and View all button */}
        <div className="flex items-center justify-between mb-12">
          <Select
            value={selectedContinent}
            onValueChange={(value) => setSelectedContinent(value)}
          >
            <SelectTrigger
              className="!border-0 !p-0 !h-auto !w-auto !shadow-none !bg-transparent !outline-none focus-visible:!ring-0 focus-visible:!ring-offset-0 focus:!ring-0 focus:!ring-offset-0 hover:opacity-80 transition-opacity [&>svg]:hidden data-[state=open]:!bg-transparent data-[state=closed]:!bg-transparent"
              style={{ border: 'none', boxShadow: 'none', background: 'transparent' }}
            >
              <h2 className="text-6xl font-medium text-foreground flex items-center gap-3 cursor-pointer" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                {selectedContinent}
                <ChevronDown className="w-8 h-8 opacity-70" />
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
            className="flex items-center gap-2 px-6 py-3 border-2 border-foreground text-foreground hover:bg-foreground hover:text-background transition-all duration-300 rounded-lg group"
          >
            <span className="font-semibold text-lg" style={{ fontFamily: 'Clash Display, sans-serif' }}>
              View all
            </span>
            <MoveRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Country Flags Grid */}
        <div className="flex flex-wrap gap-3 mb-8">
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

        {/* Cities Carousel */}
        {cities.length > 0 && (
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {cities.map((city) => (
                <CarouselItem
                  key={city.id}
                  className="md:basis-1/2 lg:basis-1/3 xl:basis-1/5"
                >
                  <div className="p-1">
                    <Link
                      href={`/countries/${city.country_code}/${encodeURIComponent(city.name)}`}
                      className="block"
                    >
                      <div className="relative h-64 rounded-lg overflow-hidden group cursor-pointer hover:scale-[1.02] transition-transform duration-300">
                        <img
                          src={city.image || '/placeholder-city.jpg'}
                          alt={city.name}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300" />
                        <div className="absolute bottom-4 left-4 text-white">
                          <h3 className="text-lg font-semibold mb-1 drop-shadow-lg">
                            {city.name}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{countries.find(c => c.code === city.country_code)?.flag || ''}</span>
                            <span className="text-sm font-medium drop-shadow-lg">
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
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        )}
      </div>
    </section>
  );
}
