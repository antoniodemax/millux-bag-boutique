import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrders, Order, getOrderById, updateOrderStatus } from '@/services/orderService';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Loader } from '@/components/ui/Loader';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

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

export const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<string>('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const filters: any = {};
      if (searchTerm) filters.searchTerm = searchTerm;
      if (statusFilter) filters.status = statusFilter;
      if (startDate) filters.startDate = startDate;
      if (endDate) filters.endDate = endDate;
      const data = await getOrders(filters);
      setOrders(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch orders');
      toast({
        title: 'Error',
        description: 'Failed to fetch orders',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [searchTerm, statusFilter, startDate, endDate]);

  const handleViewOrder = async (id: string) => {
    try {
      const order = await getOrderById(id);
      setSelectedOrder(order);
    } catch (err) {
      console.error(err);
      toast({
        title: 'Error',
        description: 'Failed to load order details',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    setUpdatingOrderId(id);
    setNewStatus(status);
    try {
      const updatedOrder = await updateOrderStatus(id, status);
      // Update the order in the list
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === id ? { ...order, status: updatedOrder.status } : order
        )
      );
      // Close detail view if it's the same order
      if (selectedOrder?.id === id) {
        setSelectedOrder({ ...selectedOrder, status: updatedOrder.status });
      }
      toast({
        title: 'Success',
        description: 'Order status updated successfully',
      });
    } catch (err) {
      console.error(err);
      toast({
        title: 'Error',
        description: 'Failed to update order status',
        variant: 'destructive',
      });
    } finally {
      setUpdatingOrderId(null);
      setNewStatus('');
    }
  };

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  if (loading) return <Loader />;

  return (
    <Card className="mb-6">
      <div className="flex flex-wrap items-center mb-4">
        <h2 className="text-xl font-semibold">Orders</h2>
        <div className="flex-1 space-x-4 mt-4 md:mt-0">
          <Input
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-48 md:w-64"
          />
          <DropdownMenu>
            <DropdownMenuTrigger className="w-32">
              <span className="flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                {statusFilter ? statusOptions.find(opt => opt.value === statusFilter)?.label : 'All Statuses'}
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-32">
              <DropdownMenuLabel className="px-3 py-2 text-sm font-medium text-gray-500">
                Filter by Status
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="my-1" />
              {statusOptions.map((option) => (
                <DropdownMenuCheckboxItem
                  key={option.value}
                  checked={statusFilter === option.value}
                  onClick={() => setStatusFilter(option.value)}
                >
                  {option.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="flex space-x-3">
            <Input
              type="date"
              placeholder="Start Date"
              value={startDate ? startDate.toISOString().split('T')[0] : ''}
              onChange={(e) => {
                const date = e.target.value ? new Date(e.target.value) : null;
                setStartDate(date);
              }}
              className="w-32"
            />
            <Input
              type="date"
              placeholder="End Date"
              value={endDate ? endDate.toISOString().split('T')[0] : ''}
              onChange={(e) => {
                const date = e.target.value ? new Date(e.target.value) : null;
                setEndDate(date);
              }}
              className="w-32"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-text-muted">{error}</p>
        </div>
      ) : (
        <Table className="min-w-full divide-y divide-muted">
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium truncate w-20">
                  {order.id.substring(0, 8)}...
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {new Date(order.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {order.whatsappMessage || 'Guest Customer'}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {order.items?.length || 0} item{
                    order.items?.length !== 1 ? 's' : ''
                  }
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  £{order.totalAmount.toFixed(2)}
                </TableCell>
                <TableCell className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="View order"
                    onClick={() => handleViewOrder(order.id)}
                  >
                    <Button variant="ghost" size="icon">
                      <Button variant="ghost" size="icon">
                        <Button variant="ghost" size="icon">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </Button>
                      </Button>
                    </Button>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="p-1">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0h-3m5-7.5a4.5 4.5 0 01-7.5 7.5" />
                      </svg>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48 right-0">
                      {statusOptions.map((status) => (
                        <DropdownMenuItem
                          key={status.value}
                          onClick={() => handleUpdateStatus(order.id, status.value)}
                          disabled={updatingOrderId === order.id}
                        >
                          {updatingOrderId === order.id ? `Updating to ${status.label}...` : status.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Order Details Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" onClick={() => {}}>View Details</Button>
        </DialogTrigger>
        <DialogContent className="w-[90vw] max-w-[800px]">
          <DialogHeader>
            <DialogTitle>
              Order Details
            </DialogTitle>
            <DialogDescription>
              Information for order {selectedOrder?.id}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder ? (
            <>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium">Order Information</h3>
                    <p><strong>Order ID:</strong> {selectedOrder.id}</p>
                    <p><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                    <p><strong>Status:</strong>
                      <span className={getStatusClass(selectedOrder.status)}>
                        {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                      </span>
                    </p>
                    {selectedOrder.whatsappMessage && (
                      <p><strong>WhatsApp Message:</strong> {selectedOrder.whatsappMessage}</p>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">Customer</h3>
                    <p>{selectedOrder.whatsappMessage || 'Guest Customer'}</p>
                  </div>
                </div>

                {selectedOrder.items && selectedOrder.items.length > 0 && (
                  <>
                    <h3 className="font-medium">Order Items</h3>
                    <Table className="mt-4">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedOrder.items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <img
                                  src={item.product.images[0] || '/images/handbags-category.png'}
                                  alt={item.product.name}
                                  className="h-12 w-12 object-cover rounded"
                                />
                                <div>
                                  <p className="font-medium">{item.product.name}</p>
                                  <p className="text-xs text-muted-foreground">{item.product.slug}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>${item.priceAtPurchase.toFixed(2)}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>${(item.priceAtPurchase * item.quantity).toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="border-t">
                          <TableCell colSpan={3} className="text-right font-bold">
                            Total:
                          </TableCell>
                          <TableCell className="font-bold">${selectedOrder.totalAmount.toFixed(2)}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </>
                )}

                <div className="flex justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedOrder(null)}
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      // Navigate to edit order page (if implemented)
                      navigate(`/admin/orders/edit/${selectedOrder?.id}`);
                    }}
                  >
                    Edit Order
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <p>Loading order details...</p>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default AdminOrders;