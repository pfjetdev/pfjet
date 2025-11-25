import { generateAllJetSharingFlights } from '../src/lib/jetSharingGenerator';

async function testGeneration() {
  console.log('🔍 Testing Jet Sharing flight generation...\n');

  try {
    const flights = await generateAllJetSharingFlights(10);

    console.log(`✅ Generated ${flights.length} flights\n`);
    console.log('='.repeat(80));
    console.log('📋 Sample Flights with Airport Codes');
    console.log('='.repeat(80));

    for (const flight of flights.slice(0, 10)) {
      console.log(`\n${flight.from.city} (${flight.from.code}) → ${flight.to.city} (${flight.to.code})`);
      console.log(`  Date: ${flight.departureDate} ${flight.departureTime} - ${flight.arrivalTime}`);
      console.log(`  Aircraft: ${flight.aircraft.name} (${flight.aircraft.category})`);
      console.log(`  Price: $${flight.pricePerSeat}/seat`);

      // Highlight if code is generated (3 chars, all uppercase, not a real IATA)
      if (flight.from.code.length === 3 && !['JFK', 'LAX', 'MIA', 'LGA', 'EWR', 'SFO', 'ORD', 'DFW'].includes(flight.from.code)) {
        console.log(`  ⚠️  FROM code might be generated: ${flight.from.code}`);
      }
      if (flight.to.code.length === 3 && !['JFK', 'LAX', 'MIA', 'LGA', 'EWR', 'SFO', 'ORD', 'DFW'].includes(flight.to.code)) {
        console.log(`  ⚠️  TO code might be generated: ${flight.to.code}`);
      }
    }

    console.log('\n' + '='.repeat(80));

    // Check for "NEW" specifically
    const withNewCode = flights.filter(f => f.from.code === 'NEW' || f.to.code === 'NEW');
    if (withNewCode.length > 0) {
      console.log('\n🚨 FOUND FLIGHTS WITH "NEW" CODE:');
      withNewCode.forEach(f => {
        console.log(`  ${f.from.city} (${f.from.code}) → ${f.to.city} (${f.to.code})`);
      });
    } else {
      console.log('\n✅ No flights with "NEW" code found!');
    }

    console.log('\n' + '='.repeat(80));

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testGeneration().catch(console.error);
