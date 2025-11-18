'use client';

import NewsCard from './NewsCard';
import { MoveRight } from 'lucide-react';

const newsData = [
  {
    title: "Top 10 Private Jets Departing Farnborough (FAB) to Geneva (GVA): 2025",
    date: "09.10.2025",
    readTime: "3 min read",
    image: "/news/news-1.jpg"
  },
  {
    title: "Top 10 Private Jets Departing Farnborough (FAB) to Geneva (GVA): 2025",
    date: "09.10.2025",
    readTime: "3 min read",
    image: "/news/news-2.jpg"
  },
  {
    title: "Top 10 Private Jets Departing Farnborough (FAB) to Geneva (GVA): 2025",
    date: "09.10.2025",
    readTime: "3 min read",
    image: "/news/news-3.jpg"
  }
];

export default function LatestNewsSection() {
  return (
    <section className="py-16 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header with title and View all button */}
        <div className="flex items-center justify-between mb-8">
          <h2
            className="text-6xl font-bold text-foreground"
            style={{ fontFamily: 'Clash Display, sans-serif' }}
          >
            Latest news
          </h2>

          {/* View all button */}
          <button className="flex items-center gap-2 text-foreground hover:text-primary transition-colors group">
            <span className="font-medium" style={{ fontFamily: 'Clash Display, sans-serif' }}>
              View all
            </span>
            <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* News cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsData.map((news, index) => (
            <NewsCard
              key={index}
              title={news.title}
              date={news.date}
              readTime={news.readTime}
              image={news.image}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
