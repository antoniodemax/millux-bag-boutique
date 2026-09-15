import { useEffect, useMemo, useRef, useState } from 'react';
import { Plus, Search, Upload } from 'lucide-react';
import { getCategories, createCategory, updateCategory, deleteCategory, CategoryPayload } from '@/services/categoryService';
import { uploadImage } from '@/services/productService';
import { Category } from '@/types/models';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription,
  AlertDialogFooter, AlertDialogCancel, AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { toast } from '@/components/ui/sonner';
import {
  PageHeader, Panel, GoldButton, OutlineButton, Chip, LoadingRows, ErrorState, EmptyState, Thumb, errorMessage, inputClass,
} from '@/components/admin/AdminUi';

interface FormState {
  name: string;
  image: string;
  available: boolean;
  orderNumber: string;
}

const emptyForm: FormState = { name: '', image: '', available: true, orderNumber: '0' };

const AdminCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [pendingDelete, setPendingDelete] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      setCategories(await getCategories());
    } catch (err) {
      setError(errorMessage(err, 'Failed to load categories'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return term ? categories.filter((c) => c.name.toLowerCase().includes(term)) : categories;
  }, [categories, search]);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm, orderNumber: String(categories.length) });
    setFormError(null);
    setDialogOpen(true);
  };

  const openEdit = (category: Category) => {
    setEditing(category);
    setForm({
      name: category.name,
      image: category.image ?? '',
      available: !!category.available,
      orderNumber: String(category.orderNumber ?? 0),
    });
    setFormError(null);
    setDialogOpen(true);
  };

  const handleUpload = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await uploadImage(file);
      setForm((f) => ({ ...f, image: url }));
      toast.success('Image uploaded');
    } catch (err) {
      toast.error(errorMessage(err, 'Upload failed'));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const save = async () => {
    const name = form.name.trim();
    if (!name) {
      setFormError('Name is required');
      return;
    }
    const orderNumber = parseInt(form.orderNumber, 10);
    if (Number.isNaN(orderNumber) || orderNumber < 0) {
      setFormError('Order must be a whole number of 0 or more');
      return;
    }
    const payload: CategoryPayload = { name, image: form.image.trim(), available: form.available, orderNumber };
    setSaving(true);
    setFormError(null);
    try {
      if (editing) {
        const updated = await updateCategory(editing.id, payload);
        setCategories((prev) => prev.map((c) => (c.id === editing.id ? { ...c, ...updated } : c)));
        toast.success('Category updated');
      } else {
        const created = await createCategory(payload);
        setCategories((prev) => [...prev, created].sort((a, b) => (a.orderNumber ?? 0) - (b.orderNumber ?? 0) || a.name.localeCompare(b.name)));
        toast.success('Category created');
      }
      setDialogOpen(false);
    } catch (err: any) {
      const details = err?.response?.data?.details;
      setFormError(Array.isArray(details) && details[0]?.message ? details[0].message : errorMessage(err, 'Failed to save category'));
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await deleteCategory(pendingDelete.id);
      setCategories((prev) => prev.filter((c) => c.id !== pendingDelete.id));
      toast.success(`"${pendingDelete.name}" deleted`);
      setPendingDelete(null);
    } catch (err) {
      toast.error(errorMessage(err, 'Failed to delete category'));
    } finally {
      setDeleting(false);
    }
  };

  const newButton = (
    <GoldButton onClick={openCreate}>
      <Plus className="h-4 w-4" /> New category
    </GoldButton>
  );

  return (
    <div>
      <PageHeader
        title="Categories"
        description="Organise the collection. Products reference categories by name."
        action={newButton}
      />

      <Panel>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between p-4 border-b border-[#E4E0D7]">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8C887F]" />
            <Input
              placeholder="Search categories"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`pl-9 ${inputClass}`}
            />
          </div>
          <span className="text-xs text-[#8C887F]">{filtered.length} of {categories.length}</span>
        </div>

        {loading ? (
          <LoadingRows />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : categories.length === 0 ? (
          <EmptyState title="No categories yet" description="Create a category to start grouping products." action={newButton} />
        ) : filtered.length === 0 ? (
          <EmptyState title="No matches" description="Try a different search." />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-[#E4E0D7]">
                  <TableHead className="text-[#5B5852]">Category</TableHead>
                  <TableHead className="text-[#5B5852] text-right">Products</TableHead>
                  <TableHead className="text-[#5B5852]">Status</TableHead>
                  <TableHead className="text-[#5B5852] text-right">Order</TableHead>
                  <TableHead className="text-[#5B5852] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((category) => (
                  <TableRow key={category.id} className="border-[#E4E0D7] hover:bg-[#F5F2EC]">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Thumb src={category.image || null} alt={category.name} />
                        <button
                          type="button"
                          onClick={() => openEdit(category)}
                          className="font-medium text-[#0A0A0A] hover:text-[#A27627] transition-colors text-left"
                        >
                          {category.name}
                        </button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-[#0A0A0A]">{category.productCount ?? 0}</TableCell>
                    <TableCell>
                      {category.available ? <Chip tone="green">Available</Chip> : <Chip>Hidden</Chip>}
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-[#5B5852]">{category.orderNumber ?? 0}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <OutlineButton size="sm" onClick={() => openEdit(category)}>Edit</OutlineButton>
                        <OutlineButton size="sm" className="text-[#A4302A] hover:text-[#A4302A]" onClick={() => setPendingDelete(category)}>
                          Delete
                        </OutlineButton>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Panel>

      {/* Create / edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => !saving && setDialogOpen(open)}>
        <DialogContent className="border-[#E4E0D7] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">{editing ? 'Edit category' : 'New category'}</DialogTitle>
            <DialogDescription>
              {editing ? 'Update the category details.' : 'Add a new category to the collection.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wide text-[#5B5852]">Name</Label>
              <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Totes" className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wide text-[#5B5852]">Image</Label>
              <div className="flex items-center gap-3">
                <Thumb src={form.image || null} alt={form.name || 'Category'} size="h-14 w-14" />
                <div className="flex-1 space-y-2">
                  <Input value={form.image} onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))} placeholder="https://… or /images/example.png" className={inputClass} />
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e.target.files?.[0])} />
                  <OutlineButton type="button" size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                    <Upload className="h-4 w-4" /> {uploading ? 'Uploading…' : 'Upload image'}
                  </OutlineButton>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wide text-[#5B5852]">Order</Label>
                <Input type="number" min="0" step="1" value={form.orderNumber} onChange={(e) => setForm((f) => ({ ...f, orderNumber: e.target.value }))} className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wide text-[#5B5852]">Available</Label>
                <div className="flex items-center h-10">
                  <Switch checked={form.available} onCheckedChange={(v) => setForm((f) => ({ ...f, available: v }))} className="data-[state=checked]:bg-[#A27627]" />
                  <span className="ml-3 text-sm text-[#5B5852]">{form.available ? 'Shown in store' : 'Hidden'}</span>
                </div>
              </div>
            </div>
            {formError && <p className="text-xs text-[#A4302A]">{formError}</p>}
          </div>
          <DialogFooter>
            <OutlineButton type="button" onClick={() => setDialogOpen(false)} disabled={saving}>Cancel</OutlineButton>
            <GoldButton type="button" onClick={save} disabled={saving || uploading}>
              {saving ? 'Saving…' : editing ? 'Save changes' : 'Create category'}
            </GoldButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={!!pendingDelete} onOpenChange={(open) => !open && !deleting && setPendingDelete(null)}>
        <AlertDialogContent className="border-[#E4E0D7]">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">Delete category?</AlertDialogTitle>
            <AlertDialogDescription>
              "{pendingDelete?.name}" will be removed. Products currently assigned to it keep the category name as text
              {pendingDelete?.productCount ? ` (${pendingDelete.productCount} product${pendingDelete.productCount === 1 ? '' : 's'})` : ''},
              but it will no longer appear as a filter in the store.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting} className="border-[#E4E0D7]">Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleting}
              onClick={(e) => { e.preventDefault(); confirmDelete(); }}
              className="bg-[#0A0A0A] hover:bg-[#2A2926] text-white"
            >
              {deleting ? 'Deleting…' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminCategories;
