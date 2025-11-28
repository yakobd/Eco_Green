'use client';

import { useEffect, useState } from 'react';
import { formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [location, setLocation] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [branches, setBranches] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [viewingProduct, setViewingProduct] = useState<any>(null);
  const [orderQuantity, setOrderQuantity] = useState(1);

  useEffect(() => {
    fetchBranches();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [search, type, location, selectedBranch]);

  const fetchBranches = async () => {
    try {
      const res = await fetch('/api/branches');
      const data = await res.json();
      setBranches(data.branches || []);
    } catch (error) {
      console.error('Failed to fetch branches');
    }
  };

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (type) params.append('type', type);
      if (location) params.append('location', location);
      if (selectedBranch) params.append('branchId', selectedBranch);

      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      setProducts(data.products || []);
    } catch (error) {
      toast.error('Failed to fetch products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOrder = async () => {
    if (!selectedProduct) return;

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedProduct.id,
          quantity: orderQuantity,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }

      toast.success('Order placed successfully!');
      setSelectedProduct(null);
      setOrderQuantity(1);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Products</h1>

      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search products..."
            className="input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by type..."
            className="input"
            value={type}
            onChange={(e) => setType(e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by location..."
            className="input"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <select
            className="input"
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
          >
            <option value="">All Branches</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products && products.length > 0 ? products.map((product) => (
          <div key={product.id} className="card hover:shadow-xl transition-shadow duration-300 overflow-hidden">
            {product.imageUrl && (
              <div className="relative h-48 w-full mb-4 -mt-6 -mx-6 overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    product.quantity > 100 
                      ? 'bg-green-500 text-white' 
                      : product.quantity > 0 
                      ? 'bg-yellow-500 text-white' 
                      : 'bg-red-500 text-white'
                  }`}>
                    {product.quantity > 0 ? `${product.quantity} in stock` : 'Out of Stock'}
                  </span>
                </div>
              </div>
            )}
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {product.name}
            </h3>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                {product.type}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-2 flex items-center">
              <span className="mr-1">📍</span> {product.location}
            </p>
            <p className="text-sm text-gray-700 mb-4 line-clamp-2">{product.description}</p>
            <div className="flex justify-between items-center mb-4 pt-4 border-t border-gray-100">
              <span className="text-2xl font-bold text-green-600">
                {formatCurrency(product.price)}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewingProduct(product)}
                className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                👁️ View Details
              </button>
              <button
                onClick={() => setSelectedProduct(product)}
                className="flex-1 btn btn-primary shadow-md hover:shadow-lg transition-shadow text-sm"
                disabled={product.quantity === 0}
              >
                {product.quantity === 0 ? 'Out of Stock' : '🛒 Order'}
              </button>
            </div>
          </div>
        )) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">No products found</p>
          </div>
        )}
      </div>

      {/* View Details Modal */}
      {viewingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Product Details</h2>
              <button
                onClick={() => setViewingProduct(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            {viewingProduct.imageUrl && (
              <div className="mb-6 rounded-lg overflow-hidden">
                <img
                  src={viewingProduct.imageUrl}
                  alt={viewingProduct.name}
                  className="w-full h-64 object-cover"
                />
              </div>
            )}

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {viewingProduct.name}
                </h3>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full font-medium">
                  {viewingProduct.type}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-gray-200">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Price</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(viewingProduct.price)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Available Stock</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {viewingProduct.quantity} units
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">📍 Location</p>
                <p className="text-base text-gray-900">{viewingProduct.location}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Description</p>
                <p className="text-base text-gray-900">{viewingProduct.description}</p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setViewingProduct(null);
                    setSelectedProduct(viewingProduct);
                  }}
                  className="flex-1 btn btn-primary"
                  disabled={viewingProduct.quantity === 0}
                >
                  {viewingProduct.quantity === 0 ? 'Out of Stock' : '🛒 Order This Product'}
                </button>
                <button
                  onClick={() => setViewingProduct(null)}
                  className="flex-1 btn btn-secondary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Place Order</h2>
            <p className="text-gray-700 mb-2">
              <strong>Product:</strong> {selectedProduct.name}
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Price:</strong> {formatCurrency(selectedProduct.price)}
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Available:</strong> {selectedProduct.quantity}
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                max={selectedProduct.quantity}
                className="input"
                value={orderQuantity}
                onChange={(e) => setOrderQuantity(parseInt(e.target.value))}
              />
            </div>

            <p className="text-xl font-bold text-gray-900 mb-4">
              Total: {formatCurrency(selectedProduct.price * orderQuantity)}
            </p>

            <div className="flex space-x-4">
              <button
                onClick={handleOrder}
                className="btn btn-primary flex-1"
              >
                Confirm Order
              </button>
              <button
                onClick={() => {
                  setSelectedProduct(null);
                  setOrderQuantity(1);
                }}
                className="btn btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
