import { NextRequest, NextResponse } from 'next/server';
import { getSimpleGeolocation } from '@/lib/geolocation';
import { getContinentByCountryCode } from '@/lib/continents';
import { getTopRoutesWithImages } from '@/lib/topRoutesGenerator';

// Helper to get client IP from request
function getClientIPFromRequest(request: NextRequest): string | null {
  // Vercel-specific header
  const vercelIP = request.headers.get('x-real-ip');
  if (vercelIP) return vercelIP;

  // Standard forwarded header
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  return null;
}

export async function GET(request: NextRequest) {
  try {
    // Get client IP from request headers
    const clientIP = getClientIPFromRequest(request);

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
