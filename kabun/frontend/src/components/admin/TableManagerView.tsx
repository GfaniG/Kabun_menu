import React, { useState } from 'react';
import {
  QrCode,
  Plus,
  Printer,
  Users,
  Copy,
  Check,
  ExternalLink,
  Edit2,
  Trash2,
  Layers,
  UtensilsCrossed,
  CheckCircle,
} from 'lucide-react';
import {
  useTables,
  useCreateTable,
  useUpdateTable,
  useDeleteTable,
} from '../../hooks/useMenu';
import { DiningTable } from '../../types/menu';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { TableQRModal } from './TableQRModal';

export const TableManagerView: React.FC = () => {
  const { data: tables = [], isLoading } = useTables();
  const createTableMutation = useCreateTable();
  const updateTableMutation = useUpdateTable();
  const deleteTableMutation = useDeleteTable();

  // Add / Edit Table Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<DiningTable | null>(null);
  const [tableNumber, setTableNumber] = useState('');
  const [label, setLabel] = useState('');
  const [capacity, setCapacity] = useState('4');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // QR Stand Modal state
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [selectedTableForQR, setSelectedTableForQR] = useState<string | null>(null);
  const [isBatchMode, setIsBatchMode] = useState(false);

  // Copy notification
  const [copiedTable, setCopiedTable] = useState<string | null>(null);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';

  const handleOpenAdd = () => {
    setEditingTable(null);
    const nextNum = String(tables.length + 1);
    setTableNumber(nextNum);
    setLabel(`Table ${nextNum}`);
    setCapacity('4');
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (t: DiningTable) => {
    setEditingTable(t);
    setTableNumber(t.tableNumber);
    setLabel(t.label || `Table ${t.tableNumber}`);
    setCapacity(String(t.capacity || 4));
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanNum = tableNumber.trim();
    if (!cleanNum) {
      setErrorMessage('Table number is required.');
      return;
    }

    try {
      if (editingTable) {
        await updateTableMutation.mutateAsync({
          id: editingTable.id,
          data: {
            tableNumber: cleanNum,
            label: label.trim() || `Table ${cleanNum}`,
            capacity: parseInt(capacity, 10) || 4,
          },
        });
      } else {
        await createTableMutation.mutateAsync({
          tableNumber: cleanNum,
          label: label.trim() || `Table ${cleanNum}`,
          capacity: parseInt(capacity, 10) || 4,
        });
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save table.');
    }
  };

  const handleDelete = async (t: DiningTable) => {
    if (confirm(`Are you sure you want to delete ${t.label || 'Table ' + t.tableNumber}?`)) {
      await deleteTableMutation.mutateAsync(t.id);
    }
  };

  const handleCopyLink = (tNum: string) => {
    const link = `${baseUrl}/?table=${encodeURIComponent(tNum)}`;
    navigator.clipboard.writeText(link);
    setCopiedTable(tNum);
    setTimeout(() => setCopiedTable(null), 2500);
  };

  const handleOpenSingleQR = (tNum: string) => {
    setSelectedTableForQR(tNum);
    setIsBatchMode(false);
    setIsQRModalOpen(true);
  };

  const handleOpenBatchQR = () => {
    setSelectedTableForQR(null);
    setIsBatchMode(true);
    setIsQRModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Actions Bar */}
      <div className="bg-[#133834] border border-[#1D4D47] rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#0E2F2C] border border-[#1D4D47] flex items-center justify-center text-[#E5CFAF]">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-headline text-base sm:text-lg font-bold text-white uppercase tracking-wider">
                Table QR Codes & Roastery Layout
              </h2>
              <p className="text-xs text-[#C5D5D3]">
                {tables.length} physical dining tables configured with individual customer QR codes.
              </p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="secondary"
            onClick={handleOpenBatchQR}
            leftIcon={<Printer className="w-4 h-4 text-[#E5CFAF]" />}
            className="text-xs font-bold"
          >
            Print All ID Cards ({tables.length})
          </Button>

          <Button
            variant="yellow"
            onClick={handleOpenAdd}
            leftIcon={<Plus className="w-4 h-4 text-[#0E2F2C]" />}
            className="text-xs font-bold"
          >
            Add Table
          </Button>
        </div>
      </div>

      {/* Tables Grid */}
      {isLoading ? (
        <div className="py-20 text-center text-[#C5D5D3] space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-[#E5CFAF] animate-spin mx-auto" />
          <p className="text-xs font-headline uppercase tracking-wider">Loading roastery tables...</p>
        </div>
      ) : tables.length === 0 ? (
        <div className="bg-[#133834]/60 border border-[#1D4D47] rounded-2xl p-12 text-center space-y-3">
          <p className="text-sm font-headline text-white uppercase tracking-wider">No tables found</p>
          <Button variant="yellow" onClick={handleOpenAdd} leftIcon={<Plus className="w-4 h-4" />}>
            Create Table 1
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {tables.map((table) => {
            const hasActiveOrders = (table.orders && table.orders.length > 0);

            return (
              <div
                key={table.id}
                className="bg-[#133834] border border-[#1D4D47] rounded-2xl p-4 flex flex-col justify-between space-y-3 shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:border-[#E5CFAF]/40 transition-all group"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className="font-headline text-lg sm:text-xl font-black text-white group-hover:text-[#E5CFAF] transition-colors">
                      {table.label || `Table ${table.tableNumber}`}
                    </span>
                    <div className="flex items-center gap-1.5 text-[11px] text-[#A2B8B5]">
                      <Users className="w-3 h-3 text-[#E5CFAF]" />
                      <span>{table.capacity} seats</span>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-headline font-bold uppercase tracking-wider border ${
                      hasActiveOrders
                        ? 'bg-amber-950/80 border-amber-500/50 text-amber-300'
                        : 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
                    }`}
                  >
                    {hasActiveOrders ? `${table.orders?.length} Order` : 'Available'}
                  </span>
                </div>

                {/* QR Quick Visual */}
                <div className="py-2 flex items-center justify-center">
                  <div
                    onClick={() => handleOpenSingleQR(table.tableNumber)}
                    className="w-24 h-24 rounded-xl bg-[#FAF6F0] p-1.5 flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform shadow-md"
                    title={`Click to preview & print Table ${table.tableNumber} QR stand card`}
                  >
                    <QrCode className="w-14 h-14 text-[#0E2F2C]" />
                    <span className="text-[9px] font-black uppercase text-[#0E2F2C] font-headline tracking-tighter">
                      TABLE {table.tableNumber}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-[#1D4D47] flex items-center justify-between gap-1">
                  <Button
                    size="sm"
                    variant="yellow"
                    onClick={() => handleOpenSingleQR(table.tableNumber)}
                    className="flex-1 text-[11px] py-1 !h-8 font-bold"
                    leftIcon={<Printer className="w-3.5 h-3.5 text-[#0E2F2C]" />}
                  >
                    ID Card QR
                  </Button>

                  <button
                    onClick={() => handleCopyLink(table.tableNumber)}
                    className="p-1.5 rounded-lg bg-[#0E2F2C] border border-[#1D4D47] text-[#C5D5D3] hover:text-[#E5CFAF] transition-colors"
                    title="Copy Table QR Web Link"
                  >
                    {copiedTable === table.tableNumber ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <button
                    onClick={() => handleOpenEdit(table)}
                    className="p-1.5 rounded-lg bg-[#0E2F2C] border border-[#1D4D47] text-[#C5D5D3] hover:text-[#E5CFAF] transition-colors"
                    title="Edit Table Info"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDelete(table)}
                    className="p-1.5 rounded-lg bg-[#0E2F2C] border border-[#1D4D47] text-[#C5D5D3] hover:text-red-400 transition-colors"
                    title="Delete Table"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Table Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTable ? `Edit ${editingTable.label || 'Table ' + editingTable.tableNumber}` : 'Add New Dining Table'}
        subtitle="Configure table number, display label, and guest capacity"
        maxWidth="sm"
      >
        <form onSubmit={handleSave} className="space-y-4">
          {errorMessage && (
            <div className="p-3 bg-red-950/40 border border-red-500/30 rounded-xl text-red-300 text-xs">
              {errorMessage}
            </div>
          )}

          <Input
            label="Table Number (Unique ID)"
            placeholder="e.g. 16 or VIP-1"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            required
            autoFocus
          />

          <Input
            label="Display Label"
            placeholder="e.g. Table 16 (Outdoor Terrace)"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />

          <Input
            label="Seating Capacity (Guests)"
            type="number"
            min="1"
            max="30"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
          />

          <div className="flex justify-end gap-2.5 pt-3 border-t border-[#1D4D47]">
            <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="yellow"
              type="submit"
              isLoading={createTableMutation.isPending || updateTableMutation.isPending}
            >
              {editingTable ? 'Save Changes' : 'Create Table'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* QR Modal (Integrated for Single Table and Batch All Tables) */}
      <TableQRModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        initialTableNumber={selectedTableForQR}
        batchMode={isBatchMode}
      />
    </div>
  );
};
