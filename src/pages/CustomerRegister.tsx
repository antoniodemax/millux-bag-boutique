import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { customerRegister, customerLogin } from '@/services/authService';
import { toast } from '@/components/ui/sonner';
import { Logo } from '@/components/brand/Logo';
import { StoreButton } from '@/components/store/Button';
import { Field, inputClass } from '@/components/store/Primitives';

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone: z.string().optional(),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const CustomerRegister = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', phone: '' },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setServerError(null);
    try {
      await customerRegister({
        email: data.email,
        password: data.password,
        name: data.name,
        phone: data.phone || undefined,
      });
      toast.success('Account created');
      await customerLogin({ email: data.email, password: data.password });
      navigate('/');
    } catch (err) {
      const message = isAxiosError(err) && typeof err.response?.data?.error === 'string' ? err.response.data.error : 'Registration failed';
      setServerError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="site-container flex flex-col items-center py-14 sm:py-20">
      <Logo on="light" className="h-12 sm:h-14" />
      <div className="mt-10 w-full max-w-[420px]">
        <p className="brand-label text-gold-deep">Account</p>
        <h1 className="mt-2 text-display-sm">Create an account</h1>
        <p className="mt-2 text-sm text-soft">Place orders and keep your history in one place.</p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 space-y-6">
          <Field id="name" label="Full name" error={errors.name?.message}>
            <input
              id="name"
              type="text"
              autoComplete="name"
              placeholder="Your name"
              aria-invalid={errors.name ? 'true' : undefined}
              aria-describedby={errors.name ? 'name-error' : undefined}
              className={inputClass}
              {...register('name')}
            />
          </Field>
          <Field id="email" label="Email" error={errors.email?.message}>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              aria-invalid={errors.email ? 'true' : undefined}
              aria-describedby={errors.email ? 'email-error' : undefined}
              className={inputClass}
              {...register('email')}
            />
          </Field>
          <Field id="password" label="Password" error={errors.password?.message} hint="At least 8 characters">
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="Create a password"
              aria-invalid={errors.password ? 'true' : undefined}
              aria-describedby={errors.password ? 'password-error' : undefined}
              className={inputClass}
              {...register('password')}
            />
          </Field>
          <Field id="phone" label="Phone" optional hint="Used to reach you on WhatsApp about your orders">
            <input
              id="phone"
              type="tel"
              autoComplete="tel"
              placeholder="+254 700 000 000"
              className={inputClass}
              {...register('phone')}
            />
          </Field>

          {serverError && (
            <p role="alert" className="border border-danger/30 bg-danger-tint px-4 py-3 text-sm text-danger">
              {serverError}
            </p>
          )}

          <StoreButton type="submit" full size="lg" loading={isLoading}>
            Create account
          </StoreButton>
        </form>

        <p className="mt-8 text-center text-sm text-soft">
          Already have an account?{' '}
          <Link to="/customer/login" className="brand-link">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default CustomerRegister;
