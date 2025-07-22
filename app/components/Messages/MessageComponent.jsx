"use client"

import React from 'react';
import { motion } from 'framer-motion';

export const MessagesPage = () => {
  return (
    <div className="min-h-screen bg-dark-950 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold mb-6">Mesajlar</h1>
          <p className="text-gray-400">Bu sayfa yakında gelecek...</p>
        </motion.div>
      </div>
    </div>
  );
};