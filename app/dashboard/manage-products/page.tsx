'use client';

import { useEffect, useState } from 'react';
import { formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function ManageProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    price: '',
    quantity: '',
    location: '',
    description: '',
    imageUrl: '',
    branchId: '',
  });

  useEffect(() => {
    fetchProducts();
    fetchBranches();
  }, []);

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
      const res = await fetch('/api/products?limit=100');
      const data = await res.json();
      setProducts(data.products);
    } catch (error) {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setFormData({ ...formData, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingProduct
        ? `/api/products/${editingProduct.id}`
        : '/api/products/manage';
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          quantity: parseInt(formData.quantity),
          branchId: formData.branchId || null,
        }),
      });

      if (!res.ok) throw new Error('Failed to save product');

      toast.success(editingProduct ? 'Product updated' : 'Product created');
      setShowModal(false);
      setEditingProduct(null);
      setImageFile(null);
      setImagePreview('');
      setFormData({
        name: '',
        type: '',
        price: '',
        quantity: '',
        location: '',
        description: '',
        imageUrl: '',
        branchId: '',
      });
      fetchProducts();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setImagePreview(product.imageUrl || '');
    setFormData({
      name: product.name,
      type: product.type,
      price: product.price.toString(),
      quantity: product.quantity.toString(),
      location: product.location,
      description: product.description || '',
      imageUrl: product.imageUrl || '',
      branchId: product.branchId || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete product');

      toast.success('Product deleted');
      fetchProducts();
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
        <h1 className="text-3xl font-bold text-gray-900">Manage Products</h1>
        <button
          onClick={() => {
            setEditingProduct(null);
            setImageFile(null);
            setImagePreview('');
            setFormData({
              name: '',
              type: '',
              price: '',
              quantity: '',
              location: '',
              description: '',
              imageUrl: '',
              branchId: '',
            });
            setShowModal(true);
          }}
          className="btn btn-primary shadow-md hover:shadow-lg transition-shadow"
        >
          ➕ Add Product
        </button>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  Name
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  Type
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  Price
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  Quantity
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  Location
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-gray-100">
                  <td className="py-3 px-4 text-sm">{product.name}</td>
                  <td className="py-3 px-4 text-sm">{product.type}</td>
                  <td className="py-3 px-4 text-sm">
                    {formatCurrency(product.price)}
                  </td>
                  <td className="py-3 px-4 text-sm">{product.quantity}</td>
                  <td className="py-3 px-4 text-sm">{product.location}</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-xs btn btn-secondary"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-xs btn btn-danger"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editingProduct ? 'Edit Product' : 'Add Product'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  required
                  className="input"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <input
                  type="text"
                  required
                  className="input"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  className="input"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  required
                  className="input"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  required
                  className="input"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  className="input"
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="input"
                  onChange={handleImageChange}
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">Upload an image from your computer</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Branch
                </label>
                <select
                  className="input"
                  value={formData.branchId}
                  onChange={(e) =>
                    setFormData({ ...formData, branchId: e.target.value })
                  }
                >
                  <option value="">No Branch</option>
                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-4">
                <button type="submit" className="btn btn-primary flex-1">
                  {editingProduct ? 'Update' : 'Create'}
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
