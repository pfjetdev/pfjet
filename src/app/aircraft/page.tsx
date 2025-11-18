"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";
import { Plane } from "lucide-react";

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

const aircraftData: AircraftCategory[] = [
  {
    id: "turboprop",
    name: "Turboprop",
    image: "/aircraft/turboprops.png",
    description:
      "Turboprop aircraft combine efficiency with versatility, ideal for short to medium-range flights. These aircraft are perfect for accessing smaller airports and remote locations while maintaining comfort and reliability. With lower operating costs and excellent fuel efficiency, turboprops offer an economical solution for regional travel.",
    specifications: {
      passengers: "6-9",
      range: "1,000-1,500 nm",
      speed: "300-350 mph",
      baggage: "50-70 cu ft",
    },
    models: [
      { name: "King Air 260", slug: "king-air-260" },
      { name: "Piaggio Avanti", slug: "piaggio-avanti" },
      { name: "Piaggio Avanti II", slug: "piaggio-avanti-ii" },
      { name: "Pilatus PC-12/47E (NG)", slug: "pilatus-pc-12" },
    ],
  },
  {
    id: "very-light",
    name: "Very Light",
    image: "/aircraft/verylightjet.png",
    description:
      "Very Light Jets represent the entry point into private aviation, offering excellent value for shorter trips. These compact aircraft are perfect for business executives and small groups seeking the convenience and time-saving benefits of private air travel without the higher costs of larger jets.",
    specifications: {
      passengers: "4-6",
      range: "1,000-1,200 nm",
      speed: "360-400 mph",
      baggage: "40-50 cu ft",
    },
    models: [
      { name: "Citation Mustang", slug: "citation-mustang" },
      { name: "Phenom 100", slug: "phenom-100" },
      { name: "Eclipse 500", slug: "eclipse-500" },
      { name: "HondaJet", slug: "hondajet" },
    ],
  },
  {
    id: "light",
    name: "Light",
    image: "/aircraft/light.png",
    description:
      "Light jets offer the perfect balance of performance, comfort, and economy. Ideal for coast-to-coast travel, these aircraft feature stand-up cabins, enclosed lavatories, and ample baggage space. They're the most popular choice for business travelers seeking efficiency and comfort.",
    specifications: {
      passengers: "6-8",
      range: "1,500-2,000 nm",
      speed: "400-480 mph",
      baggage: "60-80 cu ft",
    },
    models: [
      { name: "Citation CJ3+", slug: "citation-cj3" },
      { name: "Learjet 45XR", slug: "learjet-45xr" },
      { name: "Phenom 300", slug: "phenom-300" },
      { name: "Citation XLS+", slug: "citation-xls-plus" },
    ],
  },
  {
    id: "midsize",
    name: "Midsize",
    image: "/aircraft/midsizejet.png",
    description:
      "Midsize jets provide transcontinental range with spacious cabins and enhanced amenities. These aircraft offer the perfect combination of comfort and performance, featuring full galley services, larger lavatories, and the ability to reach most destinations non-stop from major business centers.",
    specifications: {
      passengers: "7-9",
      range: "2,000-3,000 nm",
      speed: "480-520 mph",
      baggage: "80-100 cu ft",
    },
    models: [
      { name: "Citation Latitude", slug: "citation-latitude" },
      { name: "Hawker 850XP", slug: "hawker-850xp" },
      { name: "Learjet 60XR", slug: "learjet-60xr" },
      { name: "Citation XLS", slug: "citation-xls" },
    ],
  },
  {
    id: "super-mid",
    name: "Super-Mid",
    image: "/aircraft/supermidsizejet.png",
    description:
      "Super-Midsize jets deliver exceptional range and cabin space, rivaling larger heavy jets at a lower operating cost. With stand-up cabins, full galley, and the ability to fly coast-to-coast against headwinds, these aircraft are ideal for demanding business travel requirements.",
    specifications: {
      passengers: "8-10",
      range: "3,000-4,000 nm",
      speed: "520-590 mph",
      baggage: "100-120 cu ft",
    },
    models: [
      { name: "Citation X", slug: "citation-x" },
      { name: "Challenger 350", slug: "challenger-350" },
      { name: "Gulfstream G280", slug: "gulfstream-g280" },
      { name: "Citation Sovereign", slug: "citation-sovereign" },
    ],
  },
  {
    id: "heavy",
    name: "Heavy",
    image: "/aircraft/heavyjet.png",
    description:
      "Heavy jets represent the pinnacle of private aviation for long-range travel. With spacious cabins that can be configured for work, dining, and rest, these aircraft offer transcontinental and intercontinental range with the highest levels of comfort and luxury.",
    specifications: {
      passengers: "10-16",
      range: "4,000-5,000 nm",
      speed: "520-590 mph",
      baggage: "140-195 cu ft",
    },
    models: [
      { name: "Challenger 605", slug: "challenger-605" },
      { name: "Gulfstream G450", slug: "gulfstream-g450" },
      { name: "Global 5000", slug: "global-5000" },
      { name: "Falcon 2000LX", slug: "falcon-2000lx" },
    ],
  },
  {
    id: "ultra-long",
    name: "Ultra-Long",
    image: "/aircraft/longrangejet.png",
    description:
      "Ultra-Long Range jets are designed for global travel, capable of flying non-stop between virtually any two cities worldwide. These aircraft feature the most advanced technology, luxurious cabins with multiple living areas, and amenities comparable to five-star hotels.",
    specifications: {
      passengers: "12-19",
      range: "6,000-7,500 nm",
      speed: "590-690 mph",
      baggage: "195+ cu ft",
    },
    models: [
      { name: "Gulfstream G650", slug: "gulfstream-g650" },
      { name: "Global 7500", slug: "global-7500" },
      { name: "Falcon 8X", slug: "falcon-8x" },
      { name: "Global 6000", slug: "global-6000" },
    ],
  },
  {
    id: "vip-airliner",
    name: "VIP Airliner",
    image: "/aircraft/heavyjet.png",
    description:
      "VIP Airliners are commercial aircraft converted for private use, offering the ultimate in space, luxury, and long-range capability. With multiple staterooms, conference areas, and custom interiors, these aircraft redefine luxury air travel for heads of state, corporations, and ultra-high-net-worth individuals.",
    specifications: {
      passengers: "16-50+",
      range: "6,000-8,000+ nm",
      speed: "530-590 mph",
      baggage: "300+ cu ft",
    },
    models: [
      { name: "Boeing Business Jet", slug: "boeing-business-jet" },
      { name: "Airbus ACJ320", slug: "airbus-acj320" },
      { name: "Airbus ACJ350", slug: "airbus-acj350" },
      { name: "Boeing 787 Dreamliner", slug: "boeing-787-dreamliner" },
    ],
  },
];

export default function AircraftPage() {
  const [selectedCategory, setSelectedCategory] = useState("turboprop");

  const currentAircraft = aircraftData.find(
    (aircraft) => aircraft.id === selectedCategory
  );

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
                return (
                  <button
                    key={aircraft.id}
                    onClick={() => setSelectedCategory(aircraft.id)}
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
                    {/* Aircraft Image */}
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
                        src={aircraft.image}
                        alt={aircraft.name}
                        fill
                        className={`
                          object-contain p-0.5 transition-all duration-300
                          ${
                            isSelected
                              ? 'brightness-110'
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
                {currentAircraft && (
                  <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Column - Image and Description (70%) */}
                    <div className="lg:w-[70%] space-y-6">
                      {/* Aircraft Image */}
                      <div className="relative w-full h-[400px] rounded-xl overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30">
                        <Image
                          src={currentAircraft.image}
                          alt={currentAircraft.name}
                          fill
                          className="object-contain p-8"
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
                        <div className="space-y-3">
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
                )}
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
