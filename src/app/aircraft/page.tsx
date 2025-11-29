"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import { Plane } from "lucide-react";
import { getAircraftByCategories, Aircraft } from "@/lib/supabase-client";
import { Skeleton } from "@/components/ui/skeleton";

interface AircraftModel {
  name: string;
  slug: string;
  passengers?: string;
  range?: string;
  speed?: string;
}

interface AircraftCategory {
  id: string;
  name: string;
  image: string;
  description: string;
  specifications: {
    passengers: string;
    range: string;
    speed: string;
    baggage: string;
  };
  models: AircraftModel[];
}

// Category icon mapping
const categoryIconMap: Record<string, string> = {
  'turboprop': '/aircraft/turboprops.png',
  'very-light': '/aircraft/verylightjet.png',
  'light': '/aircraft/light.png',
  'midsize': '/aircraft/midsizejet.png',
  'super-mid': '/aircraft/supermidsizejet.png',
  'heavy': '/aircraft/heavyjet.png',
  'ultra-long': '/aircraft/longrangejet.png',
  'vip-airliner': '/aircraft/vip-air.png',
};

function AircraftContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryParam = searchParams.get('category');

  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "turboprop");
  const [aircraftData, setAircraftData] = useState<AircraftCategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Update URL when category changes
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    router.replace(`/aircraft?category=${categoryId}`, { scroll: false });
  };

  useEffect(() => {
    async function loadAircraft() {
      setLoading(true);
      const data = await getAircraftByCategories();

      // Group aircraft by category
      const categories = data.reduce((acc: Record<string, Aircraft[]>, aircraft: Aircraft) => {
        if (!acc[aircraft.category_slug]) {
          acc[aircraft.category_slug] = [];
        }
        acc[aircraft.category_slug].push(aircraft);
        return acc;
      }, {});

      // Transform to AircraftCategory format
      const transformedData: AircraftCategory[] = Object.entries(categories).map(
        ([categorySlug, aircraftList]) => {
          const firstAircraft = aircraftList[0];

          // Calculate average specifications for the category
          const avgPassengers = calculateRange(
            aircraftList.map((a) => a.passengers)
          );
          const avgRange = calculateRange(aircraftList.map((a) => a.range));
          const avgSpeed = calculateRange(aircraftList.map((a) => a.speed));
          const avgBaggage = calculateRange(
            aircraftList.map((a) => a.baggage)
          );

          // Generate category description from first aircraft
          const description =
            firstAircraft.category === "Turboprop"
              ? "Turboprop aircraft combine efficiency with versatility, ideal for short to medium-range flights. Perfect for accessing smaller airports while maintaining comfort and reliability."
              : firstAircraft.category === "Very Light"
              ? "Very Light Jets represent the entry point into private aviation, offering excellent value for shorter trips. Perfect for business executives and small groups."
              : firstAircraft.category === "Light"
              ? "Light jets offer the perfect balance of performance, comfort, and economy. Ideal for coast-to-coast travel with stand-up cabins and ample space."
              : firstAircraft.category === "Midsize"
              ? "Midsize jets provide transcontinental range with spacious cabins and enhanced amenities. Perfect combination of comfort and performance."
              : firstAircraft.category === "Super-mid"
              ? "Super-Midsize jets deliver exceptional range and cabin space, rivaling larger jets at lower operating costs. Ideal for demanding business travel."
              : firstAircraft.category === "Heavy"
              ? "Heavy jets represent the pinnacle of private aviation for long-range travel. Spacious cabins with the highest levels of comfort and luxury."
              : firstAircraft.category === "Ultra Long"
              ? "Ultra-Long Range jets are designed for global travel, capable of flying non-stop between virtually any two cities worldwide."
              : "VIP Airliners offer the ultimate in space, luxury, and long-range capability. Multiple staterooms and custom interiors redefine luxury air travel.";

          return {
            id: categorySlug,
            name: firstAircraft.category,
            image: firstAircraft.image,
            description,
            specifications: {
              passengers: avgPassengers,
              range: avgRange,
              speed: avgSpeed,
              baggage: avgBaggage,
            },
            models: aircraftList.map((a) => ({
              name: a.name,
              slug: a.slug,
              passengers: a.passengers,
              range: a.range,
              speed: a.speed,
            })),
          };
        }
      );

      // Define desired category order
      const categoryOrder = [
        "Turboprop",
        "Very Light",
        "Light",
        "Midsize",
        "Super-mid",
        "Heavy",
        "Ultra Long",
        "VIP"
      ];

      // Sort categories according to the desired order
      const sortedData = transformedData.sort((a, b) => {
        const indexA = categoryOrder.indexOf(a.name);
        const indexB = categoryOrder.indexOf(b.name);

        // If category not found in order, put it at the end
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;

        return indexA - indexB;
      });

      setAircraftData(sortedData);
      setLoading(false);
    }

    loadAircraft();
  }, []);

  // Update selected category when URL parameter changes
  useEffect(() => {
    if (categoryParam && aircraftData.length > 0) {
      const categoryExists = aircraftData.find(c => c.id === categoryParam);
      if (categoryExists) {
        setSelectedCategory(categoryParam);
      }
    }
  }, [categoryParam, aircraftData]);

  // Helper function to calculate range from specifications
  function calculateRange(specs: string[]): string {
    // Extract numbers from specifications like "Up to 9", "4-5", "1,720 nm", etc.
    const numbers = specs
      .map((spec) => {
        const matches = spec.match(/[\d,]+/g);
        if (!matches) return [];
        return matches.map((m) => parseFloat(m.replace(/,/g, "")));
      })
      .flat();

    if (numbers.length === 0) return "N/A";

    const min = Math.min(...numbers);
    const max = Math.max(...numbers);

    // Format based on the original format
    if (specs[0].includes("nm")) {
      return min === max
        ? `${Math.round(min).toLocaleString()} nm`
        : `${Math.round(min).toLocaleString()}-${Math.round(
            max
          ).toLocaleString()} nm`;
    } else if (specs[0].includes("mph")) {
      return min === max
        ? `${Math.round(min)} mph`
        : `${Math.round(min)}-${Math.round(max)} mph`;
    } else if (specs[0].includes("cu ft")) {
      return min === max
        ? `${Math.round(min)} cu ft`
        : `${Math.round(min)}-${Math.round(max)} cu ft`;
    } else {
      return min === max ? `${Math.round(min)}` : `${Math.round(min)}-${Math.round(max)}`;
    }
  }

  const currentAircraft = aircraftData.find(
    (aircraft) => aircraft.id === selectedCategory
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background transition-colors duration-300">
        <main className="pt-6 px-4 pb-12">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Title Skeleton */}
            <Skeleton className="h-12 w-64" />

            {/* Category Grid Skeleton */}
            <div className="space-y-8">
              <div className="grid grid-cols-4 md:grid-cols-8 gap-1.5">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center justify-center p-1.5 rounded-md border border-border bg-card/50"
                  >
                    <Skeleton className="w-full h-8 mb-1 rounded-sm" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                ))}
              </div>

              {/* Content Skeleton */}
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Column - Image and Description */}
                <div className="lg:w-[70%] space-y-6">
                  {/* Aircraft Image Skeleton */}
                  <Skeleton className="w-full h-[400px] rounded-xl" />

                  {/* Description Skeleton */}
                  <div className="space-y-4">
                    <Skeleton className="h-9 w-48" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-5 w-3/4" />
                    </div>

                    {/* Specifications Grid Skeleton */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div
                          key={i}
                          className="bg-card border border-border rounded-lg p-4"
                        >
                          <Skeleton className="h-4 w-20 mb-2" />
                          <Skeleton className="h-6 w-16" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column - Models List Skeleton */}
                <div className="lg:w-[30%]">
                  <div className="bg-card border border-border rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <Skeleton className="w-5 h-5 rounded" />
                      <Skeleton className="h-6 w-40" />
                    </div>
                    <div className="space-y-3">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full rounded-lg" />
                      ))}
                    </div>

                    {/* CTA Skeleton */}
                    <div className="mt-6 pt-6 border-t border-border">
                      <Skeleton className="h-12 w-full rounded-lg" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <main className="pt-6 px-4 pb-12">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Title */}
          <h1
            className="text-5xl font-medium text-foreground tracking-[2.4px]"
            style={{ fontFamily: "Clash Display, sans-serif" }}
          >
            Our Fleet
          </h1>

          {/* Enhanced Category Filter */}
          <div className="space-y-8">
            {/* Category Grid Filter - Compact with Images */}
            <div className="grid grid-cols-4 md:grid-cols-8 gap-1.5">
              {aircraftData.map((aircraft) => {
                const isSelected = selectedCategory === aircraft.id;
                const iconSrc = categoryIconMap[aircraft.id] || aircraft.image;
                return (
                  <button
                    key={aircraft.id}
                    onClick={() => handleCategoryChange(aircraft.id)}
                    className={`
                      group relative flex flex-col items-center justify-center p-1.5 rounded-md border overflow-hidden
                      transition-all duration-300 hover:scale-[1.02] hover:shadow-sm
                      ${
                        isSelected
                          ? 'bg-primary border-primary shadow-sm shadow-primary/20'
                          : 'bg-card/50 border-border hover:border-primary/50 hover:bg-card'
                      }
                    `}
                  >
                    {/* Aircraft Icon */}
                    <div
                      className={`
                        relative w-full h-8 mb-1 rounded-sm overflow-hidden transition-all duration-300
                        ${
                          isSelected
                            ? 'bg-primary-foreground/10'
                            : 'bg-muted/50 group-hover:bg-primary/10'
                        }
                      `}
                    >
                      <Image
                        src={iconSrc}
                        alt={aircraft.name}
                        fill
                        className={`
                          object-contain p-0.5 transition-all duration-300
                          ${
                            isSelected
                              ? 'opacity-100'
                              : 'opacity-70 group-hover:opacity-100'
                          }
                        `}
                      />
                    </div>

                    {/* Name */}
                    <span
                      className={`
                        text-[9px] font-semibold text-center leading-tight transition-colors duration-300
                        ${
                          isSelected
                            ? 'text-primary-foreground'
                            : 'text-foreground group-hover:text-primary'
                        }
                      `}
                    >
                      {aircraft.name}
                    </span>

                    {/* Selection Indicator */}
                    {isSelected && (
                      <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-primary-foreground rounded-full animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Content with smooth transition */}
            {currentAircraft && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Left Column - Image and Description (70%) */}
                  <div className="lg:w-[70%] space-y-6">
                    {/* Aircraft Image */}
                    <div className="relative w-full h-[400px] rounded-xl overflow-hidden">
                      <Image
                        src={currentAircraft.image}
                        alt={currentAircraft.name}
                        fill
                        className="object-cover"
                        priority
                      />
                    </div>

                    {/* Description */}
                    <div className="space-y-4">
                      <h2 className="text-3xl font-semibold text-foreground">
                        {currentAircraft.name} Jets
                      </h2>
                      <p className="text-muted-foreground leading-relaxed text-lg">
                        {currentAircraft.description}
                      </p>

                      {/* Specifications Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                        <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="text-sm text-muted-foreground mb-1">
                            Passengers
                          </div>
                          <div className="text-xl font-semibold text-foreground">
                            {currentAircraft.specifications.passengers}
                          </div>
                        </div>
                        <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="text-sm text-muted-foreground mb-1">
                            Range
                          </div>
                          <div className="text-xl font-semibold text-foreground">
                            {currentAircraft.specifications.range}
                          </div>
                        </div>
                        <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="text-sm text-muted-foreground mb-1">
                            Speed
                          </div>
                          <div className="text-xl font-semibold text-foreground">
                            {currentAircraft.specifications.speed}
                          </div>
                        </div>
                        <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="text-sm text-muted-foreground mb-1">
                            Baggage
                          </div>
                          <div className="text-xl font-semibold text-foreground">
                            {currentAircraft.specifications.baggage}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Models List (30%) */}
                  <div className="lg:w-[30%]">
                    <div className="bg-card border border-border rounded-xl p-6 sticky top-6">
                      <div className="flex items-center gap-2 mb-6">
                        <Plane className="w-5 h-5 text-primary" />
                        <h3 className="text-xl font-semibold text-foreground">
                          Available Models
                        </h3>
                      </div>
                      <div className="space-y-3 max-h-[500px] overflow-y-auto">
                        {currentAircraft.models.map((model, index) => (
                          <Link
                            key={index}
                            href={`/aircraft/${currentAircraft.id}/${model.slug}`}
                            className="group flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all cursor-pointer"
                          >
                            <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                              {model.name}
                            </span>
                            <svg
                              className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </Link>
                        ))}
                      </div>

                      {/* Call to Action */}
                      <div className="mt-6 pt-6 border-t border-border">
                        <button className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity">
                          Request a Quote
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function AircraftPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background">
        <main className="pt-6 px-4 pb-12">
          <div className="max-w-7xl mx-auto space-y-8">
            <div>
              <Skeleton className="h-14 w-80 mb-2" />
              <Skeleton className="h-5 w-96" />
            </div>
            <div className="space-y-8">
              <div className="grid grid-cols-4 md:grid-cols-8 gap-1.5">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-md" />
                ))}
              </div>
              <Skeleton className="h-96 w-full rounded-xl" />
            </div>
          </div>
        </main>
      </div>
    }>
      <AircraftContent />
    </Suspense>
  );
}
