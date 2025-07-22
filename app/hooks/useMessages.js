"use client"

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';

export const useMessages = (conversationUserId) => {
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const user = session?.user;

  useEffect(() => {
    if (user) {
      if (conversationUserId) {
        fetchMessages(conversationUserId);
      } else {
        fetchConversations();
      }
    }
  }, [user, conversationUserId]);

  const fetchMessages = async (otherUserId) => {
    if (!user) return;

    try {
      setLoading(true);

      const res = await fetch(`/api/messages?otherUserId=${otherUserId}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Mesajlar alınamadı');
      setMessages(data.messages || []);

      await fetch(`/api/messages/mark-read`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderId: otherUserId, recipientId: user.id }),
      });
    } catch (err) {
      console.error('Mesajlar alınamadı:', err);
      toast.error('Mesajlar yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const fetchConversations = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const res = await fetch(`/api/conversations?userId=${user.id}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Konuşmalar alınamadı');
      setConversations(data.conversations || []);
    } catch (err) {
      console.error('Konuşmalar alınamadı:', err);
      toast.error('Konuşmalar yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (recipientId, content, orderId) => {
    if (!user) {
      toast.error('Kullanıcı oturumu yok');
      return;
    }

    try {
      const res = await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: user.id,
          recipientId,
          content,
          orderId,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Mesaj gönderilemedi');

      setMessages((prev) => [...prev, data.message]);
      return data.message;
    } catch (err) {
      toast.error(err.message || 'Mesaj gönderilemedi');
      throw err;
    }
  };

  return {
    messages,
    conversations,
    loading,
    sendMessage,
    refetch: conversationUserId
      ? () => fetchMessages(conversationUserId)
      : fetchConversations,
  };
};
