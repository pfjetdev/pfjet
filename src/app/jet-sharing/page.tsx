'use client';

import JetSharingFilters from '@/components/JetSharingFilters';
import JetSharingCard from '@/components/JetSharingCard';
import Footer from '@/components/Footer';

// Mock data for jet sharing
const jetSharingData = [
  {
    id: 1,
    from: 'London',
    to: 'Paris',
    date: 'Sep 10',
    time: '14:00',
    totalSeats: 7,
    availableSeats: 3,
    price: 1500,
    image: '/day.jpg',
  },
  {
    id: 2,
    from: 'New York',
    to: 'Miami',
    date: 'Sep 15',
    time: '09:30',
    totalSeats: 8,
    availableSeats: 5,
    price: 2200,
    image: '/night.jpg',
  },
  {
    id: 3,
    from: 'Dubai',
    to: 'London',
    date: 'Sep 20',
    time: '18:45',
    totalSeats: 10,
    availableSeats: 2,
    price: 3500,
    image: '/day.jpg',
  },
  {
    id: 4,
    from: 'Paris',
    to: 'Nice',
    date: 'Sep 12',
    time: '11:00',
    totalSeats: 6,
    availableSeats: 4,
    price: 800,
    image: '/night.jpg',
  },
  {
    id: 5,
    from: 'Los Angeles',
    to: 'Las Vegas',
    date: 'Sep 18',
    time: '16:20',
    totalSeats: 7,
    availableSeats: 7,
    price: 1200,
    image: '/day.jpg',
  },
  {
    id: 6,
    from: 'Moscow',
    to: 'St Petersburg',
    date: 'Sep 25',
    time: '10:15',
    totalSeats: 8,
    availableSeats: 1,
    price: 950,
    image: '/night.jpg',
  },
];

export default function JetSharingPage() {
  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <main className="pt-6 px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Page Title */}
          <h1
            className="text-5xl font-medium text-foreground tracking-[2.4px] mb-8"
            style={{ fontFamily: 'Clash Display, sans-serif' }}
          >
            Jet Sharing
          </h1>

          {/* Main Content with Filters and Cards */}
          <div className="flex gap-8">
            {/* Filters Sidebar */}
            <JetSharingFilters />

            {/* Cards Grid */}
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jetSharingData.map((jet) => (
                  <JetSharingCard
                    key={jet.id}
                    id={jet.id}
                    from={jet.from}
                    to={jet.to}
                    date={jet.date}
                    time={jet.time}
                    totalSeats={jet.totalSeats}
                    availableSeats={jet.availableSeats}
                    price={jet.price}
                    image={jet.image}
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
