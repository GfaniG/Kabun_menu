import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Menu as MenuIcon,
  X,
} from 'lucide-react';
import { KabunLogo } from '../common/KabunLogo';
import { ThemeSwitcher } from '../common/ThemeSwitcher';
import { useSiteSettings } from '../../hooks/useMenu';
import { Language, translations } from '../../i18n/translations';
import { useTheme } from '../../context/ThemeContext';

interface MenuHeaderProps {
  currentLang?: Language;
  onLanguageChange?: (lang: Language) => void;
}

export const MenuHeader: React.FC<MenuHeaderProps> = ({
  currentLang = 'en',
  onLanguageChange,
}) => {
  const [searchParams] = useSearchParams();
  const urlTable = searchParams.get('table');

  const { data: settings } = useSiteSettings();
  const { theme, toggleTheme } = useTheme();
  const t = translations[currentLang] || translations.en;

  const [tableNumber, setTableNumber] = useState<string | null>(() => {
    return urlTable || localStorage.getItem('kabun_table_number') || null;
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (urlTable) {
      setTableNumber(urlTable);
      localStorage.setItem('kabun_table_number', urlTable);
    }
  }, [urlTable]);

  return (
    <>
      {/* FIXED NAVIGATION BAR */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0E2F2C]/95 backdrop-blur-xl shadow-[0_12px_32px_rgba(0,0,0,0.6)] border-b border-[#1D4D47]">
        <div className="h-20 max-w-[1320px] mx-auto px-4 lg:px-8 flex items-center justify-between gap-4">
          {/* Official Kabun Logo Lockup */}
          <div className="flex items-center gap-3">
            <a href="#" className="flex items-center group" title={settings?.restaurantName || 'Kabun Coffee + Roastery'}>
              <KabunLogo variant="wide" glow={false} className="group-hover:scale-105 transition-transform" />
            </a>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 font-headline text-xs uppercase tracking-widest">
            <a href="#hero" className="text-[#FAF7F2] hover:text-[#E5CFAF] transition-colors py-1 font-semibold">
              {t.home}
            </a>
            <a href="#menu-section" className="text-[#C5D5D3] hover:text-[#FAF7F2] transition-colors py-1 font-medium">
              {t.ourMenu}
            </a>
            <a href="#about-section" className="text-[#C5D5D3] hover:text-[#FAF7F2] transition-colors py-1 font-medium">
              {t.aboutUs}
            </a>
            <a href="#gallery-section" className="text-[#C5D5D3] hover:text-[#FAF7F2] transition-colors py-1 font-medium">
              {t.atmosphere}
            </a>
            <a href="#location-section" className="text-[#C5D5D3] hover:text-[#FAF7F2] transition-colors py-1 font-medium">
              {t.locationHours}
            </a>
          </nav>

          {/* Right Actions: Dedicated Theme Toggle & Mobile Menu */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Dedicated Color Inversion Theme Switcher (Contrast Icon 🌓) */}
            <ThemeSwitcher variant="compact" />

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-[#133834] border border-[#1D4D47] text-[#FAF7F2] hover:bg-[#18423D] transition-colors shrink-0"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0B2523] border-b border-[#1D4D47] px-4 py-4 space-y-3 font-headline text-xs uppercase tracking-widest animate-in fade-in slide-in-from-top-2">
            <a
              href="#hero"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-[#FAF7F2] hover:text-[#E5CFAF]"
            >
              {t.home}
            </a>
            <a
              href="#menu-section"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-[#C5D5D3] hover:text-[#FAF7F2]"
            >
              {t.ourMenu} ({t.coffee} &amp; {t.bakery})
            </a>
            <a
              href="#about-section"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-[#C5D5D3] hover:text-[#FAF7F2]"
            >
              {t.aboutUs}
            </a>
            <a
              href="#gallery-section"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-[#C5D5D3] hover:text-[#FAF7F2]"
            >
              {t.atmosphere}
            </a>
            <a
              href="#location-section"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-[#C5D5D3] hover:text-[#FAF7F2]"
            >
              {t.locationHours}
            </a>
          </div>
        )}
      </header>
    </>
  );
};
