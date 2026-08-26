import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { login, googleLogin } from '@/services/authService';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const AdminLogin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      toast.success('Login successful');
      // Redirect to admin dashboard or home
      navigate('/admin');
    } catch (err: any) {
      const message = err.response?.data?.error || 'Login failed';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    try {
      googleLogin(); // This will redirect to Google OAuth
    } catch (err: any) {
      setGoogleLoading(false);
      const message = err.response?.data?.error || 'Google login failed';
      toast.error(message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-88px)] bg-background flex items-center justify-center">
      <div className="w-full max-w-md space-y-6 p-6 bg-card/80 backdrop-blur rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-center text-primary">Admin Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="antonypeterke@gmail.com"
              {...register('email')}
              className={errors.email ? 'border-destructive' : ''}
            />
            {errors.email && (
              <p className="text-text-sm text-destructive mt-1">{errors.email.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              {...register('password')}
              className={errors.password ? 'border-destructive' : ''}
            />
            {errors.password && (
              <p className="text-text-sm text-destructive mt-1">{errors.password.message}</p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
        
        {/* Google Sign-In Section */}
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="w-full h-px bg-border"></div>
            <span className="px-2 text-text-sm text-text-muted">OR</span>
            <div className="w-full h-px bg-border"></div>
          </div>
          
          <Button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3"
            disabled={googleLoading}
          >
            {googleLoading ? (
              <Loader className="h-4 w-4" />
            ) : (
              <>
                {/* Using text instead of icon since Google icon name may vary */}
                <span className="text-[22px] font-bold">G</span>
                <span className="text-left ml-2">Continue with Google</span>
              </>
            )}
          </Button>
        </div>
        
        <p className="text-text-sm text-center">
          Don't have an account? Contact system administrator.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
