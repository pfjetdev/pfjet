"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MoveRight } from "lucide-react";

interface AircraftType {
  id: number;
  name: string;
  slug: string;
  image: string;
}

const aircraftTypes: AircraftType[] = [
  { id: 1, name: "Turboprops", slug: "turboprop", image: "/aircraft/turboprops.png" },
  { id: 2, name: "Very Light", slug: "very-light", image: "/aircraft/verylightjet.png" },
  { id: 3, name: "Light", slug: "light", image: "/aircraft/light.png" },
  { id: 4, name: "Midsize", slug: "midsize", image: "/aircraft/midsizejet.png" },
  { id: 5, name: "Super-Mid", slug: "super-mid", image: "/aircraft/supermidsizejet.png" },
  { id: 6, name: "Heavy", slug: "heavy", image: "/aircraft/heavyjet.png" },
  { id: 7, name: "Ultra Long", slug: "ultra-long", image: "/aircraft/longrangejet.png" },
  { id: 8, name: "Vip Airliner", slug: "vip-airliner", image: "/aircraft/vip-air.png" },
];

export default function AircraftSection() {
  return (
    <section className="py-8 md:py-16 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4 md:mb-12">
          <h2 className="text-3xl md:text-6xl font-medium text-foreground" style={{ fontFamily: 'Clash Display, sans-serif' }}>
            Aircraft
          </h2>
        </div>

        {/* Content */}
        <div className="flex flex-col-reverse lg:flex-row gap-4 md:gap-8 lg:h-[500px]">
          {/* Left Column - Aircraft Menu (40%) */}
          <div className="lg:w-2/5 space-y-1.5 md:space-y-2">
            {aircraftTypes.map((aircraft) => (
              <Link
                key={aircraft.id}
                href={`/aircraft?category=${aircraft.slug}`}
                className="group flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer h-[52px] md:h-[58px]
                  transition-all duration-200 bg-muted/50 hover:bg-muted text-foreground"
              >
                <div className="flex items-center gap-3">
                  {/* Aircraft Image */}
                  <div className="w-16 md:w-20 h-10 md:h-11 relative flex-shrink-0">
                    <Image
                      src={aircraft.image}
                      alt={aircraft.name}
                      fill
                      className="object-contain"
                    />
                  </div>

                  {/* Aircraft Name */}
                  <h3 className="text-sm md:text-base font-medium">
                    {aircraft.name}
                  </h3>
                </div>

                {/* Arrow Icon */}
                <MoveRight
                  className="w-4 h-4 transition-all duration-200 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                />
              </Link>
            ))}
          </div>

          {/* Right Column - Aircraft Background Image (60%) */}
          <div className="lg:w-3/5 relative rounded-lg overflow-hidden h-64 md:h-80 lg:h-auto">
            <Image
              src="/aircraft/aircraftdivbg.jpg"
              alt="Aircraft Background"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}