import { GeolocationData, SimpleGeolocation } from '@/types/geolocation';

const IPSTACK_API_KEY = process.env.IPSTACK_API_KEY;
const IPSTACK_BASE_URL = 'http://api.ipstack.com';

/**
 * Get user's geolocation data by IP address using IPStack API
 * @param ip - IP address to lookup (optional, if not provided IPStack will use the request IP)
 * @returns GeolocationData object or null if failed
 */
export async function getGeolocation(ip?: string): Promise<GeolocationData | null> {
  try {
    if (!IPSTACK_API_KEY) {
      console.error('IPStack API key is not configured');
      return null;
    }

    const targetIP = ip || 'check'; // 'check' tells IPStack to use the request IP
    const url = `${IPSTACK_BASE_URL}/${targetIP}?access_key=${IPSTACK_API_KEY}`;

    const response = await fetch(url, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
      console.error('IPStack API request failed:', response.statusText);
      return null;
    }

    const data: GeolocationData = await response.json();

    // Check for API errors
    if ('error' in data) {
      console.error('IPStack API error:', data);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching geolocation:', error);
    return null;
  }
}

/**
 * Get simplified geolocation data
 * @param ip - IP address to lookup (optional)
 * @returns SimpleGeolocation object or null if failed
 */
export async function getSimpleGeolocation(ip?: string): Promise<SimpleGeolocation | null> {
  const data = await getGeolocation(ip);

  if (!data) {
    return null;
  }

  return {
    ip: data.ip,
    city: data.city,
    region: data.region_name,
    country: data.country_name,
    countryCode: data.country_code,
    latitude: data.latitude,
    longitude: data.longitude,
    timezone: data.time_zone?.id || '',
    currency: data.currency?.code || ''
  };
}

/**
 * Get client IP from request headers (for server-side use)
 * @param headers - Request headers
 * @returns IP address or null
 */
export function getClientIP(headers: Headers): string | null {
  // Try different headers that might contain the client IP
  // Order matters: more specific headers first
  const possibleHeaders = [
    'x-real-ip',           // Vercel, Nginx
    'x-forwarded-for',     // Standard proxy header
    'cf-connecting-ip',    // Cloudflare
    'x-vercel-forwarded-for', // Vercel specific
    'x-client-ip',
    'x-cluster-client-ip',
    'forwarded'            // RFC 7239
  ];

  for (const header of possibleHeaders) {
    const value = headers.get(header);
    if (value) {
      // x-forwarded-for might contain multiple IPs (client, proxy1, proxy2, ...)
      // Take the first one (original client IP)
      const ip = value.split(',')[0].trim();

      // Skip localhost/private IPs in production
      if (ip && !ip.startsWith('127.') && !ip.startsWith('::1') && !ip.startsWith('10.')) {
        return ip;
      }
    }
  }

  return null;
}
