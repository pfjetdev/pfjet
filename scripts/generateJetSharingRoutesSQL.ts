import * as fs from 'fs';

// City name mapping - some cities have different names in DB
const cityNameMapping: Record<string, string> = {
  'New York': 'New York City',
  'Maldives': 'Malé',
  'Turks and Caicos': 'Providenciales',
  'St. Barts': 'Gustavia',
  'St. Maarten': 'Philipsburg',
};

// Read city data from previous script
const cityData = JSON.parse(fs.readFileSync('/tmp/jet-sharing-cities.json', 'utf8'));
const cityMap = cityData.cityMap;

// Function to get city ID
function getCityId(cityName: string): string | null {
  const mappedName = cityNameMapping[cityName] || cityName;
  const city = cityMap[mappedName];
  return city ? city.id : null;
}

// Define all routes from jet-sharing.md with durations and aircraft categories
interface Route {
  from: string;
  to: string;
  duration: string;
  category: string;
  distanceNm?: number;
  isPopular?: boolean;
}

const routes: Route[] = [
  // 🇺🇸 North America
  { from: 'New York', to: 'Miami', duration: '2h 45m', category: 'Super Light', distanceNm: 1090, isPopular: true },
  { from: 'Los Angeles', to: 'Las Vegas', duration: '45m', category: 'Very Light', distanceNm: 236, isPopular: true },
  { from: 'New York', to: 'Los Angeles', duration: '5h 30m', category: 'Heavy', distanceNm: 2451, isPopular: true },
  { from: 'San Francisco', to: 'New York', duration: '5h 20m', category: 'Heavy', distanceNm: 2565, isPopular: true },
  { from: 'Chicago', to: 'New York', duration: '2h 00m', category: 'Midsize', distanceNm: 740, isPopular: true },
  { from: 'Los Angeles', to: 'San Francisco', duration: '1h 15m', category: 'Light', distanceNm: 337, isPopular: true },
  { from: 'Dallas', to: 'Los Angeles', duration: '3h 00m', category: 'Super Midsize', distanceNm: 1235, isPopular: false },
  { from: 'Miami', to: 'Nassau', duration: '50m', category: 'Very Light', distanceNm: 184, isPopular: false },
  { from: 'New York', to: 'Aspen', duration: '4h 15m', category: 'Super Midsize', distanceNm: 1726, isPopular: false },
  { from: 'Los Angeles', to: 'Aspen', duration: '2h 00m', category: 'Midsize', distanceNm: 767, isPopular: false },

  // 🇪🇺 Europe
  { from: 'London', to: 'Paris', duration: '1h 00m', category: 'Very Light', distanceNm: 213, isPopular: true },
  { from: 'London', to: 'Geneva', duration: '1h 40m', category: 'Light', distanceNm: 468, isPopular: true },
  { from: 'London', to: 'Dubai', duration: '6h 45m', category: 'Ultra Long Range', distanceNm: 2992, isPopular: true },
  { from: 'Paris', to: 'Nice', duration: '1h 20m', category: 'Very Light', distanceNm: 359, isPopular: true },
  { from: 'Zurich', to: 'London', duration: '1h 50m', category: 'Light', distanceNm: 493, isPopular: false },
  { from: 'Milan', to: 'Paris', duration: '1h 30m', category: 'Light', distanceNm: 396, isPopular: false },
  { from: 'Nice', to: 'London', duration: '2h 00m', category: 'Light', distanceNm: 597, isPopular: false },
  { from: 'Geneva', to: 'Nice', duration: '1h 00m', category: 'Very Light', distanceNm: 180, isPopular: false },
  { from: 'Monaco', to: 'London', duration: '2h 00m', category: 'Light', distanceNm: 597, isPopular: false },
  { from: 'Frankfurt', to: 'London', duration: '1h 40m', category: 'Light', distanceNm: 406, isPopular: false },

  // 🇦🇪 / 🌏 Middle East & Asia
  { from: 'Dubai', to: 'Maldives', duration: '4h 10m', category: 'Super Midsize', distanceNm: 1762, isPopular: true },
  { from: 'Doha', to: 'Dubai', duration: '1h 00m', category: 'Very Light', distanceNm: 200, isPopular: false },
  { from: 'Dubai', to: 'London', duration: '6h 45m', category: 'Ultra Long Range', distanceNm: 2992, isPopular: true },
  { from: 'Dubai', to: 'Singapore', duration: '7h 00m', category: 'Ultra Long Range', distanceNm: 2897, isPopular: false },
  { from: 'Hong Kong', to: 'Tokyo', duration: '4h 30m', category: 'Heavy', distanceNm: 1823, isPopular: true },
  { from: 'Singapore', to: 'Bali', duration: '2h 30m', category: 'Midsize', distanceNm: 1018, isPopular: false },
  { from: 'Hong Kong', to: 'Shanghai', duration: '2h 20m', category: 'Midsize', distanceNm: 756, isPopular: false },
  { from: 'Tokyo', to: 'Seoul', duration: '2h 15m', category: 'Midsize', distanceNm: 750, isPopular: false },
  { from: 'Dubai', to: 'Riyadh', duration: '2h 00m', category: 'Midsize', distanceNm: 527, isPopular: false },
  { from: 'Dubai', to: 'Mumbai', duration: '3h 00m', category: 'Super Midsize', distanceNm: 1143, isPopular: false },

  // 🌴 Caribbean & South America
  { from: 'Miami', to: 'Turks and Caicos', duration: '1h 40m', category: 'Light', distanceNm: 527, isPopular: true },
  { from: 'Miami', to: 'St. Barts', duration: '2h 45m', category: 'Super Light', distanceNm: 1063, isPopular: false },
  { from: 'St. Maarten', to: 'St. Barts', duration: '15m', category: 'Turboprop', distanceNm: 15, isPopular: false },
  { from: 'São Paulo', to: 'Rio de Janeiro', duration: '55m', category: 'Light', distanceNm: 229, isPopular: true },
  { from: 'Mexico City', to: 'Los Angeles', duration: '3h 30m', category: 'Super Midsize', distanceNm: 1548, isPopular: false },

  // 🌍 Oceania & Africa
  { from: 'Sydney', to: 'Melbourne', duration: '1h 30m', category: 'Light', distanceNm: 444, isPopular: true },
  { from: 'Sydney', to: 'Auckland', duration: '3h 00m', category: 'Super Midsize', distanceNm: 1338, isPopular: false },
  { from: 'Cape Town', to: 'Johannesburg', duration: '2h 00m', category: 'Midsize', distanceNm: 769, isPopular: false },
  { from: 'Dubai', to: 'Cape Town', duration: '9h 30m', category: 'Ultra Long Range', distanceNm: 4135, isPopular: false },
  { from: 'London', to: 'Cape Town', duration: '11h 30m', category: 'Ultra Long Range', distanceNm: 5951, isPopular: false },
];

// Generate SQL
let sql = `-- Jet Sharing Routes
-- Generated from jet-sharing.md
-- This script populates the jet_sharing_routes table with all routes

-- Clear existing data (optional - comment out if you want to keep existing routes)
-- DELETE FROM jet_sharing_routes;

`;

let successCount = 0;
let errorCount = 0;
const errors: string[] = [];

routes.forEach((route, index) => {
  const fromId = getCityId(route.from);
  const toId = getCityId(route.to);

  if (!fromId || !toId) {
    errorCount++;
    const missing = !fromId ? route.from : route.to;
    errors.push(`Route ${index + 1}: Missing city "${missing}"`);
    sql += `-- ERROR: Missing city for route ${route.from} → ${route.to}\n`;
    return;
  }

  successCount++;
  const isPopular = route.isPopular ?? false;
  const distanceNm = route.distanceNm ?? 0;

  sql += `-- ${route.from} → ${route.to} (${route.duration})\n`;
  sql += `INSERT INTO jet_sharing_routes (from_city_id, to_city_id, aircraft_category, distance_nm, duration, is_popular)\n`;
  sql += `VALUES ('${fromId}', '${toId}', '${route.category}', ${distanceNm}, '${route.duration}', ${isPopular})\n`;
  sql += `ON CONFLICT DO NOTHING;\n\n`;
});

sql += `\n-- Verify routes were added\n`;
sql += `SELECT COUNT(*) as total_routes FROM jet_sharing_routes;\n\n`;
sql += `-- Show popular routes\n`;
sql += `SELECT
  c1.name as from_city,
  c2.name as to_city,
  jsr.aircraft_category,
  jsr.duration,
  jsr.distance_nm,
  jsr.is_popular
FROM jet_sharing_routes jsr
JOIN cities c1 ON jsr.from_city_id = c1.id
JOIN cities c2 ON jsr.to_city_id = c2.id
WHERE jsr.is_popular = true
ORDER BY c1.name, c2.name;\n`;

// Write SQL file
fs.writeFileSync('scripts/insertJetSharingRoutes.sql', sql);

console.log('\n✅ SQL script generated!\n');
console.log(`📊 Statistics:`);
console.log(`   Routes processed: ${routes.length}`);
console.log(`   ✅ Success: ${successCount}`);
console.log(`   ❌ Errors: ${errorCount}\n`);

if (errors.length > 0) {
  console.log('⚠️  Errors:');
  errors.forEach(err => console.log(`   ${err}`));
  console.log('\n💡 Run addMissingCitiesForJetSharing.sql first to add missing cities\n');
}

console.log(`📁 SQL file saved to: scripts/insertJetSharingRoutes.sql`);
