"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Card } from "@/components/ui/card";
import * as flags from "country-flag-icons/react/3x2";

// Define continents and their countries
const continents = {
  Europe: {
    countries: [
      { code: "AF", flag: flags.AF },
      { code: "AL", flag: flags.AL },
      { code: "AE", flag: flags.AE },
      { code: "AD", flag: flags.AD },
      { code: "AO", flag: flags.AO },
      { code: "AG", flag: flags.AG },
      { code: "AR", flag: flags.AR },
      { code: "UA", flag: flags.UA },
      { code: "AU", flag: flags.AU },
      { code: "AT", flag: flags.AT },
      { code: "AZ", flag: flags.AZ },
      { code: "IS", flag: flags.IS },
      { code: "KE", flag: flags.KE },
      { code: "KG", flag: flags.KG },
      { code: "KR", flag: flags.KR },
      { code: "SA", flag: flags.SA },
      { code: "KW", flag: flags.KW },
      { code: "KH", flag: flags.KH },
      { code: "KP", flag: flags.KP },
      { code: "TZ", flag: flags.TZ },
      { code: "BD", flag: flags.BD },
      { code: "BB", flag: flags.BB },
      { code: "BI", flag: flags.BI },
      { code: "BE", flag: flags.BE },
      { code: "BJ", flag: flags.BJ },
      { code: "BN", flag: flags.BN },
      { code: "BO", flag: flags.BO },
      { code: "BA", flag: flags.BA },
      { code: "BZ", flag: flags.BZ },
      { code: "BY", flag: flags.BY },
    ],
    cities: [
      {
        name: "Rome",
        country: "Italy",
        countryCode: "IT",
        image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80",
      },
      {
        name: "Madrid",
        country: "Spain",
        countryCode: "ES",
        image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&q=80",
      },
      {
        name: "Amsterdam",
        country: "Netherlands",
        countryCode: "NL",
        image: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800&q=80",
      },
      {
        name: "Paris",
        country: "France",
        countryCode: "FR",
        image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80",
      },
      {
        name: "Berlin",
        country: "Germany",
        countryCode: "DE",
        image: "https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800&q=80",
      },
    ],
  },
  Asia: {
    countries: [
      { code: "CN", flag: flags.CN },
      { code: "JP", flag: flags.JP },
      { code: "IN", flag: flags.IN },
      { code: "TH", flag: flags.TH },
      { code: "SG", flag: flags.SG },
      { code: "MY", flag: flags.MY },
      { code: "ID", flag: flags.ID },
      { code: "PH", flag: flags.PH },
      { code: "VN", flag: flags.VN },
      { code: "KR", flag: flags.KR },
    ],
    cities: [
      {
        name: "Tokyo",
        country: "Japan",
        countryCode: "JP",
        image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80",
      },
      {
        name: "Singapore",
        country: "Singapore",
        countryCode: "SG",
        image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=80",
      },
      {
        name: "Bangkok",
        country: "Thailand",
        countryCode: "TH",
        image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&q=80",
      },
      {
        name: "Dubai",
        country: "UAE",
        countryCode: "AE",
        image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80",
      },
      {
        name: "Mumbai",
        country: "India",
        countryCode: "IN",
        image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&q=80",
      },
    ],
  },
  Americas: {
    countries: [
      { code: "US", flag: flags.US },
      { code: "CA", flag: flags.CA },
      { code: "MX", flag: flags.MX },
      { code: "BR", flag: flags.BR },
      { code: "AR", flag: flags.AR },
      { code: "CL", flag: flags.CL },
      { code: "CO", flag: flags.CO },
      { code: "PE", flag: flags.PE },
    ],
    cities: [
      {
        name: "New York",
        country: "USA",
        countryCode: "US",
        image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80",
      },
      {
        name: "Los Angeles",
        country: "USA",
        countryCode: "US",
        image: "https://images.unsplash.com/photo-1580655653885-65763b2597d0?w=800&q=80",
      },
      {
        name: "Toronto",
        country: "Canada",
        countryCode: "CA",
        image: "https://images.unsplash.com/photo-1517935706615-2717063c2225?w=800&q=80",
      },
      {
        name: "Mexico City",
        country: "Mexico",
        countryCode: "MX",
        image: "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=800&q=80",
      },
      {
        name: "Rio de Janeiro",
        country: "Brazil",
        countryCode: "BR",
        image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&q=80",
      },
    ],
  },
  Africa: {
    countries: [
      { code: "EG", flag: flags.EG },
      { code: "ZA", flag: flags.ZA },
      { code: "NG", flag: flags.NG },
      { code: "KE", flag: flags.KE },
      { code: "MA", flag: flags.MA },
      { code: "TN", flag: flags.TN },
      { code: "GH", flag: flags.GH },
      { code: "ET", flag: flags.ET },
    ],
    cities: [
      {
        name: "Cairo",
        country: "Egypt",
        countryCode: "EG",
        image: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=800&q=80",
      },
      {
        name: "Cape Town",
        country: "South Africa",
        countryCode: "ZA",
        image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&q=80",
      },
      {
        name: "Marrakech",
        country: "Morocco",
        countryCode: "MA",
        image: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=800&q=80",
      },
      {
        name: "Nairobi",
        country: "Kenya",
        countryCode: "KE",
        image: "https://images.unsplash.com/photo-1611348524140-53c9a25263d6?w=800&q=80",
      },
      {
        name: "Lagos",
        country: "Nigeria",
        countryCode: "NG",
        image: "https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=800&q=80",
      },
    ],
  },
  Oceania: {
    countries: [
      { code: "AU", flag: flags.AU },
      { code: "NZ", flag: flags.NZ },
      { code: "FJ", flag: flags.FJ },
      { code: "PG", flag: flags.PG },
    ],
    cities: [
      {
        name: "Sydney",
        country: "Australia",
        countryCode: "AU",
        image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&q=80",
      },
      {
        name: "Melbourne",
        country: "Australia",
        countryCode: "AU",
        image: "https://images.unsplash.com/photo-1514395462725-fb4566210144?w=800&q=80",
      },
      {
        name: "Auckland",
        country: "New Zealand",
        countryCode: "NZ",
        image: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=800&q=80",
      },
      {
        name: "Wellington",
        country: "New Zealand",
        countryCode: "NZ",
        image: "https://images.unsplash.com/photo-1589699424817-c2d17c5e6e48?w=800&q=80",
      },
      {
        name: "Brisbane",
        country: "Australia",
        countryCode: "AU",
        image: "https://images.unsplash.com/photo-1523285517914-8f3b0c4d9b3f?w=800&q=80",
      },
    ],
  },
};

type ContinentKey = keyof typeof continents;

export default function DestinationsSection() {
  const router = useRouter();
  const [selectedContinent, setSelectedContinent] = useState<ContinentKey>("Europe");

  const currentData = continents[selectedContinent];

  const handleViewAll = () => {
    router.push(`/countries?continent=${selectedContinent}`);
  };

  return (
    <section className="py-16 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header with Continent Selector and View all button */}
        <div className="flex items-center justify-between mb-12">
          <Select
            value={selectedContinent}
            onValueChange={(value) => setSelectedContinent(value as ContinentKey)}
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
              {Object.keys(continents).map((continent) => (
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
          {currentData.countries.map((country) => {
            const FlagComponent = country.flag;
            return (
              <button
                key={country.code}
                className="w-16 h-10 rounded overflow-hidden border-2 border-border hover:border-primary transition-colors shadow-sm hover:shadow-md"
                title={country.code}
              >
                <FlagComponent className="w-full h-full object-cover" />
              </button>
            );
          })}
        </div>

        {/* Cities Carousel */}
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {currentData.cities.map((city, index) => {
              const FlagComponent = flags[city.countryCode as keyof typeof flags];
              return (
                <CarouselItem
                  key={index}
                  className="md:basis-1/2 lg:basis-1/3 xl:basis-1/5"
                >
                  <div className="p-1">
                    <div className="relative h-64 rounded-lg overflow-hidden group cursor-pointer hover:scale-[1.02] transition-transform duration-300">
                      <img
                        src={city.image}
                        alt={city.name}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300" />
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="text-lg font-semibold mb-1 drop-shadow-lg">
                          {city.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          {FlagComponent && (
                            <FlagComponent className="w-6 h-4 rounded-sm shadow-md" />
                          )}
                          <span className="text-sm font-medium drop-shadow-lg">{city.country}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
}
