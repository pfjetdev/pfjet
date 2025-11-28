import { format, parse } from 'date-fns'

/**
 * Safely parse a date string in YYYY-MM-DD format to a Date object
 * This avoids timezone issues that occur with new Date("YYYY-MM-DD")
 * which parses as UTC midnight and can shift the day in local timezones
 */
export function parseDateString(dateStr: string): Date {
  // Parse the date string as local date (not UTC)
  return parse(dateStr, 'yyyy-MM-dd', new Date())
}

/**
 * Format a Date object to YYYY-MM-DD string using local timezone
 * This avoids the issue with toISOString() which converts to UTC
 */
export function formatDateString(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

/**
 * Format a date string for display (e.g., "Sat, Nov 30")
 */
export function formatDateDisplay(dateStr: string, formatStr: string = 'EEE, MMM d'): string {
  const date = parseDateString(dateStr)
  return format(date, formatStr)
}

/**
 * Format a date string for short display (e.g., "Nov 30")
 */
export function formatDateShort(dateStr: string): string {
  const date = parseDateString(dateStr)
  return format(date, 'MMM d')
}

/**
 * Format a date string for long display (e.g., "30 November 2025")
 */
export function formatDateLong(dateStr: string): string {
  const date = parseDateString(dateStr)
  return format(date, 'd MMMM yyyy')
}

/**
 * Check if a date string represents today
 */
export function isToday(dateStr: string): boolean {
  const date = parseDateString(dateStr)
  const today = new Date()
  return date.toDateString() === today.toDateString()
}

/**
 * Check if a date string represents tomorrow
 */
export function isTomorrow(dateStr: string): boolean {
  const date = parseDateString(dateStr)
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return date.toDateString() === tomorrow.toDateString()
}
