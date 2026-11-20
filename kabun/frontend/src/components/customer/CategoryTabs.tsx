import React from 'react';
import { Coffee } from 'lucide-react';
import { Category } from '../../types/menu';
import { Language, translations, translateCategory } from '../../i18n/translations';
import { useTheme } from '../../context/ThemeContext';

interface CategoryTabsProps {
  categories: Category[];
  activeParent?: 'COFFEE' | 'BAKERY' | 'FOOD' | 'DRINKS';
  onSelectParent?: (parent: any) => void;
  activeCategory: string; // 'all' or category.id
  onSelectCategory: (id: string) => void;
  totalFoodCount?: number;
  totalDrinkCount?: number;
  currentLang?: Language;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
  totalDrinkCount,
  currentLang = 'en',
}) => {
  const { theme } = useTheme();
  const isCream = theme === 'cream';
  const t = translations[currentLang] || translations.en;

  // Filter subcategories to strictly include drinks and coffee selections
  const drinkSubCategories = categories.filter((cat) => {
    const parent = (cat.parentCategory || 'COFFEE').toUpperCase();
    return parent === 'COFFEE' || parent === 'DRINKS';
  });

  return (
    <div className="w-full flex flex-col items-center gap-2">
      {/* Sleek Subcategory Pill Bar */}
      <div className="w-full max-w-5xl mx-auto px-2 sm:px-4 flex items-center gap-2 overflow-x-auto md:flex-wrap md:justify-center justify-start pb-2 pt-1 no-scrollbar select-none">
        {/* 'All Coffee & Drinks' */}
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
          <span>{t.allCoffee} {totalDrinkCount !== undefined && totalDrinkCount > 0 ? `(${totalDrinkCount})` : ''}</span>
        </button>

        {/* Dynamic drink subcategories with localization */}
        {drinkSubCategories.map((category) => {
          const isActive = activeCategory === category.id;
          const translatedName = translateCategory(category.name, currentLang);
          const itemCount = category.items?.length || 0;

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
              <span>{translatedName} {itemCount > 0 ? `(${itemCount})` : ''}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
