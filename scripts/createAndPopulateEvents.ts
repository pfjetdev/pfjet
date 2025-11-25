import dotenv from 'dotenv';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const eventsData = [
  {
    title: "Monaco Grand Prix 2026",
    price: 15000,
    description: "Exclusive access to the most prestigious Formula 1 race in Monaco. Includes VIP seats, paddock access and meet & greet with drivers.",
    date_from: "2026-05-25",
    date_to: "2026-05-28",
    date_display: "May 25-28, 2026",
    location: "Monte Carlo, Monaco",
    capacity: 50,
    image: "/car.jpg"
  },
  {
    title: "Cannes Film Festival 2026",
    price: 8500,
    description: "Join movie stars on the red carpet at the Cannes Film Festival. Film premieres, gala dinners and exclusive parties.",
    date_from: "2026-05-12",
    date_to: "2026-05-23",
    date_display: "May 12-23, 2026",
    location: "Cannes, France",
    capacity: 100,
    image: "/night.jpg"
  },
  {
    title: "Wimbledon Finals 2026",
    price: 12000,
    description: "Centre Court at Wimbledon awaits you! Enjoy the final matches of the world's most prestigious tennis tournament.",
    date_from: "2026-06-29",
    date_to: "2026-07-12",
    date_display: "June 29 - July 12, 2026",
    location: "London, United Kingdom",
    capacity: 75,
    image: "/day.jpg"
  },
  {
    title: "Art Basel Miami 2026",
    price: 6000,
    description: "Discover contemporary art at one of the world's most influential art fairs. Private viewings and artist meet & greets.",
    date_from: "2026-12-03",
    date_to: "2026-12-06",
    date_display: "December 3-6, 2026",
    location: "Miami Beach, USA",
    capacity: 120,
    image: "/night.jpg"
  },
  {
    title: "World Economic Forum 2026",
    price: 25000,
    description: "Participate in global discussions about the future of economy and technology. Networking with world leaders and innovators.",
    date_from: "2026-01-17",
    date_to: "2026-01-21",
    date_display: "January 17-21, 2026",
    location: "Davos, Switzerland",
    capacity: 200,
    image: "/hotel.jpg"
  }
];

async function createAndPopulateEvents() {
  console.log('🚀 Creating events table and populating data...\n');

  // Read SQL file
  const sqlPath = path.resolve(process.cwd(), 'scripts/createEventsTable.sql');
  const sql = fs.readFileSync(sqlPath, 'utf-8');

  console.log('📝 Executing SQL to create table...');

  // Execute SQL using Supabase REST API
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`
      },
      body: JSON.stringify({ query: sql })
    });

    if (!response.ok) {
      console.log('⚠️  Could not execute SQL directly. Please run scripts/createEventsTable.sql in Supabase SQL Editor manually.');
      console.log('   Then run: npx tsx scripts/setupEvents.ts\n');
      return;
    }

    console.log('✅ Table created successfully!\n');
  } catch (error) {
    console.log('⚠️  Could not execute SQL directly. Please run scripts/createEventsTable.sql in Supabase SQL Editor manually.');
    console.log('   Then run: npx tsx scripts/setupEvents.ts\n');
    return;
  }

  // Insert events
  console.log('📝 Inserting events...\n');

  for (const event of eventsData) {
    console.log(`  Adding: ${event.title}`);
    const { error } = await supabase
      .from('events')
      .insert(event);

    if (error) {
      console.error(`  ❌ Error inserting ${event.title}:`, error.message);
    } else {
      console.log(`  ✅ Added successfully`);
    }
  }

  console.log('\n✅ Events setup completed!');
  console.log(`📊 Total events: ${eventsData.length}\n`);

  // Verify
  const { data: allEvents } = await supabase
    .from('events')
    .select('*')
    .order('date_from');

  console.log('📋 All events in database:');
  allEvents?.forEach((event: any) => {
    console.log(`  - ${event.title} (${event.date_display})`);
  });
}

createAndPopulateEvents().catch(console.error);
