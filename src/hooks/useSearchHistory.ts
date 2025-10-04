import { useState, useEffect } from "react";

const STORAGE_KEY = "ai_tools_search_history";
const MAX_HISTORY = 10;

export function useSearchHistory() {
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch {
        setHistory([]);
      }
    }
  }, []);

  const addToHistory = (query: string) => {
    if (!query.trim()) return;
    
    setHistory((prev) => {
      // Remove duplicates and add to front
      const filtered = prev.filter((item) => item.toLowerCase() !== query.toLowerCase());
      const newHistory = [query, ...filtered].slice(0, MAX_HISTORY);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const removeFromHistory = (query: string) => {
    setHistory((prev) => {
      const newHistory = prev.filter((item) => item !== query);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
  };
}
