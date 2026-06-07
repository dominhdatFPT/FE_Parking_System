import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';

const DriverBooking = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Fake state for spot selection
  const [selectedSpot, setSelectedSpot] = useState('A05');

  const handleNavigate = (path) => {
    navigate(path);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const aSpots = ['A01', 'A02', 'A03', 'A04', 'A05', 'A06', 'A07'];
  const bSpots = ['B01', 'B02', 'B03', 'B04', 'B05', 'B06', 'B07'];

  // Fake booked spots
  const bookedSpots = ['A02', 'A03', 'B04'];

  const renderSpot = (id) => {
    const isSelected = selectedSpot === id;
    const isBooked = bookedSpots.includes(id);

    let baseClasses = "flex flex-col items-center justify-center w-16 h-20 rounded-lg border-2 transition-all cursor-pointer font-bold text-sm relative overflow-hidden group ";

    if (isSelected) {
      baseClasses += "bg-[#6df0b2] border-[#4ce49f] text-slate-900 shadow-md transform scale-105";
    } else if (isBooked) {
      baseClasses += "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed";
    } else {
      baseClasses += "bg-white border-gray-200 text-slate-700 hover:border-slate-300 hover:shadow-sm";
    }

    return (
      <button
        key={id}
        disabled={isBooked}
        onClick={() => setSelectedSpot(id)}
        className={baseClasses}
      >
        <div className="mb-2">{id}</div>
        <svg className="w-6 h-6 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 10h14l-1.5 8H6.5L5 10zM5 10l2-4h10l2 4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

        {isSelected && (
          <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm">
            <svg className="w-3 h-3 text-[#10b981]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </button>
    );
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-800 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#131b2e] flex flex-col hidden md:flex text-white shrink-0">
        <div className="flex-1 overflow-y-auto">
          {/* Logo */}
          <div className="h-20 flex items-center px-6 gap-3">
            <img src="/parking-system-logo.png" alt="Parking System Logo" className="w-10 h-10 object-contain" />
            <span className="font-bold text-xl text-white tracking-wide">
              Parking System
            </span>
          </div>

          {/* Nav Items */}
          <nav className="mt-4 flex flex-col gap-2 px-4">
            <button
              onClick={() => handleNavigate('/driver-dashboard')}
              className={`flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all duration-200 ${isActive('/driver-dashboard')
                  ? 'bg-blue-600 text-white font-bold shadow-sm'
                  : 'text-[#94a3b8] hover:bg-white/5 hover:text-white font-medium'
                }`}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM14 5a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM14 17a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1v-2z" />
              </svg>
              Trang chủ
            </button>
            <button
              onClick={() => handleNavigate('/driver-booking')}
              className={`flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all duration-200 ${isActive('/driver-booking')
                  ? 'bg-blue-600 text-white font-bold shadow-sm'
                  : 'text-[#94a3b8] hover:bg-white/5 hover:text-white font-medium'
                }`}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 4a2 2 0 00-2 2v2a2 2 0 010 4v2a2 2 0 002 2h10a2 2 0 002-2v-2a2 2 0 010-4V6a2 2 0 00-2-2H7z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 9h6" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 15h6" />
              </svg>
              Đặt chỗ
            </button>
            <button
              onClick={() => handleNavigate('/driver-history')}
              className={`flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all duration-200 ${isActive('/driver-history')
                  ? 'bg-blue-600 text-white font-bold shadow-sm'
                  : 'text-[#94a3b8] hover:bg-white/5 hover:text-white font-medium'
                }`}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 10a8 8 0 101.46-4.93L3 7m0 3h3" />
              </svg>
              Lịch sử
            </button>
            <button
              onClick={() => handleNavigate('/driver-profile')}
              className={`flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all duration-200 ${isActive('/driver-profile')
                  ? 'bg-blue-600 text-white font-bold shadow-sm'
                  : 'text-[#94a3b8] hover:bg-white/5 hover:text-white font-medium'
                }`}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Hồ sơ
            </button>
          </nav>
        </div>

        {/* Bottom Sidebar */}
        <div className="p-6 border-t border-[#1e293b] flex items-center gap-3 shrink-0 bg-transparent">
          <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-[#1e3a8a] hover:bg-blue-800 rounded-lg transition-colors text-sm font-semibold shadow-sm">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-white">Hỗ trợ</span>
          </button>
          <button 
            title="Đăng xuất"
            onClick={() => handleNavigate('/login')}
            className="flex-shrink-0 flex items-center justify-center p-2.5 text-rose-600 hover:text-white hover:bg-rose-600 bg-rose-100 rounded-lg transition-all"
          >
            <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-8 shrink-0">
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Tìm kiếm bãi đỗ, biển số..."
                className="w-full bg-gray-100/50 border border-gray-200 rounded-lg py-2.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-5 pl-4">
            <button className="text-gray-500 hover:text-slate-800 transition-colors relative">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="text-gray-500 hover:text-slate-800 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <div className="w-9 h-9 rounded-full bg-slate-800 border-2 border-white shadow-sm overflow-hidden cursor-pointer">
              {/* Avatar Image Placeholder */}
              <div className="w-full h-full bg-[url('https://i.pravatar.cc/100?img=11')] bg-cover bg-center"></div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">

            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-[#1e3a8a] mb-2 tracking-tight">Đặt chỗ đỗ xe</h1>
              <p className="text-gray-500 text-sm">Chọn vị trí và thời gian để đảm bảo chỗ đỗ xe của bạn.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Left Column (Forms & Maps) */}
              <div className="lg:col-span-2 space-y-6">

                {/* Step 1: Time & Vehicle Info */}
                <div className="bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-8 h-8 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center font-bold text-sm shadow-sm">1</div>
                    <h2 className="text-lg font-bold text-slate-800">Thời gian & Thông tin xe</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Ngày đỗ xe</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <input type="text" defaultValue="10/25/2023" className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Biển số xe</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M5 10h14l-1.5 8H6.5L5 10zM5 10l2-4h10l2 4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <input type="text" defaultValue="VD: 30A-123.45" className="w-full pl-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Giờ vào dự kiến</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <input type="text" defaultValue="08:00 AM" className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Giờ ra dự kiến</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <input type="text" defaultValue="05:00 PM" className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 2: Spot Selection */}
                <div className="bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center font-bold text-sm shadow-sm">2</div>
                      <h2 className="text-lg font-bold text-slate-800">Chọn vị trí - Tầng B1</h2>
                    </div>
                    <div className="flex items-center gap-5 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3.5 h-3.5 rounded bg-white border border-gray-300"></div>
                        <span className="text-gray-500 font-medium">Trống</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3.5 h-3.5 rounded bg-gray-200 border border-gray-300"></div>
                        <span className="text-gray-500 font-medium">Đã đặt</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3.5 h-3.5 rounded bg-[#6df0b2] border border-[#4ce49f]"></div>
                        <span className="text-gray-500 font-medium">Đang chọn</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50/50 rounded-xl border border-gray-100 p-6 md:p-8">
                    <div className="flex justify-center gap-3 md:gap-4 mb-8">
                      {aSpots.map(renderSpot)}
                    </div>

                    <div className="relative h-12 flex items-center justify-center border-y-2 border-dashed border-gray-200 mb-8">
                      <div className="flex items-center text-gray-300 gap-8">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                        </svg>
                      </div>
                    </div>

                    <div className="flex justify-center gap-3 md:gap-4">
                      {bSpots.map(renderSpot)}
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column (Summary) */}
              <div>
                <div className="bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 p-6 sticky top-6">
                  <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
                    <div className="w-8 h-8 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center font-bold text-sm shadow-sm">3</div>
                    <h2 className="text-lg font-bold text-slate-800">Chi tiết đặt chỗ</h2>
                  </div>

                  <div className="space-y-5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 text-gray-500">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span className="text-sm">Bãi xe</span>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-800">ParkSmart Center</p>
                        <p className="text-xs text-gray-500">Tầng B1</p>
                      </div>
                    </div>

                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 text-gray-500">
                        <div className="font-bold font-serif w-5 h-5 flex items-center justify-center text-lg">P</div>
                        <span className="text-sm">Ô số</span>
                      </div>
                      <div className="px-3 py-1 bg-[#d1fae5] text-emerald-700 font-bold rounded shadow-sm text-sm border border-emerald-200">
                        {selectedSpot}
                      </div>
                    </div>

                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 text-gray-500">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm">Thời gian</span>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-800">08:00 - 17:00</p>
                        <p className="text-xs text-gray-500">25/10/2023 (9 giờ)</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-100 space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Phí đỗ xe (15k/h)</span>
                      <span className="font-bold text-slate-700">135.000 đ</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2 text-[#059669]">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        <span className="font-medium">Ưu đãi Premium</span>
                      </div>
                      <span className="font-bold text-[#059669]">-15.000 đ</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t-2 border-dashed border-gray-200">
                    <div className="flex justify-between items-center mb-6">
                      <span className="font-bold text-slate-800">Tổng thanh toán</span>
                      <span className="text-2xl font-bold text-[#1e3a8a]">120.000 đ</span>
                    </div>

                    <button 
                      onClick={() => handleNavigate('/driver-payment')}
                      className="w-full bg-[#1e3a8a] hover:bg-blue-800 text-white py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 font-semibold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-white">Xác nhận đặt chỗ</span>
                    </button>
                    <p className="text-[11px] text-gray-400 text-center mt-4">
                      Bằng việc xác nhận, bạn đồng ý với <br />các điều khoản dịch vụ.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DriverBooking;
