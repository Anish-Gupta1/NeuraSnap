// lib/client/appwrite.ts
import { Client, Databases } from 'appwrite';

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

export const databases = new Databases(client);

export const DATABASE_ID = 'snapfaq-main';
export const COLLECTIONS = {
  PAGES: 'pages',
  FAQS: 'faqs',
  USERS: 'users',
} as const;
