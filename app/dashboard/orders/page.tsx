'use client';

import { useEffect, useState } from 'react';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchUser();
    fetchOrders();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      setUser(data.user);
    } catch (error) {
      console.error('Failed to fetch user');
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      setOrders(data.orders);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error('Failed to update order');

      toast.success('Order status updated');
      fetchOrders();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Orders</h1>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  Product
                </th>
                {user?.role !== 'USER' && (
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                    Customer
                  </th>
                )}
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  Quantity
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  Total Price
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  Date
                </th>
                {user?.role !== 'USER' && (
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-gray-100">
                  <td className="py-3 px-4 text-sm">{order.product.name}</td>
                  {user?.role !== 'USER' && (
                    <td className="py-3 px-4 text-sm">{order.user.name}</td>
                  )}
                  <td className="py-3 px-4 text-sm">{order.quantity}</td>
                  <td className="py-3 px-4 text-sm">
                    {formatCurrency(order.totalPrice)}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`badge badge-${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    {formatDateTime(order.createdAt)}
                  </td>
                  {user?.role !== 'USER' && (
                    <td className="py-3 px-4">
                      {order.status === 'PENDING' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => updateOrderStatus(order.id, 'APPROVED')}
                            className="text-xs btn btn-primary"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updateOrderStatus(order.id, 'REJECTED')}
                            className="text-xs btn btn-danger"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                      {order.status === 'APPROVED' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'DELIVERED')}
                          className="text-xs btn btn-primary"
                        >
                          Mark Delivered
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
