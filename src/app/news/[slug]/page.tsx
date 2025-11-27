'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Footer from '@/components/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Calendar, Clock, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  author: string;
  published_date: string;
  read_time: string;
}

export default function NewsDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState<NewsArticle | null>(null);

  useEffect(() => {
    async function fetchNews() {
      try {
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .eq('slug', slug)
          .eq('published', true)
          .single();

        if (error) throw error;
        setNews(data);
      } catch (error) {
        console.error('Error fetching news:', error);
        setNews(null);
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, [slug]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: news?.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied!', {
        description: 'The article link has been copied to your clipboard.',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background transition-colors duration-300">
        <main className="pt-6 px-4 pb-12">
          <div className="max-w-4xl mx-auto space-y-8">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-96 w-full rounded-xl" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground" style={{ fontFamily: 'Clash Display, sans-serif' }}>
            News Not Found
          </h1>
          <p className="text-muted-foreground" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            The news article you're looking for doesn't exist.
          </p>
          <Link
            href="/news"
            className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-lg hover:opacity-90 transition-opacity"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to News
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <main className="pt-6 px-4 pb-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Back Button */}
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Back to News
            </span>
          </Link>

          {/* Category Badge */}
          <Badge
            variant="secondary"
            className="text-sm px-4 py-1"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {news.category}
          </Badge>

          {/* Title */}
          <h1
            className="text-4xl md:text-5xl font-medium text-foreground leading-tight"
            style={{ fontFamily: 'Clash Display, sans-serif' }}
          >
            {news.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span style={{ fontFamily: 'Montserrat, sans-serif' }}>{formatDate(news.published_date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span style={{ fontFamily: 'Montserrat, sans-serif' }}>{news.read_time}</span>
            </div>
            <div className="flex items-center gap-2">
              <span style={{ fontFamily: 'Montserrat, sans-serif' }}>By {news.author}</span>
            </div>
            <button
              onClick={handleShare}
              className="ml-auto flex items-center gap-2 text-foreground hover:text-primary transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span style={{ fontFamily: 'Montserrat, sans-serif' }}>Share</span>
            </button>
          </div>

          <Separator />

          {/* Featured Image */}
          <div className="relative w-full h-[500px] rounded-xl overflow-hidden">
            <Image
              src={news.image}
              alt={news.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Content */}
          <div
            className="prose prose-lg dark:prose-invert max-w-none"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
            dangerouslySetInnerHTML={{ __html: news.content }}
          />

          <Separator className="my-8" />

          {/* Related News */}
          <div className="space-y-6">
            <h2
              className="text-3xl font-medium text-foreground"
              style={{ fontFamily: 'Clash Display, sans-serif' }}
            >
              More News
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Placeholder for related news */}
              <Link
                href="/news"
                className="block p-6 bg-card border border-border rounded-xl hover:shadow-lg transition-all"
              >
                <h3
                  className="text-xl font-medium text-foreground mb-2"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  Explore all news articles
                </h3>
                <p className="text-muted-foreground" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Browse our complete collection of private aviation news and insights.
                </p>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
