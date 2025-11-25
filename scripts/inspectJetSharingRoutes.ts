import dotenv from 'dotenv';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

async function inspectRoutes() {
  console.log('🔍 Inspecting jet_sharing_routes table...\n');

  // Получаем первые 5 маршрутов со всеми полями
  const { data: routes, error } = await supabase
    .from('jet_sharing_routes')
    .select('*')
    .limit(5);

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  console.log('📊 Sample routes (first 5):\n');

  if (routes && routes.length > 0) {
    // Показываем первый маршрут полностью
    console.log('First route (full object):');
    console.log(JSON.stringify(routes[0], null, 2));
    console.log('\n');

    // Показываем все поля первого маршрута
    console.log('Available fields:');
    Object.keys(routes[0]).forEach(key => {
      console.log(`  - ${key}: ${typeof routes[0][key]} = ${routes[0][key]}`);
    });
  } else {
    console.log('No routes found');
  }
}

inspectRoutes().catch(console.error);
