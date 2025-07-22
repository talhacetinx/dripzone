"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Eye, Lock, Users, Database, Globe } from 'lucide-react';

export const PrivacyComponent = () => {
  const sections = [
    {
      icon: Database,
      title: 'Information We Collect',
      content: [
        'Personal information you provide when creating an account (name, email, phone number)',
        'Profile information including bio, location, and professional details',
        'Payment information processed securely through our payment partners',
        'Communication data from messages sent through our platform',
        'Usage data including how you interact with our services',
        'Device information such as IP address, browser type, and operating system'
      ]
    },
    {
      icon: Eye,
      title: 'How We Use Your Information',
      content: [
        'To provide and maintain our marketplace services',
        'To process transactions and facilitate payments',
        'To communicate with you about your account and services',
        'To improve our platform and develop new features',
        'To ensure platform security and prevent fraud',
        'To comply with legal obligations and resolve disputes'
      ]
    },
    {
      icon: Users,
      title: 'Information Sharing',
      content: [
        'We do not sell your personal information to third parties',
        'Service providers may see relevant information to complete projects',
        'Payment processors receive necessary transaction information',
        'We may share data with law enforcement when legally required',
        'Anonymous, aggregated data may be used for analytics',
        'Business transfers may include user data with proper notice'
      ]
    },
    {
      icon: Lock,
      title: 'Data Security',
      content: [
        'Industry-standard encryption for data transmission and storage',
        'Regular security audits and vulnerability assessments',
        'Secure payment processing through certified partners',
        'Access controls limiting who can view your information',
        'Regular backups to prevent data loss',
        'Incident response procedures for any security breaches'
      ]
    },
    {
      icon: Shield,
      title: 'Your Rights',
      content: [
        'Access and review your personal information',
        'Request corrections to inaccurate data',
        'Delete your account and associated data',
        'Export your data in a portable format',
        'Opt out of marketing communications',
        'File complaints with data protection authorities'
      ]
    },
    {
      icon: Globe,
      title: 'International Transfers',
      content: [
        'Data may be processed in countries outside your residence',
        'We ensure adequate protection through legal mechanisms',
        'EU users benefit from GDPR protections',
        'We comply with applicable international data transfer laws',
        'Safeguards are in place for cross-border data transfers'
      ]
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
              Privacy{' '}
              <span className="bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 bg-clip-text text-transparent">
                Policy
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed">
              Your privacy is important to us. This policy explains how we collect, use, and protect your information.
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
              <h2 className="text-2xl font-bold mb-4 text-primary-400">Introduction</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Dripzone ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our music marketplace platform.
              </p>
              <p className="text-gray-300 leading-relaxed">
                By using our services, you agree to the collection and use of information in accordance with this policy. We will not use or share your information with anyone except as described in this Privacy Policy.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Sections */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto space-y-12">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-black/60 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-8 hover:border-primary-500/50 transition-all duration-300"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-500/20 to-primary-400/10 rounded-xl flex items-center justify-center border border-primary-500/20">
                    <section.icon className="w-6 h-6 text-primary-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">{section.title}</h2>
                </div>
                
                <ul className="space-y-3">
                  {section.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-300 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
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
              Questions About Your{' '}
              <span className="bg-gradient-to-r from-primary-400 to-primary-500 bg-clip-text text-transparent">
                Privacy?
              </span>
            </h2>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              If you have any questions about this Privacy Policy or our data practices, please contact us.
            </p>
            
            <div className="bg-black/60 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-primary-400 mb-4">Email Us</h3>
                  <p className="text-gray-300">privacy@dripzone.com</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-primary-400 mb-4">Data Protection Officer</h3>
                  <p className="text-gray-300">dpo@dripzone.com</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};