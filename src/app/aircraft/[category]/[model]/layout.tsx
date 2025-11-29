import type { Metadata } from "next";
import { getAircraftBySlug } from "@/lib/supabase-client";
import { createAircraftMetadata } from "@/lib/seo";
import { AircraftJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";
import { siteConfig } from "@/lib/seo";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ category: string; model: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; model: string }>;
}): Promise<Metadata> {
  const { category, model } = await params;
  const aircraft = await getAircraftBySlug(category, model);

  if (!aircraft) {
    return {
      title: "Aircraft Not Found",
    };
  }

  return createAircraftMetadata({
    name: aircraft.name,
    slug: aircraft.slug,
    category: aircraft.category,
    category_slug: aircraft.category_slug,
    description: aircraft.description,
    passengers: aircraft.passengers,
    range: aircraft.range,
    speed: aircraft.speed,
    image: aircraft.image,
  });
}

export default async function AircraftModelLayout({ children, params }: LayoutProps) {
  const { category, model } = await params;
  const aircraft = await getAircraftBySlug(category, model);

  return (
    <>
      {aircraft && (
        <>
          <AircraftJsonLd aircraft={aircraft} />
          <BreadcrumbJsonLd
            items={[
              { name: "Home", url: "/" },
              { name: "Aircraft", url: "/aircraft" },
              { name: aircraft.category, url: `/aircraft?category=${category}` },
              { name: aircraft.name, url: `/aircraft/${category}/${model}` },
            ]}
          />
        </>
      )}
      {children}
    </>
  );
}
