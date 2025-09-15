"use client";
import React, { useState, useMemo } from "react";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function OrdersTab() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const mainStats = [
    {
      title: "Toplam Gelir",
      value: "$127,543.89",
      change: "+25.1%",
      changeType: "positive",
      color: "bg-gradient-to-br from-emerald-500/20 to-green-500/20 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-6 sm:p-8 hover:border-opacity-50 transition-all duration-500 group hover:shadow-yellow-glow",
      icon: "$"
    },
    {
      title: "Aktif Kullanıcılar",
      value: "12,350",
      change: "+18.1%",
      changeType: "positive",
      color: "bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-6 sm:p-8 hover:border-opacity-50 transition-all duration-500 group hover:shadow-yellow-glow",
      icon: "👥"
    },
    {
      title: "İşlemler",
      value: "8,234",
      change: "+7.8%",
      changeType: "positive",
      color: "bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 sm:p-8 hover:border-opacity-50 transition-all duration-500 group hover:shadow-yellow-glow",
      icon: "📄"
    },
    {
      title: "Dönüşüm Oranı",
      value: "94.2%",
      change: "+4.3%",
      changeType: "positive",
      color: "bg-gradient-to-br from-primary-500/20 to-primary-400/20 backdrop-blur-xl border border-primary-500/20 rounded-2xl p-6 sm:p-8 hover:border-opacity-50 transition-all duration-500 group hover:shadow-yellow-glow"
    },
  ];

  const quickStats = [
    {
      title: "Bugünkü Gelir",
      value: "$2,847.32",
      change: "+12.5%",
      changeType: "positive",
    },
    {
      title: "Yeni Siparişler",
      value: "127",
      change: "+8.2%",
      changeType: "positive",
    },
    {
      title: "Bekleyen Siparişler",
      value: "23",
      change: "-2.1%",
      changeType: "negative",
    },
    {
      title: "Başarı Oranı",
      value: "94.2%",
      change: "+1.8%",
      changeType: "positive",
    },
  ];

  const chartOptions = {
    chart: {
      type: "bar",
      height: 350,
      background: "transparent",
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "12px",
        fontWeight: "bold",
        colors: ["#000"],
      },
      offsetY: -20,
      formatter: function (val) {
        return "₺" + (val / 1000).toFixed(1) + "k";
      },
    },
    xaxis: {
      categories: [
        "Oca",
        "Şub",
        "Mar",
        "Nis",
        "May",
        "Haz",
        "Tem",
        "Ağu",
        "Eyl",
        "Eki",
        "Kas",
        "Ara",
      ],
      labels: {
        style: {
          colors: "#9CA3AF",
          fontSize: "12px",
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      show: false,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.5,
        gradientToColors: ['#facc15'], // primary-400 equivalent
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 0.8,
        stops: [0, 100]
      }
    },
    colors: ['#eab308'], // primary-500 equivalent
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "60%",
        borderRadius: 8,
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "last"
      },
    },
    dropShadow: {
      enabled: true,
      top: 0,
      left: 0,
      blur: 10,
      opacity: 0.5,
      color: '#facc15'
    },
    grid: {
      borderColor: "#374151",
      show: false,
    },
    legend: {
      show: false,
    },
    theme: {
      mode: "dark",
    },
  };

  const chartSeries = [
    {
      name: "Gelir",
      data: [
        44000, 55000, 41000, 67000, 22000, 43000, 21000, 41000, 56000, 27000,
        43000, 72000,
      ],
    },
  ];

  const orders = [
    {
      id: "PAY-483",
      customer: "Ahmet Yılmaz",
      email: "ahmet@gmail.com",
      service: "Hip-Hop Beat Production",
      amount: 2500.00,
      fee: 125.50,
      net: 2374.50,
      status: "Tamamlandı",
      date: "16.01.2024",
      time: "14:30"
    },
    {
      id: "PAY-497",
      customer: "Elif Kaya",
      email: "elif@example.com", 
      service: "Album Cover Design",
      amount: 1800.00,
      fee: 90.00,
      net: 1710.00,
      status: "Beklemede",
      date: "16.01.2024",
      time: "13:45"
    },
    {
      id: "PAY-519",
      customer: "Can Demir",
      email: "can@gmail.com",
      service: "Music Video Production",
      amount: 5500.00,
      fee: 275.00,
      net: 5225.00,
      status: "Tamamlandı", 
      date: "16.01.2024",
      time: "12:20"
    },
    {
      id: "PAY-608",
      customer: "Zeynep Çelik",
      email: "zeynep@example.com",
      service: "Mixing & Mastering",
      amount: 3200.00,
      fee: 160.00,
      net: 3040.00,
      status: "İşlemde",
      date: "16.01.2024",
      time: "11:10"
    },
    {
      id: "PAY-645",
      customer: "Murat Özkan",
      email: "murat@gmail.com",
      service: "PR Campaign for Agency",
      amount: 6500.00,
      fee: 325.00,
      net: 6175.00,
      status: "İptal",
      date: "16.01.2024",
      time: "10:30"
    }
  ];

  // Filtreleme logic'i
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = 
        order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toString().includes(searchTerm) ||
        order.service.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSearch;
    });
  }, [orders, searchTerm]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Tamamlandı":
        return "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
      case "İşlemde":
        return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
      case "Beklemede":
        return "bg-blue-500/20 text-blue-400 border border-blue-500/30";
      case "İptal":
        return "bg-red-500/20 text-red-400 border border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border border-gray-500/30";
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mainStats.map((stat, index) => (
          <div
            key={index}
            className={`${stat.color} rounded-xl p-6 text-white relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
          >
            {/* Gradient overlay for extra depth */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-20"></div>
            
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-white/90 text-sm font-medium">{stat.title}</p>
                <p className="text-2xl font-bold text-white mt-2">
                  {stat.value}
                </p>
              </div>
              <div className="text-white/90 text-sm font-medium">
                {stat.change}
              </div>
            </div>
            <div className="absolute top-4 right-4 text-2xl opacity-30">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Analytics */}
        <div className="lg:col-span-2 bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Gelir Analitiği</h3>
            <span className="text-sm text-gray-400">Son 12 ay</span>
          </div>
          <div className="h-80">
            <Chart
              options={chartOptions}
              series={chartSeries}
              type="bar"
              height={320}
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Hızlı İstatistikler</h3>
          <div className="space-y-4">
            {quickStats.map((stat, index) => (
              <div key={index} className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">{stat.title}</p>
                    <p className="text-xl font-bold text-white mt-1">{stat.value}</p>
                  </div>
                  <div className={`text-sm font-medium ${
                    stat.changeType === "positive" ? "text-green-400" : "text-red-400"
                  }`}>
                    {stat.change}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Ödeme İşlemleri</h3>
              <p className="text-sm text-gray-400 mt-1">5 ödemeden 5'i gösteriliyor</p>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
              Yeni Ödeme Ekle
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {/* Search Section */}
          <div className="mb-6">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Ödeme ID, kullanıcı veya hizmete göre ara..."
              className="w-full bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Table Header */}
          <div className="bg-gray-700 rounded-t-lg">
            <div className="grid grid-cols-8 gap-4 px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider">
              <div>Ödeme ID</div>
              <div>Kullanıcı</div>
              <div>Hizmet</div>
              <div>Tutar</div>
              <div>Ücret</div>
              <div>Net</div>
              <div>Durum</div>
              <div>Tarih</div>
            </div>
          </div>

          {/* Orders List */}
          <div className="bg-gray-800 rounded-b-lg border-x border-b border-gray-700">
            {filteredOrders.map((order, index) => (
              <div 
                key={order.id} 
                className={`grid grid-cols-8 gap-4 px-6 py-4 items-center hover:bg-gray-700 transition-colors ${
                  index !== filteredOrders.length - 1 ? 'border-b border-gray-700' : ''
                }`}
              >
                {/* Payment ID */}
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-xs">
                      {order.id.split('-')[1]}
                    </span>
                  </div>
                  <span className="text-blue-400 font-medium text-sm">{order.id}</span>
                </div>
                
                {/* User */}
                <div>
                  <div className="text-white font-medium text-sm">{order.customer}</div>
                  <div className="text-gray-400 text-xs">{order.email}</div>
                </div>
                
                {/* Service */}
                <div>
                  <div className="text-white text-sm">{order.service}</div>
                </div>
                
                {/* Amount */}
                <div className="text-white font-medium text-sm">
                  ${order.amount.toFixed(2)}
                </div>
                
                {/* Fee */}
                <div className="text-red-400 font-medium text-sm">
                  ${order.fee.toFixed(2)}
                </div>
                
                {/* Net */}
                <div className="text-emerald-400 font-medium text-sm">
                  ${order.net.toFixed(2)}
                </div>
                
                {/* Status */}
                <div className="flex items-center">
                  <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                    {order.status === 'Tamamlandı' && '✓ Onaylandı'}
                    {order.status === 'İşlemde' && '○ Beklemede'}
                    {order.status === 'Beklemede' && '◯ İşleniyor'}
                    {order.status === 'İptal' && '✗ Başarısız'}
                  </span>
                </div>
                
                {/* Date */}
                <div>
                  <div className="text-white text-sm">{order.date}</div>
                  <div className="text-gray-400 text-xs">{order.time}</div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 bg-gray-800 border-t border-gray-700">
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 text-sm">5 ödemeden 5'i gösteriliyor</span>
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 text-gray-400 hover:text-white border border-gray-600 rounded disabled:opacity-50" disabled>
                Önceki
              </button>
              <button className="px-3 py-1 bg-blue-600 text-white rounded">
                1
              </button>
              <button className="px-3 py-1 text-gray-400 hover:text-white border border-gray-600 rounded">
                2
              </button>
              <button className="px-3 py-1 text-gray-400 hover:text-white border border-gray-600 rounded">
                Sonraki
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}