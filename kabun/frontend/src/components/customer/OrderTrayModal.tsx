import React, { useState } from 'react';
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Check,
  AlertCircle,
  Coffee,
  Clock,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { MenuItem, CustomerOrder } from '../../types/menu';
import { useCreateOrder } from '../../hooks/useMenu';

export interface TrayItem {
  menuItem: MenuItem;
  quantity: number;
  notes?: string;
}

interface OrderTrayModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableNumber: string;
  tray: TrayItem[];
  onUpdateQuantity: (itemId: string, delta: number) => void;
  onClearTray: () => void;
  onSelectTablePrompt: () => void;
}

export const OrderTrayModal: React.FC<OrderTrayModalProps> = ({
  isOpen,
  onClose,
  tableNumber,
  tray,
  onUpdateQuantity,
  onClearTray,
  onSelectTablePrompt,
}) => {
  const createOrderMutation = useCreateOrder();
  const [customerNotes, setCustomerNotes] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<CustomerOrder | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const totalAmount = tray.reduce(
    (sum, item) => sum + (item.menuItem.price || 0) * item.quantity,
    0
  );
  const totalCount = tray.reduce((sum, item) => sum + item.quantity, 0);

  const handleSendOrder = async () => {
    setErrorMessage(null);

    if (!tableNumber) {
      onSelectTablePrompt();
      return;
    }

    if (tray.length === 0) {
      setErrorMessage('Your roastery tray is currently empty.');
      return;
    }

    try {
      const res = await createOrderMutation.mutateAsync({
        tableNumber,
        customerNotes: customerNotes.trim() || undefined,
        items: tray.map((item) => ({
          menuItemId: item.menuItem.id,
          name: item.menuItem.name,
          price: item.menuItem.price || 0,
          quantity: item.quantity,
          notes: item.notes,
        })),
      });

      setConfirmedOrder(res.data);
      onClearTray();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit order to barista');
    }
  };

  const handleCloseAndReset = () => {
    setConfirmedOrder(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCloseAndReset}
      title={confirmedOrder ? 'Order Confirmed!' : 'Your Roastery Order Tray'}
      subtitle={
        confirmedOrder
          ? `Order #${confirmedOrder.orderNumber} is now brewing for Table ${tableNumber}`
          : `Review selections before sending directly to the cashier and barista bar`
      }
      maxWidth="md"
    >
      {confirmedOrder ? (
        <div className="py-6 text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-emerald-950/80 border-2 border-emerald-500/50 flex items-center justify-center text-emerald-400 mx-auto animate-bounce">
            <Check className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <span className="px-3 py-1 rounded-full bg-[#E5CFAF] text-[#0E2F2C] text-xs font-black uppercase tracking-widest font-headline">
              TICKET {confirmedOrder.orderNumber}
            </span>
            <h3 className="font-headline text-lg sm:text-xl font-bold text-white pt-2">
              Sent to Roastery Barista!
            </h3>
            <p className="text-xs text-[#C5D5D3] max-w-xs mx-auto">
              Your ticket has appeared on the cashier counter. Our baristas will prepare and deliver your items to{' '}
              <strong className="text-white">Table {tableNumber}</strong>.
            </p>
          </div>

          {/* Ticket Summary */}
          <div className="p-4 rounded-2xl bg-[#0B2523] border border-[#1D4D47] text-left space-y-2 text-xs">
            <div className="flex justify-between text-[#A2B8B5] border-b border-[#1D4D47] pb-2 font-mono">
              <span>Table {tableNumber}</span>
              <span>{confirmedOrder.items.length} items</span>
            </div>
            {confirmedOrder.items.map((it, idx) => (
              <div key={idx} className="flex justify-between text-white">
                <span>{it.quantity}x {it.name}</span>
                <span className="font-mono text-[#E5CFAF]">{(it.price * it.quantity).toLocaleString()} ETB</span>
              </div>
            ))}
            <div className="flex justify-between pt-2 border-t border-[#1D4D47] font-bold text-sm text-white">
              <span>Total Amount:</span>
              <span className="font-mono text-[#E5CFAF]">{confirmedOrder.totalAmount.toLocaleString()} ETB</span>
            </div>
          </div>

          <Button
            variant="yellow"
            onClick={handleCloseAndReset}
            className="w-full font-bold text-xs"
          >
            Back to Roastery Menu
          </Button>
        </div>
      ) : tray.length === 0 ? (
        <div className="py-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#0B2523] border border-[#1D4D47] flex items-center justify-center text-[#E5CFAF] mx-auto">
            <ShoppingBag className="w-6 h-6 opacity-60" />
          </div>
          <h4 className="font-headline text-sm font-bold text-white uppercase tracking-wider">
            Your tray is empty
          </h4>
          <p className="text-xs text-[#C5D5D3] max-w-xs mx-auto">
            Browse our single-origin coffees, cold brews, and fresh viennoiserie, then tap <strong>"+ Add"</strong> to build your order!
          </p>
          <Button variant="secondary" onClick={onClose} className="mt-2 text-xs">
            Explore Menu
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {errorMessage && (
            <div className="p-3 bg-red-950/40 border border-red-500/30 rounded-xl text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Table Indicator Banner */}
          <div className="p-3 rounded-xl bg-[#0B2523] border border-[#1D4D47] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-headline text-xs uppercase tracking-wider text-white font-bold">
                Seated at: <span className="text-[#E5CFAF]">Table {tableNumber || '(Not Set)'}</span>
              </span>
            </div>
            <button
              type="button"
              onClick={onSelectTablePrompt}
              className="text-[11px] font-headline uppercase font-bold text-[#E5CFAF] hover:underline"
            >
              Change Table
            </button>
          </div>

          {/* Items List */}
          <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
            {tray.map((item) => (
              <div
                key={item.menuItem.id}
                className="bg-[#0B2523] border border-[#1D4D47] rounded-xl p-3 flex items-center justify-between gap-3"
              >
                <div className="space-y-0.5 flex-1 min-w-0">
                  <h5 className="font-headline text-xs font-bold text-white truncate">
                    {item.menuItem.name}
                  </h5>
                  <span className="font-mono text-xs text-[#E5CFAF]">
                    {((item.menuItem.price || 0) * item.quantity).toLocaleString()} ETB
                  </span>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onUpdateQuantity(item.menuItem.id, -1)}
                    className="w-7 h-7 rounded-lg bg-[#133834] border border-[#1D4D47] text-white flex items-center justify-center hover:bg-[#18423D] transition-colors"
                  >
                    {item.quantity === 1 ? <Trash2 className="w-3 h-3 text-red-400" /> : <Minus className="w-3 h-3" />}
                  </button>

                  <span className="font-mono text-xs font-bold text-white w-4 text-center">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => onUpdateQuantity(item.menuItem.id, 1)}
                    className="w-7 h-7 rounded-lg bg-[#133834] border border-[#1D4D47] text-white flex items-center justify-center hover:bg-[#18423D] transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Customer Special Requests */}
          <div className="space-y-1">
            <label className="font-headline text-xs uppercase tracking-wider text-[#FAF7F2] font-bold block">
              Special Roastery Instructions:
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Oat milk, extra hot, sugar separate, or ice on the side"
              value={customerNotes}
              onChange={(e) => setCustomerNotes(e.target.value)}
              className="w-full bg-[#0B2523] border border-[#1D4D47] rounded-xl px-3.5 py-2 text-xs text-white placeholder-[#71717A] focus:border-[#E5CFAF] outline-none resize-none"
            />
          </div>

          {/* Pricing & CTA */}
          <div className="pt-3 border-t border-[#1D4D47] space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-headline text-xs uppercase tracking-wider text-[#C5D5D3] font-bold">
                Order Total ({totalCount} items)
              </span>
              <span className="font-headline text-lg font-black font-mono text-white">
                {totalAmount.toLocaleString()} <span className="text-xs font-normal text-[#E5CFAF]">ETB</span>
              </span>
            </div>

            <Button
              variant="yellow"
              onClick={handleSendOrder}
              isLoading={createOrderMutation.isPending}
              rightIcon={<ArrowRight className="w-4 h-4 text-[#0E2F2C]" />}
              className="w-full font-black text-xs uppercase tracking-wider py-3"
            >
              Send Order to Roastery Bar (Table {tableNumber})
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
