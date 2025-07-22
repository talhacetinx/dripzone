"use client";

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const exampleServices = [
  {
    id: 'example-1',
    provider_id: 'example-provider-1',
    title: 'Professional Hip-Hop Beat Production',
    description: 'Custom hip-hop beats with professional mixing and mastering.',
    category: 'producers',
    price: 250,
    delivery_time: 5,
    revisions: 3,
    features: ['Custom beat production', 'Professional mixing', 'WAV + MP3 delivery'],
    images: ['https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400'],
    active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    provider: {
      full_name: 'Serkan Yıldız',
      avatar_url: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100',
      verified: true,
      location: 'Istanbul, Turkey'
    }
  },
  {
    id: 'example-2',
    provider_id: 'example-provider-2',
    title: 'Professional Recording Studio Session',
    description: 'State-of-the-art recording studio with professional equipment.',
    category: 'recording-studios',
    price: 150,
    delivery_time: 1,
    revisions: 2,
    features: ['Professional studio', 'Sound engineer included', 'High-quality equipment'],
    images: ['/Untitled-1-min copy copy copy copy.png'],
    active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    provider: {
      full_name: 'Studio Pro',
      avatar_url: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100',
      verified: true,
      location: 'Los Angeles, CA'
    }
  }
];

export const useServices = (category, providerId) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, [category, providerId]);

  const fetchServices = async () => {
    try {
      let filtered = exampleServices.filter(service => service.active);

      if (category) {
        filtered = filtered.filter(service => service.category === category);
      }

      if (providerId) {
        filtered = filtered.filter(service => service.provider_id === providerId);
      }

      setServices(filtered);
    } catch (error) {
      toast.error('Error loading services');
    } finally {
      setLoading(false);
    }
  };

  const createService = async (serviceData) => {
    try {
      const newService = {
        id: `mock-${Math.random().toString(36).substr(2, 9)}`,
        ...serviceData,
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        provider: {
          full_name: 'Mock Provider',
          avatar_url: '',
          verified: false,
          location: 'Mock City'
        }
      };

      setServices(prev => [newService, ...prev]);
      toast.success('Service created successfully!');
      return newService;
    } catch (error) {
      toast.error('Error creating service');
      throw error;
    }
  };

  const updateService = async (id, updates) => {
    try {
      const updatedServices = services.map(service =>
        service.id === id
          ? { ...service, ...updates, updated_at: new Date().toISOString() }
          : service
      );

      setServices(updatedServices);
      toast.success('Service updated successfully!');
      return updatedServices.find(service => service.id === id);
    } catch (error) {
      toast.error('Error updating service');
      throw error;
    }
  };

  const deleteService = async (id) => {
    try {
      const updatedServices = services.filter(service => service.id !== id);
      setServices(updatedServices);
      toast.success('Service deleted successfully!');
    } catch (error) {
      toast.error('Error deleting service');
      throw error;
    }
  };

  return {
    services,
    loading,
    createService,
    updateService,
    deleteService,
    refetch: fetchServices,
  };
};