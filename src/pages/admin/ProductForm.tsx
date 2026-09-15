import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Upload, X, Plus } from 'lucide-react';
import { getProductBySlug, createProduct, updateProduct, uploadImage, ProductPayload } from '@/services/productService';
import { getCategories } from '@/services/categoryService';
import { Category } from '@/types/models';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/sonner';
import { slugify } from '@/lib/format';
import {
  PageHeader, Panel, GoldButton, OutlineButton, BackLink, EmptyState, Thumb, errorMessage, inputClass,
} from '@/components/admin/AdminUi';

const schema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  slug: z
    .string()
    .trim()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers and hyphens'),
  category: z.string().trim().min(1, 'Category is required'),
  price: z.coerce.number({ invalid_type_error: 'Enter a price' }).positive('Price must be greater than 0'),
  stock: z.coerce.number({ invalid_type_error: 'Enter a stock level' }).int('Stock must be a whole number').min(0, 'Stock cannot be negative'),
  availability: z.enum(['in_stock', 'low_stock', 'out_of_stock']),
  description: z.string().optional(),
  materials: z.string().optional(),
  dimensions: z.string().optional(),
  care: z.string().optional(),
  featured: z.boolean(),
  newArrival: z.boolean(),
  bestseller: z.boolean(),
});

type FormValues = z.infer<typeof schema>;
type FieldName = keyof FormValues;

const FIELD_NAMES: FieldName[] = [
  'name', 'slug', 'category', 'price', 'stock', 'availability', 'description', 'materials', 'dimensions', 'care',
  'featured', 'newArrival', 'bestseller',
];

const defaultValues: FormValues = {
  name: '',
  slug: '',
  category: '',
  price: 0,
  stock: 0,
  availability: 'in_stock',
  description: '',
  materials: '',
  dimensions: '',
  care: '',
  featured: false,
  newArrival: false,
  bestseller: false,
};

const Field = ({ label, error, children, hint }: { label: string; error?: string; hint?: string; children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <Label className="text-xs uppercase tracking-wide text-[#5B5852]">{label}</Label>
    {children}
    {hint && !error && <p className="text-xs text-[#8C887F]">{hint}</p>}
    {error && <p className="text-xs text-[#A4302A]">{error}</p>}
  </div>
);

const AdminProductForm = () => {
  const { slug } = useParams<{ slug: string }>();
  const isEdit = !!slug;
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(isEdit);
  const [notFound, setNotFound] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues });

  const nameValue = watch('name');
  const categoryValue = watch('category');

  // Auto-generate slug from name on create until the admin edits the slug
  useEffect(() => {
    if (!slugTouched) {
      setValue('slug', slugify(nameValue || ''), { shouldValidate: false });
    }
  }, [nameValue, slugTouched, setValue]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const cats = await getCategories();
        if (!cancelled) setCategories(cats);
      } catch {
        // Categories are optional for the form; fall back to free-text input
      }
      if (!isEdit) return;
      setLoading(true);
      setLoadError(null);
      try {
        const product = await getProductBySlug(slug as string);
        if (cancelled) return;
        if (!product) {
          setNotFound(true);
          return;
        }
        reset({
          name: product.name,
          slug: product.slug,
          category: product.category,
          price: product.price,
          stock: product.stock ?? 0,
          availability: product.availability,
          description: product.description ?? '',
          materials: product.materials ?? '',
          dimensions: product.dimensions ?? '',
          care: product.care ?? '',
          featured: !!product.featured,
          newArrival: !!product.newArrival,
          bestseller: !!product.bestseller,
        });
        setImages(Array.isArray(product.images) ? product.images : []);
      } catch (err) {
        if (!cancelled) setLoadError(errorMessage(err, 'Failed to load product'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [slug, isEdit, reset]);

  const handleUpload = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await uploadImage(file);
      setImages((prev) => [...prev, url]);
      toast.success('Image uploaded');
    } catch (err) {
      toast.error(errorMessage(err, 'Upload failed'));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const addImageUrl = () => {
    const url = imageUrl.trim();
    if (!url) return;
    setImages((prev) => (prev.includes(url) ? prev : [...prev, url]));
    setImageUrl('');
  };

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    const payload: ProductPayload = {
      name: values.name,
      slug: values.slug,
      category: values.category,
      price: values.price,
      stock: values.stock,
      images,
      description: values.description ?? '',
      materials: values.materials ?? '',
      dimensions: values.dimensions ?? '',
      care: values.care ?? '',
      availability: values.availability,
      featured: values.featured,
      newArrival: values.newArrival,
      bestseller: values.bestseller,
    };
    try {
      if (isEdit) {
        await updateProduct(slug as string, payload);
        toast.success('Product updated');
      } else {
        await createProduct(payload);
        toast.success('Product created');
      }
      navigate('/admin/products');
    } catch (err: any) {
      const details: { path?: (string | number)[]; message?: string }[] | undefined = err?.response?.data?.details;
      let mapped = false;
      if (err?.response?.status === 400 && Array.isArray(details)) {
        details.forEach((d) => {
          const field = d.path?.[0];
          if (typeof field === 'string' && (FIELD_NAMES as string[]).includes(field)) {
            setError(field as FieldName, { type: 'server', message: d.message || 'Invalid value' });
            mapped = true;
          }
        });
      }
      if (!mapped) toast.error(errorMessage(err, 'Failed to save product'));
      else toast.error('Please fix the highlighted fields');
    } finally {
      setSubmitting(false);
    }
  };

  const title = isEdit ? 'Edit product' : 'New product';

  if (notFound) {
    return (
      <div>
        <BackLink to="/admin/products">Back to products</BackLink>
        <Panel>
          <EmptyState
            title="Product not found"
            description="It may have been deleted or the link is incorrect."
            action={<OutlineButton onClick={() => navigate('/admin/products')}>Back to products</OutlineButton>}
          />
        </Panel>
      </div>
    );
  }

  return (
    <div>
      <BackLink to="/admin/products">Back to products</BackLink>
      <PageHeader
        title={title}
        description={isEdit ? 'Update details, pricing, stock and imagery.' : 'Add a new piece to the collection.'}
      />

      {loading ? (
        <Panel className="p-6 space-y-4">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-10 w-full bg-[#F5F2EC]" />)}
        </Panel>
      ) : loadError ? (
        <Panel>
          <EmptyState title="Could not load product" description={loadError} />
        </Panel>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 lg:grid-cols-3">
          {/* Left column: details */}
          <div className="lg:col-span-2 space-y-6">
            <Panel className="p-6 space-y-5">
              <h2 className="font-display text-lg text-[#0A0A0A]">Details</h2>
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Name" error={errors.name?.message}>
                  <Input {...register('name')} placeholder="Obsidian Structured Tote" className={inputClass} />
                </Field>
                <Field label="Slug" error={errors.slug?.message} hint="Used in the product URL">
                  <Input
                    {...register('slug', { onChange: () => setSlugTouched(true) })}
                    placeholder="obsidian-structured-tote"
                    className={`${inputClass} font-mono text-sm`}
                  />
                </Field>
                <Field label="Category" error={errors.category?.message}>
                  {categories.length > 0 ? (
                    <Select value={categoryValue || undefined} onValueChange={(v) => setValue('category', v, { shouldValidate: true })}>
                      <SelectTrigger className={inputClass}>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((c) => (
                          <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                        ))}
                        {categoryValue && !categories.some((c) => c.name === categoryValue) && (
                          <SelectItem value={categoryValue}>{categoryValue}</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input {...register('category')} placeholder="Totes" className={inputClass} />
                  )}
                </Field>
                <Field label="Availability" error={errors.availability?.message}>
                  <Controller
                    control={control}
                    name="availability"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className={inputClass}><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="in_stock">In stock</SelectItem>
                          <SelectItem value="low_stock">Low stock</SelectItem>
                          <SelectItem value="out_of_stock">Out of stock</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </Field>
                <Field label="Price (KES)" error={errors.price?.message}>
                  <Input type="number" step="0.01" min="0" {...register('price')} className={inputClass} />
                </Field>
                <Field label="Stock" error={errors.stock?.message} hint="Units available to order">
                  <Input type="number" step="1" min="0" {...register('stock')} className={inputClass} />
                </Field>
              </div>
              <Field label="Description" error={errors.description?.message}>
                <Textarea {...register('description')} rows={4} className={inputClass} />
              </Field>
              <div className="grid gap-5 md:grid-cols-3">
                <Field label="Materials"><Input {...register('materials')} className={inputClass} /></Field>
                <Field label="Dimensions"><Input {...register('dimensions')} className={inputClass} /></Field>
                <Field label="Care"><Input {...register('care')} className={inputClass} /></Field>
              </div>
            </Panel>

            <Panel className="p-6 space-y-4">
              <h2 className="font-display text-lg text-[#0A0A0A]">Images</h2>
              {images.length === 0 ? (
                <p className="text-sm text-[#8C887F]">No images yet. Upload a file or add an image URL.</p>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {images.map((src, i) => (
                    <div key={`${src}-${i}`} className="relative group">
                      <Thumb src={src} alt={`Image ${i + 1}`} size="h-24 w-24" />
                      <button
                        type="button"
                        aria-label="Remove image"
                        onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-white border border-[#E4E0D7] text-[#5B5852] hover:text-[#A4302A] flex items-center justify-center shadow-sm"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                      {i === 0 && (
                        <span className="absolute bottom-1 left-1 text-[10px] uppercase tracking-wide bg-white/90 text-[#85601F] px-1.5 rounded">
                          Cover
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <div className="flex flex-col gap-3 md:flex-row">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleUpload(e.target.files?.[0])}
                />
                <OutlineButton type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                  <Upload className="h-4 w-4" /> {uploading ? 'Uploading…' : 'Upload image'}
                </OutlineButton>
                <div className="flex flex-1 gap-2">
                  <Input
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addImageUrl(); } }}
                    placeholder="https://… or /images/example.png"
                    className={inputClass}
                  />
                  <OutlineButton type="button" onClick={addImageUrl} disabled={!imageUrl.trim()}>
                    <Plus className="h-4 w-4" /> Add URL
                  </OutlineButton>
                </div>
              </div>
            </Panel>
          </div>

          {/* Right column: visibility + actions */}
          <div className="space-y-6">
            <Panel className="p-6 space-y-4">
              <h2 className="font-display text-lg text-[#0A0A0A]">Visibility</h2>
              {([
                ['featured', 'Featured', 'Shown in featured collections'],
                ['newArrival', 'New arrival', 'Listed on the New Arrivals page'],
                ['bestseller', 'Bestseller', 'Highlighted as a bestseller'],
              ] as const).map(([name, label, hint]) => (
                <Controller
                  key={name}
                  control={control}
                  name={name}
                  render={({ field }) => (
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm text-[#0A0A0A]">{label}</p>
                        <p className="text-xs text-[#8C887F]">{hint}</p>
                      </div>
                      <Switch checked={field.value} onCheckedChange={field.onChange} className="data-[state=checked]:bg-[#A27627]" />
                    </div>
                  )}
                />
              ))}
            </Panel>

            <Panel className="p-6 space-y-3">
              <GoldButton type="submit" className="w-full" disabled={submitting || uploading}>
                {submitting ? 'Saving…' : isEdit ? 'Save changes' : 'Create product'}
              </GoldButton>
              <Link to="/admin/products" className="block text-center text-sm text-[#5B5852] hover:text-[#A27627] transition-colors">
                Cancel
              </Link>
            </Panel>
          </div>
        </form>
      )}
    </div>
  );
};

export default AdminProductForm;
