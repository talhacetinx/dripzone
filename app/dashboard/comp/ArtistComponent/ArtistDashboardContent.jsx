'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { Modal } from '../../../components/ui/Modal'
import { OverviewArtistTab } from './Tabs/Overview'
import { ServicesArtistTab } from './Tabs/Services'
import { OrdersArtistTab } from './Tabs/Orders'
import { RevenueArtistTab } from './Tabs/Revenue'


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
  }
]

const mockConversations = [
  { id: 'a1', unread_count: 1 },
  { id: 'a2', unread_count: 0 }
]

export const ArtistDashboardContent = ({ session }) => {
  const [activeTab, setActiveTab] = useState('overview')
  const [services, setServices] = useState([])
  const [orders, setOrders] = useState([])
  const [conversations, setConversations] = useState([])
  const [showServiceModal, setShowServiceModal] = useState(false)

  useEffect(() => {
    // Mock verileri yükle
    const timeout = setTimeout(() => {
      setServices(mockServices)
      setOrders(mockOrders)
      setConversations(mockConversations)
    }, 500)

    return () => clearTimeout(timeout)
  }, [])

  const tabs = [
    { id: 'overview', label: 'Genel Bakış' },
    { id: 'services', label: 'Hizmetlerim' },
    { id: 'orders', label: 'Siparişler' },
    { id: 'revenue', label: 'Gelir' }
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold">Hoş geldin, {session?.user?.name}!</h1>
          <button
            onClick={() => setShowServiceModal(true)}
            className="flex items-center space-x-2 bg-primary-600 text-black px-4 py-2 rounded-md hover:bg-primary-700 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Hizmet</span>
          </button>
        </div>

        {/* Tab Menüleri */}
        <div className="flex space-x-4 border-b border-gray-700 mb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-2 text-sm font-semibold whitespace-nowrap ${
                activeTab === tab.id ? 'text-primary-500 border-b-2 border-primary-500' : 'text-gray-400'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

      {activeTab === 'overview' && <OverviewArtistTab orders={orders} />}
      {activeTab === 'services' && <ServicesArtistTab services={services} />}
      {activeTab === 'orders' && <OrdersArtistTab orders={orders} />}
      {activeTab === 'revenue' && <RevenueArtistTab orders={orders} />}
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
