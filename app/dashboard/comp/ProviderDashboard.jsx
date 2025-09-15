"use client"

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  DollarSign, Package, MessageCircle, Plus, Clock
} from 'lucide-react'
import { LoadingSpinner } from '../../components/ui/LoadingSpinner'
import { Modal } from '../../components/ui/Modal'
import { OverviewTab } from './ProviderComponent/Tabs/Overview'
import { ServicesTab } from './ProviderComponent/Tabs/ServicesTab'
import { RevenueTab } from './ProviderComponent/Tabs/Revenue'
import { OrdersTab } from './ProviderComponent/Tabs/Orders'
import {ProfileProviderTab} from './ProviderComponent/Tabs/Profile'

const mockServices = [
  {
    id: '1',
    title: 'Beat Making Service',
    description: 'Professional beats for your next track.',
    category: 'producers',
    price: 120,
    delivery_time: 5,
    revisions: 2,
    features: ['HQ Audio', 'Stems', 'Exclusive Rights'],
    images: ['https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg']
  },
  {
    id: '2',
    title: 'Mixing & Mastering',
    description: 'Clean and balanced mix for any genre.',
    category: 'recording-studios',
    price: 200,
    delivery_time: 7,
    revisions: 3,
    features: ['WAV & MP3', '2 Revisions'],
    images: ['https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg']
  }
]

const mockOrders = [
  {
    id: '101',
    status: 'completed',
    provider_amount: 96,
    total_amount: 120,
    created_at: new Date().toISOString(),
    artist: {
      full_name: 'John Doe',
      email: 'john@example.com',
      avatar_url: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    service: {
      title: 'Beat Making Service'
    }
  },
  {
    id: '102',
    status: 'pending',
    provider_amount: 160,
    total_amount: 200,
    created_at: new Date().toISOString(),
    artist: {
      full_name: 'Jane Smith',
      email: 'jane@example.com',
      avatar_url: 'https://randomuser.me/api/portraits/women/45.jpg'
    },
    service: {
      title: 'Mixing & Mastering'
    }
  }
]

const mockRecentTransactions = [
  {
    id: '201',
    provider_amount: 85,
    artist: {
      full_name: 'Alex Johnson',
      avatar_url: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=50'
    },
    service: {
      title: 'Professional Beat Production'
    }
  },
  {
    id: '202',
    provider_amount: 120,
    artist: {
      full_name: 'Sarah Williams',
      avatar_url: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=50'
    },
    service: {
      title: 'Vocal Recording & Mixing'
    }
  },
  {
    id: '203',
    provider_amount: 95,
    artist: {
      full_name: 'Michael Brown',
      avatar_url: 'https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?auto=compress&cs=tinysrgb&w=50'
    },
    service: {
      title: 'Mastering Services'
    }
  },
  {
    id: '204',
    provider_amount: 150,
    artist: {
      full_name: 'Emma Davis',
      avatar_url: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=50'
    },
    service: {
      title: 'Full Song Production'
    }
  },
  {
    id: '205',
    provider_amount: 75,
    artist: {
      full_name: 'David Wilson',
      avatar_url: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=50'
    },
    service: {
      title: 'Beat Customization'
    }
  }
]

const mockConversations = [
  { id: 'c1', unread_count: 2 },
  { id: 'c2', unread_count: 0 },
  { id: 'c3', unread_count: 1 }
]

export const ProviderDashboard = ({AuthUser}) => {
  const [activeTab, setActiveTab] = useState('overview')
  const [profileCache, setProfileCache] = useState(null); // Profil cache
  const [profileLoading, setProfileLoading] = useState(false);
  
  // Tab değiştirme fonksiyonu - Profile tabına geçerken loading başlat
  const handleTabChange = (newTab) => {
    console.log(`🔄 Tab değiştiriliyor: ${activeTab} → ${newTab}`);
    setActiveTab(newTab);
    
    // Profile tabına geçiş yapılıyorsa loading başlat
    if (newTab === 'profile') {
      console.log("🏗️ Profile tabına geçiş - loading başlatılıyor");
      // ProfileProviderTab component'i mount edildiğinde loading başlayacak
    }
  }

  // Dashboard açılır açılmaz profil verilerini pre-load et
  const preloadProfileData = async () => {
    if (profileCache || profileLoading) return; // Zaten yüklendi veya yükleniyor
    
    setProfileLoading(true);
    try {
      console.log("📦 Pre-loading profile data...");
      
      const profileResponse = await fetch('/api/profile/get', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        setProfileCache(profileData);
        console.log("✅ Profile data pre-loaded and cached");
      }
    } catch (error) {
      console.error("❌ Profile pre-load failed:", error);
    } finally {
      setProfileLoading(false);
    }
  };
  const [showServiceModal, setShowServiceModal] = useState(false)
  const [editingService, setEditingService] = useState(null)
  const [services, setServices] = useState([])
  const [orders, setOrders] = useState([])
  const [recentTransactions, setRecentTransactions] = useState([])
  const [conversations, setConversations] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setServices(mockServices)
      setOrders(mockOrders)
      setRecentTransactions(mockRecentTransactions)
      setConversations(mockConversations)
      setIsLoading(false)
      
      if (AuthUser?.role === "PROVIDER") {
        preloadProfileData();
      }
    }, 1000)

    return () => clearTimeout(timeout)
  }, [AuthUser])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!AuthUser) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <p>Lütfen giriş yapın</p>
      </div>
    )
  }

  const totalRevenue = orders
    .filter(o => o.status === 'completed')
    .reduce((sum, order) => sum + order.provider_amount, 0)

  const stats = [
    {
      title: 'Toplam Gelir',
      value: `$${totalRevenue.toFixed(2)}`,
      subtitle: 'Satışların %80\'i',
      icon: DollarSign,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20'
    },
    {
      title: 'Aktif Hizmetler',
      value: services.length,
      icon: Package,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20'
    },
    {
      title: 'Bekleyen Siparişler',
      value: orders.filter(o => o.status === 'pending').length,
      icon: Clock,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/20'
    },
    {
      title: 'Okunmamış Mesajlar',
      value: conversations.reduce((sum, c) => sum + c.unread_count, 0),
      icon: MessageCircle,
      color: 'text-primary-400',
      bgColor: 'bg-primary-500/10',
      borderColor: 'border-primary-500/20'
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Hoş geldin, {AuthUser?.name}!</h1>
          <button
            onClick={() => setShowServiceModal(true)}
            className="flex items-center space-x-2 bg-primary-600 text-black px-4 py-2 rounded-md hover:bg-primary-700 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Hizmet</span>
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`bg-gray-900 border ${stat.borderColor} p-4 rounded-lg`}
            >
              <div className="flex justify-between items-center mb-2">
                <div className={`w-10 h-10 ${stat.bgColor} flex items-center justify-center rounded-md`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
              <div className="text-xl font-bold">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.title}</div>
              {stat.subtitle && <div className="text-xs text-gray-500">{stat.subtitle}</div>}
            </motion.div>
          ))}
        </div>

        {/* Tab Buttons */}
        <div className="overflow-x-auto flex space-x-4 border-b border-gray-700 mb-6">
          {[
            { key: 'overview', label: 'Genel Bakış' },
            { key: 'services', label: 'Hizmetler' },
            { key: 'profile', label: 'Profil' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`pb-2 text-md font-semibold ${
                activeTab === tab.key ? 'text-primary-500 border-b-2 border-primary-500' : 'text-gray-400'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && <OverviewTab orders={orders} />}
          {activeTab === 'services' && (
            <ServicesTab
              userInfo={AuthUser}
            />
          )}
          {activeTab === 'profile' && <ProfileProviderTab userInfo={AuthUser} profileCache={profileCache} />}
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={showServiceModal}
        onClose={() => {
          setShowServiceModal(false)
          setEditingService(null)
        }}
        title={editingService ? 'Hizmeti Düzenle' : 'Yeni Hizmet Ekle'}
      >
        <div className="p-4 text-white text-sm">
          Form buraya gelecek. Bu alan geliştirme aşamasındadır.
        </div>
      </Modal>
    </div>
  )
}