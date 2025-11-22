import { NextRequest, NextResponse } from 'next/server';
import { getClientIP, getSimpleGeolocation } from '@/lib/geolocation';

export async function GET(request: NextRequest) {
  try {
    // Get client IP from headers
    const clientIP = getClientIP(request.headers);

    // Fetch geolocation data
    const geolocation = await getSimpleGeolocation(clientIP || undefined);

    if (!geolocation) {
      return NextResponse.json(
        { error: 'Failed to fetch geolocation data' },
        { status: 500 }
      );
    }

    return NextResponse.json(geolocation);
  } catch (error) {
    console.error('Geolocation API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
