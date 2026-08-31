import { useEffect, useState } from 'react';
import { getCustomerOrders, customerLogout } from '@/services/authService';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Loader } from '@/components/ui/Loader';

const getStatusClass = (status: string): string => {
  switch (status) {
    case 'pending':
      return 'px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-800';
    case 'processing':
      return 'px-2 py-1 text-xs rounded bg-blue-100 text-blue-800';
    case 'shipped':
      return 'px-2 py-1 text-xs rounded bg-indigo-100 text-indigo-800';
    case 'delivered':
      return 'px-2 py-1 text-xs rounded bg-green-100 text-green-800';
    case 'cancelled':
      return 'px-2 py-1 text-xs rounded bg-red-100 text-red-800';
    default:
      return 'px-2 py-1 text-xs rounded bg-gray-100 text-gray-800';
  }
};

const CustomerOrderHistory = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadOrderHistory = async () => {
    setIsLoading(true);
    try {
      const orderHistory = await getCustomerOrders();
      setOrders(orderHistory);
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to load order history';
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
    loadOrderHistory();
  }, []);

  if (isLoading) return <div className="flex items-center justify-center min-h-[calc(100vh-88px)]">Loading...</div>;

  return (
    <div className="min-h-[calc(100vh-88px)] bg-background">
      <div className="flex min-h-[calc(100vh-88px)]">
        {/* Sidebar - simplified for order history */}
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
                className="flex items-center px-3 py-2 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 active"
              >
                Order History
              </a>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-primary">Order History</h1>
            <p className="text-text-sm mt-2">View your past orders</p>
          </div>

          <div className="mb-4 flex justify-end">
            <Button
              variant="outline"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>

          {orders.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">You haven't placed any orders yet.</p>
          ) : (
            <div>
              <Table className="min-w-full divide-y divide-muted">
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order: any) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium truncate w-20">
                        {order.id.substring(0, 8)}...
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {order.items?.length || 0} item{
                          order.items?.length !== 1 ? 's' : ''
                        }
                      </TableCell>
                      <TableCell className="whitespace-nowrap">${order.totalAmount.toFixed(2)}</TableCell>
                      <TableCell>
                        <span
                          className={getStatusClass(order.status)}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CustomerOrderHistory;