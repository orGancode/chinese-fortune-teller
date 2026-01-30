import { create } from 'zustand';
import type { BaziInput, BaziResult } from '../types';
import { baziCalculator } from '../utils/baziCalculator';

interface BaziState {
  currentBazi: BaziResult | null;
  isLoading: boolean;
  error: string | null;
  calculateBazi: (input: BaziInput) => void;
  setCurrentBazi: (result: BaziResult) => void;
  clearBazi: () => void;
}

export const useBaziStore = create<BaziState>((set) => ({
  currentBazi: null,
  isLoading: false,
  error: null,
  calculateBazi: (input: BaziInput) => {
    set({ isLoading: true, error: null });
    try {
      const result = baziCalculator.calculateBazi(input);
      set({ currentBazi: result, isLoading: false });
    } catch (error) {
      set({ error: '计算过程中出现错误', isLoading: false });
    }
  },
  setCurrentBazi: (result: BaziResult) => set({ currentBazi: result, isLoading: false, error: null }),
  clearBazi: () => set({ currentBazi: null, error: null })
}));
