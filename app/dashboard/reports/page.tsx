'use client';

import { useEffect, useState } from 'react';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function ReportsPage() {
  const [period, setPeriod] = useState('daily');
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [organizationStats, setOrganizationStats] = useState<any[]>([]);

  useEffect(() => {
    fetchReport();
  }, [period]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reports?period=${period}`);
      const data = await res.json();
      setReport(data);
      
      // Calculate organization statistics
      const orgStats: any = {};
      data.orders.forEach((order: any) => {
        const orgName = order.user.name;
        if (!orgStats[orgName]) {
          orgStats[orgName] = {
            name: orgName,
            email: order.user.email,
            totalOrders: 0,
            totalSpent: 0,
            deliveredOrders: 0,
            pendingOrders: 0,
          };
        }
        orgStats[orgName].totalOrders++;
        orgStats[orgName].totalSpent += order.totalPrice;
        if (order.status === 'DELIVERED') orgStats[orgName].deliveredOrders++;
        if (order.status === 'PENDING') orgStats[orgName].pendingOrders++;
      });
      
      setOrganizationStats(Object.values(orgStats));
    } catch (error) {
      toast.error('Failed to fetch report');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Reports</h1>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Period
        </label>
        <select
          className="input max-w-xs"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
        >
          <option value="daily">Daily</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
          <p className="text-3xl font-bold text-green-600">
            {formatCurrency(report.totalRevenue)}
          </p>
        </div>

        <div className="card">
          <p className="text-sm text-gray-600 mb-1">Total Orders</p>
          <p className="text-3xl font-bold text-gray-900">{report.totalOrders}</p>
        </div>

        <div className="card">
          <p className="text-sm text-gray-600 mb-1">Pending Orders</p>
          <p className="text-3xl font-bold text-yellow-600">
            {report.pendingOrders}
          </p>
        </div>

        <div className="card">
          <p className="text-sm text-gray-600 mb-1">Delivered Orders</p>
          <p className="text-3xl font-bold text-green-600">
            {report.deliveredOrders}
          </p>
        </div>
      </div>

      {/* Organization Statistics */}
      <div className="card mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">📊 Organization Statistics</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  Organization
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  Total Orders
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  Total Spent
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  Delivered
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  Pending
                </th>
              </tr>
            </thead>
            <tbody>
              {organizationStats.map((org: any, index: number) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{org.name}</p>
                      <p className="text-xs text-gray-500">{org.email}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm font-semibold">{org.totalOrders}</td>
                  <td className="py-3 px-4 text-sm font-semibold text-green-600">
                    {formatCurrency(org.totalSpent)}
                  </td>
                  <td className="py-3 px-4 text-sm">{org.deliveredOrders}</td>
                  <td className="py-3 px-4 text-sm">{org.pendingOrders}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
          <button
            onClick={() => {
              const csv = generateCSV(report.orders);
              downloadCSV(csv, `orders-${period}-${new Date().toISOString().split('T')[0]}.csv`);
            }}
            className="btn btn-secondary text-sm"
          >
            📥 Export CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  Product
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  Customer
                </th>
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
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {report.orders.map((order: any) => (
                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm">{order.product.name}</td>
                  <td className="py-3 px-4 text-sm">{order.user.name}</td>
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
                  <td className="py-3 px-4">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-green-600 hover:text-green-700 text-sm font-medium"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Order ID</p>
                  <p className="text-sm font-mono text-gray-900">{selectedOrder.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <span className={`badge badge-${selectedOrder.status.toLowerCase()}`}>
                    {selectedOrder.status}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-semibold text-gray-900 mb-2">Customer Information</h3>
                <p className="text-sm text-gray-900">{selectedOrder.user.name}</p>
                <p className="text-sm text-gray-600">{selectedOrder.user.email}</p>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-semibold text-gray-900 mb-2">Product Information</h3>
                <p className="text-sm text-gray-900">{selectedOrder.product.name}</p>
                <p className="text-sm text-gray-600">{selectedOrder.product.type}</p>
                <p className="text-sm text-gray-600">📍 {selectedOrder.product.location}</p>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Quantity</p>
                    <p className="text-lg font-bold text-gray-900">{selectedOrder.quantity}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Unit Price</p>
                    <p className="text-lg font-bold text-gray-900">
                      {formatCurrency(selectedOrder.product.price)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total</p>
                    <p className="text-lg font-bold text-green-600">
                      {formatCurrency(selectedOrder.totalPrice)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm text-gray-600 mb-1">Order Date</p>
                <p className="text-sm text-gray-900">{formatDateTime(selectedOrder.createdAt)}</p>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="btn btn-secondary w-full mt-4"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function generateCSV(orders: any[]) {
  const headers = ['Order ID', 'Product', 'Customer', 'Quantity', 'Total', 'Status', 'Date'];
  const rows = orders.map(order => [
    order.id,
    order.product.name,
    order.user.name,
    order.quantity,
    order.totalPrice,
    order.status,
    new Date(order.createdAt).toLocaleDateString(),
  ]);
  
  return [headers, ...rows].map(row => row.join(',')).join('\n');
}

function downloadCSV(csv: string, filename: string) {
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
}
