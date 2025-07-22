import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, Heart, MessageCircle, Star, 
  Clock, CheckCircle, AlertCircle, Search,
  Filter, Eye, MoreHorizontal
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useOrders } from '../../hooks/useOrders';
import { useFavorites } from '../../hooks/useFavorites';
import { useMessages } from '../../hooks/useMessages';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export const ArtistDashboard: React.FC = () => {
  const { profile } = useAuth();
  const { orders, loading: ordersLoading } = useOrders('artist');
  const { favorites, loading: favoritesLoading } = useFavorites();
  const { conversations, loading: messagesLoading } = useMessages();
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    {
      title: 'Active Orders',
      value: orders.filter(o => o.status === 'in_progress').length,
      icon: ShoppingBag,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20'
    },
    {
      title: 'Completed Orders',
      value: orders.filter(o => o.status === 'completed').length,
      icon: CheckCircle,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20'
    },
    {
      title: 'Favorite Services',
      value: favorites.length,
      icon: Heart,
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/20'
    },
    {
      title: 'Unread Messages',
      value: conversations.reduce((sum, conv) => sum + conv.unread_count, 0),
      icon: MessageCircle,
      color: 'text-primary-400',
      bgColor: 'bg-primary-500/10',
      borderColor: 'border-primary-500/20'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'in_progress':
        return <Clock className="w-4 h-4 text-blue-400" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'in_progress':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'pending':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'orders', label: 'My Orders' },
    { id: 'favorites', label: 'Favorites' },
    { id: 'messages', label: 'Messages' }
  ];

  if (ordersLoading || favoritesLoading || messagesLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-6 py-8">
        {/* Header - Optimized spacing */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            Welcome back, {profile?.full_name}!
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">Manage your orders and discover new services</p>
        </div>

        {/* Stats Grid - Responsive optimization */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`bg-gray-900/50 border ${stat.borderColor} rounded-xl p-4 sm:p-6`}
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`} />
                </div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-xs sm:text-sm text-gray-400">{stat.title}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabs - Mobile optimized */}
        <div className="flex space-x-4 sm:space-x-6 mb-8 border-b border-gray-700 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 sm:pb-4 px-2 font-semibold transition-colors whitespace-nowrap text-sm sm:text-base ${
                activeTab === tab.id
                  ? 'text-primary-500 border-b-2 border-primary-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8"
            >
              {/* Recent Orders */}
              <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold mb-4">Recent Orders</h3>
                <div className="space-y-3 sm:space-y-4">
                  {orders.slice(0, 3).map((order) => (
                    <div key={order.id} className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-800/30 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm sm:text-base line-clamp-1">{order.service?.title}</h4>
                        <p className="text-xs sm:text-sm text-gray-400 line-clamp-1">{order.provider?.full_name}</p>
                      </div>
                      <div className={`inline-flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="capitalize hidden sm:inline">{order.status.replace('_', ' ')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Messages */}
              <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold mb-4">Recent Messages</h3>
                <div className="space-y-3 sm:space-y-4">
                  {conversations.slice(0, 3).map((conversation) => (
                    <div key={conversation.user_id} className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-800/30 rounded-lg">
                      <img
                        src={conversation.user_avatar || 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=50'}
                        alt={conversation.user_name}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm sm:text-base line-clamp-1">{conversation.user_name}</h4>
                        <p className="text-xs sm:text-sm text-gray-400 truncate">{conversation.last_message}</p>
                      </div>
                      {conversation.unread_count > 0 && (
                        <span className="w-4 h-4 sm:w-5 sm:h-5 bg-primary-500 rounded-full text-xs flex items-center justify-center font-semibold text-black flex-shrink-0">
                          {conversation.unread_count}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'orders' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900/50 border border-gray-700 rounded-xl overflow-hidden"
            >
              <div className="p-4 sm:p-6 border-b border-gray-700">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h3 className="text-lg sm:text-xl font-semibold">My Orders</h3>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search orders..."
                        className="pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm w-full sm:w-auto"
                      />
                    </div>
                    <button className="flex items-center justify-center space-x-2 px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg hover:border-gray-500 transition-colors">
                      <Filter className="w-4 h-4" />
                      <span className="text-sm">Filter</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Mobile-optimized table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-800/50">
                    <tr>
                      <th className="text-left py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm font-medium text-gray-400">Service</th>
                      <th className="text-left py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm font-medium text-gray-400 hidden sm:table-cell">Provider</th>
                      <th className="text-left py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm font-medium text-gray-400">Amount</th>
                      <th className="text-left py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm font-medium text-gray-400">Status</th>
                      <th className="text-left py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm font-medium text-gray-400 hidden lg:table-cell">Date</th>
                      <th className="text-left py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm font-medium text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-700/50 hover:bg-gray-800/30 transition-colors">
                        <td className="py-3 sm:py-4 px-4 sm:px-6">
                          <div>
                            <div className="font-medium text-sm sm:text-base line-clamp-1">{order.service?.title}</div>
                            <div className="text-xs sm:text-sm text-gray-400 sm:hidden">{order.provider?.full_name}</div>
                            <div className="text-xs text-gray-400 sm:hidden">{order.service?.category}</div>
                          </div>
                        </td>
                        <td className="py-3 sm:py-4 px-4 sm:px-6 hidden sm:table-cell">
                          <div className="flex items-center space-x-3">
                            <img
                              src={order.provider?.avatar_url || 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=50'}
                              alt={order.provider?.full_name}
                              className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover"
                            />
                            <span className="font-medium text-sm">{order.provider?.full_name}</span>
                          </div>
                        </td>
                        <td className="py-3 sm:py-4 px-4 sm:px-6">
                          <div className="font-semibold text-sm sm:text-base">${order.total_amount}</div>
                        </td>
                        <td className="py-3 sm:py-4 px-4 sm:px-6">
                          <div className={`inline-flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            <span className="capitalize hidden sm:inline">{order.status.replace('_', ' ')}</span>
                          </div>
                        </td>
                        <td className="py-3 sm:py-4 px-4 sm:px-6 hidden lg:table-cell">
                          <div className="text-sm">
                            {new Date(order.created_at).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="py-3 sm:py-4 px-4 sm:px-6">
                          <div className="flex items-center space-x-1 sm:space-x-2">
                            <button className="p-1 sm:p-2 hover:bg-gray-700/50 rounded-lg transition-colors">
                              <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                            </button>
                            <button className="p-1 sm:p-2 hover:bg-gray-700/50 rounded-lg transition-colors">
                              <MoreHorizontal className="w-3 h-3 sm:w-4 sm:h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'favorites' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
            >
              {favorites.map((favorite) => (
                <div key={favorite.id} className="bg-gray-900/50 border border-gray-700 rounded-xl overflow-hidden hover:border-primary-500/50 transition-colors">
                  <div className="h-40 sm:h-48 bg-cover bg-center" style={{ backgroundImage: `url(${favorite.service?.images[0] || 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300'})` }}>
                    <div className="h-full bg-gradient-to-t from-gray-900/80 via-transparent to-transparent flex items-end p-3 sm:p-4">
                      <div className="text-white">
                        <h4 className="font-bold text-sm sm:text-base line-clamp-1">{favorite.service?.title}</h4>
                        <p className="text-xs sm:text-sm text-gray-300 line-clamp-1">{favorite.service?.provider?.full_name}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 sm:p-4">
                    <p className="text-gray-400 text-xs sm:text-sm mb-3 line-clamp-2">{favorite.service?.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-base sm:text-lg font-bold text-primary-500">${favorite.service?.price}</span>
                      <button className="px-3 sm:px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg font-semibold transition-colors text-black text-xs sm:text-sm">
                        Order Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'messages' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900/50 border border-gray-700 rounded-xl p-4 sm:p-6"
            >
              <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Messages</h3>
              <div className="space-y-3 sm:space-y-4">
                {conversations.map((conversation) => (
                  <div key={conversation.user_id} className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors cursor-pointer">
                    <img
                      src={conversation.user_avatar || 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=50'}
                      alt={conversation.user_name}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-sm sm:text-base line-clamp-1">{conversation.user_name}</h4>
                        <span className="text-xs text-gray-400 flex-shrink-0">
                          {new Date(conversation.last_message_time).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-400 truncate">{conversation.last_message}</p>
                    </div>
                    {conversation.unread_count > 0 && (
                      <span className="w-5 h-5 sm:w-6 sm:h-6 bg-primary-500 rounded-full text-xs flex items-center justify-center font-semibold text-black flex-shrink-0">
                        {conversation.unread_count}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};