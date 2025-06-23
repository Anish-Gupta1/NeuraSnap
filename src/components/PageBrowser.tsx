"use client"

import { useState } from "react"
import { FileText, Sparkles } from "lucide-react"
import PageSideNavbar from "./chat/PageSideNavbar"
import PageDetailViewer from "./chat/PageDetailViewer"

const PageBrowser = () => {
  const [selectedPage, setSelectedPage] = useState(null)

  const handlePageSelect = (page) => {
    setSelectedPage(page)
  }

  const handleCloseDetail = () => {
    setSelectedPage(null)
  }

  return (
    <div className="min-h-screen bg-black pt-16">
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      <div className="relative z-20 flex h-screen">
        <div className="flex-shrink-0">
          <PageSideNavbar onPageSelect={handlePageSelect} selectedPageId={selectedPage?.$id} />
        </div>

        {selectedPage ? (
          <PageDetailViewer page={selectedPage} onClose={handleCloseDetail} />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="relative mb-8">
                <FileText className="w-20 h-20 mx-auto text-gray-400" />
                <div className="absolute inset-0 bg-blue-400 blur-2xl opacity-20"></div>
                <Sparkles className="w-6 h-6 absolute -top-2 -right-2 text-purple-400 animate-pulse" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Select a page to view
              </h3>
              <p className="text-gray-400 max-w-md mx-auto leading-relaxed">
                Choose a page from the sidebar to explore its content with our AI-powered analysis tools
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
    </div>
  )
}

export default PageBrowser
