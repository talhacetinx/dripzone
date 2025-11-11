'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { Modal } from '../../../components/ui/Modal'
import { OverviewArtistTab } from './Tabs/Overview'
import { ProfileTab } from './Tabs/Profile'

// Mock Data
const mockServices = [
  {
    id: '1',
    title: 'Album Artwork',
    description: 'Özel albüm kapak tasarımı',
    category: 'album-cover-artists',
    price: 250,
    delivery_time: 4,
    revisions: 2,
    features: ['PSD Dosyası', 'Sosyal medya uyumlu'],
    images: ['https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg']
  }
]

const mockOrders = [
  {
    id: '201',
    status: 'completed',
    provider_amount: 160,
    total_amount: 200,
    created_at: new Date().toISOString(),
    artist: {
      full_name: 'Ali Demir',
      email: 'ali@example.com',
      avatar_url: 'https://randomuser.me/api/portraits/men/46.jpg'
    },
    service: {
      title: 'Albüm Kapağı Tasarımı'
    }
  },
  {
    id: '202',
    status: 'pending',
    provider_amount: 120,
    total_amount: 150,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    artist: {
      full_name: 'Zeynep Kaya',
      email: 'zeynep@example.com',
      avatar_url: 'https://randomuser.me/api/portraits/women/32.jpg'
    },
    service: {
      title: 'Logo Tasarımı'
    }
  },
  {
    id: '203',
    status: 'in_progress',
    provider_amount: 200,
    total_amount: 250,
    created_at: new Date(Date.now() - 172800000).toISOString(),
    artist: {
      full_name: 'Mehmet Özkan',
      email: 'mehmet@example.com',
      avatar_url: 'https://randomuser.me/api/portraits/men/55.jpg'
    },
    service: {
      title: 'Poster Tasarımı'
    }
  },
  {
    id: '204',
    status: 'completed',
    provider_amount: 300,
    total_amount: 375,
    created_at: new Date(Date.now() - 259200000).toISOString(),
    artist: {
      full_name: 'Ayşe Türk',
      email: 'ayse@example.com',
      avatar_url: 'https://randomuser.me/api/portraits/women/67.jpg'
    },
    service: {
      title: 'Marka Kimliği Tasarımı'
    }
  },
  {
    id: '205',
    status: 'cancelled',
    provider_amount: 80,
    total_amount: 100,
    created_at: new Date(Date.now() - 345600000).toISOString(),
    artist: {
      full_name: 'Can Yılmaz',
      email: 'can@example.com',
      avatar_url: 'https://randomuser.me/api/portraits/men/22.jpg'
    },
    service: {
      title: 'İllüstrasyon'
    }
  }
]

const mockConversations = [
  { id: 'a1', unread_count: 1 },
  { id: 'a2', unread_count: 0 }
]

export const ArtistDashboardContent = ({ user }) => {
  const [activeTab, setActiveTab] = useState('overview')
  const [profileCache, setProfileCache] = useState(null); // Profil cache
  const [profileLoading, setProfileLoading] = useState(false);
  
  // Profile cache temizleme fonksiyonu
  const clearProfileCache = () => {
    console.log("🗑️ Artist Profile cache temizleniyor");
    setProfileCache(null);
  };
  
  // Tab değiştirme fonksiyonu - Profile tabına geçerken loading başlat
  const handleTabChange = (newTab) => {
    console.log(`🔄 Artist Tab değiştiriliyor: ${activeTab} → ${newTab}`);
    setActiveTab(newTab);
    
    // Profile tabına geçiş yapılıyorsa loading başlat
    if (newTab === 'profile') {
      console.log("🎨 Artist Profile tabına geçiş - loading başlatılıyor");
      // ProfileTab component'i mount edildiğinde loading başlayacak
    }
  }

  // Dashboard açılır açılmaz profil verilerini pre-load et
  const preloadProfileData = async () => {
    if (profileCache || profileLoading) return; // Zaten yüklendi veya yükleniyor
    
    setProfileLoading(true);
    try {
      console.log("🎨 Artist - Pre-loading profile data...");
      
      const profileResponse = await fetch('/api/profile/get', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        setProfileCache(profileData);
        console.log("✅ Artist Profile data pre-loaded and cached", profileData);
      }
    } catch (error) {
      console.error("❌ Artist Profile pre-load failed:", error);
    } finally {
      setProfileLoading(false);
    }
  };
  
  const [services, setServices] = useState([])
  const [orders, setOrders] = useState([])
  const [conversations, setConversations] = useState([])
  const [showServiceModal, setShowServiceModal] = useState(false)

  console.log(user)
  useEffect(() => {
    // Mock verileri yükle
    const timeout = setTimeout(() => {
      setServices(mockServices)
      setOrders(mockOrders)
      setConversations(mockConversations)
      
      // Artist profil verilerini pre-load et
      if (user?.role === "ARTIST") {
        preloadProfileData();
      }
    }, 500)

    return () => clearTimeout(timeout)
  }, [user])

  const tabs = [
    { id: 'overview', label: 'Genel Bakış' },
    { id: 'profile', label: 'Profil' }
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold">Hoş geldin, {user.name}!</h1>
          <button
            onClick={() => setShowServiceModal(true)}
            className="flex items-center space-x-2 bg-primary-600 text-black px-4 py-2 rounded-md hover:bg-primary-700 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Hizmet</span>
          </button>
        </div>

        {/* Tab Menüleri */}
        <div className="overflow-x-auto flex space-x-4 border-b border-gray-700 mb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`pb-2 text-sm font-semibold whitespace-nowrap ${
                activeTab === tab.id ? 'text-primary-500 border-b-2 border-primary-500' : 'text-gray-400'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

      {activeTab === 'overview' && <OverviewArtistTab orders={orders} />}
      {activeTab === 'profile' && <ProfileTab orders={orders} userInfo={user} profileCache={profileCache} clearProfileCache={clearProfileCache} />}
      </div>

      {/* Modal */}
      <Modal
        isOpen={showServiceModal}
        onClose={() => setShowServiceModal(false)}
        title="Yeni Hizmet Ekle"
      >
        <div className="p-4 text-white text-sm">
          Form buraya eklenecek.
        </div>
      </Modal>
    </div>
  )
}
