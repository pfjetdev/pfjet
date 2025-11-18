'use client'

import { Button } from '@/components/ui/button'
import { MoveRight } from 'lucide-react'

export default function PackagesSection() {
  return (
    <section className="py-16 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Левая сторона - заголовок и текст */}
          <div className="flex flex-col justify-between h-full">
            <div className="w-4/5">
              <h2 className="text-6xl font-medium text-foreground mb-6" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                Packages
              </h2>
              <p className="text-lg text-foreground/80 leading-relaxed">
                Discover exclusive service packages that will make your journey unforgettable. 
                From private jets to luxury hotels - we offer a complete range of premium services.
              </p>
            </div>
            <button
              onClick={() => console.log('Package button clicked')}
              className="text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2 shadow-lg h-12 w-fit text-base hover:opacity-90"
              style={{ backgroundColor: 'var(--brand-red)' }}
            >
              <span>Order Package</span>
              <MoveRight className="w-4 h-4" />
            </button>
          </div>

        {/* Правая сторона - Bento Grid */}
        <div className="grid grid-cols-2 grid-rows-2 gap-4 h-[500px]">
          {/* Private Jet */}
          <div 
            className="relative bg-cover bg-center bg-no-repeat rounded-lg overflow-hidden group hover:scale-[1.02] transition-transform duration-300"
            style={{ backgroundImage: 'url(/jet.jpg)' }}
          >
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="text-2xl font-bold">Private Jet</h3>
              <p className="text-white/90 text-sm">Luxury air travel</p>
            </div>
          </div>

          {/* Luxury Transfer */}
          <div 
            className="relative bg-cover bg-center bg-no-repeat rounded-lg overflow-hidden group hover:scale-[1.02] transition-transform duration-300"
            style={{ backgroundImage: 'url(/car.jpg)' }}
          >
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="text-2xl font-bold">Luxury Transfer</h3>
              <p className="text-white/90 text-sm">Premium ground transport</p>
            </div>
          </div>

          {/* Hotel */}
          <div 
            className="relative bg-cover bg-center bg-no-repeat rounded-lg overflow-hidden group hover:scale-[1.02] transition-transform duration-300"
            style={{ backgroundImage: 'url(/hotel.jpg)' }}
          >
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="text-2xl font-bold">Hotel</h3>
              <p className="text-white/90 text-sm">Luxury accommodations</p>
            </div>
          </div>

          {/* Exclusive Bonuses */}
          <div 
            className="relative bg-cover bg-center bg-no-repeat rounded-lg overflow-hidden group hover:scale-[1.02] transition-transform duration-300"
            style={{ backgroundImage: 'url(/bonus.jpg)' }}
          >
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="text-2xl font-bold">Exclusive Bonuses</h3>
              <p className="text-white/90 text-sm">Special perks and rewards</p>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  )
}