import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { login, googleLogin, me } from '@/services/authService';
import { toast } from '@/components/ui/sonner';
import { Logo } from '@/components/brand/Logo';
import { StoreButton } from '@/components/store/Button';
import { Field, inputClass } from '@/components/store/Primitives';
import { Loader } from '@/components/ui/Loader';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const OAUTH_ERRORS: Record<string, string> = {
  google_auth_failed: 'Google sign-in failed. Make sure you are using the authorised admin Google account.',
};

const AdminLogin = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
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
    if (oauthMessage) toast.error(oauthMessage);
  }, [oauthMessage]);

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const user = await login(data.email, data.password);
      if (user.role !== 'admin') {
        toast.error('This account does not have admin access');
        return;
      }
      toast.success('Welcome back');
      navigate('/admin', { replace: true });
    } catch (err) {
      const message = isAxiosError(err) && typeof err.response?.data?.error === 'string'
        ? err.response.data.error
        : err instanceof Error && err.message ? err.message : 'Login failed';
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
    <div className="flex min-h-screen items-center justify-center bg-stone px-4 py-16">
      <div className="w-full max-w-[420px]">
        <div className="flex flex-col items-center text-center">
          <Logo on="light" className="h-12" />
          <p className="brand-label mt-8 text-gold-deep">Admin</p>
          <h1 className="mt-2 text-display-sm">Sign in</h1>
        </div>

        <div className="mt-8 space-y-6 border border-line bg-paper p-6 sm:p-8">
          {oauthMessage && (
            <p role="alert" className="border border-danger/30 bg-danger-tint px-4 py-3 text-sm text-danger">
              {oauthMessage}
            </p>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
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

          <div className="flex items-center gap-3" aria-hidden="true">
            <div className="h-px flex-1 bg-line" />
            <span className="brand-label text-faint">or</span>
            <div className="h-px flex-1 bg-line" />
          </div>

          <StoreButton
            type="button"
            variant="secondary"
            full
            size="lg"
            onClick={handleGoogleLogin}
            loading={googleLoading}
            disabled={isLoading}
          >
            {!googleLoading && (
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.6 3.8-5.5 3.8-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.2 14.6 2.2 12 2.2 6.6 2.2 2.3 6.6 2.3 12S6.6 21.8 12 21.8c5.6 0 9.3-3.9 9.3-9.5 0-.6-.1-1.1-.2-1.6H12z" />
              </svg>
            )}
            Continue with Google
          </StoreButton>

          <p className="text-center text-xs leading-relaxed text-faint">
            Access is restricted to Millux staff. Contact the store owner for an account.
          </p>
        </div>

        <p className="mt-8 text-center">
          <Link to="/" className="brand-link">Back to store</Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
