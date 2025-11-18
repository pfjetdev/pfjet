'use client';

import { useState } from 'react';
import JetCard from './JetCard';
import Image from 'next/image';

const jetCategories = [
  { id: 'turboprops', name: 'Turboprops', image: '/aircraft/turboprops.png' },
  { id: 'very-light', name: 'Very Light', image: '/aircraft/verylightjet.png' },
  { id: 'light', name: 'Light', image: '/aircraft/light.png' },
  { id: 'midsize', name: 'Midsize', image: '/aircraft/midsizejet.png' },
  { id: 'super-mid', name: 'Super-Mid', image: '/aircraft/supermidsizejet.png' },
  { id: 'heavy', name: 'Heavy', image: '/aircraft/heavyjet.png' },
  { id: 'long-range', name: 'Long Range Jet', image: '/aircraft/longrangejet.png' },
];

const sampleJets = [
  {
    id: 1,
    name: 'Citation CJ3',
    category: 'Light',
    price: '$ 6, 500',
    seats: 6,
    image: '/aircraft/light.png',
  },
  {
    id: 2,
    name: 'Citation CJ',
    category: 'Light',
    price: '$ 8, 910',
    seats: 5,
    image: '/aircraft/light.png',
  },
  {
    id: 3,
    name: 'Citation CJ1',
    category: 'Midsize',
    price: '$ 9, 500',
    seats: 7,
    image: '/aircraft/midsizejet.png',
  },
  {
    id: 4,
    name: 'Hawker 900XP',
    category: 'Midsize',
    price: '$ 15, 500',
    seats: 9,
    image: '/aircraft/midsizejet.png',
  },
  {
    id: 5,
    name: 'Citation Sovereign',
    category: 'Super-Mid',
    price: '$ 15, 545',
    seats: 8,
    image: '/aircraft/supermidsizejet.png',
  },
  {
    id: 6,
    name: 'Citation XLS',
    category: 'Midsize',
    price: '$ 19, 986',
    seats: 9,
    image: '/aircraft/midsizejet.png',
  },
];

export default function JetSelection() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredJets = selectedCategory
    ? sampleJets.filter((jet) => jet.category.toLowerCase().replace('-', ' ') === selectedCategory.toLowerCase().replace('-', ' '))
    : sampleJets;

  return (
    <section className="py-6">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <h2
          className="text-3xl font-medium text-foreground mb-6"
          style={{ fontFamily: 'Clash Display, sans-serif' }}
        >
          Choose your jet
        </h2>

        <div className="flex gap-6">
          {/* Sidebar - Categories */}
          <aside className="w-64 shrink-0">
            <div className="space-y-2">
              {jetCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(
                    selectedCategory === category.id ? null : category.id
                  )}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                    ${selectedCategory === category.id
                      ? 'bg-foreground text-background shadow-md'
                      : 'bg-card hover:bg-accent text-foreground'
                    }
                  `}
                >
                  <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
                    <Image
                      src={category.image}
                      alt={category.name}
                      width={40}
                      height={40}
                      className={`object-contain transition-all duration-200 ${
                        selectedCategory === category.id
                          ? 'brightness-0 invert'
                          : 'opacity-60 group-hover:opacity-100'
                      }`}
                    />
                  </div>
                  <span
                    className="text-sm font-medium"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    {category.name}
                  </span>
                </button>
              ))}
            </div>
          </aside>

          {/* Jets Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJets.map((jet) => (
                <JetCard
                  key={jet.id}
                  id={jet.id}
                  name={jet.name}
                  category={jet.category}
                  price={jet.price}
                  seats={jet.seats}
                  image={jet.image}
                  onSelect={() => console.log('Selected:', jet.name)}
                />
              ))}
            </div>

            {/* Empty State */}
            {filteredJets.length === 0 && (
              <div className="text-center py-20">
                <Plane className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg text-muted-foreground">
                  No jets found in this category
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
