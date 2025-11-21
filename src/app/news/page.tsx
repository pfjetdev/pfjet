'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface NewsItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  published_date: string;
  read_time: string;
}

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data, error } = await supabase
          .from('news')
          .select('category')
          .eq('published', true);

        if (error) throw error;

        const uniqueCategories = ['All', ...new Set(data?.map(item => item.category) || [])];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }

    fetchCategories();
  }, []);

  useEffect(() => {
    async function fetchNews() {
      setLoading(true);
      try {
        let query = supabase
          .from('news')
          .select('id, slug, title, excerpt, image, category, published_date, read_time')
          .eq('published', true)
          .order('published_date', { ascending: false });

        if (selectedCategory !== 'All') {
          query = query.eq('category', selectedCategory);
        }

        const { data, error } = await query;

        if (error) throw error;
        setNewsData(data || []);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, [selectedCategory]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <main className="pt-6 px-4 pb-12">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Back to Home
            </span>
          </Link>

          {/* Title */}
          <h1
            className="text-5xl md:text-6xl font-medium text-foreground tracking-[2.4px]"
            style={{ fontFamily: 'Clash Display, sans-serif' }}
          >
            Latest News
          </h1>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`
                  px-6 py-3 rounded-full font-medium transition-all duration-200
                  ${selectedCategory === category
                    ? 'bg-foreground text-background shadow-lg'
                    : 'bg-card text-foreground border border-border hover:bg-accent hover:shadow-md'
                  }
                `}
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {category}
              </button>
            ))}
          </div>

          {/* News Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="w-full">
                  <div className="bg-card rounded-t-[24px] p-6 h-64">
                    <Skeleton className="h-8 w-full mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                  <Skeleton className="h-[242px] w-full rounded-b-[24px] mt-[1px]" />
                </div>
              ))
            ) : (
              newsData.map((news) => (
                <Link
                  key={news.id}
                  href={`/news/${news.slug}`}
                  className="block"
                >
                  <Card className="w-full overflow-hidden p-0 border-0 shadow-none flex flex-col gap-[1px] cursor-pointer group">
                    {/* Content section */}
                    <div className="bg-card rounded-t-[24px] p-6 flex flex-col justify-between h-64 transition-colors duration-300">
                      {/* Category Badge */}
                      <div className="mb-3">
                        <span
                          className="inline-block px-3 py-1 text-xs font-semibold bg-primary/10 text-primary rounded-full"
                          style={{ fontFamily: 'Montserrat, sans-serif' }}
                        >
                          {news.category}
                        </span>
                      </div>

                      {/* Title */}
                      <h3
                        className="text-2xl font-medium text-foreground leading-[1.4] group-hover:text-primary transition-colors"
                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                      >
                        {news.title}
                      </h3>

                      {/* Meta information */}
                      <div
                        className="flex items-center justify-between text-foreground/70 text-[15px] font-medium"
                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                      >
                        <span>{formatDate(news.published_date)}</span>
                        <span>{news.read_time}</span>
                      </div>
                    </div>

                    {/* Image section */}
                    <div className="relative h-[242px] w-full rounded-b-[24px] overflow-hidden">
                      <Image
                        src={news.image}
                        alt={news.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  </Card>
                </Link>
              ))
            )}
          </div>

          {/* No results message */}
          {!loading && newsData.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                No news found in this category.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
