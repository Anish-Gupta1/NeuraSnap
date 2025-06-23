import { Calendar, ExternalLink, FileText, X } from "lucide-react";
import PageChatInterface from "./PageChatInterface";

const PageDetailViewer = ({ page, onClose }) => {
  if (!page) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleUrlClick = () => {
    window.open(page.url, "_blank", "noopener,noreferrer");
  };

  const PageContent = () => (
    <div className="w-full bg-white border-l border-gray-200 h-full flex flex-col transition-all duration-300">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-gray-50">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
              {page.title}
            </h1>
            <div
              onClick={handleUrlClick}
              className="flex items-center text-blue-600 hover:text-blue-800 cursor-pointer transition-colors group"
            >
              <ExternalLink className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium break-all">{page.url}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="ml-4 p-2 hover:bg-gray-200 rounded-lg transition-colors flex-shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Metadata */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            <span>Created: {formatDate(page.$createdAt)}</span>
          </div>
          {page.extractedAt && (
            <div className="flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              <span>Extracted: {formatDate(page.extractedAt)}</span>
            </div>
          )}
        </div>

        {/* AI Assistant Info Banner */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <p className="text-sm text-blue-800">
              <strong>AI Assistant Available:</strong> Click the chat button in the sidebar to ask questions about this page content
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          {/* Description Section */}
          {page.description && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                Description
                <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                  AI Readable
                </span>
              </h2>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                <p className="text-gray-700 leading-relaxed">
                  {page.description}
                </p>
              </div>
            </div>
          )}

          {/* Main Content Section */}
          {page.content && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                Content
                <span className="ml-2 text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                  AI Analyzable
                </span>
              </h2>
              <div className="prose max-w-none">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {page.content}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Metadata Section */}
          {page.metadata && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                Metadata
                <span className="ml-2 text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                  Technical Data
                </span>
              </h2>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-green-400 text-sm font-mono">
                  {JSON.stringify(JSON.parse(page.metadata), null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* AI Interaction Tips */}
          <div className="mb-8 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-lg">
            <h3 className="text-md font-semibold text-indigo-800 mb-2">💡 AI Assistant Tips</h3>
            <div className="text-sm text-indigo-700 space-y-1">
              <p>• Ask <strong>"Summarize this page"</strong> for a quick overview</p>
              <p>• Try <strong>"What are the key topics?"</strong> to identify main themes</p>
              <p>• Use <strong>"Explain [specific concept]"</strong> for detailed explanations</p>
              <p>• Request <strong>"Extract keywords"</strong> to find important terms</p>
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-12 pt-6 border-t border-gray-200">
            <div className="text-xs text-gray-500 space-y-1">
              <p>Document ID: {page.$id}</p>
              <p>Last Updated: {formatDate(page.$updatedAt)}</p>
              <p className="text-green-600">✓ Content available to AI Assistant</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <PageChatInterface page={page}>
      <PageContent />
    </PageChatInterface>
  );
};

export default PageDetailViewer;