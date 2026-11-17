import React from 'react';
import {
  BookOpen,
  Printer,
  DollarSign,
  Eye,
  Wifi,
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

          {/* Step 3: Wi-Fi Password Update */}
          <div className="p-4 rounded-xl bg-[#0B2523] border border-[#1D4D47] space-y-2">
            <div className="flex items-center gap-2 text-[#E5CFAF] font-headline font-bold uppercase tracking-wider">
              <Wifi className="w-4 h-4" />
              <span>3. Change Guest Wi-Fi Password</span>
            </div>
            <p className="text-[#C5D5D3] leading-relaxed">
              Click <strong className="text-white">Customize Menu &amp; Live CMS</strong> &rarr; <strong className="text-white">Guest Wi-Fi</strong> tab. Type your new network name or password and click &ldquo;Save Live Changes&rdquo;.
            </p>
          </div>

          {/* Step 4: Table QR Codes */}
          <div className="p-4 rounded-xl bg-[#0B2523] border border-[#1D4D47] space-y-2">
            <div className="flex items-center gap-2 text-[#348B82] font-headline font-bold uppercase tracking-wider">
              <QrCode className="w-4 h-4" />
              <span>4. Master Table QR Acrylic Stand</span>
            </div>
            <p className="text-[#C5D5D3] leading-relaxed">
              Click the gold <strong className="text-white">&ldquo;Master QR&rdquo;</strong> button in the top navigation. You can print the 4x6&quot; acrylic table tent directly or download the high-res PNG for professional printing.
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
