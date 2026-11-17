import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
  AlertCircle,
  ArrowUp,
  ExternalLink,
  Wifi,
  Check,
  Copy,
  Lock,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMenu, useSiteSettings } from '../hooks/useMenu';
import { MenuHeader } from '../components/customer/MenuHeader';
import { CategoryTabs } from '../components/customer/CategoryTabs';
import { MenuCard } from '../components/customer/MenuCard';
import { MenuItem } from '../types/menu';
import { KabunLogo } from '../components/common/KabunLogo';
import { KabunRoasteryRibbon } from '../components/customer/KabunRoasteryRibbon';
import { api } from '../api/client';
import { Language, translations } from '../i18n/translations';
import { INITIAL_CATEGORIES } from '../data/initialMenu';
import { useTheme } from '../context/ThemeContext';

export const CustomerMenu: React.FC = () => {
  const { data: categories = [], isLoading, error, refetch } = useMenu();
  const { data: settings } = useSiteSettings();

  // Language state with safe fallback
  const [currentLang, setCurrentLang] = useState<Language>(() => {
    const saved = localStorage.getItem('kabun_language') || localStorage.getItem('friends_language') as Language;
    if (saved === 'en' || saved === 'ti' || saved === 'am') return saved;
    return 'en';
  });
  const t = translations[currentLang] || translations.en;

  // Primary Department: COFFEE vs BAKERY (supports DRINKS vs FOOD)
  const [activeParent, setActiveParent] = useState<'COFFEE' | 'BAKERY'>('COFFEE');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [copiedWifi, setCopiedWifi] = useState<boolean>(false);

  const navigate = useNavigate();

  // Track visit on mount (count all QR scans together in one total)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const isScan = params.get('scan') === 'qr' || params.has('table') || params.has('scan');
    api.trackEvent({
      type: isScan ? 'TABLE_SCAN' : 'PAGE_VIEW',
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const { theme } = useTheme();
  const isCream = theme === 'cream';

  // Dynamic theme values adapting to Dark vs Cream mode
  const cmsAccentColor = settings?.accentColor || '#E5CFAF';
  const cmsBgColor = settings?.backgroundColor || '#0E2F2C';
  const cmsCardColor = settings?.cardColor || '#133834';
  const fontFamily = settings?.fontFamily || 'Outfit, sans-serif';

  const bgColor = isCream ? '#F5EBDD' : cmsBgColor;
  const cardColor = isCream ? '#FAF6F0' : cmsCardColor;
  const elevatedBgColor = isCream ? '#EDE2D1' : '#0B2523';
  const borderColor = isCream ? '#DFC9AA' : '#1D4D47';
  const accentColor = isCream ? '#0E2F2C' : cmsAccentColor;
  const textHeading = isCream ? '#0E2F2C' : '#FAF7F2';
  const textBody = isCream ? '#3D524F' : '#C5D5D3';
  const badgeColor = isCream ? '#0E2F2C' : '#E5CFAF';

  const wifiSsid = settings?.wifiSsid || 'Kabun_Guest_WiFi';
  const wifiPassword = settings?.wifiPassword || 'craftedfromcoffee';

  const handleCopyWifi = () => {
    navigator.clipboard.writeText(wifiPassword);
    setCopiedWifi(true);
    setTimeout(() => setCopiedWifi(false), 2500);
  };

  // Safe categories fallback prevents black screen if data is loading or malformed
  const safeCategories = useMemo(() => {
    if (Array.isArray(categories) && categories.length > 0) return categories;
    return INITIAL_CATEGORIES;
  }, [categories]);

  // Partition categories and items by COFFEE vs BAKERY
  const { coffeeCategories, bakeryCategories, totalCoffeeCount, totalBakeryCount } = useMemo(() => {
    const coffees = safeCategories.filter((c) => {
      const p = (c?.parentCategory || 'COFFEE').toUpperCase();
      return p === 'COFFEE' || p === 'DRINKS';
    });
    const bakeries = safeCategories.filter((c) => {
      const p = (c?.parentCategory || 'COFFEE').toUpperCase();
      return p === 'BAKERY' || p === 'FOOD';
    });

    const coffeeCount = coffees.reduce((sum, cat) => sum + (cat?.items?.length || 0), 0);
    const bakeryCount = bakeries.reduce((sum, cat) => sum + (cat?.items?.length || 0), 0);

    return {
      coffeeCategories: coffees,
      bakeryCategories: bakeries,
      totalCoffeeCount: coffeeCount,
      totalBakeryCount: bakeryCount,
    };
  }, [safeCategories]);

  // Category and parent department switchers: stay strictly fixed in place with zero downward scroll
  const handleSelectCategory = (catId: string) => {
    setActiveCategory(catId);
  };

  const handleSelectParent = (parent: 'COFFEE' | 'BAKERY' | 'FOOD' | 'DRINKS') => {
    if (parent === 'BAKERY' || parent === 'FOOD') {
      setActiveParent('BAKERY');
    } else {
      setActiveParent('COFFEE');
    }
    setActiveCategory('all');
  };

  // Section title mapper for Kabun Roastery headers
  const getSectionTitle = (catSlugOrName?: string) => {
    if (!catSlugOrName) return 'THE ROASTERY SELECTIONS';
    const upper = String(catSlugOrName).toUpperCase();
    if (upper.includes('ESPRESSO') || upper.includes('HOT CLASSIC')) return 'THE SPECIALTY ESPRESSO BAR';
    if (upper.includes('COLD BREW') || upper.includes('SIGNATURE')) return 'THE SLOW COLD EXTRACTIONS';
    if (upper.includes('POUR-OVER') || upper.includes('HAND-BREWED')) return 'THE HAND-BREWED POUR-OVER BAR';
    if (upper.includes('FRAPPE') || upper.includes('SHAKE') || upper.includes('SMOOTHIE')) return 'THE BLENDED FRAPPES & SHAKES';
    if (upper.includes('TEA') || upper.includes('REFRESHER')) return 'THE HIGHLAND TEAS & REFRESHERS';
    if (upper.includes('VIENNOISERIE') || upper.includes('PASTRIES')) return 'THE FRENCH BUTTER VIENNOISERIE';
    if (upper.includes('CAKE') || upper.includes('DESSERT')) return 'THE ARTISANAL PATISSERIE & CAKES';
    if (upper.includes('SAVORY') || upper.includes('BREAKFAST') || upper.includes('PANINI')) return 'THE LIGHT SAVORY BITES & BREAKFAST';
    return `THE ROASTERY SELECTION • ${upper}`;
  };

  // Compile items for active parent and active subcategory
  const displayedItems = useMemo(() => {
    const currentCategories = activeParent === 'COFFEE' ? coffeeCategories : bakeryCategories;
    const q = (searchQuery || '').toLowerCase().trim();

    let itemsToFilter: MenuItem[] = [];

    if (activeCategory === 'all') {
      itemsToFilter = (currentCategories || []).flatMap((c) => (c?.items && Array.isArray(c.items) ? [...c.items] : []));
    } else {
      const selectedCat = (currentCategories || []).find((c) => c && c.id === activeCategory);
      itemsToFilter = selectedCat?.items && Array.isArray(selectedCat.items) ? [...selectedCat.items] : [];
    }

    if (!q) return itemsToFilter;

    // Filter by search query
    return itemsToFilter.filter((item) => {
      if (!item) return false;
      const matchName = item.name?.toLowerCase().includes(q) || false;
      const matchDesc = item.description?.toLowerCase().includes(q) || false;
      const matchTags = item.tags?.toLowerCase().includes(q) || false;
      const matchCat = item.category?.name?.toLowerCase().includes(q) || false;
      return matchName || matchDesc || matchTags || matchCat;
    });
  }, [activeParent, coffeeCategories, bakeryCategories, activeCategory, searchQuery]);

  return (
    <div
      className="min-h-screen text-[#FAF7F2] antialiased selection:bg-[#E5CFAF] selection:text-[#0E2F2C] transition-colors duration-300"
      style={{
        backgroundColor: bgColor,
        fontFamily,
      }}
    >
      {/* 1. FIXED TOP NAVIGATION BAR */}
      <MenuHeader currentLang={currentLang} onLanguageChange={setCurrentLang} />

      {/* 2. CINEMATIC HERO SECTION */}
      <section
        id="hero"
        className="relative w-full min-h-[75vh] flex items-center justify-center pt-28 pb-20 overflow-hidden"
        style={{ backgroundColor: bgColor }}
      >
        {/* Cinematic Backdrop Image: Real Kabun Storefront at Night */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center opacity-35"
          style={{
            backgroundImage: `url('/assets/kabun/kabun-storefront-facade.jpg')`,
          }}
        >
          {/* Vignette and Dark Tint Overlays */}
          <div
            className="absolute inset-0 bg-gradient-to-t"
            style={{
              backgroundImage: `linear-gradient(to top, ${bgColor}, ${bgColor}D9, ${bgColor}F2)`,
            }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(14,47,44,0.92)_100%)]" />
        </div>

        <div className="relative z-10 max-w-[1320px] mx-auto px-4 lg:px-8 text-center flex flex-col items-center">
          {/* Brand Heritage Badge */}
          <div
            className="inline-flex items-center px-4 py-1.5 rounded-full border mb-6 shadow-sm"
            style={{
              backgroundColor: isCream ? '#EADAC3' : cardColor,
              borderColor: borderColor,
            }}
          >
            <span
              className="font-headline text-[11px] uppercase tracking-[0.25em] font-bold"
              style={{ color: isCream ? '#0E2F2C' : '#E5CFAF' }}
            >
              {settings?.tagline || 'SPECIALTY COFFEE • ROASTERY • BISTRO'}
            </span>
          </div>

          {/* Official Restaurant Master Emblem */}
          <div className="relative flex flex-col items-center justify-center mb-6 text-center w-full max-w-xs mx-auto">
            <KabunLogo variant="full" className="w-28 sm:w-36 md:w-40 max-w-[160px]" />
          </div>

          {/* CRAFTED FROM COFFEE Master Headline */}
          <div className="flex flex-col items-center mb-6">
            <h1 className="flex flex-col items-center text-center font-headline font-black uppercase text-[#FAF7F2] drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
              {/* Line 1: CRAFTED FROM */}
              <span className="flex items-center justify-center gap-2 sm:gap-3 text-2xl sm:text-4xl md:text-5xl lg:text-6xl tracking-[0.18em] sm:tracking-[0.24em] leading-tight">
                <span>{settings?.heroTitle1 || 'CRAFTED FROM'}</span>
              </span>

              {/* Line 2: COFFEE */}
              <span className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-[0.22em] sm:tracking-[0.28em] mt-1 sm:mt-2 leading-none text-[#E5CFAF]">
                {settings?.heroTitle2 || 'COFFEE'}
              </span>
            </h1>

            {/* Line 3: Coffee Bean & Finjal Emblem Motif */}
            <div className="mt-4 flex items-center gap-2 text-[#E5CFAF] opacity-90">
              <span className="w-8 h-px bg-[#E5CFAF]/40" />
              <span className="font-headline text-xs uppercase tracking-[0.3em] font-semibold text-[#E5CFAF]">
                ካቡን &bull; MEKELLE
              </span>
              <span className="w-8 h-px bg-[#E5CFAF]/40" />
            </div>
          </div>

          <p className="font-body text-sm sm:text-base text-[#C5D5D3] max-w-2xl mx-auto mb-8 tracking-wide leading-relaxed">
            {settings?.heroDescription ||
              'Upscale specialty coffee roastery in Mekelle. Experience single-origin Ethiopian beans roasted with precision, slow-steeped cold brews, artisanal espresso creations, and freshly baked viennoiserie.'}
          </p>

          {/* Call-to-Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5">
            <a
              href="#menu-section"
              className="px-7 py-3 rounded-full text-xs font-headline font-extrabold uppercase tracking-widest transition-all hover:scale-105 shadow-[0_4px_20px_rgba(229,207,175,0.35)]"
              style={{
                backgroundColor: isCream ? '#0E2F2C' : accentColor,
                color: isCream ? '#E5CFAF' : '#0E2F2C',
              }}
            >
              {settings?.primaryCtaText || t.exploreMenu}
            </a>

            <a
              href="#about-section"
              className="px-6 py-3 rounded-full text-xs font-headline font-semibold uppercase tracking-widest border transition-all hover:scale-102"
              style={{
                color: isCream ? '#0E2F2C' : '#FAF7F2',
                borderColor: borderColor,
                backgroundColor: isCream ? '#FAF6F0' : 'transparent',
              }}
            >
              {settings?.secondaryCtaText || t.visitRoastery}
            </a>
          </div>
        </div>
      </section>

      {/* 3. MENU SECTION */}
      <section
        id="menu-section"
        className="w-full py-16 sm:py-20 relative border-t transition-colors duration-200"
        style={{
          backgroundColor: bgColor,
          borderColor: borderColor,
        }}
      >
        <div className="max-w-[1320px] mx-auto px-4 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-10">
            <div
              className="inline-flex items-center gap-2 font-headline text-xs tracking-[0.2em] uppercase mb-2 font-semibold"
              style={{ color: badgeColor }}
            >
              <span>{settings?.restaurantName || 'Kabun Coffee + Roastery'} &bull; Specialty Roastery</span>
            </div>
            <h2
              className="font-headline text-2xl sm:text-4xl uppercase font-extrabold tracking-wide"
              style={{ color: textHeading }}
            >
              {getSectionTitle(
                activeCategory === 'all'
                  ? activeParent === 'COFFEE'
                    ? 'COFFEE & BEVERAGES'
                    : 'BAKERY & BITES'
                  : safeCategories.find((c) => c.id === activeCategory)?.name
              )}
            </h2>
            <p
              className="font-body text-xs sm:text-sm mt-2 max-w-xl mx-auto"
              style={{ color: textBody }}
            >
              {activeParent === 'COFFEE'
                ? 'Single-origin Ethiopian roasts, precision espresso extractions, slow-steeped cold brews, and seasonal refreshers.'
                : 'Pure French butter croissants, artisan pastries, decadent cakes, and freshly prepared savory toasts.'}
            </p>
          </div>

          {/* Department and Category Switcher */}
          <div className="mb-8">
            <CategoryTabs
              categories={safeCategories}
              activeParent={activeParent}
              onSelectParent={handleSelectParent}
              activeCategory={activeCategory}
              onSelectCategory={handleSelectCategory}
              totalFoodCount={totalBakeryCount}
              totalDrinkCount={totalCoffeeCount}
              currentLang={currentLang}
            />
          </div>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-10">
            <div
              className="relative flex items-center rounded-full border px-4 py-2.5 shadow-md transition-all"
              style={{
                backgroundColor: cardColor,
                borderColor: borderColor,
              }}
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={activeParent === 'COFFEE' ? t.searchPlaceholderCoffee : t.searchPlaceholderBakery}
                className="w-full bg-transparent text-xs sm:text-sm outline-none pr-8 font-body transition-colors"
                style={{
                  color: isCream ? '#0E2F2C' : '#FAF7F2',
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 transition-colors"
                  style={{ color: textBody }}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Active Search Notification */}
          {searchQuery && (
            <div className="text-center mb-6">
              <span className="text-xs font-body mr-2" style={{ color: textBody }}>
                Showing results for &ldquo;<span className="font-semibold" style={{ color: badgeColor }}>{searchQuery}</span>&rdquo;
              </span>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="hover:underline font-headline uppercase tracking-wider text-[11px] font-semibold"
                style={{ color: textHeading }}
              >
                {t.clearSearch}
              </button>
            </div>
          )}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="py-24 flex flex-col items-center justify-center space-y-3 text-center">
              <div
                className="w-8 h-8 rounded-full border-2 border-white/20 animate-spin"
                style={{ borderTopColor: accentColor }}
              />
              <p className="font-headline text-xs uppercase tracking-widest text-[#C5D5D3] pt-2">
                Loading Roastery Menu...
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div
              className="p-6 border border-[#1D4D47] rounded-xl text-center space-y-3 max-w-md mx-auto"
              style={{ backgroundColor: cardColor }}
            >
              <AlertCircle className="w-8 h-8 text-[#E5CFAF] mx-auto" />
              <h4 className="font-headline text-lg font-bold text-white">Could not load the menu</h4>
              <p className="text-xs text-[#C5D5D3]">{(error as any)?.message}</p>
              <button
                onClick={() => refetch()}
                className="px-5 py-2 bg-[#0E2F2C] border border-[#1D4D47] text-[#FAF7F2] text-xs font-headline uppercase font-semibold rounded-lg hover:bg-[#18423D] cursor-pointer"
              >
                Retry
              </button>
            </div>
          )}

          {/* No Search Results */}
          {!isLoading && !error && displayedItems.length === 0 && (
            <div
              className="py-16 text-center rounded-2xl border border-[#1D4D47] p-8 max-w-lg mx-auto"
              style={{ backgroundColor: cardColor }}
            >
              <p className="font-headline text-lg text-white font-bold">{t.noDishesFound}</p>
              <p className="font-body text-xs text-[#C5D5D3] mt-1">
                {t.trySearching}
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="mt-5 px-6 py-2.5 text-[#0E2F2C] text-xs font-headline uppercase font-extrabold rounded-full hover:brightness-110 transition-all cursor-pointer shadow-md"
                style={{ backgroundColor: accentColor }}
              >
                {t.showAll} {activeParent === 'COFFEE' ? t.coffee : t.bakery}
              </button>
            </div>
          )}

          {/* 3-COLUMN LUXURY MENU CARDS GRID */}
          {!isLoading && !error && displayedItems.length > 0 && (
            <div className="min-h-[35vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-start">
                {displayedItems.map((item, index) => (
                  <MenuCard
                    key={item.id}
                    item={item}
                    index={index}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 4. ABOUT US & ROASTERY PHILOSOPHY */}
      <section
        id="about-section"
        className="w-full py-20 sm:py-24 relative overflow-hidden border-t transition-colors duration-200"
        style={{
          backgroundColor: elevatedBgColor,
          borderColor: borderColor,
        }}
      >
        <div className="max-w-[1320px] mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column */}
            <div className="lg:col-span-5 flex flex-col items-start">
              <div
                className="inline-flex items-center gap-2 font-headline text-xs tracking-[0.2em] uppercase mb-2 font-semibold"
                style={{ color: badgeColor }}
              >
                {settings?.philosophyEyebrow || 'Our Roastery Craft'}
              </div>
              <h2
                className="font-headline text-2xl sm:text-4xl uppercase font-extrabold leading-tight mb-4 tracking-wide whitespace-pre-line"
                style={{ color: textHeading }}
              >
                {settings?.philosophyTitle || 'BORN IN ETHIOPIA.\nCRAFTED WITH OBSESSIVE PASSION.'}
              </h2>
              <p
                className="font-body text-sm sm:text-base leading-relaxed mb-6"
                style={{ color: textBody }}
              >
                {settings?.philosophyDescription ||
                  'Kabun is more than a café — it is a sanctuary for coffee lovers, artists, and conversation. We source exceptional micro-lots from Yirgacheffe, Guji, and Sidama, hand-roasting small batches to honor Ethiopia\'s coffee heritage in a modern architectural lounge.'}
              </p>

              <div
                className="p-5 rounded-2xl border w-full mb-6 transition-colors"
                style={{
                  backgroundColor: cardColor,
                  borderColor: borderColor,
                }}
              >
                <p
                  className="font-headline text-base italic font-semibold"
                  style={{ color: textHeading }}
                >
                  &ldquo;{settings?.manifestoQuote || 'Every great conversation begins with an exceptional roast.'}&rdquo;
                </p>
                <p
                  className="font-headline text-[11px] uppercase tracking-wider mt-2 font-bold"
                  style={{ color: badgeColor }}
                >
                  &mdash; {settings?.manifestoAuthor || "The Roaster's Manifesto"}
                </p>
              </div>

              {/* The Roastery Tasting Lounge */}
              <div className="flex items-center gap-4 pt-1">
                <div
                  className="w-12 h-12 rounded-xl border flex items-center justify-center transition-colors"
                  style={{
                    backgroundColor: isCream ? '#EADAC3' : '#0B2523',
                    borderColor: borderColor,
                    color: isCream ? '#0E2F2C' : '#E5CFAF',
                  }}
                >
                  <span className="material-symbols-outlined text-[24px]">local_cafe</span>
                </div>
                <div>
                  <p
                    className="font-headline text-xs uppercase tracking-wider font-bold"
                    style={{ color: textHeading }}
                  >
                    The Specialty Tasting Bar
                  </p>
                  <p
                    className="font-body text-xs"
                    style={{ color: textBody }}
                  >
                    Single-origin cuppings, manual pour-overs &amp; artisan baked goods
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: 3 Feature Cards Bento */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div
                className="sm:col-span-2 p-6 rounded-2xl border transition-all flex flex-col md:flex-row items-start md:items-center gap-5"
                style={{
                  backgroundColor: cardColor,
                  borderColor: borderColor,
                }}
              >
                <div
                  className="w-14 h-14 rounded-xl border flex-shrink-0 flex items-center justify-center transition-colors"
                  style={{
                    backgroundColor: isCream ? '#EADAC3' : '#0B2523',
                    borderColor: borderColor,
                    color: isCream ? '#0E2F2C' : '#E5CFAF',
                  }}
                >
                  <span className="material-symbols-outlined text-[30px]">coffee_maker</span>
                </div>
                <div>
                  <h3
                    className="font-headline text-lg mb-1 font-bold"
                    style={{ color: textHeading }}
                  >
                    Micro-Lot Precision Roasting
                  </h3>
                  <p
                    className="font-body text-xs leading-relaxed"
                    style={{ color: textBody }}
                  >
                    Small-batch profile roasting that celebrates the natural fruit, floral, and chocolate terroir of Ethiopian coffee regions.
                  </p>
                </div>
              </div>

              <div
                className="p-6 rounded-2xl border transition-all flex flex-col justify-between"
                style={{
                  backgroundColor: cardColor,
                  borderColor: borderColor,
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl border flex items-center justify-center mb-4 transition-colors"
                  style={{
                    backgroundColor: isCream ? '#EADAC3' : '#0B2523',
                    borderColor: borderColor,
                    color: isCream ? '#0E2F2C' : '#E5CFAF',
                  }}
                >
                  <span className="material-symbols-outlined text-[26px]">bakery_dining</span>
                </div>
                <div>
                  <h3
                    className="font-headline text-lg mb-1 font-bold"
                    style={{ color: textHeading }}
                  >
                    Daily French Viennoiserie
                  </h3>
                  <p
                    className="font-body text-xs leading-relaxed"
                    style={{ color: textBody }}
                  >
                    Pure French butter croissants, pain au chocolat, artisan brioche, and espresso-soaked Italian tiramisu baked fresh daily.
                  </p>
                </div>
              </div>

              <div
                className="p-6 rounded-2xl border transition-all flex flex-col justify-between"
                style={{
                  backgroundColor: cardColor,
                  borderColor: borderColor,
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl border flex items-center justify-center mb-4 transition-colors"
                  style={{
                    backgroundColor: isCream ? '#EADAC3' : '#0B2523',
                    borderColor: borderColor,
                    color: isCream ? '#0E2F2C' : '#E5CFAF',
                  }}
                >
                  <span className="material-symbols-outlined text-[26px]">wifi</span>
                </div>
                <div>
                  <h3
                    className="font-headline text-lg mb-1 font-bold"
                    style={{ color: textHeading }}
                  >
                    Modern Roastery Atmosphere
                  </h3>
                  <p
                    className="font-body text-xs leading-relaxed"
                    style={{ color: textBody }}
                  >
                    Two-story illuminated modern glass facade, warm architectural wood interiors, high-speed Wi-Fi, and cozy conversation nooks.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. EDITORIAL GALLERY SECTION: REAL PHOTOS FROM KABUN COFFEE */}
      <section
        id="gallery-section"
        className="w-full py-20 sm:py-24 border-t transition-colors duration-200"
        style={{
          backgroundColor: bgColor,
          borderColor: borderColor,
        }}
      >
        <div className="max-w-[1320px] mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div
                className="inline-flex items-center gap-2 font-headline text-xs tracking-[0.2em] uppercase mb-2 font-semibold"
                style={{ color: badgeColor }}
              >
                {t.atmosphereEyebrow}
              </div>
              <h2
                className="font-headline text-2xl sm:text-4xl uppercase font-extrabold tracking-wide"
                style={{ color: textHeading }}
              >
                {settings?.galleryTitle || 'ATMOSPHERE & ARTISAN ROASTS'}
              </h2>
            </div>
            <p
              className="font-body text-xs max-w-md leading-relaxed"
              style={{ color: textBody }}
            >
              {settings?.galleryDescription ||
                'A glimpse into our warm wood interiors, illuminated night storefront, aromatic pour-over bar, and shared moments at Kabun.'}
            </p>
          </div>

          {/* Bento Gallery Featuring Real Kabun Coffee Photography */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Real Photo 1: Illuminated Two-Story Roastery Facade */}
            <div
              className="md:col-span-7 h-[380px] md:h-[460px] rounded-2xl overflow-hidden relative group border transition-all"
              style={{ borderColor: borderColor }}
            >
              <img
                src="/assets/kabun/kabun-storefront-facade.jpg"
                alt="Kabun Coffee + Roastery two-story storefront at night"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0E2F2C]/95 via-[#0E2F2C]/30 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="font-headline text-xs text-[#E5CFAF] tracking-widest uppercase mb-1 block font-bold">
                  ካቡን &bull; Main Roastery
                </span>
                <h3 className="font-headline text-xl text-white font-extrabold">
                  Two-Story Architectural Lounge &amp; Roastery
                </h3>
                <p className="font-body text-xs text-[#C5D5D3] max-w-sm mt-1">
                  Luminous glass architecture, outdoor night seating, and the signature bean emblem lighting the Mekelle night sky.
                </p>
              </div>
            </div>

            {/* Right Stack: 2 Real Photos */}
            <div className="md:col-span-5 flex flex-col gap-5">
              {/* Real Photo 2: Lush Garden Patio Entrance */}
              <div
                className="h-[180px] md:h-[218px] rounded-2xl overflow-hidden relative group border transition-all"
                style={{ borderColor: borderColor }}
              >
                <img
                  src="/assets/kabun/kabun-patio-entrance.jpg"
                  alt="Kabun Coffee lush patio entrance at night"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E2F2C]/90 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="font-headline text-[10px] text-[#E5CFAF] tracking-wider uppercase font-bold">
                    Patio Lounge &amp; Greenery
                  </span>
                  <p className="font-headline text-base text-white font-bold">Crafted From Coffee</p>
                </div>
              </div>

              {/* Real Photo 3: Interior Cafe Seating with Gallery Wall */}
              <div
                className="h-[180px] md:h-[218px] rounded-2xl overflow-hidden relative group border transition-all"
                style={{ borderColor: borderColor }}
              >
                <img
                  src="/assets/kabun/kabun-interior-lounge.jpg"
                  alt="Kabun Coffee warm interior lounge with friends seated"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E2F2C]/90 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="font-headline text-[10px] text-[#E5CFAF] tracking-wider uppercase font-bold">
                    Artisan Coffee Lounge
                  </span>
                  <p className="font-headline text-base text-white font-bold">Warm Wood &amp; Gallery Wall</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. LOCATION, OPERATING HOURS & GUEST WI-FI */}
      <section
        id="location-section"
        className="w-full py-20 sm:py-24 relative border-t transition-colors duration-200"
        style={{
          backgroundColor: elevatedBgColor,
          borderColor: borderColor,
        }}
      >
        <div className="max-w-[1320px] mx-auto px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div
              className="inline-flex items-center gap-2 font-headline text-xs tracking-[0.2em] uppercase mb-2 font-semibold"
              style={{ color: badgeColor }}
            >
              <span>{settings?.restaurantName || 'Kabun Coffee + Roastery'}</span>
            </div>
            <h2
              className="font-headline text-2xl sm:text-4xl uppercase font-extrabold tracking-wide"
              style={{ color: textHeading }}
            >
              VISIT OUR ROASTERY &amp; LOUNGE
            </h2>
            <p
              className="font-body text-xs sm:text-sm mt-2 leading-relaxed"
              style={{ color: textBody }}
            >
              Step in for freshly brewed single-origin coffee, morning pastries, high-speed Wi-Fi, and heartfelt conversations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {/* Location Card */}
            <div
              className="border rounded-2xl p-6 text-center space-y-3 transition-colors"
              style={{
                backgroundColor: cardColor,
                borderColor: borderColor,
              }}
            >
              <div
                className="w-12 h-12 rounded-xl border flex items-center justify-center mx-auto transition-colors"
                style={{
                  backgroundColor: isCream ? '#EADAC3' : '#0B2523',
                  borderColor: borderColor,
                  color: isCream ? '#0E2F2C' : '#E5CFAF',
                }}
              >
                <span className="material-symbols-outlined text-[24px]">location_on</span>
              </div>
              <h3
                className="font-headline text-base font-bold"
                style={{ color: textHeading }}
              >
                Roastery Location
              </h3>
              <p
                className="font-body text-xs leading-relaxed whitespace-pre-line"
                style={{ color: textBody }}
              >
                <strong style={{ color: textHeading }}>
                  {[settings?.addressLine1, settings?.addressLine2].filter(Boolean).join('\n') || 'Mekelle, Tigray, Ethiopia\nካቡን ኮፊ እና ሮስተሪ (Kebele 17 / Main Roastery)'}
                </strong>
              </p>
            </div>

            {/* Operating Hours */}
            <div
              className="border rounded-2xl p-6 text-center space-y-3 transition-colors"
              style={{
                backgroundColor: cardColor,
                borderColor: borderColor,
              }}
            >
              <div
                className="w-12 h-12 rounded-xl border flex items-center justify-center mx-auto transition-colors"
                style={{
                  backgroundColor: isCream ? '#EADAC3' : '#0B2523',
                  borderColor: borderColor,
                  color: isCream ? '#0E2F2C' : '#E5CFAF',
                }}
              >
                <span className="material-symbols-outlined text-[24px]">schedule</span>
              </div>
              <h3
                className="font-headline text-base font-bold"
                style={{ color: textHeading }}
              >
                {t.diningHours}
              </h3>
              <p
                className="font-body text-xs leading-relaxed"
                style={{ color: textBody }}
              >
                <strong
                  className="font-headline text-xs font-bold block mb-1"
                  style={{ color: textHeading }}
                >
                  {settings?.openingHours || 'Monday – Sunday\n7:00 AM – 10:30 PM'}
                </strong>
                <span style={{ color: isCream ? '#6B807D' : '#A3B8B5' }}>{t.kitchenCloses}</span>
              </p>
            </div>

            {/* Free Guest Wi-Fi Card */}
            <div
              className="border rounded-2xl p-6 text-center space-y-3 transition-colors"
              style={{
                backgroundColor: cardColor,
                borderColor: borderColor,
              }}
            >
              <div
                className="w-12 h-12 rounded-xl border flex items-center justify-center mx-auto transition-colors"
                style={{
                  backgroundColor: isCream ? '#EADAC3' : '#0B2523',
                  borderColor: borderColor,
                  color: isCream ? '#0E2F2C' : '#E5CFAF',
                }}
              >
                <Wifi className="w-5 h-5" />
              </div>
              <h3
                className="font-headline text-base font-bold"
                style={{ color: textHeading }}
              >
                {t.freeWifi}
              </h3>
              <p
                className="font-mono text-xs truncate"
                style={{ color: textBody }}
              >
                {wifiSsid}
              </p>
              <button
                type="button"
                onClick={handleCopyWifi}
                className="w-full py-2 px-3 rounded-lg font-headline text-[11px] uppercase font-bold tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm hover:brightness-110"
                style={{
                  backgroundColor: isCream ? '#0E2F2C' : accentColor,
                  color: isCream ? '#E5CFAF' : '#0E2F2C',
                }}
              >
                {copiedWifi ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>{t.passwordCopied}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{t.copyPassword}</span>
                  </>
                )}
              </button>
            </div>

            {/* Phone Lines & Socials */}
            <div
              className="border rounded-2xl p-6 text-center space-y-3 transition-colors"
              style={{
                backgroundColor: cardColor,
                borderColor: borderColor,
              }}
            >
              <div
                className="w-12 h-12 rounded-xl border flex items-center justify-center mx-auto transition-colors"
                style={{
                  backgroundColor: isCream ? '#EADAC3' : '#0B2523',
                  borderColor: borderColor,
                  color: isCream ? '#0E2F2C' : '#E5CFAF',
                }}
              >
                <span className="material-symbols-outlined text-[24px]">call</span>
              </div>
              <h3
                className="font-headline text-base font-bold"
                style={{ color: textHeading }}
              >
                {t.contactSocial}
              </h3>

              <div className="flex flex-col gap-1.5 text-xs">
                {/* Direct Dial Phone Links */}
                <div className="flex items-center justify-center gap-2">
                  <a
                    href={`tel:${settings?.phone1 || '0914000000'}`}
                    className="inline-flex items-center gap-1 font-mono font-bold transition-colors py-0.5 hover:opacity-80"
                    style={{ color: textHeading }}
                  >
                    <span>{settings?.phone1 || '0914000000'}</span>
                  </a>
                  <span style={{ color: borderColor }}>&bull;</span>
                  <a
                    href={`tel:${settings?.phone2 || '0920000000'}`}
                    className="inline-flex items-center gap-1 font-mono font-bold transition-colors py-0.5 hover:opacity-80"
                    style={{ color: textHeading }}
                  >
                    <span>{settings?.phone2 || '0920000000'}</span>
                  </a>
                </div>

                {/* Clickable Social Media Links */}
                <div className="pt-1 flex flex-col gap-1 text-xs">
                  <a
                    href="https://www.instagram.com/kabuncoffee/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-1.5 px-2.5 py-1.5 rounded-lg border transition-all text-[10px]"
                    style={{
                      backgroundColor: isCream ? '#EADAC3' : '#0B2523',
                      borderColor: borderColor,
                      color: isCream ? '#0E2F2C' : '#C5D5D3',
                    }}
                  >
                    <span className="truncate">IG: {settings?.instagramHandle || '@KABUNCOFFEE'}</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-70 group-hover:opacity-100 shrink-0" />
                  </a>

                  <a
                    href="https://www.tiktok.com/@kabuncoffee"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-1.5 px-2.5 py-1.5 rounded-lg border transition-all text-[10px]"
                    style={{
                      backgroundColor: isCream ? '#EADAC3' : '#0B2523',
                      borderColor: borderColor,
                      color: isCream ? '#0E2F2C' : '#C5D5D3',
                    }}
                  >
                    <span className="truncate">TikTok: {settings?.tiktokHandle || '@KABUNCOFFEE'}</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-70 group-hover:opacity-100 shrink-0" />
                  </a>

                  <a
                    href="https://www.facebook.com/search/top?q=KABUN%20COFFEE%20ROASTERY"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-1.5 px-2.5 py-1.5 rounded-lg border transition-all text-[10px]"
                    style={{
                      backgroundColor: isCream ? '#EADAC3' : '#0B2523',
                      borderColor: borderColor,
                      color: isCream ? '#0E2F2C' : '#C5D5D3',
                    }}
                  >
                    <span className="truncate">FB: {settings?.facebookHandle || 'KABUN COFFEE + ROASTERY - ካቡን'}</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-70 group-hover:opacity-100 shrink-0" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. KABUN ROASTERY PILLARS RIBBON */}
      <KabunRoasteryRibbon />

      {/* 8. FOOTER */}
      <footer className="w-full border-t border-[#1D4D47]" style={{ backgroundColor: bgColor }}>
        <div className="max-w-[1320px] mx-auto px-4 lg:px-8 py-16">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 relative">
              <KabunLogo variant="full" className="w-40 sm:w-48" />
            </div>

            <p className="font-body text-xs text-[#C5D5D3] max-w-md mb-8">
              Bespoke specialty coffee roastery, artisanal pour-over bar, and fresh viennoiserie.
            </p>

            {/* Clickable Social Bar in Footer */}
            <div className="flex items-center justify-center gap-3.5 mb-8">
              <a
                href="https://www.instagram.com/kabuncoffee/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-[#1D4D47] hover:border-[#E5CFAF] flex items-center justify-center text-[#C5D5D3] hover:text-white transition-all hover:scale-105"
                style={{ backgroundColor: cardColor }}
                title="Instagram"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>

              <a
                href="https://www.tiktok.com/@kabuncoffee"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-[#1D4D47] hover:border-[#E5CFAF] flex items-center justify-center text-[#C5D5D3] hover:text-white transition-all hover:scale-105"
                style={{ backgroundColor: cardColor }}
                title="TikTok"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z"/>
                </svg>
              </a>

              <a
                href="https://www.facebook.com/search/top?q=KABUN%20COFFEE%20ROASTERY"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-[#1D4D47] hover:border-[#E5CFAF] flex items-center justify-center text-[#C5D5D3] hover:text-white transition-all hover:scale-105"
                style={{ backgroundColor: cardColor }}
                title="Facebook"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>

              <a
                href={`tel:${settings?.phone1 || '0914000000'}`}
                className="w-10 h-10 rounded-full border border-[#1D4D47] hover:border-[#E5CFAF] flex items-center justify-center text-[#C5D5D3] hover:text-white transition-all hover:scale-105"
                style={{ backgroundColor: cardColor }}
                title="Call"
              >
                <span className="material-symbols-outlined text-[18px]">call</span>
              </a>
            </div>

            <nav className="flex flex-wrap items-center justify-center gap-7 mb-8 font-headline text-xs uppercase tracking-widest font-semibold">
              <a href="#hero" className="text-white hover:text-[#E5CFAF] transition-colors">
                {t.home}
              </a>
              <a href="#menu-section" className="text-[#C5D5D3] hover:text-[#E5CFAF] transition-colors">
                {t.ourMenu}
              </a>
              <a href="#about-section" className="text-[#C5D5D3] hover:text-[#E5CFAF] transition-colors">
                {t.aboutUs}
              </a>
              <a href="#gallery-section" className="text-[#C5D5D3] hover:text-[#E5CFAF] transition-colors">
                {t.atmosphere}
              </a>
              <a href="#location-section" className="text-[#C5D5D3] hover:text-[#E5CFAF] transition-colors">
                {t.locationHours}
              </a>
            </nav>

            <div className="pt-6 border-t border-[#1D4D47] w-full flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#A3B8B5] gap-2">
              <p>Copyright &copy; {settings?.restaurantName || 'Kabun Coffee + Roastery (ካቡን)'}. All rights reserved.</p>
              <div className="flex items-center gap-3">
                <p className="text-[#718E8A]">Specialty Coffee Roastery &bull; Mekelle, Tigray, Ethiopia</p>
                <button
                  onClick={() => navigate('/admin/login')}
                  className="text-[#235750] hover:text-[#E5CFAF] transition-colors p-1"
                  title="Staff Portal Login"
                  aria-label="Staff Portal Login"
                >
                  <Lock className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Scroll To Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          type="button"
          aria-label="Scroll back to top"
          className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full backdrop-blur-md border shadow-[0_10px_25px_rgba(0,0,0,0.5)] hover:scale-105 transition-all duration-300 flex items-center justify-center cursor-pointer animate-in fade-in"
          style={{
            backgroundColor: isCream ? '#0E2F2C' : `${cardColor}E6`,
            color: isCream ? '#E5CFAF' : '#FAF7F2',
            borderColor: isCream ? '#E5CFAF' : borderColor,
          }}
          title="Back to Top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};
