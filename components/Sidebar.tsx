'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  role: string;
}

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();

  const links = [
    { href: '/dashboard', label: 'Dashboard', roles: ['SUPER_ADMIN', 'ADMIN', 'USER'] },
    { href: '/dashboard/products', label: 'Products', roles: ['SUPER_ADMIN', 'ADMIN', 'USER'] },
    { href: '/dashboard/orders', label: 'Orders', roles: ['SUPER_ADMIN', 'ADMIN', 'USER'] },
    { href: '/dashboard/messages', label: 'Messages', roles: ['SUPER_ADMIN', 'ADMIN', 'USER'] },
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
        {filteredLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block px-4 py-2 rounded-lg transition-colors ${
              pathname === link.href
                ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 font-medium'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
