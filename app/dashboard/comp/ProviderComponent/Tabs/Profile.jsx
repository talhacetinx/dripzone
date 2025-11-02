"use client";

import { useState, useEffect } from "react";
import { Upload, Plus, Minus, Eye, ExternalLink, Loader2, Check, X, Edit, Trash2, Link, Music, Image } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useAuth } from "../../../../context/AuthContext";

export const ProfileProviderTab = ({ userInfo, profileCache }) => {
  const { checkAuth } = useAuth();
  const [fileName, setFileName] = useState("Resminizi Yükleyiniz");
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({ photo: null });
  const [isLoading, setIsLoading] = useState(false); 
  const [isProfileLoading, setIsProfileLoading] = useState(false); // Başlangıçta false, tab açıldığında true yap
  const [isServiceDataLoading, setIsServiceDataLoading] = useState(false); // ServiceData yükleme durumu 


  const [backgroundFileName, setBackgroundFileName] = useState("Arkaplan Fotoğrafınızı Yükleyiniz");
  const [backgroundPreview, setBackgroundPreview] = useState(null);
  const [backgroundFormData, setBackgroundFormData] = useState({ backgroundPhoto: null });

  const [inputValue, setInputValue] = useState("");
  const [experiences, setExperiences] = useState([]);
  const [showExperienceDetail, setShowExperienceDetail] = useState(true);

  const [importantClients, setImportantClients] = useState([]);
  const [importantClientValue, setImportantClientValue] = useState("");
  const [showImportantClients, setShowImportantClients] = useState(true);

  // Opsiyonel: türler
  const [selectedGenres, setSelectedGenres] = useState([]);

  // Hizmet tipi
  const [serviceType, setServiceType] = useState("");
  const [showServiceTypeWarning, setShowServiceTypeWarning] = useState(false);
  const [pendingServiceType, setPendingServiceType] = useState("");

  // Kayıt Stüdyoları için state (3 fotoğraf)
  const [studioPhotos, setStudioPhotos] = useState([]);

  // Müzik Yapımcıları için state (fotoğraf/video + şarkı bilgileri)
  const [musicProjects, setMusicProjects] = useState([]);

  // Albüm Kapağı Tasarımcıları için state (4 albüm kapağı + şarkı linki)
  const [albumCovers, setAlbumCovers] = useState([
    { songLink: "", file: null, preview: null, name: "" },
    { songLink: "", file: null, preview: null, name: "" },
    { songLink: "", file: null, preview: null, name: "" },
    { songLink: "", file: null, preview: null, name: "" }
  ]);

  // Video Yönetmenleri için state (YouTube linkleri)
  const [musicVideos, setMusicVideos] = useState([]);

      {/* Platform linkleri için state'ler */}
  const [youtubeLink, setYoutubeLink] = useState("");
  const [spotifyLink, setSpotifyLink] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);

  const serviceTypes = [
    { id: "recording_studio", name: "Kayıt Stüdyoları" },
    { id: "music_producer", name: "Müzik Yapımcıları" },
    { id: "album_cover_artist", name: "Albüm Kapağı Sanatçıları" },
    { id: "music_video_director", name: "Müzik Video Yönetmenleri" }
  ];

  // Form için state
  const [formData2, setFormData2] = useState({
    provider_about: "",
    provider_experience: "",
    provider_project_count: "",
    provider_response_time: "",
    provider_studio_name: "",
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

  const handleServiceTypeChange = (newServiceType) => {
    const profileComplete = isProfileComplete();
    // Eğer profil tamamlanmışsa ve farklı bir service type seçilmeye çalışılıyorsa
    if (serviceType && 
        serviceType !== 'none' && 
        serviceType !== newServiceType && 
        profileComplete) {
      setPendingServiceType(newServiceType);
      setShowServiceTypeWarning(true);
      return;
    }
    setServiceType(newServiceType);
  };

  const handleServiceTypeWarningClose = () => {
    setShowServiceTypeWarning(false);
    setPendingServiceType("");
  };

  // Kayıt Stüdyoları fonksiyonları
  const handleStudioPhotoChange = (e, index) => {
    const file = e.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) { // 5MB limit
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPhotos = [...studioPhotos];
        // Index'e kadar array'i genişlet
        while (newPhotos.length <= index) {
          newPhotos.push(null);
        }
        newPhotos[index] = {
          file: file,
          preview: reader.result,
          name: file.name,
          url: null, // Yeni dosya için URL yok
          isNew: true // Yeni dosya olduğunu işaretle
        };
        setStudioPhotos(newPhotos);
      };
      reader.readAsDataURL(file);
    } else {
      toast.error("Dosya boyutu 5MB'ı geçemez!");
    }
  };

  const removeStudioPhoto = (index) => {
    const newPhotos = [...studioPhotos];
    newPhotos[index] = null;
    setStudioPhotos(newPhotos);
  };

  const editStudioPhoto = (index) => {
    // Dosya input'unu tetikle
    const fileInput = document.getElementById(`studio_photo_${index}`);
    if (fileInput) {
      fileInput.click();
    }
  };

  // Müzik Yapımcıları fonksiyonları
  const addMusicProject = () => {
    setMusicProjects([...musicProjects, {
      songName: "",
      songDescription: "",
      mediaFile: null,
      mediaPreview: null,
      link: ""
    }]);
  };

  const updateMusicProject = (index, field, value) => {
    const newProjects = [...musicProjects];
    if (!newProjects[index]) {
      newProjects[index] = {
        songName: "",
        songDescription: "",
        mediaFile: null,
        mediaPreview: null,
        mediaUrl: null,
        link: ""
      };
    }
    newProjects[index][field] = value;
    setMusicProjects(newProjects);
  };

  const handleMusicProjectFileChange = (e, index) => {
    const file = e.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) { // 5MB limit
      const reader = new FileReader();
      reader.onloadend = () => {
        updateMusicProject(index, 'mediaFile', file);
        updateMusicProject(index, 'mediaPreview', reader.result);
        updateMusicProject(index, 'mediaUrl', null); // Yeni dosya için eski URL'yi temizle
      };
      reader.readAsDataURL(file);
    } else {
      toast.error("Dosya boyutu 5MB'ı geçemez!");
    }
  };

  const editMusicProjectMedia = (index) => {
    // Dosya input'unu tetikle
    const fileInput = document.getElementById(`music_project_media_${index}`);
    if (fileInput) {
      fileInput.click();
    }
  };

  const removeMusicProject = (index) => {
    const newProjects = musicProjects.filter((_, i) => i !== index);
    setMusicProjects(newProjects);
  };

  // Albüm Kapağı Tasarımcıları fonksiyonları
  const handleAlbumCoverChange = (e, index) => {
    const file = e.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) { // 5MB limit
      const reader = new FileReader();
      reader.onloadend = () => {
        const newCovers = [...albumCovers];
        newCovers[index] = {
          ...newCovers[index],
          file: file,
          preview: reader.result,
          name: file.name,
          url: null // Yeni dosya için URL yok
        };
        setAlbumCovers(newCovers);
      };
      reader.readAsDataURL(file);
    } else {
      toast.error("Dosya boyutu 5MB'ı geçemez!");
    }
  };

  const updateAlbumCover = (index, field, value) => {
    const newCovers = [...albumCovers];
    if (!newCovers[index]) {
      newCovers[index] = { songLink: "", file: null, preview: null, name: "", url: null };
    }
    newCovers[index][field] = value;
    setAlbumCovers(newCovers);
  };

  const removeAlbumCover = (index) => {
    const newCovers = [...albumCovers];
    newCovers[index] = { songLink: "", file: null, preview: null, name: "", url: null };
    setAlbumCovers(newCovers);
  };

  const editAlbumCover = (index) => {
    // Dosya input'unu tetikle
    const fileInput = document.getElementById(`album_cover_${index}`);
    if (fileInput) {
      fileInput.click();
    }
  };

  // Video Yönetmenleri fonksiyonları
  const addMusicVideo = () => {
    setMusicVideos([...musicVideos, { youtubeLink: "" }]);
  };

  const updateMusicVideo = (index, value) => {
    const newVideos = [...musicVideos];
    newVideos[index].youtubeLink = value;
    setMusicVideos(newVideos);
  };

  const removeMusicVideo = (index) => {
    const newVideos = musicVideos.filter((_, i) => i !== index);
    setMusicVideos(newVideos);
  };

  // Profil verilerini yükle
  useEffect(() => {
    const controller = new AbortController();

    // Component mount edildiğinde hemen loading başlat
    setIsProfileLoading(true);

    // ServiceData'yı ayrı olarak yükle - service type'a göre
    const loadServiceData = async (signal, serviceType) => {
      if (!serviceType || serviceType === 'none') {
        return;
      }
      setIsServiceDataLoading(true);
      
      try {
        // Service type'a göre doğru endpoint'i belirle
        let endpoint;
        switch (serviceType) {
          case 'producer':
          case 'music_producer':
            endpoint = '/api/profile/services/producer';
            break;
          case 'album_cover_designer':
          case 'album_cover_artist':
            endpoint = '/api/profile/services/album-cover-designer';
            break;
          case 'mix_engineer':
            endpoint = '/api/profile/services/mix-engineer';
            break;
          case 'songwriter':
            endpoint = '/api/profile/services/songwriter';
            break;
          case 'recording_studio':
            endpoint = '/api/profile/services/recording-studio';
            break;
          default:
            return;
        }
        
        const res = await fetch(endpoint, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          signal,
        });

        if (!res.ok) {
          let errorMsg = "Service verileri yüklenemedi";
          try {
            const errorData = await res.json();
            errorMsg = errorData.error || errorMsg;
          } catch {}
          return;
        }

        const data = await res.json();

        if (data.serviceData) {
          // Service type'a göre state'leri set et
          if ((serviceType === "producer" || serviceType === "music_producer") && data.serviceData.musicProjects) {
            const projects = data.serviceData.musicProjects.map(project => ({
              songName: project.songName || "",
              songDescription: project.songDescription || "",
              mediaFile: null,
              mediaPreview: null,
              mediaUrl: project.mediaUrl || null,
              link: project.link || ""
            }));
            setMusicProjects(projects);
            console.log("🎵 Music projects loaded:", projects);
          }
          
          if (serviceType === "album_cover_designer" && data.serviceData.albumCovers) {
            const covers = data.serviceData.albumCovers.slice(0, 4).map((cover, i) => ({
              songLink: cover?.songLink || "",
              file: null,
              preview: null,
              url: cover?.url || null,
              name: cover?.name || "",
              isNew: false
            }));
            setAlbumCovers(covers);
          }
          
          if (serviceType === "mix_engineer" && data.serviceData.mixSamples) {
            setMixSamples(data.serviceData.mixSamples);
          }
          
          if (serviceType === "songwriter" && data.serviceData.songSamples) {
            setSongSamples(data.serviceData.songSamples);
          }
          
          if (serviceType === "recording_studio" && data.serviceData.studioPhotos) {
            const photos = data.serviceData.studioPhotos.slice(0, 3).map(photo => ({
              file: null,
              preview: null,
              url: photo.url,
              name: photo.name || "Stüdyo Fotoğrafı",
              isNew: false
            }));
            
            setStudioPhotos(photos);
          }
          
        }

      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Service data yüklenirken hata:", error);
        }
      } finally {
        setIsServiceDataLoading(false);
      }
    };

    const loadProfile = async () => {
      setIsProfileLoading(true);
      
      try {
        let data;
        
        // Önce cache'i kontrol et
        if (profileCache && profileCache.profile) {
          data = profileCache;
        } else {
          // Cache yoksa API'den çek
          const res = await fetch("/api/profile/get", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            signal: controller.signal,
          });

          if (!res.ok) {
            let errorMsg = "Profil yüklenemedi";
            try {
              const errorData = await res.json();
              errorMsg = errorData.error || errorMsg;
            } catch {}
            toast.error(errorMsg);
            return;
          }

          data = await res.json();
        }

        if (!data.profile) return;

        const profile = data.profile;

        // Form verilerini set et
        setFormData2({
          provider_about: profile.about || "",
          provider_experience: profile.experience || "",
          provider_project_count: profile.projectCount || "",
          provider_response_time: profile.responseTime || "",
          provider_studio_name: profile.studioName || "",
        });

        // Platform linklerini set et
        console.log("🔗 Platform links from profile:", {
          youtubeLink: profile.youtubeLink,
          spotifyLink: profile.spotifyLink
        });
        setYoutubeLink(profile.youtubeLink || "");
        setSpotifyLink(profile.spotifyLink || "");
        
        // Platform seçimlerini belirle
        const platforms = [];
        if (profile.youtubeLink) platforms.push('youtube');
        if (profile.spotifyLink) platforms.push('spotify');
        setSelectedPlatforms(platforms);

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

        // Hizmet tipi
        if (profile.serviceType) {
          console.log("🔧 Setting service type:", profile.serviceType);
          setServiceType(profile.serviceType);
          
          // Önce profile'dan serviceData'yı direkt okumayı dene
          if (profile.serviceData) {
            console.log("📦 Found serviceData in profile:", profile.serviceData);
            
            // Service type'a göre state'leri set et
            if ((profile.serviceType === "producer" || profile.serviceType === "music_producer") && profile.serviceData.musicProjects) {
              const projects = profile.serviceData.musicProjects.map(project => ({
                songName: project.songName || "",
                songDescription: project.songDescription || "",
                mediaFile: null,
                mediaPreview: null,
                mediaUrl: project.mediaUrl || null,
                link: project.link || ""
              }));
              setMusicProjects(projects);
              console.log("🎵 Music projects loaded from profile:", projects);
            }
            
            // Recording studio için stüdyo fotoğrafları
            if (profile.serviceType === "recording_studio" && profile.serviceData.studioPhotos) {
              console.log("🏗️ Loading studio photos from profile:", profile.serviceData.studioPhotos);
              const photos = profile.serviceData.studioPhotos.slice(0, 3).map(photo => ({
                file: null,
                preview: null,
                url: photo.url,
                name: photo.name || "Stüdyo Fotoğrafı",
                isNew: false
              }));
              setStudioPhotos(photos);
              console.log("📸 Studio photos set in state:", photos);
            }
            
            // Album cover artist için albüm kapakları
            if (profile.serviceType === "album_cover_artist" && profile.serviceData.albumCovers) {
              const covers = profile.serviceData.albumCovers.slice(0, 4);
              const newAlbumCovers = [...albumCovers];
              covers.forEach((cover, index) => {
                if (index < 4) {
                  newAlbumCovers[index] = {
                    songLink: cover.songLink || "",
                    file: null,
                    preview: null,
                    url: cover.url,
                    name: cover.name || `Albüm Kapağı ${index + 1}`
                  };
                }
              });
              setAlbumCovers(newAlbumCovers);
            }
            
            // Music video director için video linkleri
            if (profile.serviceType === "music_video_director" && profile.serviceData.musicVideos) {
              setMusicVideos(profile.serviceData.musicVideos);
            }
          } else {
            // ServiceData yoksa API'den çek
            console.log("🌐 No serviceData in profile, loading from API");
            await loadServiceData(controller.signal, profile.serviceType);
          }
        }

        if (profile.specialties) {
          setExperiences(profile.specialties);
        }

        if (Array.isArray(profile.importantClients)) {
          setImportantClients(profile.importantClients);
        }

        if (profile.genres) {
          setSelectedGenres(profile.genres);
        }

      } catch (error) {
        if (error.name !== "AbortError") {
          toast.error("Profil verileri yüklenemedi");
        }
      } finally {
        console.log("✅ loadProfile tamamlandı, loading false yapılıyor");
        setIsProfileLoading(false);
      }
    };

    if (userInfo?.role === "PROVIDER") {
      console.log("🚀 PROVIDER user detected, starting loadProfile");
      loadProfile();
    } else if (userInfo) {
      console.log("⚠️ User role is not PROVIDER:", userInfo.role);
      // Eğer userInfo var ama PROVIDER değilse loading'i hemen kapat
      setIsProfileLoading(false);
      setIsServiceDataLoading(false);
    } else {
      console.log("⏳ Waiting for userInfo...");
      // userInfo henüz yüklenmediyse loading devam etsin
    }

    return () => {
      try {
        controller.abort();
      } catch {}
    };
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

  // Platform seçimi için handler
  const handlePlatformClick = (platform) => {
    setSelectedPlatforms((prev) => 
      prev.includes(platform) 
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  // Profil tamamlanmış mı kontrol et
  const isProfileComplete = () => {
    const basicFields = (
      formData2.provider_about &&
      formData2.provider_experience &&
      formData2.provider_project_count &&
      formData2.provider_response_time &&
      preview && // Avatar fotoğrafı
      experiences.length > 0 && // En az bir uzmanlık
      serviceType // Hizmet tipi seçili
    );

    // Kayıt stüdyoları için stüdyo adı da gerekli
    if (serviceType === "recording_studio") {
      return basicFields && formData2.provider_studio_name;
    }

    return basicFields;
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

    // Hizmet tipi kontrolü
    if (!serviceType) {
      toast.error("Lütfen hizmet tipinizi seçiniz");
      setIsLoading(false);
      return;
    }

    // Hizmet tipine özel validasyonlar
    if (serviceType === "recording_studio") {
      if (!formData2.provider_studio_name) {
        toast.error("Lütfen stüdyo adınızı giriniz");
        setIsLoading(false);
        return;
      }
      // Count both new files and existing photos
      const validStudioPhotos = studioPhotos.filter(photo => 
        photo?.file || (!photo?.isNew && photo?.url)
      );
      if (validStudioPhotos.length < 3) {
        toast.error("Lütfen 3 adet stüdyo fotoğrafı yükleyiniz");
        setIsLoading(false);
        return;
      }
    }

    if (serviceType === "music_producer") {
      if (musicProjects.length === 0) {
        toast.error("Lütfen en az bir müzik projesi ekleyiniz");
        setIsLoading(false);
        return;
      }
      for (let i = 0; i < musicProjects.length; i++) {
        if (!musicProjects[i].songName) {
          toast.error(`Proje ${i + 1} için şarkı adı gereklidir`);
          setIsLoading(false);
          return;
        }
      }
    }

    if (serviceType === "album_cover_artist") {
      // Count both new files and existing covers
      const validCovers = albumCovers.filter(cover => 
        cover?.file || (!cover?.isNew && cover?.url)
      );
      if (validCovers.length < 4) {
        toast.error("Lütfen 4 adet albüm kapağı tasarımı yükleyiniz");
        setIsLoading(false);
        return;
      }
    }

    if (serviceType === "music_video_director") {
      if (musicVideos.length === 0) {
        toast.error("Lütfen en az bir YouTube linki ekleyiniz");
        setIsLoading(false);
        return;
      }
      for (let i = 0; i < musicVideos.length; i++) {
        if (!musicVideos[i].youtubeLink) {
          toast.error(`Video ${i + 1} için YouTube linki gereklidir`);
          setIsLoading(false);
          return;
        }
      }
    }
    
    // Music projects'i serialize et (File objelerini base64'e çevir)
    const serializeMusicProjects = (projects) => {
      return projects.map(project => ({
        songName: project.songName || "",
        songDescription: project.songDescription || "",
        link: project.link || "",
        mediaFile: project.mediaFile ? {
          name: project.mediaFile.name,
          type: project.mediaFile.type,
          size: project.mediaFile.size
        } : null,
        mediaPreview: project.mediaPreview || null, // Base64 string
        mediaUrl: project.mediaUrl || null
      }));
    };
    
    const values = Object.fromEntries(new FormData(e.currentTarget));

    const requestData = {
      ...values,
      photos: preview,
      userPhotoName: fileName,
      background_image: backgroundPreview, // Arkaplan fotoğrafı eklendi

      // Platform linkleri
      youtubeLink: youtubeLink,
      spotifyLink: spotifyLink,

      // arrays
      provider_specialties: experiences,
      provider_important_clients: importantClients,
      provider_service_type: serviceType,
      genres: selectedGenres,

      // Hizmet tipine özel veriler
      studioPhotos: serviceType === "recording_studio" ? studioPhotos : [],
      musicProjects: serviceType === "music_producer" ? serializeMusicProjects(musicProjects) : [],
      albumCovers: (serviceType === "album_cover_artist" || serviceType === "album_cover_designer") ? albumCovers : [],
      musicVideos: (serviceType === "music_video_director" || serviceType === "music_video_director") ? musicVideos : [],

      userInfo, // { role: "PROVIDER", ... }
    };

    // Debug - Kontrol edelim
    console.log("🔍 DEBUG - Form gönderiliyor:");
    console.log("Service Type:", serviceType);
    console.log("Music Projects (original):", musicProjects);
    console.log("Music Projects (serialized):", serializeMusicProjects(musicProjects));
    console.log("Music Projects count:", musicProjects.length);
    
    if (musicProjects.length > 0) {
      const serialized = serializeMusicProjects(musicProjects);
      console.log("First project detail (serialized):", {
        songName: serialized[0]?.songName,
        hasMediaFile: !!serialized[0]?.mediaFile,
        hasMediaPreview: !!serialized[0]?.mediaPreview,
        mediaUrl: serialized[0]?.mediaUrl
      });
    }
    
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
        // Header'daki profil fotoğrafını güncellemek için AuthContext'i refresh et
        await checkAuth();
      }
    } catch (err) {
      toast.error("Sunucu hatası");
    } finally {
      setIsLoading(false); // Loading bitir
    }
  };

  return (
    <>
      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        onSubmit={handleProfilePage}
      >
      {/* Loading Indicator - FORM'UN EN ÜSTÜNDE */}
      {(isProfileLoading || isServiceDataLoading) && (
        <div className="flex items-center justify-center gap-3 p-6 bg-blue-500/10 border border-blue-500/20 rounded-xl mb-8 backdrop-blur">
          <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
          <span className="text-blue-400 font-semibold text-lg">
            {isProfileLoading && "Profil verileri yükleniyor..."}
            {!isProfileLoading && isServiceDataLoading && "Hizmet verileri yükleniyor..."}
          </span>
          <span className="text-xs text-gray-400 bg-gray-800/50 px-2 py-1 rounded">
            ({isProfileLoading ? "Ana veriler" : "Servis verileri"})
          </span>
        </div>
      )}

      <div className="flex gap-6">
        <div className="w-full md:w-1/2">
           {/* Hizmet Tipi Seçimi */}
          <div className="w-full mb-9 flex flex-col gap-4 items-start">
            <div className="w-full flex flex-1 flex-col">
              <div className="pb-3 text-xl font-bold">
                Ne Tür Bir Hizmet Vermek İstiyorsunuz?
              </div>
              
              {/* Hizmet Tipi Seçenekleri */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {serviceTypes.map((type) => (
                  <div
                    key={type.id}
                    onClick={() => handleServiceTypeChange(type.id)}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all hover:scale-105 ${
                      serviceType === type.id
                        ? "border-primary-500 bg-primary-500/10 text-primary-400"
                        : "border-gray-600 bg-gray-800/30 text-gray-300 hover:border-gray-500"
                    }`}
                  >
                    <h3 className="font-semibold text-lg mb-2">{type.name}</h3>
                  </div>
                ))}
              </div>

              {/* Seçilen Hizmet Tipi Gösterimi */}
              {serviceType && (
                <div className="p-4 bg-primary-500/10 border border-primary-500/20 rounded-xl mb-6">
                  <h4 className="text-lg font-semibold text-primary-400">
                    Seçilen Hizmet Tipi: {serviceTypes.find(st => st.id === serviceType)?.name}
                  </h4>
                </div>
              )}

              {/* Kayıt Stüdyoları - 3 Fotoğraf */}
              {serviceType === "recording_studio" && (
                <div className="space-y-6">
                  {/* Stüdyo Adı */}
                  <div>
                    <label className="block text-lg font-semibold text-white mb-3">Stüdyo Adı</label>
                    <input
                      type="text"
                      name="provider_studio_name"
                      value={formData2.provider_studio_name}
                      onChange={(e) => setFormData2(prev => ({ ...prev, provider_studio_name: e.target.value }))}
                      className="w-full py-3 px-4 bg-gray-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
                      placeholder="Stüdyo adınızı girin"
                      required
                    />
                  </div>
                  
                  <h5 className="text-lg font-semibold text-white">Stüdyo Fotoğrafları (3 Adet)</h5>
                  
                  {/* ServiceData loading durumunda skeleton göster */}
                  {isServiceDataLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[0, 1, 2].map((index) => (
                        <div key={index} className="w-full h-48 bg-gray-800/30 rounded-lg animate-pulse border border-gray-600">
                          <div className="w-full h-full flex items-center justify-center">
                            <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[0, 1, 2].map((index) => (
                      <div key={index} className="space-y-2">
                        <div className="w-full h-48 bg-gray-800 rounded-lg overflow-hidden border border-gray-600 relative group">
                          {studioPhotos[index]?.preview || studioPhotos[index]?.url ? (
                            <>
                              <img
                                src={studioPhotos[index]?.preview || studioPhotos[index]?.url}
                                alt={`Stüdyo ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                              {/* Hover overlay with buttons */}
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => editStudioPhoto(index)}
                                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                  title="Fotoğrafı Değiştir"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removeStudioPhoto(index)}
                                  className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                  title="Fotoğrafı Sil"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                              <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                                {studioPhotos[index]?.name || `Fotoğraf ${index + 1}`}
                              </div>
                              {/* Hidden file input for editing */}
                              <input
                                type="file"
                                id={`studio_photo_${index}`}
                                accept="image/*"
                                onChange={(e) => handleStudioPhotoChange(e, index)}
                                className="hidden"
                              />
                            </>
                          ) : (
                            <label className="w-full h-full cursor-pointer flex flex-col items-center justify-center hover:bg-gray-700/50 transition-colors">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleStudioPhotoChange(e, index)}
                                className="hidden"
                              />
                              <Upload className="w-8 h-8 text-gray-400 mb-2" />
                              <span className="text-sm text-gray-300">Fotoğraf {index + 1}</span>
                              <span className="text-xs text-gray-500">Max 5MB</span>
                            </label>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  )}
                </div>
              )}

              {/* Müzik Yapımcıları - Projeler */}
              {serviceType === "music_producer" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h5 className="text-lg font-semibold text-white">Müzik Projeleri</h5>
                    <button
                      type="button"
                      onClick={addMusicProject}
                      className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Proje Ekle
                    </button>
                  </div>
                  
                  
                  {isServiceDataLoading ? (
                    <div className="space-y-4">
                      {[0, 1].map((index) => (
                        <div key={index} className="p-4 bg-gray-800/30 border border-gray-600 rounded-xl animate-pulse">
                          <div className="flex items-center justify-center h-24">
                            <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                  {musicProjects.map((project, index) => (
                    <div key={index} className="p-4 bg-gray-800/50 border border-gray-600 rounded-xl space-y-4">
                      <div className="flex items-center justify-between">
                        <h6 className="text-md font-semibold text-white">Proje {index + 1}</h6>
                        <button
                          type="button"
                          onClick={() => removeMusicProject(index)}
                          className="p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Şarkı Adı</label>
                          <input
                            type="text"
                            value={project.songName}
                            onChange={(e) => updateMusicProject(index, 'songName', e.target.value)}
                            className="w-full py-2 px-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 text-white"
                            placeholder="Şarkı adını girin"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Link (Opsiyonel)</label>
                          <input
                            type="url"
                            value={project.link}
                            onChange={(e) => updateMusicProject(index, 'link', e.target.value)}
                            className="w-full py-2 px-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 text-white"
                            placeholder="Spotify/YouTube linki"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Açıklama</label>
                        <textarea
                          value={project.songDescription}
                          onChange={(e) => updateMusicProject(index, 'songDescription', e.target.value)}
                          className="w-full py-2 px-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 text-white h-20"
                          placeholder="Proje hakkında kısa açıklama"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Medya Dosyası (Fotoğraf/Video)</label>
                        <div className="w-full h-32 bg-gray-700 rounded-lg overflow-hidden border border-gray-600 relative group">
                          {project.mediaPreview || project.mediaUrl ? (
                            <>
                              {(project.mediaFile?.type?.startsWith('image/') || (project.mediaUrl && !project.mediaUrl.includes('.mp4'))) ? (
                                <img
                                  src={project.mediaPreview || project.mediaUrl}
                                  alt="Proje medyası"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <video
                                  src={project.mediaPreview || project.mediaUrl}
                                  className="w-full h-full object-cover"
                                  controls
                                />
                              )}
                              {/* Hover overlay with buttons */}
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => editMusicProjectMedia(index)}
                                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                  title="Medya Dosyasını Değiştir"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    updateMusicProject(index, 'mediaFile', null);
                                    updateMusicProject(index, 'mediaPreview', null);
                                    updateMusicProject(index, 'mediaUrl', null);
                                  }}
                                  className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                  title="Medya Dosyasını Sil"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                              {/* Hidden file input for editing */}
                              <input
                                type="file"
                                id={`music_project_media_${index}`}
                                accept="image/*,video/*"
                                onChange={(e) => handleMusicProjectFileChange(e, index)}
                                className="hidden"
                              />
                            </>
                          ) : (
                            <label className="w-full h-full cursor-pointer flex flex-col items-center justify-center hover:bg-gray-600/50 transition-colors">
                              <input
                                type="file"
                                accept="image/*,video/*"
                                onChange={(e) => handleMusicProjectFileChange(e, index)}
                                className="hidden"
                              />
                              <Upload className="w-6 h-6 text-gray-400 mb-1" />
                              <span className="text-sm text-gray-300">Medya Ekle</span>
                              <span className="text-xs text-gray-500">Max 5MB</span>
                            </label>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {musicProjects.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      <Music className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Henüz proje eklenmedi. "Proje Ekle" butonuna tıklayarak başlayın.</p>
                    </div>
                  )}
                  </>
                  )}
                </div>
              )}

              {/* Albüm Kapağı Tasarımcıları - 4 Kapak */}
              {serviceType === "album_cover_artist" && (
                <div className="space-y-6">
                  <h5 className="text-lg font-semibold text-white">Albüm Kapağı Tasarımları (4 Adet)</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[0, 1, 2, 3].map((index) => (
                      <div key={index} className="space-y-4">
                        <div className="w-full h-64 bg-gray-800 rounded-lg overflow-hidden border border-gray-600 relative group">
                          {albumCovers[index]?.preview || albumCovers[index]?.url ? (
                            <>
                              <img
                                src={albumCovers[index]?.preview || albumCovers[index]?.url}
                                alt={`Albüm Kapağı ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                              {/* Hover overlay with buttons */}
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => editAlbumCover(index)}
                                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                  title="Kapağı Değiştir"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removeAlbumCover(index)}
                                  className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                  title="Kapağı Sil"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                              <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                                {albumCovers[index]?.name || `Kapak ${index + 1}`}
                              </div>
                              {/* Hidden file input for editing */}
                              <input
                                type="file"
                                id={`album_cover_${index}`}
                                accept="image/*"
                                onChange={(e) => handleAlbumCoverChange(e, index)}
                                className="hidden"
                              />
                            </>
                          ) : (
                            <label className="w-full h-full cursor-pointer flex flex-col items-center justify-center hover:bg-gray-700/50 transition-colors">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleAlbumCoverChange(e, index)}
                                className="hidden"
                              />
                              <Image className="w-8 h-8 text-gray-400 mb-2" />
                              <span className="text-sm text-gray-300">Kapak {index + 1}</span>
                              <span className="text-xs text-gray-500">Max 5MB</span>
                            </label>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Şarkı Linki</label>
                          <input
                            type="url"
                            value={albumCovers[index]?.songLink || ''}
                            onChange={(e) => updateAlbumCover(index, 'songLink', e.target.value)}
                            className="w-full py-2 px-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 text-white"
                            placeholder="Spotify/YouTube linki"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Video Yönetmenleri - YouTube Linkleri */}
              {serviceType === "music_video_director" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h5 className="text-lg font-semibold text-white">Müzik Video Klipleri</h5>
                    <button
                      type="button"
                      onClick={addMusicVideo}
                      className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Video Ekle
                    </button>
                  </div>
                  
                  {musicVideos.map((video, index) => (
                    <div key={index} className="p-4 bg-gray-800/50 border border-gray-600 rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            YouTube Linki {index + 1}
                          </label>
                          <input
                            type="url"
                            value={video.youtubeLink}
                            onChange={(e) => updateMusicVideo(index, e.target.value)}
                            className="w-full py-2 px-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 text-white"
                            placeholder="https://youtube.com/watch?v=..."
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeMusicVideo(index)}
                          className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {musicVideos.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      <Link className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Henüz video eklenmedi. "Video Ekle" butonuna tıklayarak başlayın.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
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

          {/* Profil Fotoğrafı */}
          <div className="w-full mb-9">
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
                className={`relative w-24 h-24 border-2 border-dashed border-gray-600 rounded-full cursor-pointer hover:border-gray-500 transition-colors flex items-center justify-center overflow-hidden ${
                  preview ? 'border-primary-500' : ''
                }`}
              >
                {preview ? (
                  <>
                    <img
                      src={preview}
                      alt="Profil Fotoğrafı"
                      className="w-full h-full object-cover rounded-full"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 flex items-center justify-center text-white transition-opacity rounded-full">
                      <Upload className="w-5 h-5" />
                    </div>
                  </>
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
                  {preview ? 'Fotoğrafı Değiştir' : 'Fotoğraf Seç'}
                </label>
                <p className="text-xs text-gray-400 mt-1">
                  {fileName !== "Resminizi Yükleyiniz" ? fileName : 'JPG, PNG veya GIF (Max 5MB)'}
                </p>
                {preview && (
                  <p className="text-xs text-green-400 mt-1">
                    ✓ Profil fotoğrafınız yüklendi
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Arkaplan Fotoğrafı */}
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
                className={`relative w-full min-h-[200px] max-h-[200px] border-2 border-dashed border-gray-600 rounded-xl overflow-hidden cursor-pointer group transition duration-200 ${
                  backgroundPreview
                    ? "border-primary-500"
                    : "bg-gray-900/50 text-white flex flex-col justify-center items-center hover:bg-gray-900/80 hover:border-gray-500"
                }`}
              >
                {backgroundPreview ? (
                  <>
                    <img
                      src={backgroundPreview}
                      alt="Profil Sayfası Arkaplan Fotoğrafı"
                      className="w-full h-[200px] object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity">
                      <Upload className="w-6 h-6 mb-2" />
                      <span className="text-sm font-medium">Arkaplan Fotoğrafını Değiştir</span>
                      <span className="text-xs opacity-80 mt-1">1920x400 önerilen boyut</span>
                    </div>
                  </>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-300 font-medium">
                      Arkaplan Fotoğrafı Yükleyin
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      JPG, PNG veya GIF • En az 1920x400 piksel
                    </span>
                  </>
                )}
              </label>
              {backgroundPreview && (
                <p className="text-xs text-green-400 mt-2 flex items-center gap-1">
                  <span className="text-green-500">✓</span>
                  Arkaplan fotoğrafınız başarıyla yüklendi
                </p>
              )}
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
          {/* <div className="w-full mb-9 relative">
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
          </div> */}

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

        <div className="w-full mb-9  border border-primary-500/20 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Sosyal Medya Platformları</h3>
        
        {/* Platform Selection */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {/* YouTube Button */}
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

          {/* Spotify Button */}
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
              Spotify Profil Linki
            </label>
            <input
              type="url"
              value={spotifyLink}
              onChange={(e) => setSpotifyLink(e.target.value)}
              className="w-full py-3 px-4 bg-gray-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
              placeholder="https://open.spotify.com/artist/..."
            />
          </motion.div>
        )}
      </div>

          {/* Türler opsiyonel */}
          <div className="w-full mb-9 flex flex-col gap-4 items-start">
            <div className="w-full flex flex-1 flex-col">
              <div className="pb-3 text-xl font-bold">Hangi Türde Müzik Yapıyorsunuz?</div>
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                {genres.map((genre) => (
                  <div
                    key={genre}
                    onClick={() => handleGenreClick(genre)}
                    className={`cursor-pointer px-4 py-2 rounded-lg border transition-all whitespace-nowrap flex-shrink-0 ${
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
        <div className="w-full mt-6 p-4 bg-gradient-to-r from-primary-500/10 to-primary-400/5 border border-primary-500/20 rounded-xl md:w-1/2">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <ExternalLink className="w-5 h-5 text-primary-400" />
                Canlı Profil Linkiniz
              </h3>
              <div className="flex flex-col items-center gap-3 md:flex-row">
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
          <div className="flex flex-col items-center gap-3 md:flex-row">
            <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
              <span className="text-yellow-500 text-sm">ℹ️</span>
            </div>
            <div>
              <h3 className="text-yellow-300 font-semibold mb-1">Profilinizi Tamamlayın</h3>
              <p className="text-yellow-200/80 text-sm">
                Canlı profil linkinizi görmek için lütfen tüm gerekli alanları doldurun:
                Hakkında, deneyim bilgileri, fotoğraf, uzmanlıklar ve hizmet tipi.
              </p>
            </div>
          </div>
        </div>
      )}
    </motion.form>

    {/* Service Type Değiştirme Uyarı Modal'ı */}
    {showServiceTypeWarning && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-gray-800 rounded-xl p-6 max-w-md mx-4 border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
              <span className="text-red-500 text-xl">⚠️</span>
            </div>
            <h3 className="text-xl font-semibold text-white">Hizmet Tipi Değiştirilemez</h3>
          </div>
          
          <p className="text-gray-300 mb-6">
            Profiliniz tamamlandıktan sonra hizmet tipi değiştirilemez. 
            <br />
            <br />
            <span className="text-sm text-gray-400 mt-2 block">
              Yeni bir hizmet tipi kullanmak için yeni bir hesap oluşturmanız gerekir.
            </span>
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={handleServiceTypeWarningClose}
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Anladım
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
};
