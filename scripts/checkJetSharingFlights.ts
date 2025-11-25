import { supabase } from '../src/lib/supabase';

async function checkFlights() {
  console.log('🔍 Checking jet_sharing_flights table...\n');

  // Check if table exists and has data
  const { data: flights, error, count } = await supabase
    .from('jet_sharing_flights')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('❌ Table does not exist or error:', error.message);
    console.log('\n💡 You need to create the table first!');
    console.log('   Run: scripts/supabase-jet-sharing-schema.sql');
    return;
  }

  console.log(`📊 jet_sharing_flights table EXISTS`);
  console.log(`   Total flights: ${count || 0}\n`);

  if (count === 0) {
    console.log('⚠️  Table is EMPTY - no flights found!');
    console.log('\n💡 Solution: Generate flights from routes using dynamic generator');
    console.log('   OR create flights manually in Supabase');
  } else {
    console.log(`✅ Found ${count} flights in database`);
  }

  // Check routes
  const { data: routes, error: routesError, count: routesCount } = await supabase
    .from('jet_sharing_routes')
    .select('*', { count: 'exact', head: true });

  if (!routesError) {
    console.log(`\n📊 jet_sharing_routes table:`);
    console.log(`   Total routes: ${routesCount || 0}`);
  }

  // Check current mode
  console.log(`\n⚙️  Current mode: ${process.env.NEXT_PUBLIC_JET_SHARING_MODE || 'dynamic'}`);
  console.log(`   - 'dynamic': Shows only generated flights (current)`);
  console.log(`   - 'static': Shows only DB flights`);
  console.log(`   - 'hybrid': Shows both`);
}

checkFlights();
