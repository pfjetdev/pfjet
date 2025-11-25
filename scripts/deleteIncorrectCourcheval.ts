import dotenv from 'dotenv';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

async function deleteIncorrectCourcheval() {
  console.log('🗑️  Deleting incorrect "Courcheval" entry...\n');

  // Delete the typo version "Courcheval"
  const { data, error } = await supabase
    .from('cities')
    .delete()
    .eq('name', 'Courcheval')
    .eq('country_code', 'FR')
    .select();

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  console.log('✅ Deleted:', data);
  console.log('\n✅ Done! Now only correct "Courchevel" remains.');
}

deleteIncorrectCourcheval().catch(console.error);
