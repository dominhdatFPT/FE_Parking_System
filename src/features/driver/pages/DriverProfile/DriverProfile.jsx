import React from 'react';
import { useNavigate, useLocation } from 'react-router';

const DriverProfile = () => {
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

        {/* Bottom Sidebar */}
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
            className="flex-shrink-0 flex items-center justify-center p-2.5 text-red-500 hover:text-white hover:bg-red-500 bg-red-50 rounded-lg transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#f8fafc]">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-6 flex-1">
            <div className="relative max-w-md w-full">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Tìm kiếm chức năng..."
                className="w-full bg-gray-100 border-none rounded-lg py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-200 outline-none transition-shadow"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors relative">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-gray-100">
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            
            {/* Page Header */}
            <div>
              <h1 className="text-3xl font-bold text-[#1e3a8a] mb-2">Hồ sơ cá nhân</h1>
              <p className="text-gray-500 text-sm">Quản lý thông tin tài khoản và danh sách phương tiện của bạn.</p>
            </div>

            {/* Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6">
              
              {/* Left Column - User Info */}
              <div className="space-y-6">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <img
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
                      alt="Avatar"
                      className="w-28 h-28 rounded-full object-cover border-4 border-blue-50"
                    />
                    <button className="absolute bottom-1 right-1 w-8 h-8 bg-[#1e3a8a] rounded-full flex items-center justify-center border-2 border-white hover:bg-blue-800 transition-colors shadow-sm">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-slate-800 mb-1">Nguyễn Văn An</h2>
                  <p className="text-emerald-600 font-bold text-sm italic mb-8">Enterprise Member</p>

                  <div className="w-full space-y-5 text-left">
                    <div className="flex gap-4 items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-[11px] text-gray-400 mb-0.5">Email</p>
                        <p className="text-sm font-medium text-slate-700">an.nguyen@smartparking.vn</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-[11px] text-gray-400 mb-0.5">Số điện thoại</p>
                        <p className="text-sm font-medium text-slate-700">+84 901 234 567</p>
                      </div>
                    </div>

                    <div className="flex gap-4 items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-[11px] text-gray-400 mb-0.5">Địa chỉ</p>
                        <p className="text-sm font-medium text-slate-700">Thanh Xuân, Hà Nội</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 space-y-1">
                  <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                        <svg className="w-4 h-4 text-[#1e3a8a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <span className="font-semibold text-sm text-slate-700 group-hover:text-[#1e3a8a] transition-colors">Chỉnh sửa hồ sơ</span>
                    </div>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-[#1e3a8a] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                        <svg className="w-4 h-4 text-[#1e3a8a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                      </div>
                      <span className="font-semibold text-sm text-slate-700 group-hover:text-[#1e3a8a] transition-colors">Đổi mật khẩu</span>
                    </div>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-[#1e3a8a] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Right Column - Details */}
              <div className="space-y-6">
                
                {/* Vehicles */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6 text-[#1e3a8a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10h14l-1.5 8H6.5L5 10zM5 10l2-4h10l2 4" />
                      </svg>
                      <h2 className="text-lg font-bold text-slate-800">Quản lý danh sách xe</h2>
                    </div>
                    <button className="bg-[#1e3a8a] hover:bg-blue-800 rounded-lg flex items-center gap-2 px-4 py-2.5 font-semibold shadow-sm transition-colors text-sm">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span className="text-white">Thêm xe mới</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Vehicle 1 */}
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-wrap lg:flex-nowrap items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white rounded-lg border border-gray-200 flex items-center justify-center font-bold text-[#1e3a8a] text-lg shadow-sm shrink-0">
                          30F
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-800 text-base">30F-123.45</h3>
                          <p className="text-sm text-gray-500">Toyota Camry - Đen</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right hidden sm:block">
                          <p className="text-[11px] text-gray-400">Ngày đăng ký</p>
                          <p className="text-sm font-medium text-slate-700">12/05/2025</p>
                        </div>
                        <span className="px-3 py-1 bg-[#6df0b2] text-[#065f46] text-xs font-bold rounded-full whitespace-nowrap">Đang hoạt động</span>
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-gray-400 hover:text-[#1e3a8a] rounded-lg transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                          <button className="p-2 text-gray-400 hover:text-red-500 rounded-lg transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                        </div>
                      </div>
                    </div>

                    {/* Vehicle 2 */}
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-wrap lg:flex-nowrap items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white rounded-lg border border-gray-200 flex items-center justify-center font-bold text-[#1e3a8a] text-lg shadow-sm shrink-0">
                          29A
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-800 text-base">29A-678.90</h3>
                          <p className="text-sm text-gray-500">Mercedes-Benz C200 - Trắng</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right hidden sm:block">
                          <p className="text-[11px] text-gray-400">Ngày đăng ký</p>
                          <p className="text-sm font-medium text-slate-700">02/01/2026</p>
                        </div>
                        <span className="px-3 py-1 bg-gray-200 text-gray-600 text-xs font-bold rounded-full whitespace-nowrap">Chờ xác minh</span>
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-gray-400 hover:text-[#1e3a8a] rounded-lg transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                          <button className="p-2 text-gray-400 hover:text-red-500 rounded-lg transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                        </div>
                      </div>
                    </div>

                    {/* Vehicle 3 */}
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-wrap lg:flex-nowrap items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white rounded-lg border border-gray-200 flex items-center justify-center font-bold text-[#1e3a8a] text-lg shadow-sm shrink-0">
                          51G
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-800 text-base">51G-555.55</h3>
                          <p className="text-sm text-gray-500">Honda CR-V - Đỏ</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right hidden sm:block">
                          <p className="text-[11px] text-gray-400">Ngày đăng ký</p>
                          <p className="text-sm font-medium text-slate-700">15/11/2025</p>
                        </div>
                        <span className="px-3 py-1 bg-[#6df0b2] text-[#065f46] text-xs font-bold rounded-full whitespace-nowrap">Đang hoạt động</span>
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-gray-400 hover:text-[#1e3a8a] rounded-lg transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                          <button className="p-2 text-gray-400 hover:text-red-500 rounded-lg transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom 2 Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Balance Card */}
                  <div className="bg-[#1e3a8a] p-6 rounded-2xl shadow-sm text-white flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-sm text-blue-200 font-medium">Tài khoản chính</p>
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                      <h3 className="text-[28px] font-bold mb-1">2.540.000 VND</h3>
                      <p className="text-[11px] text-blue-200">Cập nhật lần cuối: 2 phút trước</p>
                    </div>
                    <div className="flex gap-3 mt-6">
                      <button className="flex-1 bg-white/20 hover:bg-white/30 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors">Nạp tiền</button>
                      <button className="flex-1 bg-white/20 hover:bg-white/30 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors">Giao dịch</button>
                    </div>
                  </div>

                  {/* Sessions Card */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-bold text-slate-700">Phiên gửi tháng này</p>
                      <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <div className="mt-4 flex justify-between items-end">
                      <div>
                        <h3 className="text-4xl font-bold text-slate-800 mb-2">42 <span className="text-lg font-semibold text-slate-600">Lượt</span></h3>
                        <p className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                          </svg>
                          +12% so với tháng trước
                        </p>
                      </div>
                      {/* Mini bar chart */}
                      <div className="flex items-end gap-1.5 pb-1">
                        <div className="w-2.5 h-6 bg-gray-200 rounded-sm"></div>
                        <div className="w-2.5 h-8 bg-gray-200 rounded-sm"></div>
                        <div className="w-2.5 h-10 bg-gray-200 rounded-sm"></div>
                        <div className="w-2.5 h-12 bg-[#1e3a8a] rounded-sm"></div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </main>

        {/* Footer */}
        <footer className="shrink-0 flex items-center justify-between px-8 py-4 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
          <p>© 2026 Parking Smart System. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#1e3a8a] transition-colors">Điều khoản</a>
            <a href="#" className="hover:text-[#1e3a8a] transition-colors">Chính sách bảo mật</a>
            <a href="#" className="hover:text-[#1e3a8a] transition-colors">Liên hệ</a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DriverProfile;
