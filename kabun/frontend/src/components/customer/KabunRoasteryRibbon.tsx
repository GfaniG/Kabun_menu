import React from 'react';
import { Flame, Droplets, Croissant, Award } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const KabunRoasteryRibbon: React.FC = () => {
  const { theme } = useTheme();
  const isCream = theme === 'cream';

  return (
    <div
      className={`w-full border-t py-10 overflow-hidden select-none relative transition-colors duration-200 ${
        isCream ? 'bg-[#EADAC3] border-[#DFC9AA]' : 'bg-[#0B2523] border-[#1D4D47]'
      }`}
    >
      <div className="max-w-[1320px] mx-auto px-4 lg:px-8">
        {/* Responsive flex ribbon of iconic craft pillars in luxury roastery aesthetic */}
        <div className="flex flex-wrap items-center justify-around gap-8 sm:gap-10 opacity-90 hover:opacity-100 transition-opacity duration-300">
          {/* 1. Single-Origin Micro-Lots */}
          <div className="flex flex-col items-center gap-1.5 group text-center">
            <div
              className={`w-10 h-10 rounded-full border flex items-center justify-center group-hover:scale-105 transition-transform shadow-md ${
                isCream
                  ? 'bg-[#FAF6F0] border-[#DFC9AA] text-[#0E2F2C]'
                  : 'bg-[#133834] border-[#235750] text-[#E5CFAF]'
              }`}
            >
              <Award className="w-5 h-5" />
            </div>
            <span
              className={`text-[11px] font-headline uppercase tracking-widest font-bold ${
                isCream ? 'text-[#0E2F2C]' : 'text-[#FAF7F2]'
              }`}
            >
              Single-Origin Micro-Lots
            </span>
            <span
              className={`text-[10px] font-body italic ${
                isCream ? 'text-[#5C706D]' : 'text-[#C5D5D3]'
              }`}
            >
              Yirgacheffe, Guji &amp; Sidama
            </span>
          </div>

          {/* 2. Precision Artisan Roasting */}
          <div className="flex flex-col items-center gap-1 group text-center">
            <div
              className={`w-10 h-10 rounded-full border flex items-center justify-center group-hover:scale-105 transition-transform shadow-md ${
                isCream
                  ? 'bg-[#FAF6F0] border-[#DFC9AA] text-[#0E2F2C]'
                  : 'bg-[#133834] border-[#235750] text-[#E5CFAF]'
              }`}
            >
              <Flame className="w-5 h-5" />
            </div>
            <span
              className={`font-headline text-xs font-bold uppercase tracking-[0.2em] transition-colors ${
                isCream
                  ? 'text-[#0E2F2C] group-hover:text-[#18423D]'
                  : 'text-[#FAF7F2] group-hover:text-[#E5CFAF]'
              }`}
            >
              CRAFTED FROM COFFEE
            </span>
            <span
              className={`text-[10px] font-body italic ${
                isCream ? 'text-[#5C706D]' : 'text-[#C5D5D3]'
              }`}
            >
              Small-batch precision roasts
            </span>
          </div>

          {/* 3. Traditional Clay Jebena */}
          <div className="flex flex-col items-center gap-1 group text-center">
            <div
              className={`px-3.5 py-1.5 rounded-full border transition-colors shadow-md ${
                isCream
                  ? 'bg-[#FAF6F0] border-[#DFC9AA] group-hover:border-[#0E2F2C]'
                  : 'bg-[#133834] border-[#235750] group-hover:border-[#E5CFAF]'
              }`}
            >
              <span
                className={`font-headline text-xs font-bold tracking-widest uppercase flex items-center gap-1.5 ${
                  isCream ? 'text-[#0E2F2C]' : 'text-[#E5CFAF]'
                }`}
              >
                <span>☕</span>
                <span>JEBENA BUNA</span>
              </span>
            </div>
            <span
              className={`text-[10px] font-body mt-1 ${
                isCream ? 'text-[#5C706D]' : 'text-[#C5D5D3]'
              }`}
            >
              Ceremonial frankincense aroma
            </span>
          </div>

          {/* 4. 16-Hour Cold Brew */}
          <div className="flex flex-col items-center gap-1 group text-center">
            <div
              className={`w-10 h-10 rounded-full border flex items-center justify-center group-hover:scale-105 transition-transform shadow-md ${
                isCream
                  ? 'bg-[#FAF6F0] border-[#DFC9AA] text-[#0E2F2C]'
                  : 'bg-[#133834] border-[#235750] text-[#E5CFAF]'
              }`}
            >
              <Droplets className="w-5 h-5" />
            </div>
            <span
              className={`font-headline text-xs font-bold uppercase tracking-[0.18em] transition-colors ${
                isCream ? 'text-[#0E2F2C]' : 'text-[#FAF7F2]'
              }`}
            >
              16-HR COLD EXTRACTION
            </span>
            <span
              className={`text-[10px] font-body italic ${
                isCream ? 'text-[#5C706D]' : 'text-[#C5D5D3]'
              }`}
            >
              Ultra-smooth, zero bitterness
            </span>
          </div>

          {/* 5. French Viennoiserie */}
          <div className="flex flex-col items-center gap-1 group text-center">
            <div
              className={`w-10 h-10 rounded-full border flex items-center justify-center group-hover:scale-105 transition-transform shadow-md ${
                isCream
                  ? 'bg-[#FAF6F0] border-[#DFC9AA] text-[#0E2F2C]'
                  : 'bg-[#133834] border-[#235750] text-[#E5CFAF]'
              }`}
            >
              <Croissant className="w-5 h-5" />
            </div>
            <span
              className={`text-xs font-headline font-bold uppercase tracking-wider ${
                isCream ? 'text-[#0E2F2C]' : 'text-[#FAF7F2]'
              }`}
            >
              FRENCH BUTTER VIENNOISERIE
            </span>
            <span
              className={`text-[10px] font-body ${
                isCream ? 'text-[#5C706D]' : 'text-[#C5D5D3]'
              }`}
            >
              Croissants &amp; brioche daily
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
