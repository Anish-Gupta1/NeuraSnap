import { getLoggedInUser } from "./appwrite";
import { DatabaseService } from "./database-service";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENAI_API_KEY!,
});

interface ExtractedContent {
  title: string;
  content: string;
  description: string;
  url: string;
  metadata: {
    domain: string;
    extractedAt: string;
    contentLength: number;
    originalContentLength: number;
    hasImages: boolean;
    wasTruncated: boolean;
  };
}

const MAX_CONTENT_LENGTH = 5000;
const MAX_DESCRIPTION_LENGTH = 7000;

export async function extractAndSaveUrl(url: string) {
  try {
    console.log("🔐 Authenticating user...");
    const user = await getLoggedInUser();
    if (!user) throw new Error("User not authenticated");
    console.log("✅ User authenticated:", user);

    console.log("🔍 Validating URL:", url);
    const parsedUrl = new URL(url);
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      throw new Error("Invalid or unsafe URL provided");
    }
    console.log("✅ URL validated:", parsedUrl.href);

    console.log("🤖 Sending request to OpenAI for content extraction...");
    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: `You are an intelligent web assistant that reads webpages deeply and extracts **rich, comprehensive** information. Your job is to understand the **entire context** of a webpage — including purpose, key ideas, examples, data, and subtle insights — and summarize it with clarity and precision.

          Respond strictly in the following JSON format:
          
          {
            "title": string, // A clear, concise, human-readable title that reflects the page's main focus or value
            "content": string, // A deeply informative, structured, and fluent summary that captures ALL meaningful content from the page. Explain concepts, processes, and ideas. Include examples, data, or arguments where relevant. Write in full sentences and clear paragraphs, not bullet points. The content must be thorough but stay UNDER ${MAX_CONTENT_LENGTH} characters.
            "description": string // A standalone, clear, and informative explanation of the page UNDER ${MAX_DESCRIPTION_LENGTH} characters. Describe what the page is about, its purpose, what topics it covers, and what value it offers to the reader. Include any data, examples, or ideas discussed if space allows.
          }
          `,
        },
        {
          role: "user",
          content: `Please fetch and summarize the content from this URL:
${url}`,
        },
      ],
      temperature: 0.5,
    });

    const output = response.choices[0].message?.content;
    console.log("🧠 Raw response from OpenAI:", output);
    if (!output) throw new Error("No content received from OpenAI");

    const match = output.match(/{[\s\S]*}/);
    const extracted = match ? JSON.parse(match[0]) : null;
    console.log("🧾 Parsed JSON content:", extracted);

    if (
      !extracted ||
      !extracted.content ||
      !extracted.title ||
      !extracted.description
    ) {
      throw new Error("OpenAI returned incomplete or malformed data");
    }

    const domain = parsedUrl.hostname;

    const metadata = {
      domain,
      extractedAt: new Date().toISOString(),
      contentLength: extracted.content.length,
      originalContentLength: extracted.content.length,
      hasImages: false,
      wasTruncated: false,
    };

    const extractedContent: ExtractedContent = {
      title: extracted.title,
      content: extracted.content,
      description: extracted.description,
      url,
      metadata,
    };

    console.log("💾 Saving extracted content to database...");
    const page = await DatabaseService.createPage(extracted.title, url, {
      content: extracted.content,
      description: extracted.description,
      metadata,
      extractedAt: metadata.extractedAt,
    });

    console.log("✅ Page saved with ID:", page.$id);
    return {
      success: true,
      data: {
        pageId: page.$id,
        extractedContent,
      },
    };
  } catch (error) {
    console.error("❌ OpenAI Extract Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getExtractionStats(): Promise<{
  totalPages: number;
  totalContent: number;
  avgContentLength: number;
  topDomains: Array<{ domain: string; count: number }>;
}> {
  try {
    console.log("📊 Fetching extraction stats...");
    const pages = await (DatabaseService.getUserPages
      ? DatabaseService.getUserPages()
      : DatabaseService.getAllPages());

    const totalPages = pages.length;
    const totalContent = pages.reduce(
      (sum, page) => sum + (page.content?.length || 0),
      0
    );
    const avgContentLength =
      totalPages > 0 ? Math.round(totalContent / totalPages) : 0;

    const domainCounts: Record<string, number> = {};
    pages.forEach((page) => {
      try {
        const url = new URL(page.url);
        const domain = url.hostname;
        domainCounts[domain] = (domainCounts[domain] || 0) + 1;
      } catch (err) {
        console.log(err);
      }
    });

    const topDomains = Object.entries(domainCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([domain, count]) => ({ domain, count }));

    console.log("📈 Extraction stats computed.");
    return {
      totalPages,
      totalContent,
      avgContentLength,
      topDomains,
    };
  } catch (error) {
    console.error("❌ Error getting extraction stats:", error);
    return {
      totalPages: 0,
      totalContent: 0,
      avgContentLength: 0,
      topDomains: [],
    };
  }
}
