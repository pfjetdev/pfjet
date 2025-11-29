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

// ==================== ORDERS / LEADS ====================

export type OrderType = 'charter' | 'empty_leg' | 'jet_sharing' | 'search' | 'contact' | 'multi_city';
export type OrderStatus = 'new' | 'contacted' | 'confirmed' | 'completed' | 'cancelled';

export interface OrderData {
  // Contact info
  name: string;
  email: string;
  phone: string;

  // Order type
  order_type: OrderType;

  // Flight details (optional)
  from_location?: string;
  to_location?: string;
  departure_date?: string;
  departure_time?: string;
  passengers?: number;

  // For multi-city
  routes?: Array<{
    from: string;
    to: string;
    date: string;
    time: string;
    passengers: number;
  }>;

  // Product reference
  product_id?: string;
  product_name?: string;
  product_type?: string;

  // Pricing
  price?: number;
  currency?: string;

  // Additional
  message?: string;
  source_url?: string;
}

export interface OrderResult {
  success: boolean;
  data?: { id: string };
  error?: string;
}

// Send notification to Telegram
async function sendToTelegram(orderData: OrderData): Promise<void> {
  try {
    await fetch('/api/telegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
  } catch (err) {
    console.error('Error sending to Telegram:', err);
    // Don't throw - Telegram is optional
  }
}

// Submit a new order/lead
export async function submitOrder(orderData: OrderData): Promise<OrderResult> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .insert([{
        name: orderData.name,
        email: orderData.email,
        phone: orderData.phone,
        order_type: orderData.order_type,
        from_location: orderData.from_location || null,
        to_location: orderData.to_location || null,
        departure_date: orderData.departure_date || null,
        departure_time: orderData.departure_time || null,
        passengers: orderData.passengers || 1,
        routes: orderData.routes || null,
        product_id: orderData.product_id || null,
        product_name: orderData.product_name || null,
        product_type: orderData.product_type || null,
        price: orderData.price || null,
        currency: orderData.currency || 'USD',
        message: orderData.message || null,
        source_url: orderData.source_url || (typeof window !== 'undefined' ? window.location.href : null),
        status: 'new',
      }])
      .select('id')
      .single();

    if (error) {
      console.error('Error submitting order:', error);
      return { success: false, error: error.message };
    }

    // Send to Telegram (non-blocking)
    sendToTelegram(orderData);

    return { success: true, data: { id: data.id } };
  } catch (err) {
    console.error('Error submitting order:', err);
    return { success: false, error: 'Failed to submit order' };
  }
}

// Submit a search request (lighter version for search form)
export async function submitSearchRequest(searchData: {
  from: string;
  to: string;
  date: string;
  time: string;
  passengers: number;
}): Promise<OrderResult> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .insert([{
        name: 'Search Request',
        email: 'search@pfjet.com',
        phone: '',
        order_type: 'search',
        from_location: searchData.from,
        to_location: searchData.to,
        departure_date: searchData.date,
        departure_time: searchData.time,
        passengers: searchData.passengers,
        source_url: typeof window !== 'undefined' ? window.location.href : null,
        status: 'new',
      }])
      .select('id')
      .single();

    if (error) {
      console.error('Error submitting search request:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: { id: data.id } };
  } catch (err) {
    console.error('Error submitting search request:', err);
    return { success: false, error: 'Failed to submit search request' };
  }
}

// Submit contact form
export async function submitContactForm(contactData: {
  name: string;
  email: string;
  phone: string;
  message: string;
}): Promise<OrderResult> {
  return submitOrder({
    name: contactData.name,
    email: contactData.email,
    phone: contactData.phone,
    order_type: 'contact',
    message: contactData.message,
  });
}
