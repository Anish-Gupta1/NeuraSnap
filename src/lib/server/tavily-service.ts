// // lib/server/tavily-service.ts
// import { getLoggedInUser } from './appwrite';
// import { DatabaseService } from './database-service';

// interface TavilyResponse {
//   query: string;
//   results: Array<{
//     title: string;
//     url: string;
//     content: string;
//     score: number;
//     published_date?: string;
//   }>;
// }

// interface TavilyExtractResponse {
//   results: Array<{
//     url: string;
//     content: string;
//     title?: string;
//     raw_content?: string;
//   }>;
// }

// interface ExtractedContent {
//   title: string;
//   content: string;
//   description: string;
//   url: string;
//   metadata: {
//     domain: string;
//     extractedAt: string;
//     contentLength: number;
//     originalContentLength: number; // Track original length
//     hasImages: boolean;
//     wasTruncated: boolean; // Track if content was truncated
//   };
// }

// export class TavilyService {
//   private static readonly API_BASE_URL = 'https://api.tavily.com';
//   private static readonly API_KEY = process.env.TAVILY_API_KEY;

//   // Content processing limits
//   private static readonly MAX_CONTENT_LENGTH = 4000;
//   private static readonly MAX_DESCRIPTION_LENGTH = 5000;

//   /**
//    * Validates if a URL is accessible and safe
//    */
//   private static async validateUrl(url: string): Promise<boolean> {
//     try {
//       // Basic URL format validation
//       const urlObj = new URL(url);
      
//       // Check if it's HTTP/HTTPS
//       if (!['http:', 'https:'].includes(urlObj.protocol)) {
//         return false;
//       }

//       // Block localhost and private IPs for security
//       const blockedHosts = ['localhost', '127.0.0.1', '0.0.0.0'];
//       if (blockedHosts.some(host => urlObj.hostname.includes(host))) {
//         return false;
//       }

//       return true;
//     } catch (error) {
//       console.error('URL validation error:', error);
//       return false;
//     }
//   }

//   /**
//    * Extract content from a single URL using Tavily Extract API
//    */
//   private static async extractContent(url: string): Promise<TavilyExtractResponse> {
//     if (!this.API_KEY) {
//       throw new Error('Tavily API key not configured');
//     }

//     console.log('🔄 Making Tavily API request for:', url);

//     const response = await fetch(`${this.API_BASE_URL}/extract`, {
//       method: 'POST',
//       headers: {
//         Authorization: `Bearer ${this.API_KEY}`,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         urls: [url],
//         include_raw_content: false,
//         include_images: false,
//         timeout: 30
//       }),
//     });

//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error('Tavily API Error:', response.status, errorText);
//       throw new Error(`Tavily API error: ${response.status} - ${errorText}`);
//     }

//     const data = await response.json();
//     console.log('📊 Tavily API response:', {
//       resultsCount: data.results?.length || 0,
//       hasContent: !!data.results?.[0]?.content
//     });

//     return data;
//   }

//   /**
//    * Clean and normalize extracted text content
//    */
//   private static preprocessContent(content: string | undefined | null): string {
//     // Safety check for undefined/null content
//     if (!content || typeof content !== 'string') {
//       console.warn('⚠️ Content is undefined, null, or not a string:', typeof content);
//       return '';
//     }

//     if (content.trim().length === 0) {
//       console.warn('⚠️ Content is empty after trim');
//       return '';
//     }

//     try {
//       return content
//         // Remove excessive whitespace
//         .replace(/\s+/g, ' ')
//         // Remove common navigation/footer text patterns
//         .replace(/(?:Home|About|Contact|Privacy|Terms|Login|Sign up|Subscribe|Newsletter)/gi, '')
//         // Remove email patterns (basic)
//         .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '')
//         // Clean up multiple punctuation
//         .replace(/[.]{2,}/g, '.')
//         .replace(/[!]{2,}/g, '!')
//         .replace(/[?]{2,}/g, '?')
//         // Trim and normalize
//         .trim();
//     } catch (error) {
//       console.error('Error preprocessing content:', error);
//       return content || '';
//     }
//   }

//   /**
//    * Intelligently summarize content to fit within limits
//    */
//   private static summarizeContent(content: string, maxLength: number): { summary: string; wasTruncated: boolean } {
//     if (!content || content.length <= maxLength) {
//       return { summary: content, wasTruncated: false };
//     }

//     // Split into sentences
//     const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
//     if (sentences.length === 0) {
//       return { 
//         summary: content.substring(0, maxLength - 3) + '...', 
//         wasTruncated: true 
//       };
//     }

//     // Try to fit as many complete sentences as possible
//     let summary = '';
//     let currentLength = 0;
    
//     for (const sentence of sentences) {
//       const trimmedSentence = sentence.trim();
//       const sentenceWithPunctuation = trimmedSentence + '.';
      
//       if (currentLength + sentenceWithPunctuation.length + 1 <= maxLength) {
//         summary += (summary ? ' ' : '') + sentenceWithPunctuation;
//         currentLength += sentenceWithPunctuation.length + (summary ? 1 : 0);
//       } else {
//         break;
//       }
//     }

//     // If we couldn't fit any complete sentences, truncate at word boundary
//     if (!summary) {
//       const words = content.split(' ');
//       let wordSummary = '';
      
//       for (const word of words) {
//         if (wordSummary.length + word.length + 4 <= maxLength) { // +4 for ' ...'
//           wordSummary += (wordSummary ? ' ' : '') + word;
//         } else {
//           break;
//         }
//       }
      
//       summary = wordSummary + '...';
//     }

//     return { summary, wasTruncated: true };
//   }

//   /**
//    * Extract meaningful metadata from content
//    */
//   private static extractMetadata(
//     url: string, 
//     originalContent: string, 
//     processedContent: string, 
//     title?: string
//   ): ExtractedContent['metadata'] {
//     const urlObj = new URL(url);
    
//     return {
//       domain: urlObj.hostname,
//       extractedAt: new Date().toISOString(),
//       contentLength: processedContent.length,
//       originalContentLength: originalContent.length,
//       hasImages: originalContent.toLowerCase().includes('img') || originalContent.toLowerCase().includes('image'),
//       wasTruncated: processedContent.length < originalContent.length,
//     };
//   }

//   /**
//    * Generate a description from content
//    */
//   private static generateDescription(content: string): string {
//     if (!content || content.length === 0) {
//       return 'No description available';
//     }

//     const cleanContent = this.preprocessContent(content);
//     if (!cleanContent || cleanContent.length === 0) {
//       return 'No description available';
//     }

//     const { summary } = this.summarizeContent(cleanContent, this.MAX_DESCRIPTION_LENGTH);
//     return summary || 'No description available';
//   }

//   /**
//    * Main method to snap (crawl and extract) content from a URL
//    */ 
//   static async snapUrl(url: string): Promise<{
//     success: boolean;
//     data?: {
//       pageId: string;
//       extractedContent: ExtractedContent;
//     };
//     error?: string;
//   }> {
//     try {
//       // Authenticate user
//       const user = await getLoggedInUser();
//       if (!user) {
//         return { success: false, error: 'User not authenticated' };
//       }

//       // Validate URL
//       const isValidUrl = await this.validateUrl(url);
//       if (!isValidUrl) {
//         return { success: false, error: 'Invalid or unsafe URL provided' };
//       }

//       console.log(`🔍 Starting content extraction for: ${url}`);

//       // Extract content using Tavily
//       const extractResponse = await this.extractContent(url);
      
//       if (!extractResponse.results || extractResponse.results.length === 0) {
//         console.error('❌ No results from Tavily API');
//         return { success: false, error: 'No content could be extracted from the URL' };
//       }

//       const result = extractResponse.results[0];
//       console.log('📄 Raw result from Tavily:', {
//         hasTitle: !!result.title,
//         hasContent: !!result.content,
//         contentType: typeof result.content,
//         contentLength: result.content?.length || 0,
//         contentPreview: result.content?.substring(0, 100) || 'No content'
//       });

//       // Check if we have any content
//       if (!result.content && !result.raw_content) {
//         console.error('❌ No content in Tavily response');
//         return { success: false, error: 'The webpage content could not be extracted' };
//       }

//       // Use content or raw_content, whichever is available
//       const rawContent = result.content || result.raw_content || '';
      
//       // Process the extracted content with safety checks
//       const cleanContent = this.preprocessContent(rawContent);
      
//       if (!cleanContent || cleanContent.length === 0) {
//         console.error('❌ Content became empty after preprocessing');
//         return { success: false, error: 'The webpage content appears to be empty or unreadable' };
//       }

//       // Summarize content to fit database limits
//       const { summary: finalContent, wasTruncated } = this.summarizeContent(cleanContent, this.MAX_CONTENT_LENGTH);
      
//       const title = result.title || 'Untitled Page';
//       const description = this.generateDescription(cleanContent);
//       const metadata = this.extractMetadata(url, rawContent, finalContent, title);

//       const extractedContent: ExtractedContent = {
//         title,
//         content: finalContent,
//         description,
//         url,
//         metadata,
//       };

//       console.log('✨ Processed content:', {
//         title,
//         originalLength: rawContent.length,
//         finalLength: finalContent.length,
//         descriptionLength: description.length,
//         wasTruncated,
//         domain: metadata.domain
//       });

//       if (wasTruncated) {
//         console.warn(`⚠️ Content was truncated from ${rawContent.length} to ${finalContent.length} characters`);
//       }

//       // Save to database
//       const page = await DatabaseService.createPage(title, url, {
//         content: finalContent,
//         description,
//         metadata,
//         extractedAt: new Date().toISOString(),
//       });

//       console.log(`✅ Successfully snapped and saved page: ${title}`);

//       return {
//         success: true,
//         data: {
//           pageId: page.$id,
//           extractedContent,
//         },
//       };

//     } catch (error) {
//       console.error('❌ Error in snapUrl:', error);
      
//       // Provide specific error messages
//       if (error instanceof Error) {
//         if (error.message.includes('Tavily API')) {
//           return { success: false, error: 'Failed to extract content from the webpage' };
//         }
//         if (error.message.includes('Database') || error.message.includes('document_invalid_structure')) {
//           return { success: false, error: 'Failed to save the extracted content due to size limitations' };
//         }
//         if (error.message.includes('fetch')) {
//           return { success: false, error: 'Network error while accessing the webpage' };
//         }
//       }

//       return { 
//         success: false, 
//         error: 'An unexpected error occurred while processing the URL' 
//       };
//     }
//   }

//   /**
//    * Batch snap multiple URLs
//    */
//   static async snapMultipleUrls(urls: string[]): Promise<{
//     successful: Array<{ url: string; pageId: string }>;
//     failed: Array<{ url: string; error: string }>;
//   }> {
//     const successful: Array<{ url: string; pageId: string }> = [];
//     const failed: Array<{ url: string; error: string }> = [];

//     // Process URLs with a reasonable delay to avoid rate limiting
//     for (const url of urls) {
//       try {
//         const result = await this.snapUrl(url);
        
//         if (result.success && result.data) {
//           successful.push({ url, pageId: result.data.pageId });
//         } else {
//           failed.push({ url, error: result.error || 'Unknown error' });
//         }

//         // Add delay between requests (500ms)
//         if (urls.indexOf(url) < urls.length - 1) {
//           await new Promise(resolve => setTimeout(resolve, 500));
//         }
//       } catch (error) {
//         failed.push({ 
//           url, 
//           error: error instanceof Error ? error.message : 'Processing failed' 
//         });
//       }
//     }

//     return { successful, failed };
//   }

//   /**
//    * Get extraction statistics for monitoring
//    */
//   static async getExtractionStats(): Promise<{
//     totalPages: number;
//     totalContent: number;
//     avgContentLength: number;
//     topDomains: Array<{ domain: string; count: number }>;
//   }> {
//     try {
//       // Debug: Check if method exists
//       console.log('DatabaseService methods:', Object.getOwnPropertyNames(DatabaseService));
      
//       // Use getUserPages method - with fallback to getAllPages if needed
//       const pages = await (DatabaseService.getUserPages ? 
//         DatabaseService.getUserPages() : 
//         DatabaseService.getAllPages());
      
//       const totalPages = pages.length;
//       const totalContent = pages.reduce((sum, page) => sum + (page.content?.length || 0), 0);
//       const avgContentLength = totalPages > 0 ? Math.round(totalContent / totalPages) : 0;

//       // Count domains
//       const domainCounts: Record<string, number> = {};
//       pages.forEach(page => {
//         try {
//           const url = new URL(page.url);
//           const domain = url.hostname;
//           domainCounts[domain] = (domainCounts[domain] || 0) + 1;
//         } catch (error) {
//           // Skip invalid URLs
//         }
//       });

//       const topDomains = Object.entries(domainCounts)
//         .sort(([,a], [,b]) => b - a)
//         .slice(0, 10)
//         .map(([domain, count]) => ({ domain, count }));

//       return {
//         totalPages,
//         totalContent,
//         avgContentLength,
//         topDomains,
//       };
//     } catch (error) {
//       console.error('Error getting extraction stats:', error);
      
//       // Return empty stats instead of throwing
//       return {
//         totalPages: 0,
//         totalContent: 0,
//         avgContentLength: 0,
//         topDomains: [],
//       };
//     }
//   }
// }

// // Export types for use in other components
// export type { ExtractedContent, TavilyResponse, TavilyExtractResponse };