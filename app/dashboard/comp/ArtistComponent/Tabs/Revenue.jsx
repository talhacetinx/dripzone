"use client"
import React from 'react'

export const RevenueArtistTab = ({ orders }) => {
  const totalRevenue = orders
    .filter(o => o.status === 'completed')
    .reduce((sum, order) => sum + order.provider_amount, 0)

  return (
    <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
      <h3 className="text-lg font-bold mb-4">Gelir Özeti</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gray-800/30 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-emerald-400 mb-2">
            ${totalRevenue.toFixed(2)}
          </div>
          <div className="text-gray-400 text-sm">Toplam Kazanç</div>
        </div>
        <div className="bg-gray-800/30 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-400 mb-2">
            ${(totalRevenue * 0.25).toFixed(2)}
          </div>
          <div className="text-gray-400 text-sm">Platform Ücreti (20%)</div>
        </div>
        <div className="bg-gray-800/30 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-primary-400 mb-2">
            ${(totalRevenue / 0.8).toFixed(2)}
          </div>
          <div className="text-gray-400 text-sm">Brüt Satış</div>
        </div>
      </div>
    </div>
  )
}