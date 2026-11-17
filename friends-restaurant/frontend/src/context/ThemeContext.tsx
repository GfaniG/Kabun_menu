import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSiteSettings } from '../hooks/useMenu';

export type KabunTheme = 'dark' | 'cream';

interface ThemeContextType {
  theme: KabunTheme;
  setTheme: (theme: KabunTheme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: settings } = useSiteSettings();

  const [theme, setThemeState] = useState<KabunTheme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('kabun-theme') as KabunTheme | null;
      if (saved === 'dark' || saved === 'cream') return saved;
    }
    return 'dark';
  });

  // If user hasn't explicitly set a local preference, adopt CMS defaultTheme
  useEffect(() => {
    try {
      const saved = localStorage.getItem('kabun-theme');
      if (!saved && settings?.defaultTheme) {
        const cmsDefault = settings.defaultTheme.toLowerCase() === 'cream' ? 'cream' : 'dark';
        setThemeState(cmsDefault);
      }
    } catch {}
  }, [settings?.defaultTheme]);

  // Synchronize data-theme on document root and update class
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    if (theme === 'cream') {
      root.classList.add('theme-cream');
      root.classList.remove('theme-dark', 'dark');
    } else {
      root.classList.add('theme-dark', 'dark');
      root.classList.remove('theme-cream');
    }
  }, [theme]);

  const setTheme = (newTheme: KabunTheme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem('kabun-theme', newTheme);
    } catch {}
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'cream' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
