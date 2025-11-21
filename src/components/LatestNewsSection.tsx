'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import NewsCard from './NewsCard';
import { MoveRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/lib/supabase';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface NewsItem {
  id: string;
  slug: string;
  title: string;
  image: string;
  published_date: string;
  read_time: string;
}

export default function LatestNewsSection() {
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        const { data, error } = await supabase
          .from('news')
          .select('id, slug, title, image, published_date, read_time')
          .eq('published', true)
          .order('published_date', { ascending: false })
          .limit(3);

        if (error) throw error;
        setNewsData(data || []);
      } catch (error) {
        console.error('Error fetching latest news:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  return (
    <section className="py-8 md:py-16 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header with title and View all button */}
        <div className="flex items-center justify-between mb-4 md:mb-8">
          <h2
            className="text-3xl md:text-6xl font-medium text-foreground"
            style={{ fontFamily: 'Clash Display, sans-serif' }}
          >
            Latest news
          </h2>

          {/* View all button */}
          <Link
            href="/news"
            className="flex items-center gap-1 md:gap-2 px-3 md:px-6 py-2 md:py-3 border border-foreground md:border-2 text-foreground hover:bg-foreground hover:text-background transition-all duration-300 rounded-lg group"
          >
            <span className="font-semibold text-sm md:text-lg" style={{ fontFamily: 'Clash Display, sans-serif' }}>
              View all
            </span>
            <MoveRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* News cards - Mobile: Carousel, Desktop: Grid */}
        {loading ? (
          <>
            {/* Desktop loading */}
            <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex flex-col gap-[1px]">
                  <div className="bg-card rounded-t-[24px] p-6 flex flex-col justify-between h-64">
                    <Skeleton className="h-16 w-full" />
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                  <Skeleton className="h-[242px] w-full rounded-b-[24px]" />
                </div>
              ))}
            </div>
            {/* Mobile loading */}
            <div className="md:hidden">
              <div className="flex gap-3 overflow-x-auto scrollbar-hide">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex flex-col gap-[1px] min-w-[70%]">
                    <div className="bg-card rounded-t-[24px] p-4 flex flex-col justify-between h-48">
                      <Skeleton className="h-12 w-full" />
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                    <Skeleton className="h-[180px] w-full rounded-b-[24px]" />
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Desktop grid */}
            <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newsData.map((news) => (
                <NewsCard
                  key={news.id}
                  slug={news.slug}
                  title={news.title}
                  date={formatDate(news.published_date)}
                  readTime={news.read_time}
                  image={news.image}
                />
              ))}
            </div>
            {/* Mobile carousel */}
            <div className="md:hidden">
              <Carousel
                opts={{
                  align: "start",
                }}
                className="w-full"
              >
                <CarouselContent>
                  {newsData.map((news) => (
                    <CarouselItem key={news.id} className="basis-[70%] sm:basis-1/2 pl-3">
                      <NewsCard
                        slug={news.slug}
                        title={news.title}
                        date={formatDate(news.published_date)}
                        readTime={news.read_time}
                        image={news.image}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden" />
                <CarouselNext className="hidden" />
              </Carousel>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
