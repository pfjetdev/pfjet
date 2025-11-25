import { supabase } from '../src/lib/supabase';

async function checkNewYork() {
  const { data, error } = await supabase
    .from('cities')
    .select('id, name, country_code')
    .ilike('name', '%york%');

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('Cities containing "york":');
  console.log(data);
}

checkNewYork();
