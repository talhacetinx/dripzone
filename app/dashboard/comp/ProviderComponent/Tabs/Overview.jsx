'use client'

import React, { useState } from 'react'
import { Search, Eye, MoreHorizontal } from 'lucide-react'
import { motion } from 'framer-motion'

export const OverviewTab = ({ orders }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('Tüm Durumlar') // Türkçe olarak düzeltildi

  console.log('🎯 OverviewTab render edildi!');
  console.log('- searchTerm:', searchTerm);
  console.log('- statusFilter:', statusFilter);

  // Mock payments data similar to the image
  const mockPayments = [
    {
      id: 'PAY-001',
      paymentId: 'pay_3h4f7fg8s1',
      user: {
        name: 'Ahmet Yılmaz',
        email: 'ahmet@example.com',
        avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=50'
      },
      service: {
        title: 'Hip-Hop Beat Prodüksiyonu',
        category: 'Beat Studio tarafından'
      },
      amount: 250.00,
      fee: 12.50,
      net: 237.50,
      status: 'Tamamlandı',
      date: '15.01.2024',
      time: '14:32'
    },
    {
      id: 'PAY-002',
      paymentId: 'pay_9j8k2l3m4n',
      user: {
        name: 'Elif Kaya',
        email: 'elif@example.com',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=50'
      },
      service: {
        title: 'Albüm Kapağı Tasarımı',
        category: 'Design Studio tarafından'
      },
      amount: 180.00,
      fee: 9.00,
      net: 171.00,
      status: 'Bekliyor',
      date: '15.01.2024',
      time: '16:45'
    },
    {
      id: 'PAY-003',
      paymentId: 'pay_5p6q7r8s9t',
      user: {
        name: 'Can Demir',
        email: 'can@example.com',
        avatar: 'https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?auto=compress&cs=tinysrgb&w=50'
      },
      service: {
        title: 'Müzik Videosu Prodüksiyonu',
        category: 'Video Pro tarafından'
      },
      amount: 850.00,
      fee: 42.50,
      net: 807.50,
      status: 'Tamamlandı',
      date: '15.01.2024',
      time: '09:15'
    },
    {
      id: 'PAY-004',
      paymentId: 'pay_1a2b3c4d5e',
      user: {
        name: 'Zeynep Ak',
        email: 'zeynep@example.com',
        avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=50'
      },
      service: {
        title: 'Vokal Kayıt Seansı',
        category: 'Sound Lab tarafından'
      },
      amount: 320.00,
      fee: 16.00,
      net: 304.00,
      status: 'İşleniyor',
      date: '14.01.2024',
      time: '11:20'
    },
    {
      id: 'PAY-005',
      paymentId: 'pay_6f7g8h9i0j',
      user: {
        name: 'Murat Özkan',
        email: 'murat@example.com',
        avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=50'
      },
      service: {
        title: 'Mixing & Mastering',
        category: 'Audio Masters tarafından'
      },
      amount: 450.00,
      fee: 22.50,
      net: 427.50,
      status: 'Tamamlandı',
      date: '14.01.2024',
      time: '16:30'
    }
  ]

  const filteredPayments = mockPayments.filter(payment => {
    const matchesSearch = searchTerm === '' || 
      payment.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.paymentId.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'Tüm Durumlar' || payment.status === statusFilter
    
    console.log(`💡 Payment ${payment.id}: search=${matchesSearch}, status=${matchesStatus} (${payment.status} vs ${statusFilter})`);
    
    return matchesSearch && matchesStatus
  })

  console.log('📊 Overview Data Debug:');
  console.log('- mockPayments length:', mockPayments.length);
  console.log('- filteredPayments length:', filteredPayments.length);
  console.log('- searchTerm:', searchTerm);
  console.log('- statusFilter:', statusFilter);
  console.log('- First mock payment status:', mockPayments[0]?.status);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Tamamlandı':
        return 'text-emerald-400 bg-emerald-400/10'
      case 'Bekliyor':
        return 'text-yellow-400 bg-yellow-400/10'
      case 'İşleniyor':
        return 'text-blue-400 bg-blue-400/10'
      default:
        return 'text-gray-400 bg-gray-400/10'
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
      <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white">Siparişler</h2>
            <p className="text-sm text-gray-400">{filteredPayments.length} / {mockPayments.length} ödeme gösteriliyor</p>
          </div>
          
          {/* Search and Filter */}
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Ödemelerde ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option>Tüm Durumlar</option>
              <option>Tamamlandı</option>
              <option>Bekliyor</option>
              <option>İşleniyor</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/50">
              <tr className="text-left text-xs text-gray-400 uppercase tracking-wider">
                <th className="px-4 py-3">Ödeme ID</th>
                <th className="px-4 py-3">Kullanıcı</th>
                <th className="px-4 py-3">Hizmet</th>
                <th className="px-4 py-3">Tutar</th>
                <th className="px-4 py-3">Komisyon</th>
                <th className="px-4 py-3">Net</th>
                <th className="px-4 py-3">Durum</th>
                <th className="px-4 py-3">Tarih</th>
                <th className="px-4 py-3">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-800/30 transition-colors">
                  <td className="px-4 py-4">
                    <div className="text-sm">
                      <div className="font-medium text-white">{payment.id}</div>
                      <div className="text-gray-400 text-xs">{payment.paymentId}</div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={payment.user.avatar}
                        alt={payment.user.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <div className="text-sm font-medium text-white">{payment.user.name}</div>
                        <div className="text-xs text-gray-400">{payment.user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm">
                      <div className="font-medium text-white">{payment.service.title}</div>
                      <div className="text-gray-400 text-xs">{payment.service.category}</div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm font-medium text-white">${payment.amount.toFixed(2)}</div>
                    <div className="text-xs text-gray-400">PayPal</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm font-medium text-red-400">${payment.fee.toFixed(2)}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm font-medium text-emerald-400">${payment.net.toFixed(2)}</div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-white">{payment.date}</div>
                    <div className="text-xs text-gray-400">{payment.time}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-gray-400 hover:text-white transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-white transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredPayments.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-gray-400">Kriterlere uygun ödeme bulunamadı.</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}
