'use client';

import React, { useState } from 'react';
import { AuthForm } from '../../components/auth/AuthForm';
import { Zap, Globe, Search, Download } from 'lucide-react';

export default function  AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  const toggleMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen">
          {/* Left side - Branding and features */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-blue-600 rounded-xl p-3">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">NeuraSnap</h1>
              </div>
              <p className="text-xl text-gray-600 leading-relaxed">
                Transform any webpage into a comprehensive FAQ collection with AI-powered extraction and intelligent organization.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 rounded-lg p-3">
                  <Globe className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Instant Web Scraping</h3>
                  <p className="text-gray-600">
                    Simply paste any URL and watch as our AI extracts relevant information and generates meaningful FAQs automatically.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-purple-100 rounded-lg p-3">
                  <Search className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Smart Organization</h3>
                  <p className="text-gray-600">
                    Your FAQs are automatically categorized and made searchable, so you can find exactly what you need in seconds.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-green-100 rounded-lg p-3">
                  <Download className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Export & Share</h3>
                  <p className="text-gray-600">
                    Export your FAQ collections as PDFs, share with your team, or integrate with your existing knowledge base.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h4 className="font-semibold text-gray-900 mb-3">Perfect for:</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-gray-700">Customer Support</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-gray-700">Product Documentation</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-gray-700">Training Materials</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    <span className="text-gray-700">Knowledge Management</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    <span className="text-gray-700">Content Research</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    <span className="text-gray-700">Competitive Analysis</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Authentication form */}
          <div className="flex items-center justify-center">
            <AuthForm mode={mode} onToggleMode={toggleMode} />
          </div>
        </div>
      </div>
    </div>
  );
};