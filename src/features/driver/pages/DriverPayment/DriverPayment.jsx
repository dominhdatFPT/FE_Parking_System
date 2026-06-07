import React from 'react';
import { useNavigate, useLocation } from 'react-router';

const DriverPayment = () => {
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
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 text-gray-500 hover:text-slate-800 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-[#1e3a8a]">Thanh toán</h1>
          </div>
          <div className="flex items-center gap-5 pl-4">
            <button className="text-gray-500 hover:text-slate-800 transition-colors relative">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <div className="w-9 h-9 rounded-full bg-slate-800 border-2 border-white shadow-sm overflow-hidden cursor-pointer">
              <div className="w-full h-full bg-[url('https://i.pravatar.cc/100?img=11')] bg-cover bg-center"></div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            
            {/* Left Column (Invoice Details) */}
            <div className="space-y-6">
              
              {/* Status Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center justify-between border-l-4 border-l-[#1e3a8a]">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">Trạng thái thanh toán</h3>
                  <p className="text-xs text-gray-500 mt-1">Đang chờ xác nhận từ người dùng</p>
                </div>
                <div className="px-3 py-1.5 bg-[#e0e7ff] text-[#3730a3] rounded-full text-xs font-semibold">
                  Chưa thanh toán
                </div>
              </div>

              {/* Invoice Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-5 bg-gray-50 border-b border-gray-100">
                  <h2 className="text-lg font-bold text-slate-800 mb-4">Chi tiết hóa đơn</h2>
                  <div className="flex justify-between items-center text-sm">
                    <div>
                      <p className="text-gray-500 mb-1">Mã phiên gửi xe</p>
                      <p className="font-bold text-slate-800">#PK-2026-081192</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-500 mb-1">Biển số xe</p>
                      <p className="font-bold text-slate-800">30A-123.45</p>
                    </div>
                  </div>
                </div>
                <div className="p-5 space-y-4 text-sm">
                  <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                    <span className="text-gray-600">Thời gian vào</span>
                    <span className="font-semibold text-slate-800">11/08/2026 08:30:15</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                    <span className="text-gray-600">Thời gian ra (Dự kiến)</span>
                    <span className="font-semibold text-slate-800">11/08/2026 14:45:00</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-dashed border-gray-200 pb-5">
                    <span className="text-gray-600">Tổng thời lượng</span>
                    <span className="font-semibold text-slate-800">6 giờ 15 phút</span>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-gray-600">Cước phí gửi xe (15.000đ/giờ)</span>
                    <span className="font-bold text-slate-800">93.750 VNĐ</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Phụ phí giờ cao điểm (+10%)</span>
                    <span className="font-bold text-slate-800">9.375 VNĐ</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                    <span className="text-[#059669]">Giảm giá thành viên Vàng</span>
                    <span className="font-bold text-[#059669]">-10.000 VNĐ</span>
                  </div>

                  <div className="flex justify-between items-end pt-2 bg-gray-50 -mx-5 -mb-5 p-5">
                    <span className="font-bold text-lg text-[#1e3a8a]">Tổng cộng</span>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-[#1e3a8a]">93.125 VNĐ</span>
                      <p className="text-[10px] text-gray-500 uppercase mt-1">ĐÃ BAO GỒM VAT</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Promo Banner */}
              <div className="bg-[#d1fae5] border border-[#a7f3d0] rounded-xl p-4 text-center">
                <p className="text-sm font-medium text-[#065f46]">
                  Thanh toán ngay để nhận ưu đãi hoàn tiền 2,000 VNĐ vào ví Smart Parking cho lần gửi xe tiếp theo.
                </p>
              </div>

            </div>

            {/* Right Column (Payment Methods) */}
            <div>
              <h2 className="text-lg font-bold text-slate-800 mb-4">Phương thức thanh toán</h2>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
                
                {/* QR Method */}
                <div className="border-2 border-[#1e3a8a] rounded-xl p-5 relative overflow-hidden bg-slate-50/50 cursor-pointer">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6 text-[#1e3a8a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                      </svg>
                      <span className="font-bold text-slate-800 text-sm">QR Banking</span>
                    </div>
                    <div className="w-5 h-5 bg-white border border-[#1e3a8a] rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-[#1e3a8a] rounded-full"></div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center py-4">
                    <div className="w-48 h-48 bg-[#1e3a8a] rounded-lg p-2 flex items-center justify-center relative shadow-inner">
                      {/* Fake QR Image placeholder, replacing with simple SVG to simulate QR */}
                      <div className="w-24 h-24 bg-white rounded flex items-center justify-center relative">
                        <div className="w-20 h-20 border-[3px] border-black border-dashed flex flex-wrap content-between justify-between p-1">
                          <div className="w-4 h-4 bg-black"></div>
                          <div className="w-4 h-4 bg-black"></div>
                          <div className="w-4 h-4 bg-black mt-10"></div>
                          <div className="w-8 h-4 bg-black mt-10"></div>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 text-center mt-4 mb-3 max-w-[200px]">
                      Quét mã bằng ứng dụng Ngân hàng của bạn
                    </p>
                    <div className="px-4 py-1.5 bg-[#e0e7ff] text-[#3730a3] rounded-full text-[10px] font-bold">
                      BANK TRANSFER • VIETQR
                    </div>
                  </div>
                </div>

                {/* E-Wallets */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Ví điện tử</p>
                  <div className="space-y-3">
                    <button className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gray-300 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-[#a50064] rounded text-white flex items-center justify-center font-bold text-xs">
                          Mo
                        </div>
                        <span className="font-semibold text-slate-800 text-sm">Ví MoMo</span>
                      </div>
                      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    
                    <button className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gray-300 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-[#0068ff] rounded text-white flex items-center justify-center font-bold text-xs">
                          Za
                        </div>
                        <span className="font-semibold text-slate-800 text-sm">ZaloPay</span>
                      </div>
                      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Bank Cards */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Thẻ ngân hàng</p>
                  <button className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gray-300 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <svg className="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      <span className="font-semibold text-slate-800 text-sm">Thẻ nội địa / Quốc tế</span>
                    </div>
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-gray-100">
                  <button className="w-full bg-[#1e3a8a] hover:bg-blue-800 text-white py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 font-semibold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span className="text-white">Xác nhận đã thanh toán</span>
                  </button>
                  <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-gray-500">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Giao dịch an toàn và bảo mật
                  </div>
                </div>

              </div>

              {/* Support Box */}
              <div className="bg-[#1e293b] rounded-xl p-6 mt-6 text-white relative overflow-hidden">
                <svg className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
                </svg>
                <div className="relative z-10">
                  <h3 className="font-bold mb-2">Gặp sự cố khi thanh toán?</h3>
                  <p className="text-sm text-slate-300 mb-4">Vui lòng liên hệ bộ phận hỗ trợ kỹ thuật hoặc nhấn nút gọi tại bốt ra.</p>
                  <button className="flex items-center gap-2 text-sm font-bold hover:text-blue-300 transition-colors">
                    Hỗ trợ ngay
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </button>
                </div>
              </div>

            </div>

          </div>
          
          <footer className="max-w-5xl mx-auto mt-8 pt-6 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 pb-4">
            <div className="flex gap-4">
              <a href="#" className="hover:text-slate-800 transition-colors">Điều khoản</a>
              <a href="#" className="hover:text-slate-800 transition-colors">Chính sách bảo mật</a>
              <a href="#" className="hover:text-slate-800 transition-colors">Liên hệ</a>
            </div>
            <p className="mt-4 md:mt-0">© 2026 Parking Smart System. All rights reserved.</p>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default DriverPayment;
