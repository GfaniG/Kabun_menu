import React from 'react';
import { useTheme } from '../../context/ThemeContext';

export interface KabunLogoProps {
  /**
   * 'full': Centered emblem with Ge'ez text (ካቡን), KABUN COFFEE + ROASTERY, and "crafted from coffee."
   * 'wide': Horizontal lockup for navigation bars (emblem on left, typography on right)
   * 'emblem': Standalone circular coffee bean & finjal emblem
   */
  variant?: 'full' | 'wide' | 'emblem';
  className?: string;
  glow?: boolean;
  alt?: string;
  lightMode?: boolean;
}

export const KabunLogo: React.FC<KabunLogoProps> = ({
  variant = 'full',
  className = '',
  glow = true,
  alt = "Kabun Coffee + Roastery (ካቡን)",
  lightMode = false,
}) => {
  const { theme } = useTheme();
  const isCream = lightMode || theme === 'cream';

  const emblemSrc = '/assets/kabun/kabun-emblem-dark.png';

  if (variant === 'emblem') {
    return (
      <div className={`relative inline-flex items-center justify-center select-none ${className}`}>
        {glow && !isCream && (
          <div
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(229,207,175,0.25)_0%,transparent_70%)] blur-xl pointer-events-none scale-125"
            aria-hidden="true"
          />
        )}
        <img
          src={emblemSrc}
          alt={alt}
          className="relative z-10 w-12 h-12 sm:w-14 sm:h-14 object-contain rounded-full drop-shadow-[0_8px_24px_rgba(0,0,0,0.6)]"
          loading="eager"
        />
      </div>
    );
  }

  if (variant === 'wide') {
    return (
      <div className={`relative inline-flex items-center gap-3 select-none ${className}`}>
        {glow && (
          <div
            className="absolute -left-2 top-0 bottom-0 w-16 bg-[radial-gradient(circle_at_center,rgba(229,207,175,0.2)_0%,transparent_70%)] blur-lg pointer-events-none"
            aria-hidden="true"
          />
        )}
        <img
          src={emblemSrc}
          alt={alt}
          className="relative z-10 w-10 h-10 sm:w-11 sm:h-11 object-contain rounded-full drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]"
          loading="eager"
        />
        <div className="flex flex-col text-left">
          <div className="flex items-baseline gap-1.5">
            <span className="font-headline font-black text-lg sm:text-xl text-[#FAF7F2] tracking-wider leading-none">
              ካቡን
            </span>
            <span className="font-headline font-bold text-xs sm:text-sm text-[#E5CFAF] tracking-[0.18em] uppercase leading-none">
              KABUN
            </span>
          </div>
          <span className="font-headline text-[9px] sm:text-[10px] text-[#C5D5D3] tracking-[0.22em] uppercase font-semibold leading-tight mt-0.5">
            COFFEE + ROASTERY
          </span>
        </div>
      </div>
    );
  }

  // 'full' variant
  return (
    <div className={`relative inline-flex flex-col items-center justify-center select-none text-center ${className}`}>
      {glow && !isCream && (
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(229,207,175,0.22)_0%,rgba(14,47,44,0.4)_50%,transparent_75%)] blur-2xl pointer-events-none scale-150"
          aria-hidden="true"
        />
      )}

      {/* Circular Emblem */}
      <div className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mb-3">
        <img
          src={emblemSrc}
          alt={alt}
          className={`w-full h-full object-contain rounded-full transition-transform duration-300 hover:scale-105 ${
            isCream
              ? 'drop-shadow-[0_8px_20px_rgba(14,47,44,0.2)]'
              : 'drop-shadow-[0_12px_32px_rgba(0,0,0,0.85)] drop-shadow-[0_0_20px_rgba(229,207,175,0.3)]'
          }`}
          loading="eager"
        />
      </div>

      {/* Ge'ez Script: ካቡን */}
      <h2
        className={`relative z-10 font-headline font-black text-3xl sm:text-4xl tracking-wider leading-none transition-colors duration-200 ${
          isCream
            ? 'text-[#0E2F2C]'
            : 'text-[#FAF7F2] drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]'
        }`}
      >
        ካቡን
      </h2>

      {/* English Title: COFFEE + ROASTERY -> Green Teal in Cream mode */}
      <div
        className={`relative z-10 font-headline font-extrabold text-sm sm:text-base tracking-[0.3em] uppercase mt-1 leading-none transition-colors duration-200 ${
          isCream
            ? 'text-[#0E2F2C]'
            : 'text-[#E5CFAF]'
        }`}
      >
        COFFEE + ROASTERY
      </div>

      {/* Tagline: crafted from coffee. -> Pure Black in Cream mode */}
      <div
        className={`relative z-10 font-headline text-[11px] sm:text-xs tracking-[0.25em] lowercase italic mt-2 font-semibold transition-colors duration-200 ${
          isCream
            ? 'text-black'
            : 'text-[#C5D5D3] font-medium'
        }`}
      >
        crafted from coffee.
      </div>
    </div>
  );
};
