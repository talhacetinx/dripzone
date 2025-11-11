"use client";

import { useState, useEffect } from "react";
import { Upload, Plus, Minus, Eye, ExternalLink, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useAuth } from "../../../../context/AuthContext";

export const ProfileTab = ({ userInfo, profileCache, clearProfileCache }) => {
  const { checkAuth } = useAuth(); // AuthContext'ten checkAuth'i al
  const [fileName, setFileName] = useState("Resminizi Yükleyiniz");
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({ photo: null });
  
  // Arkaplan fotoğrafı için ayrı state
  const [backgroundFileName, setBackgroundFileName] = useState("Arkaplan Fotoğrafınızı Yükleyiniz");
  const [backgroundPreview, setBackgroundPreview] = useState(null);
  const [backgroundFormData, setBackgroundFormData] = useState({ backgroundPhoto: null });
  
  const [inputValue, setInputValue] = useState("");
  const [experiences, setExperiences] = useState([]);
  const [showExperienceDetail, setShowExperienceDetail] = useState(true);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [isLoading, setIsLoading] = useState(false); 
  
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [youtubeLink, setYoutubeLink] = useState("");
  const [spotifyLink, setSpotifyLink] = useState("");
  
  const [formData2, setFormData2] = useState({
    profile_description: "",
    profile_experience: "",
    profile_title: "",
  });
  const genres = [
    "Rock",
    "Pop", 
    "Hip-Hop / Rap",
    "R&B / Soul",
    "Jazz",
    "Klasik (Classical)",
    "Elektronik / EDM",
    "Folk",
    "Reggae / Ska",
    "Film / Oyun Müzikleri",
    "Ambient / Chill / Downtempo",
    "World Music",
    "Spiritual / Dini",
    "Türk Müziği",
    "Blues",
    "Experimental / Avant-Garde",
    "Metal",
    "Latin",
    "Urban",
    "8-bit / Chip Tune"
  ];

  // Profil verilerini yükleme fonksiyonu
  const loadProfile = async () => {
    try {
      // State'leri başlangıçta temizle
      setSelectedPlatforms([]);
      setYoutubeLink("");
      setSpotifyLink("");
      setSelectedGenres([]);
      
      // Önce cache'den kontrol et
      if (profileCache && profileCache.profile) {
        console.log("🎨 Artist - Using cached profile data:", profileCache.profile);
        const profile = profileCache.profile;
        
        // Form verilerini doldur
        setFormData2({
          profile_description: profile.bio || "",
          profile_experience: profile.experience || "",
          profile_title: profile.title || "",
        });
        console.log("✅ Artist - Cached form data set:", {
          profile_description: profile.bio || "",
          profile_experience: profile.experience || "",
          profile_title: profile.title || "",
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

        // Uzmanlıklar
        if (profile.experiences) {
          setExperiences(profile.experiences);
        }

        // Türler
        if (profile.genres) {
          console.log("🎵 Artist - Loading cached genres:", profile.genres);
          const genresArray = Array.isArray(profile.genres) ? profile.genres : profile.genres.split(",").filter(g => g.trim());
          setSelectedGenres(genresArray);
        }

        // Platform linkleri cache'den
        let newPlatforms = [];
        if (profile.youtubeLink) {
          console.log("📺 Artist - Loading cached YouTube link:", profile.youtubeLink);
          setYoutubeLink(profile.youtubeLink);
          newPlatforms.push('youtube');
        }
        if (profile.spotifyLink) {
          console.log("🎵 Artist - Loading cached Spotify link:", profile.spotifyLink);
          setSpotifyLink(profile.spotifyLink);
          newPlatforms.push('spotify');
        }
        if (newPlatforms.length > 0) {
          setSelectedPlatforms(newPlatforms);
          console.log("✅ Artist - Set platforms:", newPlatforms);
        }
        
        return; // Cache'den yüklendi, API çağrısı yapma
      }

      // Cache yoksa API'den yükle
      console.log("🎨 Artist - No cache, loading from API...");
      
      const res = await fetch("/api/profile/get", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
      });
      
      console.log("🎨 Artist - API Response status:", res.status);
      console.log("🎨 Artist - API Response ok:", res.ok);
      
      if (res.ok) {
        const data = await res.json();
        console.log("🎨 Artist - Full API Response:", JSON.stringify(data, null, 2));
        
        if (data.profile) {
          const profile = data.profile;
          console.log("🎨 Artist Profil bulundu:", profile);
          
          // Form verilerini doldur
          setFormData2({
            profile_description: profile.bio || "",
            profile_experience: profile.experience || "",
            profile_title: profile.title || "",
          });
          console.log("✅ Artist - Form data set:", {
            profile_description: profile.bio || "",
            profile_experience: profile.experience || "",
            profile_title: profile.title || "",
          });
          
          // Form data state'ini kontrol et
          setTimeout(() => {
            console.log("🔍 Artist - Current formData2 state:", formData2);
          }, 100);

          // Avatar
          if (profile.avatarUrl) {
            console.log("✅ Artist Avatar URL bulundu:", profile.avatarUrl);
            setPreview(profile.avatarUrl);
            setFileName("Mevcut profil fotoğrafı");
          }

          // Background image
          if (profile.backgroundUrl) {
            setBackgroundPreview(profile.backgroundUrl);
            setBackgroundFileName("Mevcut arkaplan fotoğrafı");
          }

          // Uzmanlıklar
          if (profile.experiences) {
            setExperiences(profile.experiences);
          }

          // Türler
          if (profile.genres) {
            console.log("🎵 Artist - Loading API genres:", profile.genres);
            const genresArray = Array.isArray(profile.genres) ? profile.genres : profile.genres.split(",").filter(g => g.trim());
            setSelectedGenres(genresArray);
          }

          // Platform linklerini otherData'dan yükle
          console.log("🔗 Artist - Platform links from otherData:", {
            youtubeLink: profile.youtubeLink,
            spotifyLink: profile.spotifyLink
          });
          
          let newPlatforms = [];
          if (profile.youtubeLink) {
            console.log("📺 Artist - Loading YouTube link:", profile.youtubeLink);
            setYoutubeLink(profile.youtubeLink);
            newPlatforms.push('youtube');
          }
          if (profile.spotifyLink) {
            console.log("🎵 Artist - Loading Spotify link:", profile.spotifyLink);
            setSpotifyLink(profile.spotifyLink);
            newPlatforms.push('spotify');
          }
          if (newPlatforms.length > 0) {
            setSelectedPlatforms(newPlatforms);
            console.log("✅ Artist - Set platforms from API:", newPlatforms);
          }
        } else {
          console.log("❌ Artist - No profile data found in API response");
        }
      } else {
        console.log("❌ Artist - API request failed with status:", res.status);
        const errorData = await res.text();
        console.log("❌ Artist - Error response:", errorData);
      }
    } catch (error) {
      console.error("Profil yüklenirken hata:", error);
      toast.error("Profil verileri yüklenemedi");
    }
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        // State'leri başlangıçta temizle
        setSelectedPlatforms([]);
        setYoutubeLink("");
        setSpotifyLink("");
        setSelectedGenres([]);
        
        // Önce cache'den kontrol et
        if (profileCache && profileCache.profile) {
          console.log("🎨 Artist - Using cached profile data:", profileCache.profile);
          const profile = profileCache.profile;
          
          // Form verilerini doldur
          setFormData2({
            profile_description: profile.bio || "",
            profile_experience: profile.experience || "",
            profile_title: profile.title || "",
          });

          // Avatar
          if (profile.avatarUrl) {
            console.log("✅ Artist - Cached Avatar URL bulundu:", profile.avatarUrl);
            setPreview(profile.avatarUrl);
            setFileName("Mevcut profil fotoğrafı");
          }

          // Background image
          if (profile.backgroundUrl) {
            setBackgroundPreview(profile.backgroundUrl);
            setBackgroundFileName("Mevcut arkaplan fotoğrafı");
          }

          // Uzmanlıklar
          if (profile.experiences) {
            setExperiences(profile.experiences);
          }

          // Türler - virgülle ayrılmış string'i array'e çevir
          if (profile.genres) {
            console.log("🎵 Artist - Loading cached genres:", profile.genres);
            const genresArray = Array.isArray(profile.genres) ? profile.genres : profile.genres.split(",").filter(g => g.trim());
            setSelectedGenres(genresArray);
          }

          // Platform linklerini yükle
          let newPlatforms = [];
          if (profile.youtubeLink) {
            console.log("📺 Artist - Loading cached YouTube link:", profile.youtubeLink);
            setYoutubeLink(profile.youtubeLink);
            newPlatforms.push('youtube');
          }
          if (profile.spotifyLink) {
            console.log("🎵 Artist - Loading cached Spotify link:", profile.spotifyLink);
            setSpotifyLink(profile.spotifyLink);
            newPlatforms.push('spotify');
          }
          if (newPlatforms.length > 0) {
            setSelectedPlatforms(newPlatforms);
            console.log("✅ Artist - Set platforms:", newPlatforms);
          }
          
          return; // Cache'den yüklendi, API çağrısı yapma
        }

        // Cache yoksa API'den yükle
        console.log("🎨 Artist - No cache, loading from API...");
        
        // State'leri API yüklemeden önce de temizle
        setSelectedPlatforms([]);
        setYoutubeLink("");
        setSpotifyLink("");
        setSelectedGenres([]);
        
        const res = await fetch("/api/profile/get", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
      });
        
        if (res.ok) {
          const data = await res.json();
          
          if (data.profile) {
            const profile = data.profile;
            console.log("🎨 Artist Profil bulundu:", profile);
            console.log("🖼️ Artist Avatar URL:", profile.avatarUrl);
            
            // Form verilerini doldur
            setFormData2({
              profile_description: profile.bio || "",
              profile_experience: profile.experience || "",
              profile_title: profile.title || "",
            });

            // Avatar
            if (profile.avatarUrl) {
              console.log("✅ Artist Avatar URL bulundu, preview ayarlanıyor:", profile.avatarUrl);
              setPreview(profile.avatarUrl);
              setFileName("Mevcut profil fotoğrafı");
            } else {
              console.log("❌ Artist Avatar URL bulunamadı");
            }

            // Background image
            if (profile.backgroundUrl) {
              setBackgroundPreview(profile.backgroundUrl);
              setBackgroundFileName("Mevcut arkaplan fotoğrafı");
            }

            // Uzmanlıklar
            if (profile.experiences) {
              setExperiences(profile.experiences);
            }

            // Türler - virgülle ayrılmış string'i array'e çevir
            if (profile.genres) {
              console.log("🎵 Artist - Loading API genres:", profile.genres);
              const genresArray = Array.isArray(profile.genres) ? profile.genres : profile.genres.split(",").filter(g => g.trim());
              setSelectedGenres(genresArray);
            }

            // Platform linklerini otherData'dan yükle
            console.log("🔗 Artist - Platform links from otherData:", {
              youtubeLink: profile.youtubeLink,
              spotifyLink: profile.spotifyLink
            });
            
            let newPlatforms = [];
            if (profile.youtubeLink) {
              console.log("📺 Artist - Loading YouTube link from otherData:", profile.youtubeLink);
              setYoutubeLink(profile.youtubeLink);
              newPlatforms.push('youtube');
            }
            if (profile.spotifyLink) {
              console.log("🎵 Artist - Loading Spotify link from otherData:", profile.spotifyLink);
              setSpotifyLink(profile.spotifyLink);
              newPlatforms.push('spotify');
            }
            if (newPlatforms.length > 0) {
              setSelectedPlatforms(newPlatforms);
              console.log("✅ Artist - Set platforms from otherData:", newPlatforms);
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
  }, [userInfo, profileCache]); // profileCache dependency eklendi

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
    console.log("🎵 Genre clicked:", genre);
    console.log("📋 Current selectedGenres:", selectedGenres);
    
    setSelectedGenres((p) => {
      const newGenres = p.includes(genre) ? p.filter((g) => g !== genre) : [...p, genre];
      console.log("🎵 New selectedGenres:", newGenres);
      return newGenres;
    });
  };

  const handlePlatformClick = (platform) => {
    console.log("🔘 Platform clicked:", platform);
    console.log("📋 Current selectedPlatforms:", selectedPlatforms);
    
    setSelectedPlatforms((prev) => {
      if (prev.includes(platform)) {
        console.log("❌ Removing platform:", platform);
        // Platform kaldırılıyorsa link'ini de temizle
        if (platform === 'youtube') setYoutubeLink("");
        if (platform === 'spotify') setSpotifyLink("");
        return prev.filter((p) => p !== platform);
      } else {
        console.log("✅ Adding platform:", platform);
        return [...prev, platform];
      }
    });
  };

  const isProfileComplete = () => {
    // API'den gelen cache verisini kontrol et
    if (profileCache && profileCache.profile) {
      const profile = profileCache.profile;
      const isComplete = (
        profile.bio &&
        profile.experience &&
        profile.title &&
        profile.avatarUrl && 
        profile.experiences && profile.experiences.length > 0
      );
      
      console.log("🔍 Profile completion check (from cache):", {
        bio: !!profile.bio,
        experience: !!profile.experience,
        title: !!profile.title,
        avatarUrl: !!profile.avatarUrl,
        experiences: profile.experiences?.length > 0,
        isComplete
      });
      
      return isComplete;
    }
    
    // Cache yoksa form state'ini kontrol et (fallback)
    const isComplete = (
      formData2.profile_description &&
      formData2.profile_experience &&
      formData2.profile_title &&
      preview && 
      experiences.length > 0
    );
    
    console.log("🔍 Profile completion check (from form state):", {
      profile_description: !!formData2.profile_description,
      profile_experience: !!formData2.profile_experience,
      profile_title: !!formData2.profile_title,
      preview: !!preview,
      experiences: experiences.length > 0,
      isComplete
    });
    
    return isComplete;
  };

  const handleProfilePage = async (e) => {
    e.preventDefault();
    setIsLoading(true); 
    
    // Debug: Gönderilecek verileri logla
    console.log("💾 Form submission data:");
    console.log("📋 selectedGenres:", selectedGenres);
    console.log("📋 selectedPlatforms:", selectedPlatforms);
    console.log("📺 youtubeLink:", youtubeLink);
    console.log("🎵 spotifyLink:", spotifyLink);
    console.log("🎯 experiences:", experiences);
    
    const values = Object.fromEntries(new FormData(e.currentTarget));
    
    const submitData = {
      ...values,
      photos: preview,
      userPhotoName: fileName,
      background_image: backgroundPreview,
      experiences: experiences,
      genres: selectedGenres,
      youtubeLink: youtubeLink || '',
      spotifyLink: spotifyLink || '',
      userInfo, 
    };
    
    console.log("📤 Final submit data:", submitData);
    console.log("🔍 Platform links being sent:", {
      youtubeLink: submitData.youtubeLink,
      spotifyLink: submitData.spotifyLink,
      hasYoutube: !!submitData.youtubeLink,
      hasSpotify: !!submitData.spotifyLink
    });
    
    try {
      const res = await fetch("/api/profile/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || data.message || "İşlem başarısız");
      } else {
        toast.success(data.message || "Profil başarıyla güncellendi!");
        // Header'daki profil fotoğrafını güncellemek için AuthContext'i refresh et
        await checkAuth();
        
        // Profil cache'ini temizle ve profil verilerini yeniden yükle
        if (clearProfileCache) {
          console.log("🔄 Clearing profile cache after successful update");
          clearProfileCache();
        }
        
        // Profil verilerini yeniden yükle
        console.log("🔄 Reloading profile data after successful update");
        await loadProfile();
      }
    } catch (err) {
      toast.error("Sunucu hatası");
    } finally {
      setIsLoading(false); // Loading bitir
    }
  };

  return (
    <form onSubmit={handleProfilePage}>
      {/* Debug: Form rendering */}
      {console.log("🎨 Form rendering - formData2:", formData2)}
      {console.log("🎨 Form rendering - preview:", preview)}
      {console.log("🎨 Form rendering - experiences:", experiences)}
      
      <div className="flex gap-6">
        <div className="w-full md:w-1/2">
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
                Profil Sayfası Arkaplan Fotoğrafınızı Yükleyiniz (1920x400):
              </div>
              <input
                type="file"
                name="background_image"
                id="background_image_artist"
                className="hidden"
                onChange={handleBackgroundPhotoChange}
                accept="image/*"
              />
              <label
                htmlFor="background_image_artist"
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

          {/* Sanatçı Profili Nerede Bölümü */}
          <div className="w-full mb-6">
            <div className="pb-3 text-xl font-bold">Sanatçı profilin nerede?</div>
            <div className="flex flex-wrap gap-4 mb-4">
              <div
                onClick={() => handlePlatformClick('youtube')}
                className={`cursor-pointer px-6 py-3 rounded-lg border transition-all flex items-center gap-3 ${
                  selectedPlatforms.includes('youtube')
                    ? "border-red-500 bg-red-100/10 text-red-400"
                    : "bg-gradient-to-r from-gray-800/50 to-gray-700/30 border border-gray-600 text-gray-300 hover:border-gray-500"
                }`}
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                YouTube
              </div>
              <div
                onClick={() => handlePlatformClick('spotify')}
                className={`cursor-pointer px-6 py-3 rounded-lg border transition-all flex items-center gap-3 ${
                  selectedPlatforms.includes('spotify')
                    ? "border-green-500 bg-green-100/10 text-green-400"
                    : "bg-gradient-to-r from-gray-800/50 to-gray-700/30 border border-gray-600 text-gray-300 hover:border-gray-500"
                }`}
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
                Spotify
              </div>
            </div>

            {/* YouTube Link Input */}
            {selectedPlatforms.includes('youtube') && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4"
              >
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  YouTube Kanal Linki
                </label>
                <input
                  type="url"
                  value={youtubeLink}
                  onChange={(e) => setYoutubeLink(e.target.value)}
                  className="w-full py-3 px-4 bg-gray-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent text-white"
                  placeholder="https://youtube.com/@your-channel"
                />
              </motion.div>
            )}

            {/* Spotify Link Input */}
            {selectedPlatforms.includes('spotify') && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4"
              >
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Spotify Sanatçı Linki
                </label>
                <input
                  type="url"
                  value={spotifyLink}
                  onChange={(e) => setSpotifyLink(e.target.value)}
                  className="w-full py-3 px-4 bg-gray-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                  placeholder="https://open.spotify.com/artist/your-id"
                />
              </motion.div>
            )}
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