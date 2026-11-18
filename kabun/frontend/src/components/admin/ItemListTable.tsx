import React, { useState } from 'react';
import {
  Edit2,
  Trash2,
  Search,
  Check,
  X,
  Utensils,
  Plus,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Category, MenuItem } from '../../types/menu';
import { useToggleItemStatus, useUpdateItem, useDeleteItem } from '../../hooks/useMenu';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

interface ItemListTableProps {
  items: MenuItem[];
  categories: Category[];
  onEditItem: (item: MenuItem) => void;
  onAddNew: () => void;
}

export const ItemListTable: React.FC<ItemListTableProps> = ({
  items,
  categories,
  onEditItem,
  onAddNew,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [deleteCandidate, setDeleteCandidate] = useState<MenuItem | null>(null);

  // Quick inline price editing state
  const [quickPriceId, setQuickPriceId] = useState<string | null>(null);
  const [quickPriceVal, setQuickPriceVal] = useState<string>('');

  const toggleStatusMutation = useToggleItemStatus();
  const updateItemMutation = useUpdateItem();
  const deleteItemMutation = useDeleteItem();

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesCategory =
      selectedCategory === 'all' || item.categoryId === selectedCategory;
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.name.toLowerCase().includes(q) ||
      (item.description && item.description.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  const handleToggleStatus = (item: MenuItem) => {
    toggleStatusMutation.mutate({
      id: item.id,
      isAvailable: !item.isAvailable,
    });
  };

  const handleStartQuickPrice = (item: MenuItem) => {
    setQuickPriceId(item.id);
    setQuickPriceVal(item.price !== null && item.price !== undefined ? String(item.price) : '');
  };

  const handleSaveQuickPrice = async (item: MenuItem) => {
    const newPrice = quickPriceVal.trim() === '' ? null : parseFloat(quickPriceVal);
    await updateItemMutation.mutateAsync({
      id: item.id,
      data: { price: newPrice },
    });
    setQuickPriceId(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteCandidate) return;
    await deleteItemMutation.mutateAsync(deleteCandidate.id);
    setDeleteCandidate(null);
  };

  return (
    <div className="bg-[#133834] border border-[#1D4D47] rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.6)] space-y-4">
      {/* Table Toolbar */}
      <div className="p-5 border-b border-[#1D4D47] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-headline text-lg font-bold text-[#FAF7F2] flex items-center gap-2">
              <Utensils className="w-5 h-5 text-[#E5CFAF]" />
              <span>Menu Items &amp; Live Pricing</span>
            </h3>
            <p className="font-body text-xs text-[#C5D5D3] mt-1">
              Instant coffee &amp; bite editing, ETB price updates, and customer menu visibility toggles.
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={onAddNew}
            leftIcon={<Plus className="w-4 h-4 text-[#0E2F2C] font-extrabold" />}
          >
            Add Menu Item
          </Button>
        </div>

        {/* Filter controls */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C5D5D3]" />
            <input
              type="text"
              placeholder="Search by coffee, beverage, or pastry name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0B2523] text-[#FAF7F2] placeholder:text-[#C5D5D3]/50 text-xs sm:text-sm rounded-xl border border-[#1D4D47] pl-10 pr-4 py-2.5 focus:outline-none focus:border-[#E5CFAF] transition-all"
            />
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-2.5">
            <span className="font-headline text-xs font-bold uppercase tracking-wider text-[#C5D5D3] shrink-0">
              Department / Section:
            </span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#0B2523] text-[#FAF7F2] text-xs sm:text-sm rounded-xl border border-[#1D4D47] px-3.5 py-2.5 focus:outline-none focus:border-[#E5CFAF] cursor-pointer"
            >
              <option value="all" className="bg-[#0E2F2C] text-[#FAF7F2]">All Items ({items.length})</option>
              {(() => {
                const coffeeCats = categories.filter((c) => {
                  const p = (c.parentCategory || 'COFFEE').toUpperCase();
                  return p === 'COFFEE' || p === 'DRINKS';
                });
                const bakeryCats = categories.filter((c) => {
                  const p = (c.parentCategory || 'COFFEE').toUpperCase();
                  return p === 'BAKERY' || p === 'FOOD';
                });
                return (
                  <>
                    {coffeeCats.length > 0 && (
                      <optgroup label="☕ COFFEE &amp; BEVERAGES" className="bg-[#0B2523] text-[#E5CFAF] font-bold">
                        {coffeeCats.map((c) => (
                          <option key={c.id} value={c.id} className="bg-[#0E2F2C] text-[#FAF7F2] font-normal">
                            {c.name}
                          </option>
                        ))}
                      </optgroup>
                    )}
                    {bakeryCats.length > 0 && (
                      <optgroup label="🥐 BAKERY &amp; BITES" className="bg-[#0B2523] text-[#E5CFAF] font-bold">
                        {bakeryCats.map((c) => (
                          <option key={c.id} value={c.id} className="bg-[#0E2F2C] text-[#FAF7F2] font-normal">
                            {c.name}
                          </option>
                        ))}
                      </optgroup>
                    )}
                  </>
                );
              })()}
            </select>
          </div>
        </div>
      </div>

      {/* 1. Mobile Phone View: Touch-Optimized Cards (< 640px) */}
      <div className="block sm:hidden divide-y divide-[#1D4D47]/60">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`p-4 space-y-3 transition-colors ${
              !item.isAvailable ? 'bg-black/30 opacity-60' : 'hover:bg-[#18423D]'
            }`}
          >
            <div className="flex items-start gap-3">
              {/* Thumbnail */}
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#0B2523] border border-[#1D4D47] shrink-0">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#C5D5D3]">
                    <Utensils className="w-4 h-4" />
                  </div>
                )}
              </div>

              {/* Title, Section & Price */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-headline font-bold text-[#FAF7F2] text-sm truncate">
                    {item.name}
                  </h4>
                  <span className="font-headline font-mono font-bold text-sm text-[#E5CFAF] shrink-0">
                    {item.price !== null && item.price !== undefined
                      ? `${item.price.toLocaleString()} ETB`
                      : 'Market'}
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`text-[10px] font-headline uppercase font-bold px-2 py-0.5 rounded-full border ${
                      item.category?.parentCategory === 'COFFEE' || item.category?.parentCategory === 'DRINKS'
                        ? 'bg-[#0B2523] text-[#E5CFAF] border-[#1D4D47]'
                        : 'bg-[#0B2523] text-[#FAF7F2] border-[#1D4D47]'
                    }`}
                  >
                    {item.category?.name || 'Selection'}
                  </span>

                  <span
                    className={`text-[10px] font-headline uppercase font-bold px-2 py-0.5 rounded-full border ${
                      item.isAvailable
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}
                  >
                    {item.isAvailable ? 'Live on Menu' : 'Hidden'}
                  </span>
                </div>
              </div>
            </div>

            {/* Inline Quick Price Editor on Mobile */}
            {quickPriceId === item.id && (
              <div className="flex items-center gap-2 p-2 rounded-xl bg-[#0B2523] border border-[#E5CFAF]">
                <span className="text-xs text-[#C5D5D3] font-mono">ETB:</span>
                <input
                  type="number"
                  step="any"
                  placeholder="Market price"
                  value={quickPriceVal}
                  onChange={(e) => setQuickPriceVal(e.target.value)}
                  className="flex-1 bg-transparent text-white text-xs font-mono font-bold focus:outline-none"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => handleSaveQuickPrice(item)}
                  className="px-2.5 py-1 rounded-lg bg-[#E5CFAF] text-[#0E2F2C] text-xs font-bold font-headline cursor-pointer"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setQuickPriceId(null)}
                  className="px-2 py-1 rounded-lg bg-[#133834] text-[#C5D5D3] hover:text-white text-xs cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Mobile Actions Button Row */}
            <div className="flex items-center gap-2 pt-1 border-t border-[#1D4D47]">
              <button
                type="button"
                onClick={() => handleToggleStatus(item)}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-headline font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  item.isAvailable
                    ? 'bg-[#0B2523] hover:bg-[#18423D] text-[#C5D5D3] border border-[#1D4D47]'
                    : 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30'
                }`}
              >
                {item.isAvailable ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Hide</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Make Live</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleStartQuickPrice(item)}
                className="py-2 px-3 rounded-xl bg-[#0B2523] hover:bg-[#18423D] border border-[#1D4D47] text-[#FAF7F2] text-xs font-headline font-bold uppercase tracking-wider cursor-pointer"
              >
                Price
              </button>

              <button
                type="button"
                onClick={() => onEditItem(item)}
                className="p-2 rounded-xl bg-[#0B2523] hover:bg-[#18423D] border border-[#1D4D47] text-[#FAF7F2] cursor-pointer"
                title="Edit Details"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setDeleteCandidate(item)}
                className="p-2 rounded-xl bg-red-950/20 hover:bg-red-900/40 border border-red-500/20 text-red-400 cursor-pointer"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="py-12 text-center text-[#C5D5D3] text-xs font-medium">
            No items found matching your search.
          </div>
        )}
      </div>

      {/* 2. Desktop Table View (>= 640px) */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-[#1D4D47] bg-[#0B2523] text-[#C5D5D3] uppercase font-headline text-[11px] font-bold tracking-wider">
              <th className="py-3.5 px-5">Item</th>
              <th className="py-3.5 px-5">Section</th>
              <th className="py-3.5 px-5">Price (ETB)</th>
              <th className="py-3.5 px-5 text-center">Menu Visibility</th>
              <th className="py-3.5 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1D4D47]/60">
            {filteredItems.map((item) => (
              <tr
                key={item.id}
                className={`hover:bg-[#18423D] transition-colors ${
                  !item.isAvailable ? 'bg-black/30 opacity-50' : ''
                }`}
              >
                {/* Item column */}
                <td className="py-4 px-5">
                  <div className="flex items-center gap-3.5">
                    {/* Thumbnail */}
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#0B2523] border border-[#1D4D47] shrink-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#C5D5D3]">
                          <Utensils className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="font-headline font-bold text-[#FAF7F2] text-base tracking-wide truncate max-w-xs sm:max-w-md">
                        {item.name}
                      </div>
                      {item.description && (
                        <p className="text-xs text-[#C5D5D3] truncate max-w-xs sm:max-w-md mt-0.5">
                          {item.description}
                        </p>
                      )}
                      {item.tags && (
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {item.tags.split(',').slice(0, 3).map((t, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] font-headline uppercase font-bold px-2.5 py-0.5 rounded-full bg-[#0B2523] text-[#E5CFAF] border border-[#1D4D47]"
                            >
                              {t.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td className="py-4 px-5 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-headline uppercase font-bold border ${
                    item.category?.parentCategory === 'COFFEE' || item.category?.parentCategory === 'DRINKS'
                      ? 'bg-[#0B2523] text-[#E5CFAF] border-[#1D4D47]'
                      : 'bg-[#0B2523] text-[#FAF7F2] border-[#1D4D47]'
                  }`}>
                    {item.category?.name || 'Uncategorized'}
                  </span>
                </td>

                {/* Price in Roasted Oat Cream */}
                <td className="py-4 px-5 whitespace-nowrap">
                  {quickPriceId === item.id ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        step="any"
                        placeholder="Mkt"
                        value={quickPriceVal}
                        onChange={(e) => setQuickPriceVal(e.target.value)}
                        className="w-20 bg-[#0B2523] text-white text-xs px-2.5 py-1 rounded-lg border border-[#E5CFAF] focus:outline-none"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveQuickPrice(item)}
                        className="p-1 rounded bg-[#E5CFAF] text-[#0E2F2C] hover:brightness-110 font-bold cursor-pointer"
                        title="Save price"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setQuickPriceId(null)}
                        className="p-1 rounded bg-[#0B2523] text-[#C5D5D3] hover:text-white cursor-pointer"
                        title="Cancel"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div
                      className="group/price flex items-center gap-1.5 cursor-pointer"
                      onClick={() => handleStartQuickPrice(item)}
                      title="Click to quick-edit price"
                    >
                      <span
                        className={`font-headline font-bold font-mono text-base ${
                          item.price === null ? 'text-[#C5D5D3] text-xs' : 'text-[#E5CFAF]'
                        }`}
                      >
                        {item.price !== null && item.price !== undefined
                          ? `${item.price.toLocaleString()} ETB`
                          : 'Market Price'}
                      </span>
                      <Edit2 className="w-3.5 h-3.5 text-[#C5D5D3] opacity-0 group-hover/price:opacity-100 transition-opacity" />
                    </div>
                  )}
                </td>

                {/* Status Toggle (Visible on Menu / Hidden) */}
                <td className="py-4 px-5 text-center whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(item)}
                    disabled={toggleStatusMutation.isPending}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-headline font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      item.isAvailable
                        ? 'bg-[#0B2523] text-[#FAF7F2] border border-[#1D4D47] hover:border-[#E5CFAF]'
                        : 'bg-[#0B2523]/60 text-[#71717A] border border-[#1D4D47]/40 hover:border-[#1D4D47]'
                    }`}
                    title={item.isAvailable ? 'Click to hide from customer menu' : 'Click to make visible on customer menu'}
                  >
                    {item.isAvailable ? (
                      <>
                        <Eye className="w-3.5 h-3.5 text-[#E5CFAF]" />
                        <span>Visible</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5 text-[#71717A]" />
                        <span>Hidden</span>
                      </>
                    )}
                  </button>
                </td>

                {/* Actions */}
                <td className="py-4 px-5 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => onEditItem(item)}
                      className="p-2 rounded-lg text-[#C5D5D3] hover:text-[#E5CFAF] hover:bg-[#0B2523] transition-all cursor-pointer"
                      title="Edit Item Details"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteCandidate(item)}
                      className="p-2 rounded-lg text-[#C5D5D3] hover:text-red-400 hover:bg-[#0B2523] transition-all cursor-pointer"
                      title="Delete Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredItems.length === 0 && (
              <tr>
                <td colSpan={5} className="py-14 text-center text-[#C5D5D3] font-medium">
                  No items found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Item Modal */}
      <Modal
        isOpen={!!deleteCandidate}
        onClose={() => setDeleteCandidate(null)}
        title="Remove Menu Item?"
        subtitle="This will permanently delete the item from the digital menu"
      >
        <div className="space-y-4">
          <p className="text-sm text-[#C5D5D3]">
            Are you sure you want to remove{' '}
            <strong className="text-[#FAF7F2] font-bold">&ldquo;{deleteCandidate?.name}&rdquo;</strong> from the
            menu?
          </p>
          <div className="flex justify-end gap-2.5 pt-2">
            <Button variant="secondary" onClick={() => setDeleteCandidate(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteConfirm}
              isLoading={deleteItemMutation.isPending}
            >
              Delete Item
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
