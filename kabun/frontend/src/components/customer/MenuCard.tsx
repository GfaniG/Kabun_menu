import React, { useState } from 'react';
import { ChevronDown, Sparkles, Plus, Minus } from 'lucide-react';
import { MenuItem } from '../../types/menu';
import { api } from '../../api/client';
import { useTheme } from '../../context/ThemeContext';

interface MenuCardProps {
  item: MenuItem;
  index: number;
  quantityInTray?: number;
  onAddToTray?: (item: MenuItem) => void;
  onUpdateQuantity?: (itemId: string, delta: number) => void;
}

export const MenuCard: React.FC<MenuCardProps> = ({
  item,
  quantityInTray,
  onAddToTray,
  onUpdateQuantity,
}) => {
  const { theme } = useTheme();
  const isCream = theme === 'cream';

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
        isCream
          ? isExpanded
            ? 'bg-white border-[#0E2F2C]/30 shadow-[0_16px_36px_rgba(14,47,44,0.12)]'
            : 'bg-[#FAF6F0] border-[#DFC9AA] hover:border-[#0E2F2C]/40 hover:-translate-y-0.5 shadow-[0_4px_20px_rgba(14,47,44,0.06)] hover:shadow-[0_12px_28px_rgba(14,47,44,0.1)]'
          : isExpanded
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
              <div
                className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 border transition-all duration-300 shadow-md ${
                  isCream
                    ? 'border-[#DFC9AA] bg-[#EADAC3] group-hover:border-[#0E2F2C]/40'
                    : 'border-[#1D4D47] bg-[#081E1C] group-hover:border-[#E5CFAF]/40'
                }`}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {Boolean(quantityInTray && quantityInTray > 0) && (
                  <span className="absolute top-1.5 left-1.5 z-10 px-1.5 py-0.5 rounded-full bg-red-600 text-white font-mono font-black text-[10px] shadow-md border border-white/20 animate-in zoom-in-75">
                    {quantityInTray}
                  </span>
                )}
              </div>
            )}

            {/* Title, Special Tag, and Price */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 pr-1">
                  <h3
                    className={`font-headline text-base sm:text-lg font-bold tracking-normal leading-snug transition-colors truncate ${
                      isCream
                        ? 'text-[#0E2F2C] group-hover:text-[#18423D]'
                        : 'text-[#FAF7F2] group-hover:text-white'
                    } ${!item.isAvailable ? 'line-through text-[#8FA6A3]' : ''}`}
                  >
                    {item.name}
                  </h3>

                  {/* Clean Minimal Special Pill Badge */}
                  {isSpecial && (
                    <span
                      className={`inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-headline font-semibold uppercase tracking-[0.12em] border ${
                        isCream
                          ? 'bg-[#EADAC3] border-[#DFC9AA] text-[#0E2F2C]'
                          : 'bg-[#E5CFAF]/10 border-[#E5CFAF]/30 text-[#E5CFAF]'
                      }`}
                    >
                      <Sparkles className={`w-2.5 h-2.5 ${isCream ? 'text-[#0E2F2C]' : 'text-[#E5CFAF]'}`} />
                      {specialLabel}
                    </span>
                  )}
                </div>

                {/* Price Tag & Sleek Chevron */}
                <div className="flex items-center gap-1.5 shrink-0 text-right">
                  <span
                    className={`font-headline text-sm sm:text-base font-bold font-mono tracking-tight whitespace-nowrap ${
                      isMarketPrice
                        ? isCream
                          ? 'text-[#3D524F] text-xs uppercase tracking-wider font-medium'
                          : 'text-[#C5D5D3] text-xs uppercase tracking-wider font-medium'
                        : isCream
                        ? 'text-[#0E2F2C]'
                        : 'text-[#E5CFAF]'
                    }`}
                  >
                    {formatPrice(item.price)}
                  </span>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-300 ${
                      isCream
                        ? isExpanded
                          ? 'rotate-180 text-[#0E2F2C]'
                          : 'text-[#3D524F] group-hover:text-[#0E2F2C]'
                        : isExpanded
                        ? 'rotate-180 text-[#E5CFAF]'
                        : 'text-[#C5D5D3] group-hover:text-white'
                    }`}
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Collapsed Brief Preview */}
              {!isExpanded && item.description && (
                <p
                  className={`font-body text-xs line-clamp-2 mt-2 leading-relaxed ${
                    isCream ? 'text-[#3D524F]' : 'text-[#C5D5D3]'
                  }`}
                >
                  {item.description}
                </p>
              )}

              {/* Quick Add To Tray Bar */}
              {item.isAvailable && !isMarketPrice && onAddToTray && (
                <div
                  className={`mt-3 pt-2.5 border-t border-dashed flex items-center justify-between ${
                    isCream ? 'border-[#DFC9AA]' : 'border-[#1D4D47]/60'
                  }`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className={`text-[11px] font-mono font-bold ${isCream ? 'text-[#0E2F2C]' : 'text-[#E5CFAF]'}`}>
                    {formatPrice(item.price)}
                  </span>

                  {quantityInTray && quantityInTray > 0 ? (
                    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-xl border shadow-sm ${
                      isCream ? 'bg-[#EADAC3] border-[#DFC9AA]' : 'bg-[#0B2523] border-[#1D4D47]'
                    }`}>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity && onUpdateQuantity(item.id, -1)}
                        className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                          isCream
                            ? 'bg-[#DFC9AA] text-[#0E2F2C] hover:bg-[#D4BC9B]'
                            : 'bg-[#133834] text-white hover:bg-[#18423D]'
                        }`}
                        title="Reduce quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>

                      {/* Prominent Red Number Adding Whenever You Add a Dish */}
                      <span className="font-mono text-xs font-black min-w-[20px] px-2 py-0.5 rounded-full bg-red-600 text-white text-center shadow-sm animate-in zoom-in-75">
                        {quantityInTray}
                      </span>

                      <button
                        type="button"
                        onClick={() => onUpdateQuantity && onUpdateQuantity(item.id, 1)}
                        className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors cursor-pointer active:scale-95 ${
                          isCream
                            ? 'bg-[#0E2F2C] text-[#E5CFAF] hover:bg-[#18423D]'
                            : 'bg-[#E5CFAF] text-[#0E2F2C] hover:brightness-110'
                        }`}
                        title="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onAddToTray(item)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-headline text-xs font-extrabold uppercase tracking-wider transition-all shadow-sm active:scale-95 cursor-pointer ${
                        isCream
                          ? 'bg-[#0E2F2C] text-[#E5CFAF] border border-[#164640] hover:bg-[#18423D]'
                          : 'bg-[#E5CFAF] text-[#0E2F2C] hover:brightness-110 shadow-[0_2px_10px_rgba(229,207,175,0.25)]'
                      }`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Order</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Expanded Rich Details */}
        {isExpanded && (
          <div
            className={`mt-4 pt-3.5 border-t animate-in fade-in slide-in-from-top-1 duration-200 ${
              isCream ? 'border-[#DFC9AA]' : 'border-[#1D4D47]'
            }`}
          >
            {item.description && (
              <p
                className={`font-body text-xs sm:text-sm leading-relaxed mb-3 ${
                  isCream ? 'text-[#2D3F3C]' : 'text-[#FAF7F2]/90'
                }`}
              >
                {item.description}
              </p>
            )}

            {/* Tags / Tasting Notes */}
            {item.tags && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {item.tags.split(',').map((tag, i) => (
                  <span
                    key={i}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-headline font-medium uppercase tracking-wider border ${
                      isCream
                        ? 'bg-[#E5CFAF] border-[#DFC9AA] text-[#0E2F2C]'
                        : 'bg-[#0E2F2C] border-[#235750] text-[#E5CFAF]'
                    }`}
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
