"use client";

import React, { useState } from "react";
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
  { id: 7, name: "Long Range Jet", slug: "ultra-long", image: "/aircraft/longrangejet.png" },
  { id: 8, name: "VIP", slug: "vip", image: "/aircraft/vip.png" },
];

export default function AircraftSection() {
  const [selectedAircraft, setSelectedAircraft] = useState<number>(1);

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
          <div className="lg:w-2/5 space-y-2 md:space-y-3">
            {aircraftTypes.map((aircraft) => (
              <Link
                key={aircraft.id}
                href={`/aircraft?category=${aircraft.slug}`}
                className={`
                  flex items-center justify-between p-2 rounded-lg border cursor-pointer h-[50px] md:h-[60px]
                  active:scale-[0.98] md:hover:scale-[1.02] transition-all duration-300
                  ${
                    selectedAircraft === aircraft.id
                      ? 'ring-2 ring-primary bg-primary/5 border-primary'
                      : 'hover:bg-accent border-border'
                  }
                `}
                onMouseEnter={() => setSelectedAircraft(aircraft.id)}
              >
                <div className="flex items-center space-x-2">
                  {/* Aircraft Image */}
                  <div className="w-14 md:w-18 h-10 md:h-12 relative flex-shrink-0">
                    <Image
                      src={aircraft.image}
                      alt={aircraft.name}
                      fill
                      className="object-contain"
                    />
                  </div>

                  {/* Aircraft Name */}
                  <h3 className="text-xs md:text-sm font-semibold text-foreground">
                    {aircraft.name}
                  </h3>
                </div>

                {/* Arrow Icon */}
                <MoveRight
                  className={`
                    w-3 h-3 transition-all duration-300
                    ${
                      selectedAircraft === aircraft.id
                        ? "text-primary transform translate-x-1"
                        : "text-muted-foreground"
                    }
                  `}
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