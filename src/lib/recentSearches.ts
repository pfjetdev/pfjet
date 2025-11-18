import { Airport } from '@/data/airports';

const STORAGE_KEY_FROM = 'airport_recent_searches_from';
const STORAGE_KEY_TO = 'airport_recent_searches_to';
const MAX_RECENT_SEARCHES = 5;

export type FieldType = 'from' | 'to';

export interface RecentSearch {
  airport: Airport;
  timestamp: number;
}

/**
 * Get storage key based on field type
 */
function getStorageKey(fieldType?: FieldType): string {
  return fieldType === 'to' ? STORAGE_KEY_TO : STORAGE_KEY_FROM;
}

/**
 * Get recent searches from localStorage
 */
export function getRecentSearches(fieldType?: FieldType): Airport[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(getStorageKey(fieldType));
    if (!stored) return [];

    const searches: RecentSearch[] = JSON.parse(stored);

    // Sort by timestamp (most recent first) and return only airports
    return searches
      .sort((a, b) => b.timestamp - a.timestamp)
      .map((search) => search.airport);
  } catch (error) {
    console.error('Error reading recent searches:', error);
    return [];
  }
}

/**
 * Add airport to recent searches
 */
export function addRecentSearch(airport: Airport, fieldType?: FieldType): void {
  if (typeof window === 'undefined') return;

  try {
    const recent = getRecentSearches(fieldType);

    // Remove duplicates (same IATA code)
    const filtered = recent.filter((a) => a.code !== airport.code);

    // Add new search at the beginning
    const updated = [airport, ...filtered].slice(0, MAX_RECENT_SEARCHES);

    // Convert to RecentSearch format with timestamps
    const searches: RecentSearch[] = updated.map((a, index) => ({
      airport: a,
      timestamp: Date.now() - index, // Ensure proper ordering
    }));

    localStorage.setItem(getStorageKey(fieldType), JSON.stringify(searches));
  } catch (error) {
    console.error('Error saving recent search:', error);
  }
}

/**
 * Clear all recent searches
 */
export function clearRecentSearches(fieldType?: FieldType): void {
  if (typeof window === 'undefined') return;

  try {
    if (fieldType) {
      localStorage.removeItem(getStorageKey(fieldType));
    } else {
      localStorage.removeItem(STORAGE_KEY_FROM);
      localStorage.removeItem(STORAGE_KEY_TO);
    }
  } catch (error) {
    console.error('Error clearing recent searches:', error);
  }
}
