"use client";

import { useState, useEffect } from "react";
import { Plus, Minus, Eye, Check, X, Edit, Trash2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

export const ServicesProviderTab = ({ userInfo }) => {
  // Paket yönetimi
  const [packages, setPackages] = useState([]);
  const [packageForm, setPackageForm] = useState({
    title: "",
    description: "",
    features: [],
    deliveryTime: "",
    price: "",
  });
  const [editingPackageId, setEditingPackageId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Özellik ekleme için
  const [featureInput, setFeatureInput] = useState("");

  // Fiyat hesaplama fonksiyonları
  const calculateCommission = (basePrice) => {
    const price = parseFloat(basePrice) || 0;
    return Math.round(price * 0.20);
  };

  const calculateTotalPrice = (basePrice) => {
    const price = parseFloat(basePrice) || 0;
    const commission = calculateCommission(price);
    return Math.round(price + commission);
  };
  useEffect(() => {
    const loadPackages = async () => {
      try {
        const res = await fetch("/api/profile/get", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        
        if (res.ok) {
          const data = await res.json();
          
          if (data.profile && data.profile.packages && Array.isArray(data.profile.packages)) {
            setPackages(data.profile.packages);
          }
        }
      } catch (error) {
        console.error("Paketler yüklenirken hata:", error);
        toast.error("Paket verileri yüklenemedi");
      }
    };

    if (userInfo?.role === "PROVIDER") {
      loadPackages();
    }
  }, [userInfo]);

  // Özellik işlemleri
  const addFeature = () => {
    if (featureInput.trim() !== "") {
      setPackageForm(prev => ({
        ...prev,
        features: [...prev.features, featureInput.trim()]
      }));
      setFeatureInput("");
    }
  };

  const removeFeature = (index) => {
    setPackageForm(prev => ({
      ...prev,
      features: prev.features.filter((_, idx) => idx !== index)
    }));
  };

  const featureKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addFeature();
    }
  };

  // Paket işlemleri
  const addPackage = async () => {
    if (packageForm.title && packageForm.description && packageForm.features.length > 0 && packageForm.deliveryTime && packageForm.price) {
      setIsLoading(true);
      
      const newPackage = {
        id: Date.now(),
        title: packageForm.title,
        description: packageForm.description,
        features: packageForm.features,
        deliveryTime: packageForm.deliveryTime,
        price: parseFloat(packageForm.price)
      };
      
      const updatedPackages = [...packages, newPackage];
      
      try {
        const res = await fetch("/api/profile/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            provider_packages: updatedPackages,
            userInfo
          }),
        });
        
        if (res.ok) {
          setPackages(updatedPackages);
          setPackageForm({ title: '', description: '', features: [], deliveryTime: '', price: '' });
          toast.success('Paket başarıyla eklendi!');
        } else {
          toast.error('Paket eklenirken hata oluştu!');
        }
      } catch (error) {
        toast.error('Sunucu hatası!');
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error('Lütfen tüm alanları doldurun ve en az bir özellik ekleyin!');
    }
  };

  const editPackage = (packageData) => {
    setPackageForm({
      title: packageData.title,
      description: packageData.description,
      features: [...packageData.features],
      deliveryTime: packageData.deliveryTime,
      price: packageData.price.toString()
    });
    setEditingPackageId(packageData.id);
  };

  const updatePackage = async () => {
    if (packageForm.title && packageForm.description && packageForm.features.length > 0 && packageForm.deliveryTime && packageForm.price) {
      setIsLoading(true);
      
      const updatedPackage = {
        id: editingPackageId,
        title: packageForm.title,
        description: packageForm.description,
        features: packageForm.features,
        deliveryTime: packageForm.deliveryTime,
        price: parseFloat(packageForm.price)
      };
      
      const updatedPackages = packages.map(pkg => pkg.id === editingPackageId ? updatedPackage : pkg);
      
      try {
        const res = await fetch("/api/profile/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            provider_packages: updatedPackages,
            userInfo
          }),
        });
        
        if (res.ok) {
          setPackages(updatedPackages);
          setPackageForm({ title: '', description: '', features: [], deliveryTime: '', price: '' });
          setEditingPackageId(null);
          toast.success('Paket başarıyla güncellendi!');
        } else {
          toast.error('Paket güncellenirken hata oluştu!');
        }
      } catch (error) {
        toast.error('Sunucu hatası!');
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error('Lütfen tüm alanları doldurun ve en az bir özellik ekleyin!');
    }
  };

  const deletePackage = async (packageId) => {
    setIsLoading(true);
    
    const updatedPackages = packages.filter(pkg => pkg.id !== packageId);
    
    try {
      const res = await fetch("/api/profile/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider_packages: updatedPackages,
          userInfo
        }),
      });
      
      if (res.ok) {
        setPackages(updatedPackages);
        toast.success('Paket başarıyla silindi!');
      } else {
        toast.error('Paket silinirken hata oluştu!');
      }
    } catch (error) {
      toast.error('Sunucu hatası!');
    } finally {
      setIsLoading(false);
    }
  };

  const cancelEditPackage = () => {
    setPackageForm({ title: '', description: '', features: [], deliveryTime: '', price: '' });
    setEditingPackageId(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">Hizmet Paketleriniz</h2>
        <p className="text-gray-400">Müşterilerinize sunacağınız hizmet paketlerini oluşturun ve yönetin</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sol Taraf - Yeni Paket Ekleme */}
        <div className="bg-gray-800/50 border border-gray-600 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">
            {editingPackageId ? 'Paket Düzenle' : 'Yeni Paket Ekle'}
          </h3>
          
          {/* Paket Başlığı */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Paket Başlığı
            </label>
            <input
              type="text"
              value={packageForm.title}
              onChange={(e) => setPackageForm(prev => ({ ...prev, title: e.target.value }))}
              className="w-full py-3 px-4 bg-gray-900/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
              placeholder="Örn: Temel Prodüksiyon Paketi"
            />
          </div>

          {/* Açıklama */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Paket Açıklaması
            </label>
            <textarea
              value={packageForm.description}
              onChange={(e) => setPackageForm(prev => ({ ...prev, description: e.target.value }))}
              className="w-full h-24 py-3 px-4 bg-gray-900/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white resize-none"
              placeholder="Paketin detaylı açıklaması..."
            />
          </div>

          {/* Fiyat ve Teslim Süresi */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Sizin Alacağınız Fiyat (₺)
              </label>
              <input
                type="number"
                value={packageForm.price}
                onChange={(e) => {
                  const value = e.target.value;
                  setPackageForm(prev => ({ ...prev, price: value }));
                }}
                className="w-full py-3 px-4 bg-gray-900/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
                placeholder="Örn: 5000"
                min="0"
                step="1"
              />
              
              {/* Komisyon ve Toplam Gösterimi */}
              {packageForm.price && parseFloat(packageForm.price) > 0 && (
                <div className="mt-3 p-3 bg-gray-800/50 rounded-lg border border-gray-600 space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Sizin Kazancınız:</span>
                    <span className="text-green-400 font-semibold">
                      ₺{parseFloat(packageForm.price).toLocaleString('tr-TR')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Platform Komisyonu (%20):</span>
                    <span className="text-orange-400 font-semibold">
                      ₺{calculateCommission(packageForm.price).toLocaleString('tr-TR')}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-gray-600">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-semibold">Müşterinin Ödeyeceği:</span>
                      <span className="text-primary-400 font-bold text-lg">
                        ₺{calculateTotalPrice(packageForm.price).toLocaleString('tr-TR')}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Teslim Süresi
              </label>
              <input
                type="text"
                value={packageForm.deliveryTime}
                onChange={(e) => setPackageForm(prev => ({ ...prev, deliveryTime: e.target.value }))}
                className="w-full py-3 px-4 bg-gray-900/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
                placeholder="Örn: 7 gün"
              />
            </div>
          </div>

          {/* Özellikler */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Paket Özellikleri
            </label>
            
            {/* Özellik Ekleme Input'u */}
            <div className="flex bg-gray-900/50 border border-gray-600 rounded-lg mb-3">
              <input
                type="text"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={featureKeyDown}
                className="w-full py-3 px-4 bg-transparent outline-none text-white"
                placeholder="Bir özellik girin ve Enter'a basın"
              />
              <button
                onClick={addFeature}
                type="button"
                className="px-4 py-2 bg-primary-600 text-white rounded-tr-lg rounded-br-lg hover:bg-primary-700 transition"
              >
                <Plus size={20} />
              </button>
            </div>

            {/* Eklenen Özellikler */}
            {packageForm.features.length > 0 && (
              <div className="space-y-2">
                {packageForm.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-900/50 rounded-lg py-2 px-3"
                  >
                    <div className="flex items-center gap-2">
                      <Check size={14} className="text-green-400" />
                      <span className="text-white">{feature}</span>
                    </div>
                    <button
                      onClick={() => removeFeature(index)}
                      type="button"
                      className="p-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                      <Minus size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Butonlar */}
          <div className="flex gap-3">
            {editingPackageId ? (
              <>
                <button
                  type="button"
                  onClick={updatePackage}
                  disabled={isLoading}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                  {isLoading ? 'Güncelleniyor...' : 'Güncelle'}
                </button>
                <button
                  type="button"
                  onClick={cancelEditPackage}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition flex items-center gap-2"
                >
                  <X size={18} />
                  İptal
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={addPackage}
                disabled={isLoading}
                className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                {isLoading ? 'Ekleniyor...' : 'Paket Ekle'}
              </button>
            )}
          </div>
        </div>

        {/* Sağ Taraf - Mevcut Paketler */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white">Mevcut Paketleriniz ({packages.length})</h3>
          
          {packages.length === 0 ? (
            <div className="bg-gray-800/30 border border-gray-600 rounded-xl p-8 text-center">
              <div className="text-gray-400 mb-4">
                <Plus size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg">Henüz paket eklememişsiniz</p>
                <p className="text-sm">Sol taraftaki formu kullanarak ilk paketinizi oluşturun</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {packages.map((pkg) => (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-900/50 border border-gray-600 rounded-xl p-6 hover:border-primary-500/50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h5 className="text-xl font-bold text-white mb-2">{pkg.title}</h5>
                      <p className="text-gray-300 text-sm mb-3">{pkg.description}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        type="button"
                        onClick={() => editPackage(pkg)}
                        className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        title="Düzenle"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => deletePackage(pkg.id)}
                        className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                        title="Sil"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                      <span className="text-xs text-gray-400 uppercase tracking-wide block mb-1">Sizin Kazancınız</span>
                      <p className="text-lg font-semibold text-green-400">₺{pkg.price.toLocaleString('tr-TR')}</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                      <span className="text-xs text-gray-400 uppercase tracking-wide block mb-1">Müşteri Ödemesi</span>
                      <p className="text-lg font-semibold text-primary-400">₺{calculateTotalPrice(pkg.price).toLocaleString('tr-TR')}</p>
                      <span className="text-xs text-gray-500">(%20 komisyon dahil)</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <span className="text-xs text-gray-400 uppercase tracking-wide">Teslim Süresi</span>
                    <p className="text-white">{pkg.deliveryTime}</p>
                  </div>

                  <div>
                    <span className="text-xs text-gray-400 uppercase tracking-wide mb-2 block">Paket Özellikleri</span>
                    <div className="space-y-1">
                      {pkg.features.map((feature, index) => (
                        <div key={index} className="text-gray-300 flex items-center gap-2 text-sm">
                          <Check size={12} className="text-green-400 flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
