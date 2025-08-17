"use client"

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Star, MapPin, Clock, CheckCircle, Heart, MessageCircle, 
  Award, TrendingUp, Calendar, Play, ExternalLink, Users,
  Music, Camera, Palette, Mic, Loader2
} from 'lucide-react';
import { useParams } from 'next/navigation';
import { toast } from 'react-toastify';

export const DynamicProviderDetail = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [providerData, setProviderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();

  useEffect(() => {
    const fetchProviderData = async () => {
      try {
        const response = await fetch(`/api/public/provider/${params.username}`);
        
        if (response.ok) {
          const data = await response.json();
          setProviderData(data.data);
        } else {
          const errorData = await response.json();
          toast.error(errorData.error || 'Provider bulunamadı');
        }
      } catch (error) {
        console.error('Provider yükleme hatası:', error);
        toast.error('Provider bilgileri yüklenemedi');
      } finally {
        setLoading(false);
      }
    };

    if (params.username) {
      fetchProviderData();
    }
  }, [params.username]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-primary-500 animate-spin mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Yükleniyor...</h1>
          <p className="text-gray-400">Provider profili getiriliyor</p>
        </div>
      </div>
    );
  }

  if (!providerData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Provider Bulunamadı</h1>
          <p className="text-gray-400">İstenen provider profili bulunamadı.</p>
        </div>
      </div>
    );
  }

  const { user, profile } = providerData;

  const getCategoryIcon = () => {
    return <Music className="w-5 h-5" />;
  };

  const tabs = [
    { id: 'overview', label: 'Genel Bakış', icon: Users },
    { id: 'packages', label: 'Paketler', icon: Music },
    { id: 'portfolio', label: 'Portföy', icon: Camera },
    { id: 'reviews', label: 'Yorumlar', icon: MessageCircle }
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative">
        <div className="h-80 bg-cover bg-center relative" style={{ 
          backgroundImage: profile.backgroundUrl ? `url(${profile.backgroundUrl})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
        </div>
        
        <div className="container mx-auto px-6">
          <div className="relative -mt-32 z-10">
            <div className="bg-black/80 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-8 shadow-2xl">
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <img
                      src={profile.avatarUrl || '/default-avatar.png'}
                      alt={user.fullName}
                      className="w-24 h-24 rounded-full object-cover border-4 border-primary-500 shadow-2xl"
                    />
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h1 className="text-3xl font-bold text-white">{user.fullName}</h1>
                      <div className="flex items-center space-x-2 px-3 py-1 bg-primary-500/20 border border-primary-500/30 rounded-full">
                        {getCategoryIcon()}
                        <span className="text-primary-400 font-semibold text-sm">
                          Hizmet Sağlayıcı
                        </span>
                      </div>
                    </div>
                    <p className="text-xl text-gray-300 mb-3">{profile.studioName}</p>
                    
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-primary-500 fill-current" />
                        <span className="font-bold text-white">5.0</span>
                        <span className="text-gray-400">(0 yorum)</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-400">
                        <Award className="w-4 h-4" />
                        <span>{profile.experience || 0} yıl</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-400">
                        <Users className="w-4 h-4" />
                        <span>{profile.projectCount || 0} proje</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-3 lg:ml-auto">
                  <div className="flex space-x-3">
                    <button className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-400 hover:from-primary-600 hover:to-primary-500 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-lg text-black">
                      İletişime Geç
                    </button>
                    <button className="p-3 border border-gray-600 rounded-lg hover:border-gray-500 transition-colors">
                      <Heart className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="container mx-auto px-6 py-12">
        <div className="bg-black/60 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-8">
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

          <div className="min-h-[400px]">
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Bio */}
                <div>
                  <h3 className="text-xl font-bold mb-4 text-white">Hakkında</h3>
                  <p className="text-gray-300 leading-relaxed">
                    {profile.about || 'Henüz bir açıklama eklenmemiş.'}
                  </p>
                </div>

                {/* Specialties */}
                {profile.specialties && profile.specialties.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-white">Uzmanlık Alanları</h3>
                    <div className="flex flex-wrap gap-3">
                      {profile.specialties.map((specialty, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-gradient-to-r from-primary-500/20 to-primary-400/10 border border-primary-500/30 rounded-lg text-primary-400 font-semibold"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Services */}
                {profile.services && profile.services.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-white">Hizmetler</h3>
                    <div className="flex flex-wrap gap-3">
                      {profile.services.map((service, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-gray-300"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'packages' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {profile.packages && profile.packages.length > 0 ? (
                  profile.packages.map((pkg, index) => (
                    <div
                      key={pkg.id || index}
                      className="relative bg-black/60 backdrop-blur-xl border border-gray-800/50 rounded-xl p-6 hover:border-primary-500/50 transition-all duration-300"
                    >
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Paket Resmi */}
                        {pkg.image && (
                          <div className="md:w-48 flex-shrink-0">
                            <img
                              src={pkg.image}
                              alt={pkg.title}
                              className="w-full h-32 md:h-full object-cover rounded-lg"
                            />
                          </div>
                        )}
                        
                        {/* Paket Bilgileri */}
                        <div className="flex-1">
                          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                            <div>
                              <h4 className="text-xl font-bold mb-2 text-white">{pkg.title}</h4>
                              <p className="text-gray-400">{pkg.description}</p>
                            </div>
                            <div className="text-right mt-4 md:mt-0">
                              <div className="text-3xl font-bold text-primary-500 mb-1">₺{pkg.price?.toLocaleString()}</div>
                              <div className="text-sm text-gray-400">{pkg.deliveryTime} teslimat</div>
                            </div>
                          </div>

                          {pkg.features && pkg.features.length > 0 && (
                            <div className="grid md:grid-cols-2 gap-4 mb-6">
                              {pkg.features.map((feature, featureIndex) => (
                                <div key={featureIndex} className="flex items-center space-x-2">
                                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                  <span className="text-gray-300 text-sm">{feature}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          <button className="w-full py-3 bg-gradient-to-r from-primary-500 to-primary-400 hover:from-primary-600 hover:to-primary-500 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-lg text-black">
                            Şimdi Sipariş Ver - ₺{pkg.price?.toLocaleString()}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <Music size={48} className="mx-auto mb-4 opacity-50" />
                      <p className="text-lg">Henüz paket eklenmemiş</p>
                      <p className="text-sm">Bu provider henüz hizmet paketi tanımlamamış</p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'portfolio' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <div className="text-gray-400 mb-4">
                  <Camera size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Portföy yakında eklenecek</p>
                  <p className="text-sm">Bu özellik şu anda geliştirme aşamasında</p>
                </div>
              </motion.div>
            )}

            {activeTab === 'reviews' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <div className="text-gray-400 mb-4">
                  <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Henüz yorum yok</p>
                  <p className="text-sm">Bu provider için henüz yorum bırakılmamış</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
