"use client"

import { Calendar, ExternalLink, Sparkles } from "lucide-react"

type Page = {
  $id: string;
  title: string;
  url: string;
  $createdAt: string;
  $updatedAt: string;
  description?: string;
  content?: string;
  metadata?: string;
  extractedAt?: string;
};

interface PageCardProps {
  page: Page;
  isSelected: boolean;
  onClick: () => void;
}

const PageCard = ({ page, isSelected, onClick }: PageCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const truncateText = (text: string, maxLength = 60) => {
    if (!text || text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  return (
    <div
      onClick={onClick}
      className={`group relative p-4 rounded-2xl border cursor-pointer transition-all duration-300 hover:scale-105 overflow-hidden ${
        isSelected
          ? "bg-blue-500/20 border-blue-400/50 shadow-lg shadow-blue-500/25"
          : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 hover:shadow-lg"
      }`}
    >
      {/* Glow Effect */}
      <div
        className={`absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500 ${
          isSelected ? "from-blue-500 to-purple-500 opacity-20" : "from-blue-500 to-purple-500"
        }`}
      ></div>

      {/* Shimmer Effect on Hover */}
      <div className="absolute inset-0 bg-white/5 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>

      <div className="relative flex flex-col space-y-3">
        {/* Title */}
        <div className="flex items-start justify-between">
          <h3
            className={`font-medium text-sm leading-tight transition-colors duration-300 ${
              isSelected
                ? "text-blue-200"
                : "text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text"
            }`}
          >
            {truncateText(page.title)}
          </h3>
          {isSelected && <Sparkles className="w-4 h-4 text-blue-400 animate-pulse flex-shrink-0 ml-2" />}
        </div>

        {/* Description Preview */}
        {page.description && (
          <p className="text-xs text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
            {truncateText(page.description, 80)}
          </p>
        )}

        {/* URL */}
        <div className="flex items-center text-xs text-gray-500 group-hover:text-gray-400 transition-colors duration-300">
          <ExternalLink className="w-3 h-3 mr-2 flex-shrink-0" />
          <span className="truncate">{page.url}</span>
        </div>

        {/* Date */}
        <div className="flex items-center text-xs text-gray-500 group-hover:text-gray-400 transition-colors duration-300">
          <Calendar className="w-3 h-3 mr-2" />
          <span>{formatDate(page.$createdAt)}</span>
        </div>

        {/* Selection Indicator */}
        {isSelected && <div className="absolute -right-1 -top-1 w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>}
      </div>
    </div>
  )
}

export default PageCard
