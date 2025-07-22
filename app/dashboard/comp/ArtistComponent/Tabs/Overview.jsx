"use client"
import React from 'react'
import { TrendingUp } from 'lucide-react'

export const OverviewArtistTab = ({ orders }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
        <h3 className="text-lg font-bold mb-4">Son Siparişler</h3>
        <div className="space-y-4">
          {orders.slice(0, 5).map((order) => (
            <div key={order.id} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
              <div className="flex items-center space-x-4">
                <img
                  src={order.artist?.avatar_url || 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=50'}
                  alt={order.artist?.full_name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-sm">{order.service?.title}</h4>
                  <p className="text-xs text-gray-400">{order.artist?.full_name}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-emerald-400 text-sm">${order.provider_amount}</div>
                <div className="text-xs text-gray-500">Kazancın</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 flex flex-col items-center justify-center">
        <h3 className="text-lg font-bold mb-4">Gelir Grafiği</h3>
        <div className="h-40 text-gray-400 flex items-center justify-center">
          <div className="text-center">
            <TrendingUp className="w-10 h-10 mx-auto mb-4 opacity-50" />
            <p>Grafik yakında eklenecek</p>
          </div>
        </div>
      </div>
    </div>
  )
}