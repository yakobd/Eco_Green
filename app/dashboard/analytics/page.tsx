'use client';

import { useEffect, useState } from 'react';
import { formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/analytics');
      const data = await res.json();
      setAnalytics(data);
    } catch (error) {
      toast.error('Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">📈 Organization Analytics</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {analytics?.organizations.map((org: any) => (
          <div key={org.id} className="card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{org.name}</h3>
                <p className="text-sm text-gray-600">{org.email}</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                Active
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-600 mb-1">Total Orders</p>
                <p className="text-2xl font-bold text-blue-900">{org.totalOrders}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-green-600 mb-1">Total Spent</p>
                <p className="text-2xl font-bold text-green-900">
                  {formatCurrency(org.totalSpent)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="text-center p-2 bg-yellow-50 rounded">
                <p className="text-xs text-yellow-600">Pending</p>
                <p className="text-lg font-bold text-yellow-900">{org.pending}</p>
              </div>
              <div className="text-center p-2 bg-blue-50 rounded">
                <p className="text-xs text-blue-600">Approved</p>
                <p className="text-lg font-bold text-blue-900">{org.approved}</p>
              </div>
              <div className="text-center p-2 bg-green-50 rounded">
                <p className="text-xs text-green-600">Delivered</p>
                <p className="text-lg font-bold text-green-900">{org.delivered}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Top Products by Organization</h2>
        <div className="space-y-4">
          {analytics?.topProducts.map((item: any, index: number) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <p className="font-medium text-gray-900">{item.product}</p>
                <p className="text-sm text-gray-600">{item.organization}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Orders: {item.orders}</p>
                <p className="font-bold text-green-600">{formatCurrency(item.revenue)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
