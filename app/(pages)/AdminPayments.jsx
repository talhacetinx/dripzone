import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Filter, Download, MoreHorizontal, Eye, 
  CheckCircle, Clock, AlertCircle, XCircle, TrendingUp,
  Calendar, DollarSign, CreditCard, RefreshCw
} from 'lucide-react';

export const AdminPayments: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [searchTerm, setSearchTerm] = useState('');

  const paymentStats = [
    {
      title: 'Total Revenue',
      value: '$127,543.89',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20'
    },
    {
      title: 'Successful Payments',
      value: '1,247',
      change: '+8.2%',
      trend: 'up',
      icon: CheckCircle,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20'
    },
    {
      title: 'Pending Payments',
      value: '23',
      change: '-15.3%',
      trend: 'down',
      icon: Clock,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/20'
    },
    {
      title: 'Failed Payments',
      value: '12',
      change: '-22.1%',
      trend: 'down',
      icon: XCircle,
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/20'
    }
  ];

  const payments = [
    {
      id: 'PAY-001',
      transactionId: 'txn_1234567890',
      user: 'Ahmet Yılmaz',
      userEmail: 'ahmet@example.com',
      service: 'Hip-Hop Beat Production',
      provider: 'Serkan Yıldız',
      amount: 250.00,
      fee: 12.50,
      netAmount: 237.50,
      status: 'completed',
      paymentMethod: 'Credit Card',
      date: '2024-01-15T14:30:00Z',
      currency: 'USD'
    },
    {
      id: 'PAY-002',
      transactionId: 'txn_1234567891',
      user: 'Elif Kaya',
      userEmail: 'elif@example.com',
      service: 'Album Cover Design',
      provider: 'Design Studio',
      amount: 180.00,
      fee: 9.00,
      netAmount: 171.00,
      status: 'pending',
      paymentMethod: 'PayPal',
      date: '2024-01-15T13:45:00Z',
      currency: 'USD'
    },
    {
      id: 'PAY-003',
      transactionId: 'txn_1234567892',
      user: 'Can Demir',
      userEmail: 'can@example.com',
      service: 'Music Video Production',
      provider: 'Video Pro',
      amount: 850.00,
      fee: 42.50,
      netAmount: 807.50,
      status: 'completed',
      paymentMethod: 'Bank Transfer',
      date: '2024-01-15T12:20:00Z',
      currency: 'USD'
    },
    {
      id: 'PAY-004',
      transactionId: 'txn_1234567893',
      user: 'Zeynep Çelik',
      userEmail: 'zeynep@example.com',
      service: 'Mixing & Mastering',
      provider: 'Audio Master',
      amount: 320.00,
      fee: 16.00,
      netAmount: 304.00,
      status: 'processing',
      paymentMethod: 'Credit Card',
      date: '2024-01-15T11:15:00Z',
      currency: 'USD'
    },
    {
      id: 'PAY-005',
      transactionId: 'txn_1234567894',
      user: 'Murat Özkan',
      userEmail: 'murat@example.com',
      service: 'PR Campaign',
      provider: 'PR Agency',
      amount: 450.00,
      fee: 22.50,
      netAmount: 427.50,
      status: 'failed',
      paymentMethod: 'Credit Card',
      date: '2024-01-15T10:30:00Z',
      currency: 'USD'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'processing':
        return <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'pending':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'processing':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'failed':
        return 'text-red-400 bg-red-500/10 border-red-500/20';
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const filteredPayments = payments.filter(payment => {
    const matchesStatus = selectedStatus === 'all' || payment.status === selectedStatus;
    const matchesSearch = payment.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="p-4 sm:p-6 bg-black min-h-screen">
      {/* Header - Mobile optimized */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 sm:mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
            Payment Management
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">Monitor and manage all platform transactions</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
          <div className="flex bg-gray-800/50 rounded-lg p-1 border border-gray-700/50">
            {['24h', '7d', '30d', '90d'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedPeriod === period
                    ? 'bg-orange-500 text-black'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
          
          <button className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg hover:border-gray-600/50 transition-colors">
            <Download className="w-4 h-4" />
            <span className="text-sm">Export</span>
          </button>
        </div>
      </div>

      {/* Stats Grid - Responsive optimization */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {paymentStats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`bg-gray-900/50 border ${stat.borderColor} rounded-xl p-4 sm:p-6`}
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`} />
              </div>
              <div className={`flex items-center space-x-1 text-sm ${
                stat.trend === 'up' ? 'text-emerald-400' : 'text-red-400'
              }`}>
                <TrendingUp className={`w-4 h-4 ${stat.trend === 'down' ? 'rotate-180' : ''}`} />
                <span>{stat.change}</span>
              </div>
            </div>
            
            <div>
              <div className="text-xl sm:text-2xl font-bold mb-1">{stat.value}</div>
              <div className="text-xs sm:text-sm text-gray-400">{stat.title}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters and Search - Mobile optimized */}
      <div className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-4 sm:p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search payments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 sm:py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg focus:ring-2 focus:ring-orange-500/50 focus:border-transparent text-sm"
            />
          </div>

          {/* Status Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">Status:</span>
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg focus:ring-2 focus:ring-orange-500/50 focus:border-transparent text-sm"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payments Table - Mobile optimized */}
      <div className="bg-gray-900/50 border border-gray-800/50 rounded-xl overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-800/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="text-lg sm:text-xl font-semibold">Payment Transactions</h3>
            <div className="text-sm text-gray-400">
              Showing {filteredPayments.length} of {payments.length} payments
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="text-left py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm font-medium text-gray-400">Payment ID</th>
                <th className="text-left py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm font-medium text-gray-400">User</th>
                <th className="text-left py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm font-medium text-gray-400 hidden sm:table-cell">Service</th>
                <th className="text-left py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm font-medium text-gray-400">Amount</th>
                <th className="text-left py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm font-medium text-gray-400 hidden lg:table-cell">Fee</th>
                <th className="text-left py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm font-medium text-gray-400 hidden lg:table-cell">Net</th>
                <th className="text-left py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm font-medium text-gray-400">Status</th>
                <th className="text-left py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm font-medium text-gray-400 hidden md:table-cell">Date</th>
                <th className="text-left py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => {
                const { date, time } = formatDate(payment.date);
                return (
                  <tr key={payment.id} className="border-b border-gray-800/30 hover:bg-gray-800/30 transition-colors">
                    <td className="py-3 sm:py-4 px-4 sm:px-6">
                      <div>
                        <div className="font-mono text-sm text-orange-400">{payment.id}</div>
                        <div className="text-xs text-gray-500 hidden sm:block">{payment.transactionId}</div>
                      </div>
                    </td>
                    <td className="py-3 sm:py-4 px-4 sm:px-6">
                      <div>
                        <div className="font-medium text-sm">{payment.user}</div>
                        <div className="text-xs text-gray-400 sm:hidden">{payment.service}</div>
                        <div className="text-xs text-gray-400">{payment.userEmail}</div>
                      </div>
                    </td>
                    <td className="py-3 sm:py-4 px-4 sm:px-6 hidden sm:table-cell">
                      <div>
                        <div className="font-medium text-sm">{payment.service}</div>
                        <div className="text-xs text-gray-400">by {payment.provider}</div>
                      </div>
                    </td>
                    <td className="py-3 sm:py-4 px-4 sm:px-6">
                      <div className="font-semibold text-sm">${payment.amount.toFixed(2)}</div>
                      <div className="text-xs text-gray-400">{payment.paymentMethod}</div>
                    </td>
                    <td className="py-3 sm:py-4 px-4 sm:px-6 hidden lg:table-cell">
                      <div className="text-sm text-red-400">${payment.fee.toFixed(2)}</div>
                    </td>
                    <td className="py-3 sm:py-4 px-4 sm:px-6 hidden lg:table-cell">
                      <div className="font-semibold text-emerald-400 text-sm">${payment.netAmount.toFixed(2)}</div>
                    </td>
                    <td className="py-3 sm:py-4 px-4 sm:px-6">
                      <div className={`inline-flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(payment.status)}`}>
                        {getStatusIcon(payment.status)}
                        <span className="capitalize hidden sm:inline">{payment.status}</span>
                      </div>
                    </td>
                    <td className="py-3 sm:py-4 px-4 sm:px-6 hidden md:table-cell">
                      <div className="text-sm">
                        <div>{date}</div>
                        <div className="text-xs text-gray-400">{time}</div>
                      </div>
                    </td>
                    <td className="py-3 sm:py-4 px-4 sm:px-6">
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        <button className="p-1 sm:p-2 hover:bg-gray-800/50 rounded-lg transition-colors">
                          <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                        <button className="p-1 sm:p-2 hover:bg-gray-800/50 rounded-lg transition-colors">
                          <MoreHorizontal className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination - Mobile optimized */}
        <div className="p-4 sm:p-6 border-t border-gray-800/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-sm text-gray-400">
              Showing 1 to {filteredPayments.length} of {payments.length} results
            </div>
            <div className="flex items-center justify-center sm:justify-end space-x-2">
              <button className="px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg hover:border-gray-600/50 transition-colors text-sm">
                Previous
              </button>
              <button className="px-3 py-2 bg-orange-500 text-black rounded-lg text-sm">
                1
              </button>
              <button className="px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg hover:border-gray-600/50 transition-colors text-sm">
                2
              </button>
              <button className="px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg hover:border-gray-600/50 transition-colors text-sm">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};