"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Star, Users, Award, ArrowRight, 
  CheckCircle, Sparkles, Zap, Globe, Music
} from 'lucide-react';
import Link from 'next/link';


export const HomePage = () => {
  const categories = [
    {
      name: 'Recording Studios',
      slug: 'recording-studios',
      image: '/Untitled-1-min copy copy copy copy.png'
    },
    {
      name: 'Music Producers',
      slug: 'producers',
      image: '/site-images/dripzone_producer.webp'
    },
    {
      name: 'Album Cover Artists',
      slug: 'album-cover-artists',
      image: 'https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=500'
    },
    {
      name: 'Music Video Directors',
      slug: 'videographers',
      image: '/site-images/music_directors.webp'
    }
  ];

  const stats = [
    { label: 'Creative Professionals', value: '10,000+', icon: Users },
    { label: 'Projects Completed', value: '50,000+', icon: CheckCircle },
    { label: 'Countries Served', value: '120+', icon: Globe },
    { label: 'Average Rating', value: '4.9/5', icon: Star }
  ];

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      {/* Optimized Background Elements - Reduced opacity for better text contrast */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-80 h-80 bg-gradient-to-r from-primary-500/8 to-primary-400/4 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-gradient-to-r from-primary-600/6 to-primary-500/3 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-primary-500/2 to-transparent rounded-full blur-3xl animate-pulse-slow"></div>
      </div>
      
      {/* Hero Section - Optimized Typography Hierarchy */}
      <section className="relative">
        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              {/* Trusted Badge - Optimized Size and Spacing */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center space-x-3 px-6 py-3 bg-black/50 backdrop-blur-xl border border-primary-500/30 rounded-full mb-8 shadow-lg"
              >
                <Sparkles className="w-4 h-4 text-primary-500" />
                <span className="text-primary-400 font-semibold text-sm tracking-wide">Trusted by 10,000+ creators worldwide</span>
              </motion.div>

              {/* Main Heading - Optimized Typography Scale */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-[1.1] tracking-tight">
                Find Your{' '}
                <span className="bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 bg-clip-text text-transparent">
                  Creative Space
                </span>
              </h1>
              
              {/* Description - Improved Readability */}
              <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-12 leading-relaxed max-w-4xl mx-auto font-light">
                Discover the perfect creative professionals for your music projects. Connect with studios, producers, and artists worldwide.
              </p>
            </motion.div>

            {/* Services Grid - Enhanced Visual Balance */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
            >
              {categories.map((category, index) => (
                <motion.div
                  key={category.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                  className="h-full"
                >
                  <Link
                    href={`/category/${category.slug}`}
                    className="group block bg-black/60 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-6 hover:border-primary-500/50 hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-500 transform hover:scale-[1.02] h-full flex flex-col"
                  >
                    {/* Image - Optimized Aspect Ratio */}
                    <div className="relative h-48 mb-6 overflow-hidden rounded-xl flex-shrink-0">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </div>
                    
                    {/* Title - Optimized Typography */}
                    <div className="flex-grow flex flex-col justify-center text-center">
                      <h3 className="text-xl font-bold group-hover:text-primary-400 transition-colors duration-300 leading-tight">
                        {category.name}
                      </h3>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section - Enhanced Visual Hierarchy */}
      <section className="py-16 border-t border-gray-800/30 relative">
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                {/* Icon Container - Standardized Size */}
                <div className="w-16 h-16 bg-gradient-to-r from-primary-500/20 to-primary-400/10 backdrop-blur-xl rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-primary-500/20 transition-all duration-300 border border-primary-500/20">
                  <stat.icon className="w-7 h-7 text-primary-400" />
                </div>
                
                {/* Value - Optimized Typography Scale */}
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-primary-400 to-primary-500 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                
                {/* Label - Improved Readability */}
                <div className="text-gray-300 font-medium text-sm sm:text-base leading-tight">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section - Refined and Balanced */}
      <section className="py-16 relative overflow-hidden bg-black">
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Heading - Optimized Scale */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Ready to Create Something{' '}
              <span className="bg-gradient-to-r from-primary-400 to-primary-500 bg-clip-text text-transparent">
                Amazing?
              </span>
            </h2>
            
            {/* Description - Enhanced Readability */}
            <p className="text-lg sm:text-xl text-gray-200 mb-10 max-w-3xl mx-auto leading-relaxed font-light">
              Join thousands of artists and professionals who trust Dripzone for their creative projects
            </p>
            
            {/* Buttons - Improved Spacing and Hierarchy */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/auth/register"
                  className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-400 hover:from-primary-600 hover:to-primary-500 text-black font-bold rounded-xl text-base transition-all duration-300 shadow-lg hover:shadow-primary-500/25 min-w-[200px] justify-center"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/category/recording-studios"
                  className="inline-flex items-center space-x-3 px-8 py-4 border-2 border-primary-500/50 hover:border-primary-500 text-white rounded-xl font-bold text-base transition-all duration-300 backdrop-blur-xl hover:bg-primary-500/10 min-w-[200px] justify-center"
                >
                  <span>Explore Services</span>
                  <Zap className="w-5 h-5" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};