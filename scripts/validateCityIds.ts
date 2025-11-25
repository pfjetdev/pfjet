import dotenv from 'dotenv';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

async function validateCityIds() {
  console.log('🔍 Validating city IDs in jet_sharing_routes...\n');

  // 1. Получаем все города с их ID
  const { data: cities, error: citiesError } = await supabase
    .from('cities')
    .select('id, name, country_code');

  if (citiesError) {
    console.error('❌ Error fetching cities:', citiesError);
    return;
  }

  const cityIdSet = new Set(cities?.map(c => c.id) || []);
  const cityIdMap = new Map(cities?.map(c => [c.id, { name: c.name, country: c.country_code }]) || []);

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
  const invalidFromCityIds = new Set<string>();
  const invalidToCityIds = new Set<string>();
  const validRoutes: any[] = [];

  for (const route of routes || []) {
    let isValid = true;
    let reason = '';

    // Проверяем from_city_id
    if (!cityIdSet.has(route.from_city_id)) {
      isValid = false;
      reason += `FROM city_id "${route.from_city_id}" not found in cities table. `;
      invalidFromCityIds.add(route.from_city_id);
    }

    // Проверяем to_city_id
    if (!cityIdSet.has(route.to_city_id)) {
      isValid = false;
      reason += `TO city_id "${route.to_city_id}" not found in cities table. `;
      invalidToCityIds.add(route.to_city_id);
    }

    if (!isValid) {
      invalidRoutes.push({
        id: route.id,
        from_city_id: route.from_city_id,
        to_city_id: route.to_city_id,
        reason
      });
    } else {
      const fromCity = cityIdMap.get(route.from_city_id);
      const toCity = cityIdMap.get(route.to_city_id);
      validRoutes.push({
        id: route.id,
        from: `${fromCity?.name} (${fromCity?.country})`,
        to: `${toCity?.name} (${toCity?.country})`,
        category: route.aircraft_category
      });
    }
  }

  // 4. Выводим результаты
  console.log('='.repeat(80));
  console.log('📊 VALIDATION RESULTS');
  console.log('='.repeat(80));

  if (invalidRoutes.length === 0) {
    console.log('\n✅ All route city IDs are valid!\n');

    console.log('✅ Sample valid routes:');
    validRoutes.slice(0, 10).forEach(route => {
      console.log(`  ${route.from} → ${route.to} (${route.category})`);
    });

    if (validRoutes.length > 10) {
      console.log(`  ... and ${validRoutes.length - 10} more valid routes`);
    }

  } else {
    console.log(`\n❌ Found ${invalidRoutes.length} routes with invalid city IDs:\n`);

    for (const route of invalidRoutes.slice(0, 10)) {
      console.log(`Route ID: ${route.id}`);
      console.log(`  From City ID: ${route.from_city_id}`);
      console.log(`  To City ID: ${route.to_city_id}`);
      console.log(`  Issue: ${route.reason}`);
      console.log('');
    }

    if (invalidRoutes.length > 10) {
      console.log(`... and ${invalidRoutes.length - 10} more invalid routes\n`);
    }

    // Показываем уникальные проблемные ID
    if (invalidFromCityIds.size > 0) {
      console.log('\n❌ Invalid FROM city IDs:');
      Array.from(invalidFromCityIds).forEach(id => {
        console.log(`   - ${id}`);
      });
    }

    if (invalidToCityIds.size > 0) {
      console.log('\n❌ Invalid TO city IDs:');
      Array.from(invalidToCityIds).forEach(id => {
        console.log(`   - ${id}`);
      });
    }
  }

  console.log('\n' + '='.repeat(80));

  return {
    totalRoutes: routes?.length || 0,
    validRoutes: validRoutes.length,
    invalidRoutes: invalidRoutes.length
  };
}

validateCityIds().catch(console.error);
