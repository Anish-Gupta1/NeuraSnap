// lib/server/snap-actions.ts
"use server";

import { extractAndSaveUrl, getExtractionStats } from './openai';
import { revalidatePath } from 'next/cache';

export interface SnapResult {
  success: boolean;
  data?: {
    pageId: string;
    title: string;
    content: string;
    description: string;
    url: string;
    domain: string;
    contentLength: number;
  };
  error?: string;
}

export interface BulkSnapResult {
  success: boolean;
  data?: {
    successful: Array<{ url: string; pageId: string; title: string }>;
    failed: Array<{ url: string; error: string }>;
    summary: {
      total: number;
      successful: number;
      failed: number;
    };
  };
  error?: string;
}

export async function snapSingleUrl(url: string): Promise<SnapResult> {
  try {
    if (!url || typeof url !== 'string') {
      return { success: false, error: 'Invalid URL provided' };
    }

    const cleanUrl = url.trim();
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      return { success: false, error: 'URL must start with http:// or https://' };
    }

    const result = await extractAndSaveUrl(cleanUrl);

    if (result.success && result.data) {
      revalidatePath('/dashboard');
      revalidatePath('/pages');

      return {
        success: true,
        data: {
          pageId: result.data.pageId,
          title: result.data.extractedContent.title,
          content: result.data.extractedContent.content,
          description: result.data.extractedContent.description,
          url: result.data.extractedContent.url,
          domain: result.data.extractedContent.metadata.domain,
          contentLength: result.data.extractedContent.metadata.contentLength,
        },
      };
    }

    return { success: false, error: result.error || 'Failed to snap URL' };
  } catch (error) {
    console.error('Error in snapSingleUrl:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
}

export async function snapMultipleUrls(urls: string[]): Promise<BulkSnapResult> {
  const successful: Array<{ url: string; pageId: string; title: string }> = [];
  const failed: Array<{ url: string; error: string }> = [];

  const cleanUrls = urls
    .map(url => url.trim())
    .filter(url => url.length > 0)
    .filter(url => url.startsWith('http://') || url.startsWith('https://'));

  if (cleanUrls.length === 0) {
    return { success: false, error: 'No valid URLs found' };
  }

  const MAX_BATCH_SIZE = 10;
  if (cleanUrls.length > MAX_BATCH_SIZE) {
    return {
      success: false,
      error: `Maximum ${MAX_BATCH_SIZE} URLs allowed per batch`
    };
  }

  for (const url of cleanUrls) {
    try {
      const result = await extractAndSaveUrl(url);
      if (result.success && result.data) {
        successful.push({
          url,
          pageId: result.data.pageId,
          title: result.data.extractedContent.title,
        });
      } else {
        failed.push({ url, error: result.error || 'Extraction failed' });
      }
      await new Promise(res => setTimeout(res, 500));
    } catch (error) {
      failed.push({ url, error: error instanceof Error ? error.message : 'Processing failed' });
    }
  }

  revalidatePath('/dashboard');
  revalidatePath('/pages');

  return {
    success: true,
    data: {
      successful,
      failed,
      summary: {
        total: cleanUrls.length,
        successful: successful.length,
        failed: failed.length,
      },
    },
  };
}

export async function getSnapStats() {
  try {
    const stats = await getExtractionStats();
    return { success: true, data: stats };
  } catch (error) {
    console.error('Error getting snap stats:', error);
    return {
      success: false,
      error: 'Failed to load statistics',
      data: {
        totalPages: 0,
        totalContent: 0,
        avgContentLength: 0,
        topDomains: [],
      },
    };
  }
}

export async function validateUrl(url: string): Promise<{
  isValid: boolean;
  error?: string;
  suggestions?: string[];
}> {
  try {
    if (!url || typeof url !== 'string') {
      return { isValid: false, error: 'URL is required' };
    }

    const cleanUrl = url.trim();

    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      return {
        isValid: false,
        error: 'URL must include http:// or https://',
        suggestions: [`https://${cleanUrl}`, `http://${cleanUrl}`],
      };
    }

    try {
      new URL(cleanUrl);
    } catch {
      return { isValid: false, error: 'Invalid URL format' };
    }

    const blockedPatterns = [
      'localhost',
      '127.0.0.1',
      '0.0.0.0',
      'file://',
      'ftp://',
    ];

    const isBlocked = blockedPatterns.some(pattern => cleanUrl.toLowerCase().includes(pattern));
    if (isBlocked) {
      return { isValid: false, error: 'URL is not allowed' };
    }

    return { isValid: true };
  } catch (error) {
    console.error('Error validating URL:', error);
    return { isValid: false, error: 'URL validation failed' };
  }
}

export async function checkUrlExists(url: string): Promise<{
  exists: boolean;
  pageId?: string;
  title?: string;
  lastSnapped?: string;
}> {
  try {
    console.log('URL :', url);
    return { exists: false };
  } catch (error) {
    console.error('Error checking URL existence:', error);
    return { exists: false };
  }
}
