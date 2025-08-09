"use client";

import { useState, useEffect } from "react";
import { Upload, Plus, Minus, Eye, ExternalLink, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

export const ProfileProviderTab = ({ userInfo }) => {
  const [fileName, setFileName] = useState("Resminizi Yükleyiniz");
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({ photo: null });
  const [isLoading, setIsLoading] = useState(false); 

  const [backgroundFileName, setBackgroundFileName] = useState("Arkaplan Fotoğrafınızı Yükleyiniz");
  const [backgroundPreview, setBackgroundPreview] = useState(null);
  const [backgroundFormData, setBackgroundFormData] = useState({ backgroundPhoto: null });

  const [inputValue, setInputValue] = useState("");
  const [experiences, setExperiences] = useState([]);
  const [showExperienceDetail, setShowExperienceDetail] = useState(true);

  // Hizmetler
  const [serviceValue, setServiceValue] = useState("");
  const [services, setServices] = useState([]);
  const [showServices, setShowServices] = useState(true);

  // Önemli Müşteriler - Basit state
  const [importantClients, setImportantClients] = useState([]);
  const [importantClientValue, setImportantClientValue] = useState("");
  const [showImportantClients, setShowImportantClients] = useState(true);

  // Opsiyonel: türler
  const [selectedGenres, setSelectedGenres] = useState([]);

  const [studioImages, setStudioImages] = useState([
    { file: null, preview: null, name: "1. Stüdyo Fotoğrafınızı Yükleyiniz" },
  ]);

  // Form için state
  const [formData2, setFormData2] = useState({
    provider_about: "",
    provider_experience: "",
    provider_project_count: "",
    provider_response_time: "",
    provider_studio_name: "",
  });

  const genres = ["Rock", "Pop", "Jazz", "Rap"];

  // Profil verilerini yükle
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await fetch("/api/profile/get", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        
        if (res.ok) {
          const data = await res.json();
          
          if (data.profile) {
            const profile = data.profile;
            
            // Form verilerini doldur
            setFormData2({
              provider_about: profile.about || "",
              provider_experience: profile.experience || "",
              provider_project_count: profile.projectCount || "",
              provider_response_time: profile.responseTime || "",
              provider_studio_name: profile.studioName || "",
            });

            // Avatar
            if (profile.avatarUrl) {
              setPreview(profile.avatarUrl);
              setFileName("Mevcut profil fotoğrafı");
            }

            // Background image
            if (profile.backgroundUrl) {
              setBackgroundPreview(profile.backgroundUrl);
              setBackgroundFileName("Mevcut arkaplan fotoğrafı");
            }

            // Stüdyo fotoğrafları
            if (profile.studioPhotos && profile.studioPhotos.length > 0) {
              const loadedStudioImages = profile.studioPhotos.map((url, index) => ({
                file: null,
                preview: url,
                name: `Mevcut stüdyo fotoğrafı ${index + 1}`,
              }));
              
              while (loadedStudioImages.length < 3) {
                loadedStudioImages.push({
                  file: null,
                  preview: null,
                  name: `${loadedStudioImages.length + 1}. Stüdyo Fotoğrafınızı Yükleyiniz`,
                });
              }
              
              setStudioImages(loadedStudioImages);
            }

            // Uzmanlıklar
            if (profile.specialties) {
              setExperiences(profile.specialties);
            }

            // Hizmetler
            if (profile.services) {
              setServices(profile.services);
            }

            // Önemli müşteriler
            if (profile.importantClients && Array.isArray(profile.importantClients)) {
              console.log("📥 API'den önemli müşteriler yükleniyor:", profile.importantClients);
              setImportantClients(profile.importantClients);
            } else {
              console.log("⚠️ Önemli müşteriler verisi bulunamadı veya array değil:", profile.importantClients);
            }

            // Türler
            if (profile.genres) {
              setSelectedGenres(profile.genres);
            }
          }
        }
      } catch (error) {
        console.error("Profil yüklenirken hata:", error);
        toast.error("Profil verileri yüklenemedi");
      }
    };

    if (userInfo?.role === "PROVIDER") {
      loadProfile();
    }
  }, [userInfo]);

  const handlePhotoChange = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      setFileName(file.name);
      setFormData((p) => ({ ...p, photo: file }));
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setFileName("Resminizi Yükleyiniz");
      setPreview(null);
      setFormData((p) => ({ ...p, photo: null }));
    }
  };

  const handleBackgroundPhotoChange = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      setBackgroundFileName(file.name);
      setBackgroundFormData((p) => ({ ...p, backgroundPhoto: file }));
      const reader = new FileReader();
      reader.onloadend = () => setBackgroundPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setBackgroundFileName("Arkaplan Fotoğrafınızı Yükleyiniz");
      setBackgroundPreview(null);
      setBackgroundFormData((p) => ({ ...p, backgroundPhoto: null }));
    }
  };

  const handleStudioImageChange = (index, e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setStudioImages((prev) => {
          const updated = [...prev];
          updated[index] = { file, preview: reader.result, name: file.name };
          if (index === prev.length - 1 && prev.length < 3 && file) {
            updated.push({
              file: null,
              preview: null,
              name: `${prev.length + 1}. Stüdyo Fotoğrafınızı Yükleyiniz`,
            });
          }
          return updated;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Uzmanlıklar
  const addExperience = () => {
    if (inputValue.trim() !== "") {
      setExperiences((p) => [...p, inputValue.trim()]);
      setInputValue("");
    }
  };
  const removeExperience = (i) =>
    setExperiences((p) => p.filter((_, idx) => idx !== i));
  const expKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addExperience();
    }
  };

  // Hizmetler
  const addService = () => {
    if (serviceValue.trim() !== "") {
      setServices((p) => [...p, serviceValue.trim()]);
      setServiceValue("");
    }
  };
  const removeService = (i) =>
    setServices((p) => p.filter((_, idx) => idx !== i));
  const serviceKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addService();
    }
  };

  // Önemli Müşteriler
  const addImportantClient = () => {
    if (importantClientValue.trim() !== "") {
      console.log("➕ Önemli müşteri ekleniyor:", importantClientValue.trim());
      console.log("Mevcut liste:", importantClients);
      setImportantClients((prev) => [...prev, importantClientValue.trim()]);
      setImportantClientValue("");
    }
  };
  const removeImportantClient = (i) =>
    setImportantClients((prev) => prev.filter((_, idx) => idx !== i));
  const clientKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addImportantClient();
    }
  };

  const handleGenreClick = (genre) => {
    setSelectedGenres((p) =>
      p.includes(genre) ? p.filter((g) => g !== genre) : [...p, genre]
    );
  };

  // Profil tamamlanmış mı kontrol et
  const isProfileComplete = () => {
    return (
      formData2.provider_about &&
      formData2.provider_experience &&
      formData2.provider_project_count &&
      formData2.provider_response_time &&
      formData2.provider_studio_name &&
      preview && // Avatar fotoğrafı
      experiences.length > 0 && // En az bir uzmanlık
      services.length > 0 // En az bir hizmet
    );
  };

  const handleProfilePage = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Loading başlat
    
    // Fotoğraf kontrolü
    if (!preview) {
      toast.error("Lütfen profil fotoğrafı yükleyiniz");
      setIsLoading(false);
      return;
    }
    
    const values = Object.fromEntries(new FormData(e.currentTarget));

    const providerStudioImages = studioImages
      .filter((s) => s.preview)
      .map((s) => ({ dataUrl: s.preview, name: s.name }));

    const requestData = {
      ...values,
      photos: preview,
      userPhotoName: fileName,
      background_image: backgroundPreview, // Arkaplan fotoğrafı eklendi

      // arrays
      provider_specialties: experiences,
      provider_services: services,
      provider_important_clients: importantClients, // Basit array
      provider_studio_images: providerStudioImages,
      genres: selectedGenres,

      userInfo, // { role: "PROVIDER", ... }
    };

    // Debug - Kontrol edelim
    console.log("🔍 DEBUG - Form gönderiliyor:");
    console.log("Form values:", values);
    console.log("Önemli müşteriler state:", importantClients);
    console.log("Önemli müşteriler sayısı:", importantClients.length);
    console.log("provider_important_clients in requestData:", requestData.provider_important_clients);
    console.log("Gönderilen requestData:", requestData);

    try {
      const res = await fetch("/api/profile/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });
      const data = await res.json();
      
      if (!res.ok) {
        toast.error(data.error || data.message || "İşlem başarısız");
      } else {
        toast.success(data.message || "Profil başarıyla güncellendi!");
      }
    } catch (err) {
      toast.error("Sunucu hatası");
    } finally {
      setIsLoading(false); // Loading bitir
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      onSubmit={handleProfilePage}
    >
      <div className="flex gap-6">
        <div className="w-full md:w-1/2">
          <div className="w-full mb-9">
            <div className="pb-3 text-xl font-bold">Kendinizi Tanıtınız:</div>
            <textarea
              name="provider_about"
              value={formData2.provider_about}
              onChange={(e) => setFormData2(prev => ({ ...prev, provider_about: e.target.value }))}
              className="w-full h-[250px] resize-none py-4 px-4 bg-gray-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
              placeholder="Kendinizi Tanıtınız"
              required
            />
          </div>

          <div className="w-full mb-9 flex flex-col gap-4 items-start">
            <div className="w-full flex flex-1 flex-col">
              <div className="pb-3 text-xl font-bold">
                Profil Sayfası Arkaplan Fotoğrafınızı Yükleyiniz (1920x400):
              </div>
              <input
                type="file"
                name="background_image"
                id="background_image_provider"
                className="hidden"
                onChange={handleBackgroundPhotoChange}
                accept="image/*"
              />
              <label
                htmlFor="background_image_provider"
                className={`relative w-full min-h-[200px] max-h-[200px] border border-gray-300 rounded-md overflow-hidden cursor-pointer group transition duration-200 ${
                  backgroundPreview
                    ? ""
                    : "bg-gray-900/50 text-white flex flex-col justify-center items-center hover:bg-gray-900/80"
                }`}
              >
                {backgroundPreview ? (
                  <>
                    <img
                      src={backgroundPreview}
                      alt="Yüklenen Arkaplan Görseli"
                      className="w-full h-[200px] object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity">
                      <Upload className="w-6 h-6 mb-1" />
                      <span className="text-sm">Arkaplan Resmini Değiştir</span>
                    </div>
                  </>
                ) : (
                  <>
                    <Upload className="w-6 h-6" />
                    <span className="text-sm mt-2 truncate max-w-[200px] text-center px-2">
                      {backgroundFileName}
                    </span>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* Avatar */}
          {/* Stüdyo Fotoğrafları */}
          <div className="w-full mb-9 flex flex-col gap-4 items-start">
            <div className="w-full flex flex-1 flex-col">
              <div className="pb-3 text-xl font-bold">
                Stüdyo / İşletme Fotoğraflarınızı Yükleyiniz (En Fazla 3 Adet)
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {studioImages.map((img, idx) => (
                  <div key={idx} className="w-full flex flex-col items-start">
                    <input
                      type="file"
                      id={`studio_image_${idx}`}
                      className="hidden"
                      onChange={(e) => handleStudioImageChange(idx, e)}
                      accept="image/*"
                    />
                    <label
                      htmlFor={`studio_image_${idx}`}
                      className={`relative w-full min-h-[200px] max-h-[200px] border border-gray-300 rounded-md overflow-hidden cursor-pointer group transition duration-200 ${
                        img.preview
                          ? ""
                          : "bg-gray-900/50 text-white flex flex-col justify-center items-center hover:bg-gray-900/80"
                      }`}
                    >
                      {img.preview ? (
                        <>
                          <img
                            src={img.preview}
                            alt={`Stüdyo Fotoğrafı ${idx + 1}`}
                            className="w-full h-[200px] object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity">
                            <Upload className="w-6 h-6 mb-1" />
                            <span className="text-sm">Resmi Değiştir</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <Upload className="w-6 h-6" />
                          <span className="text-sm mt-2 truncate max-w-[200px] text-center px-2">
                            {img.name}
                          </span>
                        </>
                      )}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sayısal alanlar */}
          <div className="w-full mb-9">
            <div className="pb-3 text-xl font-bold">Deneyim Yılı:</div>
            <input
              type="number"
              name="provider_experience"
              value={formData2.provider_experience}
              onChange={(e) => setFormData2(prev => ({ ...prev, provider_experience: e.target.value }))}
              className="w-full py-4 px-4 bg-gray-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
              placeholder="Deneyim Yılınız"
              required
            />
          </div>

          <div className="w-full mb-9">
            <div className="pb-3 text-xl font-bold">Yaptığınız Proje Sayısı:</div>
            <input
              type="number"
              name="provider_project_count"
              value={formData2.provider_project_count}
              onChange={(e) => setFormData2(prev => ({ ...prev, provider_project_count: e.target.value }))}
              className="w-full py-4 px-4 bg-gray-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
              placeholder="Proje Sayısı"
              required
            />
          </div>

          <div className="w-full mb-9">
            <div className="pb-3 text-xl font-bold">Kaç Günde Yanıt Verirsiniz?</div>
            <input
              type="number"
              name="provider_response_time"
              value={formData2.provider_response_time}
              onChange={(e) => setFormData2(prev => ({ ...prev, provider_response_time: e.target.value }))}
              className="w-full py-4 px-4 bg-gray-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
              placeholder="Yanıt Süresi (gün)"
              required
            />
          </div>

          {/* Uzmanlıklar */}
          <div className="w-full mb-9 relative">
            <div className="flex justify-between items-center">
              <div className="pb-3 text-xl font-bold">Uzmanlıklar:</div>
              {experiences.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowExperienceDetail(!showExperienceDetail)}
                >
                  <Eye size={20} />
                </button>
              )}
            </div>

            <div className="flex bg-gray-800/50 border border-gray-600 rounded-xl">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={expKeyDown}
                className="w-full py-4 px-4 bg-gray-800/50 outline-none text-white"
                placeholder="Bir alan girin ve Enter’a basın"
              />
              <button
                onClick={addExperience}
                type="button"
                className="px-4 py-2 bg-primary-600 text-white rounded-tr-xl rounded-br-xl hover:bg-gray-700 transition"
              >
                <Plus size={20} />
              </button>
            </div>

            {showExperienceDetail && experiences.length > 0 && (
              <motion.ul
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="flex flex-wrap absolute top-30 z-30 gap-2 mt-4 bg-gray-900 rounded-xl py-5 px-5 text-white"
              >
                {experiences.map((item, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center bg-black rounded-xl py-3 px-3 gap-2 mb-4"
                  >
                    <li>{item}</li>
                    <button
                      onClick={() => removeExperience(index)}
                      type="button"
                      className="px-4 py-2 bg-gray-800/50 text-white rounded-xl hover:bg-gray-700 transition"
                    >
                      <Minus size={10} />
                    </button>
                  </div>
                ))}
              </motion.ul>
            )}
          </div>

          {/* Hizmetler */}
          <div className="w-full mb-9 relative">
            <div className="flex justify-between items-center">
              <div className="pb-3 text-xl font-bold">Hizmetler:</div>
              {services.length > 0 && (
                <button type="button" onClick={() => setShowServices(!showServices)}>
                  <Eye size={20} />
                </button>
              )}
            </div>

            <div className="flex bg-gray-800/50 border border-gray-600 rounded-xl">
              <input
                type="text"
                value={serviceValue}
                onChange={(e) => setServiceValue(e.target.value)}
                onKeyDown={serviceKeyDown}
                className="w-full py-4 px-4 bg-gray-800/50 outline-none text-white"
                placeholder="Bir hizmet girin ve Enter’a basın"
              />
              <button
                onClick={addService}
                type="button"
                className="px-4 py-2 bg-primary-600 text-white rounded-tr-xl rounded-br-xl hover:bg-gray-700 transition"
              >
                <Plus size={20} />
              </button>
            </div>

            {showServices && services.length > 0 && (
              <motion.ul
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="flex flex-wrap absolute top-30 z-30 gap-2 mt-4 bg-gray-900 rounded-xl py-5 px-5 text-white"
              >
                {services.map((item, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center bg-black rounded-xl py-3 px-3 gap-2 mb-4"
                  >
                    <li>{item}</li>
                    <button
                      onClick={() => removeService(index)}
                      type="button"
                      className="px-4 py-2 bg-gray-800/50 text-white rounded-xl hover:bg-gray-700 transition"
                    >
                      <Minus size={10} />
                    </button>
                  </div>
                ))}
              </motion.ul>
            )}
          </div>

          {/* Önemli Müşteriler */}
          <div className="w-full mb-9 relative">
            <div className="flex justify-between items-center">
              <div className="pb-3 text-xl font-bold">Önemli Müşteriler:</div>
              {importantClients.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowImportantClients(!showImportantClients)}
                >
                  <Eye size={20} />
                </button>
              )}
            </div>

            <div className="flex bg-gray-800/50 border border-gray-600 rounded-xl">
              <input
                type="text"
                name="provider_important_client_input"
                value={importantClientValue}
                onChange={(e) => setImportantClientValue(e.target.value)}
                onKeyDown={clientKeyDown}
                className="w-full py-4 px-4 bg-gray-800/50 outline-none text-white"
                placeholder="Önemli müşteri adı girin ve Enter'a basın"
              />
              <button
                onClick={addImportantClient}
                type="button"
                className="px-4 py-2 bg-primary-600 text-white rounded-tr-xl rounded-br-xl hover:bg-gray-700 transition"
              >
                <Plus size={20} />
              </button>
            </div>

            {showImportantClients && importantClients.length > 0 && (
              <motion.ul
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="flex flex-wrap absolute top-30 z-30 gap-2 mt-4 bg-gray-900 rounded-xl py-5 px-5 text-white"
              >
                {importantClients.map((item, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center bg-black rounded-xl py-3 px-3 gap-2 mb-4"
                  >
                    <li>{item}</li>
                    <button
                      onClick={() => removeImportantClient(index)}
                      type="button"
                      className="px-4 py-2 bg-gray-800/50 text-white rounded-xl hover:bg-gray-700 transition"
                    >
                      <Minus size={10} />
                    </button>
                  </div>
                ))}
              </motion.ul>
            )}
          </div>

          {/* Türler opsiyonel */}
          <div className="w-full mb-9 flex flex-col gap-4 items-start">
            <div className="w-full flex flex-1 flex-col">
              <div className="pb-3 text-xl font-bold">Hangi Türde Müzik Yapıyorsunuz?</div>
              <div className="flex flex-wrap gap-4">
                {genres.map((genre) => (
                  <div
                    key={genre}
                    onClick={() => handleGenreClick(genre)}
                    className={`cursor-pointer px-4 py-2 rounded-lg border transition-all ${
                      selectedGenres.includes(genre)
                        ? "border-blue-500 bg-blue-100 text-blue-700"
                        : "bg-gradient-to-r from-primary-500/20 to-primary-400/10 border border-primary-500/30 text-primary-400 font-semibold"
                    }`}
                  >
                    {genre}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stüdyo adı */}
          <div className="w-full mb-3">
            <div className="pb-3 text-xl font-bold">Stüdyo Adı:</div>
            <input
              type="text"
              name="provider_studio_name"
              value={formData2.provider_studio_name}
              onChange={(e) => setFormData2(prev => ({ ...prev, provider_studio_name: e.target.value }))}
              className="w-full py-4 px-4 bg-gray-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
              placeholder="Stüdyo adı"
              required
            />
          </div>

          {/* Profil Fotoğrafı - Register'dan taşınan geliştirilmiş UI */}
          <div className="w-full mb-6">
            <label className="block text-xl font-bold mb-3 text-white">Profil Fotoğrafı (200x200)</label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                id="user_photo"
                name="user_photo"
                onChange={handlePhotoChange}
                accept="image/*"
                className="hidden"
              />
              <label
                htmlFor="user_photo"
                className={`relative w-20 h-20 border-2 border-dashed border-gray-600 rounded-xl cursor-pointer hover:border-gray-500 transition-colors flex items-center justify-center ${
                  preview ? 'border-primary-500' : ''
                }`}
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <Upload className="w-6 h-6 text-gray-400" />
                )}
              </label>
              <div className="flex-1">
                <label
                  htmlFor="user_photo"
                  className="inline-flex items-center px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-xl text-white cursor-pointer hover:bg-gray-700/50 transition-colors"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Fotoğraf Seç
                </label>
                <p className="text-xs text-gray-400 mt-1">
                  {fileName !== "Resminizi Yükleyiniz" ? fileName : 'JPG, PNG veya GIF (Max 5MB)'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`flex items-center space-x-2 px-6 py-3 rounded-md font-medium transition-all duration-200 ${
          isLoading 
            ? "bg-gray-600 text-gray-300 cursor-not-allowed" 
            : "bg-primary-600 hover:bg-primary-700 text-black hover:scale-105"
        }`}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Kaydediliyor...</span>
          </>
        ) : (
          <>
            <span>Kaydet</span>
          </>
        )}
      </button>

      {/* Canlı Link - Sadece profil tamamlandığında göster */}
      {userInfo?.user_name && isProfileComplete() && (
        <div className="w-1/2 mt-6 p-4 bg-gradient-to-r from-primary-500/10 to-primary-400/5 border border-primary-500/20 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <ExternalLink className="w-5 h-5 text-primary-400" />
                Canlı Profil Linkiniz
              </h3>
              <div className="flex items-center gap-3">
                <code className="text-primary-400 bg-black/30 px-3 py-2 rounded-lg text-sm font-mono">
                  {`${window.location.origin}/profile/${userInfo.user_name}`}
                </code>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/profile/${userInfo.user_name}`);
                    toast.success("Link kopyalandı!");
                  }}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-black rounded-lg transition-colors text-sm font-medium"
                >
                  Kopyala
                </button>
                <button
                  type="button"
                  onClick={() => window.open(`/profile/${userInfo.user_name}`, '_blank')}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Görüntüle
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profil tamamlanmadığında bilgi mesajı */}
      {userInfo?.user_name && !isProfileComplete() && (
        <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
              <span className="text-yellow-500 text-sm">ℹ️</span>
            </div>
            <div>
              <h3 className="text-yellow-300 font-semibold mb-1">Profilinizi Tamamlayın</h3>
              <p className="text-yellow-200/80 text-sm">
                Canlı profil linkinizi görmek için lütfen tüm gerekli alanları doldurun:
                Hakkında, deneyim bilgileri, fotoğraf, uzmanlıklar ve hizmetler.
              </p>
            </div>
          </div>
        </div>
      )}
    </motion.form>
  );
};
