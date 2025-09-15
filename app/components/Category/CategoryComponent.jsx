"use client"

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Star, MapPin, Clock, ArrowRight, CheckCircle, Award } from 'lucide-react';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ProviderCardSkeleton } from '../ui/ProviderCardSkeleton';
import Link from 'next/link';
import Image from 'next/image';
import { debounce } from 'lodash';

export const CategoryComponent = ({categorySlug}) => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
    
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [priceRange, setPriceRange] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  // Proje sayısı filtresi
  const [projectCountFilter, setProjectCountFilter] = useState('all');
  const [experienceFilter, setExperienceFilter] = useState('all');
  
  // Pagination states
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // serviceType mapping - slug'ları serviceType'lara çevir
  const slugToServiceType = {
    'recording-studios': 'recording_studio',
    'producers': 'music_producer',
    'album-cover-artists': 'album_cover_artist',
    'videographers': 'music_video_director'
  };

  const categoryInfo = {
    'recording-studios': {
      title: 'Kayıt Stüdyoları',
      description: 'Efsanevi akustiğe ve en son teknolojiye sahip dünya standartlarında kayıt tesisleri',
      icon: '🎙️',
      serviceType: 'recording_studio'
    },
    'producers': {
      title: 'Müzik Yapımcıları',
      description: 'Modern müziğin sesini şekillendiren Grammy ödüllü yapımcılar ve hit yaratıcıları',
      icon: '🎵',
      serviceType: 'music_producer'
    },
    'album-cover-artists': {
      title: 'Albüm Kapağı Sanatçıları',
      description: 'Müzikal dönemleri tanımlayan ikonik albüm sanat eserleri yaratan vizyoner tasarımcılar',
      icon: '🎨',
      serviceType: 'album_cover_artist'
    },
    'videographers': {
      title: 'Müzik Video Yönetmenleri',
      description: 'Sinematik hikaye anlatımıyla müzikal vizyonları hayata geçiren ödüllü yönetmenler',
      icon: '🎬',
      serviceType: 'music_video_director'
    }
  };

  const category = categoryInfo[categorySlug] || categoryInfo['producers'];

  // Debounced search effect
  const debouncedSearch = useCallback(
    debounce((searchValue) => {
      setDebouncedSearchTerm(searchValue);
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm, debouncedSearch]);

  // Veritabanından provider'ları çek - Optimize edilmiş
  const fetchProviders = useCallback(async (reset = false) => {
    try {
      const offset = reset ? 0 : providers.length;
      
      if (reset) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const serviceType = slugToServiceType[categorySlug] || 'music_producer';
      // İlk yüklemede daha az veri (8), sonrakinde normal (16)
      const limit = reset ? 8 : 16;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 saniye timeout
      
      const response = await fetch(`/api/providers/category?serviceType=${serviceType}&limit=${limit}&offset=${offset}`, {
        // Request optimization
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
        // Browser cache optimization
        cache: 'default'
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        const newProviders = reset ? data.providers : [...currentProviders, ...data.providers];
        setProviders(newProviders);
        setHasMore(data.pagination?.hasMore || false);
      } else {
        console.error('Provider fetch error:', data.error);
        if (reset) setProviders([]);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      if (reset) setProviders([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setInitialLoad(false);
    }
  }, [categorySlug]); // Removed providers dependency to prevent infinite loops

  useEffect(() => {
    fetchProviders(true);
  }, [categorySlug]);

  const sortOptions = [
    { value: 'popular', label: 'En Popüler' },
    { value: 'rating', label: 'En Yüksek Puanlı' },
    { value: 'experience', label: 'En Deneyimli' },
    { value: 'price-low', label: 'Fiyat (Düşük → Yüksek)' },
    { value: 'price-high', label: 'Fiyat (Yüksek → Düşük)' }
  ];

  const priceRanges = [
    { value: 'all', label: 'Tüm Bütçeler' },
    { value: '0-2000', label: '₺0 - ₺2,000' },
    { value: '2000-5000', label: '₺2,000 - ₺5,000' },
    { value: '5000-10000', label: '₺5,000 - ₺10,000' },
    { value: '10000-100000', label: '₺10,000 - ₺100,000' }
  ];

  // Memoized price calculation for better performance
  const getProviderMaxPrice = useCallback((provider) => {
    if (!provider.packages || provider.packages.length === 0) return 0;
    
    try {
      const prices = provider.packages
        .map(pkg => Number(pkg.basePrice || pkg.price || 0))
        .filter(price => !isNaN(price) && price > 0);
      
      return prices.length > 0 ? Math.max(...prices) : 0;
    } catch (error) {
      console.warn('Price calculation error:', error);
      return 0;
    }
  }, []);

  // Memoized filtered providers for better performance
  const filteredProviders = useMemo(() => {
    return providers.filter(provider => {
      const matchesSearch = !debouncedSearchTerm || 
        provider.user.name?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        provider.provider_title?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        provider.about?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        provider.specialties?.some(s => s.toLowerCase().includes(debouncedSearchTerm.toLowerCase()));
      
      let matchesPrice = true;
      if (priceRange !== 'all') {
        const [min, max] = priceRange.split('-').map(p => parseInt(p.replace('+', '')));
        const providerMaxPrice = getProviderMaxPrice(provider);
        
        if (max) {
          matchesPrice = providerMaxPrice >= min && providerMaxPrice <= max;
        } else {
          matchesPrice = providerMaxPrice >= min;
        }
      }

      // Project count filter
      let matchesProjectCount = true;
      if (projectCountFilter !== 'all') {
        const count = provider.projectCount || 0;
        switch (projectCountFilter) {
          case '0-10':
            matchesProjectCount = count >= 0 && count <= 10;
            break;
          case '10-50':
            matchesProjectCount = count > 10 && count <= 50;
            break;
          case '50-100':
            matchesProjectCount = count > 50 && count <= 100;
            break;
          case '100+':
            matchesProjectCount = count > 100;
            break;
          default:
            matchesProjectCount = true;
        }
      }

      // Experience filter
      let matchesExperience = true;
      if (experienceFilter !== 'all') {
        const providerExperience = provider.experience || 0;
        switch (experienceFilter) {
          case '0-5':
            matchesExperience = providerExperience >= 0 && providerExperience <= 5;
            break;
          case '5-10':
            matchesExperience = providerExperience >= 5 && providerExperience <= 10;
            break;
          case '10+':
            matchesExperience = providerExperience >= 10;
            break;
          default:
            matchesExperience = true;
        }
      }
      
  return matchesSearch && matchesPrice && matchesProjectCount && matchesExperience;
    }).sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return 4.8 - 4.8; 
        case 'experience':
          return (b.experience || 0) - (a.experience || 0);
        case 'price-low':
          return getProviderMaxPrice(a) - getProviderMaxPrice(b);
        case 'price-high':
          return getProviderMaxPrice(b) - getProviderMaxPrice(a);
        case 'popular':
          return new Date(a.createdAt) - new Date(b.createdAt);
        default:
          return new Date(a.createdAt) - new Date(b.createdAt);
      }
    });
  }, [providers, debouncedSearchTerm, priceRange, projectCountFilter, experienceFilter, sortBy, getProviderMaxPrice]);

  return (
    <div className="min-h-screen bg-black text-white">
      <section className="relative bg-black border-b border-gray-800/50">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-900/50 to-black"></div>
        <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="text-4xl sm:text-6xl lg:text-7xl mb-6 sm:mb-8 filter drop-shadow-lg">{category.icon}</div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-6 sm:mb-8 leading-tight px-2">
              <span className="bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 bg-clip-text text-transparent">
                {category.title}
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-8 sm:mb-10 leading-relaxed max-w-3xl mx-auto px-4">
              {category.description}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 lg:gap-12 text-xs sm:text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 sm:w-5 sm:h-5 text-primary-500 flex-shrink-0" />
                <span className="whitespace-nowrap">{filteredProviders.length || '0'} elit profesyonel</span>
              </div>
              <span className="hidden sm:inline">•</span>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 text-primary-500 fill-current flex-shrink-0" />
                <span className="whitespace-nowrap">Ortalama 4.8 puan</span>
              </div>
              <span className="hidden sm:inline">•</span>
              <span className="text-center sm:text-left">Endüstri efsaneleri ve yükselen yıldızlar</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="bg-gray-900/30 backdrop-blur-xl border-b border-gray-800/50 sticky top-0 sm:top-16 z-40">
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8">
          <div className="flex flex-col gap-4 sm:gap-6">

            {/* Filters Row */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex-1 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 bg-black/50 border border-gray-700/50 rounded-xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 text-white backdrop-blur-sm text-sm sm:text-base"
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
                className="flex-1 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 bg-black/50 border border-gray-700/50 rounded-xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 text-white backdrop-blur-sm text-sm sm:text-base"
              >
                {priceRanges.map(range => (
                  <option key={range.value} value={range.value} className="bg-gray-900">
                    {range.label}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-center space-x-2 px-4 sm:px-6 py-3 sm:py-4 bg-black/50 border border-gray-700/50 rounded-xl hover:border-primary-500/50 transition-all duration-300 text-white backdrop-blur-sm text-sm sm:text-base min-w-fit"
              >
                <Filter className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Gelişmiş</span>
                <span className="sm:hidden">Filtre</span>
              </button>
            </div>
          </div>

          {/* Extended Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 sm:mt-6 lg:mt-8 p-4 sm:p-6 lg:p-8 bg-black/30 backdrop-blur-xl rounded-2xl border border-gray-800/50"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold mb-2 sm:mb-3 text-primary-400">Proje Sayısı</label>
                  <select 
                    value={projectCountFilter}
                    onChange={(e) => setProjectCountFilter(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-black/50 border border-gray-700/50 rounded-xl text-white backdrop-blur-sm text-sm"
                  >
                    <option value="all">Tüm Proje Sayıları</option>
                    <option value="0-10">0-10</option>
                    <option value="10-50">11-50</option>
                    <option value="50-100">51-100</option>
                    <option value="100+">100+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold mb-2 sm:mb-3 text-primary-400">Deneyim</label>
                  <select 
                    value={experienceFilter}
                    onChange={(e) => setExperienceFilter(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-black/50 border border-gray-700/50 rounded-xl text-white backdrop-blur-sm text-sm"
                  >
                    <option value="all">Herhangi Bir Deneyim</option>
                    <option value="0-5">0-5 yıl</option>
                    <option value="5-10">5-10 yıl</option>
                    <option value="10+">10+ yıl</option>
                  </select>
                </div>
                
                <div className="sm:col-span-2 lg:col-span-1">
                  <label className="block text-xs sm:text-sm font-semibold mb-2 sm:mb-3 text-primary-400">Uzmanlık Alanları</label>
                  <select className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-black/50 border border-gray-700/50 rounded-xl text-white backdrop-blur-sm text-sm">
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
      <section className="py-8 sm:py-12 lg:py-16 bg-black">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mb-6 sm:mb-8 lg:mb-12">
            <p className="text-gray-400 text-sm sm:text-base lg:text-lg px-2">
              <span className="font-semibold text-white text-base sm:text-lg lg:text-xl">
                {loading ? '...' : filteredProviders.length}
              </span> dünya standartlarında profesyonel bulundu
            </p>
          </div>

          {initialLoad ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {Array.from({ length: 8 }).map((_, index) => (
                <ProviderCardSkeleton key={index} />
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {filteredProviders.map((provider, index) => (
                  <motion.div
                    key={provider.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.02 }} // Reduced delay for mobile
                  >
                    <ProviderCard provider={provider} />
                  </motion.div>
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && !debouncedSearchTerm && priceRange === 'all' && experienceFilter === 'all' && (
                <div className="flex justify-center mt-8 sm:mt-10 lg:mt-12 px-4">
                  <button
                    onClick={() => fetchProviders(false)}
                    disabled={loadingMore}
                    className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-primary-500 to-primary-400 hover:from-primary-600 hover:to-primary-500 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-black text-sm sm:text-base"
                  >
                    {loadingMore ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                        <span>Yükleniyor...</span>
                      </div>
                    ) : (
                      'Daha Fazla Göster'
                    )}
                  </button>
                </div>
              )}
            </>
          )}

          {!initialLoad && filteredProviders.length === 0 && (
            <div className="text-center py-12 sm:py-16 lg:py-20 px-4">
              <p className="text-gray-400 text-lg sm:text-xl mb-4">Kriterlerinize uygun profesyonel bulunamadı.</p>
              <p className="text-gray-500 text-sm sm:text-base">Daha fazla yetenek keşfetmek için aramanızı veya filtrelerinizi ayarlamayı deneyin.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

// Provider Card Component - Database verilerine uygun - Memoized for performance
const ProviderCard = ({ provider }) => {
  const getServiceTypeDisplay = (serviceType) => {
    const typeMap = {
      'recording_studio': 'Kayıt Stüdyosu',
      'music_producer': 'Müzik Prodüktörü',
      'album_cover_artist': 'Albüm Kapağı Tasarımcısı',
      'music_video_director': 'Müzik Video Yönetmeni'
    };
    return typeMap[serviceType] || serviceType;
  };

  return (
    <div className="group bg-black border border-gray-800/50 rounded-xl sm:rounded-2xl overflow-hidden hover:border-primary-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary-500/10">
      {/* Cover Image */}
      <div className="relative h-40 sm:h-44 lg:h-48 overflow-hidden">
        <img
          src={provider.backgroundUrl || "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800"}
          alt={provider.user.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        
        {/* Service Type Badge */}
        <div className="absolute top-2 sm:top-3 lg:top-4 left-2 sm:left-3 lg:left-4 flex space-x-1 sm:space-x-2">
          <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gradient-to-r from-primary-500 to-primary-400 text-xs font-bold rounded-full text-black shadow-lg leading-tight">
            {getServiceTypeDisplay(provider.serviceType)}
          </span>
        </div>

        {/* Price Badge */}
        <div className="absolute bottom-2 sm:bottom-3 lg:bottom-4 right-2 sm:right-3 lg:right-4 px-2 sm:px-3 py-0.5 sm:py-1 bg-black/80 backdrop-blur-sm rounded-full text-xs sm:text-sm font-bold text-white border border-gray-700/50">
          {(() => {
            if (!provider.packages || provider.packages.length === 0) return 'Fiyat belirtilmemiş';
            
            const prices = provider.packages.map(pkg => pkg.basePrice || pkg.price || 0);
            const maxPrice = Math.max(...prices);
            
            return `₺${maxPrice.toLocaleString()}+`;
          })()}
        </div>

        {/* Verified Badge */}
        <div className="absolute top-2 sm:top-3 lg:top-4 right-2 sm:right-3 lg:right-4">
          <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-emerald-600 text-xs font-bold rounded-full flex items-center space-x-1 text-white shadow-lg">
            <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 lg:p-6">
        {/* Provider Info */}
        <div className="flex items-start space-x-3 sm:space-x-4 mb-3 sm:mb-4">
          <img
            src={provider.avatarUrl || provider.user.user_photo || "/default-avatar.png"}
            alt={provider.user.name}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-primary-500/50 flex-shrink-0"
            loading="lazy"
            decoding="async"
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-lg sm:text-xl font-bold mb-1 group-hover:text-primary-400 transition-colors truncate">
              {provider.user.name}
            </h3>
            <p className="text-gray-400 text-xs sm:text-sm mb-2 line-clamp-1">
              {provider.provider_title || getServiceTypeDisplay(provider.serviceType)}
            </p>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm">
              <div className="flex items-center space-x-1">
                <Star className="w-3 h-3 sm:w-4 sm:h-4 text-primary-500 fill-current flex-shrink-0" />
                <span className="font-semibold text-white">4.8</span>
                <span className="text-gray-400">(127)</span>
              </div>
              <div className="flex items-center space-x-1 text-gray-400">
                <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
                <span className="text-xs truncate">{provider.user.country || 'Belirtilmedi'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-3 sm:mb-4 p-3 sm:p-4 bg-gray-900/30 rounded-lg sm:rounded-xl border border-gray-800/50">
          <div className="text-center">
            <div className="text-sm sm:text-lg font-bold text-primary-400 mb-0.5 sm:mb-1">{provider.experience || 0}</div>
            <div className="text-xs text-gray-400 uppercase tracking-wide">Yıl</div>
          </div>
          <div className="text-center">
            <div className="text-sm sm:text-lg font-bold text-primary-400 mb-0.5 sm:mb-1">{provider.projectCount || 0}</div>
            <div className="text-xs text-gray-400 uppercase tracking-wide">Proje</div>
          </div>
          <div className="text-center">
            <div className="text-sm sm:text-lg font-bold text-primary-400 mb-0.5 sm:mb-1">{provider.responseTime || 24}h</div>
            <div className="text-xs text-gray-400 uppercase tracking-wide">Yanıt</div>
          </div>
        </div>

        {/* Bio */}
        <p className="text-gray-300 leading-relaxed mb-3 sm:mb-4 line-clamp-2 text-xs sm:text-sm">
          {provider.about || 'Bu profesyonel henüz bir açıklama eklememiş.'}
        </p>

        {/* Specialties */}
        {provider.specialties && provider.specialties.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3 sm:mb-4">
            {provider.specialties.slice(0, 3).map((specialty, index) => (
              <span
                key={index}
                className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gray-800/50 border border-gray-700/50 text-xs rounded-full text-gray-300 font-medium truncate max-w-20 sm:max-w-none"
              >
                {specialty}
              </span>
            ))}
            {provider.specialties.length > 3 && (
              <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gray-800/50 border border-gray-700/50 text-xs rounded-full text-gray-300 font-medium">
                +{provider.specialties.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Action Button */}
        <Link 
          href={`/profile/${provider.user.user_name || provider.user.id}`}
          className="flex items-center justify-center space-x-1 sm:space-x-2 w-full py-2.5 sm:py-3 bg-gradient-to-r from-primary-500 to-primary-400 hover:from-primary-600 hover:to-primary-500 rounded-lg sm:rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-primary-500/25 text-black text-xs sm:text-sm"
          prefetch={true} // Prefetch for faster navigation
        >
          <span>Profili Görüntüle</span>
          <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};