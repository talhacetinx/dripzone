import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, Package, MessageCircle, Star, 
  Plus, Edit, Trash2, Eye, MoreHorizontal,
  TrendingUp, Clock, CheckCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useServices } from '../../hooks/useServices';
import { useOrders } from '../../hooks/useOrders';
import { useMessages } from '../../hooks/useMessages';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Modal } from '../../components/ui/Modal';

export const ProviderDashboard: React.FC = () => {
  const { profile, user } = useAuth();
  const { services, loading: servicesLoading, createService, updateService, deleteService } = useServices(undefined, user?.id);
  const { orders, loading: ordersLoading } = useOrders('provider');
  const { conversations, loading: messagesLoading } = useMessages();
  const [activeTab, setActiveTab] = useState('overview');
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);

  // Calculate revenue (80% of total sales)
  const totalRevenue = orders
    .filter(o => o.status === 'completed')
    .reduce((sum, order) => sum + order.provider_amount, 0);

  const stats = [
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toFixed(2)}`,
      subtitle: '80% of sales',
      icon: DollarSign,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20'
    },
    {
      title: 'Active Services',
      value: services.filter(s => s.active).length,
      icon: Package,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20'
    },
    {
      title: 'Pending Orders',
      value: orders.filter(o => o.status === 'pending').length,
      icon: Clock,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/20'
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

  const [serviceForm, setServiceForm] = useState({
    title: '',
    description: '',
    category: 'producers',
    price: 0,
    delivery_time: 7,
    revisions: 3,
    features: [''],
    images: ['']
  });

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const serviceData = {
        ...serviceForm,
        provider_id: user.id,
        features: serviceForm.features.filter(f => f.trim()),
        images: serviceForm.images.filter(i => i.trim()),
        active: true
      };

      if (editingService) {
        await updateService(editingService.id, serviceData);
      } else {
        await createService(serviceData);
      }

      setShowServiceModal(false);
      setEditingService(null);
      setServiceForm({
        title: '',
        description: '',
        category: 'producers',
        price: 0,
        delivery_time: 7,
        revisions: 3,
        features: [''],
        images: ['']
      });
    } catch (error) {
      console.error('Error saving service:', error);
    }
  };

  const handleEditService = (service: any) => {
    setEditingService(service);
    setServiceForm({
      title: service.title,
      description: service.description,
      category: service.category,
      price: service.price,
      delivery_time: service.delivery_time,
      revisions: service.revisions,
      features: service.features.length ? service.features : [''],
      images: service.images.length ? service.images : ['']
    });
    setShowServiceModal(true);
  };

  const addFeature = () => {
    setServiceForm(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setServiceForm(prev => ({
      ...prev,
      features: prev.features.map((f, i) => i === index ? value : f)
    }));
  };

  const removeFeature = (index: number) => {
    setServiceForm(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'services', label: 'My Services' },
    { id: 'orders', label: 'Orders' },
    { id: 'revenue', label: 'Revenue' }
  ];

  if (servicesLoading || ordersLoading || messagesLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-6 py-8">
        {/* Header - Mobile optimized */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center space-x-3">
              <span>Welcome back, {profile?.full_name}!</span>
              {profile?.verified && (
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
              )}
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">Manage your services and track your earnings</p>
            <div className="mt-2 text-xs sm:text-sm text-gray-500">
              Platform fee: 20% • You keep: 80% of each sale
            </div>
          </div>
          <button
            onClick={() => setShowServiceModal(true)}
            className="flex items-center justify-center space-x-2 px-4 sm:px-6 py-3 bg-primary-600 hover:bg-primary-700 rounded-xl font-semibold transition-colors text-black text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Add Service</span>
          </button>
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
                {stat.subtitle && (
                  <div className="text-xs text-gray-500 mt-1">{stat.subtitle}</div>
                )}
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
                  {orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 sm:p-4 bg-gray-800/30 rounded-lg">
                      <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                        <img
                          src={order.artist?.avatar_url || 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=50'}
                          alt={order.artist?.full_name}
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="font-semibold text-sm sm:text-base line-clamp-1">{order.service?.title}</h4>
                          <p className="text-xs sm:text-sm text-gray-400 line-clamp-1">{order.artist?.full_name}</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="font-semibold text-emerald-400 text-sm sm:text-base">${order.provider_amount}</div>
                        <div className="text-xs text-gray-500">You earn</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Revenue Chart Placeholder */}
              <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold mb-4">Revenue Trend</h3>
                <div className="h-48 sm:h-64 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <TrendingUp className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-sm sm:text-base">Revenue chart coming soon</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'services' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
            >
              {services.map((service) => (
                <div key={service.id} className="bg-gray-900/50 border border-gray-700 rounded-xl overflow-hidden">
                  <div className="h-40 sm:h-48 bg-cover bg-center" style={{ backgroundImage: `url(${service.images[0] || 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300'})` }}>
                    <div className="h-full bg-gradient-to-t from-gray-900/80 via-transparent to-transparent flex items-end p-3 sm:p-4">
                      <div className="flex items-center justify-between w-full">
                        <div className="text-white">
                          <h4 className="font-bold text-sm sm:text-base line-clamp-1">{service.title}</h4>
                          <p className="text-xs sm:text-sm text-gray-300">{service.category}</p>
                        </div>
                        <div className="flex items-center space-x-1 sm:space-x-2">
                          <button
                            onClick={() => handleEditService(service)}
                            className="p-1.5 sm:p-2 bg-gray-900/50 hover:bg-gray-800 rounded-lg transition-colors"
                          >
                            <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                          <button
                            onClick={() => deleteService(service.id)}
                            className="p-1.5 sm:p-2 bg-gray-900/50 hover:bg-red-600 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 sm:p-4">
                    <p className="text-gray-400 text-xs sm:text-sm mb-3 line-clamp-2">{service.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-base sm:text-lg font-bold text-primary-500">${service.price}</span>
                      <div className="text-xs sm:text-sm text-gray-400">
                        {service.delivery_time} days • {service.revisions} revisions
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'orders' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900/50 border border-gray-700 rounded-xl overflow-hidden"
            >
              <div className="p-4 sm:p-6 border-b border-gray-700">
                <h3 className="text-lg sm:text-xl font-semibold">Order Management</h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-800/50">
                    <tr>
                      <th className="text-left py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm font-medium text-gray-400">Customer</th>
                      <th className="text-left py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm font-medium text-gray-400 hidden sm:table-cell">Service</th>
                      <th className="text-left py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm font-medium text-gray-400">Total</th>
                      <th className="text-left py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm font-medium text-gray-400">You Earn</th>
                      <th className="text-left py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm font-medium text-gray-400">Status</th>
                      <th className="text-left py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm font-medium text-gray-400 hidden lg:table-cell">Date</th>
                      <th className="text-left py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm font-medium text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-700/50 hover:bg-gray-800/30 transition-colors">
                        <td className="py-3 sm:py-4 px-4 sm:px-6">
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <img
                              src={order.artist?.avatar_url || 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=50'}
                              alt={order.artist?.full_name}
                              className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover"
                            />
                            <div className="min-w-0">
                              <div className="font-medium text-sm line-clamp-1">{order.artist?.full_name}</div>
                              <div className="text-xs text-gray-400 sm:hidden line-clamp-1">{order.service?.title}</div>
                              <div className="text-xs text-gray-400 hidden sm:block line-clamp-1">{order.artist?.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 sm:py-4 px-4 sm:px-6 hidden sm:table-cell">
                          <div className="font-medium text-sm line-clamp-1">{order.service?.title}</div>
                        </td>
                        <td className="py-3 sm:py-4 px-4 sm:px-6">
                          <div className="font-semibold text-sm">${order.total_amount}</div>
                        </td>
                        <td className="py-3 sm:py-4 px-4 sm:px-6">
                          <div className="font-semibold text-emerald-400 text-sm">${order.provider_amount}</div>
                          <div className="text-xs text-gray-500">80% of total</div>
                        </td>
                        <td className="py-3 sm:py-4 px-4 sm:px-6">
                          <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                            order.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                            order.status === 'in_progress' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                            'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                          }`}>
                            {order.status.replace('_', ' ')}
                          </span>
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

          {activeTab === 'revenue' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900/50 border border-gray-700 rounded-xl p-4 sm:p-6"
            >
              <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Revenue Breakdown</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="bg-gray-800/30 rounded-lg p-4 sm:p-6 text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-emerald-400 mb-2">
                    ${totalRevenue.toFixed(2)}
                  </div>
                  <div className="text-gray-400 text-sm">Total Earned (80%)</div>
                </div>
                <div className="bg-gray-800/30 rounded-lg p-4 sm:p-6 text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-red-400 mb-2">
                    ${(totalRevenue / 0.8 * 0.2).toFixed(2)}
                  </div>
                  <div className="text-gray-400 text-sm">Platform Fees (20%)</div>
                </div>
                <div className="bg-gray-800/30 rounded-lg p-4 sm:p-6 text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-primary-400 mb-2">
                    ${(totalRevenue / 0.8).toFixed(2)}
                  </div>
                  <div className="text-gray-400 text-sm">Gross Sales (100%)</div>
                </div>
              </div>

              <div className="text-sm text-gray-400 bg-gray-800/30 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Commission Structure:</h4>
                <ul className="space-y-1">
                  <li>• You keep 80% of each sale</li>
                  <li>• DripZone takes 20% platform fee</li>
                  <li>• Payments are processed automatically</li>
                  <li>• Earnings are available for withdrawal after order completion</li>
                </ul>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Service Modal - Mobile optimized */}
      <Modal
        isOpen={showServiceModal}
        onClose={() => {
          setShowServiceModal(false);
          setEditingService(null);
          setServiceForm({
            title: '',
            description: '',
            category: 'producers',
            price: 0,
            delivery_time: 7,
            revisions: 3,
            features: [''],
            images: ['']
          });
        }}
        title={editingService ? 'Edit Service' : 'Add New Service'}
        size="lg"
      >
        <form onSubmit={handleServiceSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Service Title</label>
              <input
                type="text"
                value={serviceForm.title}
                onChange={(e) => setServiceForm(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={serviceForm.category}
                onChange={(e) => setServiceForm(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              >
                <option value="producers">Producers</option>
                <option value="recording-studios">Recording Studios</option>
                <option value="album-cover-artists">Album Cover Artists</option>
                <option value="videographers">Videographers</option>
                <option value="pr-consultants">PR Consultants</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={serviceForm.description}
              onChange={(e) => setServiceForm(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Price ($)</label>
              <input
                type="number"
                value={serviceForm.price}
                onChange={(e) => setServiceForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                min="1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Delivery Time (days)</label>
              <input
                type="number"
                value={serviceForm.delivery_time}
                onChange={(e) => setServiceForm(prev => ({ ...prev, delivery_time: Number(e.target.value) }))}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                min="1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Revisions</label>
              <input
                type="number"
                value={serviceForm.revisions}
                onChange={(e) => setServiceForm(prev => ({ ...prev, revisions: Number(e.target.value) }))}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                min="0"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Features</label>
            {serviceForm.features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => updateFeature(index, e.target.value)}
                  className="flex-1 px-3 sm:px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  placeholder="Feature description"
                />
                {serviceForm.features.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addFeature}
              className="text-primary-400 hover:text-primary-300 text-sm"
            >
              + Add Feature
            </button>
          </div>

          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              type="button"
              onClick={() => setShowServiceModal(false)}
              className="px-4 sm:px-6 py-2 sm:py-3 border border-gray-600 rounded-lg hover:border-gray-500 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 sm:px-6 py-2 sm:py-3 bg-primary-600 hover:bg-primary-700 rounded-lg font-semibold transition-colors text-black text-sm"
            >
              {editingService ? 'Update Service' : 'Create Service'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};