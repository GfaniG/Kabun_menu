import React, { useState } from 'react';
import {
  LogOut,
  ExternalLink,
  QrCode,
  Shield,
  KeyRound,
  BookOpen,
  Menu as MenuIcon,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { TableQRModal } from './TableQRModal';
import { AccountSecurityModal } from './AccountSecurityModal';
import { ManagerGuideModal } from './ManagerGuideModal';
import { KabunLogo } from '../common/KabunLogo';

export const AdminHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#0E2F2C]/95 backdrop-blur-xl border-b border-[#1D4D47] px-3 sm:px-6 py-2.5 sm:py-3 shadow-[0_10px_32px_rgba(0,0,0,0.6)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          {/* Left: Brand / Title */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link to="/admin" className="flex items-center gap-2 group" title="Kabun Coffee + Roastery - Menu Manager">
              <KabunLogo variant="wide" glow={false} className="h-8 sm:h-10 w-auto group-hover:scale-105 transition-transform" />
              <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-[#1D4D47]">
                <span className="px-2.5 py-0.5 rounded-full bg-[#133834] border border-[#1D4D47] font-headline text-[10px] text-[#E5CFAF] uppercase tracking-widest font-extrabold">
                  Roastery Manager
                </span>
              </div>
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Desktop Only: Manager Operations Guide */}
            <button
              onClick={() => setIsGuideModalOpen(true)}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-headline font-bold uppercase tracking-wider rounded-xl bg-[#133834] hover:bg-[#18423D] text-[#FAF7F2] hover:text-[#E5CFAF] border border-[#1D4D47] transition-all cursor-pointer"
              title="1-Page Operations Cheatsheet"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#E5CFAF]" />
              <span>Manager Guide</span>
            </button>

            {/* Generate Table QR Stand Button (Always available) */}
            <button
              onClick={() => setIsQRModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-2 text-xs font-headline font-bold uppercase tracking-wider rounded-xl bg-[#E5CFAF] text-[#0E2F2C] hover:brightness-110 shadow-[0_0_15px_rgba(229,207,175,0.35)] transition-all cursor-pointer"
              title="Generate and Print Master Table QR Code"
            >
              <QrCode className="w-4 h-4 text-[#0E2F2C]" />
              <span>Master QR</span>
            </button>

            {/* Desktop Only: View Menu Link */}
            <Link
              to="/"
              target="_blank"
              className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-headline font-semibold uppercase tracking-wider rounded-xl bg-[#133834] hover:bg-[#18423D] text-[#FAF7F2] border border-[#1D4D47] hover:border-[#E5CFAF] transition-all"
              title="Open Customer Menu View"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#C5D5D3]" />
              <span>View Menu</span>
            </Link>

            {/* Desktop Only: Admin User / Security */}
            <button
              onClick={() => setIsSecurityModalOpen(true)}
              className="hidden md:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#133834] hover:bg-[#18423D] border border-[#1D4D47] hover:border-[#E5CFAF]/40 text-left transition-all cursor-pointer group"
              title="Change Admin Email & Password"
            >
              <div className="w-7 h-7 rounded-full bg-[#0E2F2C] group-hover:bg-[#E5CFAF] group-hover:text-[#0E2F2C] flex items-center justify-center text-[#E5CFAF] transition-colors">
                <Shield className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="font-headline text-xs font-bold text-white block leading-tight">
                    {user?.name || 'Manager'}
                  </span>
                  <KeyRound className="w-2.5 h-2.5 text-[#C5D5D3] group-hover:text-[#E5CFAF]" />
                </div>
                <span className="text-[10px] text-[#C5D5D3] block leading-tight font-mono">
                  {user?.email || 'admin@kabuncoffee.com'}
                </span>
              </div>
            </button>

            {/* Desktop Only: Logout Button */}
            <button
              onClick={logout}
              className="hidden md:flex px-3 py-2 text-xs font-headline font-semibold uppercase tracking-wider rounded-xl bg-[#133834] hover:bg-[#18423D] text-[#C5D5D3] hover:text-white border border-[#1D4D47] hover:border-[#E5CFAF]/30 transition-colors items-center gap-1.5 cursor-pointer"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>

            {/* Mobile Actions Drawer Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-[#133834] border border-[#1D4D47] text-white hover:bg-[#18423D] transition-colors"
              aria-label="Toggle manager actions menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-[#E5CFAF]" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Panel */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-[#1D4D47] space-y-2 animate-in fade-in slide-in-from-top-2">
            <button
              onClick={() => {
                setIsGuideModalOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-[#133834] border border-[#1D4D47] text-white font-headline text-xs font-bold uppercase tracking-wider text-left"
            >
              <BookOpen className="w-4 h-4 text-[#E5CFAF]" />
              <span>Manager Operations Guide</span>
            </button>

            <Link
              to="/"
              target="_blank"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-[#133834] border border-[#1D4D47] text-white font-headline text-xs font-bold uppercase tracking-wider text-left"
            >
              <ExternalLink className="w-4 h-4 text-[#C5D5D3]" />
              <span>View Customer Menu</span>
            </Link>

            <button
              onClick={() => {
                setIsSecurityModalOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#133834] border border-[#1D4D47] text-white text-left"
            >
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-[#E5CFAF]" />
                <div>
                  <div className="font-headline text-xs font-bold uppercase tracking-wider">
                    {user?.name || 'Manager'}
                  </div>
                  <div className="text-[10px] text-[#C5D5D3] font-mono">
                    {user?.email || 'admin@kabuncoffee.com'}
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-headline uppercase font-bold text-[#E5CFAF] px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                Change Password
              </span>
            </button>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                logout();
              }}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-red-950/20 border border-red-500/30 text-red-400 font-headline text-xs font-bold uppercase tracking-wider text-left"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out of Dashboard</span>
            </button>
          </div>
        )}
      </header>

      {/* Table QR Modal */}
      <TableQRModal isOpen={isQRModalOpen} onClose={() => setIsQRModalOpen(false)} />

      {/* Account Security Modal (Change Email & Password) */}
      <AccountSecurityModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
      />

      {/* Manager Operations Guide Modal */}
      <ManagerGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />
    </>
  );
};
