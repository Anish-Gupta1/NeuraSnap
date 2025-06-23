// app/api/extract-content/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch (error) {
        console.error('Invalid URL format:', url, error);
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    const apiKey = process.env.TAVILY_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ 
        error: 'Tavily API key not configured' 
      }, { status: 500 });
    }

    console.log(`Extracting content from: ${url}`);

    // Call Tavily Extract API
    const response = await fetch('https://api.tavily.com/extract', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        urls: url,
        format: 'text',
        extract_depth: 'advanced',
        include_images: false
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Tavily API error:', response.status, errorData);
      
      return NextResponse.json({
        error: 'Content extraction failed',
        details: `Tavily API returned ${response.status}`,
        url: url
      }, { status: response.status });
    }

    const data = await response.json();
    console.log(`Content extraction completed for ${url}`);

    // Extract the raw_content from the first result
    const extractedContent = data.results?.[0]?.raw_content;
    
    if (!extractedContent) {
      return NextResponse.json({
        error: 'No content extracted',
        details: 'The URL might be inaccessible or contain no extractable content',
        url: url
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      result: {
        raw_content: extractedContent,
        url: data.results[0].url
      },
      extractedAt: new Date().toISOString(),
      url: url
    });

  } catch (error) {
    console.error('Error extracting content:', error);
    
    // Handle network errors
    if (error instanceof Error && error.message.includes('fetch')) {
      return NextResponse.json({
        error: 'Network error during content extraction',
        details: 'Unable to reach Tavily API',
      }, { status: 503 });
    }

    return NextResponse.json({
      error: 'Internal server error during content extraction',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}