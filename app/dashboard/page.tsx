'use client';

import { useEffect, useState } from 'react';
import { formatCurrency, formatDateTime } from '@/lib/utils';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
    fetchStats();
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

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/dashboard/stats');
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return <div>Loading...</div>;
  }

  const orderStatusData = stats.recentOrders.reduce((acc: any, order: any) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});

  const totalOrders = Object.values(orderStatusData).reduce((a: any, b: any) => a + b, 0) as number;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-gray-600 mt-1">Here's what's happening with your {user?.role === 'USER' ? 'orders' : 'business'} today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card bg-gradient-to-br from-blue-50 to-blue-100">
          <p className="text-sm text-blue-600 mb-1">Total Products</p>
          <p className="text-3xl font-bold text-blue-900">{stats.totalProducts}</p>
        </div>

        <div className="card bg-gradient-to-br from-green-50 to-green-100">
          <p className="text-sm text-green-600 mb-1">{user?.role === 'USER' ? 'My Orders' : 'Total Orders'}</p>
          <p className="text-3xl font-bold text-green-900">{stats.totalOrders}</p>
        </div>

        {user?.role === 'SUPER_ADMIN' && (
          <div className="card bg-gradient-to-br from-purple-50 to-purple-100">
            <p className="text-sm text-purple-600 mb-1">Total Users</p>
            <p className="text-3xl font-bold text-purple-900">{stats.totalUsers}</p>
          </div>
        )}

        <div className="card bg-gradient-to-br from-yellow-50 to-yellow-100">
          <p className="text-sm text-yellow-600 mb-1">{user?.role === 'USER' ? 'Total Spent' : 'Total Revenue'}</p>
          <p className="text-3xl font-bold text-yellow-900">
            {formatCurrency(stats.totalRevenue)}
          </p>
        </div>
      </div>

      {user?.role === 'SUPER_ADMIN' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">📊 Order Status Distribution</h2>
            <div className="space-y-3">
              {Object.entries(orderStatusData).map(([status, count]: [string, any]) => {
                const percentage = ((count / totalOrders) * 100).toFixed(1);
                const colors: any = {
                  PENDING: 'bg-yellow-500',
                  APPROVED: 'bg-blue-500',
                  REJECTED: 'bg-red-500',
                  DELIVERED: 'bg-green-500',
                };
                return (
                  <div key={status}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{status}</span>
                      <span className="text-gray-600">{count} ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`${colors[status]} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">🎯 Quick Stats</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Delivered Orders</span>
                <span className="text-2xl font-bold text-green-600">
                  {orderStatusData.DELIVERED || 0}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Pending Orders</span>
                <span className="text-2xl font-bold text-yellow-600">
                  {orderStatusData.PENDING || 0}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Approved Orders</span>
                <span className="text-2xl font-bold text-blue-600">
                  {orderStatusData.APPROVED || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {user?.role === 'USER' ? 'My Recent Orders' : 'Recent Orders'}
        </h2>
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
                  Total
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map((order: any) => (
                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
