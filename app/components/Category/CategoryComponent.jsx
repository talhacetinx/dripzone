"use client"

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Star, MapPin, Clock, ArrowRight, CheckCircle, Award } from 'lucide-react';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { musicProviders, MusicProvider } from '../../data/musicProviders';
import { useParams } from 'next/navigation';


export const CategoryComponent = () => {
  const { categorySlug } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [priceRange, setPriceRange] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const categoryInfo = {
    'recording-studios': {
      title: 'Kayıt Stüdyoları',
      description: 'Efsanevi akustiğe ve en son teknolojiye sahip dünya standartlarında kayıt tesisleri',
      icon: '🎙️',
      totalProviders: musicProviders.filter(p => p.category === 'recording-studios').length
    },
    'producers': {
      title: 'Müzik Yapımcıları',
      description: 'Modern müziğin sesini şekillendiren Grammy ödüllü yapımcılar ve hit yaratıcıları',
      icon: '🎵',
      totalProviders: musicProviders.filter(p => p.category === 'producers').length
    },
    'album-cover-artists': {
      title: 'Albüm Kapağı Sanatçıları',
      description: 'Müzikal dönemleri tanımlayan ikonik albüm sanat eserleri yaratan vizyoner tasarımcılar',
      icon: '🎨',
      totalProviders: musicProviders.filter(p => p.category === 'album-cover-artists').length
    },
    'videographers': {
      title: 'Müzik Video Yönetmenleri',
      description: 'Sinematik hikaye anlatımıyla müzikal vizyonları hayata geçiren ödüllü yönetmenler',
      icon: '🎬',
      totalProviders: musicProviders.filter(p => p.category === 'videographers').length
    }
  };

   const category = categoryInfo[categorySlug] || categoryInfo['producers'];

  // Filter providers based on category
  const categoryProviders = musicProviders.filter(provider => provider.category === categorySlug);

  const sortOptions = [
    { value: 'popular', label: 'En Popüler' },
    { value: 'rating', label: 'En Yüksek Puanlı' },
    { value: 'experience', label: 'En Deneyimli' },
    { value: 'price-low', label: 'Fiyat (Düşük → Yüksek)' },
    { value: 'price-high', label: 'Fiyat (Yüksek → Düşük)' }
  ];

  const priceRanges = [
    { value: 'all', label: 'Tüm Bütçeler' },
    { value: '0-5000', label: '$0 - $5,000' },
    { value: '5000-25000', label: '$5,000 - $25,000' },
    { value: '25000-100000', label: '$25,000 - $100,000' },
    { value: '100000+', label: '$100,000+' }
  ];

  // Filter and sort providers
  const filteredProviders = categoryProviders.filter(provider => {
    const matchesSearch = provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    
    let matchesPrice = true;
    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(p => p.replace('+', ''));
      const price = provider.startingPrice;
      if (max) {
        matchesPrice = price >= parseInt(min) && price <= parseInt(max);
      } else {
        matchesPrice = price >= parseInt(min);
      }
    }

    return matchesSearch && matchesPrice;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'experience':
        return b.yearsExperience - a.yearsExperience;
      case 'price-low':
        return a.startingPrice - b.startingPrice;
      case 'price-high':
        return b.startingPrice - a.startingPrice;
      default:
        return b.featured ? 1 : -1;
    }
  });

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header Section */}
      <section className="relative bg-black border-b border-gray-800/50">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-900/50 to-black"></div>
        <div className="container mx-auto px-6 py-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="text-7xl mb-8 filter drop-shadow-lg">{category.icon}</div>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 bg-clip-text text-transparent">
                {category.title}
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed max-w-3xl mx-auto">
              {category.description}
            </p>
            <div className="flex items-center justify-center space-x-12 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-primary-500" />
                <span>{category.totalProviders} elit profesyonel</span>
              </div>
              <span>•</span>
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-primary-500 fill-current" />
                <span>Ortalama 4.8 puan</span>
              </div>
              <span>•</span>
              <span>Endüstri efsaneleri ve yükselen yıldızlar</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="bg-gray-900/30 backdrop-blur-xl border-b border-gray-800/50 sticky top-16 z-40">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Profesyoneller ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-black/50 border border-gray-700/50 rounded-xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 text-white placeholder-gray-400 backdrop-blur-sm"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-6 py-4 bg-black/50 border border-gray-700/50 rounded-xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 text-white backdrop-blur-sm"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value} className="bg-gray-900">
                    {option.label}
                  </option>
                ))}
              </select>

              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="px-6 py-4 bg-black/50 border border-gray-700/50 rounded-xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 text-white backdrop-blur-sm"
              >
                {priceRanges.map(range => (
                  <option key={range.value} value={range.value} className="bg-gray-900">
                    {range.label}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-6 py-4 bg-black/50 border border-gray-700/50 rounded-xl hover:border-primary-500/50 transition-all duration-300 text-white backdrop-blur-sm"
              >
                <Filter className="w-4 h-4" />
                <span>Gelişmiş</span>
              </button>
            </div>
          </div>

          {/* Extended Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-8 p-8 bg-black/30 backdrop-blur-xl rounded-2xl border border-gray-800/50"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <label className="block text-sm font-semibold mb-3 text-primary-400">Konum</label>
                  <select className="w-full px-4 py-3 bg-black/50 border border-gray-700/50 rounded-xl text-white backdrop-blur-sm">
                    <option>Tüm Konumlar</option>
                    <option>Los Angeles</option>
                    <option>New York</option>
                    <option>Londra</option>
                    <option>Nashville</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-3 text-primary-400">Deneyim</label>
                  <select className="w-full px-4 py-3 bg-black/50 border border-gray-700/50 rounded-xl text-white backdrop-blur-sm">
                    <option>Herhangi Bir Deneyim</option>
                    <option>10+ yıl</option>
                    <option>20+ yıl</option>
                    <option>30+ yıl</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-3 text-primary-400">Uzmanlık Alanları</label>
                  <select className="w-full px-4 py-3 bg-black/50 border border-gray-700/50 rounded-xl text-white backdrop-blur-sm">
                    <option>Tüm Uzmanlık Alanları</option>
                    <option>Pop</option>
                    <option>Hip-Hop</option>
                    <option>Rock</option>
                    <option>Elektronik</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Results */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-6">
          <div className="mb-12">
            <p className="text-gray-400 text-lg">
              <span className="font-semibold text-white text-xl">{filteredProviders.length}</span> dünya standartlarında profesyonel bulundu
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredProviders.map((provider, index) => (
              <motion.div
                key={provider.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <ProviderCard provider={provider} />
              </motion.div>
            ))}
          </div>

          {filteredProviders.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-400 text-xl mb-4">Kriterlerinize uygun profesyonel bulunamadı.</p>
              <p className="text-gray-500">Daha fazla yetenek keşfetmek için aramanızı veya filtrelerinizi ayarlamayı deneyin.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

// Provider Card Component - Smaller size
const ProviderCard = ({ provider }) => {
  return (
    <div className="group bg-black border border-gray-800/50 rounded-2xl overflow-hidden hover:border-primary-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary-500/10">
      {/* Cover Image - Reduced height */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={provider.coverImage}
          alt={provider.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex space-x-2">
          {provider.featured && (
            <span className="px-2 py-1 bg-gradient-to-r from-primary-500 to-primary-400 text-xs font-bold rounded-full text-black shadow-lg">
              ÖNE ÇIKAN
            </span>
          )}
          {provider.verified && (
            <span className="px-2 py-1 bg-emerald-600 text-xs font-bold rounded-full flex items-center space-x-1 text-white shadow-lg">
              <CheckCircle className="w-3 h-3" />
            </span>
          )}
        </div>

        {/* Price */}
        <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/80 backdrop-blur-sm rounded-full text-sm font-bold text-white border border-gray-700/50">
          ${provider.startingPrice.toLocaleString()} Başlayan
        </div>
      </div>

      {/* Content - Reduced padding */}
      <div className="p-6">
        {/* Provider Info */}
        <div className="flex items-start space-x-4 mb-4">
          <img
            src={provider.avatar}
            alt={provider.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-primary-500/50"
          />
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-1 group-hover:text-primary-400 transition-colors">
              {provider.name}
            </h3>
            <p className="text-gray-400 text-sm mb-2">{provider.title}</p>
            
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-primary-500 fill-current" />
                <span className="font-semibold text-white">{provider.rating}</span>
                <span className="text-gray-400">({provider.reviewCount})</span>
              </div>
              <div className="flex items-center space-x-1 text-gray-400">
                <MapPin className="w-3 h-3" />
                <span className="text-xs">{provider.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats - Smaller */}
        <div className="grid grid-cols-3 gap-3 mb-4 p-4 bg-gray-900/30 rounded-xl border border-gray-800/50">
          <div className="text-center">
            <div className="text-lg font-bold text-primary-400 mb-1">{provider.yearsExperience}</div>
            <div className="text-xs text-gray-400 uppercase tracking-wide">Yıl</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-primary-400 mb-1">{provider.completedProjects > 1000 ? `${Math.floor(provider.completedProjects/1000)}k` : provider.completedProjects}</div>
            <div className="text-xs text-gray-400 uppercase tracking-wide">Proje</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-primary-400 mb-1">{provider.responseTime}</div>
            <div className="text-xs text-gray-400 uppercase tracking-wide">Yanıt</div>
          </div>
        </div>

        {/* Bio - Shorter */}
        <p className="text-gray-300 leading-relaxed mb-4 line-clamp-2 text-sm">{provider.bio}</p>

        {/* Specialties - Fewer shown */}
        <div className="flex flex-wrap gap-1 mb-4">
          {provider.specialties.slice(0, 3).map((specialty) => (
            <span
              key={specialty}
              className="px-2 py-1 bg-gray-800/50 border border-gray-700/50 text-xs rounded-full text-gray-300 font-medium"
            >
              {specialty}
            </span>
          ))}
          {provider.specialties.length > 3 && (
            <span className="px-2 py-1 bg-gray-800/50 border border-gray-700/50 text-xs rounded-full text-gray-300 font-medium">
              +{provider.specialties.length - 3}
            </span>
          )}
        </div>

        {/* Action Button - Smaller */}
        <Link
          to={`/provider/${provider.id}`}
          className="flex items-center justify-center space-x-2 w-full py-3 bg-gradient-to-r from-primary-500 to-primary-400 hover:from-primary-600 hover:to-primary-500 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-primary-500/25 text-black text-sm"
        >
          <span>Profili Görüntüle</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};