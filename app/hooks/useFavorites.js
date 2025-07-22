"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";

// Sahte kullanıcı simülasyonu
const mockUser = {
  id: "user_123",
  name: "Test User",
};

// Sahte favori hizmetler (initial state)
const mockServices = [
  {
    id: "srv1",
    title: "Mock Service 1",
    description: "Description for service 1",
    price: 100,
    images: ["https://via.placeholder.com/150"],
    provider: {
      full_name: "Provider One",
      avatar_url: "https://via.placeholder.com/50",
    },
  },
  {
    id: "srv2",
    title: "Mock Service 2",
    description: "Description for service 2",
    price: 150,
    images: ["https://via.placeholder.com/150"],
    provider: {
      full_name: "Provider Two",
      avatar_url: "https://via.placeholder.com/50",
    },
  },
];

export const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = mockUser; // Gerçek user yerine sahte kullanıcı

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      // Başlangıçta sadece 1 favori olsun
      setFavorites([
        {
          id: "fav1",
          user_id: user.id,
          service_id: "srv1",
          service: mockServices[0],
        },
      ]);
    } catch (error) {
      toast.error("Error loading favorites");
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = async (serviceId) => {
    if (!user) throw new Error("User not authenticated");

    const exists = favorites.some((fav) => fav.service_id === serviceId);
    if (exists) {
      toast.info("Already in favorites");
      return;
    }

    const service = mockServices.find((s) => s.id === serviceId);
    if (!service) {
      toast.error("Service not found");
      return;
    }

    const newFavorite = {
      id: `fav_${Date.now()}`,
      user_id: user.id,
      service_id: service.id,
      service,
    };

    setFavorites((prev) => [newFavorite, ...prev]);
    toast.success("Added to favorites!");
  };

  const removeFromFavorites = async (serviceId) => {
    if (!user) return;

    setFavorites((prev) => prev.filter((fav) => fav.service_id !== serviceId));
    toast.success("Removed from favorites!");
  };

  const isFavorite = (serviceId) => {
    return favorites.some((fav) => fav.service_id === serviceId);
  };

  return {
    favorites,
    loading,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    refetch: fetchFavorites,
  };
};
