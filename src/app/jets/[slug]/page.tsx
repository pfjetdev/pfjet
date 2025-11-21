import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';
import JetDetailClient from './JetDetailClient';
import Footer from '@/components/Footer';

export const revalidate = 86400;

interface PageProps {
  params: {
    slug: string;
  };
  searchParams: {
    from?: string;
    to?: string;
    date?: string;
    time?: string;
    passengers?: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { data: aircraft } = await supabase
    .from('aircraft')
    .select('*')
    .eq('slug', resolvedParams.slug)
    .single();

  if (!aircraft) {
    return {
      title: 'Jet Not Found',
    };
  }

  return {
    title: `${aircraft.name} - Private Jet Charter | PrivateJet`,
    description: `Book ${aircraft.name} for your private flight. ${aircraft.category} jet with ${aircraft.passengers} passengers. Range: ${aircraft.range}, Speed: ${aircraft.speed}.`,
    openGraph: {
      title: `${aircraft.name} - Private Jet Charter`,
      description: `${aircraft.category} jet with ${aircraft.passengers} passengers`,
      images: [aircraft.image],
    },
  };
}

export default async function JetDetailPage({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const { data: aircraft, error } = await supabase
    .from('aircraft')
    .select('*')
    .eq('slug', resolvedParams.slug)
    .single();

  if (error || !aircraft) {
    notFound();
  }

  // Get search parameters with defaults
  const from = resolvedSearchParams.from || 'LHR';
  const to = resolvedSearchParams.to || 'AMS';
  const date = resolvedSearchParams.date || new Date().toISOString().split('T')[0];
  const time = resolvedSearchParams.time || '10:00';
  const passengers = parseInt(resolvedSearchParams.passengers || '1');

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <main className="pt-6 px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          <JetDetailClient
            aircraft={aircraft}
            from={from}
            to={to}
            date={date}
            time={time}
            passengers={passengers}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
