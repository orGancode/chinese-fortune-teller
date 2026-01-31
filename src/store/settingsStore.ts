import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeType = 'light' | 'dark' | 'system';

interface SettingsState {
  theme: ThemeType;
  version: string;
  setTheme: (theme: ThemeType) => void;
  toggleTheme: () => void;
  clearAllData: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      version: '1.0.0',
      theme: 'system',
      setTheme: (theme: Theme) => set({ theme }),
      toggleTheme: () => set((state) => {
        const themes: ThemeType[] = ['light', 'dark', 'system'];
        const currentIndex = themes.indexOf(state.theme);
        const nextIndex = (currentIndex + 1) % themes.length;
        return { theme: themes[nextIndex] };
      }),
      clearAllData: () => {
        // 清除所有 localStorage 数据
        localStorage.removeItem('bazi-history-storage');
        localStorage.removeItem('settings-storage');
        window.location.reload();
      }
    }),
    {
      name: 'settings-storage'
    }
  )
);
