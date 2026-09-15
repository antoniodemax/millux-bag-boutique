import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { login, googleLogin, me } from '@/services/authService';
import { toast } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
    } catch (err: any) {
      const message = err?.response?.data?.error || err?.message || 'Login failed';
      toast.error(typeof message === 'string' ? message : 'Login failed');
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
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <span className="font-playfair text-3xl tracking-[0.3em] text-[#1F1F1F]">MILLUX</span>
            <span className="block text-[9px] uppercase tracking-[0.36em] text-[#B68D40] mt-1">Collections</span>
          </Link>
          <p className="text-[10px] uppercase tracking-[0.24em] text-[#B68D40] mt-4">Admin</p>
          <h1 className="font-playfair text-3xl font-semibold text-[#1F1F1F] mt-2 !text-3xl">Sign in</h1>
        </div>

        <div className="bg-white border border-[#ECE7E0] rounded-xl shadow-sm p-8 space-y-6">
          {oauthMessage && (
            <p className="text-sm text-[#7A3B3B] bg-[#F6ECEC] rounded-md px-3 py-2 !leading-normal md:!text-sm">
              {oauthMessage}
            </p>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <Label htmlFor="email" className="text-xs text-[#6B6B6B]">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@millux.com"
                className="mt-1.5 bg-white border-[#ECE7E0]"
                {...register('email')}
              />
              {errors.email && <p className="text-xs text-destructive mt-1 !leading-normal md:!text-xs">{errors.email.message}</p>}
            </div>
            <div>
              <Label htmlFor="password" className="text-xs text-[#6B6B6B]">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="Your password"
                className="mt-1.5 bg-white border-[#ECE7E0]"
                {...register('password')}
              />
              {errors.password && <p className="text-xs text-destructive mt-1 !leading-normal md:!text-xs">{errors.password.message}</p>}
            </div>
            <Button
              type="submit"
              disabled={isLoading || googleLoading}
              className="w-full bg-[#1F1F1F] hover:bg-[#B68D40] text-[#FAF8F5] tracking-wide"
            >
              {isLoading ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[#ECE7E0]" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#999999]">or</span>
            <div className="flex-1 h-px bg-[#ECE7E0]" />
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleLogin}
            disabled={isLoading || googleLoading}
            className="w-full border-[#ECE7E0] text-[#1F1F1F] hover:bg-[#FAF8F5]"
          >
            {googleLoading ? (
              <Loader />
            ) : (
              <>
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
                  <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.6 3.8-5.5 3.8-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.2 14.6 2.2 12 2.2 6.6 2.2 2.3 6.6 2.3 12S6.6 21.8 12 21.8c5.6 0 9.3-3.9 9.3-9.5 0-.6-.1-1.1-.2-1.6H12z" />
                </svg>
                Continue with Google
              </>
            )}
          </Button>

          <p className="text-xs text-center text-[#999999] !leading-normal md:!text-xs">
            Access is restricted to Millux staff. Contact the store owner for an account.
          </p>
        </div>

        <p className="text-center mt-6">
          <Link to="/" className="text-xs uppercase tracking-[0.12em] text-[#6B6B6B] hover:text-[#B68D40]">
            ← Back to store
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
