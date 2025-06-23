"use client"

import { useEffect, useState } from "react"
import { FileText, Loader2, AlertCircle, Plus, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import PageCard from "./PageCard"

const PageSideNavbar = ({ onPageSelect, selectedPageId }) => {
  const [pages, setPages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    async function fetchPages() {
      setLoading(true)
      try {
        const res = await fetch("/api/pages")
        const data = await res.json()

        if (!res.ok) throw new Error(data.error || "Failed to fetch pages")

        setPages(data.pages || [])
        setError("")
      } catch (err) {
        console.error("Error loading pages:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPages()
    const handlePagesUpdated = () => {
      fetchPages()
    }
  
    window.addEventListener("pagesUpdated", handlePagesUpdated)
  
    // ✅ Clean up the listener
    return () => {
      window.removeEventListener("pagesUpdated", handlePagesUpdated)
    }
  }, [])

  const handleAddNewPage = () => {
    router.push("/snap")
  }

  if (loading) {
    return (
      <div className="w-80 bg-white/5 backdrop-blur-sm border-r border-white/10 p-6 h-full">
        <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-400 mx-auto mb-3" />
            <span className="text-gray-300">Loading pages...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-80 bg-white/5 backdrop-blur-sm border-r border-white/10 p-6 h-full">
        <div className="flex items-center justify-center h-32">
          <div className="text-center text-red-400">
            <AlertCircle className="w-8 h-8 mx-auto mb-3" />
            <span className="text-sm">{error}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-80 bg-white/5 backdrop-blur-sm border-r border-white/10 h-full overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
            <span>Your Pages</span>
            <Sparkles className="w-5 h-5 text-purple-400" />
          </h2>
          <button
            onClick={handleAddNewPage}
            className="group relative flex items-center gap-2 px-4 py-2 text-sm bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 overflow-hidden"
          >
            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
            <Plus className="w-4 h-4 relative z-10 group-hover:rotate-90 transition-transform duration-300" />
            <span className="relative z-10">New Page</span>
          </button>
        </div>
        <p className="text-sm text-gray-400">
          {pages.length} page{pages.length !== 1 ? "s" : ""} saved
        </p>
      </div>

      {/* Pages List */}
      <div className="flex-1 overflow-y-auto p-4">
        {pages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="relative mb-6">
              <FileText className="w-16 h-16 text-gray-400" />
              <div className="absolute inset-0 bg-blue-400 blur-2xl opacity-20"></div>
            </div>
            <h3 className="text-lg font-medium text-gray-300 mb-2">No pages saved yet</h3>
            <p className="text-sm text-gray-500 mb-4">Start by snapping a webpage!</p>
            <button
              onClick={handleAddNewPage}
              className="group relative px-6 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-500/30 text-blue-300 rounded-xl hover:from-blue-500/30 hover:to-purple-500/30 hover:border-blue-400/50 transition-all duration-300 hover:scale-105 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
              <span className="relative z-10 flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Snap Your First Page</span>
              </span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {pages.map((page) => (
              <PageCard
                key={page.$id}
                page={page}
                isSelected={selectedPageId === page.$id}
                onClick={() => onPageSelect(page)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default PageSideNavbar
