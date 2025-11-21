import { supabase } from '../src/lib/supabase';

async function checkSchema() {
  const { data, error } = await supabase
    .from('countries')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('Sample country data:');
  console.log(JSON.stringify(data, null, 2));

  if (data && data.length > 0) {
    console.log('\nAvailable columns:');
    console.log(Object.keys(data[0]).join(', '));
  }
}

checkSchema();
