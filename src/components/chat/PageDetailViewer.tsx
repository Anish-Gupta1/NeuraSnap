import { Calendar, ExternalLink, FileText, X, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";
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

  const PageContent = ({ extractionStatus }) => (
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

        {/* Enhanced AI Assistant Info Banner */}
        <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              {extractionStatus === 'extracting' && <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />}
              {extractionStatus === 'complete' && <CheckCircle className="w-5 h-5 text-green-500" />}
              {extractionStatus === 'failed' && <AlertCircle className="w-5 h-5 text-orange-500" />}
              {extractionStatus === 'unavailable' && <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mt-1.5"></div>}
            </div>
            <div className="flex-1">
              <p className="text-sm text-blue-800 font-medium">
                {extractionStatus === 'extracting' && (
                  <>
                    <strong>AI Assistant Enhancing:</strong> Extracting full content from live URL for comprehensive analysis...
                  </>
                )}
                {extractionStatus === 'complete' && (
                  <>
                    <strong>AI Assistant Enhanced:</strong> Full content extracted! Ask detailed questions about this page.
                  </>
                )}
                {extractionStatus === 'failed' && (
                  <>
                    <strong>AI Assistant Available:</strong> Using stored content. Full extraction unavailable.
                  </>
                )}
                {extractionStatus === 'unavailable' && (
                  <>
                    <strong>AI Assistant Available:</strong> Click the chat button to ask questions about this page content.
                  </>
                )}
              </p>
              {extractionStatus === 'complete' && (
                <p className="text-xs text-green-700 mt-1">
                  ✓ Complete page analysis • ✓ Full content search • ✓ Comprehensive summaries
                </p>
              )}
            </div>
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

          {/* Content Status Banner */}
          <div className="mb-6 p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Content Analysis Status:</span>
                {extractionStatus === 'extracting' && (
                  <span className="flex items-center text-blue-600 text-sm">
                    <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                    Extracting full content...
                  </span>
                )}
                {extractionStatus === 'complete' && (
                  <span className="flex items-center text-green-600 text-sm">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Full content available
                  </span>
                )}
                {extractionStatus === 'failed' && (
                  <span className="flex items-center text-orange-600 text-sm">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Using stored content
                  </span>
                )}
                {extractionStatus === 'unavailable' && (
                  <span className="text-gray-600 text-sm">Stored content only</span>
                )}
              </div>
            </div>
          </div>

          {/* Main Content Section */}
          {page.content && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                Content
                <span className="ml-2 text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                  AI Analyzable
                </span>
                {extractionStatus === 'complete' && (
                  <span className="ml-2 text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                    Enhanced
                  </span>
                )}
              </h2>
              <div className="prose max-w-none">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {page.content}
                  </div>
                  {extractionStatus === 'complete' && (
                    <div className="mt-4 pt-4 border-t border-gray-300">
                      <p className="text-sm text-purple-700 bg-purple-50 p-3 rounded-lg">
                        <strong>📈 AI Enhancement Active:</strong> The AI assistant has access to the complete, up-to-date content extracted from the live URL, enabling comprehensive analysis beyond what's shown here.
                      </p>
                    </div>
                  )}
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

          {/* Enhanced AI Interaction Tips */}
          <div className="mb-8 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-lg">
            <h3 className="text-md font-semibold text-indigo-800 mb-3">💡 Enhanced AI Assistant Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-indigo-700">
              <div>
                <p className="font-medium mb-1">Content Analysis:</p>
                <ul className="space-y-1 text-xs">
                  <li>• <strong>"Summarize this page"</strong> - Comprehensive overview</li>
                  <li>• <strong>"What are the main topics?"</strong> - Key themes</li>
                  <li>• <strong>"Extract key insights"</strong> - Important points</li>
                </ul>
              </div>
              <div>
                <p className="font-medium mb-1">Deep Search:</p>
                <ul className="space-y-1 text-xs">
                  <li>• <strong>"Find information about [topic]"</strong> - Specific search</li>
                  <li>• <strong>"Explain [concept] from this page"</strong> - Detailed explanations</li>
                  <li>• <strong>"What does this page say about [query]?"</strong> - Targeted Q&A</li>
                </ul>
              </div>
            </div>
            {extractionStatus === 'complete' && (
              <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded text-xs text-green-800">
                <strong>✓ Full Content Mode:</strong> Ask complex questions - the AI has access to the complete page content!
              </div>
            )}
          </div>

          {/* Footer Info */}
          <div className="mt-12 pt-6 border-t border-gray-200">
            <div className="text-xs text-gray-500 space-y-1">
              <p>Document ID: {page.$id}</p>
              <p>Last Updated: {formatDate(page.$updatedAt)}</p>
              <p className="text-green-600">✓ Content available to AI Assistant</p>
              {extractionStatus === 'complete' && (
                <p className="text-purple-600">✓ Enhanced with full extracted content</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <PageChatInterface page={page}>
      {({ extractionStatus }) => <PageContent extractionStatus={extractionStatus} />}
    </PageChatInterface>
  );
};

export default PageDetailViewer;