"use client"

import { useState, useEffect, useTransition } from "react"
import {
  AlertCircle,
  CheckCircle,
  Globe,
  Zap,
  BarChart3,
  ExternalLink,
  Copy,
  RefreshCw,
  AlertTriangle,
  Sparkles,
  Brain,
} from "lucide-react"

// Import your actual server actions - replace these mock functions
import {
  snapSingleUrl,
  snapMultipleUrls,
  getSnapStats,
  validateUrl,
  checkUrlExists,
} from "../../lib/server/snap-actions"

const EnhancedUrlSnapper = () => {
  const [url, setUrl] = useState("")
  const [result, setResult] = useState(null)
  const [error, setError] = useState("")
  const [stats, setStats] = useState(null)
  const [validationState, setValidationState] = useState({ isValid: true, message: "", suggestions: [] })
  const [urlCheckState, setUrlCheckState] = useState({ exists: false, data: null })
  const [isPending, startTransition] = useTransition()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Real-time URL validation with debouncing
  useEffect(() => {
    if (!url.trim()) {
      setValidationState({ isValid: true, message: "", suggestions: [] })
      setUrlCheckState({ exists: false, data: null })
      return
    }

    const debounceTimer = setTimeout(async () => {
      const firstUrl = url.split("\n")[0].trim()
      if (firstUrl) {
        const validation = await validateUrl(firstUrl)
        setValidationState({
          isValid: validation.isValid,
          message: validation.error || "",
          suggestions: validation.suggestions || [],
        })

        // Check if URL already exists (only for single URLs)
        if (validation.isValid && !url.includes("\n")) {
          const existsCheck = await checkUrlExists(firstUrl)
          setUrlCheckState({ exists: existsCheck.exists, data: existsCheck })
        } else {
          setUrlCheckState({ exists: false, data: null })
        }
      }
    }, 500)

    return () => clearTimeout(debounceTimer)
  }, [url])

  const handleSnap = () => {
    startTransition(async () => {
      setError("")
      setResult(null)

      try {
        const urlsToProcess = url
          .split("\n")
          .filter((u) => u.trim())
          .map((u) => u.trim())

        if (urlsToProcess.length === 1) {
          const response = await snapSingleUrl(urlsToProcess[0])
          setResult(response)
        } else {
          const response = await snapMultipleUrls(urlsToProcess)
          setResult(response)
        }

        setUrl("") // Clear input on success
        await loadStats() // Refresh stats
      } catch (err) {
        setError(err.message || "Failed to snap URL(s)")
      }
    })
  }

  const loadStats = async () => {
    try {
      const statsResponse = await getSnapStats()
      if (statsResponse.success) {
        setStats(statsResponse.data)
      }
    } catch (error) {
      console.error("Failed to load stats:", error)
    }
  }

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      // You could add a toast notification here
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  const applySuggestion = (suggestion) => {
    setUrl(suggestion)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  useEffect(() => {
    loadStats()
  }, [])

  const urlCount = url.split("\n").filter((u) => u.trim()).length
  const isBulkMode = urlCount > 1
  const isProcessing = isPending

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      {/* Mouse Follower Light */}
      <div
        className="fixed w-96 h-96 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl pointer-events-none z-10 transition-all duration-300"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
      />

      <div className="relative z-20 max-w-6xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-6 pt-20">
          <div className="flex items-center justify-center space-x-3">
            <div className="relative">
              <Zap className="w-10 h-10 text-blue-400" />
              <div className="absolute inset-0 bg-blue-400 blur-lg opacity-50"></div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-300 bg-clip-text text-transparent">
              Smart URL Snapper
            </h1>
            <Sparkles className="w-8 h-8 text-purple-400 animate-pulse" />
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Transform any webpage into intelligent, searchable content with AI-powered extraction and instant FAQ
            generation.
          </p>
        </div>

        {/* Enhanced Stats Dashboard */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              {
                icon: <Globe className="w-6 h-6" />,
                title: "Pages Snapped",
                value: stats.totalPages,
                subtitle: "total pages",
                gradient: "from-blue-500 to-cyan-500",
                bgGradient: "from-blue-500/10 to-cyan-500/10",
              },
              {
                icon: <BarChart3 className="w-6 h-6" />,
                title: "Avg Content",
                value: stats.avgContentLength.toLocaleString(),
                subtitle: "characters per page",
                gradient: "from-green-500 to-emerald-500",
                bgGradient: "from-green-500/10 to-emerald-500/10",
              },
              {
                icon: <Brain className="w-6 h-6" />,
                title: "Total Words",
                value: Math.round(stats.totalContent / 5).toLocaleString(),
                subtitle: "estimated",
                gradient: "from-purple-500 to-pink-500",
                bgGradient: "from-purple-500/10 to-pink-500/10",
              },
              {
                icon: <Globe className="w-6 h-6" />,
                title: "Top Domain",
                value: stats.topDomains[0]?.domain || "N/A",
                subtitle: `${stats.topDomains[0]?.count || 0} pages`,
                gradient: "from-orange-500 to-red-500",
                bgGradient: "from-orange-500/10 to-red-500/10",
              },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl"
              >
                {/* Glow Effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${stat.bgGradient} opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-500`}
                ></div>

                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${stat.gradient} rounded-xl flex items-center justify-center text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                    >
                      {stat.icon}
                    </div>
                    {idx === 0 && (
                      <button
                        onClick={loadStats}
                        className="text-gray-400 hover:text-white transition-colors duration-300 hover:scale-110"
                        title="Refresh stats"
                      >
                        <RefreshCw className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  <h3 className="text-gray-300 font-medium mb-2">{stat.title}</h3>
                  <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                  <p className="text-sm text-gray-400">{stat.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Enhanced Snapping Interface */}
        <div className="relative bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden hover:bg-white/10 transition-all duration-500">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-blue-500/20 to-purple-600/20 p-8 border-b border-white/10">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-white flex items-center space-x-3">
                  <Zap className="w-6 h-6" />
                  <span>Snap Content</span>
                </h2>
                <p className="text-blue-200 mt-2">
                  {isBulkMode ? `Bulk processing ${urlCount} URLs` : "Extract intelligent content from any webpage"}
                </p>
              </div>
              {isBulkMode && (
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                  <span className="text-white text-sm font-medium">Bulk Mode</span>
                </div>
              )}
            </div>
          </div>

          <div className="p-8 space-y-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  URL or URLs (one per line for bulk processing)
                </label>
                <div className="relative">
                  <textarea
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com/article&#10;https://another-site.com/blog&#10;https://docs.example.com/guide"
                    className={`w-full px-6 py-4 bg-white/5 backdrop-blur-sm border rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-300 text-white placeholder-gray-400 ${
                      !validationState.isValid && url.trim()
                        ? "border-red-400/50 bg-red-500/10"
                        : urlCheckState.exists
                          ? "border-yellow-400/50 bg-yellow-500/10"
                          : "border-white/20 hover:border-white/30"
                    }`}
                    rows={isBulkMode ? 6 : 4}
                    disabled={isProcessing}
                  />
                  {url.trim() && (
                    <div className="absolute top-4 right-4">
                      {urlCheckState.exists ? (
                        <AlertTriangle className="w-5 h-5 text-yellow-400" />
                      ) : validationState.isValid ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-400" />
                      )}
                    </div>
                  )}
                </div>

                {/* URL Validation Feedback */}
                {!validationState.isValid && url.trim() && (
                  <div className="mt-4 p-4 bg-red-500/10 backdrop-blur-sm border border-red-400/30 rounded-2xl">
                    <p className="text-red-300 text-sm">{validationState.message}</p>
                    {validationState.suggestions.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <p className="text-red-200 text-xs font-medium">Did you mean:</p>
                        {validationState.suggestions.map((suggestion, idx) => (
                          <button
                            key={idx}
                            onClick={() => applySuggestion(suggestion)}
                            className="block text-xs text-blue-300 hover:text-blue-200 underline transition-colors duration-200"
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
                  <div className="mt-4 p-4 bg-yellow-500/10 backdrop-blur-sm border border-yellow-400/30 rounded-2xl">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-yellow-200 text-sm font-medium">URL Already Snapped</p>
                        <p className="text-yellow-300 text-xs mt-1">
                          "{urlCheckState.data.title}" was snapped on {formatDate(urlCheckState.data.lastSnapped)}
                        </p>
                        <p className="text-yellow-400 text-xs mt-1">You can still re-snap to get updated content.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* URL Count Display */}
                {url.trim() && (
                  <div className="mt-3 flex items-center justify-between text-sm text-gray-400">
                    <span>
                      {urlCount} URL{urlCount > 1 ? "s" : ""} detected
                    </span>
                    {isBulkMode && <span>Bulk processing mode active (max 10 URLs)</span>}
                  </div>
                )}
              </div>

              <button
                onClick={handleSnap}
                disabled={isProcessing || !url.trim() || (!validationState.isValid && !isBulkMode)}
                className="group relative w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 rounded-2xl font-medium hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 overflow-hidden"
              >
                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>

                {isProcessing ? (
                  <div className="relative flex items-center justify-center space-x-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>{isBulkMode ? "Processing URLs..." : "Snapping Content..."}</span>
                  </div>
                ) : (
                  <div className="relative flex items-center justify-center space-x-3">
                    <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                    <span>
                      {urlCheckState.exists ? "Re-snap Content" : isBulkMode ? `Snap ${urlCount} URLs` : "Snap Content"}
                    </span>
                  </div>
                )}
              </button>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-500/10 backdrop-blur-sm border border-red-400/30 rounded-2xl p-6 flex items-start space-x-4">
                <AlertCircle className="w-6 h-6 text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-red-300 mb-1">Error</h3>
                  <p className="text-red-200">{error}</p>
                </div>
              </div>
            )}

            {/* Enhanced Success Display */}
            {result?.success && !result.data?.summary && (
              <div className="bg-green-500/10 backdrop-blur-sm border border-green-400/30 rounded-2xl p-6">
                <div className="flex items-start space-x-4">
                  <CheckCircle className="w-6 h-6 text-green-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-medium text-green-300 mb-4">Successfully Snapped!</h3>
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 pr-4">
                          <h4 className="font-medium text-white mb-3">{result.data.title}</h4>
                          <p className="text-sm text-gray-300 leading-relaxed">{result.data.description}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => copyToClipboard(result.data.url)}
                            className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/10"
                            title="Copy URL"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <a
                            href={result.data.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/10"
                            title="Open original"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-white/10 text-xs">
                        <div>
                          <span className="text-gray-400">Domain:</span>
                          <p className="font-medium text-gray-200 mt-1">{result.data.domain}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Content Length:</span>
                          <p className="font-medium text-gray-200 mt-1">
                            {result.data.contentLength.toLocaleString()} chars
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-400">Page ID:</span>
                          <p className="font-medium text-gray-200 font-mono mt-1">{result.data.pageId.slice(-8)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Bulk Results */}
            {result?.success && result.data?.summary && (
              <div className="space-y-6">
                <div className="bg-green-500/10 backdrop-blur-sm border border-green-400/30 rounded-2xl p-6">
                  <h3 className="font-medium text-green-300 flex items-center space-x-3 mb-6">
                    <CheckCircle className="w-6 h-6" />
                    <span>Bulk Snap Complete</span>
                  </h3>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    {[
                      { label: "Total URLs", value: result.data.summary.total, color: "gray" },
                      { label: "Successful", value: result.data.summary.successful, color: "green" },
                      { label: "Failed", value: result.data.summary.failed, color: "red" },
                    ].map((stat, idx) => (
                      <div
                        key={idx}
                        className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10"
                      >
                        <div className={`text-2xl font-bold text-${stat.color}-300 mb-1`}>{stat.value}</div>
                        <div className={`text-${stat.color}-400`}>{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Successful URLs */}
                {result.data.successful.length > 0 && (
                  <div className="bg-green-500/10 backdrop-blur-sm border border-green-400/30 rounded-2xl p-6">
                    <h4 className="font-medium text-green-300 mb-4">Successfully Snapped URLs:</h4>
                    <div className="space-y-3 max-h-40 overflow-y-auto">
                      {result.data.successful.map((item, idx) => (
                        <div
                          key={idx}
                          className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-white truncate">{item.title}</p>
                              <p className="text-xs text-gray-400 truncate">{item.url}</p>
                            </div>
                            <div className="flex space-x-2 ml-3">
                              <button
                                onClick={() => copyToClipboard(item.url)}
                                className="p-1 text-gray-400 hover:text-white transition-colors"
                                title="Copy URL"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 text-gray-400 hover:text-white transition-colors"
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
                  <div className="bg-red-500/10 backdrop-blur-sm border border-red-400/30 rounded-2xl p-6">
                    <h4 className="font-medium text-red-300 mb-4">Failed URLs:</h4>
                    <div className="space-y-3 max-h-40 overflow-y-auto">
                      {result.data.failed.map((item, idx) => (
                        <div key={idx} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-200 break-all">{item.url}</p>
                              <p className="text-xs text-red-300 mt-1">{item.error}</p>
                            </div>
                            <button
                              onClick={() => copyToClipboard(item.url)}
                              className="p-1 text-gray-400 hover:text-white transition-colors ml-3 flex-shrink-0"
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
        <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-500">
          <h3 className="font-semibold text-white mb-6 flex items-center space-x-3">
            <Globe className="w-6 h-6 text-blue-400" />
            <span>Pro Tips & Best Practices</span>
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="font-medium text-green-300 mb-3 flex items-center space-x-2">
                <CheckCircle className="w-5 h-5" />
                <span>What Works Best</span>
              </h4>
              <ul className="space-y-2 text-sm text-gray-300">
                {[
                  "Articles and blog posts with rich text content",
                  "Documentation pages and tutorials",
                  "News articles and research papers",
                  "GitHub README files and wikis",
                  "Medium, Dev.to, and similar platforms",
                ].map((tip, idx) => (
                  <li key={idx} className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium text-red-300 mb-3 flex items-center space-x-2">
                <AlertCircle className="w-5 h-5" />
                <span>What to Avoid</span>
              </h4>
              <ul className="space-y-2 text-sm text-gray-300">
                {[
                  "URLs requiring login or behind paywalls",
                  "Social media posts and dynamic content",
                  "File downloads (PDFs, images, videos)",
                  "Single-page applications with minimal text",
                  "Sites with aggressive anti-bot measures",
                ].map((tip, idx) => (
                  <li key={idx} className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 p-6 bg-blue-500/10 backdrop-blur-sm border border-blue-400/30 rounded-2xl">
            <h4 className="font-medium text-blue-300 mb-4 flex items-center space-x-2">
              <Zap className="w-5 h-5" />
              <span>Bulk Processing Tips</span>
            </h4>
            <ul className="space-y-2 text-sm text-blue-200">
              {[
                "Maximum 10 URLs per batch to prevent timeouts",
                "Add delays between requests to respect rate limits",
                "Group similar domains together for better success rates",
                "Check individual URL validity before bulk processing",
              ].map((tip, idx) => (
                <li key={idx} className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Top Domains Stats */}
        {stats && stats.topDomains.length > 0 && (
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-500">
            <h3 className="font-semibold text-white mb-6 flex items-center space-x-3">
              <BarChart3 className="w-6 h-6 text-purple-400" />
              <span>Top Snapped Domains</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.topDomains.map((domain, idx) => (
                <div
                  key={domain.domain}
                  className="group flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold group-hover:scale-110 transition-transform duration-300">
                      {idx + 1}
                    </div>
                    <span className="text-sm font-medium text-white">{domain.domain}</span>
                  </div>
                  <span className="text-sm text-gray-400">{domain.count} pages</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default EnhancedUrlSnapper
