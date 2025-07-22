"use client"
import React from 'react'

export const OrdersArtistTab = ({ orders }) => {
  return (
    <div className="bg-gray-900/50 border border-gray-700 rounded-xl overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-800/50">
          <tr>
            <th className="text-left py-4 px-6 text-gray-400">Müşteri</th>
            <th className="text-left py-4 px-6 text-gray-400">Hizmet</th>
            <th className="text-left py-4 px-6 text-gray-400">Toplam</th>
            <th className="text-left py-4 px-6 text-gray-400">Kazanç</th>
            <th className="text-left py-4 px-6 text-gray-400">Durum</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b border-gray-700/50 hover:bg-gray-800/30">
              <td className="py-4 px-6">{order.artist?.full_name}</td>
              <td className="py-4 px-6">{order.service?.title}</td>
              <td className="py-4 px-6">${order.total_amount}</td>
              <td className="py-4 px-6 text-emerald-400">${order.provider_amount}</td>
              <td className="py-4 px-6 capitalize">{order.status.replace('_', ' ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
