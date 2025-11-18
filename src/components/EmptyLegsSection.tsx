'use client';

import EmptyLegsCard from './EmptyLegsCard';
import { MoveRight } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const emptyLegsData = [
  {
    date: "Sep 10, Tue",
    passengers: "Up to 10",
    route: "Zurich - Mykonos",
    price: "From $ 3,800",
    image: "/day.jpg"
  },
  {
    date: "Sep 15, Sun",
    passengers: "Up to 8",
    route: "London - Nice",
    price: "From $ 4,200",
    image: "/night.jpg"
  },
  {
    date: "Sep 20, Fri",
    passengers: "Up to 12",
    route: "Paris - Dubai",
    price: "From $ 6,500",
    image: "/day.jpg"
  },
  {
    date: "Sep 25, Wed",
    passengers: "Up to 6",
    route: "Milan - Monaco",
    price: "From $ 2,900",
    image: "/night.jpg"
  },
  {
    date: "Oct 2, Wed",
    passengers: "Up to 14",
    route: "Barcelona - Ibiza",
    price: "From $ 3,200",
    image: "/day.jpg"
  }
];

export default function EmptyLegsSection() {
  return (
    <section className="py-16 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header with title and View all button */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-6xl font-bold text-foreground" style={{ fontFamily: 'Clash Display, sans-serif' }}>
            Empty Legs
          </h2>
          <button className="flex items-center gap-2 text-foreground hover:text-primary transition-colors group">
            <span className="font-medium" style={{ fontFamily: 'Clash Display, sans-serif' }}>
              View all
            </span>
            <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full"
        >
          <CarouselContent>
            {emptyLegsData.map((flight, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <div className="p-1">
                  <EmptyLegsCard 
                    date={flight.date}
                    passengers={flight.passengers}
                    route={flight.route}
                    price={flight.price}
                    image={flight.image}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
}