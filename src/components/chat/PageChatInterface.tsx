import { useCopilotReadable, useCopilotAction } from "@copilotkit/react-core";
import { CopilotChat } from "@copilotkit/react-ui";
import { useState } from "react";
import { MessageCircle, X, Bot } from "lucide-react";

const PageChatInterface = ({ page }) => {
  const [isExpanded, setIsExpanded] = useState(false);

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

  if (!isExpanded) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsExpanded(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-200 hover:scale-110 group"
          aria-label="Open AI Assistant"
        >
          <MessageCircle className="w-6 h-6 group-hover:animate-pulse" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-white border border-gray-200 rounded-lg shadow-2xl flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bot className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="font-semibold text-gray-800">AI Page Assistant</h3>
              <p className="text-xs text-gray-600">Powered by CopilotKit</p>
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(false)}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-lg hover:bg-white/50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="mt-2 p-2 bg-white/50 rounded-md">
          <p className="text-xs text-gray-700 truncate" title={page?.title}>
            📄 {page?.title}
          </p>
        </div>
      </div>

      {/* CopilotKit Chat Interface */}
      <div className="flex-1 overflow-hidden">
        <CopilotChat
          instructions={`You are an intelligent assistant helping users understand and analyze web page content. 

Current page context:
- Title: ${page?.title || "No title"}
- Description: ${page?.description || "No description available"}
- URL: ${page?.url || "No URL"}
- Has Content: ${page?.content ? "Yes" : "No"}
- Created: ${page?.$createdAt ? new Date(page.$createdAt).toLocaleDateString() : "Unknown"}

You can help users by:
1. Summarizing the page content
2. Answering questions about specific information
3. Explaining complex topics from the page
4. Providing insights and analysis
5. Extracting key information and themes

Be helpful, accurate, and reference the specific page content when possible. If asked about information not available in the page data, clearly state that limitation.`}
          labels={{
            title: "Page Assistant",
            initial: `Hi! I'm your AI assistant for analyzing "${page?.title}". I can help you understand the content, answer questions, and provide insights. What would you like to know?`,
          }}
          className="h-full"
        />
      </div>
    </div>
  );
};

export default PageChatInterface;