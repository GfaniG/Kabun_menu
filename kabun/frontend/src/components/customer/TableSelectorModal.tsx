import React from 'react';
import { Layers, Check, X } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { useTables } from '../../hooks/useMenu';
import { Button } from '../ui/Button';

interface TableSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTable: string;
  onSelectTable: (tableNum: string) => void;
}

export const TableSelectorModal: React.FC<TableSelectorModalProps> = ({
  isOpen,
  onClose,
  activeTable,
  onSelectTable,
}) => {
  const { data: tables = [] } = useTables();

  const handleSelect = (num: string) => {
    onSelectTable(num);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Select Your Dining Table"
      subtitle="Orders and barista assistance will be delivered directly to your selected table"
      maxWidth="sm"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 max-h-[320px] overflow-y-auto p-1">
          {tables.map((t) => {
            const isSelected = activeTable === t.tableNumber;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => handleSelect(t.tableNumber)}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all ${
                  isSelected
                    ? 'bg-[#E5CFAF] text-[#0E2F2C] border-[#E5CFAF] font-black shadow-[0_0_15px_rgba(229,207,175,0.4)] scale-105'
                    : 'bg-[#0B2523] text-white border-[#1D4D47] hover:border-[#E5CFAF]/50 hover:bg-[#133834]'
                }`}
              >
                <span className="font-headline text-base sm:text-lg font-black tracking-tight">
                  {t.tableNumber}
                </span>
                <span className="text-[9px] uppercase tracking-wider opacity-80 font-medium">
                  {isSelected ? 'Seated' : `${t.capacity} seats`}
                </span>
              </button>
            );
          })}
        </div>

        <div className="pt-2 border-t border-[#1D4D47] flex justify-end">
          <Button variant="secondary" onClick={onClose} className="text-xs">
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
