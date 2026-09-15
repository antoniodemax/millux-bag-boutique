import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { customerLogin, googleCustomerLogin } from '@/services/authService';
import { toast } from '@/components/ui/sonner';
import { Logo } from '@/components/brand/Logo';
import { StoreButton } from '@/components/store/Button';
import { Field, inputClass } from '@/components/store/Primitives';
import { GoogleButton, OrDivider } from '@/components/store/GoogleButton';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const CustomerLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || '/';
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const oauthFailed = searchParams.get('error') === 'google_auth_failed';

  useEffect(() => {
    if (oauthFailed) {
      setServerError('Google sign-in did not complete. Please try again.');
      toast.error('Google sign-in did not complete');
    }
  }, [oauthFailed]);

  const handleGoogle = () => {
    setGoogleLoading(true);
    googleCustomerLogin(redirectTo === '/' ? '/customer/profile' : redirectTo);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setServerError(null);
    try {
      await customerLogin({ email: data.email, password: data.password });
      toast.success('Welcome back');
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const message = isAxiosError(err) && typeof err.response?.data?.error === 'string' ? err.response.data.error : 'Login failed';
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
        <h1 className="mt-2 text-display-sm">Sign in</h1>
        <p className="mt-2 text-sm text-soft">Sign in to place orders and follow their progress.</p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 space-y-6">
          <Field id="email" label="Email" error={errors.email?.message}>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              aria-invalid={errors.email ? 'true' : undefined}
              aria-describedby={errors.email ? 'email-error' : undefined}
              className={cn(inputClass)}
              {...register('email')}
            />
          </Field>
          <Field id="password" label="Password" error={errors.password?.message}>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="Your password"
              aria-invalid={errors.password ? 'true' : undefined}
              aria-describedby={errors.password ? 'password-error' : undefined}
              className={cn(inputClass)}
              {...register('password')}
            />
          </Field>

          {serverError && (
            <p role="alert" className="border border-danger/30 bg-danger-tint px-4 py-3 text-sm text-danger">
              {serverError}
            </p>
          )}

          <StoreButton type="submit" full size="lg" loading={isLoading} disabled={googleLoading}>
            Sign in
          </StoreButton>
        </form>

        <div className="mt-6 space-y-6">
          <OrDivider />
          <GoogleButton onClick={handleGoogle} loading={googleLoading} disabled={isLoading} />
        </div>

        <p className="mt-8 text-center text-sm text-soft">
          New to Millux?{' '}
          <Link to="/customer/register" className="brand-link">Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default CustomerLogin;
