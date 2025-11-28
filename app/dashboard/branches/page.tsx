'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function BranchesPage() {
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    phone: '',
    email: '',
    manager: '',
  });

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const res = await fetch('/api/branches');
      const data = await res.json();
      setBranches(data.branches);
    } catch (error) {
      toast.error('Failed to fetch branches');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingBranch
        ? `/api/branches/${editingBranch.id}`
        : '/api/branches';
      const method = editingBranch ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to save branch');

      toast.success(editingBranch ? 'Branch updated' : 'Branch created');
      setShowModal(false);
      setEditingBranch(null);
      setFormData({ name: '', location: '', phone: '', email: '', manager: '' });
      fetchBranches();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleEdit = (branch: any) => {
    setEditingBranch(branch);
    setFormData({
      name: branch.name,
      location: branch.location,
      phone: branch.phone || '',
      email: branch.email || '',
      manager: branch.manager || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this branch?')) return;

    try {
      const res = await fetch(`/api/branches/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete branch');

      toast.success('Branch deleted');
      fetchBranches();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">🏢 Branches</h1>
        <button
          onClick={() => {
            setEditingBranch(null);
            setFormData({ name: '', location: '', phone: '', email: '', manager: '' });
            setShowModal(true);
          }}
          className="btn btn-primary"
        >
          ➕ Add Branch
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {branches.map((branch) => (
          <div key={branch.id} className="card">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-gray-900">{branch.name}</h3>
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                {branch._count.products} Products
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <p className="text-sm text-gray-600">📍 {branch.location}</p>
              {branch.phone && <p className="text-sm text-gray-600">📞 {branch.phone}</p>}
              {branch.email && <p className="text-sm text-gray-600">✉️ {branch.email}</p>}
              {branch.manager && (
                <p className="text-sm text-gray-600">👤 Manager: {branch.manager}</p>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(branch)}
                className="flex-1 btn btn-secondary text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(branch.id)}
                className="flex-1 btn btn-danger text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">
              {editingBranch ? 'Edit Branch' : 'Add Branch'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Branch Name *
                </label>
                <input
                  type="text"
                  required
                  className="input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location *
                </label>
                <input
                  type="text"
                  required
                  className="input"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  className="input"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Manager Name
                </label>
                <input
                  type="text"
                  className="input"
                  value={formData.manager}
                  onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                />
              </div>

              <div className="flex gap-4">
                <button type="submit" className="flex-1 btn btn-primary">
                  {editingBranch ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 btn btn-secondary"
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
