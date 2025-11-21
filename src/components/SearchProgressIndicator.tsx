'use client';

import { useEffect, useState } from 'react';
import { Plane } from 'lucide-react';

interface SearchProgressIndicatorProps {
  isSearching: boolean;
  onComplete?: () => void;
}

export function SearchProgressIndicator({ isSearching, onComplete }: SearchProgressIndicatorProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isSearching) {
      setProgress(0);
      return;
    }

    // Animate progress from 0 to 100 over 5 seconds
    const duration = 5000; // 5 seconds
    const intervalTime = 50; // Update every 50ms
    const steps = duration / intervalTime;
    const increment = 100 / steps;

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += increment;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        if (onComplete) {
          onComplete();
        }
      }
      setProgress(currentProgress);
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isSearching, onComplete]);

  if (!isSearching && progress === 0) return null;

  return (
    <div className="w-full bg-card border border-border rounded-xl p-4 mb-6 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className="relative">
          <Plane
            className="w-5 h-5 text-foreground animate-pulse"
            style={{
              animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }}
          />
        </div>
        <div>
          <p
            className="text-sm font-medium text-foreground"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Searching for available jets...
          </p>
          <p
            className="text-xs text-muted-foreground"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Checking availability and pricing across our fleet
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative w-full h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full rounded-full transition-all duration-100 ease-linear"
          style={{
            width: `${progress}%`,
            backgroundColor: 'var(--brand-red)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
        </div>
      </div>

      {/* Percentage */}
      <div className="flex justify-end mt-2">
        <span
          className="text-xs font-medium text-muted-foreground"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
}
