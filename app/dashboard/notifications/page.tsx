'use client';

import { useEffect, useState } from 'react';
import { formatDateTime } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      const data = await res.json();
      setNotifications(data.notifications || []);
    } catch (error) {
      toast.error('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' });
      fetchNotifications();
      // Trigger sidebar refresh
      window.dispatchEvent(new Event('refreshSidebarCounts'));
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch('/api/notifications/mark-all-read', { method: 'POST' });
      toast.success('All notifications marked as read');
      fetchNotifications();
      // Trigger sidebar refresh
      window.dispatchEvent(new Event('refreshSidebarCounts'));
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  const getNotificationIcon = (type: string) => {
    const icons: any = {
      PAYMENT_UPLOADED: '💳',
      PAYMENT_VERIFIED: '✅',
      PAYMENT_REJECTED: '❌',
      ORDER_DELIVERED: '📦',
      NEW_USER_REGISTRATION: '👤',
      ACCOUNT_APPROVED: '🎉',
      default: '🔔',
    };
    return icons[type] || icons.default;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            🔔 Notifications
          </h1>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="btn btn-secondary text-sm"
          >
            Mark All as Read
          </button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No notifications yet</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`card cursor-pointer transition-all ${
                notification.isRead
                  ? 'bg-white dark:bg-gray-800'
                  : 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500'
              }`}
              onClick={() => !notification.isRead && markAsRead(notification.id)}
            >
              <div className="flex items-start space-x-4">
                <div className="text-3xl">{getNotificationIcon(notification.type)}</div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {notification.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {notification.message}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full"></span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                    {formatDateTime(notification.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
