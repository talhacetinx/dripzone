"use client";

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export const useOrders = (userType) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock kullanıcı
  const user = { id: 'user_1', name: 'Mehmet' };
  const profile = { user_type: userType };

  useEffect(() => {
    if (user && profile) {
      fetchOrders();
    }
  }, [user, profile, userType]);

  const fetchOrders = async () => {
    try {
      // Sahte veriler
      const allOrders = [
        {
          id: 'order_1',
          artist_id: 'user_1',
          provider_id: 'provider_1',
          service_id: 'service_1',
          total_amount: 100,
          provider_amount: 80,
          platform_fee: 20,
          requirements: 'Please deliver in 3 days',
          status: 'pending',
          payment_status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 'order_2',
          artist_id: 'user_2',
          provider_id: 'provider_1',
          service_id: 'service_2',
          total_amount: 200,
          provider_amount: 160,
          platform_fee: 40,
          requirements: 'Urgent delivery',
          status: 'completed',
          payment_status: 'paid',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];

      let filtered = allOrders;

      if (userType === 'artist') {
        filtered = allOrders.filter(o => o.artist_id === user.id);
      } else if (userType === 'provider') {
        filtered = allOrders.filter(o => o.provider_id === user.id);
      }

      setOrders(filtered);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Error loading orders');
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (orderData) => {
    try {
      const provider_amount = Math.round(orderData.total_amount * 0.8 * 100) / 100;
      const platform_fee = Math.round(orderData.total_amount * 0.2 * 100) / 100;

      const newOrder = {
        id: `order_${Math.random().toString(36).substring(2, 9)}`,
        artist_id: user.id,
        service_id: orderData.service_id,
        provider_id: orderData.provider_id,
        total_amount: orderData.total_amount,
        provider_amount,
        platform_fee,
        requirements: orderData.requirements,
        status: 'pending',
        payment_status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setOrders(prev => [newOrder, ...prev]);
      toast.success('Order created successfully!');
      return newOrder;
    } catch (error) {
      toast.error('Error creating order');
      throw error;
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      setOrders(prev =>
        prev.map(order =>
          order.id === id ? { ...order, status, updated_at: new Date().toISOString() } : order
        )
      );
      toast.success('Order status updated!');
    } catch (error) {
      toast.error('Failed to update status');
      throw error;
    }
  };

  const updatePaymentStatus = async (id, payment_status) => {
    try {
      setOrders(prev =>
        prev.map(order =>
          order.id === id ? { ...order, payment_status, updated_at: new Date().toISOString() } : order
        )
      );
      toast.success('Payment status updated!');
    } catch (error) {
      toast.error('Failed to update payment status');
      throw error;
    }
  };

  return {
    orders,
    loading,
    createOrder,
    updateOrderStatus,
    updatePaymentStatus,
    refetch: fetchOrders,
  };
};