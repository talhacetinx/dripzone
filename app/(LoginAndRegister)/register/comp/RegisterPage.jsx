"use client"

import { useState } from 'react';
import { Mail, Lock, User, Phone } from 'lucide-react';
import Link from 'next/link';
import { countries } from 'countries-list';
import { toast } from 'react-toastify';

export const RegisterComponents = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    user_name:'',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
    country: '',
    user_type: 'ARTIST', // Default olarak artist
  });

  const initialFormData = {
    firstName: '',
    lastName: '',
    user_name:'',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
    country: '',
    user_type: 'ARTIST',
  };

  const [isLoading, setIsLoading] = useState(false);
  const countryList = Object.values(countries).map(countryData => countryData.name);

  const [search, setSearch] = useState('');
  const [filteredList, setFilteredList] = useState([]);
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };



  const handleCountryChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    
    // FormData'yı da güncelle
    setFormData(prev => ({
      ...prev,
      country: value,
    }));

    const filtered = countryList.filter(country =>
      country.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredList(filtered.slice(0, 100)); // İlk 100 ülke göster
  };

  const handleSelect = (selectedCountry) => {
    setSearch(selectedCountry);
    setFilteredList([]);
    setFormData(prev => ({
      ...prev,
      country: selectedCountry,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // JSON formatında gönder (user_photo artık yok)
      const requestData = { ...formData };

      const request = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CLIENT-KEY": 123123123123123,
          "X-SECRET-KEY": 234234234234234234,
        },
        body: JSON.stringify(requestData),
      });

      const response = await request.json();

      if (response.success) {
        toast.info(response.message);

        // ✅ Formu sıfırla
        setFormData(initialFormData);
        setSearch("");
        setFilteredList([]);
        e.target.reset();
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      toast.error("Sunucu hatası oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-gray-900/50 backdrop-blur-xl border border-primary-500/30 rounded-2xl p-8 shadow-yellow-glow">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center justify-center mb-6">
              <img src="/TpazLayer 2-topaz-enhance-min.png" alt="Dripzone Logo" className="h-12 w-auto" />
            </Link>
            <h1 className="text-3xl font-bold mb-2 text-white">Dripzone'a Katılın</h1>
            <p className="text-gray-300">Sanatçı olarak kayıt olun</p>
          </div>

          <div className="mb-6">
              <label className="block text-sm font-medium mb-3 text-white">Hesap Türü</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, user_type: 'ARTIST' }))}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    formData.user_type === 'ARTIST'
                      ? 'border-primary-500 bg-primary-500/20 shadow-yellow-glow'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">🎵</div>
                    <div className="font-semibold text-white">Sanatçı</div>
                    <div className="text-xs text-gray-400">Hizmet satın al</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, user_type: 'PROVIDER' }))}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    formData.user_type === 'PROVIDER'
                      ? 'border-primary-500 bg-primary-500/20 shadow-yellow-glow'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">🎙️</div>
                    <div className="font-semibold text-white">Hizmet Sağlayıcı</div>
                    <div className="text-xs text-gray-400">Hizmet sat</div>
                  </div>
                </button>
              </div>
            </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1 text-white">Ad</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white"
                    placeholder="Adınız"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-white">Soyad</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white"
                    placeholder="Soyadınız"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-white">Kullanıcı Adı</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  name="user_name"
                  value={formData.user_name}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white"
                  placeholder="Kullanıcı Adı"
                  required
                />
              </div>
            </div>

            {/* Profil Fotoğrafı */}
            {/* Fotoğraf yükleme özelliği profil sayfalarına taşınmıştır */}

            <div>
              <label className="block text-sm font-medium mb-1 text-white">E-posta</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white"
                  placeholder="ornek@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-white">Telefon</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white"
                  placeholder="+90 (555) 123 45 67"
                  required
                />
              </div>
            </div>

            <div className="relative">
                  <label className="block text-sm font-medium mb-1 text-white">Ülke</label>
                  <input
                    type="text"
                    value={search}
                      onChange={handleCountryChange}
                    placeholder="Ülke ara"
                    className="w-full pl-3 pr-3 py-2 bg-gray-800/50 border border-gray-600 rounded-xl text-white"
                  />

                  {filteredList.length > 0 && (
                    <ul className="absolute top-full left-0 w-full bg-white text-black max-h-48 overflow-y-auto mt-1 rounded-md shadow z-50">
                      {filteredList.map((country, i) => (
                        <li
                          key={i}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleSelect(country)}
                        >
                          {country}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-white">Şifre</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white"
                  placeholder="Şifrenizi girin"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-white">Şifre Onayı</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white"
                  placeholder="Şifrenizi onaylayın"
                  required
                />
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleInputChange}
                className="mt-1 w-4 h-4 text-primary-600 bg-gray-700 border-gray-600 rounded"
                required
              />
              <label className="text-sm text-gray-300">
                <Link href="/terms" className="text-primary-400 hover:text-primary-300">Hizmet Şartları</Link>{' '}
                ve{' '}
                <Link href="/privacy" className="text-primary-400 hover:text-primary-300">Gizlilik Politikası</Link>{' '}
                kabul ediyorum
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-primary-500 to-primary-400 text-black font-semibold rounded-xl"
            >
              {isLoading ? 'Hesap oluşturuluyor...' : 'Hesap Oluştur'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-300">
              Zaten hesabınız var mı?{' '}
              <Link href="/login" className="text-primary-400 font-semibold">
                Giriş Yap
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
