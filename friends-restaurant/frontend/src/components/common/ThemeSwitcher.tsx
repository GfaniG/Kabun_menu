import React from 'react';
import { Contrast, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface ThemeSwitcherProps {
  variant?: 'segmented' | 'compact' | 'floating';
  className?: string;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  variant = 'compact',
  className = '',
}) => {
  const { theme, setTheme, toggleTheme } = useTheme();
  const isCream = theme === 'cream';

  if (variant === 'segmented') {
    return (
      <div
        className={`inline-flex items-center p-1 rounded-full border shadow-sm transition-all duration-300 ${
          isCream
            ? 'bg-[#EADAC3] border-[#DFC9AA]'
            : 'bg-[#133834] border-[#1D4D47]'
        } ${className}`}
      >
        <button
          type="button"
          onClick={() => setTheme('dark')}
          className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full font-headline text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
            !isCream
              ? 'bg-[#E5CFAF] text-[#0E2F2C] shadow-md font-extrabold scale-102'
              : isCream
              ? 'text-[#3D524F] hover:text-[#0E2F2C] hover:bg-[#DFC9AA]/40'
              : 'text-[#C5D5D3] hover:text-[#FAF7F2] hover:bg-white/5'
          }`}
          title="Switch to Midnight Roastery (Dark)"
        >
          <Moon className="w-3.5 h-3.5" />
          <span>Roastery Dark</span>
        </button>

        <button
          type="button"
          onClick={() => setTheme('cream')}
          className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full font-headline text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
            isCream
              ? 'bg-[#0E2F2C] text-[#E5CFAF] shadow-md font-extrabold scale-102'
              : 'text-[#C5D5D3] hover:text-[#FAF7F2] hover:bg-white/5'
          }`}
          title="Switch to Roastery Cream (Light)"
        >
          <Sun className="w-3.5 h-3.5" />
          <span>Roastery Cream</span>
        </button>
      </div>
    );
  }

  if (variant === 'floating') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={`Invert color theme to ${isCream ? 'Dark' : 'Cream'}`}
        title={`Invert colors (${isCream ? 'Switch to Roastery Dark' : 'Switch to Roastery Cream'})`}
        className={`fixed bottom-6 left-6 z-50 flex items-center gap-2 px-3.5 py-2.5 rounded-full backdrop-blur-md border shadow-[0_12px_28px_rgba(0,0,0,0.5)] transition-all duration-300 hover:scale-105 cursor-pointer font-headline text-xs font-bold uppercase tracking-wider ${
          isCream
            ? 'bg-[#FAF6F0] text-[#0E2F2C] border-[#DFC9AA] hover:bg-white'
            : 'bg-[#133834] text-[#E5CFAF] border-[#1D4D47] hover:bg-[#18423D]'
        } ${className}`}
      >
        <Contrast className="w-4 h-4 shrink-0" style={{ color: isCream ? '#0E2F2C' : '#E5CFAF' }} />
        <span className="font-headline text-[11px] font-bold">
          {isCream ? 'Cream ☀️' : 'Dark 🌙'}
        </span>
      </button>
    );
  }

  // Default 'compact' for Navbar (unmissable circular icon button on mobile, pill on desktop)
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Invert color theme to ${isCream ? 'Dark' : 'Cream'}`}
      title={`Invert colors (${isCream ? 'Switch to Roastery Dark' : 'Switch to Roastery Cream'})`}
      className={`w-9 h-9 sm:w-auto inline-flex items-center justify-center sm:gap-1.5 sm:px-3 sm:py-1.5 rounded-full border transition-all cursor-pointer font-headline text-xs font-bold uppercase tracking-wider shrink-0 shadow-sm ${
        isCream
          ? 'bg-[#EADAC3] hover:bg-[#DFC9AA] text-[#0E2F2C] border-[#DFC9AA]'
          : 'bg-[#133834] hover:bg-[#18423D] text-[#E5CFAF] border-[#235750] hover:border-[#E5CFAF]'
      } ${className}`}
    >
      <Contrast className="w-4 h-4 shrink-0" style={{ color: isCream ? '#0E2F2C' : '#E5CFAF' }} />
      <span className="hidden sm:inline text-[11px]">
        {isCream ? 'Cream' : 'Dark'}
      </span>
    </button>
  );
};
