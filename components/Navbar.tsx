'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import ThemeToggle from './ThemeToggle';
import NotificationBell from './NotificationBell';

interface NavbarProps {
  user: {
    name: string;
    email: string;
    role: string;
    profileImage?: string;
  };
}

export default function Navbar({ user }: NavbarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      toast.success('Logged out successfully');
      router.push('/login');
      router.refresh();
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  return (
    <nav className="bg-gradient-to-r from-green-600 to-emerald-600 dark:from-gray-800 dark:to-gray-900 shadow-lg transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center">
              <span className="text-2xl">🌿</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                Eco Green
              </h1>
              <p className="text-xs text-green-100 dark:text-gray-400">Supply Chain Platform</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <NotificationBell />
            <ThemeToggle />
            
            <Link
              href="/dashboard/profile"
              className="flex items-center space-x-2 hover:bg-white/10 px-3 py-2 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-bold text-green-600 dark:text-green-400">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-white">{user.name}</p>
                <p className="text-xs text-green-100 dark:text-gray-400">
                  {user.role.replace('_', ' ')}
                </p>
              </div>
            </Link>
            
            <button
              onClick={handleLogout}
              className="bg-white dark:bg-gray-700 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-gray-600 px-4 py-2 rounded-lg font-medium transition-colors text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
