'use client';

import { useGeolocation } from '@/hooks/useGeolocation';
import { MapPin, Globe, DollarSign, Clock } from 'lucide-react';

/**
 * Demo component showing user's geolocation
 * You can use this component anywhere to display user's location
 */
export default function GeolocationDemo() {
  const { data, loading, error } = useGeolocation();

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <div className="w-4 h-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
        <span>Detecting your location...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-red-500">
        Failed to detect location
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="bg-card border border-border rounded-xl p-4 space-y-3">
      <h3 className="font-semibold text-lg flex items-center gap-2" style={{ fontFamily: 'Clash Display, sans-serif' }}>
        <MapPin className="w-5 h-5 text-primary" />
        Your Location
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* City & Country */}
        <div className="flex items-start gap-2">
          <Globe className="w-4 h-4 text-muted-foreground mt-0.5" />
          <div>
            <p className="text-sm font-medium">{data.city}</p>
            <p className="text-xs text-muted-foreground">{data.region}, {data.country}</p>
          </div>
        </div>

        {/* Currency */}
        <div className="flex items-start gap-2">
          <DollarSign className="w-4 h-4 text-muted-foreground mt-0.5" />
          <div>
            <p className="text-sm font-medium">Currency</p>
            <p className="text-xs text-muted-foreground">{data.currency}</p>
          </div>
        </div>

        {/* Timezone */}
        <div className="flex items-start gap-2">
          <Clock className="w-4 h-4 text-muted-foreground mt-0.5" />
          <div>
            <p className="text-sm font-medium">Timezone</p>
            <p className="text-xs text-muted-foreground">{data.timezone}</p>
          </div>
        </div>

        {/* Coordinates */}
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
          <div>
            <p className="text-sm font-medium">Coordinates</p>
            <p className="text-xs text-muted-foreground">
              {data.latitude.toFixed(4)}, {data.longitude.toFixed(4)}
            </p>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-border">
        <p className="text-xs text-muted-foreground">
          IP: {data.ip}
        </p>
      </div>
    </div>
  );
}
