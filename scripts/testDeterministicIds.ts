/**
 * Тест стабильности детерминированных ID
 *
 * Проверяет, что один и тот же рейс всегда получает один и тот же ID
 */

import { generateDynamicJetSharingFlights, getDynamicJetSharingFlightById } from '../src/lib/jetSharingDynamicGenerator'

async function testDeterministicIds() {
  console.log('🧪 Testing Deterministic IDs\n')

  // Генерируем рейсы первый раз
  console.log('1️⃣ Generating flights (first time)...')
  const flights1 = await generateDynamicJetSharingFlights(20)
  console.log(`   Generated ${flights1.length} flights\n`)

  // Запоминаем ID первых 5 рейсов
  const testFlights = flights1.slice(0, 5)
  console.log('📝 First 5 flight IDs:')
  testFlights.forEach((flight, i) => {
    console.log(`   ${i + 1}. ${flight.id} - ${flight.from.city} → ${flight.to.city} (${flight.departureDate} ${flight.departureTime})`)
  })
  console.log('')

  // Генерируем рейсы второй раз
  console.log('2️⃣ Generating flights (second time)...')
  const flights2 = await generateDynamicJetSharingFlights(20)
  console.log(`   Generated ${flights2.length} flights\n`)

  // Проверяем, что ID совпадают
  console.log('🔍 Checking ID stability:')
  let allMatch = true

  for (const testFlight of testFlights) {
    // Ищем такой же рейс во втором наборе
    const matchingFlight = flights2.find(f =>
      f.from.city === testFlight.from.city &&
      f.to.city === testFlight.to.city &&
      f.departureDate === testFlight.departureDate &&
      f.departureTime === testFlight.departureTime
    )

    if (!matchingFlight) {
      console.log(`   ❌ Flight not found: ${testFlight.from.city} → ${testFlight.to.city}`)
      allMatch = false
      continue
    }

    if (matchingFlight.id === testFlight.id) {
      console.log(`   ✅ ${testFlight.id} - STABLE`)
    } else {
      console.log(`   ❌ ${testFlight.id} ≠ ${matchingFlight.id} - CHANGED!`)
      allMatch = false
    }
  }

  console.log('')

  // Тестируем поиск по ID
  console.log('3️⃣ Testing flight lookup by ID:')
  for (const testFlight of testFlights.slice(0, 3)) {
    const foundFlight = await getDynamicJetSharingFlightById(testFlight.id)

    if (foundFlight && foundFlight.id === testFlight.id) {
      console.log(`   ✅ Found: ${testFlight.id} - ${foundFlight.from.city} → ${foundFlight.to.city}`)
    } else {
      console.log(`   ❌ Not found or mismatch: ${testFlight.id}`)
      allMatch = false
    }
  }

  console.log('')

  // Результаты
  if (allMatch) {
    console.log('✅ SUCCESS: All IDs are stable and deterministic!')
  } else {
    console.log('❌ FAILURE: Some IDs are not stable!')
    process.exit(1)
  }

  // Проверка формата ID
  console.log('\n4️⃣ Checking ID format:')
  testFlights.forEach(flight => {
    const isValid = flight.id.startsWith('js-') && flight.id.length > 3
    console.log(`   ${isValid ? '✅' : '❌'} ${flight.id} - ${isValid ? 'Valid format' : 'Invalid format'}`)
  })
}

// Запускаем тест
testDeterministicIds()
  .then(() => {
    console.log('\n✅ All tests passed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Test failed:', error)
    process.exit(1)
  })
