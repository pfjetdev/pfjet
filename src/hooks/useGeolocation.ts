'use client';

import { useState, useEffect } from 'react';
import { SimpleGeolocation } from '@/types/geolocation';

interface UseGeolocationResult {
  data: SimpleGeolocation | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * React hook to get user's geolocation data
 * Automatically fetches geolocation on mount
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { data, loading, error } = useGeolocation();
 *
 *   if (loading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error}</div>;
 *   if (!data) return null;
 *
 *   return (
 *     <div>
 *       <p>Your location: {data.city}, {data.country}</p>
 *       <p>Currency: {data.currency}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function useGeolocation(): UseGeolocationResult {
  const [data, setData] = useState<SimpleGeolocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGeolocation = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/geolocation');

      if (!response.ok) {
        throw new Error('Failed to fetch geolocation');
      }

      const geolocation: SimpleGeolocation = await response.json();
      setData(geolocation);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Geolocation fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGeolocation();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchGeolocation
  };
}
