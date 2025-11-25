import dotenv from 'dotenv';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function fixEventImageUrls() {
  console.log('🔧 Fixing event image URLs...\n');

  // Get all events
  const { data: events, error } = await supabase
    .from('events')
    .select('*');

  if (error) {
    console.error('❌ Error fetching events:', error.message);
    return;
  }

  if (!events || events.length === 0) {
    console.log('⚠️  No events found in database.');
    return;
  }

  console.log(`📊 Found ${events.length} events\n`);

  let fixedCount = 0;

  for (const event of events) {
    let needsUpdate = false;
    let newImageUrl = event.image;

    // Check if URL starts with //
    if (event.image.startsWith('//')) {
      newImageUrl = `https:${event.image}`;
      needsUpdate = true;
    }
    // Check if URL doesn't have protocol at all
    else if (!event.image.startsWith('http://') && !event.image.startsWith('https://') && !event.image.startsWith('/')) {
      newImageUrl = `https://${event.image}`;
      needsUpdate = true;
    }

    if (needsUpdate) {
      console.log(`🔧 Fixing: ${event.title}`);
      console.log(`   Old: ${event.image}`);
      console.log(`   New: ${newImageUrl}`);

      const { error: updateError } = await supabase
        .from('events')
        .update({ image: newImageUrl })
        .eq('id', event.id);

      if (updateError) {
        console.error(`   ❌ Error updating:`, updateError.message);
      } else {
        console.log(`   ✅ Updated successfully\n`);
        fixedCount++;
      }
    } else {
      console.log(`✓ ${event.title} - URL is correct`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`✅ Fixed ${fixedCount} event image URLs`);
  console.log('='.repeat(60));

  // Show all current image URLs
  const { data: updatedEvents } = await supabase
    .from('events')
    .select('title, image')
    .order('date_from');

  console.log('\n📋 Current image URLs:');
  updatedEvents?.forEach((event: any) => {
    console.log(`  ${event.title}:`);
    console.log(`    ${event.image}\n`);
  });
}

fixEventImageUrls().catch(console.error);
