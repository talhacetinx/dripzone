"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Users, CreditCard, Shield, AlertTriangle, Scale } from 'lucide-react';

export const TermsComponent = () => {
  const sections = [
    {
      icon: Users,
      title: 'User Accounts and Registration',
      content: [
        'You must be at least 18 years old to use our services',
        'Provide accurate and complete information during registration',
        'Maintain the security of your account credentials',
        'You are responsible for all activities under your account',
        'One account per person or business entity',
        'We reserve the right to suspend or terminate accounts for violations'
      ]
    },
    {
      icon: FileText,
      title: 'Platform Services',
      content: [
        'Dripzone provides a marketplace connecting artists with service providers',
        'We facilitate transactions but are not party to service agreements',
        'Service quality and delivery are the responsibility of providers',
        'We do not guarantee the availability of specific services',
        'Platform features may be updated or modified without notice',
        'We reserve the right to refuse service to anyone'
      ]
    },
    {
      icon: CreditCard,
      title: 'Payments and Fees',
      content: [
        'Platform fee of 20% applies to all transactions',
        'Service providers receive 80% of the transaction amount',
        'Payment processing fees may apply',
        'Refunds are subject to our refund policy',
        'Disputes must be reported within 30 days',
        'We reserve the right to hold payments for security reasons'
      ]
    },
    {
      icon: Shield,
      title: 'User Conduct',
      content: [
        'Use the platform only for lawful purposes',
        'Do not upload copyrighted material without permission',
        'Respect intellectual property rights of others',
        'No harassment, discrimination, or abusive behavior',
        'Do not attempt to circumvent platform fees',
        'Report violations to our support team'
      ]
    },
    {
      icon: AlertTriangle,
      title: 'Prohibited Activities',
      content: [
        'Fraudulent or deceptive practices',
        'Spam, unsolicited communications, or marketing',
        'Hacking, data mining, or unauthorized access attempts',
        'Uploading malicious software or viruses',
        'Impersonating other users or entities',
        'Any activity that violates applicable laws'
      ]
    },
    {
      icon: Scale,
      title: 'Liability and Disclaimers',
      content: [
        'Services are provided "as is" without warranties',
        'We are not liable for service provider performance',
        'Users assume all risks of using the platform',
        'Our liability is limited to the amount of fees paid',
        'We do not guarantee uninterrupted service availability',
        'Force majeure events may affect service delivery'
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
              Terms &{' '}
              <span className="bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 bg-clip-text text-transparent">
                Conditions
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed">
              Please read these terms carefully before using our platform services.
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
              <h2 className="text-2xl font-bold mb-4 text-primary-400">Agreement to Terms</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                These Terms and Conditions ("Terms") govern your use of the Dripzone platform and services. By accessing or using our services, you agree to be bound by these Terms.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                If you disagree with any part of these terms, then you may not access the service. These Terms apply to all visitors, users, and others who access or use the service.
              </p>
              <p className="text-gray-300 leading-relaxed">
                We reserve the right to update these Terms at any time. Changes will be effective immediately upon posting. Your continued use of the service constitutes acceptance of the updated Terms.
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

      {/* Additional Terms */}
      <section className="py-12 border-t border-gray-800/30">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-black/60 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-8 mb-8"
            >
              <h2 className="text-2xl font-bold mb-4 text-primary-400">Intellectual Property</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                The Dripzone platform, including its design, features, and content, is protected by copyright, trademark, and other intellectual property laws. Users retain ownership of their original content but grant us a license to use it for platform operations.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-black/60 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-8 mb-8"
            >
              <h2 className="text-2xl font-bold mb-4 text-primary-400">Termination</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We may terminate or suspend your account immediately, without prior notice or liability, for any reason, including breach of these Terms. Upon termination, your right to use the service will cease immediately.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-black/60 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-8"
            >
              <h2 className="text-2xl font-bold mb-4 text-primary-400">Governing Law</h2>
              <p className="text-gray-300 leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of the jurisdiction where Dripzone is incorporated, without regard to conflict of law provisions.
              </p>
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
              Questions About These{' '}
              <span className="bg-gradient-to-r from-primary-400 to-primary-500 bg-clip-text text-transparent">
                Terms?
              </span>
            </h2>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              If you have any questions about these Terms and Conditions, please contact our legal team.
            </p>
            
            <div className="bg-black/60 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-primary-400 mb-4">Legal Department</h3>
                  <p className="text-gray-300">legal@dripzone.com</p>
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