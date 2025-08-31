"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { 
  Star, MapPin, Clock, CheckCircle, Heart, MessageCircle, 
  Award, TrendingUp, Calendar, Play, ExternalLink, Users,
  Music, Camera, Palette, Mic, Eye
} from 'lucide-react';
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";

import { useRouter } from 'next/navigation';

export default function ProfileClientPage({ params, initialData }) {
  const [user] = useState(initialData);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Debug: Log the data to see if serviceData is coming through
  console.log('ProfileClient - Full user data:', user);
  console.log('ProfileClient - ProviderProfile:', user?.providerProfile);
  console.log('ProfileClient - ServiceData:', user?.providerProfile?.serviceData);
  console.log('ProfileClient - MusicProjects:', user?.providerProfile?.serviceData?.musicProjects);
  console.log('ProfileClient - ServiceType:', user?.providerProfile?.serviceType);

  const calculateTotalPrice = (basePrice) => {
    const commission = basePrice * 0.20;
    return Math.round(basePrice + commission);
  };

  const calculateCommission = (basePrice) => {
    return Math.round(basePrice * 0.20);
  };

  if (!user || (!user.artistProfile && !user.providerProfile)) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Profile Not Found</h1>
          <p className="text-gray-400">The requested profile could not be found.</p>
        </div>
      </div>
    );
  }

  const profile = user.artistProfile || user.providerProfile;
  console.log(profile);
  
  const isArtist = Boolean(user.artistProfile);

  const getCategoryIcon = (isArtist) => {
    return isArtist ? <Music className="w-5 h-5" /> : <Mic className="w-5 h-5" />;
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'reviews', label: 'Reviews' }
  ];

  // Portfolio tab'ını sadece artist'ler veya recording_studio olmayan provider'lar için ekle
  if (isArtist || (profile.serviceType && profile.serviceType !== 'recording_studio')) {
    tabs.splice(1, 0, { id: 'portfolio', label: 'Portfolio' });
  }

  if (!isArtist) {
    const insertIndex = tabs.length - 1; // reviews'dan önce
    tabs.splice(insertIndex, 0, { id: 'services', label: 'Services' });
    tabs.splice(insertIndex + 1, 0, { id: 'packages', label: 'Packages' });
  }

    const router = useRouter();

    return (
    <>
    <Header />
        <div className="min-h-screen bg-black">
        {/* Hero Section */}
        <section className="relative">
            <div 
            className="h-80 bg-cover bg-center relative" 
            style={{ 
                backgroundImage: `url(${profile.backgroundUrl || "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800"})` 
            }}
            >
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
            </div>
            
            <div className="container mx-auto px-6">
            <div className="relative -mt-32 z-10">
                <div className="bg-black/80 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-8 shadow-2xl">
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                    {/* Profile Info */}
                    <div className="w-full flex flex-col items-center space-x-6 gap-3 sm:flex-row">
                    <div className="relative">
                        <Image
                        src={profile.avatarUrl || "/default-avatar.png"}
                        alt={user.name}
                        width={96}
                        height={96}
                        className="w-24 h-24 rounded-full object-cover border-4 border-primary-500 shadow-2xl"
                        />
                        <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                        <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                    </div>
                    
                    <div>
                        <div className="flex items-center space-x-3 mb-2">
                            <h1 className="text-3xl font-bold text-white">
                                {profile.title || profile.provider_title || user.name}
                            </h1>
                            <div className="flex items-center space-x-2 px-3 py-1 bg-primary-500/20 border border-primary-500/30 rounded-full">
                                {getCategoryIcon(isArtist)}
                                <span className="text-primary-400 font-semibold text-sm capitalize">
                                    {profile.serviceType ? profile.serviceType.replace(/_/g, ' ') : (isArtist ? 'Artist' : 'Provider')}
                                </span>
                            </div>
                        </div>
                        <p className="text-xl text-gray-300 mb-3">@{user.user_name}</p>
                        
                        <div className="flex flex-col items-left space-x-6 text-sm gap-3 sm:flex-row">
                            <div className="flex items-center space-x-2">
                                <Star className="w-4 h-4 text-primary-500 fill-current" />
                                <span className="font-bold text-white">4.8</span>
                                <span className="text-gray-400">(127 reviews)</span>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-400">
                                <MapPin className="w-4 h-4" />
                                <span>{user.country || 'Location not specified'}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-400">
                                <Award className="w-4 h-4" />
                                <span>{profile.experience || 0} years</span>
                            </div>
                        </div>
                    </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="w-full flex-1 lg:flex lg:justify-end">
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

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-8 border-t border-gray-800/50">
                    {isArtist ? (
                    <>
                        <div className="text-center">
                        <div className="text-2xl font-bold text-primary-500 mb-1">{profile.experience || 0}</div>
                        <div className="text-xs text-gray-400 uppercase tracking-wide">Experience</div>
                        </div>
                        <div className="text-center">
                        <div className="text-2xl font-bold text-primary-500 mb-1">24h</div>
                        <div className="text-xs text-gray-400 uppercase tracking-wide">Response</div>
                        </div>
                        <div className="text-center">
                        <div className="text-2xl font-bold text-primary-500 mb-1">4.8</div>
                        <div className="text-xs text-gray-400 uppercase tracking-wide">Rating</div>
                        </div>
                        <div className="text-center">
                        <div className="text-2xl font-bold text-primary-500 mb-1">98%</div>
                        <div className="text-xs text-gray-400 uppercase tracking-wide">Satisfaction</div>
                        </div>
                    </>
                    ) : (
                    <>
                        <div className="text-center">
                        <div className="text-2xl font-bold text-primary-500 mb-1">{profile.projectCount || 0}</div>
                        <div className="text-xs text-gray-400 uppercase tracking-wide">Projects</div>
                        </div>
                        <div className="text-center">
                        <div className="text-2xl font-bold text-primary-500 mb-1">{profile.responseTime || 24}  günde</div>
                        <div className="text-xs text-gray-400 uppercase tracking-wide">Response</div>
                        </div>
                        <div className="text-center">
                        <div className="text-2xl font-bold text-primary-500 mb-1">{profile.experience || 0}</div>
                        <div className="text-xs text-gray-400 uppercase tracking-wide">Experience</div>
                        </div>
                        <div className="text-center">
                        <div className="text-2xl font-bold text-primary-500 mb-1">98%</div>
                        <div className="text-xs text-gray-400 uppercase tracking-wide">Satisfaction</div>
                        </div>
                    </>
                    )}
                </div>
                </div>
            </div>
            </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
            <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Main Content */}
                <div className="lg:col-span-2">
                {/* Tabs */}
                <div className="flex space-x-6 mb-8 border-b border-gray-800/50 overflow-x-auto">
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

                {/* Tab Content */}
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
                        <p className="text-gray-300 leading-relaxed">
                            {profile.bio || profile.about || 'No biography available.'}
                        </p>
                        </div>

                        {/* Specialties/Genres */}
                        <div>
                        <h3 className="text-xl font-bold mb-4 text-white">
                            {isArtist ? 'Genres' : 'Specialties'}
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            {isArtist ? (
                            profile.genres ? (
                                Array.isArray(profile.genres) ? (
                                profile.genres.map((genre, index) => (
                                    <span
                                    key={index}
                                    className="px-4 py-2 bg-gradient-to-r from-primary-500/20 to-primary-400/10 border border-primary-500/30 rounded-lg text-primary-400 font-semibold"
                                    >
                                    {genre}
                                    </span>
                                ))
                                ) : (
                                profile.genres.split(',').map((genre, index) => (
                                    <span
                                    key={index}
                                    className="px-4 py-2 bg-gradient-to-r from-primary-500/20 to-primary-400/10 border border-primary-500/30 rounded-lg text-primary-400 font-semibold"
                                    >
                                    {genre.trim()}
                                    </span>
                                ))
                                )
                            ) : (
                                <span className="text-gray-400">No genres specified</span>
                            )
                            ) : (
                            profile.specialties && profile.specialties.length > 0 ? (
                                profile.specialties.map((specialty, index) => (
                                <span
                                    key={index}
                                    className="px-4 py-2 bg-gradient-to-r from-primary-500/20 to-primary-400/10 border border-primary-500/30 rounded-lg text-primary-400 font-semibold"
                                >
                                    {specialty}
                                </span>
                                ))
                            ) : (
                                <span className="text-gray-400">No specialties specified</span>
                            )
                            )}
                        </div>
                        </div>

                        {/* Notable Clients (for Providers) */}
                        {!isArtist && (
                        <div>
                            <h3 className="text-xl font-bold mb-4 text-white">Notable Clients</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {profile.importantClients && profile.importantClients.length > 0 ? (
                                profile.importantClients.map((client, index) => (
                                <div
                                    key={index}
                                    className="p-3 bg-gray-900/50 border border-gray-800/50 rounded-lg text-center"
                                >
                                    <span className="text-gray-300 font-semibold text-sm">{client}</span>
                                </div>
                                ))
                            ) : (
                                <span className="text-gray-400 col-span-full">No notable clients listed</span>
                            )}
                            </div>
                        </div>
                        )}

                        {/* Stüdyo Fotoğrafları - Sadece kayıt stüdyoları için */}
                        {!isArtist && profile.serviceType === 'recording_studio' && (
                        <div>
                            {/* Stüdyo Adı */}
                            {profile.studioName && (
                            <div className="mb-6">
                                <h3 className="text-2xl font-bold text-white mb-2">
                                    {profile.studioName}
                                </h3>
                                <div className="w-16 h-1 bg-gradient-to-r from-primary-500 to-primary-400 rounded-full"></div>
                            </div>
                            )}
                            
                            <h3 className="text-xl font-bold mb-6 text-white">Stüdyo Fotoğrafları</h3>
                            {profile.serviceData?.studioPhotos && profile.serviceData.studioPhotos.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {profile.serviceData.studioPhotos.map((photo, index) => (
                                <div
                                    key={index}
                                    className="relative bg-black/60 backdrop-blur-xl border border-gray-800/50 rounded-xl overflow-hidden hover:border-primary-500/50 transition-all duration-300 group"
                                >
                                    <div className="aspect-square relative">
                                    <Image
                                        src={photo.url}
                                        alt={photo.name || `Stüdyo fotoğrafı ${index + 1}`}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <button className="p-2 bg-white/20 backdrop-blur rounded-full">
                                        <Eye className="w-5 h-5 text-white" />
                                        </button>
                                    </div>
                                    </div>
                                </div>
                                ))}
                            </div>
                            ) : (
                            <div className="text-center text-gray-400 py-8">
                                <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                <p>Henüz stüdyo fotoğrafı eklenmedi</p>
                            </div>
                            )}
                        </div>
                        )}
                    </motion.div>
                    )}

                    {activeTab === 'portfolio' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {!isArtist && profile.serviceType === 'recording_studio' ? (
                        // Kayıt stüdyoları için özel görünüm
                        <div>
                            <h3 className="text-xl font-bold mb-6 text-white">Stüdyo Fotoğrafları</h3>
                            {profile.serviceData?.studioPhotos && profile.serviceData.studioPhotos.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {profile.serviceData.studioPhotos.map((photo, index) => (
                                <div
                                    key={index}
                                    className="relative bg-black/60 backdrop-blur-xl border border-gray-800/50 rounded-xl overflow-hidden hover:border-primary-500/50 transition-all duration-300 group"
                                >
                                    <div className="aspect-square relative">
                                    <Image
                                        src={photo.url}
                                        alt={photo.name || `Stüdyo fotoğrafı ${index + 1}`}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <button className="p-2 bg-white/20 backdrop-blur rounded-full">
                                        <Eye className="w-5 h-5 text-white" />
                                        </button>
                                    </div>
                                    </div>
                                </div>
                                ))}
                            </div>
                            ) : (
                            <div className="text-center text-gray-400 py-12">
                                <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                <p>Henüz stüdyo fotoğrafı eklenmedi</p>
                            </div>
                            )}
                        </div>
                        ) : !isArtist && (profile.serviceType === 'producer' || profile.serviceType === 'music_producer') ? (
                        // Müzik yapımcıları için projeler
                        <div>
                            <h3 className="text-xl font-bold mb-6 text-white">Müzik Projeleri</h3>
                            {/* Debug info */}
                            <div className="text-xs text-gray-400 mb-4">
                            </div>
                            {profile.serviceData?.musicProjects && profile.serviceData.musicProjects.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                                {profile.serviceData.musicProjects.map((project, index) => (
                                <div
                                    key={index}
                                    className="bg-black/60 backdrop-blur-xl border border-gray-800/50 rounded-xl overflow-hidden hover:border-primary-500/50 transition-all duration-300 group"
                                >
                                    {/* Proje Görseli */}
                                    <div className="relative h-48">
                                        {project.mediaUrl ? (
                                            project.mediaUrl.includes('.mp4') || project.mediaUrl.includes('.webm') ? (
                                                <video
                                                    src={project.mediaUrl}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    muted
                                                    poster="/api/placeholder/300/200"
                                                />
                                            ) : (
                                                <Image
                                                    src={project.mediaUrl}
                                                    alt={project.songName}
                                                    width={300}
                                                    height={200}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            )
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-primary-900/50 to-gray-900 flex items-center justify-center">
                                                <Music className="w-16 h-16 text-primary-400/50" />
                                            </div>
                                        )}
                                        
                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                                        
                                        {/* Hover Actions */}
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <div className="flex items-center space-x-3">
                                                {project.mediaUrl && project.mediaUrl.includes('.mp4') && (
                                                    <button className="p-3 bg-primary-600 rounded-full hover:bg-primary-700 transition-colors">
                                                        <Play className="w-5 h-5 text-black" />
                                                    </button>
                                                )}
                                                {project.link && (
                                                    <a
                                                        href={project.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-3 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
                                                    >
                                                        <ExternalLink className="w-5 h-5 text-white" />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Proje Bilgileri */}
                                    <div className="p-5">
                                        <h4 className="font-bold text-lg mb-2 text-white">{project.songName}</h4>
                                        <p className="text-primary-400 font-semibold mb-2">Müzik Yapımcısı</p>
                                        <p className="text-gray-400 mb-3 text-sm">{project.songDescription}</p>
                                        
                                        {/* Additional Info */}
                                        <div className="flex justify-between text-sm text-gray-500 mb-3">
                                            <span>Kategori: Prodüksiyon</span>
                                        </div>
                                        
                                        {/* Status */}
                                        <div className="p-3 bg-gray-900/50 rounded-lg">
                                            <span className="text-emerald-400 font-semibold text-sm">Durum: </span>
                                            <span className="text-gray-300 text-sm">Tamamlandı</span>
                                        </div>
                                    </div>
                                </div>
                                ))}
                            </div>
                            ) : (
                            <div className="text-center text-gray-400 py-12">
                                <Music className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                <p>Henüz müzik projesi eklenmedi</p>
                            </div>
                            )}
                        </div>
                        ) : !isArtist && (profile.serviceType === 'album_cover_artist' || profile.serviceType === 'album_cover_designer') ? (
                        // Albüm kapağı tasarımcıları için kapaklar
                        <div>
                            <h3 className="text-xl font-bold mb-6 text-white">Albüm Kapağı Tasarımları</h3>
                            {profile.serviceData?.albumCovers && profile.serviceData.albumCovers.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {profile.serviceData.albumCovers.map((cover, index) => (
                                <div
                                    key={index}
                                    className="bg-black/60 backdrop-blur-xl border border-gray-800/50 rounded-xl overflow-hidden hover:border-primary-500/50 transition-all duration-300 group"
                                >
                                    <div className="aspect-square relative">
                                    <Image
                                        src={cover.url}
                                        alt={cover.name || `Albüm kapağı ${index + 1}`}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    </div>
                                    {cover.songLink && (
                                    <div className="p-4">
                                        <a
                                        href={cover.songLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center space-x-2 text-primary-400 hover:text-primary-300 transition-colors"
                                        >
                                        <Play className="w-4 h-4" />
                                        <span>Şarkıyı Dinle</span>
                                        </a>
                                    </div>
                                    )}
                                </div>
                                ))}
                            </div>
                            ) : (
                            <div className="text-center text-gray-400 py-12">
                                <Palette className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                <p>Henüz albüm kapağı tasarımı eklenmedi</p>
                            </div>
                            )}
                        </div>
                        ) : !isArtist && profile.serviceType === 'music_video_director' ? (
                        // Video yönetmenleri için video kapakları
                        <div>
                            <h3 className="text-xl font-bold mb-6 text-white">Müzik Video Klipleri</h3>
                            {profile.serviceData?.musicVideos && profile.serviceData.musicVideos.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {profile.serviceData.musicVideos.map((video, index) => (
                                <div
                                    key={index}
                                    className="bg-black/60 backdrop-blur-xl border border-gray-800/50 rounded-xl overflow-hidden hover:border-primary-500/50 transition-all duration-300 group"
                                >
                                    {/* Video Kapağı */}
                                    <div className="relative h-48">
                                        {video.thumbnailUrl ? (
                                            <Image
                                                src={video.thumbnailUrl}
                                                alt={video.title || `Video ${index + 1}`}
                                                width={400}
                                                height={200}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-red-900/50 to-purple-900/50 flex items-center justify-center">
                                                <Camera className="w-16 h-16 text-red-400/50" />
                                            </div>
                                        )}
                                        
                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                                        
                                        {/* Play Button */}
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-2xl opacity-90 group-hover:opacity-100 transition-opacity">
                                                <Play className="w-8 h-8 text-white ml-1" />
                                            </div>
                                        </div>
                                        
                                        {/* Video Duration Badge */}
                                        {video.duration && (
                                            <div className="absolute bottom-3 right-3 bg-black/80 px-2 py-1 rounded text-white text-xs font-semibold">
                                                {video.duration}
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Video Bilgileri */}
                                    <div className="p-5">
                                        <h4 className="font-bold text-lg mb-2 text-white">{video.title || `Video ${index + 1}`}</h4>
                                        <p className="text-primary-400 font-semibold mb-2">Müzik Video Yönetmeni</p>
                                        {video.description && (
                                            <p className="text-gray-400 mb-3 text-sm">{video.description}</p>
                                        )}
                                        
                                        {/* YouTube Linki */}
                                        {video.youtubeLink && (
                                            <a
                                                href={video.youtubeLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center space-x-2 text-red-400 hover:text-red-300 transition-colors font-semibold"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                                <span>YouTube'da İzle</span>
                                            </a>
                                        )}
                                    </div>
                                </div>
                                ))}
                            </div>
                            ) : (
                            <div className="text-center text-gray-400 py-12">
                                <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                <p>Henüz müzik video klipi eklenmedi</p>
                            </div>
                            )}
                        </div>
                        ) : !isArtist && profile.serviceType === 'songwriter' ? (
                        // Şarkı yazarları için şarkılar
                        <div>
                            <h3 className="text-xl font-bold mb-6 text-white">Yazdığım Şarkılar</h3>
                            {profile.serviceData?.songs && profile.serviceData.songs.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {profile.serviceData.songs.map((song, index) => (
                                <div
                                    key={index}
                                    className="bg-black/60 backdrop-blur-xl border border-gray-800/50 rounded-xl overflow-hidden hover:border-primary-500/50 transition-all duration-300 group"
                                >
                                    {/* Şarkı Kapağı */}
                                    <div className="relative h-48">
                                        {song.coverUrl ? (
                                            <Image
                                                src={song.coverUrl}
                                                alt={song.title}
                                                width={300}
                                                height={200}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-purple-900/50 to-pink-900/50 flex items-center justify-center">
                                                <Mic className="w-16 h-16 text-purple-400/50" />
                                            </div>
                                        )}
                                        
                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                                        
                                        {/* Hover Actions */}
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <div className="flex items-center space-x-3">
                                                {song.demoUrl && (
                                                    <button className="p-3 bg-purple-600 rounded-full hover:bg-purple-700 transition-colors">
                                                        <Play className="w-5 h-5 text-white" />
                                                    </button>
                                                )}
                                                {song.linkUrl && (
                                                    <a
                                                        href={song.linkUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-3 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
                                                    >
                                                        <ExternalLink className="w-5 h-5 text-white" />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Şarkı Bilgileri */}
                                    <div className="p-5">
                                        <h4 className="font-bold text-lg mb-2 text-white">{song.title}</h4>
                                        <p className="text-purple-400 font-semibold mb-2">Şarkı Yazarı</p>
                                        {song.artist && (
                                            <p className="text-gray-400 mb-2 text-sm">Sanatçı: {song.artist}</p>
                                        )}
                                        {song.genre && (
                                            <p className="text-gray-400 mb-3 text-sm">Tür: {song.genre}</p>
                                        )}
                                        
                                        {/* Lyrics Preview */}
                                        {song.lyricsPreview && (
                                            <div className="p-3 bg-gray-900/50 rounded-lg mb-3">
                                                <span className="text-purple-400 font-semibold text-sm">Söz Örneği: </span>
                                                <p className="text-gray-300 text-sm italic">"{song.lyricsPreview}"</p>
                                            </div>
                                        )}
                                        
                                        {/* Status */}
                                        <div className="p-3 bg-gray-900/50 rounded-lg">
                                            <span className="text-emerald-400 font-semibold text-sm">Durum: </span>
                                            <span className="text-gray-300 text-sm">Yayında</span>
                                        </div>
                                    </div>
                                </div>
                                ))}
                            </div>
                            ) : (
                            <div className="text-center text-gray-400 py-12">
                                <Mic className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                <p>Henüz şarkı eklenmedi</p>
                            </div>
                            )}
                        </div>
                        ) : !isArtist && profile.serviceType === 'mix_engineer' ? (
                        // Mix mühendisleri için projeler
                        <div>
                            <h3 className="text-xl font-bold mb-6 text-white">Mix & Master Projeleri</h3>
                            {profile.serviceData?.mixProjects && profile.serviceData.mixProjects.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {profile.serviceData.mixProjects.map((project, index) => (
                                <div
                                    key={index}
                                    className="bg-black/60 backdrop-blur-xl border border-gray-800/50 rounded-xl overflow-hidden hover:border-primary-500/50 transition-all duration-300 group"
                                >
                                    {/* Proje Kapağı */}
                                    <div className="relative h-48">
                                        {project.coverUrl ? (
                                            <Image
                                                src={project.coverUrl}
                                                alt={project.title}
                                                width={300}
                                                height={200}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-blue-900/50 to-cyan-900/50 flex items-center justify-center">
                                                <Music className="w-16 h-16 text-blue-400/50" />
                                            </div>
                                        )}
                                        
                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                                        
                                        {/* Before/After Comparison */}
                                        <div className="absolute top-3 left-3 flex space-x-2">
                                            {project.beforeUrl && (
                                                <span className="px-2 py-1 bg-red-600/80 text-white text-xs rounded font-semibold">
                                                    BEFORE
                                                </span>
                                            )}
                                            {project.afterUrl && (
                                                <span className="px-2 py-1 bg-green-600/80 text-white text-xs rounded font-semibold">
                                                    AFTER
                                                </span>
                                            )}
                                        </div>
                                        
                                        {/* Hover Actions */}
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <div className="flex items-center space-x-3">
                                                {project.beforeUrl && (
                                                    <button className="p-3 bg-red-600 rounded-full hover:bg-red-700 transition-colors" title="Before">
                                                        <Play className="w-5 h-5 text-white" />
                                                    </button>
                                                )}
                                                {project.afterUrl && (
                                                    <button className="p-3 bg-green-600 rounded-full hover:bg-green-700 transition-colors" title="After">
                                                        <Play className="w-5 h-5 text-white" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Proje Bilgileri */}
                                    <div className="p-5">
                                        <h4 className="font-bold text-lg mb-2 text-white">{project.title}</h4>
                                        <p className="text-blue-400 font-semibold mb-2">Mix & Master Mühendisi</p>
                                        {project.artist && (
                                            <p className="text-gray-400 mb-2 text-sm">Sanatçı: {project.artist}</p>
                                        )}
                                        {project.genre && (
                                            <p className="text-gray-400 mb-3 text-sm">Tür: {project.genre}</p>
                                        )}
                                        
                                        {/* Technical Details */}
                                        <div className="space-y-2 mb-3">
                                            {project.techniques && (
                                                <div className="flex flex-wrap gap-1">
                                                    {project.techniques.map((technique, techIndex) => (
                                                        <span
                                                            key={techIndex}
                                                            className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded border border-blue-500/30"
                                                        >
                                                            {technique}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* Status */}
                                        <div className="p-3 bg-gray-900/50 rounded-lg">
                                            <span className="text-emerald-400 font-semibold text-sm">Durum: </span>
                                            <span className="text-gray-300 text-sm">Tamamlandı</span>
                                        </div>
                                    </div>
                                </div>
                                ))}
                            </div>
                            ) : (
                            <div className="text-center text-gray-400 py-12">
                                <Music className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                <p>Henüz mix & master projesi eklenmedi</p>
                            </div>
                            )}
                        </div>
                        ) : (
                        // Artist profilleri veya diğer servis tipleri için genel portfolio
                        <div className="text-center text-gray-400 py-12">
                            <div className="text-6xl mb-4">🎨</div>
                            <p>Portfolio özelliği yakında eklenecek</p>
                        </div>
                        )}
                    </motion.div>
                    )}

                    {activeTab === 'services' && !isArtist && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div>
                        <h3 className="text-xl font-bold mb-4 text-white">Services Offered</h3>
                        <div className="grid gap-4">
                            {profile.services && profile.services.length > 0 ? (
                            profile.services.map((service, index) => (
                                <div
                                key={index}
                                className="bg-black/60 backdrop-blur-xl border border-gray-800/50 rounded-xl p-6 hover:border-primary-500/50 transition-all duration-300"
                                >
                                <h4 className="text-lg font-bold mb-2 text-white">{service}</h4>
                                <p className="text-gray-400">Professional {service.toLowerCase()} services</p>
                                </div>
                            ))
                            ) : (
                            <div className="text-center text-gray-400 py-8">
                                No services listed yet
                            </div>
                            )}
                        </div>
                        </div>
                    </motion.div>
                    )}

                    {activeTab === 'packages' && !isArtist && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div>
                        <h3 className="text-xl font-bold mb-6 text-white">Service Packages</h3>
                        {profile.packages && profile.packages.length > 0 ? (
                            <div className="grid gap-6">
                            {profile.packages.map((pkg, index) => (
                                <div
                                key={pkg.id || index}
                                className="relative bg-black/60 backdrop-blur-xl border border-gray-800/50 rounded-xl p-6 hover:border-primary-500/50 transition-all duration-300"
                                >
                                {/* Paket Badge */}
                                {index === 0 && (
                                    <div className="absolute -top-3 left-6">
                                    <span className="px-3 py-1 bg-gradient-to-r from-primary-500 to-primary-400 text-xs font-bold rounded-full text-black shadow-lg">
                                        POPULAR
                                    </span>
                                    </div>
                                )}

                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Paket Bilgileri */}
                                    <div className="flex-1">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                                        <div>
                                        <h4 className="text-xl font-bold mb-2 text-white">{pkg.title}</h4>
                                        <p className="text-gray-400">{pkg.description}</p>
                                        </div>
                                        <div className="text-right mt-4 md:mt-0">
                                        <div className="text-3xl font-bold text-primary-500 mb-1">₺{calculateTotalPrice(pkg.basePrice || pkg.price)?.toLocaleString()}</div>
                                        <div className="text-sm text-gray-400">{pkg.deliveryTime} delivery</div>
                                        </div>
                                    </div>

                                    {/* Özellikler */}
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

                                    {/* Order Button */}
                                    <button className="w-full py-3 bg-gradient-to-r from-primary-500 to-primary-400 hover:from-primary-600 hover:to-primary-500 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-lg text-black">
                                        Order Now - ₺{calculateTotalPrice(pkg.basePrice || pkg.price)?.toLocaleString()}
                                    </button>
                                    </div>
                                </div>
                                </div>
                            ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                            <div className="text-gray-400 mb-4">
                                <Music size={48} className="mx-auto mb-4 opacity-50" />
                                <p className="text-lg">No packages available</p>
                                <p className="text-sm">This provider hasn't created any service packages yet</p>
                            </div>
                            </div>
                        )}
                        </div>
                    </motion.div>
                    )}

                    {activeTab === 'portfolio' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {!isArtist && profile.portfolioFiles && profile.portfolioFiles.length > 0 ? (
                        profile.portfolioFiles.map((file, index) => (
                            <div
                            key={index}
                            className="bg-black/60 backdrop-blur-xl border border-gray-800/50 rounded-xl overflow-hidden hover:border-primary-500/50 transition-all duration-300 group"
                            >
                            <div className="relative h-48">
                                {file.type === 'image' ? (
                                <Image
                                    src={file.url}
                                    alt={file.name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                ) : file.type === 'audio' ? (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-900/50 to-blue-900/50">
                                    <div className="text-6xl mb-4">🎵</div>
                                    <audio controls className="w-full px-4">
                                    <source src={file.url} type="audio/mpeg" />
                                    </audio>
                                </div>
                                ) : file.type === 'video' ? (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-900/50 to-purple-900/50">
                                    <video controls className="w-full h-full object-cover">
                                    <source src={file.url} type="video/mp4" />
                                    </video>
                                </div>
                                ) : null}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                            </div>
                            <div className="p-5">
                                <h4 className="font-bold text-lg mb-2 text-white">{file.name}</h4>
                                <p className="text-gray-400 text-sm">
                                {file.type === 'image' && profile.serviceType === 'recording_studio' && 'Studio Photo'}
                                {file.type === 'image' && profile.serviceType === 'album_cover_artist' && 'Album Cover Design'}
                                {file.type === 'audio' && 'Music Sample'}
                                {file.type === 'video' && 'Video Teaser'}
                                </p>
                            </div>
                            </div>
                        ))
                        ) : (
                        <div className="col-span-full text-center text-gray-400 py-8">
                            No portfolio items available yet
                        </div>
                        )}
                    </motion.div>
                    )}

                    {activeTab === 'reviews' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div className="text-center text-gray-400 py-8">
                        Reviews feature coming soon
                        </div>
                    </motion.div>
                    )}
                </div>
                </div>

                {/* Right Column - Sidebar */}
                <div className="space-y-6">
                {/* Contact Card */}
                <div className="bg-black/60 backdrop-blur-xl border border-gray-800/50 rounded-xl p-6">
                    <h3 className="text-lg font-bold mb-4 text-white">Contact Information</h3>
                    <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300 text-sm">
                        Responds within {profile.responseTime || 24} hours
                        </span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300 text-sm">Available for new projects</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300 text-sm">
                        {profile.projectCount || 0}+ completed projects
                        </span>
                    </div>
                    </div>
                </div>

                {/* Quick Contact */}
                <div className="bg-black/60 backdrop-blur-xl border border-gray-800/50 rounded-xl p-6">
                    <h3 className="text-lg font-bold mb-4 text-white">Get in Touch</h3>
                    <div className="space-y-4">
                                        <button
                                            className="w-full py-3 bg-gradient-to-r from-primary-500 to-primary-400 hover:from-primary-600 hover:to-primary-500 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-lg text-black text-sm"
                                            onClick={() => {
                                                if (user?.user_name) {
                                                    router.push(`/dashboard/messages?to=${user.user_name}`);
                                                }
                                            }}
                                        >
                                                Send Message
                                        </button>
                    <button className="w-full py-3 border-2 border-gray-700 hover:border-primary-500 rounded-lg font-bold transition-all duration-300 text-white text-sm">
                        Request Quote
                    </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="bg-black/60 backdrop-blur-xl border border-gray-800/50 rounded-xl p-6">
                    <h3 className="text-lg font-bold mb-4 text-white">Profile Stats</h3>
                    <div className="space-y-4">
                    <div className="flex justify-between">
                        <span className="text-gray-400 text-sm">
                        {isArtist ? 'Experience' : 'Total Projects'}
                        </span>
                        <span className="font-bold text-white text-sm">
                        {isArtist ? `${profile.experience || 0} years` : (profile.projectCount || 0)}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400 text-sm">Member Since</span>
                        <span className="font-bold text-white text-sm">
                        {new Date(profile.createdAt).getFullYear()}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400 text-sm">Response Rate</span>
                        <span className="font-bold text-emerald-400 text-sm">98%</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400 text-sm">Satisfaction</span>
                        <span className="font-bold text-primary-500 text-sm">4.8/5.0</span>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </section>
        </div>
    <Footer />
    </>
  );
}
