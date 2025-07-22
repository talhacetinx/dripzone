'use client'

import React from 'react'
import { TrendingUp } from 'lucide-react'

export const OverviewTab = ({ orders }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
        <h3 className="text-lg font-bold mb-4">Son Siparişler</h3>
        <ul className="space-y-3">
          {orders.slice(0, 5).map((order) => (
            <li key={order.id} className="flex items-center justify-between text-sm text-white bg-gray-800 p-3 rounded-md">
              <div>
                <p className="font-medium">{order.service?.title}</p>
                <p className="text-gray-400 text-xs">{order.artist?.full_name}</p>
              </div>
              <div className="text-emerald-400 font-semibold">${order.provider_amount}</div>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 flex flex-col items-center justify-center">
        <TrendingUp className="w-10 h-10 text-gray-500 mb-2" />
        <p className="text-gray-400">Gelir grafiği yakında eklenecek</p>
      </div>
    </div>
  )
}
