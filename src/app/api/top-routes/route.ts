import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getSimpleGeolocation, getClientIP } from '@/lib/geolocation';
import { getContinentByCountryCode } from '@/lib/continents';
import { getTopRoutesWithImages } from '@/lib/topRoutesGenerator';

// Cache for 1 hour
export const revalidate = 3600;

export async function GET(request: NextRequest) {
  try {
    // Get client IP from request headers
    const headersList = await headers();
    const clientIP = getClientIP(headersList);

    // Get geolocation (cached by IP in the geolocation function)
    const geolocation = await getSimpleGeolocation(clientIP || undefined);

    // Determine continent
    const continent = geolocation
      ? getContinentByCountryCode(geolocation.countryCode)
      : 'Europe';

    // Get routes with images
    const routes = await getTopRoutesWithImages(continent, geolocation?.city);

    return NextResponse.json({
      routes,
      userCity: geolocation?.city || null,
      continent,
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    });
  } catch (error) {
    console.error('Error in top-routes API:', error);
    // Return default Europe routes on error
    const routes = await getTopRoutesWithImages('Europe');
    return NextResponse.json({
      routes,
      userCity: null,
      continent: 'Europe',
    });
  }
}
