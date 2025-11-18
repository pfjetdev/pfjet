'use client';

import { useState } from 'react';
import SearchHeader from '@/components/SearchHeader';
import JetSelection from '@/components/JetSelection';
import Footer from '@/components/Footer';

export default function SearchResultsPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    console.log('Selected date:', date);
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <main className="pt-6 px-4">
        <div className="max-w-7xl mx-auto space-y-4">
          {/* Search Header with Route and Calendar */}
          <SearchHeader
            from="London"
            fromCode="LHR"
            to="Amsterdam"
            toCode="AMS"
            onDateSelect={handleDateSelect}
          />

          {/* Jet Selection Section */}
          <JetSelection />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
