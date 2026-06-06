import React from 'react';
import { useNavigate, useLocation } from 'react-router';

const DriverDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path) => {
    navigate(path);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };
  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-800 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col hidden md:flex shrink-0">
        <div className="flex-1 overflow-y-auto">
          {/* Logo */}
          <div className="h-20 flex items-center px-6 gap-3">
            <img src="/parking-system-logo.png" alt="Parking System Logo" className="w-10 h-10 object-contain" />
            <span className="font-bold text-xl text-[#1e3a8a] tracking-wide">
              Parking System
            </span>
          </div>

          {/* Nav Items */}
          <nav className="mt-4 flex flex-col gap-2 px-4">
            <button
              onClick={() => handleNavigate('/driver-dashboard')}
              className={`flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all duration-200 ${isActive('/driver-dashboard')
                  ? 'bg-[#6df0b2] text-[#065f46] font-bold shadow-sm'
                  : 'text-slate-600 hover:bg-gray-50 hover:text-slate-900 font-medium'
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
                  ? 'bg-[#6df0b2] text-[#065f46] font-bold shadow-sm'
                  : 'text-slate-600 hover:bg-gray-50 hover:text-slate-900 font-medium'
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
                  ? 'bg-[#6df0b2] text-[#065f46] font-bold shadow-sm'
                  : 'text-slate-600 hover:bg-gray-50 hover:text-slate-900 font-medium'
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
                  ? 'bg-[#6df0b2] text-[#065f46] font-bold shadow-sm'
                  : 'text-slate-600 hover:bg-gray-50 hover:text-slate-900 font-medium'
                }`}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Hồ sơ
            </button>
          </nav>
        </div>

        {/* Bottom Sidebar - Updated to horizontal layout */}
        <div className="p-6 border-t border-gray-100 flex items-center gap-3 shrink-0 bg-white">
          <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-[#1e3a8a] hover:bg-blue-800 rounded-lg transition-colors text-sm font-semibold shadow-sm">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-white">Hỗ trợ</span>
          </button>
          <button 
            title="Đăng xuất"
            onClick={() => handleNavigate('/login')}
            className="flex-shrink-0 flex items-center justify-center p-2.5 text-red-600 hover:text-white hover:bg-red-600 bg-red-100 rounded-lg transition-all"
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
                placeholder="Tìm kiếm tính năng..."
                className="w-full bg-gray-50 border-none rounded-full py-2.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-slate-200 outline-none transition-shadow"
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
               <div className="w-full h-full bg-gradient-to-tr from-slate-700 to-slate-900"></div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            
            {/* Welcome Section */}
            <div>
              <h1 className="text-2xl font-bold text-[#1e3a8a] mb-1">Xin chào, Nguyễn Văn A</h1>
              <p className="text-gray-500 text-sm">Hôm nay là một ngày tuyệt vời để quản lý phương tiện của bạn.</p>
            </div>

            {/* Current Parking Status Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-[#e0e7ff] text-[#3730a3] rounded-2xl flex items-center justify-center shrink-0">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    {/* A simple car icon approximation */}
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10h14l-1.5 8H6.5L5 10zM5 10l2-4h10l2 4" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-2xl font-bold text-slate-800">30A-123.45</h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">Đang đỗ</span>
                  </div>
                  <p className="text-gray-500 text-sm">Xe ô tô (4 chỗ)</p>
                </div>
              </div>

              <div className="flex flex-wrap md:flex-nowrap items-center gap-8 md:gap-12">
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">VỊ TRÍ ĐỖ</p>
                  <p className="font-semibold text-slate-800">A-12</p>
                  <p className="text-sm text-gray-500">(Tầng 1)</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">THỜI GIAN VÀO</p>
                  <p className="font-semibold text-slate-800">08:15 AM</p>
                  <p className="text-sm text-gray-500">Hôm nay</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">THỜI GIAN ĐỖ</p>
                  <p className="font-semibold text-[#1e3a8a] text-lg">2h 15m</p>
                </div>
                <div className="flex gap-2">
                  <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </button>
                  <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Grid layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column (Takes 2 columns on lg) */}
              <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-8">
                
                {/* Header info */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#e0e7ff] text-[#3730a3] rounded-lg flex items-center justify-center font-bold text-lg">
                    P
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">Thông tin bãi xe</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Status */}
                  <div>
                    <p className="text-xs font-bold text-gray-500 tracking-wider mb-4 uppercase">TÌNH TRẠNG CHỖ TRỐNG</p>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="font-medium text-slate-700">Tầng B1 (Ô tô)</span>
                          <span className="font-bold text-red-500">85% Đã đầy</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-red-500 rounded-full" style={{ width: '85%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="font-medium text-slate-700">Tầng B2 (Xe máy)</span>
                          <span className="font-bold text-emerald-500">40% Đã đầy</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden flex">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: '40%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div>
                    <p className="text-xs font-bold text-gray-500 tracking-wider mb-4 uppercase">BIỂU PHÍ GỬI XE</p>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-gray-50">
                        <span className="text-sm text-slate-600">Xe ô tô (4-7 chỗ)</span>
                        <span className="text-sm font-bold text-[#1e3a8a]">30.000đ/giờ</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-50">
                        <span className="text-sm text-slate-600">Xe máy</span>
                        <span className="text-sm font-bold text-[#1e3a8a]">5.000đ/lượt</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-slate-600">Xe điện (Có sạc)</span>
                        <span className="text-sm font-bold text-[#1e3a8a]">+15.000đ/lượt</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rules */}
                <div className="pt-2">
                  <p className="text-xs font-bold text-gray-500 tracking-wider mb-4 uppercase">NỘI QUY BÃI XE</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm text-gray-500">Tuân thủ chỉ dẫn của nhân viên</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                      <p className="text-sm text-gray-500">Nghiêm cấm hút thuốc</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <p className="text-sm text-gray-500">Khóa xe cẩn thận khi đỗ</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column (Takes 1 column on lg) */}
              <div className="flex flex-col gap-6">
                
                {/* Quick Actions */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="font-bold text-slate-800 mb-4">Quick Actions</h3>
                  <div className="flex flex-col gap-3">
                    <button className="w-full bg-[#1e3a8a] hover:bg-blue-800 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-colors shadow-sm">
                      <svg className="w-5 h-5 shrink-0 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <span className="text-white">Đặt chỗ trước</span>
                    </button>
                    <button className="w-full bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-colors">
                      <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <span>Tìm chỗ trống nhanh</span>
                    </button>
                    <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-colors shadow-sm">
                      <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span>Thanh toán ngay</span>
                    </button>
                  </div>
                </div>

                {/* Notifications */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 font-bold text-slate-800">
                      <svg className="w-5 h-5 text-[#1e3a8a]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                      </svg>
                      Bảng thông báo
                    </div>
                    <a href="#" className="text-sm text-[#1e3a8a] font-medium hover:underline">Xem tất cả</a>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-[#1e3a8a]">Bảo trì</span>
                        <span className="text-[10px] text-gray-400 font-medium">10:00 AM</span>
                      </div>
                      <p className="text-sm text-slate-700 leading-snug">Bảo trì hệ thống điện khu vực C - Tầng 2 vào ngày mai.</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-slate-700">Chính sách</span>
                        <span className="text-[10px] text-gray-400 font-medium uppercase">Hôm qua</span>
                      </div>
                      <p className="text-sm text-slate-700 leading-snug">Cập nhật chính sách đăng ký vé tháng mới cho cư dân.</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-slate-700">Thông báo</span>
                        <span className="text-[10px] text-gray-400 font-medium uppercase">2 ngày trước</span>
                      </div>
                      <p className="text-sm text-slate-700 leading-snug">Bổ sung trạm sạc xe điện tại tầng hầm B1.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <footer className="mt-8 pt-6 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 pb-4">
              <p>© 2026 Parking Smart System. All rights reserved.</p>
              <div className="flex gap-4 mt-4 md:mt-0">
                <a href="#" className="hover:text-slate-800 transition-colors">Điều khoản</a>
                <a href="#" className="hover:text-slate-800 transition-colors">Chính sách bảo mật</a>
                <a href="#" className="hover:text-slate-800 transition-colors">Liên hệ</a>
              </div>
            </footer>
            
          </div>
        </main>
      </div>
    </div>
  );
};

export default DriverDashboard;
