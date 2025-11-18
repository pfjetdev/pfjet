'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import FlightDetails from '@/components/FlightDetails';
import CreateOrderForm from '@/components/CreateOrderForm';
import Footer from '@/components/Footer';

// Mock data - in real app this would come from API/database
const jetData: Record<string, any> = {
  '1': {
    id: 1,
    name: 'Citation CJ3',
    category: 'Light',
    price: '$ 6, 500',
    seats: 6,
    image: '/Citation CJ3.jpg',
    specifications: {
      range: '2,040 NM',
      speed: '478 mph',
      luggage: '65 cu ft',
      wifi: 'Available',
    },
  },
  '2': {
    id: 2,
    name: 'Citation CJ',
    category: 'Light',
    price: '$ 8, 910',
    seats: 5,
    image: '/aircraft/light.png',
    specifications: {
      range: '1,875 NM',
      speed: '451 mph',
      luggage: '55 cu ft',
      wifi: 'Available',
    },
  },
  '3': {
    id: 3,
    name: 'Citation CJ1',
    category: 'Midsize',
    price: '$ 9, 500',
    seats: 7,
    image: '/aircraft/midsizejet.png',
    specifications: {
      range: '2,200 NM',
      speed: '489 mph',
      luggage: '70 cu ft',
      wifi: 'Available',
    },
  },
};

export default function JetDetailPage() {
  const params = useParams();
  const jetId = params.id as string;
  const jet = jetData[jetId] || jetData['1'];

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <main className="pt-6 px-4 pb-12">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Jet Name */}
          <h1
            className="text-5xl font-medium text-foreground tracking-[2.4px]"
            style={{ fontFamily: 'Clash Display, sans-serif' }}
          >
            {jet.name}
          </h1>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Jet Info and Flight Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Jet Image and Specifications - One Block */}
              <div className="bg-card rounded-2xl border border-border overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-10">
                  {/* Left: Image - 70% */}
                  <div className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-r border-border">
                    <Image
                      src={jet.image}
                      alt={jet.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority
                    />
                  </div>

                  {/* Right: Specifications - 30% */}
                  <div className="lg:col-span-3 p-8 flex flex-col justify-center">
                    <div className="space-y-6">
                      {/* Passengers */}
                      <div className="flex items-center gap-4 p-2 -m-2 rounded-lg hover:bg-muted/50 transition-colors cursor-default">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          className="text-foreground shrink-0"
                        >
                          <path
                            d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M8.5 11C10.7091 11 12.5 9.20914 12.5 7C12.5 4.79086 10.7091 3 8.5 3C6.29086 3 4.5 4.79086 4.5 7C4.5 9.20914 6.29086 11 8.5 11Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M20 8V14"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M23 11H17"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span
                          className="text-base font-medium text-foreground"
                          style={{ fontFamily: 'Montserrat, sans-serif' }}
                        >
                          {jet.seats} passengers
                        </span>
                      </div>

                      {/* Range */}
                      <div className="flex items-center gap-4 p-2 -m-2 rounded-lg hover:bg-muted/50 transition-colors cursor-default">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          className="text-foreground shrink-0"
                        >
                          <path
                            d="M21 16V14L13 9V3.5C13 2.67 12.33 2 11.5 2C10.67 2 10 2.67 10 3.5V9L2 14V16L10 13.5V19L8 20.5V22L11.5 21L15 22V20.5L13 19V13.5L21 16Z"
                            fill="currentColor"
                          />
                        </svg>
                        <span
                          className="text-base font-medium text-foreground"
                          style={{ fontFamily: 'Montserrat, sans-serif' }}
                        >
                          {jet.specifications.range.replace(' NM', ' nautical miles')}
                        </span>
                      </div>

                      {/* Luggage */}
                      <div className="flex items-center gap-4 p-2 -m-2 rounded-lg hover:bg-muted/50 transition-colors cursor-default">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          className="text-foreground shrink-0"
                        >
                          <path
                            d="M9 6V3C9 2.73478 9.10536 2.48043 9.29289 2.29289C9.48043 2.10536 9.73478 2 10 2H14C14.2652 2 14.5196 2.10536 14.7071 2.29289C14.8946 2.48043 15 2.73478 15 3V6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M9 20V22H15V20"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M20 6H4C2.89543 6 2 6.89543 2 8V18C2 19.1046 2.89543 20 4 20H20C21.1046 20 22 19.1046 22 18V8C22 6.89543 21.1046 6 20 6Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M2 11H22"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span
                          className="text-base font-medium text-foreground"
                          style={{ fontFamily: 'Montserrat, sans-serif' }}
                        >
                          {jet.specifications.luggage.replace(' cu ft', ' cubic feet')}
                        </span>
                      </div>

                      {/* Cabin Attendant */}
                      <div className="flex items-center gap-4 p-2 -m-2 rounded-lg hover:bg-muted/50 transition-colors cursor-default">
                        <Image
                          src="/st.svg"
                          alt="Flight attendant"
                          width={24}
                          height={24}
                          className="shrink-0"
                        />
                        <span
                          className="text-base font-medium text-foreground"
                          style={{ fontFamily: 'Montserrat, sans-serif' }}
                        >
                          No
                        </span>
                      </div>

                      {/* WC */}
                      <div className="flex items-center gap-4 p-2 -m-2 rounded-lg hover:bg-muted/50 transition-colors cursor-default">
                        <div className="w-6 h-6 bg-foreground text-background rounded flex items-center justify-center font-bold text-xs shrink-0">
                          WC
                        </div>
                        <span
                          className="text-base font-medium text-foreground"
                          style={{ fontFamily: 'Montserrat, sans-serif' }}
                        >
                          Yes
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Flight Details */}
              <FlightDetails
                from="London"
                fromCode="LHR"
                to="Amsterdam"
                toCode="AMS"
                departureTime="10:30"
                arrivalTime="13:45"
                departureDate="15 November"
                arrivalDate="15 November"
                duration="3h 15min"
                passengers={4}
              />
            </div>

            {/* Right Column - Order Form */}
            <div>
              <CreateOrderForm jetName={jet.name} price={jet.price} />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
