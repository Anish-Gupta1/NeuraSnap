"use client";

import { useCopilotReadable, useCopilotAction } from "@copilotkit/react-core";
import {  CopilotSidebar, HeaderProps, useChatContext } from "@copilotkit/react-ui";
import { useState, useEffect } from "react";

type Page = {
  $id: string;
  title: string;
  url: string;
  $createdAt: string;
  $updatedAt: string;
  description?: string;
  content?: string;
  metadata?: string;
  extractedAt?: string;
};

interface PageChatInterfaceProps {
  page: Page;
  children: React.ReactNode;
}

const PageChatInterface = ({ page, children }: PageChatInterfaceProps) => {
  const [fullContent, setFullContent] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionError, setExtractionError] = useState<string | null>(null);

  // Extract full content using Tavily when component mounts
  useEffect(() => {
    const extractFullContent = async () => {
      if (!page?.url) return;

      setIsExtracting(true);
      setExtractionError(null);

      try {
        const response = await fetch("/api/extract-content", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: page.url }),
        });

        if (!response.ok) {
          throw new Error("Failed to extract content");
        }

        const data = await response.json();
        setFullContent(data.result?.raw_content || null);
      } catch (error) {
        console.error("Error extracting full content:", error);
        if (error instanceof Error) {
          setExtractionError(error.message);
        } else {
          setExtractionError("Failed to extract content.");
        }
      } finally {
        setIsExtracting(false);
      }
    };

    extractFullContent();
  }, [page?.url]);

  // Make the enhanced page data readable by CopilotKit
  useCopilotReadable({
    description: `Current page being viewed: ${page?.title}. Full content extracted from the live URL for comprehensive analysis.`,
    value: {
      title: page?.title || "",
      description: page?.description || "",
      originalContent: page?.content || "",
      fullContent: fullContent || page?.content || "",
      url: page?.url || "",
      createdAt: page?.$createdAt || "",
      extractedAt: page?.extractedAt || "",
      metadata: page?.metadata ? JSON.parse(page.metadata) : {},
      hasFullContent: !!fullContent,
      contentLength: fullContent
        ? fullContent.length
        : page?.content?.length || 0,
      extractionStatus: isExtracting
        ? "extracting"
        : fullContent
        ? "complete"
        : "unavailable",
    },
  });

  // Enhanced content analysis with full content
  useCopilotAction({
    name: "analyzePageContent",
    description:
      "Analyze and provide insights about the current page content using full extracted content",
    parameters: [
      {
        name: "analysisType",
        type: "string",
        description:
          "Type of analysis to perform: summary, keywords, topics, insights, or structure",
        enum: ["summary", "keywords", "topics", "insights", "structure"],
      },
    ],
    handler: async ({ analysisType }) => {
      const contentToAnalyze = fullContent || page?.content || "";
      const pageData = {
        title: page?.title || "",
        description: page?.description || "",
        content: contentToAnalyze,
        hasFullContent: !!fullContent,
      };

      const contentSource = fullContent
        ? "full extracted content"
        : "stored content";

      switch (analysisType) {
        case "summary":
          if (!contentToAnalyze) {
            return "No content available for summary.";
          }
          const wordCount = contentToAnalyze.split(/\s+/).length;
          return `Page Summary (based on ${contentSource}): "${
            pageData.title
          }" - ${
            pageData.description || "This page contains detailed content."
          } The content contains approximately ${wordCount} words and covers comprehensive information about the topic.`;

        case "keywords":
          if (!contentToAnalyze) {
            return "No content available for keyword extraction.";
          }
          const words = (
            contentToAnalyze +
            " " +
            pageData.title +
            " " +
            pageData.description
          )
            .toLowerCase()
            .replace(/[^\w\s]/g, " ")
            .split(/\s+/)
            .filter((word: string) => word.length > 3)
            .reduce<Record<string, number>>((acc, word: string) => {
              acc[word] = (acc[word] || 0) + 1;
              return acc;
            }, {});

          const topKeywords = Object.entries(words)
            .sort(([, a], [, b]: [string, number]) => (b as number) - (a as number))
            .slice(0, 15)
            .map(([word]) => word);

          return `Key terms found (from ${contentSource}): ${topKeywords.join(
            ", "
          )}`;

        case "topics":
          return `Main topics in "${
            pageData.title
          }" (analyzed from ${contentSource}): Based on the ${
            fullContent ? "comprehensive extracted" : "available"
          } content, this page covers detailed information related to ${
            pageData.title
          }. ${
            fullContent
              ? "Full content analysis provides deeper topic understanding."
              : "Limited to stored content - full extraction would provide more comprehensive topic analysis."
          }`;

        case "insights":
          const insights = [
            `Page insights for "${pageData.title}":`,
            `- Created: ${new Date(page?.$createdAt).toLocaleDateString()}`,
            `- Content source: ${contentSource}`,
            `- Content length: ${contentToAnalyze.length} characters`,
            fullContent
              ? "- Full content successfully extracted from live URL"
              : "- Using stored content (full extraction unavailable)",
            `- Analysis capability: ${
              fullContent ? "Comprehensive" : "Limited"
            }`,
          ];
          return insights.join("\n");

        case "structure":
          if (!contentToAnalyze) {
            return "No content available for structure analysis.";
          }
          const lines = contentToAnalyze
            .split("\n")
            .filter((line: string) => line.trim());
          const paragraphs = contentToAnalyze
            .split("\n\n")
            .filter((p: string) => p.trim());
          return `Content structure (${contentSource}): ${
            (lines as string[]).length
          } lines, ${(paragraphs as string[]).length} paragraphs. ${
            fullContent
              ? "Full page structure analyzed including all elements."
              : "Structure based on stored content only."
          }`;

        default:
          return `Analysis completed using ${contentSource}.`;
      }
    },
  });

  // Enhanced metadata action
  useCopilotAction({
    name: "getPageMetadata",
    description:
      "Get detailed metadata information about the current page including extraction status",
    parameters: [],
    handler: async () => {
      return {
        id: page?.$id,
        title: page?.title,
        url: page?.url,
        createdAt: page?.$createdAt,
        updatedAt: page?.$updatedAt,
        extractedAt: page?.extractedAt,
        hasContent: !!page?.content,
        hasDescription: !!page?.description,
        hasMetadata: !!page?.metadata,
        hasFullContent: !!fullContent,
        fullContentLength: fullContent?.length || 0,
        originalContentLength: page?.content?.length || 0,
        extractionStatus: isExtracting
          ? "in_progress"
          : fullContent
          ? "success"
          : "failed",
        extractionError: extractionError,
      };
    },
  });

  // Action to re-extract content if needed
  useCopilotAction({
    name: "refreshFullContent",
    description: "Re-extract the full content from the page URL",
    parameters: [],
    handler: async () => {
      if (!page?.url) {
        return "No URL available for content extraction";
      }

      // Trigger re-extraction
      setIsExtracting(true);
      setExtractionError(null);

      try {
        const response = await fetch("/api/extract-content", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: page.url }),
        });

        if (!response.ok) {
          throw new Error("Failed to extract content");
        }

        const data = await response.json();
        setFullContent(data.result?.raw_content || null);
        return `Successfully refreshed content from ${
          page.url
        }. New content length: ${
          data.result?.raw_content?.length || 0
        } characters.`;
      } catch (error) {
        console.error("Error extracting full content:", error);
        if (error instanceof Error) {
          setExtractionError(error.message);
          return `Failed to refresh content: ${error.message}`;
        } else {
          setExtractionError("Failed to extract content.");
          return "Failed to refresh content: Unknown error";
        }
      } finally {
        setIsExtracting(false);
      }
    },
  });

  useCopilotAction({
    name: "openPageUrl",
    description: "Open the original URL of the current page in a new tab",
    parameters: [],
    handler: async () => {
      if (page?.url) {
        window.open(page.url, "_blank", "noopener,noreferrer");
        return `Opened ${page.url} in a new tab`;
      }
      return "No URL available for this page";
    },
  });

  const getContentStatus = () => {
    if (isExtracting) return "🔄 Extracting full content...";
    if (fullContent) return "✅ Full content available";
    if (extractionError) return "❌ Extraction failed";
    return "⚠️ Using stored content only";
  };

  const getExtractionStatus = () => {
    if (isExtracting) return "extracting";
    if (fullContent) return "complete";
    if (extractionError) return "failed";
    return "unavailable";
  };

  function Header({}: HeaderProps) {
    const { setOpen, icons, labels } = useChatContext();
    
    return (
      <div className="flex justify-between items-center p-4 pt-30 bg-black text-white">
        <div className="text-lg">{labels.title}</div>
        <div className="w-24 flex justify-end">
          <button onClick={() => setOpen(false)} aria-label="Close">
            {icons.headerCloseIcon}
          </button>
        </div>
      </div>
    );
  }
  

  return (
      <CopilotSidebar
        Header={Header}
        defaultOpen={false}
        instructions={`You are an intelligent AI assistant specialized in helping users understand and analyze web page content with enhanced capabilities through full content extraction.
        
        Current page context:
        - Title: ${page?.title || "No title"}
        - Description: ${page?.description || "No description available"}
        - URL: ${page?.url || "No URL"}
        - Original Content: ${page?.content ? "Available" : "No content"}
        - Full Extracted Content: ${fullContent ? "Available" : "Not available"}
        - Content Status: ${getContentStatus()}
        - Created: ${
          page?.$createdAt
            ? new Date(page.$createdAt).toLocaleDateString()
            : "Unknown"
        }
        - Content Length: ${
          fullContent
            ? `${fullContent.length} characters (full)`
            : `${page?.content?.length || 0} characters (stored)`
        }
        
        Enhanced capabilities:
        1. **Full Content Analysis**: ${
          fullContent
            ? "Complete page content extracted from live URL for comprehensive analysis"
            : "Using stored content - full extraction in progress or unavailable"
        }
        2. **Deep Content Understanding**: Answer questions using ${
          fullContent
            ? "complete extracted content"
            : "available stored content"
        }
        3. **Comprehensive Summaries**: Generate detailed summaries based on ${
          fullContent ? "full page content" : "stored content"
        }
        4. **Advanced Topic Analysis**: Identify themes and topics from ${
          fullContent ? "complete content" : "available content"
        }
        5. **Content Structure Analysis**: Understand page organization and structure
        6. **Keyword Extraction**: Find important terms and concepts
        7. **Contextual Q&A**: Answer specific questions about any part of the content
        
        Content extraction status: ${
          isExtracting
            ? "Currently extracting full content from the live URL..."
            : fullContent
            ? "Full content successfully extracted and available for analysis"
            : "Using stored content - full extraction unavailable"
        }
        
        Always reference whether you're using full extracted content or stored content in your responses. If full content is available, you can provide much more comprehensive and accurate analysis.
        
        Use the available actions like analyzePageContent(), getPageMetadata(), and refreshFullContent() to provide the most helpful assistance possible.`}
        labels={{
          title: "Enhanced Page AI Assistant",
          initial: `Hi! I'm your enhanced AI assistant for "${
            page?.title || "this page"
          }".\n ${
            fullContent
              ? "I have access to the complete page content extracted from the live URL and can provide comprehensive analysis."
              : isExtracting
              ? "I'm currently extracting the full page content to provide you with the best possible assistance."
              : "I'm working with the stored content and will try to extract the full content for better analysis."
          } What would you like to explore?`,
        }}
        className="copilot-sidebar-custom"
      >
        {typeof children === "function"
          ? (children as (props: { extractionStatus: string }) => React.ReactNode)({ extractionStatus: getExtractionStatus() })
          : children}
      </CopilotSidebar >
  );
};

export default PageChatInterface;
