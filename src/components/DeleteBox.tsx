"use client";

import { useState } from "react";
import { Trash2, AlertTriangle, X, Loader2 } from "lucide-react";
import { Client, Databases } from "appwrite";

const DeleteBox = ({ page, isOpen, onClose, onDeleteSuccess }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [error, setError] = useState("");

  const requiredText = "DELETE";
  const isConfirmed = confirmText === requiredText;

  const handleDelete = async () => {
    if (!isConfirmed) return;

    setIsDeleting(true);
    setError("");

    try {
      // Initialize Appwrite client
      const client = new Client()
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!) // Your API Endpoint
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!); // Your project ID

      const databases = new Databases(client);

      // Delete the document directly
      const result = await databases.deleteDocument(
        'snapfaq-main', // databaseId
        'pages', // collectionId
        page.$id // documentId
      );

      console.log('Delete result:', result);

      window.dispatchEvent(new Event("pagesUpdated"));


      onDeleteSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error deleting page:", error);
      setError(error.message || "Failed to delete page. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (isDeleting) return; // Prevent closing while deleting
    setConfirmText("");
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900/95 backdrop-blur-xl border border-red-500/20 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Delete Page</h2>
          </div>
          <button
            onClick={handleClose}
            disabled={isDeleting}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Warning Content */}
        <div className="mb-6">
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-4">
            <p className="text-red-300 text-sm font-medium mb-2">
              ⚠️ This action cannot be undone
            </p>
            <p className="text-gray-300 text-sm">
              This will permanently delete the page and all associated FAQs:
            </p>
          </div>

          {/* Page Info */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-white mb-2 truncate">
              {page.title}
            </h3>
            <p className="text-sm text-gray-400 break-all">
              {page.url}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Created: {new Date(page.$createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Confirmation Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Type <span className="font-mono bg-red-500/20 px-2 py-1 rounded text-red-300">{requiredText}</span> to confirm:
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              disabled={isDeleting}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Enter confirmation text..."
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={handleClose}
            disabled={isDeleting}
            className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/20 text-gray-300 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={!isConfirmed || isDeleting}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Delete Page</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteBox;