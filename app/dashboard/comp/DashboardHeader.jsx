"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageCircle, Bell, User, Settings, LogOut } from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';

export default function DashboardHeader() {
  const { user, logout } = useAuthContext();
  const { socket } = useSocket();
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Okunmamış mesaj sayısını al
  useEffect(() => {
    if (user) {
      fetchUnreadCount();
    }
  }, [user]);

  // Socket.io ile gerçek zamanlı bildirimler
  useEffect(() => {
    if (!socket) return;

    socket.on('new_message', (message) => {
      // Eğer messages sayfasında değilsek bildirim sayısını artır
      if (!pathname.includes('/messages')) {
        setUnreadCount(prev => prev + 1);
      }
    });

    return () => {
      socket.off('new_message');
    };
  }, [socket, pathname]);

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch('/api/messages/unread-count');
      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.count || 0);
      }
    } catch (error) {
      console.error('Okunmamış mesaj sayısı alınamadı:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Çıkış hatası:', error);
    }
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: User },
    { name: 'Mesajlar', href: '/dashboard/messages', icon: MessageCircle },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo ve Navigation */}
          <div className="flex items-center space-x-8">
            <Link href="/dashboard" className="flex items-center">
              <span className="text-xl font-bold text-primary-600">DripZone</span>
            </Link>
            
            <nav className="hidden md:flex space-x-6">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
                      isActive
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.name}</span>
                    {item.name === 'Mesajlar' && unreadCount > 0 && (
                      <div className="bg-red-500 text-white text-xs rounded-full min-w-[18px] h-4 flex items-center justify-center">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </div>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Sağ Menü */}
          <div className="flex items-center space-x-4">
            {/* Bildirimler */}
            <button className="p-2 text-gray-500 hover:text-gray-700 transition rounded-lg hover:bg-gray-100">
              <Bell size={20} />
            </button>

            {/* Mesajlar - Mobil */}
            <Link
              href="/dashboard/messages"
              className="md:hidden relative p-2 text-gray-500 hover:text-gray-700 transition rounded-lg hover:bg-gray-100"
            >
              <MessageCircle size={20} />
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-4 flex items-center justify-center">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </div>
              )}
            </Link>

            {/* Profil Menüsü */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition"
              >
                <img
                  src={user?.user_photo || '/default-avatar.png'}
                  alt={user?.name || 'User'}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="hidden sm:block text-sm font-medium text-gray-700">
                  {user?.name}
                </span>
              </button>

              {/* Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <Link
                    href={`/profile/${user?.user_name}`}
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <User size={16} />
                    <span>Profilim</span>
                  </Link>
                  
                  <button
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <Settings size={16} />
                    <span>Ayarlar</span>
                  </button>
                  
                  <hr className="my-1" />
                  
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      handleLogout();
                    }}
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                  >
                    <LogOut size={16} />
                    <span>Çıkış Yap</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
