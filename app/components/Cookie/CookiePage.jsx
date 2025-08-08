"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { Cookie, Settings, BarChart3, Shield, Eye, Globe } from 'lucide-react';

export const CookieComponent = () => {
  const cookieTypes = [
    {
      icon: Shield,
      title: 'Temel Çerezler',
      description: 'Temel web sitesi işlevselliği için gerekli',
      examples: ['Kimlik doğrulama', 'Güvenlik', 'Form gönderimleri', 'Alışveriş sepeti'],
      canDisable: false
    },
    {
      icon: BarChart3,
      title: 'Analitik Çerezler',
      description: 'Ziyaretçilerin web sitemizi nasıl kullandığını anlamamıza yardımcı olur',
      examples: ['Sayfa görüntülemeleri', 'Kullanıcı davranışı', 'Performans metrikleri', 'Hata takibi'],
      canDisable: true
    },
    {
      icon: Settings,
      title: 'İşlevsel Çerezler',
      description: 'Tercihlerinizi ve ayarlarınızı hatırlar',
      examples: ['Dil tercihleri', 'Tema ayarları', 'Konum verileri', 'Kaydedilen aramalar'],
      canDisable: true
    },
    {
      icon: Eye,
      title: 'Pazarlama Çerezleri',
      description: 'İlgili reklamları sunmak için kullanılır',
      examples: ['Reklam hedefleme', 'Kampanya takibi', 'Sosyal medya entegrasyonu', 'Yeniden hedefleme'],
      canDisable: true
    }
  ];

  const thirdPartyServices = [
    {
      name: 'Google Analytics',
      purpose: 'Web sitesi analitiği ve performans takibi',
      dataCollected: 'Sayfa görüntülemeleri, kullanıcı etkileşimleri, cihaz bilgileri',
      retention: '26 ay'
    },
    {
      name: 'Stripe',
      purpose: 'Ödeme işleme ve dolandırıcılık önleme',
      dataCollected: 'Ödeme bilgileri, işlem verileri',
      retention: '7 yıl'
    },
    {
      name: 'Intercom',
      purpose: 'Müşteri desteği ve iletişim',
      dataCollected: 'Mesajlar, kullanıcı davranışı, iletişim bilgileri',
      retention: '3 yıl'
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
              Çerez{' '}
              <span className="bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 bg-clip-text text-transparent">
                Politikası
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed">
              Dripzone\'daki deneyiminizi iyileştirmek için çerezleri ve benzer teknolojileri nasıl kullandığımızı öğrenin.
            </p>
            <p className="text-sm text-gray-400">
              Son güncelleme: 1 Ocak 2025
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
                <h2 className="text-2xl font-bold text-primary-400">Çerezler Nedir?</h2>
              </div>
              <p className="text-gray-300 leading-relaxed mb-4">
                Çerezler, web sitemizi ziyaret ettiğinizde cihazınızda saklanan küçük metin dosyalarıdır. Tercihlerinizi hatırlayarak, giriş yapmış kalmanızı sağlayarak ve platformumuzu nasıl kullandığınızı anlayarak size daha iyi bir deneyim sunmamıza yardımcı olurlar.
              </p>
              <p className="text-gray-300 leading-relaxed">
                İşlevselliği artırmak, kullanımı analiz etmek ve kişiselleştirilmiş içerik sağlamak için hem birinci taraf çerezleri (Dripzone tarafından ayarlanan) hem de üçüncü taraf çerezleri (ortaklarımız tarafından ayarlanan) kullanıyoruz.
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
                Kullandığımız{' '}
                <span className="bg-gradient-to-r from-primary-400 to-primary-500 bg-clip-text text-transparent">
                  Çerez Türleri
                </span>
              </h2>
              <p className="text-lg text-gray-300">
                Platformumuzda çeşitli amaçlar için farklı türde çerezler kullanıyoruz.
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
                        {type.canDisable ? 'Devre dışı bırakılabilir' : 'Her zaman aktif'}
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 leading-relaxed mb-4">{type.description}</p>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-primary-400 mb-2">Örnekler:</h4>
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
                Üçüncü Taraf{' '}
                <span className="bg-gradient-to-r from-primary-400 to-primary-500 bg-clip-text text-transparent">
                  Hizmetler
                </span>
              </h2>
              <p className="text-lg text-gray-300">
                Web sitemizde çerez ayarlayabilen güvenilir ortaklarla çalışıyoruz.
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
                      <h4 className="text-sm font-semibold text-white mb-1">Amaç</h4>
                      <p className="text-sm text-gray-300">{service.purpose}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-1">Toplanan Veriler</h4>
                      <p className="text-sm text-gray-300">{service.dataCollected}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-1">Saklama</h4>
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
                <h2 className="text-2xl font-bold text-primary-400">Çerez Tercihlerinizi Yönetme</h2>
              </div>
              
              <div className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  Web sitemizdeki çerezleri yönetmek için birkaç seçeneğiniz var:
                </p>
                
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">Temel olmayan çerezleri kabul etmek veya reddetmek için çerez onay banner\'ımızı kullanın</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">Çerezleri engellemek veya silmek için tarayıcı ayarlarınızı ayarlayın</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">Google Analytics opt-out ile analitik takibinden çıkın</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">Belirli çerez yönetimi yardımı için bizimle iletişime geçin</span>
                  </li>
                </ul>
                
                <div className="mt-6 p-4 bg-primary-500/10 border border-primary-500/20 rounded-lg">
                  <p className="text-sm text-primary-200">
                    <strong>Not:</strong> Belirli çerezleri devre dışı bırakmak web sitemizin işlevselliğini ve kullanıcı deneyiminizi etkileyebilir.
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
              Çerezler Hakkında{' '}
              <span className="bg-gradient-to-r from-primary-400 to-primary-500 bg-clip-text text-transparent">
                Sorularınız mı Var?
              </span>
            </h2>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              Çerez kullanımımız hakkında herhangi bir sorunuz varsa, lütfen bizimle iletişime geçmekten çekinmeyin.
            </p>
            
            <div className="bg-black/60 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-primary-400 mb-4">Gizlilik Ekibi</h3>
                  <p className="text-gray-300">privacy@dripzone.com</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-primary-400 mb-4">Genel Destek</h3>
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