import type { Metadata } from "next";
import { getNewsBySlug } from "@/lib/data";
import { createNewsMetadata } from "@/lib/seo";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const article = await getNewsBySlug(slug);

    if (!article) {
      return {
        title: "Article Not Found",
      };
    }

    return createNewsMetadata({
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      image: article.image,
      author: article.author,
      published_date: article.published_date,
      category: article.category,
    });
  } catch {
    return {
      title: "Article Not Found",
    };
  }
}

export default async function NewsArticleLayout({ children, params }: LayoutProps) {
  const { slug } = await params;

  let article = null;
  try {
    article = await getNewsBySlug(slug);
  } catch {
    // Article not found, render children without JSON-LD
  }

  return (
    <>
      {article && (
        <>
          <ArticleJsonLd
            article={{
              slug: article.slug,
              title: article.title,
              excerpt: article.excerpt,
              content: article.content,
              image: article.image,
              author: article.author,
              published_date: article.published_date,
              category: article.category,
            }}
          />
          <BreadcrumbJsonLd
            items={[
              { name: "Home", url: "/" },
              { name: "News", url: "/news" },
              { name: article.title, url: `/news/${slug}` },
            ]}
          />
        </>
      )}
      {children}
    </>
  );
}
