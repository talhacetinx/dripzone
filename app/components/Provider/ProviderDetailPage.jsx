"use client"

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Star, MapPin, Clock, CheckCircle, Heart, MessageCircle, 
  Award, TrendingUp, Calendar, Play, ExternalLink, Users,
  Music, Camera, Palette, Mic
} from 'lucide-react';
import { musicProviders } from '../../data/musicProviders';


export const ProviderDetaiComponent = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const providerId = 1;
  // Find the provider from our data
  const provider = musicProviders.find(p => p.id === providerId);

  if (!provider) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Provider Not Found</h1>
          <p className="text-gray-400">The requested provider could not be found.</p>
        </div>
      </div>
    );
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'recording-studios': return <Mic className="w-5 h-5" />;
      case 'producers': return <Music className="w-5 h-5" />;
      case 'album-cover-artists': return <Palette className="w-5 h-5" />;
      case 'videographers': return <Camera className="w-5 h-5" />;
      default: return <Music className="w-5 h-5" />;
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'packages', label: 'Packages' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'reviews', label: 'Reviews' }
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section - More compact */}
      <section className="relative">
        <div className="h-80 bg-cover bg-center relative" style={{ backgroundImage: `url(${provider.coverImage})` }}>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
        </div>
        
        <div className="container mx-auto px-6">
          <div className="relative -mt-32 z-10">
            <div className="bg-black/80 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-8 shadow-2xl">
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                {/* Profile Info - Smaller */}
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <img
                      src={provider.avatar}
                      alt={provider.name}
                      className="w-24 h-24 rounded-full object-cover border-4 border-primary-500 shadow-2xl"
                    />
                    {provider.verified && (
                      <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h1 className="text-3xl font-bold text-white">{provider.name}</h1>
                      <div className="flex items-center space-x-2 px-3 py-1 bg-primary-500/20 border border-primary-500/30 rounded-full">
                        {getCategoryIcon(provider.category)}
                        <span className="text-primary-400 font-semibold text-sm capitalize">
                          {provider.category.replace('-', ' ')}
                        </span>
                      </div>
                    </div>
                    <p className="text-xl text-gray-300 mb-3">{provider.title}</p>
                    
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-primary-500 fill-current" />
                        <span className="font-bold text-white">{provider.rating}</span>
                        <span className="text-gray-400">({provider.reviewCount} reviews)</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-400">
                        <MapPin className="w-4 h-4" />
                        <span>{provider.location}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-400">
                        <Award className="w-4 h-4" />
                        <span>{provider.yearsExperience} years</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons - Smaller */}
                <div className="flex-1 lg:flex lg:justify-end">
                  <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                    <button className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-400 hover:from-primary-600 hover:to-primary-500 text-black font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
                      <MessageCircle className="w-4 h-4" />
                      <span>Contact</span>
                    </button>
                    <button className="flex items-center justify-center space-x-2 px-6 py-3 border-2 border-gray-700 hover:border-primary-500 text-white rounded-xl font-bold transition-all duration-300 backdrop-blur-sm">
                      <Heart className="w-4 h-4" />
                      <span>Save</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Stats - Smaller */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-8 border-t border-gray-800/50">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-500 mb-1">{provider.completedProjects.toLocaleString()}</div>
                  <div className="text-xs text-gray-400 uppercase tracking-wide">Projects</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-500 mb-1">{provider.responseTime}</div>
                  <div className="text-xs text-gray-400 uppercase tracking-wide">Response</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-500 mb-1">{provider.yearsExperience}</div>
                  <div className="text-xs text-gray-400 uppercase tracking-wide">Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-500 mb-1">98%</div>
                  <div className="text-xs text-gray-400 uppercase tracking-wide">Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content - More compact */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2">
              {/* Tabs */}
              <div className="flex space-x-6 mb-8 border-b border-gray-800/50">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-3 px-2 font-bold transition-colors ${
                      activeTab === tab.id
                        ? 'text-primary-500 border-b-2 border-primary-500'
                        : 'text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content - More compact */}
              <div className="min-h-[400px]">
                {activeTab === 'overview' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                  >
                    {/* Bio */}
                    <div>
                      <h3 className="text-xl font-bold mb-4 text-white">About</h3>
                      <p className="text-gray-300 leading-relaxed">{provider.bio}</p>
                    </div>

                    {/* Specialties */}
                    <div>
                      <h3 className="text-xl font-bold mb-4 text-white">Specialties</h3>
                      <div className="flex flex-wrap gap-3">
                        {provider.specialties.map((specialty) => (
                          <span
                            key={specialty}
                            className="px-4 py-2 bg-gradient-to-r from-primary-500/20 to-primary-400/10 border border-primary-500/30 rounded-lg text-primary-400 font-semibold"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Notable Clients */}
                    <div>
                      <h3 className="text-xl font-bold mb-4 text-white">Notable Clients</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {provider.notableClients.map((client) => (
                          <div
                            key={client}
                            className="p-3 bg-gray-900/50 border border-gray-800/50 rounded-lg text-center"
                          >
                            <span className="text-gray-300 font-semibold text-sm">{client}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'packages' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    {provider.packages.map((pkg) => (
                      <div
                        key={pkg.id}
                        className={`relative bg-black/60 backdrop-blur-xl border ${
                          pkg.popular ? 'border-primary-500' : 'border-gray-800/50'
                        } rounded-xl p-6 hover:border-primary-500/50 transition-all duration-300`}
                      >
                        {pkg.popular && (
                          <div className="absolute -top-3 left-6">
                            <span className="px-3 py-1 bg-gradient-to-r from-primary-500 to-primary-400 text-xs font-bold rounded-full text-black shadow-lg">
                              MOST POPULAR
                            </span>
                          </div>
                        )}

                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                          <div>
                            <h4 className="text-xl font-bold mb-2 text-white">{pkg.name}</h4>
                            <p className="text-gray-400">{pkg.description}</p>
                          </div>
                          <div className="text-right mt-4 md:mt-0">
                            <div className="text-3xl font-bold text-primary-500 mb-1">${pkg.price.toLocaleString()}</div>
                            <div className="text-sm text-gray-400">{pkg.deliveryTime} delivery</div>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mb-6">
                          {pkg.features.map((feature, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                              <span className="text-gray-300 text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>

                        <button className="w-full py-3 bg-gradient-to-r from-primary-500 to-primary-400 hover:from-primary-600 hover:to-primary-500 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-lg text-black">
                          Order Now - ${pkg.price.toLocaleString()}
                        </button>
                      </div>
                    ))}
                  </motion.div>
                )}

                {activeTab === 'portfolio' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    {provider.portfolio.map((item) => (
                      <div
                        key={item.id}
                        className="bg-black/60 backdrop-blur-xl border border-gray-800/50 rounded-xl overflow-hidden hover:border-primary-500/50 transition-all duration-300 group"
                      >
                        <div className="relative h-48">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div className="flex items-center space-x-3">
                              <button className="p-3 bg-primary-600 rounded-full hover:bg-primary-700 transition-colors">
                                <Play className="w-5 h-5 text-black" />
                              </button>
                              <button className="p-3 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors">
                                <ExternalLink className="w-5 h-5 text-white" />
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="p-5">
                          <h4 className="font-bold text-lg mb-2 text-white">{item.title}</h4>
                          <p className="text-primary-400 font-semibold mb-2">{item.client}</p>
                          <p className="text-gray-400 mb-3 text-sm">{item.description}</p>
                          <div className="flex justify-between text-sm text-gray-500 mb-3">
                            <span>Duration: {item.duration}</span>
                          </div>
                          <div className="p-3 bg-gray-900/50 rounded-lg">
                            <span className="text-emerald-400 font-semibold text-sm">Outcome: </span>
                            <span className="text-gray-300 text-sm">{item.outcome}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}

                {activeTab === 'reviews' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    {provider.reviews.map((review) => (
                      <div
                        key={review.id}
                        className="bg-black/60 backdrop-blur-xl border border-gray-800/50 rounded-xl p-6"
                      >
                        <div className="flex items-start space-x-4">
                          <img
                            src={review.userAvatar}
                            alt={review.userName}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-bold text-white">{review.userName}</h4>
                              <span className="text-sm text-gray-400">{review.date}</span>
                            </div>
                            
                            <div className="flex items-center space-x-2 mb-3">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating ? 'text-primary-500 fill-current' : 'text-gray-600'
                                  }`}
                                />
                              ))}
                              <span className="text-primary-400 font-semibold ml-2 text-sm">{review.serviceUsed}</span>
                            </div>
                            
                            <p className="text-gray-300 leading-relaxed">{review.comment}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Right Column - Sidebar - More compact */}
            <div className="space-y-6">
              {/* Contact Card */}
              <div className="bg-black/60 backdrop-blur-xl border border-gray-800/50 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4 text-white">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300 text-sm">Responds within {provider.responseTime}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300 text-sm">Available for new projects</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300 text-sm">{provider.completedProjects}+ satisfied clients</span>
                  </div>
                </div>
              </div>

              {/* Quick Order */}
              <div className="bg-black/60 backdrop-blur-xl border border-gray-800/50 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4 text-white">Quick Order</h3>
                <div className="space-y-4">
                  <select className="w-full px-3 py-2 bg-black/50 border border-gray-700/50 rounded-lg text-white text-sm">
                    <option>Select a package</option>
                    {provider.packages.map(pkg => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.name} - ${pkg.price.toLocaleString()}
                      </option>
                    ))}
                  </select>
                  <button className="w-full py-3 bg-gradient-to-r from-primary-500 to-primary-400 hover:from-primary-600 hover:to-primary-500 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-lg text-black text-sm">
                    Order Now
                  </button>
                  <button className="w-full py-3 border-2 border-gray-700 hover:border-primary-500 rounded-lg font-bold transition-all duration-300 text-white text-sm">
                    Request Custom Quote
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="bg-black/60 backdrop-blur-xl border border-gray-800/50 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4 text-white">Performance Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Total Projects</span>
                    <span className="font-bold text-white text-sm">{provider.completedProjects.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Client Rating</span>
                    <span className="font-bold text-primary-500 text-sm">{provider.rating}/5.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Repeat Clients</span>
                    <span className="font-bold text-white text-sm">89%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">On-Time Delivery</span>
                    <span className="font-bold text-emerald-400 text-sm">98%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};