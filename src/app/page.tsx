import dynamic from "next/dynamic";
import { Suspense } from "react";
import HeroSection from "@/components/HeroSection";
import FlightClassBanner from "@/components/FlightClassBanner";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";
import { generateAllEmptyLegs } from "@/lib/emptyLegsGenerator";
import { supabase, Event } from "@/lib/supabase";

// Revalidate page every hour for fresh data with caching
export const revalidate = 3600;

// Dynamic imports for below-the-fold components with ssr: false where possible
const EmptyLegsSection = dynamic(() => import("@/components/EmptyLegsSection"), {
  loading: () => <div className="py-16 bg-background" aria-hidden="true" />,
});
const TopRoutesSection = dynamic(() => import("@/components/TopRoutesSection"), {
  loading: () => <div className="py-16 bg-background" aria-hidden="true" />,
});
const PackagesSection = dynamic(() => import("@/components/PackagesSection"), {
  loading: () => <div className="py-16 bg-background" aria-hidden="true" />,
});
const EventsSection = dynamic(() => import("@/components/EventsSection"), {
  loading: () => <div className="py-16 bg-background" aria-hidden="true" />,
});
const AircraftSection = dynamic(() => import("@/components/AircraftSection"), {
  loading: () => <div className="py-16 bg-background" aria-hidden="true" />,
});
const DestinationsSection = dynamic(() => import("@/components/DestinationsSection"), {
  loading: () => <div className="py-16 bg-background" aria-hidden="true" />,
});
const LatestNewsSection = dynamic(() => import("@/components/LatestNewsSection"), {
  loading: () => <div className="py-16 bg-background" aria-hidden="true" />,
});

// Parallel data fetching
async function getPageData() {
  const [emptyLegsData, eventsData] = await Promise.all([
    generateAllEmptyLegs(15), // Only fetch what we need
    supabase
      .from('events')
      .select('*')
      .order('date_from', { ascending: true })
      .then(res => res.data || [])
  ]);

  return { emptyLegs: emptyLegsData, events: eventsData as Event[] };
}

export default async function Home() {
  const { emptyLegs, events } = await getPageData();
  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Hero Section */}
      <main className="pt-0">
        <HeroSection />
        {/* Flight Class Banner */}
        <FlightClassBanner />
        {/* Features Section */}
        <FeaturesSection />
        {/* Empty Legs Section */}
        <EmptyLegsSection emptyLegs={emptyLegs} />
        {/* Packages Section */}
        <PackagesSection />
        {/* Events Section */}
        <EventsSection events={events} />
        {/* Top Routes Section */}
        <TopRoutesSection />
        {/* Aircraft Section */}
        <AircraftSection />
        {/* Destinations Section */}
        <DestinationsSection />
        {/* Latest News Section */}
        <LatestNewsSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
