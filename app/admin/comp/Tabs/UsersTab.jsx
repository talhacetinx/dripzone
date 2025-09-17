"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, MoreVertical, Check, Trash2, X, AlertTriangle, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

const UsersTab = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterRole, setFilterRole] = useState("all");
    const [dropdownOpen, setDropdownOpen] = useState(null);
    const [deleteModal, setDeleteModal] = useState({ open: false, user: null });
    const [processing, setProcessing] = useState(false);
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(15);
    
    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownOpen && !event.target.closest('.dropdown-container')) {
                setDropdownOpen(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [dropdownOpen]);

    const fetchUsers = async () => {
        try {
            const response = await fetch("/api/admin/users");
            
            if (!response.ok) {
                const errorText = await response.text();
            }
            
            const data = await response.json();
            
            data.users?.forEach(user => {
                console.log(`👤 ${user.name} (${user.user_name}): userPending = ${user.userPending} (${user.userPending ? 'Onay Bekliyor' : 'Onaylandı'})`);
            });
            
            setUsers(data.users || []);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const approveUser = async (userId) => {
        setProcessing(true);
        try {
            const response = await fetch(`/api/admin/users/${userId}/approve`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                await fetchUsers();
                setDropdownOpen(null);
            } else {
                console.error("❌ Kullanıcı onaylama hatası");
            }
        } catch (error) {
            console.error("❌ Approve error:", error);
        } finally {
            setProcessing(false);
        }
    };

    const deleteUser = async (userId) => {
        setProcessing(true);
        try {
            const response = await fetch(`/api/admin/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                // Kullanıcı listesini yeniden yükle
                await fetchUsers();
                setDeleteModal({ open: false, user: null });
                setDropdownOpen(null);
            } else {
                console.error("❌ Kullanıcı silme hatası");
            }
        } catch (error) {
            console.error("❌ Delete error:", error);
        } finally {
            setProcessing(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("tr-TR", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getRoleBadge = (role) => {
        const roleColors = {
            ADMIN: "bg-red-500/20 text-red-400 border-red-500/30",
            PROVIDER: "bg-blue-500/20 text-blue-400 border-blue-500/30",
            ARTIST: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
            USER: "bg-gray-500/20 text-gray-400 border-gray-500/30",
        };

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${roleColors[role] || roleColors.USER}`}>
                {role}
            </span>
        );
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.user_name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === "all" || user.role === filterRole;
        return matchesSearch && matchesRole;
    });

    // Pagination calculations
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    // Reset to first page when search/filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterRole]);

    const goToPage = (pageNumber) => {
        setCurrentPage(pageNumber);
        setDropdownOpen(null); // Close any open dropdowns when changing pages
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <div className="text-red-400 mb-4">❌ {error}</div>
                <button
                    onClick={fetchUsers}
                    className="bg-primary-600 text-black px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                    Tekrar Dene
                </button>
            </div>
        );
    }

    console.log("al sana data:" ,users);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-white mb-1">
                        Kullanıcılar ({filteredUsers.length})
                    </h2>
                    <p className="text-gray-400 text-sm">
                        Tüm platform kullanıcılarını yönetin 
                        {totalPages > 1 && (
                            <span className="ml-2">
                                • Sayfa {currentPage} / {totalPages}
                            </span>
                        )}
                    </p>
                </div>
                <button
                    onClick={fetchUsers}
                    className="bg-primary-600 text-black px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
                >
                    🔄 Yenile
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Kullanıcı ara..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                </div>
                <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <select
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        className="pl-10 pr-8 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                        <option value="all">Tüm Roller</option>
                        <option value="ADMIN">Admin</option>
                        <option value="PROVIDER">Provider</option>
                        <option value="ARTIST">Artist</option>
                        <option value="USER">User</option>
                    </select>
                </div>
            </div>

            {filteredUsers.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                    {searchTerm || filterRole !== "all" ? "Arama kriterlerine uygun kullanıcı bulunamadı." : "Henüz kullanıcı bulunmuyor."}
                </div>
            ) : (
                <div className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-700">
                            <thead className="bg-gray-800">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Kullanıcı
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Rol
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Kayıt Tarihi
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Durum
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Profil Sayfası
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        İşlemler
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {currentUsers.map((user, index) => (
                                    <motion.tr 
                                        key={user.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="hover:bg-gray-800 transition-colors"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    {user.user_photo ? (
                                                        <img
                                                            className="h-10 w-10 rounded-full object-cover"
                                                            src={user.user_photo}
                                                            alt={user.name}
                                                        />
                                                    ) : (
                                                        <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
                                                            <span className="text-gray-300 font-medium">
                                                                {user.name?.charAt(0)?.toUpperCase()}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-white">
                                                        {user.name}
                                                    </div>
                                                    <div className="text-sm text-gray-400">
                                                        @{user.user_name}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-300">{user.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getRoleBadge(user.role)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                            {formatDate(user.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                !user.userPending 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {!user.userPending ? 'Onaylandı' : 'Onay Bekliyor'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {user.user_name ? (
                                                <div className="flex items-center space-x-2">
                                                    <Link 
                                                        href={`/profile/${user.user_name}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium hover:underline"
                                                    >
                                                        <span>Profile Git</span>
                                                        <ExternalLink className="w-3 h-3" />
                                                    </Link>
                                                </div>
                                            ) : (
                                                <span className="text-gray-500 text-sm">
                                                    Profil yok
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative dropdown-container">
                                            <button 
                                                onClick={() => setDropdownOpen(dropdownOpen === user.id ? null : user.id)}
                                                className="text-gray-400 hover:text-white transition-colors"
                                            >
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                            
                                            {dropdownOpen === user.id && (
                                                <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
                                                    <div className="py-1">
                                                        {/* Geçici: Her kullanıcı için onay butonunu göster (test için) */}
                                                        <button
                                                            onClick={() => approveUser(user.id)}
                                                            disabled={processing}
                                                            className="w-full text-left px-4 py-2 text-sm text-green-400 hover:bg-gray-700 transition-colors flex items-center gap-2"
                                                        >
                                                            <Check className="w-4 h-4" />
                                                            Kullanıcıyı Onayla
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setDeleteModal({ open: true, user });
                                                                setDropdownOpen(null);
                                                            }}
                                                            disabled={processing}
                                                            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 transition-colors flex items-center gap-2"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                            Kullanıcıyı Sil
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="px-6 py-4 border-t border-gray-700 flex items-center justify-between">
                            <div className="text-sm text-gray-400">
                                {indexOfFirstUser + 1}-{Math.min(indexOfLastUser, filteredUsers.length)} / {filteredUsers.length} kullanıcı gösteriliyor
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => goToPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-300 bg-gray-800 border border-gray-600 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronLeft className="w-4 h-4 mr-1" />
                                    Önceki
                                </button>
                                
                                <div className="flex items-center space-x-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                                        <button
                                            key={pageNumber}
                                            onClick={() => goToPage(pageNumber)}
                                            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                                currentPage === pageNumber
                                                    ? 'bg-primary-600 text-black'
                                                    : 'text-gray-300 bg-gray-800 border border-gray-600 hover:bg-gray-700'
                                            }`}
                                        >
                                            {pageNumber}
                                        </button>
                                    ))}
                                </div>
                                
                                <button
                                    onClick={() => goToPage(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-300 bg-gray-800 border border-gray-600 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Sonraki
                                    <ChevronRight className="w-4 h-4 ml-1" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Silme Modal */}
            {deleteModal.open && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-gray-900 border border-gray-700 rounded-lg p-6 max-w-md w-full mx-4"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center">
                                <AlertTriangle className="w-6 h-6 text-red-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white">Kullanıcıyı Sil</h3>
                                <p className="text-sm text-gray-400">Bu işlem geri alınamaz</p>
                            </div>
                        </div>
                        
                        <div className="mb-6">
                            <p className="text-gray-300 mb-2">
                                <span className="font-medium">{deleteModal.user?.name}</span> kullanıcısını silmek istediğinize emin misiniz?
                            </p>
                            <p className="text-sm text-gray-400">
                                Bu kullanıcının tüm verileri kalıcı olarak silinecektir.
                            </p>
                        </div>

                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setDeleteModal({ open: false, user: null })}
                                disabled={processing}
                                className="px-4 py-2 text-gray-400 hover:text-white border border-gray-600 rounded-lg hover:border-gray-500 transition-colors"
                            >
                                İptal
                            </button>
                            <button
                                onClick={() => deleteUser(deleteModal.user.id)}
                                disabled={processing}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                            >
                                {processing ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Siliniyor...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 className="w-4 h-4" />
                                        Evet, Sil
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default UsersTab;
