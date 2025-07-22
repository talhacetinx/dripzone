"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { Cookie, Settings, BarChart3, Shield, Eye, Globe } from 'lucide-react';

export const CookieComponent = () => {
  const cookieTypes = [
    {
      icon: Shield,
      title: 'Essential Cookies',
      description: 'Required for basic website functionality',
      examples: ['Authentication', 'Security', 'Form submissions', 'Shopping cart'],
      canDisable: false
    },
    {
      icon: BarChart3,
      title: 'Analytics Cookies',
      description: 'Help us understand how visitors use our website',
      examples: ['Page views', 'User behavior', 'Performance metrics', 'Error tracking'],
      canDisable: true
    },
    {
      icon: Settings,
      title: 'Functional Cookies',
      description: 'Remember your preferences and settings',
      examples: ['Language preferences', 'Theme settings', 'Location data', 'Saved searches'],
      canDisable: true
    },
    {
      icon: Eye,
      title: 'Marketing Cookies',
      description: 'Used to deliver relevant advertisements',
      examples: ['Ad targeting', 'Campaign tracking', 'Social media integration', 'Retargeting'],
      canDisable: true
    }
  ];

  const thirdPartyServices = [
    {
      name: 'Google Analytics',
      purpose: 'Website analytics and performance tracking',
      dataCollected: 'Page views, user interactions, device information',
      retention: '26 months'
    },
    {
      name: 'Stripe',
      purpose: 'Payment processing and fraud prevention',
      dataCollected: 'Payment information, transaction data',
      retention: '7 years'
    },
    {
      name: 'Intercom',
      purpose: 'Customer support and communication',
      dataCollected: 'Messages, user behavior, contact information',
      retention: '3 years'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative py-24">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-primary-500/10 to-primary-400/5 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-primary-600/8 to-primary-500/3 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
              Cookie{' '}
              <span className="bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 bg-clip-text text-transparent">
                Policy
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed">
              Learn how we use cookies and similar technologies to improve your experience on Dripzone.
            </p>
            <p className="text-sm text-gray-400">
              Last updated: January 1, 2025
            </p>
          </motion.div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-12 border-t border-gray-800/30">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-black/60 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-8 mb-12"
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-primary-500/20 to-primary-400/10 rounded-xl flex items-center justify-center border border-primary-500/20">
                  <Cookie className="w-6 h-6 text-primary-400" />
                </div>
                <h2 className="text-2xl font-bold text-primary-400">What Are Cookies?</h2>
              </div>
              <p className="text-gray-300 leading-relaxed mb-4">
                Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences, keeping you logged in, and understanding how you use our platform.
              </p>
              <p className="text-gray-300 leading-relaxed">
                We use both first-party cookies (set by Dripzone) and third-party cookies (set by our partners) to enhance functionality, analyze usage, and provide personalized content.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Cookie Types */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4">
                Types of{' '}
                <span className="bg-gradient-to-r from-primary-400 to-primary-500 bg-clip-text text-transparent">
                  Cookies We Use
                </span>
              </h2>
              <p className="text-lg text-gray-300">
                We use different types of cookies for various purposes on our platform.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {cookieTypes.map((type, index) => (
                <motion.div
                  key={type.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-black/60 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-8 hover:border-primary-500/50 transition-all duration-300"
                >
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary-500/20 to-primary-400/10 rounded-xl flex items-center justify-center border border-primary-500/20">
                      <type.icon className="w-6 h-6 text-primary-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{type.title}</h3>
                      <p className="text-sm text-gray-400">
                        {type.canDisable ? 'Can be disabled' : 'Always active'}
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 leading-relaxed mb-4">{type.description}</p>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-primary-400 mb-2">Examples:</h4>
                    <ul className="space-y-1">
                      {type.examples.map((example, exampleIndex) => (
                        <li key={exampleIndex} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-primary-500 rounded-full"></div>
                          <span className="text-sm text-gray-300">{example}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Third Party Services */}
      <section className="py-12 border-t border-gray-800/30">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4">
                Third-Party{' '}
                <span className="bg-gradient-to-r from-primary-400 to-primary-500 bg-clip-text text-transparent">
                  Services
                </span>
              </h2>
              <p className="text-lg text-gray-300">
                We work with trusted partners who may also set cookies on our website.
              </p>
            </motion.div>

            <div className="space-y-6">
              {thirdPartyServices.map((service, index) => (
                <motion.div
                  key={service.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-black/60 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-6 hover:border-primary-500/50 transition-all duration-300"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-primary-400 mb-2">{service.name}</h3>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-1">Purpose</h4>
                      <p className="text-sm text-gray-300">{service.purpose}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-1">Data Collected</h4>
                      <p className="text-sm text-gray-300">{service.dataCollected}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-1">Retention</h4>
                      <p className="text-sm text-gray-300">{service.retention}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Cookie Management */}
      <section className="py-12 border-t border-gray-800/30">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-black/60 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-8"
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-primary-500/20 to-primary-400/10 rounded-xl flex items-center justify-center border border-primary-500/20">
                  <Settings className="w-6 h-6 text-primary-400" />
                </div>
                <h2 className="text-2xl font-bold text-primary-400">Managing Your Cookie Preferences</h2>
              </div>
              
              <div className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  You have several options for managing cookies on our website:
                </p>
                
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">Use our cookie consent banner to accept or reject non-essential cookies</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">Adjust your browser settings to block or delete cookies</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">Opt out of analytics tracking through Google Analytics opt-out</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">Contact us to request specific cookie management assistance</span>
                  </li>
                </ul>
                
                <div className="mt-6 p-4 bg-primary-500/10 border border-primary-500/20 rounded-lg">
                  <p className="text-sm text-primary-200">
                    <strong>Note:</strong> Disabling certain cookies may affect the functionality of our website and your user experience.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 border-t border-gray-800/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-6">
              Questions About{' '}
              <span className="bg-gradient-to-r from-primary-400 to-primary-500 bg-clip-text text-transparent">
                Cookies?
              </span>
            </h2>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              If you have any questions about our use of cookies, please don't hesitate to contact us.
            </p>
            
            <div className="bg-black/60 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-primary-400 mb-4">Privacy Team</h3>
                  <p className="text-gray-300">privacy@dripzone.com</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-primary-400 mb-4">General Support</h3>
                  <p className="text-gray-300">support@dripzone.com</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};