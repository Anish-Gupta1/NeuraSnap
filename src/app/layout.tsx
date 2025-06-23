import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Headers';
import CopilotKitProvider from '@/providers/CopilotKitProvider';

// Import the Inter font for clean, readable typography
// Inter is specifically designed for user interfaces and remains highly legible at all sizes
const inter = Inter({ subsets: ['latin'] });

// Metadata configuration for SEO and social sharing
// This information appears in browser tabs and when sharing links
export const metadata: Metadata = {
  title: {
    default: 'NeuraSnap',
    template: '%s | NeuraSnap' // Template for page-specific titles
  },
  description: 'Transform any webpage into an instant FAQ and searchable knowledge base. Snap, chat, and discover insights from your personal web knowledge vault.',
  keywords: ['knowledge management', 'FAQ generation', 'web scraping', 'AI chat', 'research tool'],
  authors: [{ name: 'Anish' }],
  creator: 'Anish',
  
  // Open Graph metadata for social media sharing
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    title: 'NeuraSnap - Your Personal Web Knowledge Vault',
    description: 'Transform any webpage into an instant FAQ and searchable knowledge base.',
    siteName: 'NeuraSnap',
  },
  
  // Twitter Card metadata
  twitter: {
    card: 'summary_large_image',
    title: 'NeuraSnap',
    description: 'Transform any webpage into an instant FAQ and searchable knowledge base.',
    creator: '@yourusername', // Replace with your Twitter handle
  },
  
  // Favicon and app icons
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  
  // Viewport configuration for responsive design
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full antialiased`}>
        {/* 
          Main application container with full height
          The antialiased class ensures smooth font rendering across different browsers
        */}
        
        {/* Background gradient for visual appeal */}
        <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 -z-10" />
        
        {/* Toast notifications container - positioned to avoid layout conflicts */}
        <div id="toast-root" />
        
        {/* Main content area */}
        <div className="relative flex h-full flex-col">
          <CopilotKitProvider publicApiKey={process.env.COPILOT_API_KEY!}>
            <Header />
            <main>
              {children}  
            </main>
          </CopilotKitProvider>

        </div>
        
        {/* 
          Performance optimization: preload critical resources
          This helps improve loading times for subsequent page navigations
        */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </body>
    </html>
  );
}