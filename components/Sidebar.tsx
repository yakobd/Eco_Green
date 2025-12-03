'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface SidebarProps {
  role: string;
}

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [newOrders, setNewOrders] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [pendingUsers, setPendingUsers] = useState(0);

  useEffect(() => {
    fetchCounts();
    const interval = setInterval(fetchCounts, 30000); // Refresh every 30 seconds
    
    // Listen for custom refresh event
    const handleRefresh = () => fetchCounts();
    window.addEventListener('refreshSidebarCounts', handleRefresh);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('refreshSidebarCounts', handleRefresh);
    };
  }, []);

  const fetchCounts = async () => {
    try {
      // Get current user ID
      const userRes = await fetch('/api/auth/me');
      const userData = await userRes.json();
      const currentUserId = userData.user?.id;

      // Fetch unread messages count - only messages where current user is receiver
      const messagesRes = await fetch('/api/messages');
      const messagesData = await messagesRes.json();
      if (messagesData.messages && currentUserId) {
        const unread = messagesData.messages.filter(
          (m: any) => !m.isRead && m.receiverId === currentUserId
        ).length;
        setUnreadMessages(unread);
      }

      // Fetch unread notifications count
      const notifRes = await fetch('/api/notifications');
      const notifData = await notifRes.json();
      if (notifData.notifications) {
        const unreadNotifs = notifData.notifications.filter((n: any) => !n.isRead).length;
        setUnreadNotifications(unreadNotifs);
      }

      // Fetch new orders count (pending orders for admins)
      if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
        const ordersRes = await fetch('/api/orders?status=PENDING');
        const ordersData = await ordersRes.json();
        if (ordersData.orders) {
          setNewOrders(ordersData.orders.length);
        }
      }

      // Fetch pending users count (for super admin only)
      if (role === 'SUPER_ADMIN') {
        const usersRes = await fetch('/api/users');
        const usersData = await usersRes.json();
        if (usersData.users) {
          const pending = usersData.users.filter((u: any) => !u.isApproved).length;
          setPendingUsers(pending);
        }
      }
    } catch (error) {
      console.error('Failed to fetch counts:', error);
    }
  };

  const links = [
    { href: '/dashboard', label: 'Dashboard', roles: ['SUPER_ADMIN', 'ADMIN', 'USER'] },
    { href: '/dashboard/products', label: 'Products', roles: ['SUPER_ADMIN', 'ADMIN', 'USER'] },
    { href: '/dashboard/orders', label: 'Orders', roles: ['SUPER_ADMIN', 'ADMIN', 'USER'] },
    { href: '/dashboard/messages', label: 'Messages', roles: ['SUPER_ADMIN', 'ADMIN', 'USER'] },
    { href: '/dashboard/notifications', label: 'Notifications', roles: ['SUPER_ADMIN', 'ADMIN', 'USER'] },
    { href: '/dashboard/manage-products', label: 'Manage Products', roles: ['SUPER_ADMIN', 'ADMIN'] },
    { href: '/dashboard/branches', label: 'Branches', roles: ['SUPER_ADMIN', 'ADMIN'] },
    { href: '/dashboard/users', label: 'Manage Users', roles: ['SUPER_ADMIN'] },
    { href: '/dashboard/analytics', label: 'Organization Analytics', roles: ['SUPER_ADMIN', 'ADMIN'] },
    { href: '/dashboard/reports', label: 'Reports', roles: ['SUPER_ADMIN', 'ADMIN'] },
    { href: '/dashboard/advertisements', label: 'Advertisements', roles: ['SUPER_ADMIN', 'ADMIN', 'USER'] },
    { href: '/dashboard/contact', label: 'Contact', roles: ['SUPER_ADMIN', 'ADMIN', 'USER'] },
    { href: '/dashboard/profile', label: 'My Profile', roles: ['SUPER_ADMIN', 'ADMIN', 'USER'] },
  ];

  const filteredLinks = links.filter((link) => link.roles.includes(role));

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen transition-colors">
      <nav className="p-4 space-y-2">
        {filteredLinks.map((link) => {
          const showBadge = 
            (link.href === '/dashboard/messages' && unreadMessages > 0) ||
            (link.href === '/dashboard/orders' && newOrders > 0) ||
            (link.href === '/dashboard/notifications' && unreadNotifications > 0) ||
            (link.href === '/dashboard/users' && pendingUsers > 0);
          
          const badgeCount = 
            link.href === '/dashboard/messages' ? unreadMessages :
            link.href === '/dashboard/notifications' ? unreadNotifications :
            link.href === '/dashboard/users' ? pendingUsers :
            newOrders;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center justify-between px-4 py-2 rounded-lg transition-colors ${
                pathname === link.href
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 font-medium'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <span>{link.label}</span>
              {showBadge && (
                <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-red-500 rounded-full">
                  {badgeCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
