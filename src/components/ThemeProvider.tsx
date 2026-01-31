import { useEffect } from 'react';
import { useSettingsStore } from '../store/settingsStore';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useSettingsStore();

  useEffect(() => {
    const root = document.documentElement;
    
    const applyTheme = () => {
      if (theme === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          root.setAttribute('data-theme', 'dark');
        } else {
          root.removeAttribute('data-theme');
        }
      } else if (theme === 'dark') {
        root.setAttribute('data-theme', 'dark');
      } else {
        root.removeAttribute('data-theme');
      }
    };

    // 应用主题
    applyTheme();

    // 监听系统主题变化（仅在system模式下）
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme();
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  return <>{children}</>;
}
