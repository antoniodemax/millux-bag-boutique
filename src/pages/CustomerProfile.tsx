import { useEffect, useState } from 'react';
import { getCustomerProfile, customerLogout } from '@/services/authService';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';

const CustomerProfile = () => {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadCustomerProfile = async () => {
    setIsLoading(true);
    try {
      const profile = await getCustomerProfile();
      setCustomer(profile);
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to load profile';
      toast.error(message);
      // Redirect to login if not authenticated
      navigate('/customer/login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await customerLogout();
      toast.success('Logged out successfully');
      navigate('/customer/login');
    } catch (err: any) {
      const message = err.response?.data?.error || 'Logout failed';
      toast.error(message);
    }
  };

  useEffect(() => {
    loadCustomerProfile();
  }, []);

  if (isLoading) return <div className="flex items-center justify-center min-h-[calc(100vh-88px)]">Loading...</div>;

  return (
    <div className="min-h-[calc(100vh-88px)] bg-background">
      <div className="flex min-h-[calc(100vh-88px)]">
        {/* Sidebar - simplified for customer profile */}
        <aside className="w-64 bg-white border-r shadow-sm">
          <div className="p-6">
            <h2 className="text-xl font-bold text-primary">My Account</h2>
            <nav className="mt-6 space-y-2">
              <a
                href="#"
                className="flex items-center px-3 py-2 rounded text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Profile
              </a>
              <a
                href="#"
                className="flex items-center px-3 py-2 rounded text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Order History
              </a>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-primary">My Profile</h1>
            <p className="text-text-sm mt-2">Account information</p>
          </div>

          {customer ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <p className="block w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900">
                  {customer.name || 'Not provided'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <p className="block w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900">
                  {customer.email || 'Not provided'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <p className="block w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900">
                  {customer.phone || 'Not provided'}
                </p>
              </div>
              <div className="justify-end">
                <Button
                  variant="outline"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">Loading profile...</p>
          )}
        </main>
      </div>
    </div>
  );
};

export default CustomerProfile;