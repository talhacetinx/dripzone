"use client"

import React, { useState } from 'react';
import { 
  BarChart3, TrendingUp, TrendingDown, DollarSign, Users, 
  Download, CreditCard, Activity, ArrowUpRight, ArrowDownRight,
  Eye, MoreHorizontal, CheckCircle, Clock, AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion'
import {FiLogOut } from "react-icons/fi";



export const AdminDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');

  const metrics = [
    {
      title: 'Total Revenue',
      value: '$127,543.89',
      change: '+20.1%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
      gradient: 'from-emerald-500/20 to-green-500/20'
    },
    {
      title: 'Active Users',
      value: '12,350',
      change: '+180.1%',
      trend: 'up',
      icon: Users,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      gradient: 'from-blue-500/20 to-cyan-500/20'
    },
    {
      title: 'Transactions',
      value: '8,234',
      change: '+19%',
      trend: 'up',
      icon: CreditCard,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
      gradient: 'from-purple-500/20 to-pink-500/20'
    },
    {
      title: 'Conversion Rate',
      value: '94.2%',
      change: '+4.3%',
      trend: 'up',
      icon: Activity,
      color: 'text-primary-400',
      bgColor: 'bg-primary-500/10',
      borderColor: 'border-primary-500/20',
      gradient: 'from-primary-500/20 to-primary-400/20'
    }
  ];

  const recentTransactions = [
    {
      id: 'TXN001',
      user: 'Ahmet Yılmaz',
      service: 'Hip-Hop Beat Production',
      amount: '$250.00',
      status: 'completed',
      date: '2024-01-15',
      time: '14:30',
      avatar: 'https://images.pexels.com/photos/1319831/pexels-photo-1319831.jpeg?auto=compress&cs=tinysrgb&w=50'
    },
    {
      id: 'TXN002',
      user: 'Elif Kaya',
      service: 'Album Cover Design',
      amount: '$180.00',
      status: 'pending',
      date: '2024-01-15',
      time: '13:45',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=50'
    },
    {
      id: 'TXN003',
      user: 'Can Demir',
      service: 'Music Video Production',
      amount: '$850.00',
      status: 'completed',
      date: '2024-01-15',
      time: '12:20',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=50'
    },
    {
      id: 'TXN004',
      user: 'Zeynep Çelik',
      service: 'Mixing & Mastering',
      amount: '$320.00',
      status: 'processing',
      date: '2024-01-15',
      time: '11:15',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=50'
    }
  ];

  const quickStats = [
    { label: "Today's Revenue", value: '$2,847.32', change: '+12.5%', positive: true },
    { label: 'New Users', value: '127', change: '+8.2%', positive: true },
    { label: 'Pending Orders', value: '23', change: '-2.1%', positive: false },
    { label: 'Success Rate', value: '94.2%', change: '+1.8%', positive: true }
  ];

  const chartData = [
    { month: 'Jan', revenue: 45000 },
    { month: 'Feb', revenue: 52000 },
    { month: 'Mar', revenue: 48000 },
    { month: 'Apr', revenue: 61000 },
    { month: 'May', revenue: 55000 },
    { month: 'Jun', revenue: 67000 },
    { month: 'Jul', revenue: 73000 },
    { month: 'Aug', revenue: 69000 },
    { month: 'Sep', revenue: 78000 },
    { month: 'Oct', revenue: 85000 },
    { month: 'Nov', revenue: 92000 },
    { month: 'Dec', revenue: 127543 }
  ];

  const maxRevenue = Math.max(...chartData.map(d => d.revenue));

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'processing':
        return <Activity className="w-4 h-4 text-blue-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-red-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'pending':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'processing':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      default:
        return 'text-red-400 bg-red-500/10 border-red-500/20';
    }
  };

  const handleSignOut = async () => {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/";
  };

  return (
    <div className="p-4 sm:p-8 min-h-screen bg-black">
      <div className="mb-8 sm:mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row lg:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-primary-400 to-primary-500 bg-clip-text text-transparent">
              Dashboard Overview
            </h1>
            <p className="text-gray-300 text-base sm:text-lg">Track your platform's performance and revenue</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="flex bg-gray-900/50 backdrop-blur-xl rounded-xl p-1 border border-primary-500/30">
              {['24h', '7d', '30d', '90d'].map((period) => (
                <motion.button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                    selectedPeriod === period
                      ? 'bg-gradient-to-r from-primary-500 to-primary-400 text-black shadow-yellow-glow'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {period}
                </motion.button>
              ))}
            </div>
            
            <motion.button
              className="flex items-center justify-center space-x-2 px-4 text-white gap-4 
              sm:px-6 py-2 sm:py-3 bg-red-950 backdrop-blur-xl border border-primary-500/30 rounded-xl hover:border-primary-500/50 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSignOut} 
            >
              Sign Out
              <FiLogOut size={20} />
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Metrics Grid - Responsive optimization */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`bg-gradient-to-br ${metric.gradient} backdrop-blur-xl border ${metric.borderColor} rounded-2xl p-6 sm:p-8 hover:border-opacity-50 transition-all duration-500 group hover:shadow-yellow-glow`}
          >
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className={`w-12 h-12 sm:w-14 sm:h-14 ${metric.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <metric.icon className={`w-6 h-6 sm:w-7 sm:h-7 ${metric.color}`} />
              </div>
              <div className={`flex items-center space-x-1 text-sm ${
                metric.trend === 'up' ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {metric.trend === 'up' ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                <span className="font-semibold">{metric.change}</span>
              </div>
            </div>
            
            <div>
              <div className="text-2xl sm:text-3xl font-bold mb-2 text-white">{metric.value}</div>
              <div className="text-sm text-gray-300 font-medium">{metric.title}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts and Tables Row - Mobile optimized */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-gray-900/50 backdrop-blur-xl border border-primary-500/30 rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-2">
            <h3 className="text-xl sm:text-2xl font-bold text-white">Revenue Analytics</h3>
            <div className="text-gray-400 text-sm">Last 12 months</div>
          </div>
          
          {/* Sample Chart */}
          <div className="h-64 sm:h-80 relative">
            <div className="absolute inset-0 flex items-end justify-between px-2 sm:px-4 pb-6 sm:pb-8">
              {chartData.map((data, index) => (
                <div key={data.month} className="flex flex-col items-center space-y-1 sm:space-y-2 flex-1">
                  <div className="text-xs text-gray-400 mb-1 sm:mb-2">${(data.revenue / 1000).toFixed(0)}k</div>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(data.revenue / maxRevenue) * 160}px` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className="w-4 sm:w-8 bg-gradient-to-t from-primary-500 to-primary-400 rounded-t-lg shadow-yellow-glow"
                  />
                  <div className="text-xs text-gray-400">{data.month}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-gray-900/50 backdrop-blur-xl border border-primary-500/30 rounded-2xl p-6 sm:p-8">
          <h3 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-white">Quick Stats</h3>
          
          <div className="space-y-4 sm:space-y-6">
            {quickStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center justify-between p-3 sm:p-4 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition-all duration-300 group border border-primary-500/10 hover:border-primary-500/30"
              >
                <div>
                  <div className="text-sm text-gray-400 mb-1">{stat.label}</div>
                  <div className="text-lg sm:text-xl font-bold text-white">{stat.value}</div>
                </div>
                <div className={`text-sm font-semibold ${stat.positive ? 'text-emerald-400' : 'text-red-400'}`}>
                  {stat.change}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions - Mobile optimized */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-gray-900/50 backdrop-blur-xl border border-primary-500/30 rounded-2xl p-6 sm:p-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <h3 className="text-xl sm:text-2xl font-bold text-white">Recent Transactions</h3>
          <motion.button 
            className="flex items-center justify-center space-x-2 text-primary-400 hover:text-primary-300 transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <Eye className="w-4 h-4" />
            <span className="text-sm font-medium">View All</span>
          </motion.button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-primary-500/20">
                <th className="text-left py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm font-semibold text-gray-400 uppercase tracking-wider">User</th>
                <th className="text-left py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm font-semibold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Service</th>
                <th className="text-left py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm font-semibold text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="text-left py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="text-left py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm font-semibold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Date</th>
                <th className="text-left py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((transaction, index) => (
                <motion.tr
                  key={transaction.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="border-b border-primary-500/10 hover:bg-gray-800/30 transition-all duration-300 group"
                >
                  <td className="py-4 sm:py-6 px-4 sm:px-6">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <img
                        src={transaction.avatar}
                        alt={transaction.user}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-semibold text-white text-sm">{transaction.user}</div>
                        <div className="text-xs text-gray-400 sm:hidden">{transaction.service}</div>
                        <div className="text-xs text-gray-400">{transaction.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 sm:py-6 px-4 sm:px-6 hidden sm:table-cell">
                    <div className="text-sm text-gray-300 font-medium">{transaction.service}</div>
                  </td>
                  <td className="py-4 sm:py-6 px-4 sm:px-6">
                    <div className="font-bold text-white text-base sm:text-lg">{transaction.amount}</div>
                  </td>
                  <td className="py-4 sm:py-6 px-4 sm:px-6">
                    <div className={`inline-flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(transaction.status)}`}>
                      {getStatusIcon(transaction.status)}
                      <span className="capitalize hidden sm:inline">{transaction.status}</span>
                    </div>
                  </td>
                  <td className="py-4 sm:py-6 px-4 sm:px-6 hidden lg:table-cell">
                    <div className="text-sm text-gray-300">
                      <div className="font-medium">{transaction.date}</div>
                      <div className="text-gray-500">{transaction.time}</div>
                    </div>
                  </td>
                  <td className="py-4 sm:py-6 px-4 sm:px-6">
                    <motion.button 
                      className="p-1 sm:p-2 hover:bg-gray-800/50 rounded-lg transition-colors duration-300"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <MoreHorizontal className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};