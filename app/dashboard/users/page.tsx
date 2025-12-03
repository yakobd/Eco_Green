'use client';

import { useEffect, useState } from 'react';
import { formatDateTime } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'USER',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      setUsers(data.users);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }

      toast.success('User created successfully');
      setShowModal(false);
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'USER',
      });
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`/api/users/${id}/approve`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to approve user');

      toast.success('User approved successfully');
      fetchUsers();
      // Trigger sidebar refresh to update badge count
      window.dispatchEvent(new Event('refreshSidebarCounts'));
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete user');

      toast.success('User deleted');
      fetchUsers();
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
        <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary"
        >
          Add User
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
                  Email
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  Role
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  Created At
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-100">
                  <td className="py-3 px-4 text-sm">{user.name}</td>
                  <td className="py-3 px-4 text-sm">{user.email}</td>
                  <td className="py-3 px-4">
                    <span className="badge bg-primary-100 text-primary-800">
                      {user.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {user.isApproved ? (
                      <span className="badge bg-green-100 text-green-800">Approved</span>
                    ) : (
                      <span className="badge bg-yellow-100 text-yellow-800">Pending</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    {formatDateTime(user.createdAt)}
                  </td>
                  <td className="py-3 px-4 space-x-2">
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setShowDetailsModal(true);
                      }}
                      className="text-xs btn btn-secondary"
                    >
                      View Details
                    </button>
                    {!user.isApproved && (
                      <button
                        onClick={() => handleApprove(user.id)}
                        className="text-xs btn btn-primary"
                      >
                        Approve
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-xs btn btn-danger"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showDetailsModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">User Details</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center">
                  {selectedUser.profileImage ? (
                    <img
                      src={selectedUser.profileImage}
                      alt={selectedUser.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <span className="text-3xl text-white">
                      {selectedUser.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {selectedUser.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedUser.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="card bg-gray-50 dark:bg-gray-700">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Role</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {selectedUser.role.replace('_', ' ')}
                  </p>
                </div>

                <div className="card bg-gray-50 dark:bg-gray-700">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Status</p>
                  <p className="font-semibold">
                    {selectedUser.isApproved ? (
                      <span className="text-green-600 dark:text-green-400">✓ Approved</span>
                    ) : (
                      <span className="text-yellow-600 dark:text-yellow-400">⏳ Pending</span>
                    )}
                  </p>
                </div>

                <div className="card bg-gray-50 dark:bg-gray-700">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Phone</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {selectedUser.phone || 'Not provided'}
                  </p>
                </div>

                <div className="card bg-gray-50 dark:bg-gray-700">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Organization</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {selectedUser.organizationName || 'Not provided'}
                  </p>
                </div>
              </div>

              <div className="card bg-gray-50 dark:bg-gray-700">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Address</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {selectedUser.address || 'Not provided'}
                </p>
              </div>

              <div className="card bg-gray-50 dark:bg-gray-700">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Member Since</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {formatDateTime(selectedUser.createdAt)}
                </p>
              </div>

              <div className="flex gap-3 mt-6">
                {!selectedUser.isApproved && (
                  <button
                    onClick={() => {
                      handleApprove(selectedUser.id);
                      setShowDetailsModal(false);
                      // Trigger sidebar refresh
                      window.dispatchEvent(new Event('refreshSidebarCounts'));
                    }}
                    className="btn btn-primary flex-1"
                  >
                    Approve User
                  </button>
                )}
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="btn btn-secondary flex-1"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Add User</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  className="input"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  className="input"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Role
                </label>
                <select
                  className="input"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                >
                  <option value="USER">User</option>
                  <option value="ADMIN">Admin</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                </select>
              </div>

              <div className="flex space-x-4">
                <button type="submit" className="btn btn-primary flex-1">
                  Create User
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
