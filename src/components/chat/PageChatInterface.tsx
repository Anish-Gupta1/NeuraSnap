import { useCopilotReadable, useCopilotAction } from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";
// import { useState, useEffect } from "react";

const PageChatInterface = ({ page, children }) => {
  // Make the page data readable by CopilotKit
  useCopilotReadable({
    description: `Current page being viewed: ${page?.title}`,
    value: {
      title: page?.title || "",
      description: page?.description || "",
      content: page?.content || "",
      url: page?.url || "",
      createdAt: page?.$createdAt || "",
      extractedAt: page?.extractedAt || "",
      metadata: page?.metadata ? JSON.parse(page.metadata) : {}
    }
  });

  // Add custom actions for page-specific operations
  useCopilotAction({
    name: "analyzePageContent",
    description: "Analyze and provide insights about the current page content",
    parameters: [
      {
        name: "analysisType",
        type: "string",
        description: "Type of analysis to perform: summary, keywords, topics, or insights",
        enum: ["summary", "keywords", "topics", "insights"]
      }
    ],
    handler: async ({ analysisType }) => {
      const pageData = {
        title: page?.title || "",
        description: page?.description || "",
        content: page?.content || ""
      };

      switch (analysisType) {
        case "summary":
          return `Page Summary: "${pageData.title}" - ${pageData.description || "This page contains detailed content that covers various topics and information."}`;
        case "keywords":
          // Simple keyword extraction (in real implementation, you'd use more sophisticated NLP)
          const words = (pageData.content + " " + pageData.title + " " + pageData.description)
            .toLowerCase()
            .split(/\W+/)
            .filter(word => word.length > 3)
            .slice(0, 10);
          return `Key terms found: ${[...new Set(words)].join(", ")}`;
        case "topics":
          return `Main topics in "${pageData.title}": Based on the content, this page covers topics related to the title and description provided.`;
        case "insights":
          return `Page insights: This page was created on ${new Date(page?.$createdAt).toLocaleDateString()} and contains valuable information about ${pageData.title}.`;
        default:
          return "Analysis completed.";
      }
    }
  });

  useCopilotAction({
    name: "getPageMetadata",
    description: "Get detailed metadata information about the current page",
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
        hasMetadata: !!page?.metadata
      };
    }
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
    }
  });

  return (
    <CopilotSidebar
      defaultOpen={false}
      instructions={`You are an intelligent AI assistant specialized in helping users understand and analyze web page content. 

Current page context:
- Title: ${page?.title || "No title"}
- Description: ${page?.description || "No description available"}
- URL: ${page?.url || "No URL"}
- Has Content: ${page?.content ? "Yes" : "No"}
- Created: ${page?.$createdAt ? new Date(page.$createdAt).toLocaleDateString() : "Unknown"}
- Content Length: ${page?.content ? `${page.content.length} characters` : "No content"}

Your capabilities:
1. **Content Analysis**: Summarize, extract keywords, identify topics, and provide insights
2. **Question Answering**: Answer specific questions about the page content
3. **Information Extraction**: Help find specific information within the page
4. **Contextual Understanding**: Explain complex topics and concepts from the page
5. **Page Navigation**: Help users understand page structure and metadata

Always be helpful, accurate, and reference the specific page content when possible. If information isn't available in the page data, clearly state that limitation and suggest alternatives.

Use the available actions like analyzePageContent() and getPageMetadata() to provide comprehensive assistance.`}
      labels={{
        title: "Page AI Assistant",
        initial: `Hi! I'm your AI assistant for "${page?.title || 'this page'}". I can help you understand the content, answer questions, perform analysis, and provide insights. What would you like to explore?`,
      }}
      className="copilot-sidebar-custom"
    >
      {children}
    </CopilotSidebar>
  );
};

export default PageChatInterface;