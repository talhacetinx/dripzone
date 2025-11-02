"use client";

import { useState, useEffect } from "react";
import { Plus, Minus, Eye, Check, X, Edit, Trash2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

export const ServicesTab = ({ userInfo }) => {
  const [packages, setPackages] = useState([]);
  const [packageForm, setPackageForm] = useState({
    title: "",
    description: "",
    features: [],
    deliveryTime: "",
    price: "",
    isPublic: false,
  });
  const [editingPackageId, setEditingPackageId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [featureInput, setFeatureInput] = useState("");


  useEffect(() => {
    const loadPackages = async () => {
      try {
        const res = await fetch("/api/profile/packages/get", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        
        if (res.ok) {
          const data = await res.json();
          
          if (data.packages && Array.isArray(data.packages)) {
            setPackages(data.packages);
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

  // Komisyon hesaplama
  const COMMISSION_RATE = 0.20; // %20 komisyon
  
  const calculateTotalPrice = (basePrice) => {
    const price = parseFloat(basePrice) || 0;
    return price + (price * COMMISSION_RATE);
  };

  const calculateCommission = (basePrice) => {
    const price = parseFloat(basePrice) || 0;
    return price * COMMISSION_RATE;
  };

  // Paket işlemleri
  const savePackages = async (updatedPackages) => {
    try {
      const res = await fetch("/api/profile/packages/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packages: updatedPackages
        }),
      });
      
      if (res.ok) {
        const data = await res.json();
        setPackages(data.packages || updatedPackages);
        return true;
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || 'Paket kaydedilirken hata oluştu!');
        return false;
      }
    } catch (error) {
      console.error("Paket kaydetme hatası:", error);
      toast.error('Sunucu hatası!');
      return false;
    }
  };

  const addPackage = async () => {
    if (packageForm.title && packageForm.description && packageForm.features.length > 0 && packageForm.deliveryTime && packageForm.price) {
      setIsLoading(true);
      
      const basePrice = parseFloat(packageForm.price);
      const totalPrice = calculateTotalPrice(basePrice);
      
      const newPackage = {
        id: Date.now(),
        title: packageForm.title,
        description: packageForm.description,
        features: packageForm.features,
        deliveryTime: packageForm.deliveryTime,
        basePrice: basePrice, // Provider'ın alacağı fiyat
        price: totalPrice, // Müşterinin ödeyeceği toplam fiyat (komisyon dahil)
        commission: calculateCommission(basePrice), // Komisyon miktarı
        isPublic: packageForm.isPublic, // Paketin görünürlük durumu
      };
      
      const updatedPackages = [...packages, newPackage];
      
      const success = await savePackages(updatedPackages);
      if (success) {
        setPackageForm({ title: '', description: '', features: [], deliveryTime: '', price: '', isPublic: true });
        toast.success('Paket başarıyla eklendi!');
      }
      
      setIsLoading(false);
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
      price: (packageData.basePrice || packageData.price).toString(), // Base price'ı göster
      isPublic: packageData.isPublic ?? true, // Varsayılan olarak true
    });
    setEditingPackageId(packageData.id);
  };

  const updatePackage = async () => {
    if (packageForm.title && packageForm.description && packageForm.features.length > 0 && packageForm.deliveryTime && packageForm.price) {
      setIsLoading(true);
      
      const basePrice = parseFloat(packageForm.price);
      const totalPrice = calculateTotalPrice(basePrice);
      
      const updatedPackage = {
        id: editingPackageId,
        title: packageForm.title,
        description: packageForm.description,
        features: packageForm.features,
        deliveryTime: packageForm.deliveryTime,
        basePrice: basePrice, // Provider'ın alacağı fiyat
        price: totalPrice, // Müşterinin ödeyeceği toplam fiyat (komisyon dahil)
        commission: calculateCommission(basePrice), // Komisyon miktarı
        isPublic: packageForm.isPublic, // Paketin görünürlük durumu
      };
      
      const updatedPackages = packages.map(pkg => pkg.id === editingPackageId ? updatedPackage : pkg);
      
      const success = await savePackages(updatedPackages);
      if (success) {
        setPackageForm({ title: '', description: '', features: [], deliveryTime: '', price: '', isPublic: true });
        setEditingPackageId(null);
        toast.success('Paket başarıyla güncellendi!');
      }
      
      setIsLoading(false);
    } else {
      toast.error('Lütfen tüm alanları doldurun ve en az bir özellik ekleyin!');
    }
  };

  const deletePackage = async (packageId) => {
    setIsLoading(true);
    
    const updatedPackages = packages.filter(pkg => pkg.id !== packageId);
    
    const success = await savePackages(updatedPackages);
    if (success) {
      toast.success('Paket başarıyla silindi!');
    }
    
    setIsLoading(false);
  };

  const cancelEditPackage = () => {
    setPackageForm({ title: '', description: '', features: [], deliveryTime: '', price: '', isPublic: true });
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
                Fiyat (₺) - Sizin Kazancınız
              </label>
              <input
                type="number"
                value={packageForm.price}
                onChange={(e) => setPackageForm(prev => ({ ...prev, price: e.target.value }))}
                className="w-full py-3 px-4 bg-gray-900/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
                placeholder="Örn: 5000"
              />
              {packageForm.price && (
                <div className="mt-2 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <div className="text-sm text-yellow-400 space-y-1">
                    <div className="flex justify-between">
                      <span>Sizin kazancınız:</span>
                      <span className="font-semibold">₺{parseFloat(packageForm.price || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Platform komisyonu (%20):</span>
                      <span className="font-semibold">₺{calculateCommission(packageForm.price).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-t border-yellow-500/30 pt-1">
                      <span className="font-bold">Müşteri ödeyecek toplam:</span>
                      <span className="font-bold text-yellow-300">₺{calculateTotalPrice(packageForm.price).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Görünürlük Ayarı */}


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
                        <div className="col-span-2">
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 mb-4 transition-all duration-300 hover:border-primary-500/50">
                <label className="flex items-start gap-4 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={packageForm.isPublic}
                      onChange={(e) => setPackageForm(prev => ({ ...prev, isPublic: e.target.checked }))}
                      className="peer sr-only"
                    />
                    <div className="w-10 h-6 bg-gray-700 rounded-full transition-colors duration-300 
                                  peer-checked:bg-primary-600 peer-focus:ring-2 peer-focus:ring-primary-500/50">
                    </div>
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 
                                  peer-checked:translate-x-4 peer-checked:bg-white">
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-white group-hover:text-primary-400 transition-colors">
                        Paket Görünürlüğü
                      </span>
                      {packageForm.isPublic ? (
                        <span className="px-2 py-0.5 text-xs font-medium bg-green-500/20 text-green-400 rounded-full border border-green-500/30">
                          Herkese Açık
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-xs font-medium bg-gray-700/50 text-gray-400 rounded-full border border-gray-600">
                          Gizli
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400">
                      {packageForm.isPublic 
                        ? 'Bu paket herkese açık olacak ve müşteriler sipariş verebilecek.'
                        : 'Bu paket gizli kalacak ve sadece siz görebileceksiniz.'}
                    </p>
                  </div>
                </label>
              </div>
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
                    {/* Sol Taraf - Başlık ve Açıklama */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h5 className="text-xl font-bold text-white">{pkg.title}</h5>
                        {pkg.isPublic ? (
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-900/50 text-green-400 border border-green-900">
                            <Eye size={12} className="mr-1" />
                            Herkese Açık
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-900/50 text-gray-400 border border-gray-700">
                            <Eye size={12} className="mr-1" />
                            Gizli
                          </span>
                        )}
                      </div>
                      <p className="text-gray-300 text-sm mb-3">{pkg.description}</p>
                    </div>
                    
                    {/* Sağ Taraf - Düzenle/Sil Butonları */}
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
                    <div>
                      <span className="text-xs text-gray-400 uppercase tracking-wide">Fiyat</span>
                      <div className="space-y-1">
                        <p className="text-lg font-semibold text-green-400">₺{calculateTotalPrice(pkg.basePrice || pkg.price)}</p>
                        <div className="text-xs text-gray-400">
                          <div>Kazancınız: ₺{pkg.basePrice || pkg.price}</div>
                          <div>Komisyon: ₺{calculateCommission(pkg.basePrice || pkg.price)}</div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 uppercase tracking-wide">Teslim Süresi</span>
                      <p className="text-white">{pkg.deliveryTime}</p>
                    </div>
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
