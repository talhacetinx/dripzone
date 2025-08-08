"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Eye, Lock, Users, Database, Globe } from 'lucide-react';

export const PrivacyComponent = () => {
  const sections = [
    {
      icon: Database,
      title: 'Topladığımız Bilgiler',
      content: [
        'Hesap oluştururken sağladığınız kişisel bilgiler (ad, e-posta, telefon numarası)',
        'Biyografi, konum ve profesyonel detayları içeren profil bilgileri',
        'Ödeme ortaklarımız aracılığıyla güvenli şekilde işlenen ödeme bilgileri',
        'Platformumuz üzerinden gönderilen mesajlardan iletişim verileri',
        'Hizmetlerimizle nasıl etkileşim kurduğunuzu içeren kullanım verileri',
        'IP adresi, tarayıcı türü ve işletim sistemi gibi cihaz bilgileri'
      ]
    },
    {
      icon: Eye,
      title: 'Bilgilerinizi Nasıl Kullanıyoruz',
      content: [
        'Pazaryeri hizmetlerimizi sağlamak ve sürdürmek için',
        'İşlemleri işlemek ve ödemeleri kolaylaştırmak için',
        'Hesabınız ve hizmetler hakkında sizinle iletişim kurmak için',
        'Platformumuzu iyileştirmek ve yeni özellikler geliştirmek için',
        'Platform güvenliğini sağlamak ve dolandırıcılığı önlemek için',
        'Yasal yükümlülüklere uymak ve anlaşmazlıkları çözmek için'
      ]
    },
    {
      icon: Users,
      title: 'Bilgi Paylaşımı',
      content: [
        'Kişisel bilgilerinizi üçüncü taraflara satmıyoruz',
        'Hizmet sağlayıcıları projeleri tamamlamak için ilgili bilgileri görebilir',
        'Ödeme işlemcileri gerekli işlem bilgilerini alır',
        'Yasal olarak gerekli olduğunda kolluk kuvvetleriyle veri paylaşabiliriz',
        'Anonim, toplanmış veriler analitik için kullanılabilir',
        'İş transferleri uygun bildirimle kullanıcı verilerini içerebilir'
      ]
    },
    {
      icon: Lock,
      title: 'Veri Güvenliği',
      content: [
        'Veri iletimi ve depolama için endüstri standardı şifreleme',
        'Düzenli güvenlik denetimleri ve güvenlik açığı değerlendirmeleri',
        'Sertifikalı ortaklar aracılığıyla güvenli ödeme işleme',
        'Bilgilerinizi kimlerin görebileceğini sınırlayan erişim kontrolleri',
        'Veri kaybını önlemek için düzenli yedeklemeler',
        'Güvenlik ihlalleri için olay müdahale prosedürleri'
      ]
    },
    {
      icon: Shield,
      title: 'Haklarınız',
      content: [
        'Kişisel bilgilerinize erişim ve inceleme',
        'Yanlış verilerin düzeltilmesini talep etme',
        'Hesabınızı ve ilişkili verileri silme',
        'Verilerinizi taşınabilir formatta dışa aktırma',
        'Pazarlama iletişimlerinden çıkma',
        'Veri koruma yetkililerine şikayet başvurusu'
      ]
    },
    {
      icon: Globe,
      title: 'Uluslararası Transferler',
      content: [
        'Veriler ikamet ettiğiniz ülke dışındaki ülkelerde işlenebilir',
        'Yasal mekanizmalar aracılığıyla yeterli koruma sağlıyoruz',
        'AB kullanıcıları GDPR korumalarından yararlanır',
        'Geçerli uluslararası veri transfer yasalarına uyuyoruz',
        'Sınır ötesi veri transferleri için güvenlik önlemleri mevcuttur'
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
              Gizlilik{' '}
              <span className="bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 bg-clip-text text-transparent">
                Politikası
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed">
              Gizliliğiniz bizim için önemlidir. Bu politika, bilgilerinizi nasıl topladığımızı, kullandığımızı ve koruduğumuzu açıklar.
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
              <h2 className="text-2xl font-bold mb-4 text-primary-400">Giriş</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Dripzone ("biz," "bizim," veya "biz") gizliliğinizi korumaya kararlıdır. Bu Gizlilik Politikası, müzik pazaryeri platformumuzu kullandığınızda bilgilerinizi nasıl topladığımızı, kullandığımızı, açıkladığımızı ve koruduğumuzu açıklar.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Hizmetlerimizi kullanarak, bu politika uyarınca bilgilerin toplanması ve kullanılmasını kabul edersiniz. Bilgilerinizi bu Gizlilik Politikasında açıklandığı şekilde kullanmayacağız veya kimseyle paylaşmayacağız.
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
              Gizliliğiniz Hakkında{' '}
              <span className="bg-gradient-to-r from-primary-400 to-primary-500 bg-clip-text text-transparent">
                Sorularınız mı Var?
              </span>
            </h2>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              Bu Gizlilik Politikası veya veri uygulamalarımız hakkında herhangi bir sorunuz varsa, lütfen bizimle iletişime geçin.
            </p>
            
            <div className="bg-black/60 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-primary-400 mb-4">Bize E-posta Gönderin</h3>
                  <p className="text-gray-300">privacy@dripzone.com</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-primary-400 mb-4">Veri Koruma Görevlisi</h3>
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