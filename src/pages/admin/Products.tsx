import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { getProducts, deleteProduct } from '@/services/productService';
import { getCategories } from '@/services/categoryService';
import { Product, Category } from '@/types/models';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription,
  AlertDialogFooter, AlertDialogCancel, AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { toast } from '@/components/ui/sonner';
import { formatMoney } from '@/lib/format';
import {
  PageHeader, Panel, GoldButton, OutlineButton, Chip, AvailabilityPill, LoadingRows, ErrorState, EmptyState,
  Thumb, errorMessage, inputClass,
} from '@/components/admin/AdminUi';

const ALL = '__all__';

const AdminProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState(ALL);
  const [pendingDelete, setPendingDelete] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [productsData, categoriesData] = await Promise.all([
        getProducts(),
        getCategories().catch(() => [] as Category[]),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err) {
      setError(errorMessage(err, 'Failed to load products'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const categoryOptions = useMemo(() => {
    const names = new Set<string>(categories.map((c) => c.name));
    products.forEach((p) => names.add(p.category));
    return Array.from(names).sort((a, b) => a.localeCompare(b));
  }, [categories, products]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return products.filter((p) => {
      if (categoryFilter !== ALL && p.category !== categoryFilter) return false;
      if (!term) return true;
      return (
        p.name.toLowerCase().includes(term) ||
        p.slug.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term)
      );
    });
  }, [products, search, categoryFilter]);

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await deleteProduct(pendingDelete.slug);
      setProducts((prev) => prev.filter((p) => p.id !== pendingDelete.id));
      toast.success(`"${pendingDelete.name}" deleted`);
      setPendingDelete(null);
    } catch (err: any) {
      const message = errorMessage(err, 'Failed to delete product');
      if (err?.response?.status === 409) {
        toast.error(message, {
          description: 'Set its availability to "out of stock" instead to hide it from the store.',
        });
      } else {
        toast.error(message);
      }
    } finally {
      setDeleting(false);
    }
  };

  const newButton = (
    <GoldButton onClick={() => navigate('/admin/products/new')}>
      <Plus className="h-4 w-4" /> New product
    </GoldButton>
  );

  return (
    <div>
      <PageHeader
        title="Products"
        description="Manage the catalogue, pricing, stock levels and imagery."
        action={newButton}
      />

      <Panel>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between p-4 border-b border-[#E4E0D7]">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8C887F]" />
            <Input
              placeholder="Search by name, slug or category"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`pl-9 ${inputClass}`}
            />
          </div>
          <div className="flex items-center gap-3">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className={`w-52 ${inputClass}`}>
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All categories</SelectItem>
                {categoryOptions.map((name) => (
                  <SelectItem key={name} value={name}>{name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-xs text-[#8C887F] whitespace-nowrap">
              {filtered.length} of {products.length}
            </span>
          </div>
        </div>

        {loading ? (
          <LoadingRows rows={6} />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : products.length === 0 ? (
          <EmptyState
            title="No products yet"
            description="Add your first piece to start building the collection."
            action={newButton}
          />
        ) : filtered.length === 0 ? (
          <EmptyState title="No matches" description="Try a different search or category." />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-[#E4E0D7]">
                  <TableHead className="text-[#5B5852]">Product</TableHead>
                  <TableHead className="text-[#5B5852]">Category</TableHead>
                  <TableHead className="text-[#5B5852] text-right">Price</TableHead>
                  <TableHead className="text-[#5B5852] text-right">Stock</TableHead>
                  <TableHead className="text-[#5B5852]">Availability</TableHead>
                  <TableHead className="text-[#5B5852]">Flags</TableHead>
                  <TableHead className="text-right text-[#5B5852]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((product) => {
                  const stock = product.stock ?? 0;
                  return (
                    <TableRow key={product.id} className="border-[#E4E0D7] hover:bg-[#F5F2EC]">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Thumb src={product.images?.[0]} alt={product.name} />
                          <div className="min-w-0">
                            <Link
                              to={`/admin/products/${encodeURIComponent(product.slug)}/edit`}
                              className="font-medium text-[#0A0A0A] hover:text-[#A27627] transition-colors"
                            >
                              {product.name}
                            </Link>
                            <p className="text-xs text-[#8C887F] truncate">{product.slug}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-[#5B5852]">{product.category}</TableCell>
                      <TableCell className="text-right text-[#0A0A0A] tabular-nums">{formatMoney(product.price)}</TableCell>
                      <TableCell className="text-right tabular-nums">
                        {stock <= 5 ? (
                          <span className="inline-flex items-center gap-1.5 text-[#85601F]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#D0A848]" />
                            {stock}
                          </span>
                        ) : (
                          <span className="text-[#0A0A0A]">{stock}</span>
                        )}
                      </TableCell>
                      <TableCell><AvailabilityPill availability={product.availability} /></TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {product.featured && <Chip tone="gold">Featured</Chip>}
                          {product.newArrival && <Chip>New</Chip>}
                          {product.bestseller && <Chip>Bestseller</Chip>}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <OutlineButton size="sm" onClick={() => navigate(`/admin/products/${encodeURIComponent(product.slug)}/edit`)}>
                            Edit
                          </OutlineButton>
                          <OutlineButton
                            size="sm"
                            className="text-[#A4302A] hover:text-[#A4302A]"
                            onClick={() => setPendingDelete(product)}
                          >
                            Delete
                          </OutlineButton>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </Panel>

      <AlertDialog open={!!pendingDelete} onOpenChange={(open) => !open && !deleting && setPendingDelete(null)}>
        <AlertDialogContent className="border-[#E4E0D7]">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">Delete product?</AlertDialogTitle>
            <AlertDialogDescription>
              "{pendingDelete?.name}" will be removed from the store permanently. Products that have been ordered
              cannot be deleted; set them to out of stock instead.
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

export default AdminProducts;
