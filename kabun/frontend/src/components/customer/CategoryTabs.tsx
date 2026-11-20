import React from 'react';
import { Coffee, Croissant } from 'lucide-react';
import { Category } from '../../types/menu';
import { Language, translations, translateCategory } from '../../i18n/translations';
import { useTheme } from '../../context/ThemeContext';

interface CategoryTabsProps {
  categories: Category[];
  activeParent: 'COFFEE' | 'BAKERY' | 'FOOD' | 'DRINKS';
  onSelectParent: (parent: any) => void;
  activeCategory: string; // 'all' or category.id
  onSelectCategory: (id: string) => void;
  totalFoodCount: number; // Used for bakery/bites
  totalDrinkCount: number; // Used for coffee/beverages
  currentLang?: Language;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  activeParent,
  onSelectParent,
  activeCategory,
  onSelectCategory,
  totalFoodCount,
  totalDrinkCount,
  currentLang = 'en',
}) => {
  const { theme } = useTheme();
  const isCream = theme === 'cream';
  const t = translations[currentLang] || translations.en;

  const isCoffeeActive = activeParent === 'COFFEE' || activeParent === 'DRINKS';
  const isBakeryActive = activeParent === 'BAKERY' || activeParent === 'FOOD';

  // Filter subcategories for the active parent department
  const currentSubCategories = categories.filter((cat) => {
    const parent = (cat.parentCategory || 'COFFEE').toUpperCase();
    if (isCoffeeActive) {
      return parent === 'COFFEE' || parent === 'DRINKS';
    }
    return parent === 'BAKERY' || parent === 'FOOD';
  });

  return (
    <div className="w-full flex flex-col items-center gap-3.5">
      {/* 1. Primary Department Switcher: COFFEE & BEVERAGES vs BAKERY & BITES */}
      <div
        className={`inline-flex items-center p-1.5 rounded-full border transition-all duration-300 ${
          isCream
            ? 'bg-[#EADAC3] border-[#DFC9AA] shadow-[0_4px_20px_rgba(14,47,44,0.08)]'
            : 'bg-[#133834] border-[#1D4D47] shadow-[0_4px_24px_rgba(0,0,0,0.6)]'
        }`}
      >
        {/* Department 1: Coffee & Beverages */}
        <button
          type="button"
          onClick={() => {
            onSelectParent('COFFEE');
            onSelectCategory('all');
          }}
          className={`flex items-center gap-2 px-5 sm:px-7 py-2.5 rounded-full font-headline text-xs sm:text-sm font-extrabold uppercase tracking-widest transition-all duration-300 cursor-pointer ${
            isCoffeeActive
              ? isCream
                ? 'bg-[#0E2F2C] text-[#E5CFAF] shadow-[0_0_18px_rgba(14,47,44,0.25)] scale-102'
                : 'bg-[#E5CFAF] text-[#0E2F2C] shadow-[0_0_20px_rgba(229,207,175,0.4)] scale-102'
              : isCream
              ? 'text-[#3D524F] hover:text-[#0E2F2C] hover:bg-[#DFC9AA]/40'
              : 'text-[#C5D5D3] hover:text-[#FAF7F2] hover:bg-white/5'
          }`}
        >
          <Coffee className="w-4 h-4" />
          <span>{t.coffee} ({totalDrinkCount})</span>
        </button>

        {/* Department 2: Bakery, Pastries & Bites */}
        <button
          type="button"
          onClick={() => {
            onSelectParent('BAKERY');
            onSelectCategory('all');
          }}
          className={`flex items-center gap-2 px-5 sm:px-7 py-2.5 rounded-full font-headline text-xs sm:text-sm font-extrabold uppercase tracking-widest transition-all duration-300 cursor-pointer ${
            isBakeryActive
              ? isCream
                ? 'bg-[#0E2F2C] text-[#E5CFAF] shadow-[0_0_18px_rgba(14,47,44,0.25)] scale-102'
                : 'bg-[#E5CFAF] text-[#0E2F2C] shadow-[0_0_20px_rgba(229,207,175,0.4)] scale-102'
              : isCream
              ? 'text-[#3D524F] hover:text-[#0E2F2C] hover:bg-[#DFC9AA]/40'
              : 'text-[#C5D5D3] hover:text-[#FAF7F2] hover:bg-white/5'
          }`}
        >
          <Croissant className="w-4 h-4" />
          <span>{t.bakery} ({totalFoodCount})</span>
        </button>
      </div>

      {/* 2. Subcategory Pill Bar */}
      <div className="w-full max-w-5xl mx-auto px-2 sm:px-4 flex items-center gap-2 overflow-x-auto md:flex-wrap md:justify-center justify-start pb-2 pt-1 no-scrollbar select-none">
        {/* 'All' in this department */}
        <button
          onClick={() => onSelectCategory('all')}
          type="button"
          className={`px-4 sm:px-5 py-2 rounded-full font-headline text-xs uppercase tracking-wider font-bold transition-all duration-200 shrink-0 cursor-pointer ${
            activeCategory === 'all'
              ? isCream
                ? 'bg-[#0E2F2C] text-[#E5CFAF] shadow-[0_2px_10px_rgba(14,47,44,0.2)]'
                : 'bg-[#E5CFAF] text-[#0E2F2C] shadow-[0_0_12px_rgba(229,207,175,0.35)]'
              : isCream
              ? 'bg-[#EADAC3] text-[#0E2F2C] hover:bg-[#DFC9AA] border border-[#DFC9AA]'
              : 'bg-[#133834] text-[#C5D5D3] hover:text-[#FAF7F2] hover:bg-[#18423D] border border-[#1D4D47]'
          }`}
        >
          <span>{isCoffeeActive ? t.allCoffee : t.allBakery}</span>
        </button>

        {/* Dynamic subcategories with localization */}
        {currentSubCategories.map((category) => {
          const isActive = activeCategory === category.id;
          const translatedName = translateCategory(category.name, currentLang);

          return (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              type="button"
              className={`px-4 sm:px-5 py-2 rounded-full font-headline text-xs uppercase tracking-wider font-bold transition-all duration-200 shrink-0 cursor-pointer ${
                isActive
                  ? isCream
                    ? 'bg-[#0E2F2C] text-[#E5CFAF] shadow-[0_2px_10px_rgba(14,47,44,0.2)]'
                    : 'bg-[#E5CFAF] text-[#0E2F2C] shadow-[0_0_12px_rgba(229,207,175,0.35)]'
                  : isCream
                  ? 'bg-[#EADAC3] text-[#0E2F2C] hover:bg-[#DFC9AA] border border-[#DFC9AA]'
                  : 'bg-[#133834] text-[#C5D5D3] hover:text-[#FAF7F2] hover:bg-[#18423D] border border-[#1D4D47]'
              }`}
            >
              <span>{translatedName}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
