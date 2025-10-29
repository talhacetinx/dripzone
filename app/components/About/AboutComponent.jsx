"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Music, Users, Award, Globe, Heart, Star, 
  CheckCircle, Target, Zap, Shield
} from 'lucide-react';

export const AboutComponent = () => {
  const stats = [
    { label: 'Yaratıcı Profesyoneller', value: '10,000+', icon: Users },
    { label: 'Tamamlanan Projeler', value: '50,000+', icon: CheckCircle },
    { label: 'Hizmet Verilen Ülkeler', value: '120+', icon: Globe },
    { label: 'Ortalama Puan', value: '4.9/5', icon: Star }
  ];

  const values = [
    {
      icon: Music,
      title: 'Yaratıcı Mükemmellik',
      description: 'Müziğin yaşamları dönüştürme ve kültürler arası insanları birleştirme gücüne inanıyoruz.'
    },
    {
      icon: Users,
      title: 'Topluluk Önceliği',
      description: 'Sanatçıların ve profesyonellerin birlikte gelişebileceği destekleyici bir ekosistem inşa ediyoruz.'
    },
    {
      icon: Shield,
      title: 'Güven ve Güvenlik',
      description: 'Doğrulanmış profesyoneller ve korumalı işlemlerle güvenli, güvenilir bir platform sağlıyoruz.'
    },
    {
      icon: Target,
      title: 'İnovasyon',
      description: 'Müzik endüstrisinin değişen ihtiyaçlarını karşılamak için sürekli gelişiyoruz.'
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
              Hakkımızda{' '}
              <span className="bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 bg-clip-text text-transparent">
                Dripzone
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-12 leading-relaxed">
              Dünyanın en yetenekli müzik profesyonellerini uzmanlıklarına ihtiyaç duyan sanatçılarla buluşturuyoruz
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 border-t border-gray-800/30">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6">
                Misyonumuz{' '}
                <span className="bg-gradient-to-r from-primary-400 to-primary-500 bg-clip-text text-transparent">
                  
                </span>
              </h2>
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                Dripzone, yetenekli sanatçılar ile müzikal vizyonlarını hayata geçirmek için ihtiyaç duydukları sektör profesyonelleri arasındaki boşluğu doldurmak için oluşturuldu. Harika müziğin sınırları olmaması gerektiğine ve her sanatçının dünya standartlarında üretim, tasarım ve promosyon hizmetlerine erişim hakkı olduğuna inanıyoruz.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                <strong className="text-primary-400">Talha Çetin</strong> tarafından kurulan platformumuz, basit bir fikirden dünya çapında binlerce sanatçı ve profesyonel hizmet veren küresel bir pazaryerine dönüştü. Müzik endüstrisinde yaratıcılığı, işbirliğini ve başarıyı teşvik etmeye kararlıyız.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-r from-primary-500/20 to-primary-400/10 backdrop-blur-xl rounded-3xl p-8 border border-primary-500/30">
                <div className="grid grid-cols-2 gap-6">
                  {stats.map((stat, index) => (
                    <div key={stat.label} className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-primary-500/20 to-primary-400/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary-500/20">
                        <stat.icon className="w-8 h-8 text-primary-400" />
                      </div>
                      <div className="text-2xl font-bold text-primary-400 mb-2">{stat.value}</div>
                      <div className="text-sm text-gray-300">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 border-t border-gray-800/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">
              Değerlerimiz{' '}
              <span className="bg-gradient-to-r from-primary-400 to-primary-500 bg-clip-text text-transparent">
                
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Dripzone'da yaptığımız her şeyi yönlendiren ilkeler
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-black/60 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-8 hover:border-primary-500/50 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-primary-500/20 to-primary-400/10 rounded-2xl flex items-center justify-center mb-6 border border-primary-500/20">
                  <value.icon className="w-8 h-8 text-primary-400" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-white">{value.title}</h3>
                <p className="text-gray-300 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-20 border-t border-gray-800/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-8">
              Kurucumuzla{' '}
              <span className="bg-gradient-to-r from-primary-400 to-primary-500 bg-clip-text text-transparent">
                Tanışın
              </span>
            </h2>
            
            <div className="bg-black/60 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-12 hover:border-primary-500/50 transition-all duration-300">
              <div className="w-32 h-32 bg-gradient-to-r from-primary-500 to-primary-400 rounded-full flex items-center justify-center mx-auto mb-8 shadow-yellow-glow">
                <span className="text-4xl font-bold text-black">TC</span>
              </div>
              
              <h3 className="text-3xl font-bold text-white mb-4">Talha Çetin</h3>
              <p className="text-xl text-primary-400 mb-6">Kurucu & CEO</p>
              
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                "Dripzone'u basit bir inançla kurdum: Her sanatçı, konumları veya bütçeleri ne olursa olsun, müzik endüstrisindeki en iyi profesyonellere erişim hakkına sahiptir. Müzik evrensel bir dildir ve platformumuz, geleneksel olarak sanatçıları başarılı olmak için ihtiyaç duydukları kaynaklardan ayıran engelleri kırmaya yardımcı olur."
              </p>
              
              <p className="text-lg text-gray-300 leading-relaxed">
                Hem teknoloji hem de müzik geçmişine sahip olan Talha, müzik endüstrisi hizmetlerine erişimi demokratikleştirirken en yüksek kalite ve profesyonellik standartlarını koruyan bir platform oluşturma fırsatını gördü.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-gray-800/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-6">
              Dripzone{' '}
              <span className="bg-gradient-to-r from-primary-400 to-primary-500 bg-clip-text text-transparent">
                Topluluğuna Katılın
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-12 leading-relaxed">
              İster profesyonel hizmet arayan bir sanatçı olun, ister yeteneklerinizi sergilemeye hazır bir profesyonel olun, Dripzone müzik endüstrisine açılan kapınızdır.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <a
                  href="/register"
                  className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-400 hover:from-primary-600 hover:to-primary-500 text-black font-bold rounded-xl transition-all duration-300 shadow-lg"
                >
                  <span>Bugün Başlayın</span>
                  <Zap className="w-5 h-5" />
                </a>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <a
                  href="/category/producers"
                  className="inline-flex items-center space-x-3 px-8 py-4 border-2 border-primary-500/50 hover:border-primary-500 text-white rounded-xl font-bold transition-all duration-300 backdrop-blur-xl hover:bg-primary-500/10"
                >
                  <span>Hizmetleri Keşfedin</span>
                  <Heart className="w-5 h-5" />
                </a>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};