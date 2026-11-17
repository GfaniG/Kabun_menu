import React from 'react';
import {
  TrendingUp,
  QrCode,
  Eye,
  Coffee,
  Sparkles,
  ArrowUpRight,
  Flame,
} from 'lucide-react';
import { useAnalyticsSummary } from '../../hooks/useMenu';

export const AnalyticsDashboard: React.FC = () => {
  const { data: analytics, isLoading } = useAnalyticsSummary();

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-[#E5CFAF] animate-spin" />
        <p className="font-headline text-xs uppercase tracking-widest text-[#A1A1AA]">
          Loading Analytics...
        </p>
      </div>
    );
  }

  const totalPageViews = analytics?.totalPageViews || 0;
  const totalTableScans = analytics?.totalTableScans || 0;
  const totalDishViews = analytics?.totalDishViews || 0;
  const topDishes = analytics?.topDishes || [];
  const topTables = analytics?.topTables || [];

  const maxDishViews = Math.max(...topDishes.map((d) => d.viewsCount), 1);

  return (
    <div className="space-y-6">
      {/* Analytics KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total QR Scans */}
        <div className="bg-[#121212] border border-[#222222] rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
          <div className="flex items-center justify-between mb-3">
            <span className="font-headline text-[11px] uppercase tracking-wider text-[#A1A1AA] font-bold">
              Total Table QR Scans
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#E5CFAF]/10 text-[#E5CFAF] flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-headline text-3xl font-bold font-mono text-white">
              {totalTableScans}
            </span>
            <span className="text-xs text-green-400 font-bold flex items-center">
              <ArrowUpRight className="w-3 h-3" /> Live
            </span>
          </div>
          <p className="text-[11px] text-[#71717A] mt-1">
            Physical QR codes scanned at café tables
          </p>
        </div>

        {/* Total Menu Views */}
        <div className="bg-[#121212] border border-[#222222] rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
          <div className="flex items-center justify-between mb-3">
            <span className="font-headline text-[11px] uppercase tracking-wider text-[#A1A1AA] font-bold">
              Total Menu Impressions
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#16B9E8]/10 text-[#16B9E8] flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-headline text-3xl font-bold font-mono text-white">
              {totalPageViews}
            </span>
            <span className="text-xs text-green-400 font-bold flex items-center">
              <ArrowUpRight className="w-3 h-3" /> Live
            </span>
          </div>
          <p className="text-[11px] text-[#71717A] mt-1">
            Digital menu page loads across all sessions
          </p>
        </div>

        {/* Total Dish Interactions */}
        <div className="bg-[#121212] border border-[#222222] rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
          <div className="flex items-center justify-between mb-3">
            <span className="font-headline text-[11px] uppercase tracking-wider text-[#A1A1AA] font-bold">
              Drink &amp; Bite Taps
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#E5CFAF]/10 text-[#E5CFAF] flex items-center justify-center">
              <Coffee className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-headline text-3xl font-bold font-mono text-white">
              {totalDishViews}
            </span>
            <span className="text-xs text-[#E5CFAF] font-bold">
              High Interest
            </span>
          </div>
          <p className="text-[11px] text-[#71717A] mt-1">
            Guests expanded item cards to view coffee &amp; pastry details
          </p>
        </div>

        {/* Guest Engagement Rate */}
        <div className="bg-[#121212] border border-[#222222] rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
          <div className="flex items-center justify-between mb-3">
            <span className="font-headline text-[11px] uppercase tracking-wider text-[#A1A1AA] font-bold">
              Avg Items per Visit
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-headline text-3xl font-bold font-mono text-white">
              {totalPageViews > 0 ? (totalDishViews / totalPageViews).toFixed(1) : '0'}
            </span>
            <span className="text-xs text-emerald-400 font-bold">
              Items / scan
            </span>
          </div>
          <p className="text-[11px] text-[#71717A] mt-1">
            Guest exploration depth per coffee shop visit
          </p>
        </div>
      </div>

      {/* Main Grid: Most Popular Items + Official QR Stand */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Top Viewed Items (8 Cols) */}
        <div className="lg:col-span-8 bg-[#121212] border border-[#222222] rounded-2xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.6)] space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-[#222222]">
            <div>
              <h3 className="font-headline text-lg font-bold text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-[#E5CFAF]" />
                <span>Top Most Popular Coffee &amp; Bites</span>
              </h3>
              <p className="text-xs text-[#A1A1AA] mt-0.5">
                Real customer interest based on card expansions &amp; photo views
              </p>
            </div>
            <span className="text-[11px] px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white font-headline font-bold uppercase tracking-wider">
              Live Ranking
            </span>
          </div>

          <div className="space-y-4">
            {topDishes.map((dish, index) => {
              const percentage = Math.round((dish.viewsCount / maxDishViews) * 100);

              return (
                <div
                  key={dish.id}
                  className="p-3.5 rounded-xl bg-[#0a0a0a] border border-[#222222] hover:border-[#333333] transition-all space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Rank badge */}
                      <span className="w-6 h-6 rounded-full bg-[#181818] border border-[#262626] flex items-center justify-center font-headline text-xs font-bold text-white shrink-0">
                        #{index + 1}
                      </span>

                      {/* Thumbnail if present */}
                      {dish.image && (
                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-[#222222] shrink-0 bg-[#141414]">
                          <img
                            src={dish.image}
                            alt={dish.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <div className="min-w-0">
                        <p className="font-headline text-sm font-bold text-white truncate">
                          {dish.name}
                        </p>
                        <p className="text-[11px] text-[#A1A1AA]">
                          {dish.category?.name} &bull; {dish.price ? `${dish.price} ETB` : 'Market Price'}
                        </p>
                      </div>
                    </div>

                    {/* Views Count */}
                    <div className="text-right shrink-0">
                      <span className="font-headline text-base font-bold text-[#E5CFAF] font-mono">
                        {dish.viewsCount}
                      </span>
                      <span className="text-[10px] text-[#71717A] uppercase font-headline font-bold block">
                        Views
                      </span>
                    </div>
                  </div>

                  {/* Visual popularity progress bar */}
                  <div className="w-full bg-[#181818] rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#E5CFAF] to-[#C59B63] h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(percentage, 8)}%` }}
                    />
                  </div>
                </div>
              );
            })}

            {topDishes.length === 0 && (
              <div className="py-12 text-center text-[#A1A1AA] text-xs">
                Views are automatically tracked as customers browse the digital menu.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Unified Official QR Stand (4 Cols) */}
        <div className="lg:col-span-4 bg-[#121212] border border-[#222222] rounded-2xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.6)] space-y-5">
          <div className="pb-4 border-b border-[#222222]">
            <h3 className="font-headline text-base font-bold text-white flex items-center gap-2">
              <QrCode className="w-4 h-4 text-[#E5CFAF]" />
              <span>Official Roastery QR Stand</span>
            </h3>
            <p className="text-xs text-[#A1A1AA] mt-0.5">
              One unified QR code for all tables
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0a0a0a] border border-[#222222] space-y-3 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#E5CFAF]/10 text-[#E5CFAF] flex items-center justify-center mx-auto">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <p className="font-headline text-sm font-bold text-white">
                One Code &bull; Unified Scans
              </p>
              <p className="text-xs text-[#A1A1AA] mt-1 leading-relaxed">
                Print the 4x6" acrylic table tent for your café &amp; roastery tables. All guest scans are counted in real time.
              </p>
            </div>
          </div>

          {/* Business Pitch Tip for Roastery Manager */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 text-xs text-[#d4d4d8]">
            <p className="font-headline font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#E5CFAF]" />
              <span>Barista &amp; Manager Tip</span>
            </p>
            <p className="text-[#A1A1AA] text-[11px] leading-relaxed">
              Beverages and pastries with high views are prime candidates for morning combo specials or barista prep prioritization during peak hours!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

