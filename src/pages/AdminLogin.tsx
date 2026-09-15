import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { ArrowLeft } from 'lucide-react';
import { login, googleLogin, me } from '@/services/authService';
import { toast } from '@/components/ui/sonner';
import { Logo } from '@/components/brand/Logo';
import { StoreButton } from '@/components/store/Button';
import { Field, inputClass } from '@/components/store/Primitives';
import { GoogleButton, OrDivider } from '@/components/store/GoogleButton';
import { Loader } from '@/components/ui/Loader';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const OAUTH_ERRORS: Record<string, string> = {
  google_auth_failed: 'Google sign-in did not complete. Use the authorised Millux admin Google account and try again.',
};

const capabilities = ['Catalogue and stock', 'Orders and fulfilment', 'Customers', 'Sales analytics'];

/**
 * Admin sign-in. Split composition: the dark panel carries the white lockup
 * (its native setting) and the operational context; the light panel is the
 * form. Collapses to a single column with a compact dark header on phones.
 */
const AdminLogin = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [serverError, setServerError] = useState<string | null>(null);
  const oauthError = searchParams.get('error');
  const oauthMessage = oauthError ? OAUTH_ERRORS[oauthError] ?? 'Sign-in failed. Please try again.' : null;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  // Already signed in as admin → straight to the dashboard
  useEffect(() => {
    let cancelled = false;
    me()
      .then((user) => {
        if (!cancelled && user?.role === 'admin') navigate('/admin', { replace: true });
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setCheckingSession(false);
      });
    return () => { cancelled = true; };
  }, [navigate]);

  useEffect(() => {
    if (oauthMessage) {
      setServerError(oauthMessage);
      toast.error('Google sign-in did not complete');
    }
  }, [oauthMessage]);

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setServerError(null);
    try {
      const user = await login(data.email, data.password);
      if (user.role !== 'admin') {
        setServerError('This account does not have admin access.');
        toast.error('This account does not have admin access');
        return;
      }
      toast.success('Welcome back');
      navigate('/admin', { replace: true });
    } catch (err) {
      const message = isAxiosError(err) && typeof err.response?.data?.error === 'string'
        ? err.response.data.error
        : err instanceof Error && err.message ? err.message : 'Login failed';
      setServerError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    googleLogin(); // full-page redirect to the backend OAuth endpoint
  };

  if (checkingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone">
        <Loader />
      </div>
    );
  }

  return (
    <div className="grid min-h-screen bg-paper lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      {/* ---------- Brand panel ---------- */}
      <aside className="relative flex flex-col justify-between bg-ink px-6 py-8 text-paper sm:px-10 lg:min-h-screen lg:px-14 lg:py-12">
        <div className="flex items-center justify-between">
          <Logo on="dark" className="h-12 sm:h-14 lg:h-16" linked={false} />
          <span className="brand-label text-gold-bright">Admin</span>
        </div>

        <div className="hidden lg:block">
          <p className="brand-label text-gold-bright">Back office</p>
          <h2 className="mt-4 font-display text-4xl leading-tight text-paper">
            Run the house from one place.
          </h2>
          <ul className="mt-8 space-y-3 border-t border-paper/15 pt-8">
            {capabilities.map((c) => (
              <li key={c} className="flex items-center gap-3 text-sm text-paper/75">
                <span className="h-1.5 w-1.5 rounded-full bg-gold-bright" aria-hidden="true" />
                {c}
              </li>
            ))}
          </ul>
        </div>

        <Link to="/" className="brand-label mt-8 inline-flex items-center gap-2 text-paper/70 transition-colors hover:text-gold-bright focus-ring lg:mt-0">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to store
        </Link>
      </aside>

      {/* ---------- Form panel ---------- */}
      <main className="flex items-center justify-center px-4 py-12 sm:px-8 lg:px-16 lg:py-20">
        <div className="w-full max-w-[440px]">
          <p className="brand-label text-gold-deep">Staff sign in</p>
          <h1 className="mt-2 text-display-md">Welcome back</h1>
          <p className="mt-3 text-sm text-soft">Sign in with your Millux staff account to manage the store.</p>

          {serverError && (
            <p role="alert" className="mt-6 border border-danger/30 bg-danger-tint px-4 py-3 text-sm text-danger">
              {serverError}
            </p>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 space-y-5">
            <Field id="email" label="Email" error={errors.email?.message}>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@millux.com"
                aria-invalid={errors.email ? 'true' : undefined}
                aria-describedby={errors.email ? 'email-error' : undefined}
                className={inputClass}
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
                className={inputClass}
                {...register('password')}
              />
            </Field>
            <StoreButton type="submit" full size="lg" loading={isLoading} disabled={googleLoading}>
              Sign in
            </StoreButton>
          </form>

          <div className="mt-6 space-y-6">
            <OrDivider />
            <GoogleButton onClick={handleGoogleLogin} loading={googleLoading} disabled={isLoading} />
          </div>

          <p className="mt-8 text-xs leading-relaxed text-faint">
            Access is restricted to Millux staff. Ask the store owner if you need an account.
          </p>
        </div>
      </main>
    </div>
  );
};

export default AdminLogin;
