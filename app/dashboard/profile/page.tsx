'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    organizationName: '',
    profileImage: '',
  });

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      setUser(data.user);
      setImagePreview(data.user.profileImage || '');
      setFormData({
        name: data.user.name || '',
        email: data.user.email || '',
        phone: data.user.phone || '',
        address: data.user.address || '',
        organizationName: data.user.organizationName || '',
        profileImage: data.user.profileImage || '',
      });
    } catch (error) {
      toast.error('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setFormData({ ...formData, profileImage: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Submitting profile data:', formData);
      
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const responseData = await res.json();
      console.log('Profile update response:', responseData);

      if (!res.ok) {
        throw new Error(responseData.error || 'Failed to update profile');
      }

      toast.success('Profile updated successfully!');
      setEditing(false);
      fetchUser();
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast.error(error.message);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        👤 My Profile
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="card text-center">
          <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center overflow-hidden">
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-6xl text-white">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
            {user?.name}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {user?.email}
          </p>
          <span className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs rounded-full font-medium">
            {user?.role.replace('_', ' ')}
          </span>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2 card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Profile Information
            </h2>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="btn btn-secondary text-sm"
              >
                ✏️ Edit Profile
              </button>
            )}
          </div>

          {editing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Profile Picture
                </label>
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center overflow-hidden">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl text-white">
                        {formData.name?.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      className="input"
                      onChange={handleImageChange}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Upload a profile picture
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
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
                  Phone
                </label>
                <input
                  type="tel"
                  className="input"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Address
                </label>
                <textarea
                  className="input"
                  rows={3}
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Organization Name
                </label>
                <input
                  type="text"
                  className="input"
                  value={formData.organizationName}
                  onChange={(e) =>
                    setFormData({ ...formData, organizationName: e.target.value })
                  }
                />
              </div>

              <div className="flex gap-4">
                <button type="submit" className="flex-1 btn btn-primary">
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="flex-1 btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Full Name</p>
                <p className="text-base font-medium text-gray-900 dark:text-white">
                  {user?.name}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                <p className="text-base font-medium text-gray-900 dark:text-white">
                  {user?.email}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                <p className="text-base font-medium text-gray-900 dark:text-white">
                  {user?.phone || 'Not provided'}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Address</p>
                <p className="text-base font-medium text-gray-900 dark:text-white">
                  {user?.address || 'Not provided'}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Organization
                </p>
                <p className="text-base font-medium text-gray-900 dark:text-white">
                  {user?.organizationName || 'Not provided'}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Role</p>
                <p className="text-base font-medium text-gray-900 dark:text-white">
                  {user?.role.replace('_', ' ')}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
