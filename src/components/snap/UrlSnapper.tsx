"use client";
import React, { useState, useEffect, useTransition } from 'react';
import { AlertCircle, CheckCircle, Globe, Zap, Clock, BarChart3, ExternalLink, Copy, RefreshCw, AlertTriangle } from 'lucide-react';

// Import your actual server actions - replace these mock functions
import { snapSingleUrl, snapMultipleUrls, getSnapStats, validateUrl, checkUrlExists } from '../../lib/server/snap-actions';

const EnhancedUrlSnapper = () => {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);
  const [validationState, setValidationState] = useState({ isValid: true, message: '', suggestions: [] });
  const [urlCheckState, setUrlCheckState] = useState({ exists: false, data: null });
  const [isPending, startTransition] = useTransition();


  // Real-time URL validation with debouncing
  useEffect(() => {
    if (!url.trim()) {
      setValidationState({ isValid: true, message: '', suggestions: [] });
      setUrlCheckState({ exists: false, data: null });
      return;
    }

    const debounceTimer = setTimeout(async () => {
      const firstUrl = url.split('\n')[0].trim();
      if (firstUrl) {
        const validation = await validateUrl(firstUrl);
        setValidationState({
          isValid: validation.isValid,
          message: validation.error || '',
          suggestions: validation.suggestions || []
        });

        // Check if URL already exists (only for single URLs)
        if (validation.isValid && !url.includes('\n')) {
          const existsCheck = await checkUrlExists(firstUrl);
          setUrlCheckState({ exists: existsCheck.exists, data: existsCheck });
        } else {
          setUrlCheckState({ exists: false, data: null });
        }
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [url]);

  const handleSnap = () => {
    startTransition(async () => {
      setError('');
      setResult(null);

      try {
        const urlsToProcess = url.split('\n').filter(u => u.trim()).map(u => u.trim());
        
        if (urlsToProcess.length === 1) {
          const response = await snapSingleUrl(urlsToProcess[0]);
          setResult(response);
        } else {
          const response = await snapMultipleUrls(urlsToProcess);
          setResult(response);
        }
        
        setUrl(''); // Clear input on success
        await loadStats(); // Refresh stats
      } catch (err) {
        setError(err.message || 'Failed to snap URL(s)');
      }
    });
  };

  const loadStats = async () => {
    try {
      const statsResponse = await getSnapStats();
      if (statsResponse.success) {
        setStats(statsResponse.data);
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const applySuggestion = (suggestion) => {
    setUrl(suggestion);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    loadStats();
  }, []);

  const urlCount = url.split('\n').filter(u => u.trim()).length;
  const isBulkMode = urlCount > 1;
  const isProcessing = isPending;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Zap className="w-8 h-8 text-blue-500" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Smart URL Snapper
          </h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Transform any webpage into intelligent, searchable content with AI-powered extraction and instant FAQ generation.
        </p>
      </div>

      {/* Enhanced Stats Dashboard */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-blue-600" />
                <span className="text-blue-800 font-medium">Pages Snapped</span>
              </div>
              <button 
                onClick={loadStats}
                className="text-blue-600 hover:text-blue-800 transition-colors"
                title="Refresh stats"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
            <p className="text-2xl font-bold text-blue-900 mt-1">{stats.totalPages}</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-green-600" />
              <span className="text-green-800 font-medium">Avg Content</span>
            </div>
            <p className="text-2xl font-bold text-green-900 mt-1">{stats.avgContentLength.toLocaleString()}</p>
            <p className="text-xs text-green-600 mt-1">characters per page</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-purple-600" />
              <span className="text-purple-800 font-medium">Total Words</span>
            </div>
            <p className="text-2xl font-bold text-purple-900 mt-1">{Math.round(stats.totalContent / 5).toLocaleString()}</p>
            <p className="text-xs text-purple-600 mt-1">estimated</p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-orange-600" />
              <span className="text-orange-800 font-medium">Top Domain</span>
            </div>
            <p className="text-lg font-bold text-orange-900 mt-1">{stats.topDomains[0]?.domain || 'N/A'}</p>
            <p className="text-xs text-orange-600 mt-1">{stats.topDomains[0]?.count || 0} pages</p>
          </div>
        </div>
      )}

      {/* Enhanced Snapping Interface */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span>Snap Content</span>
              </h2>
              <p className="text-blue-100 mt-1">
                {isBulkMode ? `Bulk processing ${urlCount} URLs` : 'Extract intelligent content from any webpage'}
              </p>
            </div>
            {isBulkMode && (
              <div className="bg-white/20 px-3 py-1 rounded-full">
                <span className="text-white text-sm font-medium">Bulk Mode</span>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL or URLs (one per line for bulk processing)
              </label>
              <div className="relative">
                <textarea
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/article&#10;https://another-site.com/blog&#10;https://docs.example.com/guide"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-colors ${
                    !validationState.isValid && url.trim() ? 'border-red-300 bg-red-50' : 
                    urlCheckState.exists ? 'border-yellow-300 bg-yellow-50' : 'border-gray-300'
                  }`}
                  rows={isBulkMode ? 6 : 4}
                  disabled={isProcessing}
                />
                {url.trim() && (
                  <div className="absolute top-2 right-2">
                    {urlCheckState.exists ? (
                      <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    ) : validationState.isValid ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                )}
              </div>
              
              {/* URL Validation Feedback */}
              {!validationState.isValid && url.trim() && (
                <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{validationState.message}</p>
                  {validationState.suggestions.length > 0 && (
                    <div className="mt-2 space-y-1">
                      <p className="text-red-600 text-xs font-medium">Did you mean:</p>
                      {validationState.suggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => applySuggestion(suggestion)}
                          className="block text-xs text-blue-600 hover:text-blue-800 underline"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* URL Already Exists Warning */}
              {urlCheckState.exists && urlCheckState.data && (
                <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-yellow-800 text-sm font-medium">URL Already Snapped</p>
                      <p className="text-yellow-700 text-xs mt-1">
                        "{urlCheckState.data.title}" was snapped on {formatDate(urlCheckState.data.lastSnapped)}
                      </p>
                      <p className="text-yellow-600 text-xs mt-1">
                        You can still re-snap to get updated content.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* URL Count Display */}
              {url.trim() && (
                <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                  <span>{urlCount} URL{urlCount > 1 ? 's' : ''} detected</span>
                  {isBulkMode && <span>Bulk processing mode active (max 10 URLs)</span>}
                </div>
              )}
            </div>

            <button
              onClick={handleSnap}
              disabled={isProcessing || !url.trim() || (!validationState.isValid && !isBulkMode)}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isProcessing ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{isBulkMode ? 'Processing URLs...' : 'Snapping Content...'}</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <Zap className="w-4 h-4" />
                  <span>
                    {urlCheckState.exists ? 'Re-snap Content' : 
                     isBulkMode ? `Snap ${urlCount} URLs` : 'Snap Content'}
                  </span>
                </div>
              )}
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-red-800">Error</h3>
                <p className="text-red-700 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Enhanced Success Display */}
          {result?.success && !result.data?.summary && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-medium text-green-800">Successfully Snapped!</h3>
                  <div className="mt-3 space-y-3">
                    <div className="bg-white rounded-lg p-4 border border-green-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 pr-3">
                          <h4 className="font-medium text-gray-900 mb-2">{result.data.title}</h4>
                          <p className="text-sm text-gray-600 leading-relaxed">{result.data.description}</p>
                        </div>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => copyToClipboard(result.data.url)}
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
                            title="Copy URL"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <a
                            href={result.data.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
                            title="Open original"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mt-4 pt-3 border-t border-green-100 text-xs">
                        <div>
                          <span className="text-gray-500">Domain:</span>
                          <p className="font-medium text-gray-700">{result.data.domain}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Content Length:</span>
                          <p className="font-medium text-gray-700">{result.data.contentLength.toLocaleString()} chars</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Page ID:</span>
                          <p className="font-medium text-gray-700 font-mono">{result.data.pageId.slice(-8)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Bulk Results */}
          {result?.success && result.data?.summary && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-medium text-green-800 flex items-center space-x-2 mb-4">
                  <CheckCircle className="w-5 h-5" />
                  <span>Bulk Snap Complete</span>
                </h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center p-4 bg-white rounded-lg border border-green-200">
                    <div className="text-2xl font-bold text-gray-800 mb-1">{result.data.summary.total}</div>
                    <div className="text-gray-600">Total URLs</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border border-green-200">
                    <div className="text-2xl font-bold text-green-800 mb-1">{result.data.summary.successful}</div>
                    <div className="text-green-600">Successful</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border border-red-200">
                    <div className="text-2xl font-bold text-red-800 mb-1">{result.data.summary.failed}</div>
                    <div className="text-red-600">Failed</div>
                  </div>
                </div>
              </div>

              {/* Successful URLs */}
              {result.data.successful.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-800 mb-3">Successfully Snapped URLs:</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {result.data.successful.map((item, idx) => (
                      <div key={idx} className="bg-white rounded-lg p-3 border border-green-200">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                            <p className="text-xs text-gray-500 truncate">{item.url}</p>
                          </div>
                          <div className="flex space-x-1 ml-2">
                            <button
                              onClick={() => copyToClipboard(item.url)}
                              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                              title="Copy URL"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                              title="Open original"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Failed URLs */}
              {result.data.failed.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-medium text-red-800 mb-3">Failed URLs:</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {result.data.failed.map((item, idx) => (
                      <div key={idx} className="bg-white rounded-lg p-3 border border-red-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-700 break-all">{item.url}</p>
                            <p className="text-xs text-red-600 mt-1">{item.error}</p>
                          </div>
                          <button
                            onClick={() => copyToClipboard(item.url)}
                            className="p-1 text-gray-400 hover:text-gray-600 transition-colors ml-2 flex-shrink-0"
                            title="Copy URL"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Tips Section */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center space-x-2">
          <Globe className="w-5 h-5" />
          <span>Pro Tips & Best Practices</span>
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">✅ What Works Best</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• Articles and blog posts with rich text content</li>
              <li>• Documentation pages and tutorials</li>
              <li>• News articles and research papers</li>
              <li>• GitHub README files and wikis</li>
              <li>• Medium, Dev.to, and similar platforms</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-2">❌ What to Avoid</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• URLs requiring login or behind paywalls</li>
              <li>• Social media posts and dynamic content</li>
              <li>• File downloads (PDFs, images, videos)</li>
              <li>• Single-page applications with minimal text</li>
              <li>• Sites with aggressive anti-bot measures</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">🚀 Bulk Processing Tips</h4>
          <ul className="space-y-1 text-sm text-blue-700">
            <li>• Maximum 10 URLs per batch to prevent timeouts</li>
            <li>• Add delays between requests to respect rate limits</li>
            <li>• Group similar domains together for better success rates</li>
            <li>• Check individual URL validity before bulk processing</li>
          </ul>
        </div>
      </div>

      {/* Top Domains Stats */}
      {stats && stats.topDomains.length > 0 && (
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>Top Snapped Domains</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {stats.topDomains.map((domain, idx) => (
              <div key={domain.domain} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {idx + 1}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{domain.domain}</span>
                </div>
                <span className="text-sm text-gray-500">{domain.count} pages</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedUrlSnapper;