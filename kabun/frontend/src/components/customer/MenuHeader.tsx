import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Wifi,
  Check,
  Copy,
  Menu as MenuIcon,
  X,
  Sun,
  Moon,
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
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

  const [isWifiModalOpen, setIsWifiModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedWifi, setCopiedWifi] = useState(false);

  useEffect(() => {
    if (urlTable) {
      setTableNumber(urlTable);
      localStorage.setItem('kabun_table_number', urlTable);
    }
  }, [urlTable]);

  const wifiSsid = settings?.wifiSsid || 'Kabun_Guest_WiFi';
  const wifiPassword = settings?.wifiPassword || 'craftedfromcoffee';

  const handleCopyWifi = () => {
    navigator.clipboard.writeText(wifiPassword);
    setCopiedWifi(true);
    setTimeout(() => setCopiedWifi(false), 2500);
  };


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

          {/* Right Actions: Theme Toggle + Guest Wi-Fi + Mobile Menu */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Dedicated Color Inversion Theme Switcher (Contrast Icon 🌓) */}
            <ThemeSwitcher variant="compact" />

            {/* Free Wi-Fi Button */}
            <button
              onClick={() => setIsWifiModalOpen(true)}
              className="w-9 h-9 sm:w-auto inline-flex items-center justify-center sm:gap-1.5 sm:px-3 sm:py-1.5 rounded-full bg-[#133834] hover:bg-[#18423D] border border-[#1D4D47] hover:border-[#E5CFAF] text-[#FAF7F2] text-xs font-headline uppercase font-semibold tracking-wider transition-all cursor-pointer shrink-0"
              title={t.freeWifi}
            >
              <Wifi className="w-3.5 h-3.5 text-[#E5CFAF]" />
              <span className="hidden sm:inline">{t.freeWifi}</span>
            </button>

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

            <div className="pt-2 border-t border-[#1D4D47]">
              <Button
                variant="secondary"
                size="sm"
                className="w-full text-white bg-[#133834] border-[#1D4D47]"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsWifiModalOpen(true);
                }}
                leftIcon={<Wifi className="w-3.5 h-3.5 text-[#E5CFAF]" />}
              >
                {t.guestWifi}
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Modal: Free Wi-Fi Details */}
      <Modal
        isOpen={isWifiModalOpen}
        onClose={() => setIsWifiModalOpen(false)}
        title={
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${theme === 'cream' ? 'bg-[#EADAC3] border border-[#DFC9AA] text-[#0E2F2C]' : 'bg-[#133834] border border-[#235750] text-[#E5CFAF]'}`}>
              <Wifi className={`w-4 h-4 ${theme === 'cream' ? 'text-[#0E2F2C]' : 'text-[#E5CFAF]'}`} />
            </div>
            <span className={`font-headline text-base sm:text-lg uppercase tracking-wider font-bold ${theme === 'cream' ? 'text-[#0E2F2C]' : 'text-white'}`}>
              {t.guestWifi}
            </span>
          </div>
        }
        subtitle="Enjoy high-speed connection in our roastery lounge"
      >
        <div className="space-y-4">
          <div className={`rounded-xl p-4 sm:p-5 space-y-3.5 border ${theme === 'cream' ? 'bg-[#FAF6F0] border-[#DFC9AA]' : 'bg-[#0B2523] border-[#1D4D47]'}`}>
            <div>
              <span className={`font-sans text-[10px] uppercase tracking-[0.15em] font-semibold block ${theme === 'cream' ? 'text-[#3D524F]' : 'text-[#C5D5D3]'}`}>
                Network (SSID)
              </span>
              <p className={`font-headline text-base sm:text-lg font-bold tracking-wide mt-0.5 ${theme === 'cream' ? 'text-[#0E2F2C]' : 'text-[#FAF7F2]'}`}>
                {wifiSsid}
              </p>
            </div>

            <div className={`pt-3 border-t flex items-center justify-between gap-3 ${theme === 'cream' ? 'border-[#DFC9AA]' : 'border-[#1D4D47]'}`}>
              <div className="min-w-0">
                <span className={`font-sans text-[10px] uppercase tracking-[0.15em] font-semibold block ${theme === 'cream' ? 'text-[#3D524F]' : 'text-[#C5D5D3]'}`}>
                  Password
                </span>
                <p className={`font-mono text-sm sm:text-base font-bold tracking-widest px-3 py-1.5 rounded-lg border mt-0.5 inline-block select-all ${theme === 'cream' ? 'bg-[#EADAC3] border-[#DFC9AA] text-[#0E2F2C]' : 'bg-[#133834] border-[#1D4D47] text-[#E5CFAF]'}`}>
                  {wifiPassword}
                </p>
              </div>

              <button
                type="button"
                onClick={handleCopyWifi}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg font-sans font-bold text-xs uppercase tracking-wider transition-all shadow-sm shrink-0 cursor-pointer ${theme === 'cream' ? 'bg-[#0E2F2C] text-[#E5CFAF] hover:bg-[#18423D]' : 'bg-[#E5CFAF] text-[#0E2F2C] hover:brightness-110'}`}
              >
                {copiedWifi ? (
                  <>
                    <Check className={`w-3.5 h-3.5 ${theme === 'cream' ? 'text-[#E5CFAF]' : 'text-[#0E2F2C]'}`} />
                    <span>{t.passwordCopied}</span>
                  </>
                ) : (
                  <>
                    <Copy className={`w-3.5 h-3.5 ${theme === 'cream' ? 'text-[#E5CFAF]' : 'text-[#0E2F2C]'}`} />
                    <span>{t.copyPassword}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <p className={`text-xs leading-relaxed ${theme === 'cream' ? 'text-[#3D524F]' : 'text-[#C5D5D3]'}`}>
            Select <strong className={`font-semibold ${theme === 'cream' ? 'text-[#0E2F2C]' : 'text-white'}`}>{wifiSsid}</strong> in your device settings and paste the credentials above.
          </p>

          <button
            type="button"
            className={`w-full py-2.5 rounded-lg font-headline uppercase tracking-wider text-xs font-bold border transition-colors cursor-pointer ${theme === 'cream' ? 'bg-[#EADAC3] hover:bg-[#DFC9AA] text-[#0E2F2C] border-[#DFC9AA]' : 'bg-[#133834] hover:bg-[#18423D] text-[#FAF7F2] border-[#1D4D47]'}`}
            onClick={() => setIsWifiModalOpen(false)}
          >
            {t.close}
          </button>
        </div>
      </Modal>
    </>
  );
};
