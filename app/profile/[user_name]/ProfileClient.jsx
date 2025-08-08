"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { 
  Star, MapPin, Clock, CheckCircle, Heart, MessageCircle, 
  Award, TrendingUp, Calendar, Play, ExternalLink, Users,
  Music, Camera, Palette, Mic
} from 'lucide-react';
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";

export default function ProfileClientPage({ params, initialData }) {
  const [user] = useState(initialData);
  const [activeTab, setActiveTab] = useState('overview');

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
  const isArtist = Boolean(user.artistProfile);

  const getCategoryIcon = (isArtist) => {
    return isArtist ? <Music className="w-5 h-5" /> : <Mic className="w-5 h-5" />;
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'reviews', label: 'Reviews' }
  ];

  if (!isArtist) {
    tabs.splice(1, 0, { id: 'services', label: 'Services' });
  }

  return (
    <>
    <Header />
        <div className="min-h-screen bg-black">
        {/* Hero Section */}
        <section className="relative">
            <div 
            className="h-80 bg-cover bg-center relative" 
            style={{ 
                backgroundImage: `url(${profile.avatarUrl || "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800"})` 
            }}
            >
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
            </div>
            
            <div className="container mx-auto px-6">
            <div className="relative -mt-32 z-10">
                <div className="bg-black/80 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-8 shadow-2xl">
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                    {/* Profile Info */}
                    <div className="flex items-center space-x-6">
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
                            {isArtist ? 'Artist' : 'Provider'}
                            </span>
                        </div>
                        </div>
                        <p className="text-xl text-gray-300 mb-3">@{user.user_name}</p>
                        
                        <div className="flex items-center space-x-6 text-sm">
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
                        <div className="text-2xl font-bold text-primary-500 mb-1">{profile.responseTime || 24}h</div>
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

                    {activeTab === 'portfolio' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                        {!isArtist && profile.studioPhotos && profile.studioPhotos.length > 0 ? (
                        profile.studioPhotos.map((photo, index) => (
                            <div
                            key={index}
                            className="bg-black/60 backdrop-blur-xl border border-gray-800/50 rounded-xl overflow-hidden hover:border-primary-500/50 transition-all duration-300 group"
                            >
                            <div className="relative h-48">
                                <Image
                                src={photo}
                                alt={`Studio Photo ${index + 1}`}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                            </div>
                            <div className="p-5">
                                <h4 className="font-bold text-lg mb-2 text-white">Studio Photo {index + 1}</h4>
                                <p className="text-gray-400 text-sm">{profile.studioName || 'Professional Studio'}</p>
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
                    <button className="w-full py-3 bg-gradient-to-r from-primary-500 to-primary-400 hover:from-primary-600 hover:to-primary-500 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-lg text-black text-sm">
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
