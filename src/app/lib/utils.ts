import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple CSS class names intelligently
 * This function merges Tailwind classes and resolves conflicts
 * For example: cn("px-2 px-4", "py-2") becomes "px-4 py-2"
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Validates if a string is a properly formatted URL
 * This ensures users can only snap valid web addresses
 */
export function isValidUrl(string: string): boolean {
  try {
    const url = new URL(string);
    // Only allow HTTP and HTTPS protocols for security
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Normalizes URLs to ensure consistency in storage
 * This removes tracking parameters and ensures consistent formatting
 */
export function normalizeUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    
    // Remove common tracking parameters that don't affect content
    const trackingParams = [
      'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
      'fbclid', 'gclid', 'msclkid', '_ga', 'ref', 'referrer'
    ];
    
    trackingParams.forEach(param => {
      urlObj.searchParams.delete(param);
    });
    
    // Remove trailing slash for consistency
    let normalizedUrl = urlObj.toString();
    if (normalizedUrl.endsWith('/') && urlObj.pathname !== '/') {
      normalizedUrl = normalizedUrl.slice(0, -1);
    }
    
    return normalizedUrl;
  } catch {
    return url; // Return original if normalization fails
  }
}

/**
 * Extracts a clean domain name from a URL
 * Useful for displaying readable source information to users
 */
export function getDomainFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    // Remove 'www.' prefix if present for cleaner display
    return urlObj.hostname.replace(/^www\./, '');
  } catch {
    return 'Unknown Source';
  }
}

/**
 * Formats dates in a human-friendly way
 * Shows relative time for recent dates, absolute dates for older content
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
  
  // Show relative time for recent content
  if (diffInHours < 1) {
    return 'Just now';
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)} hours ago`;
  } else if (diffInHours < 168) { // 7 days
    const days = Math.floor(diffInHours / 24);
    return `${days} day${days === 1 ? '' : 's'} ago`;
  } else {
    // Show absolute date for older content
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}

/**
 * Truncates text to a specified length while preserving word boundaries
 * Useful for displaying previews and summaries
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  
  // Find the last space before the cutoff to avoid breaking words
  const truncated = text.slice(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  
  if (lastSpaceIndex > 0) {
    return truncated.slice(0, lastSpaceIndex) + '...';
  } else {
    return truncated + '...';
  }
}

/**
 * Generates a readable slug from text
 * Useful for creating URL-friendly identifiers
 */
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/-+/g, '-')      // Replace multiple hyphens with single
    .trim();
}

/**
 * Debounces function calls to prevent excessive API requests
 * Essential for search inputs and other user interactions
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  waitFor: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(() => {
      func(...args);
    }, waitFor);
  };
}

/**
 * Safely parses JSON with error handling
 * Returns null instead of throwing errors for invalid JSON
 */
export function safeJsonParse<T>(jsonString: string): T | null {
  try {
    return JSON.parse(jsonString) as T;
  } catch {
    return null;
  }
}

/**
 * Calculates reading time estimate for text content
 * Assumes average reading speed of 200 words per minute
 */
export function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const wordCount = text.trim().split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return Math.max(1, readingTime); // Minimum 1 minute
}

/**
 * Generates a confidence level description from a numeric score
 * Helps users understand AI confidence in generated content
 */
export function getConfidenceLevel(score: number): {
  level: 'high' | 'medium' | 'low';
  description: string;
  color: string;
} {
  if (score >= 0.8) {
    return {
      level: 'high',
      description: 'High confidence',
      color: 'text-green-600'
    };
  } else if (score >= 0.6) {
    return {
      level: 'medium',
      description: 'Medium confidence',
      color: 'text-yellow-600'
    };
  } else {
    return {
      level: 'low',
      description: 'Low confidence',
      color: 'text-red-600'
    };
  }
}