import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';

const DriverHistory = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [filterStatus, setFilterStatus] = useState('all');

  const historyData = [
    { id: 1, date: '15 Th08, 2023', time: '08:30 AM', session: '#PS-88291', plate1: '30F-', plate2: '123.45', type: 'car', duration1: '04 giờ 15', duration2: 'phút', fee: '120.000đ', status: 'success' },
    { id: 2, date: '14 Th08, 2023', time: '02:45 PM', session: '#PS-88274', plate1: '29A-', plate2: '999.88', type: 'moto', duration1: '01 giờ 30', duration2: 'phút', fee: '15.000đ', status: 'failed' },
    { id: 3, date: '12 Th08, 2023', time: '10:15 AM', session: '#PS-88212', plate1: '30H-', plate2: '567.89', type: 'car', duration1: '08 giờ 00', duration2: 'phút', fee: '250.000đ', status: 'success' },
    { id: 4, date: '11 Th08, 2023', time: '06:00 PM', session: '#PS-88190', plate1: '51G-', plate2: '443.21', type: 'car', duration1: '02 giờ 20', duration2: 'phút', fee: '80.000đ', status: 'success' },
    { id: 5, date: '10 Th08, 2023', time: '11:05 AM', session: '#PS-88155', plate1: '29K-', plate2: '112.23', type: 'moto', duration1: '03 giờ 45', duration2: 'phút', fee: '35.000đ', status: 'success' }
  ];

  const filteredData = historyData.filter(item => {
    if (filterStatus === 'all') return true;
    return item.status === filterStatus;
  });

  const handleNavigate = (path) => {
    navigate(path);
  };

  const isActive = (path) => {
    return location.pathname === path;
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
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#f8fafc]">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-6 flex-1">
            <h2 className="text-xl font-bold text-[#1e3a8a]">ParkSmart Pro</h2>
            <div className="relative max-w-md w-full ml-4">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Tìm kiếm giao dịch hoặc biển số..."
                className="w-full bg-gray-100 border-none rounded-lg py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-200 outline-none transition-shadow"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors relative">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <div className="w-9 h-9 rounded-full bg-slate-200 overflow-hidden ml-2 cursor-pointer shadow-sm">
              <img src="https://i.pravatar.cc/100?img=11" alt="Avatar" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-[#1e3a8a] mb-2">Lịch sử gửi xe</h1>
                <p className="text-gray-500 text-sm">Theo dõi và quản lý tất cả các phiên đỗ xe của bạn trong hệ thống ParkSmart Pro.</p>
              </div>
              <button className="bg-[#1e3a8a] hover:bg-blue-800 rounded-lg flex items-center gap-2 px-5 py-2.5 font-semibold shadow-sm transition-colors text-sm font-sans">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span className="text-white">Xuất báo cáo</span>
              </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-wrap gap-6 items-end">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-xs text-gray-500 mb-2">Thời gian</label>
                <div className="relative">
                  <select className="w-full bg-gray-100 border-none rounded-lg py-2.5 px-4 appearance-none outline-none text-sm font-medium">
                    <option>7 ngày qua</option>
                    <option>30 ngày qua</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 min-w-[200px]">
                <label className="block text-xs text-gray-500 mb-2">Trạng thái</label>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button onClick={() => setFilterStatus('all')} className={`flex-1 rounded-md py-1.5 text-sm font-semibold shadow-sm transition-colors font-sans ${filterStatus === 'all' ? 'bg-[#1e3a8a]' : 'text-gray-600 hover:bg-gray-200'}`}><span className={filterStatus === 'all' ? 'text-white' : ''}>Tất cả</span></button>
                  <button onClick={() => setFilterStatus('success')} className={`flex-1 rounded-md py-1.5 text-sm font-semibold shadow-sm transition-colors font-sans ${filterStatus === 'success' ? 'bg-[#1e3a8a]' : 'text-gray-600 hover:bg-gray-200'}`}><span className={filterStatus === 'success' ? 'text-white' : ''}>Thành công</span></button>
                  <button onClick={() => setFilterStatus('failed')} className={`flex-1 rounded-md py-1.5 text-sm font-semibold shadow-sm transition-colors font-sans ${filterStatus === 'failed' ? 'bg-[#1e3a8a]' : 'text-gray-600 hover:bg-gray-200'}`}><span className={filterStatus === 'failed' ? 'text-white' : ''}>Thất bại</span></button>
                </div>
              </div>

              <div className="flex-1 min-w-[200px]">
                <label className="block text-xs text-gray-500 mb-2">Phương tiện</label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <select className="w-full bg-gray-100 border-none rounded-lg py-2.5 px-4 appearance-none outline-none text-sm font-medium">
                      <option>Tất cả xe</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                  <button className="w-[42px] h-[42px] bg-[#1e3a8a] rounded-lg flex items-center justify-center shrink-0 hover:bg-blue-800 transition-colors shadow-sm">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 w-40">Ngày thực hiện</th>
                    <th className="px-6 py-4">Mã phiên</th>
                    <th className="px-6 py-4">Biển số xe</th>
                    <th className="px-6 py-4">Thời lượng</th>
                    <th className="px-6 py-4">Tổng phí</th>
                    <th className="px-6 py-4 text-center">Trạng thái</th>
                    <th className="px-6 py-4 text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredData.map(row => (
                    <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800">{row.date}</div>
                        <div className="text-xs text-gray-500 mt-1">{row.time}</div>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-700">{row.session}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {row.type === 'car' ? (
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10h14l-1.5 8H6.5L5 10zM5 10l2-4h10l2 4" /></svg>
                          ) : (
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="7" cy="17" r="2" strokeWidth="2"/><circle cx="17" cy="17" r="2" strokeWidth="2"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 17h10M7 15l2-5h6l2 5M12 10V6"/></svg>
                          )}
                          <span className="font-semibold">{row.plate1}<br/>{row.plate2}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{row.duration1}<br/>{row.duration2}</td>
                      <td className="px-6 py-4 font-bold text-slate-800">{row.fee}</td>
                      <td className="px-6 py-4">
                        {row.status === 'success' ? (
                          <div className="mx-auto w-fit bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold text-center">Thành công</div>
                        ) : (
                          <div className="mx-auto w-fit bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold text-center">Thất bại</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <button className="block mx-auto text-[#1e3a8a] hover:bg-gray-100 p-2 rounded-full transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                <span className="text-sm text-gray-500">Hiển thị 5 trên 48 kết quả</span>
                <div className="flex gap-1 items-center">
                  <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
                  </button>
                  <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md mr-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  
                  <button className="w-8 h-8 flex items-center justify-center bg-[#1e3a8a] rounded-md text-sm font-semibold shadow-sm font-sans"><span className="text-white">1</span></button>
                  <button className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-200 rounded-md text-sm">2</button>
                  <button className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-200 rounded-md text-sm">3</button>
                  <span className="w-8 h-8 flex items-center justify-center text-gray-400">...</span>
                  <button className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-200 rounded-md text-sm">10</button>

                  <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md ml-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                  </button>
                  <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
              <div className="bg-[#e2e8f0] bg-opacity-70 rounded-xl p-5 border border-slate-200 flex items-start gap-4">
                <div className="w-12 h-12 bg-[#1e3a8a] rounded-xl flex items-center justify-center shrink-0 shadow-sm font-sans">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base mb-1">Tóm tắt tuần này</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Bạn đã thực hiện 12 lượt đỗ xe, tổng phí tích lũy là 840.000đ. Tiết kiệm 15% so với tuần trước nhờ gói Premium.
                  </p>
                </div>
              </div>
              
              <div className="bg-[#ecfdf5] rounded-xl p-5 border border-emerald-100 flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>
                </div>
                <div>
                  <h3 className="font-bold text-emerald-800 text-base mb-1">Phần thưởng Loyalty</h3>
                  <p className="text-sm text-emerald-700 leading-relaxed">
                    Tiếp tục duy trì lịch sử đỗ xe để nhận ngay mã giảm giá 50k cho lượt đỗ tiếp theo khi đạt mốc 15 lượt trong tháng.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default DriverHistory;
