// utils/dateUtils.ts

// Converts UTC date string to local datetime input format (e.g. for datetime-local input)
export const toLocalInputDateTime = (utcString: string): string => {
    const date = new Date(utcString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };
  
  // Converts UTC string to DD/MM/YYYY (local timezone)
  export function convertUtcToLocalDate(utcDateStr: string): string {
    const date = new Date(utcDateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
  
  // Converts UTC to local time string (e.g. "04:30 PM")
  export function formatUtcToLocalTime(utcString: string): string {
    const date = new Date(utcString);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  }
  
  // Changes date format from YYYY-MM-DD to DD-MM-YYYY
  export const changeDateFormat = (dateString: string): string => {
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  };
  
  // Returns number of seconds between now and a future ISO datetime
  export const getSecondsUntilStart = (isoString: string): number => {
    const start = new Date(isoString);
    const now = new Date();
    const diffInMs = start.getTime() - now.getTime();
    return Math.floor(diffInMs / 1000);
  };
  
  // Returns relative time from past UTC date (e.g. "3 mins ago", "2 days ago")
  export function getRelativeTime(utcDate: string): string {
    const now = new Date();
    const past = new Date(utcDate);
    const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);
  
    if (seconds < 60) return seconds === 1 ? "1 sec ago" : `${seconds} secs ago`;
  
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return minutes === 1 ? "1 min ago" : `${minutes} mins ago`;
  
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return hours === 1 ? "1h ago" : `${hours}h ago`;
  
    const days = Math.floor(hours / 24);
    if (days < 7) return days === 1 ? "1 day ago" : `${days} days ago`;
  
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
  
    const months = Math.floor(days / 30);
    if (months < 12) return months === 1 ? "1 month ago" : `${months} months ago`;
  
    const years = Math.floor(days / 365);
    return years === 1 ? "1 year ago" : `${years} years ago`;
  }
  
  // Formats amount into Indian short currency (e.g. 1.2Cr, 3.4L, 2.1K)
  export const formatIndianCurrency = (amount: number): string => {
    if (amount >= 1e7) return `${(amount / 1e7).toFixed(2)} Cr`;
    if (amount >= 1e5) return `${(amount / 1e5).toFixed(2)} L`;
    if (amount >= 1e3) return `${(amount / 1e3).toFixed(2)} K`;
    return amount.toString();
  };

  export const getAbbreviation = (str: string): string => {
    if (!str) return '';
    return str
      .split(' ')
      .filter(word => word.trim().length > 0) // skip extra spaces
      .map(word => word[0].toUpperCase())
      .join('');
  }
  
  