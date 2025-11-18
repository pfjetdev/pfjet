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

export default function Home() {
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
        <EmptyLegsSection />
        {/* Packages Section */}
        <PackagesSection />
        {/* Events Section */}
        <EventsSection />
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
