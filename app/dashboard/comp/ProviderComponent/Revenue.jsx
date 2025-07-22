'use client'

import React from 'react'

export const RevenueTab = ({ totalRevenue }) => {
  const gross = totalRevenue / 0.8
  const fee = gross * 0.2

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-gray-900 border border-gray-700 p-4 rounded-md text-center">
        <div className="text-2xl text-emerald-400 font-bold">${totalRevenue.toFixed(2)}</div>
        <div className="text-gray-400 text-sm mt-1">Net Kazanç (80%)</div>
      </div>
      <div className="bg-gray-900 border border-gray-700 p-4 rounded-md text-center">
        <div className="text-2xl text-red-400 font-bold">${fee.toFixed(2)}</div>
        <div className="text-gray-400 text-sm mt-1">Komisyon (20%)</div>
      </div>
      <div className="bg-gray-900 border border-gray-700 p-4 rounded-md text-center">
        <div className="text-2xl text-primary-400 font-bold">${gross.toFixed(2)}</div>
        <div className="text-gray-400 text-sm mt-1">Toplam Satış (100%)</div>
      </div>
    </div>
  )
}
