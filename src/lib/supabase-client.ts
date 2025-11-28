import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions for our database
export interface Aircraft {
  id: string;
  name: string;
  slug: string;
  category: string;
  category_slug: string;
  description: string;
  full_description: string;
  passengers: string;
  range: string;
  speed: string;
  baggage: string;
  cabin_height: string;
  cabin_width: string;
  features: string[];
  gallery: string[];
  image: string;
  created_at: string;
  updated_at: string;
}

// Helper to parse JSON fields that might come as strings
function parseAircraftData(data: any): Aircraft {
  return {
    ...data,
    gallery: typeof data.gallery === 'string' ? JSON.parse(data.gallery) : data.gallery || [],
    features: typeof data.features === 'string' ? JSON.parse(data.features) : data.features || [],
  };
}

// Fetch all aircraft grouped by category
export async function getAircraftByCategories() {
  const { data, error } = await supabase
    .from('aircraft')
    .select('*')
    .order('category_slug')
    .order('name');

  if (error) {
    console.error('Error fetching aircraft:', error);
    return [];
  }

  return (data || []).map(parseAircraftData);
}

// Fetch aircraft by category
export async function getAircraftByCategory(categorySlug: string) {
  const { data, error } = await supabase
    .from('aircraft')
    .select('*')
    .eq('category_slug', categorySlug)
    .order('name');

  if (error) {
    console.error('Error fetching aircraft by category:', error);
    return [];
  }

  return (data || []).map(parseAircraftData);
}

// Fetch single aircraft by category and slug
export async function getAircraftBySlug(categorySlug: string, aircraftSlug: string) {
  const { data, error } = await supabase
    .from('aircraft')
    .select('*')
    .eq('category_slug', categorySlug)
    .eq('slug', aircraftSlug)
    .single();

  if (error) {
    console.error('Error fetching aircraft:', error);
    return null;
  }

  return parseAircraftData(data);
}

// Get all unique categories
export async function getAircraftCategories() {
  const { data, error } = await supabase
    .from('aircraft')
    .select('category, category_slug, image')
    .order('category_slug');

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  // Group by category and get first image
  const categories = data.reduce((acc: any[], curr: any) => {
    if (!acc.find(c => c.category_slug === curr.category_slug)) {
      acc.push({
        category: curr.category,
        category_slug: curr.category_slug,
        image: curr.image,
      });
    }
    return acc;
  }, []);

  return categories;
}
