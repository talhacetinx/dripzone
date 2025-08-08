"use client";

import { useState, useEffect } from "react";
import { Upload, Plus, Minus, Eye, ExternalLink, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

export const ProfileTab = ({ userInfo }) => {
  const [fileName, setFileName] = useState("Resminizi Yükleyiniz");
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({ photo: null });
  const [inputValue, setInputValue] = useState("");
  const [experiences, setExperiences] = useState([]);
  const [showExperienceDetail, setShowExperienceDetail] = useState(true);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [formData2, setFormData2] = useState({
    profile_description: "",
    profile_experience: "",
    profile_title: "",
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
              profile_description: profile.bio || "",
              profile_experience: profile.experience || "",
              profile_title: profile.title || "",
            });

            // Avatar
            if (profile.avatarUrl) {
              setPreview(profile.avatarUrl);
              setFileName("Mevcut profil fotoğrafı");
            }

            // Uzmanlıklar
            if (profile.experiences) {
              setExperiences(profile.experiences);
            }

            // Türler - virgülle ayrılmış string'i array'e çevir
            if (profile.genres) {
              const genresArray = profile.genres.split(",").filter(g => g.trim());
              setSelectedGenres(genresArray);
            }
          }
        }
      } catch (error) {
        console.error("Profil yüklenirken hata:", error);
        toast.error("Profil verileri yüklenemedi");
      }
    };

    if (userInfo?.role === "ARTIST") {
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

  const handleAddExperience = () => {
    if (inputValue.trim() !== "") {
      setExperiences((p) => [...p, inputValue.trim()]);
      setInputValue("");
    }
  };
  const handleRemoveExperience = (i) => {
    setExperiences((p) => p.filter((_, idx) => idx !== i));
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddExperience();
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
      formData2.profile_description &&
      formData2.profile_experience &&
      formData2.profile_title &&
      preview && // Avatar fotoğrafı
      experiences.length > 0 // En az bir uzmanlık
    );
  };

  const handleProfilePage = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Loading başlat
    
    const values = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch("/api/profile/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          photos: preview,
          userPhotoName: fileName,
          experiences: experiences, // Uzmanlık alanları eklendi
          genres: selectedGenres,
          userInfo, // { role: "ARTIST", ... }
        }),
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
    <form onSubmit={handleProfilePage}>
      <div className="flex gap-6">
        <div className="w-1/2">
          <div className="w-full mb-9">
            <div className="pb-3 text-xl font-bold">Kendinizi Tanıtınız:</div>
            <textarea
              name="profile_description"
              value={formData2.profile_description}
              onChange={(e) => setFormData2(prev => ({ ...prev, profile_description: e.target.value }))}
              className="w-full h-[250px] resize-none py-4 px-4 bg-gray-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
              placeholder="Kendinizi Tanıtınız"
              required
            />
          </div>

          <div className="w-full mb-9 flex flex-col gap-4 items-start">
            <div className="w-full flex flex-1 flex-col">
              <div className="pb-3 text-xl font-bold">
                Profil Sayfası Fotoğrafınızı Yükleyiniz (200x200):
              </div>
              <input
                type="file"
                name="user_image"
                id="user_image"
                className="hidden"
                onChange={handlePhotoChange}
                required
              />
              <label
                htmlFor="user_image"
                className={`relative w-full min-h-[200px] max-h-[200px] border border-gray-300 rounded-md overflow-hidden cursor-pointer group transition duration-200 ${
                  preview
                    ? ""
                    : "bg-gray-900/50 text-white flex flex-col justify-center items-center hover:bg-gray-900/80"
                }`}
              >
                {preview ? (
                  <>
                    <img
                      src={preview}
                      alt="Yüklenen Görsel"
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
                      {fileName}
                    </span>
                  </>
                )}
              </label>
            </div>
          </div>

          <div className="w-full mb-9 flex-1">
            <div className="pb-3 text-xl font-bold">Deneyim Yılı:</div>
            <input
              type="number"
              name="profile_experience"
              value={formData2.profile_experience}
              onChange={(e) => setFormData2(prev => ({ ...prev, profile_experience: e.target.value }))}
              className="w-full py-4 px-4 bg-gray-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
              placeholder="Deneyim Yılınız"
              required
            />
          </div>

          <div className="w-full mb-9 flex-1 relative">
            <div className="flex justify-between items-center">
              <div className="pb-3 text-xl font-bold">Uzman olduğunuz alanlar:</div>
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
                onKeyDown={handleKeyDown}
                className="w-full py-4 px-4 bg-gray-800/50 outline-none text-white"
                placeholder="Bir alan girin ve Enter’a basın"
              />
              <button
                onClick={handleAddExperience}
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
                      onClick={() => handleRemoveExperience(index)}
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

          <div className="w-full mb-3 flex-1">
            <div className="pb-3 text-xl font-bold">Sanatçı Ünvanı:</div>
            <input
              type="text"
              name="profile_title"
              value={formData2.profile_title}
              onChange={(e) => setFormData2(prev => ({ ...prev, profile_title: e.target.value }))}
              className="w-full py-4 px-4 bg-gray-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
              placeholder="Ünvanı Giriniz"
              required
            />
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

      {userInfo?.user_name && !isProfileComplete() && (
        <div className="w-1/2 mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
              <span className="text-yellow-500 text-sm">ℹ️</span>
            </div>
            <div>
              <h3 className="text-yellow-300 font-semibold mb-1">Profilinizi Tamamlayın</h3>
              <p className="text-yellow-200/80 text-sm">
                Canlı profil linkinizi görmek için lütfen tüm gerekli alanları doldurun:
                Başlık, açıklama, deneyim, fotoğraf ve uzmanlıklar.
              </p>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};