"use client";

import { useState } from "react";
import {
  Calendar,
  ExternalLink,
  FileText,
  X,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Brain,
  Trash2,
} from "lucide-react";
import PageChatInterface from "./PageChatInterface";
import DeleteBox from "../DeleteBox";

const PageDetailViewer = ({ page, onClose, onPageDeleted }) => {
  const [isDeleteBoxOpen, setIsDeleteBoxOpen] = useState(false);

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

  const handleDeleteSuccess = () => {
    // Call the parent's callback to handle the page deletion
    onPageDeleted?.(page.$id);
    // Close the detail viewer
    onClose();
  };

  const PageContent = ({ extractionStatus }) => (
    <div className="w-full bg-white/5 backdrop-blur-sm border-l border-white/10 h-screen flex flex-col transition-all duration-300">
      {/* Header - Fixed */}
      <div className="flex-shrink-0 p-6 border-b border-white/10 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold text-white mb-4 leading-tight hover:scale-105 transition-transform duration-300 cursor-default">
              {page.title}
            </h1>
            <div
              onClick={handleUrlClick}
              className="group flex items-center text-blue-300 hover:text-blue-200 cursor-pointer transition-all duration-300"
            >
              <ExternalLink className="w-5 h-5 mr-3 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
              <span className="text-sm font-medium break-all group-hover:underline">
                {page.url}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3 ml-6">
            {/* Delete Button */}
            <button
              onClick={() => setIsDeleteBoxOpen(true)}
              className="group p-3 hover:bg-red-500/10 border border-red-500/20 hover:border-red-500/40 rounded-xl transition-all duration-300 flex-shrink-0 hover:scale-110"
              aria-label="Delete Page"
              title="Delete Page"
            >
              <Trash2 className="w-5 h-5 text-red-400 group-hover:text-red-300 group-hover:rotate-12 transition-all duration-300" />
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="group p-3 hover:bg-white/10 rounded-xl transition-all duration-300 flex-shrink-0 hover:scale-110"
              aria-label="Close"
            >
              <X className="w-6 h-6 text-gray-400 group-hover:text-white group-hover:rotate-90 transition-all duration-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="p-8">
          <div className="p-6 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 backdrop-blur-sm border border-blue-400/30 rounded-2xl">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                {extractionStatus === "extracting" && (
                  <RefreshCw className="w-6 h-6 text-blue-400 animate-spin" />
                )}
                {extractionStatus === "complete" && (
                  <CheckCircle className="w-6 h-6 text-green-400" />
                )}
                {extractionStatus === "failed" && (
                  <AlertCircle className="w-6 h-6 text-orange-400" />
                )}
                {extractionStatus === "unavailable" && (
                  <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse mt-1.5"></div>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm text-blue-200 font-medium mb-2">
                  {extractionStatus === "extracting" && (
                    <>
                      <strong className="text-blue-300">
                        AI Assistant Enhancing:
                      </strong>{" "}
                      Extracting full content from live URL for comprehensive
                      analysis...
                    </>
                  )}
                  {extractionStatus === "complete" && (
                    <>
                      <strong className="text-green-300">
                        AI Assistant Enhanced:
                      </strong>{" "}
                      Full content extracted! Ask detailed questions about this
                      page.
                    </>
                  )}
                  {extractionStatus === "failed" && (
                    <>
                      <strong className="text-orange-300">
                        AI Assistant Available:
                      </strong>{" "}
                      Using stored content. Full extraction unavailable.
                    </>
                  )}
                  {extractionStatus === "unavailable" && (
                    <>
                      <strong className="text-blue-300">
                        AI Assistant Available:
                      </strong>{" "}
                      Click the chat button to ask questions about this page
                      content.
                    </>
                  )}
                </p>
                {extractionStatus === "complete" && (
                  <div className="flex items-center space-x-4 text-xs text-green-300">
                    <span className="flex items-center">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Complete page analysis
                    </span>
                    <span className="flex items-center">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Full content search
                    </span>
                    <span className="flex items-center">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Comprehensive summaries
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-6 text-sm text-gray-300 p-2 mb-6">
            <div className="flex items-center bg-white/5 backdrop-blur-sm px-3 py-2 rounded-lg border border-white/10">
              <Calendar className="w-4 h-4 mr-2 text-blue-400" />
              <span>Created: {formatDate(page.$createdAt)}</span>
            </div>
            {/* {page.extractedAt && (
              <div className="flex items-center bg-white/5 backdrop-blur-sm px-3 py-2 rounded-lg border border-white/10">
                <FileText className="w-4 h-4 mr-2 text-purple-400" />
                <span>Extracted: {formatDate(page.extractedAt)}</span>
              </div>
            )} */}
          </div>
          {page.description && (
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Brain className="w-6 h-6 mr-3 text-blue-400" />
                Description
                <span className="ml-3 text-xs bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full border border-blue-400/30">
                  AI Readable
                </span>
              </h2>
              <div className="bg-blue-500/10 backdrop-blur-sm border-l-4 border-blue-400 p-6 rounded-r-2xl">
                <p className="text-gray-200 leading-relaxed">
                  {page.description}
                </p>
              </div>
            </div>
          )}

          {/* Content Status Banner */}
          <div className="mb-8 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-300">
                  Content Analysis Status:
                </span>
                {extractionStatus === "extracting" && (
                  <span className="flex items-center text-blue-400 text-sm">
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Extracting full content...
                  </span>
                )}
                {extractionStatus === "complete" && (
                  <span className="flex items-center text-green-400 text-sm">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Full content available
                  </span>
                )}
                {extractionStatus === "failed" && (
                  <span className="flex items-center text-orange-400 text-sm">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Using stored content
                  </span>
                )}
                {extractionStatus === "unavailable" && (
                  <span className="text-gray-400 text-sm">
                    Stored content only
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Main Content Section */}
          {page.content && (
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <FileText className="w-6 h-6 mr-3 text-green-400" />
                Content
                <span className="ml-3 text-xs bg-green-500/20 text-green-300 px-3 py-1 rounded-full border border-green-400/30">
                  AI Analyzable
                </span>
                {extractionStatus === "complete" && (
                  <span className="ml-2 text-xs bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full border border-purple-400/30">
                    Enhanced
                  </span>
                )}
              </h2>
              <div className="prose max-w-none">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                  <div className="text-gray-200 leading-relaxed whitespace-pre-wrap">
                    {page.content}
                  </div>
                  {extractionStatus === "complete" && (
                    <div className="mt-6 pt-6 border-t border-white/10">
                      <p className="text-sm text-purple-300 bg-purple-500/10 backdrop-blur-sm p-4 rounded-xl border border-purple-400/30">
                        <strong className="flex items-center mb-2">
                          <Sparkles className="w-4 h-4 mr-2" />
                          AI Enhancement Active:
                        </strong>
                        The AI assistant has access to the complete, up-to-date
                        content extracted from the live URL, enabling
                        comprehensive analysis beyond what's shown here.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Metadata Section */}
          {page.metadata && (
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <FileText className="w-6 h-6 mr-3 text-purple-400" />
                Metadata
                <span className="ml-3 text-xs bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full border border-purple-400/30">
                  Technical Data
                </span>
              </h2>
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 overflow-x-auto border border-white/10">
                <pre className="text-green-400 text-sm font-mono">
                  {JSON.stringify(JSON.parse(page.metadata), null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* Enhanced AI Interaction Tips */}
          <div className="mb-10 p-6 bg-gradient-to-r from-indigo-500/10 to-blue-500/10 backdrop-blur-sm border border-indigo-400/30 rounded-2xl">
            <h3 className="text-lg font-semibold text-indigo-300 mb-4 flex items-center">
              <Brain className="w-6 h-6 mr-3" />
              Enhanced AI Assistant Tips
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-indigo-200">
              <div className="space-y-3">
                <p className="font-medium mb-2 text-green-300">
                  Content Analysis:
                </p>
                <ul className="space-y-2 text-xs">
                  {[
                    '"Summarize this page" - Comprehensive overview',
                    '"What are the main topics?" - Key themes',
                    '"Extract key insights" - Important points',
                  ].map((tip, idx) => (
                    <li key={idx} className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-3">
                <p className="font-medium mb-2 text-blue-300">Deep Search:</p>
                <ul className="space-y-2 text-xs">
                  {[
                    '"Find information about [topic]" - Specific search',
                    '"Explain [concept] from this page" - Detailed explanations',
                    '"What does this page say about [query]?" - Targeted Q&A',
                  ].map((tip, idx) => (
                    <li key={idx} className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {extractionStatus === "complete" && (
              <div className="mt-4 p-3 bg-green-500/10 backdrop-blur-sm border border-green-400/30 rounded-xl text-xs text-green-300">
                <strong className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Full Content Mode:
                </strong>
                <span className="ml-6">
                  Ask complex questions - the AI has access to the complete page
                  content!
                </span>
              </div>
            )}
          </div>

          {/* Footer Info */}
          <div className="mt-16 pt-8 border-t border-white/10">
            <div className="text-xs text-gray-500 space-y-2">
              <p className="font-mono">Document ID: {page.$id}</p>
              <p>Last Updated: {formatDate(page.$updatedAt)}</p>
              <p className="text-green-400 flex items-center">
                <CheckCircle className="w-3 h-3 mr-1" />
                Content available to AI Assistant
              </p>
              {extractionStatus === "complete" && (
                <p className="text-purple-400 flex items-center">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Enhanced with full extracted content
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <PageChatInterface page={page}>
        {({ extractionStatus }) => (
          <PageContent extractionStatus={extractionStatus} />
        )}
      </PageChatInterface>

      {/* Delete Confirmation Modal */}
      <DeleteBox
        page={page}
        isOpen={isDeleteBoxOpen}
        onClose={() => setIsDeleteBoxOpen(false)}
        onDeleteSuccess={handleDeleteSuccess}
      />
    </>
  );
};

export default PageDetailViewer;