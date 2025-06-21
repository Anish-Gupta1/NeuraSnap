
// Core data structures for NeuraSnap

// Represents a user in the system
export interface User {
    $id: string;           // Appwrite user ID
    email: string;         // User's email address
    name?: string;         // Optional display name
    createdAt: string;     // When the user account was created
  }
  
  // Represents a webpage that has been "snapped" by a user
  export interface SnapPage {
    $id: string;           // Unique identifier for this page
    userId: string;        // Which user owns this page
    url: string;           // The original webpage URL
    title: string;         // Page title extracted from HTML
    description?: string;  // Meta description or excerpt
    snappedAt: string;     // When this page was initially captured
    lastCrawledAt: string; // When content was last refreshed
    status: 'processing' | 'completed' | 'failed'; // Current processing status
    faqCount: number;      // How many FAQ pairs were generated
  }
  
  // Represents a question-answer pair extracted from a webpage
  export interface FAQ {
    $id: string;           // Unique identifier for this FAQ
    pageId: string;        // Which page this FAQ belongs to
    question: string;      // The extracted question
    answer: string;        // The corresponding answer
    confidence: number;    // AI confidence score (0-1)
    createdAt: string;     // When this FAQ was generated
    order: number;         // Display order within the page
  }
  
  // Request structure for snapping a new URL
  export interface SnapRequest {
    url: string;           // The URL to snap
    title?: string;        // Optional custom title override
  }
  
  // Response structure after snapping a URL
  export interface SnapResponse {
    success: boolean;      // Whether the operation succeeded
    page?: SnapPage;       // The created page (if successful)
    message: string;       // Status message or error description
    error?: string;        // Detailed error information
  }
  
  // Structure for chat messages
  export interface ChatMessage {
    id: string;            // Unique message identifier
    role: 'user' | 'assistant'; // Who sent the message
    content: string;       // The message text
    timestamp: string;     // When the message was sent
    pageId?: string;       // If this is page-specific chat
    sources?: FAQ[];       // FAQ sources used to generate response
  }
  
  // Chat context for maintaining conversation state
  export interface ChatContext {
    messages: ChatMessage[]; // All messages in the conversation
    pageId?: string;         // Current page context (if any)
    isGlobal: boolean;       // Whether this is global or page-specific chat
  }
  
  // Search results structure
  export interface SearchResult {
    pages: SnapPage[];       // Matching pages
    faqs: FAQ[];            // Matching FAQ pairs
    totalCount: number;     // Total number of results
    query: string;          // The search query used
  }
  
  // Export configuration for PDF/JSON generation
  export interface ExportConfig {
    pageIds: string[];      // Which pages to include
    format: 'pdf' | 'json'; // Export format
    includeMetadata: boolean; // Whether to include timestamps, etc.
    title?: string;         // Custom export title
  }
  
  // API error response structure
  export interface ApiError {
    error: string;          // Error type or code
    message: string;        // Human-readable error message
    details?: unknown;//any          // Additional error context
  }
  
  // Tavily crawling response structure
  export interface CrawlResponse {
    url: string;            // The crawled URL
    title: string;          // Extracted page title
    content: string;        // Main page content
    description?: string;   // Meta description
    status: 'success' | 'failed'; // Crawl status
    error?: string;         // Error message if failed
  }
  
  // Configuration for the chat interface
  export interface ChatConfig {
    pageId?: string;        // Page context for scoped chat
    placeholder: string;    // Input placeholder text
    maxMessages: number;    // Maximum conversation history
    enableGlobalSearch: boolean; // Whether to enable cross-page search
  }