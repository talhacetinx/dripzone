"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users, ShoppingBag, DollarSign, UserCheck
} from "lucide-react";
import UsersTab from "./Tabs/UsersTab";
import OrdersTab from "./Tabs/OrdersTab";

// Mock data - provider tarzında
const mockUsers = [
  {
    id: '1',
    name: 'Ahmet Yılmaz',
    email: 'ahmet@example.com',
    role: 'PROVIDER',
    createdAt: new Date(),
    user_photo: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  {
    id: '2',
    name: 'Elif Kaya',
    email: 'elif@example.com',
    role: 'ARTIST',
    createdAt: new Date(),
    user_photo: 'https://randomuser.me/api/portraits/women/45.jpg'
  },
  {
    id: '3',
    name: 'Can Demir',
    email: 'can@example.com',
    role: 'USER',
    createdAt: new Date(),
    user_photo: 'https://randomuser.me/api/portraits/men/68.jpg'
  }
];

const mockOrders = [
  {
    id: '001',
    customer: 'John Doe',
    service: 'Beat Production',
    amount: 150,
    status: 'completed',
    createdAt: new Date()
  },
  {
    id: '002',
    customer: 'Jane Smith',
    service: 'Mixing & Mastering',
    amount: 200,
    status: 'pending',
    createdAt: new Date()
  }
];

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState("users");
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Gerçek kullanıcıları API'den çek
    const fetchRealUsers = async () => {
        try {
            console.log("🔍 AdminDashboard - Gerçek kullanıcılar çekiliyor...");
            const response = await fetch("/api/admin/users");
            if (response.ok) {
                const data = await response.json();
                console.log("✅ AdminDashboard - Kullanıcılar getirildi:", data.users?.length);
                setUsers(data.users || []);
            } else {
                console.log("⚠️ AdminDashboard - API başarısız, mock kullanılıyor");
                setUsers(mockUsers);
            }
        } catch (error) {
            console.error("❌ AdminDashboard - Kullanıcı çekme hatası:", error);
            setUsers(mockUsers);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            await fetchRealUsers();
            setOrders(mockOrders); // Siparişler henüz mock
            setIsLoading(false);
        };
        
        loadData();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    const totalUsers = users.length;
    const totalProviders = users.filter(u => u.role === 'PROVIDER').length;
    const totalRevenue = orders
        .filter(o => o.status === 'completed')
        .reduce((sum, order) => sum + order.amount, 0);
    const pendingOrders = orders.filter(o => o.status === 'pending').length;

    const stats = [
        {
            title: 'Total Users',
            value: totalUsers,
            subtitle: 'Registered users',
            icon: Users,
            color: 'text-blue-400',
            bgColor: 'bg-blue-500/10',
            borderColor: 'border-blue-500/20'
        },
        {
            title: 'Active Providers',
            value: totalProviders,
            subtitle: 'Service providers',
            icon: UserCheck,
            color: 'text-emerald-400',
            bgColor: 'bg-emerald-500/10',
            borderColor: 'border-emerald-500/20'
        },
        {
            title: 'Total Revenue',
            value: `$${totalRevenue}`,
            subtitle: 'Platform earnings',
            icon: DollarSign,
            color: 'text-yellow-400',
            bgColor: 'bg-yellow-500/10',
            borderColor: 'border-yellow-500/20'
        },
        {
            title: 'Pending Orders',
            value: pendingOrders,
            subtitle: 'Awaiting processing',
            icon: ShoppingBag,
            color: 'text-primary-400',
            bgColor: 'bg-primary-500/10',
            borderColor: 'border-primary-500/20'
        }
    ];

    const tabs = [
        { key: "users", label: "Kullanıcılar", component: UsersTab },
        { key: "orders", label: "Siparişler", component: OrdersTab },
    ];

    const ActiveComponent = tabs.find(tab => tab.key === activeTab)?.component;

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="container mx-auto px-6 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Admin Panel</h1>
                    <div className="text-sm text-gray-400">Sistem yönetimi ve kontrolü</div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={`bg-gray-900 border ${stat.borderColor} p-4 rounded-lg`}
                        >
                            <div className="flex justify-between items-center mb-2">
                                <div className={`w-10 h-10 ${stat.bgColor} flex items-center justify-center rounded-md`}>
                                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                </div>
                            </div>
                            <div className="text-xl font-bold">{stat.value}</div>
                            <div className="text-sm text-gray-400">{stat.title}</div>
                            {stat.subtitle && <div className="text-xs text-gray-500">{stat.subtitle}</div>}
                        </motion.div>
                    ))}
                </div>

                {/* Tab Buttons */}
                <div className="overflow-x-auto flex space-x-4 border-b border-gray-700 mb-6">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`pb-2 text-md font-semibold ${
                                activeTab === tab.key 
                                    ? 'text-primary-500 border-b-2 border-primary-500' 
                                    : 'text-gray-400'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="space-y-6">
                    {ActiveComponent && <ActiveComponent />}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
