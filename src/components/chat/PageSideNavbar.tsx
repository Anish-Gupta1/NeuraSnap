'use client';

import { useEffect, useState } from 'react';
import { FileText, Loader2, AlertCircle } from 'lucide-react';
import PageCard from './PageCard';

const PageSideNavbar = ({ onPageSelect, selectedPageId }) => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchPages() {
      setLoading(true);
      try {
        const res = await fetch('/api/pages');
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || 'Failed to fetch pages');

        setPages(data.pages || []);
        setError('');
      } catch (err) {
        console.error('Error loading pages:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPages();
  }, []);

  if (loading) {
    return (
      <div className="w-80 bg-white border-r border-gray-200 p-4">
        <div className="flex items-center justify-center h-32">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          <span className="ml-2 text-gray-600">Loading pages...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-80 bg-white border-r border-gray-200 p-4">
        <div className="flex items-center justify-center h-32 text-red-500">
          <AlertCircle className="w-5 h-5 mr-2" />
          <span className="text-sm">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 h-full overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Your Pages</h2>
        <p className="text-sm text-gray-500 mt-1">{pages.length} pages saved</p>
      </div>

      {/* Pages List */}
      <div className="flex-1 overflow-y-auto p-2">
        {pages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <FileText className="w-12 h-12 mb-3 text-gray-300" />
            <p className="text-center">No pages saved yet</p>
            <p className="text-xs text-center mt-1">
              Start by snapping a webpage!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
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
  );
};

export default PageSideNavbar;





