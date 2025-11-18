'use client';

import { useParams } from 'next/navigation';
import EmptyLegHeroBlock from '@/components/EmptyLegHeroBlock';
import EmptyLegFlightInfo from '@/components/EmptyLegFlightInfo';
import CreateOrderForm from '@/components/CreateOrderForm';
import Footer from '@/components/Footer';

// Mock data - in real app this would come from API/database
const emptyLegsData: Record<string, any> = {
  '1': {
    id: 1,
    from: 'London',
    fromCode: 'LHR',
    to: 'Paris',
    toCode: 'CDG',
    date: '30 OCT, 2025',
    time: '04:45 AM',
    passengers: 10,
    price: '2,900',
    image: '/day.jpg',
    departureDate: '30 October',
    arrivalDate: '30 October',
    departureTime: '04:45 AM',
    arrivalTime: '05:46 AM',
    duration: '0h : 59m',
    aircraft: {
      name: 'Citation Mustang',
      category: 'Light',
      image: '/Citation CJ3.jpg',
    },
  },
  '2': {
    id: 2,
    from: 'London',
    fromCode: 'LHR',
    to: 'Ibiza',
    toCode: 'IBZ',
    date: 'Dec 18, 2024',
    time: '10:30 AM',
    passengers: 6,
    price: '15,800',
    image: '/night.jpg',
    departureDate: '18 December',
    arrivalDate: '18 December',
    departureTime: '10:30 AM',
    arrivalTime: '13:45 PM',
    duration: '3h : 15m',
    aircraft: {
      name: 'Citation CJ3',
      category: 'Light',
      image: '/aircraft/light.png',
    },
  },
  '3': {
    id: 3,
    from: 'New York',
    fromCode: 'JFK',
    to: 'Aspen',
    toCode: 'ASE',
    date: 'Dec 20, 2024',
    time: '09:00 AM',
    passengers: 10,
    price: '28,000',
    image: '/day.jpg',
    departureDate: '20 December',
    arrivalDate: '20 December',
    departureTime: '09:00 AM',
    arrivalTime: '13:30 PM',
    duration: '4h : 30m',
    aircraft: {
      name: 'Citation CJ4',
      category: 'Midsize',
      image: '/aircraft/midsizejet.png',
    },
  },
};

export default function EmptyLegDetailPage() {
  const params = useParams();
  const legId = params.id as string;
  const leg = emptyLegsData[legId] || emptyLegsData['1'];

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <main className="pt-6 px-4 pb-12">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Route Title */}
          <h1
            className="text-5xl font-medium text-foreground tracking-[2.4px]"
            style={{ fontFamily: 'Clash Display, sans-serif' }}
          >
            {leg.from} - {leg.to}
          </h1>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Hero Block */}
            <div className="lg:col-span-2 space-y-6">
              {/* Hero Block with Image */}
              <EmptyLegHeroBlock
                departureDate={leg.date}
                departureTime={leg.time}
                passengers={leg.passengers}
                image={leg.image}
                pricePerJet={leg.price}
              />

              {/* Flight Information Component */}
              <EmptyLegFlightInfo
                aircraftName={leg.aircraft.name}
                aircraftCategory={leg.aircraft.category}
                fromCode={leg.fromCode}
                fromCity={leg.from}
                toCode={leg.toCode}
                toCity={leg.to}
                departureTime={leg.departureTime}
                departureDate={leg.departureDate}
                arrivalTime={leg.arrivalTime}
                arrivalDate={leg.arrivalDate}
                duration={leg.duration}
                aircraftImage={leg.aircraft.image}
              />
            </div>

            {/* Right Column - Order Form */}
            <div>
              <CreateOrderForm
                jetName={`${leg.from} - ${leg.to}`}
                price={`$ ${leg.price}`}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
