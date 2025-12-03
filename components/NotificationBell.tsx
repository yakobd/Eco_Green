'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      const data = await res.json();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.error('Failed to fetch notifications');
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' });
      fetchNotifications();
      // Trigger sidebar refresh
      window.dispatchEvent(new Event('refreshSidebarCounts'));
    } catch (error) {
      console.error('Failed to mark as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch('/api/notifications/mark-all-read', { method: 'POST' });
      fetchNotifications();
      // Trigger sidebar refresh
      window.dispatchEvent(new Event('refreshSidebarCounts'));
    } catch (error) {
      console.error('Failed to mark all as read');
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 rounded-lg hover:bg-white/10 transition-colors"
      >
        <span className="text-2xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowDropdown(false)}
          />
          <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-20 max-h-96 overflow-y-auto">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="font-bold text-gray-900 dark:text-white">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Mark all read
                </button>
              )}
            </div>

            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                No notifications
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {notifications.slice(0, 10).map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
                      !notif.isRead ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                    onClick={() => {
                      markAsRead(notif.id);
                      if (notif.orderId) {
                        router.push('/dashboard/orders');
                      }
                      setShowDropdown(false);
                    }}
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">
                        {notif.type === 'ORDER_APPROVED' && '✅'}
                        {notif.type === 'ORDER_REJECTED' && '❌'}
                        {notif.type === 'PAYMENT_UPLOADED' && '💳'}
                        {notif.type === 'PAYMENT_VERIFIED' && '✔️'}
                        {notif.type === 'ORDER_DELIVERED' && '📦'}
                        {notif.type === 'NEW_MESSAGE' && '💬'}
                      </span>
                      <div className="flex-1">
                        <p className="font-medium text-sm text-gray-900 dark:text-white">
                          {notif.title}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {notif.message}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          {new Date(notif.createdAt).toLocaleString()}
                        </p>
                      </div>
                      {!notif.isRead && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {notifications.length > 10 && (
              <div className="p-3 text-center border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => {
                    router.push('/dashboard/notifications');
                    setShowDropdown(false);
                  }}
                  className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                >
                  View all notifications
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
