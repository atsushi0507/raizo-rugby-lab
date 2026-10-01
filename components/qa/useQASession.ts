'use client';

import { useState, useCallback } from 'react';

export interface ConversationEntry {
  id: string;
  richieMessage: string;
  raizoMessages: string[];
  source: 'static' | 'ai';
  timestamp: number;
}

interface UseQASessionReturn {
  history: ConversationEntry[];
  addEntry: (entry: ConversationEntry) => void;
  clearHistory: () => void;
}

const SESSION_KEY = 'qa-bot-history';

export function useQASession(): UseQASessionReturn {
  const [history, setHistory] = useState<ConversationEntry[]>(() => {
    // 初期化: sessionStorage から読み込み試行
    try {
      const stored = sessionStorage.getItem(SESSION_KEY);
      return stored ? (JSON.parse(stored) as ConversationEntry[]) : [];
    } catch {
      // SecurityError（プライベートブラウジング等）: インメモリで動作
      return [];
    }
  });

  const addEntry = useCallback((entry: ConversationEntry) => {
    setHistory((prev) => {
      const next = [...prev, entry];
      try {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(next));
      } catch {
        // 書き込み失敗時はインメモリのみで継続
      }
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      // ignore
    }
  }, []);

  return { history, addEntry, clearHistory };
}
