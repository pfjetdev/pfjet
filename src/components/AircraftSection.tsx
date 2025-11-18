"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MoveRight } from "lucide-react";

interface AircraftType {
  id: number;
  name: string;
  image: string;
}

const aircraftTypes: AircraftType[] = [
  { id: 1, name: "Turboprops", image: "/aircraft/turboprops.png" },
  { id: 2, name: "Very Light", image: "/aircraft/verylightjet.png" },
  { id: 3, name: "Light", image: "/aircraft/light.png" },
  { id: 4, name: "Midsize", image: "/aircraft/midsizejet.png" },
  { id: 5, name: "Super-Mid", image: "/aircraft/supermidsizejet.png" },
  { id: 6, name: "Heavy", image: "/aircraft/heavyjet.png" },
  { id: 7, name: "Long Range Jet", image: "/aircraft/longrangejet.png" },
];

export default function AircraftSection() {
  const [selectedAircraft, setSelectedAircraft] = useState<number>(1);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h2 className="text-6xl font-bold text-foreground" style={{ fontFamily: 'Clash Display, sans-serif' }}>
            Aircraft
          </h2>
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row gap-8 h-[500px]">
          {/* Left Column - Aircraft Menu (40%) */}
          <div className="lg:w-2/5 space-y-3">
            {aircraftTypes.map((aircraft) => (
              <div
                key={aircraft.id}
                className={`
                  flex items-center justify-between p-2 rounded-lg border cursor-pointer h-[60px]
                  hover:scale-[1.02] transition-all duration-300
                  ${
                    selectedAircraft === aircraft.id
                      ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700'
                  }
                `}
                onClick={() => setSelectedAircraft(aircraft.id)}
              >
                <div className="flex items-center space-x-2">
                  {/* Aircraft Image */}
                  <div className="w-18 h-12 relative flex-shrink-0">
                    <Image
                      src={aircraft.image}
                      alt={aircraft.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  
                  {/* Aircraft Name */}
                  <h3 className="text-sm font-semibold text-foreground">
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
              </div>
            ))}
          </div>

          {/* Right Column - Aircraft Background Image (60%) */}
          <div className="lg:w-3/5 relative rounded-lg overflow-hidden">
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