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

  return (
    <>
      <div className="w-2/3 bg-white border-l border-gray-200 h-full flex flex-col">
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
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Description Section */}
            {page.description && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">
                  Description
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
                <h2 className="text-lg font-semibold text-gray-800 mb-3">
                  Content
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
                <h2 className="text-lg font-semibold text-gray-800 mb-3">
                  Metadata
                </h2>
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-green-400 text-sm font-mono">
                    {JSON.stringify(JSON.parse(page.metadata), null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {/* Footer Info */}
            <div className="mt-12 pt-6 border-t border-gray-200">
              <div className="text-xs text-gray-500 space-y-1">
                <p>Document ID: {page.$id}</p>
                <p>Last Updated: {formatDate(page.$updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <PageChatInterface page={page} />
    </>
  );
};

export default PageDetailViewer;