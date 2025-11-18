import { Airport } from '@/data/airports';

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Get user's current location
 */
export async function getCurrentLocation(): Promise<GeolocationCoordinates | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.warn('Geolocation is not supported by this browser.');
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position.coords),
      (error) => {
        console.warn('Error getting location:', error.message);
        resolve(null);
      },
      {
        timeout: 5000,
        maximumAge: 300000, // 5 minutes cache
      }
    );
  });
}

/**
 * Find nearby airports based on user's location
 */
export async function findNearbyAirports(
  airports: Airport[],
  limit: number = 5
): Promise<Airport[]> {
  const location = await getCurrentLocation();

  if (!location) {
    return [];
  }

  // Filter airports with coordinates
  const airportsWithCoords = airports.filter(
    (airport) => airport.lat !== undefined && airport.lon !== undefined
  );

  // Calculate distance for each airport and sort
  const airportsWithDistance = airportsWithCoords
    .map((airport) => ({
      ...airport,
      distance: calculateDistance(
        location.latitude,
        location.longitude,
        airport.lat!,
        airport.lon!
      ),
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit);

  return airportsWithDistance;
}

/**
 * Format distance for display
 */
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)}m`;
  }
  return `${Math.round(km)}km`;
}
