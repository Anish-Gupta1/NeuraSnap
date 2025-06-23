"use client";
import React, { useState } from 'react';
import { FileText} from 'lucide-react';
import PageSideNavbar from './chat/PageSideNavbar';
import PageDetailViewer from './chat/PageDetailViewer';

const PageBrowser = () => {
  const [selectedPage, setSelectedPage] = useState(null);

  const handlePageSelect = (page) => {
    setSelectedPage(page);
  };

  const handleCloseDetail = () => {
    setSelectedPage(null);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="fix">
        <PageSideNavbar 
          onPageSelect={handlePageSelect}
          selectedPageId={selectedPage?.$id}
        />
      </div>
      
      {selectedPage ? (
        <PageDetailViewer
          page={selectedPage} 
          onClose={handleCloseDetail}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">Select a page to view</h3>
            <p className="text-sm">Choose a page from the sidebar to see its content</p>
          </div>
        </div>
        )}
    </div>
  );
};

export default PageBrowser;