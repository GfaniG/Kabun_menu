import React, { useState } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';
import { MenuItem } from '../../types/menu';
import { api } from '../../api/client';

interface MenuCardProps {
  item: MenuItem;
  index: number;
}

export const MenuCard: React.FC<MenuCardProps> = ({ item }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const formatPrice = (price: number | null | undefined) => {
    if (price === null || price === undefined) {
      return 'Market Price';
    }
    return `${price.toLocaleString()} ETB`;
  };

  const isMarketPrice = item.price === null || item.price === undefined;

  // Indicator for signature drinks & bakery
  const isSpecial =
    isMarketPrice ||
    (item.tags &&
      (item.tags.toLowerCase().includes('roaster') ||
        item.tags.toLowerCase().includes('signature') ||
        item.tags.toLowerCase().includes('single-origin') ||
        item.tags.toLowerCase().includes('bestseller') ||
        item.tags.toLowerCase().includes('special')));

  const specialLabel = isMarketPrice ? "Roaster's Special" : 'House Signature';

  const handleToggle = () => {
    const nextState = !isExpanded;
    setIsExpanded(nextState);
    if (nextState) {
      api.trackEvent({
        type: 'ITEM_VIEW',
        itemId: item.id,
        itemName: item.name,
      }).catch(() => {});
    }
  };

  return (
    <div
      onClick={handleToggle}
      className={`group relative rounded-2xl border transition-all duration-300 cursor-pointer select-none overflow-hidden h-auto ${
        isExpanded
          ? 'bg-[#18423D] border-[#E5CFAF]/40 shadow-[0_20px_40px_rgba(0,0,0,0.7)]'
          : 'bg-[#133834] border-[#1D4D47] hover:border-[#E5CFAF]/50 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(0,0,0,0.5)]'
      } ${!item.isAvailable ? 'opacity-50' : ''}`}
    >
      <div className="p-4 sm:p-5 flex flex-col h-auto">
        <div>
          {/* Main Item Row: Compact Thumbnail + Title & Price */}
          <div className="flex items-start gap-3.5 sm:gap-4">
            {/* Item Thumbnail */}
            {item.image && !imgError && (
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 border border-[#1D4D47] bg-[#081E1C] group-hover:border-[#E5CFAF]/40 transition-all duration-300 shadow-md">
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}

            {/* Title, Special Tag, and Price */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 pr-1">
                  <h3
                    className={`font-headline text-base sm:text-lg font-bold text-[#FAF7F2] tracking-normal leading-snug group-hover:text-white transition-colors truncate ${
                      !item.isAvailable ? 'line-through text-[#71717A]' : ''
                    }`}
                  >
                    {item.name}
                  </h3>

                  {/* Clean Minimal Special Pill Badge */}
                  {isSpecial && (
                    <span className="inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-headline font-semibold uppercase tracking-[0.12em] bg-[#E5CFAF]/10 border border-[#E5CFAF]/30 text-[#E5CFAF]">
                      <Sparkles className="w-2.5 h-2.5 text-[#E5CFAF]" />
                      {specialLabel}
                    </span>
                  )}
                </div>

                {/* Price Tag & Sleek Chevron */}
                <div className="flex items-center gap-1.5 shrink-0 text-right">
                  <span
                    className={`font-headline text-sm sm:text-base font-bold font-mono tracking-tight whitespace-nowrap ${
                      isMarketPrice
                        ? 'text-[#C5D5D3] text-xs uppercase tracking-wider font-medium'
                        : 'text-[#E5CFAF]'
                    }`}
                  >
                    {formatPrice(item.price)}
                  </span>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[#C5D5D3] group-hover:text-white transition-transform duration-300 ${
                      isExpanded ? 'rotate-180 text-[#E5CFAF]' : ''
                    }`}
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Collapsed Brief Preview */}
              {!isExpanded && item.description && (
                <p className="font-body text-xs text-[#C5D5D3] line-clamp-2 mt-2 leading-relaxed">
                  {item.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Expanded Rich Details */}
        {isExpanded && (
          <div className="mt-4 pt-3.5 border-t border-[#1D4D47] animate-in fade-in slide-in-from-top-1 duration-200">
            {item.description && (
              <p className="font-body text-xs sm:text-sm text-[#FAF7F2]/90 leading-relaxed mb-3">
                {item.description}
              </p>
            )}

            {/* Tags / Tasting Notes */}
            {item.tags && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {item.tags.split(',').map((tag, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-md text-[10px] font-headline font-medium uppercase tracking-wider bg-[#0E2F2C] border border-[#235750] text-[#E5CFAF]"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
