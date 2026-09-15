import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { me, registerUser, User } from '@/services/authService';
import { PageHeader, Panel } from '@/components/admin/ui';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const WHATSAPP_NUMBER = '+254 723 425 778';

const newUserSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['admin', 'user']),
});

type NewUserValues = z.infer<typeof newUserSchema>;

const Field = ({ label, value }: { label: string; value: string }) => (
  <div>
    <dt className="text-[11px] uppercase tracking-[0.14em] text-[#8C887F]">{label}</dt>
    <dd className="text-sm text-[#0A0A0A] mt-1 break-all">{value}</dd>
  </div>
);

const AdminSettings = () => {
  const [user, setUser] = useState<User | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    me().then(setUser).catch(() => setUser(null));
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewUserValues>({
    resolver: zodResolver(newUserSchema),
    defaultValues: { email: '', password: '', role: 'admin' },
  });

  const onSubmit = async (values: NewUserValues) => {
    setSubmitting(true);
    try {
      const created = await registerUser(values.email, values.password, values.role);
      toast.success(`Account created for ${created.email}`);
      reset({ email: '', password: '', role: 'admin' });
    } catch (err: any) {
      const status = err?.response?.status;
      const message =
        status === 409
          ? 'A user with this email already exists'
          : err?.response?.data?.error?.message || err?.response?.data?.error || 'Could not create the account';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader title="Settings" description="Your account and the store's current configuration." />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Panel title="Account" description="The staff account you are signed in with">
          <dl className="space-y-4">
            <Field label="Email" value={user?.email ?? '—'} />
            <Field label="Role" value={user?.role ?? '—'} />
          </dl>
        </Panel>

        <Panel title="Store" description="Read-only configuration for this deployment">
          <dl className="space-y-4">
            <Field label="API base URL" value={API_BASE_URL} />
            <Field label="WhatsApp orders" value={WHATSAPP_NUMBER} />
            <Field label="Currency" value="GBP (£)" />
          </dl>
        </Panel>

        <Panel
          title="Create staff account"
          description="Add another admin who can sign in to this panel"
          className="lg:col-span-2"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl">
            <div>
              <Label htmlFor="new-email" className="text-xs text-[#5B5852]">Email</Label>
              <Input
                id="new-email"
                type="email"
                autoComplete="off"
                placeholder="name@millux.com"
                className="mt-1.5 bg-white border-[#E4E0D7]"
                {...register('email')}
              />
              {errors.email && <p className="text-xs text-destructive mt-1 !leading-normal md:!text-xs">{errors.email.message}</p>}
            </div>
            <div>
              <Label htmlFor="new-password" className="text-xs text-[#5B5852]">Password</Label>
              <Input
                id="new-password"
                type="password"
                autoComplete="new-password"
                placeholder="At least 8 characters"
                className="mt-1.5 bg-white border-[#E4E0D7]"
                {...register('password')}
              />
              {errors.password && <p className="text-xs text-destructive mt-1 !leading-normal md:!text-xs">{errors.password.message}</p>}
            </div>
            <div>
              <Label htmlFor="new-role" className="text-xs text-[#5B5852]">Role</Label>
              <select
                id="new-role"
                className="mt-1.5 flex h-10 w-full rounded-md border border-[#E4E0D7] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A27627]/40"
                {...register('role')}
              >
                <option value="admin">Admin</option>
                <option value="user">User (no admin access)</option>
              </select>
            </div>
            <div className="md:col-span-3">
              <Button
                type="submit"
                disabled={submitting}
                className="bg-[#0A0A0A] hover:bg-[#A27627] text-[#F5F2EC]"
              >
                {submitting ? 'Creating…' : 'Create account'}
              </Button>
            </div>
          </form>
        </Panel>
      </div>
    </div>
  );
};

export default AdminSettings;
