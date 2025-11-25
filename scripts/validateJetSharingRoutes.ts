import dotenv from 'dotenv';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

async function validateRoutes() {
  console.log('🔍 Validating Jet Sharing routes...\n');

  // 1. Получаем все города из базы
  const { data: cities, error: citiesError } = await supabase
    .from('cities')
    .select('name, country_code');

  if (citiesError) {
    console.error('❌ Error fetching cities:', citiesError);
    return;
  }

  const citySet = new Set(cities?.map(c => `${c.name}|${c.country_code}`) || []);
  const cityNames = new Set(cities?.map(c => c.name) || []);

  console.log(`✅ Found ${cities?.length || 0} cities in database\n`);

  // 2. Получаем все маршруты
  const { data: routes, error: routesError } = await supabase
    .from('jet_sharing_routes')
    .select('*');

  if (routesError) {
    console.error('❌ Error fetching routes:', routesError);
    return;
  }

  console.log(`✅ Found ${routes?.length || 0} routes in jet_sharing_routes\n`);

  // 3. Проверяем каждый маршрут
  const invalidRoutes: any[] = [];
  const invalidFromCities = new Set<string>();
  const invalidToCities = new Set<string>();

  for (const route of routes || []) {
    const fromKey = `${route.from_city}|${route.from_country}`;
    const toKey = `${route.to_city}|${route.to_country}`;

    let isValid = true;
    let reason = '';

    // Проверяем from_city
    if (!cityNames.has(route.from_city)) {
      isValid = false;
      reason += `FROM city "${route.from_city}" not found in cities table. `;
      invalidFromCities.add(route.from_city);
    } else if (!citySet.has(fromKey)) {
      isValid = false;
      reason += `FROM city "${route.from_city}" exists but with different country code. `;
    }

    // Проверяем to_city
    if (!cityNames.has(route.to_city)) {
      isValid = false;
      reason += `TO city "${route.to_city}" not found in cities table. `;
      invalidToCities.add(route.to_city);
    } else if (!citySet.has(toKey)) {
      isValid = false;
      reason += `TO city "${route.to_city}" exists but with different country code. `;
    }

    if (!isValid) {
      invalidRoutes.push({
        id: route.id,
        from: `${route.from_city} (${route.from_country})`,
        to: `${route.to_city} (${route.to_country})`,
        reason
      });
    }
  }

  // 4. Выводим результаты
  console.log('='.repeat(80));
  console.log('📊 VALIDATION RESULTS');
  console.log('='.repeat(80));

  if (invalidRoutes.length === 0) {
    console.log('\n✅ All routes are valid! No issues found.');
  } else {
    console.log(`\n❌ Found ${invalidRoutes.length} invalid routes:\n`);

    for (const route of invalidRoutes.slice(0, 20)) {
      console.log(`Route ID: ${route.id}`);
      console.log(`  From: ${route.from}`);
      console.log(`  To: ${route.to}`);
      console.log(`  Issue: ${route.reason}`);
      console.log('');
    }

    if (invalidRoutes.length > 20) {
      console.log(`... and ${invalidRoutes.length - 20} more invalid routes\n`);
    }

    // Показываем уникальные проблемные города
    if (invalidFromCities.size > 0) {
      console.log('\n❌ Cities not found in database (FROM):');
      Array.from(invalidFromCities).slice(0, 10).forEach(city => {
        console.log(`   - ${city}`);
      });
      if (invalidFromCities.size > 10) {
        console.log(`   ... and ${invalidFromCities.size - 10} more`);
      }
    }

    if (invalidToCities.size > 0) {
      console.log('\n❌ Cities not found in database (TO):');
      Array.from(invalidToCities).slice(0, 10).forEach(city => {
        console.log(`   - ${city}`);
      });
      if (invalidToCities.size > 10) {
        console.log(`   ... and ${invalidToCities.size - 10} more`);
      }
    }
  }

  console.log('\n' + '='.repeat(80));

  return {
    totalRoutes: routes?.length || 0,
    invalidRoutes: invalidRoutes.length,
    invalidFromCities: Array.from(invalidFromCities),
    invalidToCities: Array.from(invalidToCities)
  };
}

validateRoutes().catch(console.error);
