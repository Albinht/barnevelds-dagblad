/**
 * Date utilities for consistent server/client rendering
 * Prevents hydration mismatches by ensuring consistent date formatting
 */

interface DateFormatOptions {
  timeZone?: string;
}

/**
 * Formats a date consistently for Dutch locale
 * @param date - Date string or Date object
 * @param options - Formatting options
 * @returns Formatted date string (e.g., "1 september 2025")
 */
export function formatDate(
  date: string | Date, 
  options: DateFormatOptions = {}
): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Ensure we have a valid date
    if (isNaN(dateObj.getTime())) {
      return 'Ongeldige datum';
    }

    // Use Intl.DateTimeFormat for consistent formatting
    return new Intl.DateTimeFormat('nl-NL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: options.timeZone || 'Europe/Amsterdam'
    }).format(dateObj);
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Datum niet beschikbaar';
  }
}

/**
 * Formats time consistently for Dutch locale
 * @param date - Date string or Date object
 * @param options - Formatting options
 * @returns Formatted time string (e.g., "14:30")
 */
export function formatTime(
  date: string | Date, 
  options: DateFormatOptions = {}
): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Ensure we have a valid date
    if (isNaN(dateObj.getTime())) {
      return '--:--';
    }

    // Use Intl.DateTimeFormat for consistent formatting
    return new Intl.DateTimeFormat('nl-NL', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: options.timeZone || 'Europe/Amsterdam'
    }).format(dateObj);
  } catch (error) {
    console.error('Time formatting error:', error);
    return '--:--';
  }
}

/**
 * Formats date and time together
 * @param date - Date string or Date object
 * @param options - Formatting options
 * @returns Formatted datetime string (e.g., "1 september 2025 om 14:30")
 */
export function formatDateTime(
  date: string | Date, 
  options: DateFormatOptions = {}
): string {
  const formattedDate = formatDate(date, options);
  const formattedTime = formatTime(date, options);
  
  return `${formattedDate} om ${formattedTime}`;
}

/**
 * Formats date for short display (used in cards)
 * @param date - Date string or Date object
 * @returns Short formatted date (e.g., "1 sep 2025")
 */
export function formatDateShort(date: string | Date): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
      return 'Ongeldig';
    }

    return new Intl.DateTimeFormat('nl-NL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      timeZone: 'Europe/Amsterdam'
    }).format(dateObj);
  } catch (error) {
    console.error('Short date formatting error:', error);
    return 'Ongeldig';
  }
}

/**
 * Check if a date is today
 * @param date - Date string or Date object
 * @returns Boolean indicating if date is today
 */
export function isToday(date: string | Date): boolean {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const today = new Date();
    
    return (
      dateObj.getDate() === today.getDate() &&
      dateObj.getMonth() === today.getMonth() &&
      dateObj.getFullYear() === today.getFullYear()
    );
  } catch {
    return false;
  }
}

/**
 * Get relative time string (e.g., "2 hours ago")
 * @param date - Date string or Date object
 * @returns Relative time string in Dutch
 */
export function getRelativeTime(date: string | Date): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) {
      return 'Net nu';
    } else if (diffMinutes < 60) {
      return `${diffMinutes} minuten geleden`;
    } else if (diffHours < 24) {
      return `${diffHours} uur geleden`;
    } else if (diffDays === 1) {
      return 'Gisteren';
    } else if (diffDays < 7) {
      return `${diffDays} dagen geleden`;
    } else {
      return formatDateShort(dateObj);
    }
  } catch {
    return formatDateShort(date);
  }
}