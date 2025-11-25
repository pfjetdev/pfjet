import HeroSection from "@/components/HeroSection";
import FlightClassBanner from "@/components/FlightClassBanner";
import FeaturesSection from "@/components/FeaturesSection";
import EmptyLegsSection from "@/components/EmptyLegsSection";
import PackagesSection from "@/components/PackagesSection";
import EventsSection from "@/components/EventsSection";
import TopRoutesSection from "@/components/TopRoutesSection";
import AircraftSection from "@/components/AircraftSection";
import DestinationsSection from "@/components/DestinationsSection";
import LatestNewsSection from "@/components/LatestNewsSection";
import Footer from "@/components/Footer";
import { generateAllEmptyLegs } from "@/lib/emptyLegsGenerator";
import { supabase, Event } from "@/lib/supabase";

export default async function Home() {
  // Fetch actual empty legs data - generate same dataset as /empty-legs page
  // Then take first 15 to ensure consistency
  const allEmptyLegs = await generateAllEmptyLegs(100);
  const emptyLegs = allEmptyLegs.slice(0, 15);

  // Fetch events from Supabase
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .order('date_from', { ascending: true });

  const eventsData: Event[] = events || [];
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
        <EventsSection events={eventsData} />
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
