"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Package, Clock, CheckCircle, XCircle, Search, Filter } from "lucide-react";

const OrdersTab = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    // Mock data - provider tarzında
    const mockOrders = [
        {
            id: 'ORD001',
            customer: {
                name: 'Ahmet Yılmaz',
                email: 'ahmet@example.com',
                avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
            },
            service: {
                title: 'Beat Production',
                category: 'Music Production'
            },
            provider: {
                name: 'Studio Pro',
                email: 'studio@example.com'
            },
            amount: 150,
            commission: 30,
            provider_amount: 120,
            status: 'completed',
            createdAt: new Date('2024-01-15'),
            deliveredAt: new Date('2024-01-20'),
        },
        {
            id: 'ORD002',
            customer: {
                name: 'Elif Kaya',
                email: 'elif@example.com',
                avatar: 'https://randomuser.me/api/portraits/women/45.jpg'
            },
            service: {
                title: 'Mixing & Mastering',
                category: 'Audio Engineering'
            },
            provider: {
                name: 'Sound Lab',
                email: 'soundlab@example.com'
            },
            amount: 200,
            commission: 40,
            provider_amount: 160,
            status: 'pending',
            createdAt: new Date('2024-01-18'),
            deliveredAt: null,
        },
        {
            id: 'ORD003',
            customer: {
                name: 'Can Demir',
                email: 'can@example.com',
                avatar: 'https://randomuser.me/api/portraits/men/68.jpg'
            },
            service: {
                title: 'Vocal Recording',
                category: 'Recording'
            },
            provider: {
                name: 'Vocal Studio',
                email: 'vocal@example.com'
            },
            amount: 100,
            commission: 20,
            provider_amount: 80,
            status: 'cancelled',
            createdAt: new Date('2024-01-10'),
            deliveredAt: null,
        }
    ];

    useEffect(() => {
        // Simulate loading
        setLoading(true);
        setTimeout(() => {
            setOrders(mockOrders);
            setLoading(false);
        }, 1000);
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString("tr-TR", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            completed: {
                color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
                icon: CheckCircle,
                label: "Tamamlandı"
            },
            pending: {
                color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
                icon: Clock,
                label: "Beklemede"
            },
            cancelled: {
                color: "bg-red-500/20 text-red-400 border-red-500/30",
                icon: XCircle,
                label: "İptal"
            },
            processing: {
                color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
                icon: Package,
                label: "İşleniyor"
            }
        };

        const config = statusConfig[status] || statusConfig.pending;
        const Icon = config.icon;

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${config.color} flex items-center gap-1 w-fit`}>
                <Icon className="w-3 h-3" />
                {config.label}
            </span>
        );
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            order.service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            order.provider.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === "all" || order.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const totalRevenue = orders
        .filter(o => o.status === 'completed')
        .reduce((sum, order) => sum + order.commission, 0);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header with Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-900 border border-gray-700 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">Toplam Sipariş</p>
                            <p className="text-2xl font-bold text-white">{orders.length}</p>
                        </div>
                        <Package className="w-8 h-8 text-blue-400" />
                    </div>
                </div>
                <div className="bg-gray-900 border border-gray-700 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">Tamamlanan</p>
                            <p className="text-2xl font-bold text-white">{orders.filter(o => o.status === 'completed').length}</p>
                        </div>
                        <CheckCircle className="w-8 h-8 text-emerald-400" />
                    </div>
                </div>
                <div className="bg-gray-900 border border-gray-700 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">Beklemede</p>
                            <p className="text-2xl font-bold text-white">{orders.filter(o => o.status === 'pending').length}</p>
                        </div>
                        <Clock className="w-8 h-8 text-yellow-400" />
                    </div>
                </div>
                <div className="bg-gray-900 border border-gray-700 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">Komisyon Geliri</p>
                            <p className="text-2xl font-bold text-white">${totalRevenue}</p>
                        </div>
                        <Package className="w-8 h-8 text-primary-400" />
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-white mb-1">
                        Siparişler ({filteredOrders.length})
                    </h2>
                    <p className="text-gray-400 text-sm">Tüm platform siparişlerini yönetin</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Sipariş ara..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                </div>
                <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="pl-10 pr-8 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                        <option value="all">Tüm Durumlar</option>
                        <option value="pending">Beklemede</option>
                        <option value="processing">İşleniyor</option>
                        <option value="completed">Tamamlandı</option>
                        <option value="cancelled">İptal</option>
                    </select>
                </div>
            </div>

            {filteredOrders.length === 0 ? (
                <div className="text-center py-12">
                    <div className="mb-4">
                        <div className="mx-auto h-24 w-24 bg-gray-800 rounded-full flex items-center justify-center">
                            <Package className="h-12 w-12 text-gray-600" />
                        </div>
                    </div>
                    
                    <h3 className="text-lg font-medium text-white mb-2">
                        {searchTerm || filterStatus !== "all" ? "Arama Sonucu Bulunamadı" : "Henüz Sipariş Yok"}
                    </h3>
                    
                    <p className="text-gray-400 mb-6 max-w-md mx-auto">
                        {searchTerm || filterStatus !== "all" 
                            ? "Arama kriterlerinizi değiştirip tekrar deneyin."
                            : "Platform üzerinde henüz sipariş bulunmuyor. Kullanıcılar hizmet satın aldığında burada görünecek."
                        }
                    </p>
                </div>
            ) : (
                <div className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-700">
                            <thead className="bg-gray-800">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Sipariş
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Müşteri
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Hizmet Sağlayıcı
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Durum
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Tutar
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Tarih
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {filteredOrders.map((order, index) => (
                                    <motion.tr 
                                        key={order.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="hover:bg-gray-800 transition-colors"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-white">
                                                    {order.id}
                                                </div>
                                                <div className="text-sm text-gray-400">
                                                    {order.service.title}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {order.service.category}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-8 w-8">
                                                    <img
                                                        className="h-8 w-8 rounded-full object-cover"
                                                        src={order.customer.avatar}
                                                        alt={order.customer.name}
                                                    />
                                                </div>
                                                <div className="ml-3">
                                                    <div className="text-sm font-medium text-white">
                                                        {order.customer.name}
                                                    </div>
                                                    <div className="text-sm text-gray-400">
                                                        {order.customer.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-white">{order.provider.name}</div>
                                            <div className="text-sm text-gray-400">{order.provider.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(order.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-white font-medium">${order.amount}</div>
                                            <div className="text-xs text-gray-400">Komisyon: ${order.commission}</div>
                                            <div className="text-xs text-gray-500">Provider: ${order.provider_amount}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                            <div>Sipariş: {formatDate(order.createdAt)}</div>
                                            {order.deliveredAt && (
                                                <div className="text-xs text-gray-500">
                                                    Teslim: {formatDate(order.deliveredAt)}
                                                </div>
                                            )}
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrdersTab;
