import React from 'react';
import {
  BookOpen,
  Printer,
  DollarSign,
  Eye,
  Bell,
  QrCode,
  Sparkles,
  Layers,
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface ManagerGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ManagerGuideModal: React.FC<ManagerGuideModalProps> = ({ isOpen, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#E5CFAF]" />
          <span>Kabun Coffee + Roastery &bull; 1-Page Manager Operations Guide</span>
        </div>
      }
      subtitle="Quick reference cheatsheet for daily coffee shop & roastery operations & menu updates"
      maxWidth="xl"
    >
      <div className="space-y-6 print:text-black">
        {/* Printable Card Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1D4D47]">
          <div>
            <h3 className="font-headline text-lg font-bold text-white">
              Roastery Manager Cheatsheet
            </h3>
            <p className="text-xs text-[#C5D5D3]">
              Essential daily tasks &amp; instant live updates
            </p>
          </div>

          <Button
            variant="yellow"
            size="sm"
            onClick={handlePrint}
            leftIcon={<Printer className="w-4 h-4 text-[#0E2F2C]" />}
          >
            Print Cheatsheet
          </Button>
        </div>

        {/* 6 Step Quick Reference Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Step 1: Instant Price Changes */}
          <div className="p-4 rounded-xl bg-[#0B2523] border border-[#1D4D47] space-y-2">
            <div className="flex items-center gap-2 text-[#E5CFAF] font-headline font-bold uppercase tracking-wider">
              <DollarSign className="w-4 h-4" />
              <span>1. Change a Price in 5 Seconds</span>
            </div>
            <p className="text-[#C5D5D3] leading-relaxed">
              Go to <strong className="text-white">Menu Items &amp; Live Pricing</strong>. Click the cream price number next to any drink or bite, enter the new price (ETB), and hit the checkmark. It reflects on all customer screens within 3 seconds.
            </p>
          </div>

          {/* Step 2: Mark Out of Stock */}
          <div className="p-4 rounded-xl bg-[#0B2523] border border-[#1D4D47] space-y-2">
            <div className="flex items-center gap-2 text-[#348B82] font-headline font-bold uppercase tracking-wider">
              <Eye className="w-4 h-4" />
              <span>2. Sold Out / Pause Item</span>
            </div>
            <p className="text-[#C5D5D3] leading-relaxed">
              When the barista runs out of specific beans, milk, or bakery items, click the <strong className="text-white">Eye icon</strong> under &ldquo;Menu Visibility&rdquo;. The item is instantly hidden. Tap again to restore when restocked.
            </p>
          </div>

          {/* Step 3: Cashier & Waiter Calls */}
          <div className="p-4 rounded-xl bg-[#0B2523] border border-[#1D4D47] space-y-2">
            <div className="flex items-center gap-2 text-[#E5CFAF] font-headline font-bold uppercase tracking-wider">
              <Bell className="w-4 h-4" />
              <span>3. Live Cashier &amp; Waiter Calls</span>
            </div>
            <p className="text-[#C5D5D3] leading-relaxed">
              Open the <strong className="text-white">Cashier &amp; Orders</strong> tab on the cashier desktop. When customers order or ring the bell for a waiter, an audio counter chime rings automatically. Click order status buttons to advance from Pending &rarr; Preparing &rarr; Served.
            </p>
          </div>

          {/* Step 4: Table QR ID Cards */}
          <div className="p-4 rounded-xl bg-[#0B2523] border border-[#1D4D47] space-y-2">
            <div className="flex items-center gap-2 text-[#348B82] font-headline font-bold uppercase tracking-wider">
              <QrCode className="w-4 h-4" />
              <span>4. Table QR ID Cards (CR80 85.6 &times; 54mm)</span>
            </div>
            <p className="text-[#C5D5D3] leading-relaxed">
              In <strong className="text-white">Tables &amp; QR</strong>, click <strong className="text-white">&ldquo;Print All 15 ID Cards&rdquo;</strong> to print standard ID card size badges on A4 sheets with dashed scissor-cut guides, or click any table to download high-res PNGs for PVC card printers. Click <strong className="text-white">&ldquo;+ Add Table&rdquo;</strong> to create more tables at any time.
            </p>
          </div>

          {/* Step 5: Customize Roastery Story */}
          <div className="p-4 rounded-xl bg-[#0B2523] border border-[#1D4D47] space-y-2">
            <div className="flex items-center gap-2 text-[#E5CFAF] font-headline font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>5. Customize Roastery Craft &amp; Story</span>
            </div>
            <p className="text-[#C5D5D3] leading-relaxed">
              Update your coffee manifesto, single-origin highlights, phone numbers, and social links in <strong className="text-white">Live CMS</strong>. If you ever make a mistake, use <strong className="text-white">&ldquo;Restore to Default&rdquo;</strong>.
            </p>
          </div>

          {/* Step 6: Organize Categories */}
          <div className="p-4 rounded-xl bg-[#0B2523] border border-[#1D4D47] space-y-2">
            <div className="flex items-center gap-2 text-[#348B82] font-headline font-bold uppercase tracking-wider">
              <Layers className="w-4 h-4" />
              <span>6. Organize Coffee vs Bakery</span>
            </div>
            <p className="text-[#C5D5D3] leading-relaxed">
              In <strong className="text-white">Categories Manager</strong>, drag and drop to reorder sections. Toggle between <strong className="text-white">COFFEE &amp; BEVERAGES</strong> and <strong className="text-white">BAKERY &amp; BITES</strong>.
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};
