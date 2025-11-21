import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Convert Russian duration format to English
function convertDuration(duration: string): string {
  const trimmed = duration.trim();

  // Already in correct English format (with space)
  if (trimmed.match(/^\d+h\s+\d+min$/)) {
    return trimmed;
  }

  // Format: "40min" -> "40min" (already correct)
  if (trimmed.match(/^\d+min$/)) {
    return trimmed;
  }

  // Format: "1h" -> "1h" (already correct)
  if (trimmed.match(/^\d+h$/)) {
    return trimmed;
  }

  // Format: "60 min" -> "60min"
  const spaceMinMatch = trimmed.match(/^(\d+)\s+min$/);
  if (spaceMinMatch) {
    return `${spaceMinMatch[1]}min`;
  }

  // Handle range with hours: "1 ч 35–1 ч 45"
  const hourRangeMatch = trimmed.match(/(\d+)\s*ч\s*(\d+)\s*[–-]\s*(\d+)\s*ч\s*(\d+)/);
  if (hourRangeMatch) {
    const startHours = parseInt(hourRangeMatch[1]);
    const startMinutes = parseInt(hourRangeMatch[2]);
    const endHours = parseInt(hourRangeMatch[3]);
    const endMinutes = parseInt(hourRangeMatch[4]);

    const startTotal = startHours * 60 + startMinutes;
    const endTotal = endHours * 60 + endMinutes;
    const avgMinutes = Math.round((startTotal + endTotal) / 2);

    const hours = Math.floor(avgMinutes / 60);
    const minutes = avgMinutes % 60;

    if (minutes === 0) {
      return `${hours}h`;
    }
    return `${hours}h ${minutes}min`;
  }

  // Handle range formats like "48–55 мін"
  const minuteRangeMatch = trimmed.match(/(\d+)\s*[–-]\s*(\d+)\s*(?:мін|мин)/);
  if (minuteRangeMatch) {
    const start = parseInt(minuteRangeMatch[1]);
    const end = parseInt(minuteRangeMatch[2]);
    const avgMinutes = Math.round((start + end) / 2);

    const hours = Math.floor(avgMinutes / 60);
    const minutes = avgMinutes % 60;

    if (hours > 0 && minutes > 0) {
      return `${hours}h ${minutes}min`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${minutes}min`;
    }
  }

  // Handle simple formats like "1 ч 40 мін"
  const simpleMatch = trimmed.match(/(\d+)\s*ч\s*(\d+)\s*(?:мін|мин)/);
  if (simpleMatch) {
    const hours = parseInt(simpleMatch[1]);
    const minutes = parseInt(simpleMatch[2]);

    if (minutes === 0) {
      return `${hours}h`;
    }
    return `${hours}h ${minutes}min`;
  }

  // Handle number range without units: "10-20" -> assume minutes
  const numberRangeMatch = trimmed.match(/^(\d+)\s*-\s*(\d+)$/);
  if (numberRangeMatch) {
    const start = parseInt(numberRangeMatch[1]);
    const end = parseInt(numberRangeMatch[2]);
    const avg = Math.round((start + end) / 2);
    return `${avg}min`;
  }

  // Fallback
  console.warn(`Could not parse duration: ${duration}`);
  return duration;
}

async function updateDurations() {
  try {
    console.log('Fetching all empty leg routes...\n');

    // Fetch all routes
    const { data: routes, error: fetchError } = await supabase
      .from('empty_leg_routes')
      .select('id, duration');

    if (fetchError) {
      console.error('Error fetching routes:', fetchError);
      throw fetchError;
    }

    if (!routes || routes.length === 0) {
      console.log('No routes found.');
      return;
    }

    console.log(`Found ${routes.length} routes\n`);

    let updated = 0;
    let skipped = 0;
    const updates = [];

    for (const route of routes) {
      const originalDuration = route.duration;
      const convertedDuration = convertDuration(originalDuration);

      if (originalDuration !== convertedDuration) {
        updates.push({
          id: route.id,
          original: originalDuration,
          converted: convertedDuration,
        });

        // Update in database
        const { error: updateError } = await supabase
          .from('empty_leg_routes')
          .update({ duration: convertedDuration })
          .eq('id', route.id);

        if (updateError) {
          console.error(`Error updating route ${route.id}:`, updateError);
        } else {
          updated++;
          console.log(`✓ Updated: "${originalDuration}" → "${convertedDuration}"`);
        }
      } else {
        skipped++;
      }
    }

    console.log(`\n✅ Update complete!`);
    console.log(`Updated: ${updated} routes`);
    console.log(`Skipped: ${skipped} routes (already in correct format)`);

    if (updates.length > 0) {
      console.log(`\nSample updates:`);
      updates.slice(0, 10).forEach(u => {
        console.log(`  "${u.original}" → "${u.converted}"`);
      });
    }

  } catch (error) {
    console.error('Update failed:', error);
    process.exit(1);
  }
}

// Run update
updateDurations().then(() => process.exit(0));
