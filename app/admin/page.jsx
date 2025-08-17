"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import AdminDashboard from "./comp/AdminDashboard";

export default function AdminPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("🔍 Admin page - useEffect çalışıyor");
    console.log("🔍 isLoading:", isLoading);
    console.log("🔍 user:", user);
    
    // Eğer user bilgisi varsa ve ADMIN rolü varsa direkt izin ver
    if (user && user.role === "ADMIN") {
      console.log("✅ AuthContext'ten admin yetkisi bulundu");
      setLoading(false);
      return;
    }
    
    // Eğer loading durumu hala devam ediyorsa bekle
    if (isLoading === undefined || isLoading === true) {
      console.log("⏳ Hala yükleniyor, bekleyerek...");
      return;
    }
    
    // Cookie'den token kontrol et
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];
    
    console.log("🎫 Cookie'den token bulundu:", !!token);
    
    if (token) {
      try {
        // JWT decode etmek için base64 decode
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log("🔍 Token decode edildi:", payload);
        
        if (payload.isAdmin && payload.role === "ADMIN") {
          console.log("✅ Token'da admin yetkisi bulundu");
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error("Token decode hatası:", err);
      }
    }
    
    // Kullanıcı giriş yapmamışsa admin girişine yönlendir
    if (!user) {
      console.log("❌ User yok, dripzone-login'e yönlendiriliyor");
      router.push("/dripzone-login");
      return;
    }

    // Admin değilse ana sayfaya yönlendir
    if (user.role !== "ADMIN") {
      console.log("❌ Admin rolü yok, ana sayfaya yönlendiriliyor. Rol:", user.role);
      router.push("/");
      return;
    }

    console.log("✅ Admin kontrolü başarılı");
    setLoading(false);
  }, [user, isLoading, router]);

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return <AdminDashboard />;
}