'use client';

import { useEffect, useState } from 'react';
import { formatDateTime } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organizationName: '',
    message: '',
  });

  useEffect(() => {
    fetchUser();
    fetchContacts();
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

  const fetchContacts = async () => {
    try {
      const res = await fetch('/api/contact');
      const data = await res.json();
      setContacts(data.contacts);
    } catch (error) {
      toast.error('Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to send message');

      toast.success('Message sent successfully!');
      setShowForm(false);
      setFormData({ name: '', email: '', phone: '', organizationName: '', message: '' });
      fetchContacts();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const markResolved = async (id: string) => {
    try {
      const res = await fetch(`/api/contact/${id}`, { method: 'PATCH' });
      if (!res.ok) throw new Error('Failed to update');

      toast.success('Marked as resolved');
      fetchContacts();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (loading) return <div>Loading...</div>;

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">📞 Contact Us</h1>
        {!isAdmin && (
          <button onClick={() => setShowForm(true)} className="btn btn-primary">
            ✉️ Send Message
          </button>
        )}
      </div>

      {isAdmin ? (
        <div className="space-y-4">
          {contacts.map((contact) => (
            <div key={contact.id} className="card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{contact.name}</h3>
                  <p className="text-sm text-gray-600">{contact.email}</p>
                  {contact.phone && <p className="text-sm text-gray-600">📞 {contact.phone}</p>}
                  {contact.organizationName && (
                    <p className="text-sm text-gray-600">🏢 {contact.organizationName}</p>
                  )}
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    contact.isResolved
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {contact.isResolved ? 'Resolved' : 'Pending'}
                </span>
              </div>

              <p className="text-gray-700 mb-4">{contact.message}</p>

              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{formatDateTime(contact.createdAt)}</span>
                {!contact.isResolved && (
                  <button
                    onClick={() => markResolved(contact.id)}
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    Mark as Resolved
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Get in Touch</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Eco Green Headquarters</h3>
              <p className="text-sm text-gray-600 mb-1">📍 123 Green Street, Eco City</p>
              <p className="text-sm text-gray-600 mb-1">📞 +1 (555) 123-4567</p>
              <p className="text-sm text-gray-600 mb-1">✉️ info@ecogreen.com</p>
              <p className="text-sm text-gray-600">🕒 Mon-Fri: 9:00 AM - 6:00 PM</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Support</h3>
              <p className="text-sm text-gray-600 mb-1">📧 support@ecogreen.com</p>
              <p className="text-sm text-gray-600 mb-1">📞 +1 (555) 987-6543</p>
              <p className="text-sm text-gray-600">Available 24/7</p>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Send Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name *
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
                  Email *
                </label>
                <input
                  type="email"
                  required
                  className="input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message *
                </label>
                <textarea
                  required
                  rows={4}
                  className="input"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <div className="flex gap-4">
                <button type="submit" className="flex-1 btn btn-primary">
                  Send Message
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
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
