'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { QAData, QAItem } from '@/lib/qa-types';
import { useQASession, ConversationEntry } from '@/components/qa/useQASession';

// ─── Types ─────────────────────────────────────────────────────────────────

export type QAStep = 'category' | 'subcategory' | 'question' | 'answer';

export interface QABotContextValue {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;

  // ステップ管理
  currentStep: QAStep;
  selectedCategoryId: string | null;
  selectedSubcategoryId: string | null;

  // 選択操作
  selectCategory: (categoryId: string) => void;
  selectSubcategory: (subcategoryId: string) => void;
  selectQuestion: (item: QAItem) => void;
  goBack: () => void;
  reset: () => void;

  // 会話履歴
  conversationHistory: ConversationEntry[];

  // QAデータ（QACategorySelector で参照するため）
  qaData: QAData;
}

// ─── Context ───────────────────────────────────────────────────────────────

export const QABotContext = createContext<QABotContextValue | null>(null);

// ─── Provider ──────────────────────────────────────────────────────────────

interface QABotProviderProps {
  children: ReactNode;
  qaData: QAData;
}

export function QABotProvider({ children, qaData }: QABotProviderProps) {
  const { history: conversationHistory, addEntry } = useQASession();

  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<QAStep>('category');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string | null>(null);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const selectCategory = useCallback((categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setCurrentStep('subcategory');
  }, []);

  const selectSubcategory = useCallback((subcategoryId: string) => {
    setSelectedSubcategoryId(subcategoryId);
    setCurrentStep('question');
  }, []);

  const selectQuestion = useCallback(
    (item: QAItem) => {
      const entry: ConversationEntry = {
        id: item.id,
        richieMessage: item.richieMessage,
        raizoMessages: item.raizoMessages,
        source: 'static',
        timestamp: Date.now(),
      };
      addEntry(entry);
      setCurrentStep('answer');
    },
    [addEntry]
  );

  const goBack = useCallback(() => {
    setCurrentStep((prev) => {
      switch (prev) {
        case 'answer':
          return 'question';
        case 'question':
          return 'subcategory';
        case 'subcategory':
          return 'category';
        default:
          return 'category';
      }
    });
  }, []);

  const reset = useCallback(() => {
    setCurrentStep('category');
    setSelectedCategoryId(null);
    setSelectedSubcategoryId(null);
  }, []);

  const value: QABotContextValue = {
    isOpen,
    toggle,
    close,
    currentStep,
    selectedCategoryId,
    selectedSubcategoryId,
    selectCategory,
    selectSubcategory,
    selectQuestion,
    goBack,
    reset,
    conversationHistory,
    qaData,
  };

  return <QABotContext.Provider value={value}>{children}</QABotContext.Provider>;
}

// ─── useQABot hook ──────────────────────────────────────────────────────────

export function useQABot(): QABotContextValue {
  const context = useContext(QABotContext);
  if (context === null) {
    throw new Error('useQABot must be used within a QABotProvider');
  }
  return context;
}
