"use client"
import React from 'react'

export const ServicesArtistTab = ({ services }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {services.map((service) => (
        <div key={service.id} className="bg-gray-900/50 border border-gray-700 rounded-xl overflow-hidden">
          <div className="h-40 bg-cover bg-center" style={{ backgroundImage: `url(${service.images[0]})` }} />
          <div className="p-4">
            <h4 className="text-lg font-bold mb-2">{service.title}</h4>
            <p className="text-sm text-gray-400 mb-2 line-clamp-2">{service.description}</p>
            <div className="flex justify-between text-sm">
              <span className="text-primary-500 font-semibold">${service.price}</span>
              <span className="text-gray-400">{service.delivery_time} gün</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}