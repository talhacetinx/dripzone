'use client'

import React from 'react'
import { Edit, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'

export const ServicesTab = ({ services, onEdit, onDelete }) => {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {services.map((service) => (
        <div key={service.id} className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">
          <div
            className="h-40 bg-cover bg-center"
            style={{ backgroundImage: `url(${service.images[0]})` }}
          ></div>
          <div className="p-4">
            <h4 className="font-bold text-white">{service.title}</h4>
            <p className="text-gray-400 text-sm mb-2">{service.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-primary-400 font-semibold">${service.price}</span>
              <div className="flex space-x-2">
                <button onClick={() => onEdit(service)} className="hover:text-blue-400">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => onDelete(service.id)} className="hover:text-red-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </motion.div>
  )
}  
