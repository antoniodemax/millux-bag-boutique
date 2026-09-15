import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { getCustomerProfile, updateCustomerProfile } from '@/services/authService';
import { toast } from '@/components/ui/sonner';
import { StoreButton } from '@/components/store/Button';
import { Field, inputClass, Skeleton } from '@/components/store/Primitives';
import type { Customer } from '@/types/models';

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const CustomerProfile = () => {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: '', phone: '' },
  });

  useEffect(() => {
    let active = true;
    getCustomerProfile()
      .then((profile) => {
        if (!active) return;
        setCustomer(profile);
        reset({ name: profile.name ?? '', phone: profile.phone ?? '' });
      })
      .catch((err: unknown) => {
        if (!active) return;
        toast.error(isAxiosError(err) && typeof err.response?.data?.error === 'string' ? err.response.data.error : 'Please sign in to view your account');
        navigate('/customer/login');
      })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, [navigate, reset]);

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSaving(true);
    try {
      const updated = await updateCustomerProfile({ name: data.name, phone: data.phone ?? '' });
      setCustomer(updated);
      reset({ name: updated.name ?? '', phone: updated.phone ?? '' });
      toast.success('Details saved');
    } catch (err) {
      toast.error(isAxiosError(err) && typeof err.response?.data?.error === 'string' ? err.response.data.error : 'Could not save your details');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-xl border border-line p-6" aria-busy="true" aria-label="Loading your details">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="mt-6 h-12 w-full" />
        <Skeleton className="mt-6 h-12 w-full" />
        <Skeleton className="mt-6 h-12 w-full" />
      </div>
    );
  }

  return (
    <section className="max-w-xl border border-line p-6 sm:p-8" aria-labelledby="details-heading">
      <h2 id="details-heading" className="font-display text-xl text-ink">Details</h2>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-6">
        <Field id="name" label="Full name" error={errors.name?.message}>
          <input
            id="name"
            type="text"
            autoComplete="name"
            aria-invalid={errors.name ? 'true' : undefined}
            aria-describedby={errors.name ? 'name-error' : undefined}
            className={inputClass}
            {...register('name')}
          />
        </Field>
        <div className="space-y-2">
          <p className="brand-label text-ink">Email</p>
          <p className="flex h-12 items-center border border-line bg-stone px-4 text-base text-soft">{customer?.email || 'Not provided'}</p>
        </div>
        <Field id="phone" label="Phone" optional hint="Used to reach you on WhatsApp about your orders">
          <input id="phone" type="tel" autoComplete="tel" placeholder="+254 700 000 000" className={inputClass} {...register('phone')} />
        </Field>
        <StoreButton type="submit" loading={isSaving} disabled={!isDirty}>
          Save changes
        </StoreButton>
      </form>
    </section>
  );
};

export default CustomerProfile;
