import React, { useState } from 'react';
import {
  Folder,
  Plus,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  Coffee,
  Croissant,
  Layers,
} from 'lucide-react';
import { Category } from '../../types/menu';
import {
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  useReorderCategories,
} from '../../hooks/useMenu';
import { Button } from '../ui/Button';
import { Input, TextArea } from '../ui/Input';
import { Modal } from '../ui/Modal';

interface CategoryManagerProps {
  categories: Category[];
}

export const CategoryManager: React.FC<CategoryManagerProps> = ({ categories }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<Category | null>(null);

  // Parent Category Filter
  const [filterParent, setFilterParent] = useState<'ALL' | 'COFFEE' | 'BAKERY'>('ALL');

  // Form states
  const [name, setName] = useState('');
  const [parentCategory, setParentCategory] = useState<'COFFEE' | 'BAKERY'>('COFFEE');
  const [description, setDescription] = useState('');

  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();
  const reorderMutation = useReorderCategories();

  const handleOpenAdd = () => {
    setName('');
    setParentCategory(filterParent === 'BAKERY' ? 'BAKERY' : 'COFFEE');
    setDescription('');
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    const p = (cat.parentCategory || 'COFFEE').toUpperCase();
    setParentCategory(p === 'BAKERY' || p === 'FOOD' ? 'BAKERY' : 'COFFEE');
    setDescription(cat.description || '');
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    await createMutation.mutateAsync({
      name: name.trim(),
      parentCategory,
      description: description.trim() || undefined,
      sortOrder: categories.length + 1,
    });

    setIsAddModalOpen(false);
    setName('');
    setDescription('');
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !name.trim()) return;

    await updateMutation.mutateAsync({
      id: editingCategory.id,
      data: {
        name: name.trim(),
        parentCategory,
        description: description.trim() || undefined,
      },
    });

    setEditingCategory(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteCandidate) return;
    await deleteMutation.mutateAsync(deleteCandidate.id);
    setDeleteCandidate(null);
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= categories.length) return;

    const newOrder = [...categories];
    const [moved] = newOrder.splice(index, 1);
    newOrder.splice(targetIndex, 0, moved);

    await reorderMutation.mutateAsync(newOrder.map((c) => c.id));
  };

  // Filtered categories
  const filteredCategories = categories.filter((cat) => {
    if (filterParent === 'ALL') return true;
    const p = (cat.parentCategory || 'COFFEE').toUpperCase();
    if (filterParent === 'COFFEE') return p === 'COFFEE' || p === 'DRINKS';
    if (filterParent === 'BAKERY') return p === 'BAKERY' || p === 'FOOD';
    return true;
  });

  const coffeeCount = categories.filter((c) => {
    const p = (c.parentCategory || 'COFFEE').toUpperCase();
    return p === 'COFFEE' || p === 'DRINKS';
  }).length;
  const bakeryCount = categories.filter((c) => {
    const p = (c.parentCategory || 'COFFEE').toUpperCase();
    return p === 'BAKERY' || p === 'FOOD';
  }).length;

  return (
    <div className="bg-[#121212] border border-[#222222] rounded-2xl p-6 space-y-5 shadow-[0_8px_30px_rgba(0,0,0,0.6)]">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#222222]">
        <div>
          <h3 className="font-headline text-lg font-bold text-white flex items-center gap-2">
            <Folder className="w-5 h-5 text-white" />
            <span>Menu Categories &amp; Main Departments</span>
          </h3>
          <p className="font-body text-xs text-[#A1A1AA] mt-1">
            Organize main departments (COFFEE vs BAKERY) and their categories (Espresso, Cold Brew, Pour-Over, Pastries).
          </p>
        </div>

        <Button
          variant="yellow"
          size="sm"
          onClick={handleOpenAdd}
          leftIcon={<Plus className="w-4 h-4 text-black font-extrabold" />}
        >
          Add Category
        </Button>
      </div>

      {/* Main Section Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#1c1c1c] pb-3">
        <button
          type="button"
          onClick={() => setFilterParent('ALL')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-headline font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
            filterParent === 'ALL'
              ? 'bg-white text-black'
              : 'bg-[#181818] text-[#A1A1AA] hover:text-white border border-[#262626]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>All ({categories.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setFilterParent('COFFEE')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-headline font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
            filterParent === 'COFFEE'
              ? 'bg-[#E5CFAF] text-[#0E2F2C] font-extrabold shadow-[0_0_12px_rgba(229,207,175,0.4)]'
              : 'bg-[#181818] text-[#A1A1AA] hover:text-white border border-[#262626]'
          }`}
        >
          <Coffee className="w-3.5 h-3.5" />
          <span>Coffee &amp; Drinks ({coffeeCount})</span>
        </button>

        <button
          type="button"
          onClick={() => setFilterParent('BAKERY')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-headline font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
            filterParent === 'BAKERY'
              ? 'bg-[#E5CFAF] text-[#0E2F2C] font-extrabold shadow-[0_0_12px_rgba(229,207,175,0.4)]'
              : 'bg-[#181818] text-[#A1A1AA] hover:text-white border border-[#262626]'
          }`}
        >
          <Croissant className="w-3.5 h-3.5" />
          <span>Bakery &amp; Bites ({bakeryCount})</span>
        </button>
      </div>

      {/* Category List */}
      <div className="divide-y divide-[#1c1c1c] border border-[#222222] rounded-2xl overflow-hidden bg-[#0a0a0a]">
        {filteredCategories.map((cat, index) => {
          const itemCount = cat.items ? cat.items.length : cat._count?.items ?? 0;
          const p = (cat.parentCategory || 'COFFEE').toUpperCase();
          const isBakery = p === 'BAKERY' || p === 'FOOD';

          return (
            <div
              key={cat.id}
              className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-[#141414] transition-colors"
            >
              <div className="flex items-center gap-4 min-w-0">
                {/* Reorder Up/Down */}
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    disabled={index === 0 || reorderMutation.isPending}
                    onClick={() => handleMove(index, 'up')}
                    className="p-1.5 rounded-lg bg-[#181818] hover:bg-[#222222] text-[#A1A1AA] hover:text-white disabled:opacity-20 cursor-pointer transition-colors"
                    title="Move Section Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={index === categories.length - 1 || reorderMutation.isPending}
                    onClick={() => handleMove(index, 'down')}
                    className="p-1.5 rounded-lg bg-[#181818] hover:bg-[#222222] text-[#A1A1AA] hover:text-white disabled:opacity-20 cursor-pointer transition-colors"
                    title="Move Section Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Name, Badge & Count */}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-headline text-base font-bold text-white tracking-wide truncate">
                      {cat.name}
                    </span>

                    {/* Main Parent Section Badge */}
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-headline font-bold uppercase tracking-wider border ${
                        isBakery
                          ? 'bg-[#E5CFAF]/10 text-[#E5CFAF] border-[#E5CFAF]/30'
                          : 'bg-[#348B82]/10 text-[#348B82] border-[#348B82]/30'
                      }`}
                    >
                      {isBakery ? '🥐 Bakery & Bites' : '☕ Coffee & Drinks'}
                    </span>

                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/5 text-[#d4d4d8] border border-white/10 font-headline font-semibold">
                      {itemCount} {itemCount === 1 ? 'item' : 'items'}
                    </span>
                  </div>

                  {cat.description && (
                    <p className="font-body text-xs text-[#A1A1AA] mt-1 line-clamp-1">
                      {cat.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(cat)}
                  className="p-2 rounded-xl bg-[#141414] hover:bg-[#222222] text-[#A1A1AA] hover:text-white border border-[#222222] hover:border-[#333333] transition-colors cursor-pointer"
                  title="Edit Category"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteCandidate(cat)}
                  className="p-2 rounded-xl bg-[#141414] hover:bg-red-950/40 text-[#71717A] hover:text-red-400 border border-[#222222] hover:border-red-900/50 transition-colors cursor-pointer"
                  title="Delete Category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create Menu Category"
        subtitle="This category will appear under Coffee or Bakery on the customer digital menu"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          {/* Main Category Selection */}
          <div className="space-y-1.5">
            <label className="block font-headline text-[11px] uppercase tracking-wider font-bold text-white">
              Main Department / Section
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setParentCategory('COFFEE')}
                className={`py-3 px-4 rounded-xl border font-headline text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  parentCategory === 'COFFEE'
                    ? 'bg-[#E5CFAF] text-[#0E2F2C] border-[#E5CFAF] shadow-[0_0_15px_rgba(229,207,175,0.4)]'
                    : 'bg-[#181818] text-[#A1A1AA] border-[#262626] hover:text-white'
                }`}
              >
                <Coffee className="w-4 h-4" />
                <span>COFFEE &amp; DRINKS</span>
              </button>

              <button
                type="button"
                onClick={() => setParentCategory('BAKERY')}
                className={`py-3 px-4 rounded-xl border font-headline text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  parentCategory === 'BAKERY'
                    ? 'bg-[#E5CFAF] text-[#0E2F2C] border-[#E5CFAF] shadow-[0_0_15px_rgba(229,207,175,0.4)]'
                    : 'bg-[#181818] text-[#A1A1AA] border-[#262626] hover:text-white'
                }`}
              >
                <Croissant className="w-4 h-4" />
                <span>BAKERY &amp; BITES</span>
              </button>
            </div>
          </div>

          <Input
            label="Category Name"
            placeholder={parentCategory === 'COFFEE' ? 'e.g. Espresso & Hot Classics, Signature & Cold Brews, Pour-Over Bar' : 'e.g. Viennoiserie & Pastries, Cakes & Desserts, Light Savory Bites'}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
          />

          <TextArea
            label="Description (Optional)"
            placeholder="Brief description to display for this menu section..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="flex justify-end gap-2.5 pt-2">
            <Button variant="secondary" type="button" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="yellow" type="submit" isLoading={createMutation.isPending}>
              Create Category
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingCategory}
        onClose={() => setEditingCategory(null)}
        title={`Edit Category: ${editingCategory?.name}`}
        subtitle="Rename category, switch between Coffee and Bakery, or update description"
      >
        <form onSubmit={handleUpdate} className="space-y-4">
          {/* Main Category Selection */}
          <div className="space-y-1.5">
            <label className="block font-headline text-[11px] uppercase tracking-wider font-bold text-white">
              Main Department / Section
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setParentCategory('COFFEE')}
                className={`py-3 px-4 rounded-xl border font-headline text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  parentCategory === 'COFFEE'
                    ? 'bg-[#E5CFAF] text-[#0E2F2C] border-[#E5CFAF] shadow-[0_0_15px_rgba(229,207,175,0.4)]'
                    : 'bg-[#181818] text-[#A1A1AA] border-[#262626] hover:text-white'
                }`}
              >
                <Coffee className="w-4 h-4" />
                <span>COFFEE</span>
              </button>

              <button
                type="button"
                onClick={() => setParentCategory('BAKERY')}
                className={`py-3 px-4 rounded-xl border font-headline text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  parentCategory === 'BAKERY'
                    ? 'bg-[#E5CFAF] text-[#0E2F2C] border-[#E5CFAF] shadow-[0_0_15px_rgba(229,207,175,0.4)]'
                    : 'bg-[#181818] text-[#A1A1AA] border-[#262626] hover:text-white'
                }`}
              >
                <Croissant className="w-4 h-4" />
                <span>BAKERY</span>
              </button>
            </div>
          </div>

          <Input
            label="Category Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
          />

          <TextArea
            label="Description (Optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="flex justify-end gap-2.5 pt-2">
            <Button variant="secondary" type="button" onClick={() => setEditingCategory(null)}>
              Cancel
            </Button>
            <Button variant="yellow" type="submit" isLoading={updateMutation.isPending}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteCandidate}
        onClose={() => setDeleteCandidate(null)}
        title="Delete Menu Category?"
        subtitle="This action cannot be undone"
      >
        <div className="space-y-4">
          <p className="text-sm text-[#A1A1AA]">
            Are you sure you want to delete{' '}
            <strong className="text-white font-bold">&ldquo;{deleteCandidate?.name}&rdquo;</strong>?
            All items inside this category will also be removed from the menu.
          </p>

          <div className="flex justify-end gap-2.5 pt-2">
            <Button variant="secondary" onClick={() => setDeleteCandidate(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteConfirm}
              isLoading={deleteMutation.isPending}
            >
              Delete Category
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
