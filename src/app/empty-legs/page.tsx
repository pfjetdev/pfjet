'use client';

import { useState } from 'react';
import EmptyLegsFilters from '@/components/EmptyLegsFilters';
import EmptyLegCard from '@/components/EmptyLegCard';
import Footer from '@/components/Footer';

// Sample Empty Legs data
const emptyLegsData = [
  {
    id: 1,
    from: 'London',
    to: 'Paris',
    date: 'Sep 10, Tue',
    passengers: 10,
    price: 2900,
    image: '/day.jpg',
  },
  {
    id: 2,
    from: 'London',
    to: 'Ibiza',
    date: 'Dec 18, 2024',
    passengers: 6,
    price: 15800,
    image: '/night.jpg',
  },
  {
    id: 3,
    from: 'New York',
    to: 'Aspen',
    date: 'Dec 20, 2024',
    passengers: 10,
    price: 28000,
    image: '/day.jpg',
  },
  {
    id: 4,
    from: 'Miami',
    to: 'Nassau',
    date: 'Dec 22, 2024',
    passengers: 8,
    price: 9500,
    image: '/night.jpg',
  },
  {
    id: 5,
    from: 'Tokyo',
    to: 'Osaka',
    date: 'Dec 16, 2024',
    passengers: 7,
    price: 11200,
    image: '/day.jpg',
  },
  {
    id: 6,
    from: 'Dubai',
    to: 'Male',
    date: 'Dec 25, 2024',
    passengers: 9,
    price: 32000,
    image: '/night.jpg',
  },
  {
    id: 7,
    from: 'Rome',
    to: 'Athens',
    date: 'Dec 17, 2024',
    passengers: 6,
    price: 13500,
    image: '/day.jpg',
  },
  {
    id: 8,
    from: 'Sydney',
    to: 'Melbourne',
    date: 'Dec 19, 2024',
    passengers: 8,
    price: 8900,
    image: '/night.jpg',
  },
  {
    id: 9,
    from: 'Los Angeles',
    to: 'Las Vegas',
    date: 'Dec 21, 2024',
    passengers: 7,
    price: 7500,
    image: '/day.jpg',
  },
];

export default function EmptyLegsPage() {
  const [filters, setFilters] = useState({});

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <main className="pt-6 px-4 pb-12">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Title */}
          <h1
            className="text-5xl font-medium text-foreground tracking-[2.4px]"
            style={{ fontFamily: 'Clash Display, sans-serif' }}
          >
            Empty Legs
          </h1>

          {/* Main Content - Filters + Cards */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left: Filters */}
            <EmptyLegsFilters onFilterChange={handleFilterChange} />

            {/* Right: Cards Grid */}
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {emptyLegsData.map((flight) => (
                  <EmptyLegCard
                    key={flight.id}
                    id={flight.id}
                    from={flight.from}
                    to={flight.to}
                    date={flight.date}
                    passengers={flight.passengers}
                    price={flight.price}
                    image={flight.image}
                    onSelect={() => console.log(`Selected flight ${flight.id}`)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
