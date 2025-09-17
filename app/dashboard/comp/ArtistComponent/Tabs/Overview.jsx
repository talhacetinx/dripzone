"use client"
import React from 'react'
import { TrendingUp, Eye, MoreHorizontal } from 'lucide-react'
import { motion } from 'framer-motion'

export const OverviewArtistTab = ({ orders }) => {
  return (
    <div className="space-y-6">
      {/* Order Management Section with Provider Dashboard Design */}
      <div>
        <h3 className="text-lg font-bold mb-4">Sipariş Yönetimi</h3>
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          exit={{ opacity: 0, y: 10 }} 
          className="overflow-x-auto bg-gray-900 border border-gray-700 rounded-xl"
        >
          <table className="w-full text-sm">
            <thead className="bg-gray-800 text-gray-400">
              <tr>
                <th className="p-3 text-left">Müşteri</th>
                <th className="p-3 text-left">Hizmet</th>
                <th className="p-3 text-left">Kazanç</th>
                <th className="p-3 text-left">Durum</th>
                <th className="p-3 text-left">Tarih</th>
                <th className="p-3 text-left">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t border-gray-800 hover:bg-gray-800">
                  <td className="p-3">{order.artist?.full_name}</td>
                  <td className="p-3">{order.service?.title}</td>
                  <td className="p-3 text-emerald-400">${order.provider_amount}</td>
                  <td className="p-3 capitalize">{order.status.replace('_', ' ')}</td>
                  <td className="p-3">{new Date(order.created_at).toLocaleDateString()}</td>
                  <td className="p-3">
                    <div className="flex space-x-2">
                      <Eye className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer" />
                      <MoreHorizontal className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </div>
  )
}