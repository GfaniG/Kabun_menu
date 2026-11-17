import React from 'react';
import { Coffee, Flame, Sparkles, Droplets, Croissant, Award } from 'lucide-react';

export const KabunRoasteryRibbon: React.FC = () => {
  return (
    <div className="w-full bg-[#0B2523] border-t border-[#1D4D47] py-10 overflow-hidden select-none relative">
      <div className="max-w-[1320px] mx-auto px-4 lg:px-8">
        {/* Responsive flex ribbon of iconic craft pillars in luxury roastery aesthetic */}
        <div className="flex flex-wrap items-center justify-around gap-8 sm:gap-10 opacity-85 hover:opacity-100 transition-opacity duration-300">
          {/* 1. Single-Origin Micro-Lots */}
          <div className="flex flex-col items-center gap-1.5 group text-center">
            <div className="w-10 h-10 rounded-full bg-[#133834] border border-[#235750] flex items-center justify-center text-[#E5CFAF] group-hover:scale-105 transition-transform shadow-md">
              <Award className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-headline uppercase tracking-widest text-[#FAF7F2] font-bold">
              Single-Origin Micro-Lots
            </span>
            <span className="text-[10px] font-body text-[#C5D5D3] italic">
              Yirgacheffe, Guji &amp; Sidama
            </span>
          </div>

          {/* 2. Precision Artisan Roasting */}
          <div className="flex flex-col items-center gap-1 group text-center">
            <div className="w-10 h-10 rounded-full bg-[#133834] border border-[#235750] flex items-center justify-center text-[#E5CFAF] group-hover:scale-105 transition-transform shadow-md">
              <Flame className="w-5 h-5" />
            </div>
            <span className="font-headline text-xs font-bold uppercase tracking-[0.2em] text-[#FAF7F2] group-hover:text-[#E5CFAF] transition-colors">
              CRAFTED FROM COFFEE
            </span>
            <span className="text-[10px] font-body text-[#C5D5D3] italic">
              Small-batch precision roasts
            </span>
          </div>

          {/* 3. Traditional Clay Jebena */}
          <div className="flex flex-col items-center gap-1 group text-center">
            <div className="px-3.5 py-1.5 rounded-full bg-[#133834] border border-[#235750] group-hover:border-[#E5CFAF] transition-colors shadow-md">
              <span className="font-headline text-xs font-bold tracking-widest text-[#E5CFAF] uppercase flex items-center gap-1.5">
                <span>☕</span>
                <span>JEBENA BUNA</span>
              </span>
            </div>
            <span className="text-[10px] font-body text-[#C5D5D3] mt-1">
              Ceremonial frankincense aroma
            </span>
          </div>

          {/* 4. 16-Hour Cold Brew */}
          <div className="flex flex-col items-center gap-1 group text-center">
            <div className="w-10 h-10 rounded-full bg-[#133834] border border-[#235750] flex items-center justify-center text-[#E5CFAF] group-hover:scale-105 transition-transform shadow-md">
              <Droplets className="w-5 h-5" />
            </div>
            <span className="font-headline text-xs font-bold uppercase tracking-[0.18em] text-[#FAF7F2] transition-colors">
              16-HR COLD EXTRACTION
            </span>
            <span className="text-[10px] font-body text-[#C5D5D3] italic">
              Ultra-smooth, zero bitterness
            </span>
          </div>

          {/* 5. French Viennoiserie */}
          <div className="flex flex-col items-center gap-1 group text-center">
            <div className="w-10 h-10 rounded-full bg-[#133834] border border-[#235750] flex items-center justify-center text-[#E5CFAF] group-hover:scale-105 transition-transform shadow-md">
              <Croissant className="w-5 h-5" />
            </div>
            <span className="text-xs font-headline font-bold uppercase tracking-wider text-[#FAF7F2]">
              FRENCH BUTTER VIENNOISERIE
            </span>
            <span className="text-[10px] font-body text-[#C5D5D3]">
              Baked fresh every morning
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
