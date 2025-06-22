import { Calendar, ExternalLink } from 'lucide-react';


const PageCard = ({ page, isSelected, onClick }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const truncateText = (text, maxLength = 60) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div
      onClick={onClick}
      className={`
          p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md
          ${
            isSelected
              ? "bg-blue-50 border-blue-200 shadow-sm"
              : "bg-gray-50 border-gray-200 hover:bg-gray-100"
          }
        `}
    >
      <div className="flex flex-col space-y-2">
        {/* Title */}
        <h3
          className={`font-medium text-sm leading-tight ${
            isSelected ? "text-blue-900" : "text-gray-800"
          }`}
        >
          {truncateText(page.title)}
        </h3>

        {/* Description Preview */}
        {page.description && (
          <p className="text-xs text-gray-600 leading-relaxed">
            {truncateText(page.description, 80)}
          </p>
        )}

        {/* URL */}
        <div className="flex items-center text-xs text-gray-500">
          <ExternalLink className="w-3 h-3 mr-1 flex-shrink-0" />
          <span className="truncate">{page.url}</span>
        </div>

        {/* Date */}
        <div className="flex items-center text-xs text-gray-400">
          <Calendar className="w-3 h-3 mr-1" />
          <span>{formatDate(page.$createdAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default PageCard;