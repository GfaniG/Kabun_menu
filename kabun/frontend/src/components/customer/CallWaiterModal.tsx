import React, { useState } from 'react';
import {
  Bell,
  Receipt,
  Droplets,
  Check,
  AlertCircle,
  X,
  CreditCard,
  Banknote,
  Send,
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useCreateServiceRequest } from '../../hooks/useMenu';
import { toFriendlyErrorMessage } from '../../utils/friendlyErrors';

interface CallWaiterModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableNumber: string;
}

export const CallWaiterModal: React.FC<CallWaiterModalProps> = ({
  isOpen,
  onClose,
  tableNumber,
}) => {
  const createRequestMutation = useCreateServiceRequest();

  const [requestType, setRequestType] = useState<'CALL_WAITER' | 'REQUEST_BILL' | 'WATER_REFILL'>('CALL_WAITER');
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Telebirr' | 'CBE / Bank' | 'Card'>('Telebirr');
  const [notes, setNotes] = useState('');
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!tableNumber) {
      setErrorMessage('Please select or verify your table number before calling.');
      return;
    }

    try {
      const res = await createRequestMutation.mutateAsync({
        tableNumber,
        type: requestType,
        paymentMethod: requestType === 'REQUEST_BILL' ? paymentMethod : undefined,
        notes: notes.trim() || undefined,
      });

      setSubmittedMessage(res.message);
      setNotes('');

      setTimeout(() => {
        setSubmittedMessage(null);
        onClose();
      }, 2500);
    } catch (err: any) {
      setErrorMessage(
        toFriendlyErrorMessage(
          err,
          "We couldn't notify the barista right now. Please try calling again in a moment."
        )
      );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Call Barista & Waiter Assistance"
      subtitle={`Instant service request dispatched directly to the cashier desktop for Table ${tableNumber || '?'}`}
      maxWidth="sm"
    >
      {submittedMessage ? (
        <div className="py-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-950/80 border-2 border-emerald-500/50 flex items-center justify-center text-emerald-400 mx-auto animate-bounce">
            <Check className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h4 className="font-headline text-lg font-bold text-white uppercase tracking-wider">
              Barista Notified!
            </h4>
            <p className="text-xs text-[#C5D5D3] max-w-xs mx-auto">
              {submittedMessage}
            </p>
          </div>
          <span className="inline-block px-3 py-1 rounded-full bg-[#133834] border border-[#1D4D47] text-[11px] font-mono text-[#E5CFAF]">
            Table {tableNumber} &bull; Alert dispatched
          </span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMessage && (
            <div className="p-3 bg-red-950/40 border border-red-500/30 rounded-xl text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Quick Service Type Pills */}
          <div className="space-y-2">
            <label className="font-headline text-xs uppercase tracking-wider text-[#FAF7F2] font-bold block">
              How can we assist you?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setRequestType('CALL_WAITER')}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                  requestType === 'CALL_WAITER'
                    ? 'bg-[#E5CFAF] text-[#0E2F2C] border-[#E5CFAF] shadow-[0_0_15px_rgba(229,207,175,0.3)] font-bold'
                    : 'bg-[#0B2523] text-[#C5D5D3] border-[#1D4D47] hover:text-white'
                }`}
              >
                <Bell className="w-5 h-5" />
                <span className="text-[11px] font-headline uppercase tracking-wider">Call Staff</span>
              </button>

              <button
                type="button"
                onClick={() => setRequestType('WATER_REFILL')}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                  requestType === 'WATER_REFILL'
                    ? 'bg-[#E5CFAF] text-[#0E2F2C] border-[#E5CFAF] shadow-[0_0_15px_rgba(229,207,175,0.3)] font-bold'
                    : 'bg-[#0B2523] text-[#C5D5D3] border-[#1D4D47] hover:text-white'
                }`}
              >
                <Droplets className="w-5 h-5 text-cyan-400" />
                <span className="text-[11px] font-headline uppercase tracking-wider">Water Refill</span>
              </button>

              <button
                type="button"
                onClick={() => setRequestType('REQUEST_BILL')}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                  requestType === 'REQUEST_BILL'
                    ? 'bg-[#E5CFAF] text-[#0E2F2C] border-[#E5CFAF] shadow-[0_0_15px_rgba(229,207,175,0.3)] font-bold'
                    : 'bg-[#0B2523] text-[#C5D5D3] border-[#1D4D47] hover:text-white'
                }`}
              >
                <Receipt className="w-5 h-5 text-amber-400" />
                <span className="text-[11px] font-headline uppercase tracking-wider">Request Bill</span>
              </button>
            </div>
          </div>

          {/* Payment Method Selector if Requesting Bill */}
          {requestType === 'REQUEST_BILL' && (
            <div className="space-y-2 p-3 rounded-xl bg-[#0B2523] border border-[#1D4D47]">
              <label className="font-headline text-[11px] uppercase tracking-wider text-[#E5CFAF] font-bold block">
                Preferred Payment Method:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {(['Telebirr', 'CBE / Bank', 'Cash', 'Card'] as const).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-headline font-bold transition-all border ${
                      paymentMethod === method
                        ? 'bg-[#E5CFAF] text-[#0E2F2C] border-[#E5CFAF]'
                        : 'bg-[#133834] text-[#C5D5D3] border-[#1D4D47]'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Optional Message */}
          <div className="space-y-1">
            <label className="font-headline text-xs uppercase tracking-wider text-[#FAF7F2] font-bold block">
              Optional Note for Staff:
            </label>
            <input
              type="text"
              placeholder="e.g. Need sugar, extra cup, or clean table"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#0B2523] border border-[#1D4D47] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#71717A] focus:border-[#E5CFAF] outline-none"
            />
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#1D4D47]">
            <Button variant="secondary" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="yellow"
              type="submit"
              isLoading={createRequestMutation.isPending}
              leftIcon={<Send className="w-3.5 h-3.5 text-[#0E2F2C]" />}
              className="font-bold text-xs"
            >
              Ring Bell at Cashier
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
