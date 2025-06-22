// lib/server/database-service.ts

import { Client, Databases, Query, ID } from 'node-appwrite';
import { createSessionClient, getLoggedInUser } from './appwrite';

// Database and collection IDs
export const DATABASE_ID = 'snapfaq-main';
export const COLLECTIONS = {
  PAGES: 'pages',
  FAQS: 'faqs',
} as const;

// Content limits
const CONTENT_MAX_LENGTH = 2000; // Match your Appwrite schema
const DESCRIPTION_MAX_LENGTH = 500; // Reasonable limit for descriptions

// Simplified interfaces
export interface PageDocument {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  userId: string;
  title: string;
  url: string;
  // New optional fields
  content?: string;
  description?: string;
  metadata?: string; // JSON string of metadata object
  extractedAt?: string; // ISO date string
}

export interface FAQDocument {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  pageId: string;
  question: string;
  answer: string;
}

interface PageData {
  content?: string;
  description?: string;
  metadata?: any;
  extractedAt?: string;
}

// Helper function to truncate content intelligently
function truncateContent(content: string, maxLength: number): string {
  if (!content || content.length <= maxLength) {
    return content;
  }

  // Try to truncate at sentence boundary
  const truncated = content.substring(0, maxLength);
  const lastSentenceEnd = Math.max(
    truncated.lastIndexOf('.'),
    truncated.lastIndexOf('!'),
    truncated.lastIndexOf('?')
  );

  if (lastSentenceEnd > maxLength * 0.7) {
    // If we found a sentence boundary in the last 30% of content, use it
    return truncated.substring(0, lastSentenceEnd + 1);
  } else {
    // Otherwise, truncate at word boundary
    const lastSpace = truncated.lastIndexOf(' ');
    if (lastSpace > maxLength * 0.8) {
      return truncated.substring(0, lastSpace) + '...';
    } else {
      return truncated + '...';
    }
  }
}

// Create a server-side databases client
async function createDatabasesClient() {
  try {
    const { account } = await createSessionClient();
    
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

    // Get session from cookies and set it
    const session = await account.getSession('current');
    client.setSession(session.secret);

    return new Databases(client);
  } catch (error) {
    console.error('Error creating database client:', error);
    throw new Error('Failed to create authenticated database client');
  }
}

// Simplified database service
export class DatabaseService {
  // Page methods
  static async createPage(title: string, url: string, pageData?: PageData): Promise<PageDocument> {
    try {
      const user = await getLoggedInUser();
      if (!user) throw new Error('User not authenticated');

      const databases = await createDatabasesClient();
      
      // Prepare data with content truncation
      const documentData: any = {
        userId: user.$id,
        title,
        url,
      };

      // Truncate content if it exists and is too long
      if (pageData?.content) {
        const truncatedContent = truncateContent(pageData.content, CONTENT_MAX_LENGTH);
        documentData.content = truncatedContent;
        
        // Log truncation warning
        if (pageData.content.length > CONTENT_MAX_LENGTH) {
          console.warn(`⚠️ Content truncated from ${pageData.content.length} to ${truncatedContent.length} characters`);
        }
      }

      // Truncate description if it exists and is too long
      if (pageData?.description) {
        const truncatedDescription = truncateContent(pageData.description, DESCRIPTION_MAX_LENGTH);
        documentData.description = truncatedDescription;
        
        if (pageData.description.length > DESCRIPTION_MAX_LENGTH) {
          console.warn(`⚠️ Description truncated from ${pageData.description.length} to ${truncatedDescription.length} characters`);
        }
      }

      // Add other fields
      if (pageData?.metadata) {
        documentData.metadata = JSON.stringify(pageData.metadata);
      }
      if (pageData?.extractedAt) {
        documentData.extractedAt = pageData.extractedAt;
      }

      console.log('📝 Creating document with data:', {
        title,
        url,
        contentLength: documentData.content?.length || 0,
        descriptionLength: documentData.description?.length || 0,
        hasMetadata: !!documentData.metadata
      });
      
      const page = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.PAGES,
        ID.unique(),
        documentData
      );
      
      return page as unknown as PageDocument;
    } catch (error) {
      console.error('Error creating page:', error);
      throw error;
    }
  }

  static async getUserPages(): Promise<PageDocument[]> {
    try {
      const user = await getLoggedInUser();
      if (!user) {
        console.error('No authenticated user found');
        throw new Error('User not authenticated');
      }
      
      console.log('Fetching pages for user:', user.$id);

      const databases = await createDatabasesClient();
      
      const pages = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.PAGES,
        [
          Query.equal('userId', user.$id),
          Query.orderDesc('$createdAt')
        ]
      );
      
      console.log('Successfully fetched pages:', pages.documents.length);
      return pages.documents as unknown as PageDocument[];
    } catch (error) {
      console.error('Error fetching pages:', error);
      
      // More specific error handling
      if (error instanceof Error) {
        if (error.message.includes('user_unauthorized')) {
          throw new Error('Database access denied. Please check collection permissions.');
        }
        if (error.message.includes('collection_not_found')) {
          throw new Error('Database collection not found. Please check your database setup.');
        }
      }
      
      throw error;
    }
  }

  static async getAllPages(): Promise<PageDocument[]> {
    try {
      const user = await getLoggedInUser();
      if (!user) throw new Error('User not authenticated');

      const databases = await createDatabasesClient();
      
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.PAGES,
        [
          Query.equal('userId', user.$id),
          Query.orderDesc('$createdAt'),
          Query.limit(100) // Adjust limit as needed
        ]
      );

      return response.documents as unknown as PageDocument[];
    } catch (error) {
      console.error('Error getting all pages:', error);
      throw error;
    }
  }

  static async getPage(pageId: string): Promise<PageDocument> {
    try {
      const user = await getLoggedInUser();
      if (!user) throw new Error('User not authenticated');

      const databases = await createDatabasesClient();
      
      const page = await databases.getDocument(
        DATABASE_ID,
        COLLECTIONS.PAGES,
        pageId
      );

      if (page.userId !== user.$id) {
        throw new Error('Unauthorized access');
      }

      return page as unknown as PageDocument;
    } catch (error) {
      console.error('Error fetching page:', error);
      throw error;
    }
  }

  static async updatePage(pageId: string, title: string, url: string): Promise<PageDocument> {
    try {
      const user = await getLoggedInUser();
      if (!user) throw new Error('User not authenticated');

      const databases = await createDatabasesClient();
      
      const page = await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.PAGES,
        pageId,
        { title, url }
      );
      return page as unknown as PageDocument;
    } catch (error) {
      console.error('Error updating page:', error);
      throw error;
    }
  }

  static async deletePage(pageId: string): Promise<void> {
    try {
      const user = await getLoggedInUser();
      if (!user) throw new Error('User not authenticated');

      const databases = await createDatabasesClient();
      
      // Delete all FAQs for this page first
      const faqs = await this.getPageFAQs(pageId);
      await Promise.all(faqs.map(faq => this.deleteFAQ(faq.$id)));

      // Delete the page
      await databases.deleteDocument(DATABASE_ID, COLLECTIONS.PAGES, pageId);
    } catch (error) {
      console.error('Error deleting page:', error);
      throw error;
    }
  }

  // FAQ methods
  static async createFAQ(pageId: string, question: string, answer: string): Promise<FAQDocument> {
    try {
      const user = await getLoggedInUser();
      if (!user) throw new Error('User not authenticated');

      // Verify page ownership
      await this.getPage(pageId);

      const databases = await createDatabasesClient();
      
      const faq = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.FAQS,
        ID.unique(),
        {
          pageId,
          question,
          answer
        }
      );
      return faq as unknown as FAQDocument;
    } catch (error) {
      console.error('Error creating FAQ:', error);
      throw error;
    }
  }

  static async getPageFAQs(pageId: string): Promise<FAQDocument[]> {
    try {
      const user = await getLoggedInUser();
      if (!user) throw new Error('User not authenticated');

      // Verify page ownership
      await this.getPage(pageId);

      const databases = await createDatabasesClient();
      
      const faqs = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.FAQS,
        [
          Query.equal('pageId', pageId),
          Query.orderAsc('$createdAt')
        ]
      );
      return faqs.documents as unknown as FAQDocument[];
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      throw error;
    }
  }

  static async updateFAQ(faqId: string, question: string, answer: string): Promise<FAQDocument> {
    try {
      const user = await getLoggedInUser();
      if (!user) throw new Error('User not authenticated');

      const databases = await createDatabasesClient();
      
      const faq = await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.FAQS,
        faqId,
        { question, answer }
      );
      return faq as unknown as FAQDocument;
    } catch (error) {
      console.error('Error updating FAQ:', error);
      throw error;
    }
  }

  static async deleteFAQ(faqId: string): Promise<void> {
    try {
      const user = await getLoggedInUser();
      if (!user) throw new Error('User not authenticated');

      const databases = await createDatabasesClient();
      
      await databases.deleteDocument(DATABASE_ID, COLLECTIONS.FAQS, faqId);
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      throw error;
    }
  }
}

export default DatabaseService;