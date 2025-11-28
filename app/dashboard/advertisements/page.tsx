'use client';

import { useEffect, useState } from 'react';
import { formatDateTime } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function AdvertisementsPage() {
  const [advertisements, setAdvertisements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdvertisements();
  }, []);

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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        New Products & Announcements
      </h1>

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
            <p className="text-gray-500">No announcements yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
