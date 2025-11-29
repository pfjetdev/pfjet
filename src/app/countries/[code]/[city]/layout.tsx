import type { Metadata } from "next";
import { getCountry, getCity } from "@/lib/data";
import { createCityMetadata } from "@/lib/seo";
import { PlaceJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ code: string; city: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string; city: string }>;
}): Promise<Metadata> {
  const { code, city: citySlug } = await params;
  const countryCode = code.toUpperCase();
  const cityName = decodeURIComponent(citySlug)
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  try {
    const [country, city] = await Promise.all([
      getCountry(countryCode),
      getCity(countryCode, cityName),
    ]);

    if (!city) {
      return {
        title: "City Not Found",
      };
    }

    return createCityMetadata({
      name: city.name,
      country_code: countryCode,
      country_name: country.name,
      description: city.description,
      image: city.image,
    });
  } catch {
    return {
      title: "City Not Found",
    };
  }
}

export default async function CityLayout({ children, params }: LayoutProps) {
  const { code, city: citySlug } = await params;
  const countryCode = code.toUpperCase();
  const cityName = decodeURIComponent(citySlug)
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  let country = null;
  let city = null;

  try {
    [country, city] = await Promise.all([
      getCountry(countryCode),
      getCity(countryCode, cityName),
    ]);
  } catch {
    // Data not found, render children without JSON-LD
  }

  return (
    <>
      {country && city && (
        <>
          <PlaceJsonLd
            place={{
              name: `${city.name}, ${country.name}`,
              description: city.description,
              image: city.image,
              url: `/countries/${countryCode}/${citySlug}`,
              type: "City",
            }}
          />
          <BreadcrumbJsonLd
            items={[
              { name: "Home", url: "/" },
              { name: "Countries", url: "/countries" },
              { name: country.name, url: `/countries/${countryCode}` },
              { name: city.name, url: `/countries/${countryCode}/${citySlug}` },
            ]}
          />
        </>
      )}
      {children}
    </>
  );
}
