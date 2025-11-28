import airportsData from './airports-full.json';

export interface Airport {
  code: string;
  icao: string;
  name: string;
  city: string;
  state?: string;
  country: string;
  elevation?: number;
  lat?: number;
  lon?: number;
  tz?: string;
}

// Process the JSON data to create a searchable array
let airportsArray: Airport[] | null = null;

function getAirportsArray(): Airport[] {
  if (airportsArray) return airportsArray;

  airportsArray = Object.entries(airportsData as Record<string, any>)
    .filter(([_, data]) => data.iata && data.iata.trim() !== '') // Only airports with IATA codes
    .map(([icao, data]) => ({
      code: data.iata,
      icao: icao,
      name: data.name,
      city: data.city,
      state: data.state,
      country: data.country,
      elevation: data.elevation,
      lat: data.lat,
      lon: data.lon,
      tz: data.tz
    }));

  return airportsArray;
}

// Export function to get all airports
export function getAllAirports(): Airport[] {
  return getAirportsArray();
}

// Helper function to search airports with smart ranking
export function searchAirports(query: string): Airport[] {
  if (!query || query.length < 1) return [];

  const lowerQuery = query.toLowerCase();
  const upperQuery = query.toUpperCase();
  const airports = getAirportsArray();

  // Score each airport based on match quality
  const scored = airports
    .map(airport => {
      let score = 0;
      const lowerCode = airport.code.toLowerCase();
      const lowerIcao = airport.icao.toLowerCase();
      const lowerCity = airport.city.toLowerCase();
      const lowerName = airport.name.toLowerCase();
      const lowerCountry = airport.country.toLowerCase();

      // Exact IATA code match - highest priority (100 points)
      if (airport.code === upperQuery) {
        score = 100;
      }
      // Exact ICAO code match (90 points)
      else if (airport.icao === upperQuery) {
        score = 90;
      }
      // IATA code starts with query (80 points)
      else if (lowerCode.startsWith(lowerQuery)) {
        score = 80;
      }
      // ICAO code starts with query (70 points)
      else if (lowerIcao.startsWith(lowerQuery)) {
        score = 70;
      }
      // City starts with query (60 points)
      else if (lowerCity.startsWith(lowerQuery)) {
        score = 60;
      }
      // IATA code contains query (50 points)
      else if (lowerCode.includes(lowerQuery)) {
        score = 50;
      }
      // ICAO code contains query (40 points)
      else if (lowerIcao.includes(lowerQuery)) {
        score = 40;
      }
      // City contains query (30 points)
      else if (lowerCity.includes(lowerQuery)) {
        score = 30;
      }
      // Name contains query (20 points)
      else if (lowerName.includes(lowerQuery)) {
        score = 20;
      }
      // Country contains query (10 points)
      else if (lowerCountry.includes(lowerQuery)) {
        score = 10;
      }

      return { airport, score };
    })
    .filter(item => item.score > 0) // Only keep matches
    .sort((a, b) => {
      // Sort by score (descending), then by name (ascending)
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return a.airport.name.localeCompare(b.airport.name);
    })
    .slice(0, 15) // Limit to 15 results
    .map(item => item.airport);

  return scored;
}

// Mapping of cities/destinations without airports to their nearest major airports
const nearestAirportMapping: Record<string, string> = {
  // Europe
  'monaco': 'NCE',           // Nice Côte d'Azur
  'courchevel': 'GVA',       // Geneva (Courchevel altiport CVF has no city name)
  'st. moritz': 'ZRH',       // Zurich (Samedan SMV has no city name)
  'sardinia': 'OLB',         // Olbia Costa Smeralda
  'mallorca': 'PMI',         // Palma de Mallorca
  'mykonos': 'JMK',          // Mykonos
  'ibiza': 'IBZ',            // Ibiza
  'salzburg': 'SZG',         // Salzburg
  // Caribbean & Islands
  'bahamas': 'NAS',          // Nassau
  'maldives': 'MLE',         // Malé
  'seychelles': 'SEZ',       // Mahé
  'mauritius': 'MRU',        // Sir Seewoosagur Ramgoolam
  'fiji': 'NAN',             // Nadi
  'aruba': 'AUA',            // Queen Beatrix
  'zanzibar': 'ZNZ',         // Abeid Amani Karume
  // Americas
  'cabo san lucas': 'SJD',   // San José del Cabo
  'aspen': 'ASE',            // Aspen/Pitkin County
  'cancun': 'CUN',           // Cancún
  // South America
  'punta del este': 'PDP',   // Punta del Este
  'cusco': 'CUZ',            // Alejandro Velasco Astete
  'cartagena': 'CTG',        // Rafael Núñez
  'mendoza': 'MDZ',          // El Plumerillo
  'florianópolis': 'FLN',    // Hercílio Luz
  'bariloche': 'BRC',        // San Carlos de Bariloche
  'galápagos': 'GPS',        // Seymour
  // Africa
  'cape town': 'CPT',        // Cape Town
  'sharm el sheikh': 'SSH',  // Sharm el-Sheikh
  'casablanca': 'CMN',       // Mohammed V
  'accra': 'ACC',            // Kotoka
  'addis ababa': 'ADD',      // Bole
  'victoria falls': 'VFA',   // Victoria Falls
  'marrakech': 'RAK',        // Menara
  // Oceania
  'queenstown': 'ZQN',       // Queenstown
  'gold coast': 'OOL',       // Gold Coast
  'tasmania': 'HBA',         // Hobart
  'great barrier reef': 'CNS', // Cairns
  'wellington': 'WLG',       // Wellington
};

// Find the main airport for a city (returns first match, which is usually the main airport)
export function findAirportByCity(cityName: string): Airport | null {
  if (!cityName) return null;

  const lowerCity = cityName.toLowerCase();
  const airports = getAirportsArray();

  // First check if we have a manual mapping for this city
  const mappedCode = nearestAirportMapping[lowerCity];
  if (mappedCode) {
    const mappedAirport = airports.find(a => a.code === mappedCode);
    if (mappedAirport) return mappedAirport;
  }

  // Then try exact city match
  const exactMatch = airports.find(a => a.city.toLowerCase() === lowerCity);
  if (exactMatch) return exactMatch;

  // Then try city starts with
  const startsWithMatch = airports.find(a => a.city.toLowerCase().startsWith(lowerCity));
  if (startsWithMatch) return startsWithMatch;

  // Finally try city contains
  const containsMatch = airports.find(a => a.city.toLowerCase().includes(lowerCity));
  return containsMatch || null;
}
