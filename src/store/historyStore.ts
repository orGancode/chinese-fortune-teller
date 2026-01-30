import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BaziInput, BaziResult, HistoryItem } from '../types';

interface HistoryState {
  history: HistoryItem[];
  addToHistory: (input: BaziInput, result: BaziResult) => void;
  clearHistory: () => void;
  deleteHistoryItem: (id: string) => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      history: [],
      addToHistory: (input: BaziInput, result: BaziResult) => {
        const { history } = get();
        const newItem: HistoryItem = {
          id: Date.now().toString(),
          timestamp: Date.now(),
          input,
          result
        };
        // 最多保留10条历史记录
        const newHistory = [newItem, ...history].slice(0, 10);
        set({ history: newHistory });
      },
      clearHistory: () => set({ history: [] }),
      deleteHistoryItem: (id: string) => {
        const { history } = get();
        set({ history: history.filter(item => item.id !== id) });
      }
    }),
    {
      name: 'bazi-history-storage'
    }
  )
);
