// Central configuration for Appwrite backend services

import { Client, Account, Databases, Functions } from 'appwrite';

// Validate that all required environment variables are present
const requiredEnvVars = {
  endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
  pagesCollectionId: process.env.NEXT_PUBLIC_APPWRITE_PAGES_COLLECTION_ID,
  faqsCollectionId: process.env.NEXT_PUBLIC_APPWRITE_FAQS_COLLECTION_ID,
};

// Check if any required environment variables are missing
const missingVars = Object.entries(requiredEnvVars)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
}

// Create the main Appwrite client
// This client handles all communication with Appwrite's servers
export const client = new Client()
  .setEndpoint(requiredEnvVars.endpoint!)
  .setProject(requiredEnvVars.projectId!);

// Authentication service for managing user sessions
// This handles login, logout, user registration, and session management
export const account = new Account(client);

// Database service for storing and retrieving data
// This manages your pages and FAQ collections
export const databases = new Databases(client);

// Functions service for serverless operations
// This will handle PDF generation and other server-side tasks
export const functions = new Functions(client);

// Configuration constants that your app will use
// These make it easy to reference your Appwrite resources throughout the app
export const appwriteConfig = {
  databaseId: requiredEnvVars.databaseId!,
  pagesCollectionId: requiredEnvVars.pagesCollectionId!,
  faqsCollectionId: requiredEnvVars.faqsCollectionId!,
};

// Server-side client for API routes
// This version includes the API key for administrative operations
export function createServerClient() {
  const serverClient = new Client()
    .setEndpoint(requiredEnvVars.endpoint!)
    .setProject(requiredEnvVars.projectId!);
  
  // Only add API key in server-side context
  if (process.env.APPWRITE_API_KEY) {
    serverClient.setDevKey(process.env.APPWRITE_API_KEY);
  }
  
  return {
    client: serverClient,
    databases: new Databases(serverClient),
    functions: new Functions(serverClient),
  };
}

// Utility function to handle Appwrite errors gracefully
// This converts Appwrite's error format into something easier to work with
export function handleAppwriteError(error: { message: string; code: string; }): { message: string; code?: string } {
  if (error?.message) {
    return {
      message: error.message,
      code: error.code || 'UNKNOWN_ERROR'
    };
  }
  
  return {
    message: 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR'
  };
}