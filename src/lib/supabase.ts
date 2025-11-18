import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export interface Country {
  code: string;
  name: string;
  flag: string;
  image: string;
  description: string;
  continent: string;
}

export interface City {
  id: number;
  country_code: string;
  name: string;
  image: string;
  description: string;
  is_capital: boolean;
}
