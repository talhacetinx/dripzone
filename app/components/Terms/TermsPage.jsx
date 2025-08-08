"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Users, CreditCard, Shield, AlertTriangle, Scale } from 'lucide-react';

export const TermsComponent = () => {
  const sections = [
    {
      icon: Users,
      title: 'Kullanıcı Hesapları ve Kayıt',
      content: [
        'Hizmetlerimizi kullanmak için en az 18 yaşında olmalısınız',
        'Kayıt sırasında doğru ve eksiksiz bilgi sağlayın',
        'Hesap bilgilerinizin güvenliğini koruyun',
        'Hesabınız altındaki tüm faaliyetlerden sorumlusunuz',
        'Kişi veya işletme başına bir hesap',
        'İhlaller için hesapları askıya alma veya sonlandırma hakkını saklı tutarız'
      ]
    },
    {
      icon: FileText,
      title: 'Platform Hizmetleri',
      content: [
        'Dripzone, sanatçıları hizmet sağlayıcılarla buluşturan bir pazaryeri sağlar',
        'İşlemleri kolaylaştırırız ancak hizmet anlaşmalarına taraf değiliz',
        'Hizmet kalitesi ve teslimatı sağlayıcıların sorumluluğundadır',
        'Belirli hizmetlerin mevcudiyetini garanti etmeyiz',
        'Platform özellikleri önceden haber verilmeden güncellenebilir veya değiştirilebilir',
        'Herhangi birine hizmet vermeyi reddetme hakkını saklı tutarız'
      ]
    },
    {
      icon: CreditCard,
      title: 'Ödemeler ve Ücretler',
      content: [
        'Tüm işlemlere %20 platform ücreti uygulanır',
        'Hizmet sağlayıcıları işlem tutarının %80\'ini alır',
        'Ödeme işleme ücretleri uygulanabilir',
        'İadeler iade politikamıza tabidir',
        'Anlaşmazlıklar 30 gün içinde bildirilmelidir',
        'Güvenlik nedenleriyle ödemeleri tutma hakkını saklı tutarız'
      ]
    },
    {
      icon: Shield,
      title: 'Kullanıcı Davranışı',
      content: [
        'Platformu yalnızca yasal amaçlar için kullanın',
        'İzin olmadan telif hakkı korumalı materyal yüklemeyin',
        'Başkalarının fikri mülkiyet haklarına saygı gösterin',
        'Taciz, ayrımcılık veya kötüye kullanım davranışı yoktur',
        'Platform ücretlerini aşmaya çalışmayın',
        'İhlalleri destek ekibimize bildirin'
      ]
    },
    {
      icon: AlertTriangle,
      title: 'Yasaklı Faaliyetler',
      content: [
        'Dolandırıcı veya aldatıcı uygulamalar',
        'Spam, istenmeyen iletişim veya pazarlama',
        'Hacking, veri madenciliği veya yetkisiz erişim girişimleri',
        'Zararlı yazılım veya virüs yükleme',
        'Diğer kullanıcıları veya kuruluşları taklit etme',
        'Geçerli yasaları ihlal eden herhangi bir faaliyet'
      ]
    },
    {
      icon: Scale,
      title: 'Sorumluluk ve Sorumluluk Reddi',
      content: [
        'Hizmetler "olduğu gibi" garanti olmaksızın sağlanır',
        'Hizmet sağlayıcı performansından sorumlu değiliz',
        'Kullanıcılar platformu kullanmanın tüm risklerini üstlenir',
        'Sorumluluğumuz ödenen ücretlerin miktarıyla sınırlıdır',
        'Kesintisiz hizmet mevcudiyetini garanti etmeyiz',
        'Mücbir sebepler hizmet teslimatını etkileyebilir'
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
              Şartlar ve{' '}
              <span className="bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 bg-clip-text text-transparent">
                Koşullar
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed">
              Platform hizmetlerimizi kullanmadan önce lütfen bu şartları dikkatlice okuyun.
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
              <h2 className="text-2xl font-bold mb-4 text-primary-400">Şartlara Anlaşma</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Bu Şartlar ve Koşullar ("Şartlar"), Dripzone platformu ve hizmetlerinin kullanımını yönetir. Hizmetlerimize erişerek veya kullanarak bu Şartlara bağlı kalmayı kabul edersiniz.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                Bu şartların herhangi bir kısmına katılmıyorsanız, hizmete erişemezsiniz. Bu Şartlar, hizmete erişen veya kullanan tüm ziyaretçiler, kullanıcılar ve diğer kişiler için geçerlidir.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Bu Şartları herhangi bir zamanda güncelleme hakkını saklı tutarız. Değişiklikler yayınlandıktan hemen sonra yürürlüğe girer. Hizmeti kullanmaya devam etmeniz, güncellenmiş Şartları kabul ettiğiniz anlamına gelir.
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
              <h2 className="text-2xl font-bold mb-4 text-primary-400">Fikri Mülkiyet</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Dripzone platformu, tasarımı, özellikleri ve içeriği dahil olmak üzere telif hakkı, ticari marka ve diğer fikri mülkiyet yasalarıyla korunmaktadır. Kullanıcılar orijinal içeriklerinin sahipliğini korur ancak platform operasyonları için kullanmamıza lisans verir.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-black/60 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-8 mb-8"
            >
              <h2 className="text-2xl font-bold mb-4 text-primary-400">Fesih</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Bu Şartların ihlali dahil olmak üzere herhangi bir nedenle, önceden haber vermeden veya sorumluluk olmadan hesabınızı hemen feshedebilir veya askıya alabiliriz. Fesih üzerine, hizmeti kullanma hakkınız hemen sona erer.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-black/60 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-8"
            >
              <h2 className="text-2xl font-bold mb-4 text-primary-400">Uygulanacak Hukuk</h2>
              <p className="text-gray-300 leading-relaxed">
                Bu Şartlar, Dripzone\'un kurulduğu yargı bölgesinin yasalarına göre yönetilir ve yorumlanır, çakışan hukuk hükümlerine bakılmaksızın.
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
              Bu Şartlar Hakkında{' '}
              <span className="bg-gradient-to-r from-primary-400 to-primary-500 bg-clip-text text-transparent">
                Sorularınız mı Var?
              </span>
            </h2>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              Bu Şartlar ve Koşullar hakkında herhangi bir sorunuz varsa, lütfen hukuk ekibimizle iletişime geçin.
            </p>
            
            <div className="bg-black/60 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-primary-400 mb-4">Hukuk Departmanı</h3>
                  <p className="text-gray-300">legal@dripzone.com</p>
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