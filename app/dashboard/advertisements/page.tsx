'use client';

import { useEffect, useState } from 'react';
import { formatDateTime } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function AdvertisementsPage() {
  const [advertisements, setAdvertisements] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [formData, setFormData] = useState({
    message: '',
    productId: '',
  });

  useEffect(() => {
    fetchAdvertisements();
    fetchUserRole();
    fetchProducts();
  }, []);

  const fetchUserRole = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      setUserRole(data.user.role);
    } catch (error) {
      console.error('Failed to fetch user role');
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data.products);
    } catch (error) {
      console.error('Failed to fetch products');
    }
  };

  const fetchAdvertisements = async () => {
    try {
      const res = await fetch('/api/advertisements');
      const data = await res.json();
      setAdvertisements(data.advertisements);
    } catch (error) {
      toast.error('Failed to fetch advertisements');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/advertisements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }

      toast.success('Advertisement created successfully');
      setShowModal(false);
      setFormData({ message: '', productId: '' });
      fetchAdvertisements();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          New Products & Announcements
        </h1>
        {(userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') && (
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-primary"
          >
            Create Advertisement
          </button>
        )}
      </div>

      <div className="space-y-4">
        {advertisements.map((ad) => (
          <div key={ad.id} className="card">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-2xl">📢</span>
                  <h3 className="text-lg font-bold text-gray-900">{ad.message}</h3>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 mt-3">
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    {ad.product.name}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    Type: {ad.product.type}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    Location: {ad.product.location}
                  </p>
                  <p className="text-sm text-gray-600">
                    Available: {ad.product.quantity} units
                  </p>
                </div>
              </div>
              <div className="text-right ml-4">
                <p className="text-xs text-gray-500">
                  {formatDateTime(ad.createdAt)}
                </p>
              </div>
            </div>
          </div>
        ))}

        {advertisements.length === 0 && (
          <div className="card text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No announcements yet</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Create Advertisement</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Product
                </label>
                <select
                  required
                  className="input"
                  value={formData.productId}
                  onChange={(e) =>
                    setFormData({ ...formData, productId: e.target.value })
                  }
                >
                  <option value="">Select a product</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} - {product.type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Message
                </label>
                <textarea
                  required
                  className="input"
                  rows={3}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  placeholder="e.g., New stock available! Limited time offer!"
                />
              </div>

              <div className="flex space-x-4">
                <button type="submit" className="btn btn-primary flex-1">
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
