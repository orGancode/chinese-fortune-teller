import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  // 可以在这里添加更多设置选项
  version: string;
  clearAllData: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (_set) => ({
      version: '1.0.0',
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
