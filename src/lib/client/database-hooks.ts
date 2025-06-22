// lib/client/database-hooks.ts
"use client";

import { useState, useEffect } from 'react';
import { DatabaseService, PageDocument, FAQDocument } from '@/lib/server/database-service';

// Simplified hooks for client-side database operations
export function usePages() {
  const [pages, setPages] = useState<PageDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const userPages = await DatabaseService.getUserPages();
      setPages(userPages);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch pages');
    } finally {
      setLoading(false);
    }
  };

  const createPage = async (title: string, url: string) => {
    try {
      const newPage = await DatabaseService.createPage(title, url);
      setPages(prev => [newPage, ...prev]);
      return newPage;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create page');
      throw err;
    }
  };

  const updatePage = async (pageId: string, title: string, url: string) => {
    try {
      const updatedPage = await DatabaseService.updatePage(pageId, title, url);
      setPages(prev => prev.map(page => 
        page.$id === pageId ? updatedPage : page
      ));
      return updatedPage;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update page');
      throw err;
    }
  };

  const deletePage = async (pageId: string) => {
    try {
      await DatabaseService.deletePage(pageId);
      setPages(prev => prev.filter(page => page.$id !== pageId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete page');
      throw err;
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  return {
    pages,
    loading,
    error,
    createPage,
    updatePage,
    deletePage,
    refetch: fetchPages
  };
}

export function usePage(pageId: string) {
  const [page, setPage] = useState<PageDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPage = async () => {
    if (!pageId) return;
    
    try {
      setLoading(true);
      const pageData = await DatabaseService.getPage(pageId);
      setPage(pageData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch page');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPage();
  }, [pageId]);

  return {
    page,
    loading,
    error,
    refetch: fetchPage
  };
}

export function useFAQs(pageId: string) {
  const [faqs, setFaqs] = useState<FAQDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFAQs = async () => {
    if (!pageId) return;
    
    try {
      setLoading(true);
      const pageFAQs = await DatabaseService.getPageFAQs(pageId);
      setFaqs(pageFAQs);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch FAQs');
    } finally {
      setLoading(false);
    }
  };

  const createFAQ = async (question: string, answer: string) => {
    try {
      const newFAQ = await DatabaseService.createFAQ(pageId, question, answer);
      setFaqs(prev => [...prev, newFAQ]);
      return newFAQ;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create FAQ');
      throw err;
    }
  };

  const updateFAQ = async (faqId: string, question: string, answer: string) => {
    try {
      const updatedFAQ = await DatabaseService.updateFAQ(faqId, question, answer);
      setFaqs(prev => prev.map(faq => 
        faq.$id === faqId ? updatedFAQ : faq
      ));
      return updatedFAQ;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update FAQ');
      throw err;
    }
  };

  const deleteFAQ = async (faqId: string) => {
    try {
      await DatabaseService.deleteFAQ(faqId);
      setFaqs(prev => prev.filter(faq => faq.$id !== faqId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete FAQ');
      throw err;
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, [pageId]);

  return {
    faqs,
    loading,
    error,
    createFAQ,
    updateFAQ,
    deleteFAQ,
    refetch: fetchFAQs
  };
}