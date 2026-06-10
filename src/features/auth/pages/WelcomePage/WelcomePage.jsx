import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { 
  Car, Bike, Zap, MapPin, CreditCard, Globe, ScanLine, CalendarDays,
  Smartphone, CheckCircle2, AlertTriangle, Clock, ShieldCheck, 
  BatteryCharging, Maximize, Bell, ChevronRight, ChevronDown, Info,
  TrendingUp, TrendingDown, Activity, BarChart3, Users, 
  LayoutDashboard, LogIn, UserPlus, Facebook, Github, Check,
  AlertCircle
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// --- DICTIONARY (i18n) ---
const translations = {
  VN: {
    nav: { home: "Trang chủ", dashboard: "Bảng điều khiển", notice: "Thông báo", pricing: "Biểu phí", login: "Đăng nhập", signup: "Đăng ký" },
    hero: { badge: "Hệ thống đang hoạt động 24/7", title1: "Quản lý bãi đỗ xe", title2: "tòa nhà thông minh", desc: "Nền tảng Smart Parking dành cho chung cư, văn phòng và trung tâm thương mại với nhận diện biển số LPR, đặt chỗ trước và thanh toán không chạm.", f1: "Thanh toán không chạm", f2: "Nhận diện biển số LPR", f3: "Theo dõi thời gian thực" },
    kpi: { 
      c1: { title: "Chỗ trống hiện tại", unit: "chỗ" }, 
      c2: { title: "Xe đang gửi", unit: "xe" }, 
      c3: { title: "Tỷ lệ lấp đầy", unit: "%" },
      vsYesterday: "so với hôm qua"
    },
    live: {
      liveStatus: "LIVE", lastUpdate: "Cập nhật lần cuối:"
    },
    occupancy: {
      title: "Tổng quan công suất bãi xe", systemOccupancy: "Toàn hệ thống", 
      availableSlots: "Chỗ trống", totalCapacity: "Sức chứa"
    },
    alert: {
      title: "Cảnh báo hệ thống"
    },
    trend: {
      title: "Xu hướng sử dụng bãi xe"
    },
    floor: {
      title: "Quản lý theo tầng", statusNormal: "Còn nhiều chỗ", statusMedium: "Trung bình", statusFull: "Gần đầy"
    },
    mapOverview: {
      title: "Sơ đồ bãi xe mô phỏng", empty: "Trống", occupied: "Có xe", reserved: "Đặt trước", floor: "Tầng", zone: "Tòa"
    },
    realtime: {
      title: "Trạng thái xe chi tiết", car: "Ô tô", moto: "Xe máy", ev: "Xe điện (Sạc)",
      statusNormal: "Còn nhiều chỗ", statusMedium: "Trung bình", statusFull: "Gần đầy"
    },
    notice: {
      title: "Thông báo từ Ban Quản Lý", viewAll: "Xem tất cả", readMore: "Đọc tiếp",
      data: [
        { id: 1, date: '15/06 08:30', title: 'Bảo trì hệ thống thanh toán tự động', type: 'Khẩn cấp', tone: 'red', desc: 'Hệ thống thanh toán qua ví điện tử sẽ tạm ngưng hoạt động từ 00:00 đến 04:00 ngày 16/06 để nâng cấp bảo mật.' },
        { id: 2, date: '12/06 14:00', title: 'Mở thêm khu vực đỗ xe máy tại Tầng B3', type: 'Thông tin', tone: 'sky', desc: 'Nhằm phục vụ nhu cầu tăng cao, khu vực B3-C đã được chuyển đổi thành bãi đỗ xe máy với sức chứa thêm 200 xe.' },
        { id: 3, date: '10/06 09:15', title: 'Cập nhật biểu phí gửi xe tháng', type: 'Chính sách', tone: 'orange', desc: 'Bắt đầu từ tháng 07, biểu phí đăng ký thẻ tháng sẽ có sự điều chỉnh nhẹ.' }
      ]
    },
    pricing: {
      title: "Biểu phí & Thanh toán", car: "Ô tô", carDesc: "Block 2 giờ đầu", moto: "Xe máy", motoDesc: "Block 4 giờ", ev: "Xe điện", evDesc: "Bao gồm sạc tiêu chuẩn", methods: "Phương thức thanh toán"
    },
    map: {
      title: "Bản đồ & Chỉ đường", name: "Tòa nhà Nexus Center", address: "123 Trần Phú, Quận 1, TP.HCM", openMap: "Mở Bản đồ"
    },
    process: {
      title: "Quy trình đỗ xe",
      s1Title: "1. Nhận diện", s1Desc: "Hệ thống LPR nhận diện biển số.",
      s2Title: "2. Đỗ xe", s2Desc: "Theo dõi bảng điện tử để tìm chỗ trống.",
      s3Title: "3. Thanh toán", s3Desc: "Thanh toán không tiền mặt khi ra.",
      rulesTitle: "Quy định", r1: "Cao: 2.2m", r2: "Tắt máy", r3: "Sạc đúng chỗ"
    },
    footer: { rights: "All rights reserved.", terms: "Điều khoản", privacy: "Bảo mật", support: "Hỗ trợ" }
  },
  EN: {
    nav: { home: "Home", dashboard: "Dashboard", notice: "Notices", pricing: "Pricing", login: "Login", signup: "Sign Up" },
    hero: { badge: "System running 24/7", title1: "Smart Building", title2: "Parking Management", desc: "Smart Parking platform for apartments, offices and commercial centers with LPR, booking and contactless payment.", f1: "Contactless Payment", f2: "LPR System", f3: "Real-time Tracking" },
    kpi: { 
      c1: { title: "Available Slots", unit: "slots" }, 
      c2: { title: "Parked Vehicles", unit: "vehicles" }, 
      c3: { title: "Occupancy Rate", unit: "%" },
      vsYesterday: "vs yesterday"
    },
    live: {
      liveStatus: "LIVE", lastUpdate: "Last update:"
    },
    occupancy: {
      title: "Occupancy Overview", systemOccupancy: "System Wide", 
      availableSlots: "Available", totalCapacity: "Capacity"
    },
    alert: {
      title: "System Alerts"
    },
    trend: {
      title: "Usage Trend"
    },
    floor: {
      title: "Floor Management", statusNormal: "Available", statusMedium: "Average", statusFull: "Nearly Full"
    },
    mapOverview: {
      title: "Mini Parking Map", empty: "Empty", occupied: "Occupied", reserved: "Reserved", floor: "Floor", zone: "Bldg"
    },
    realtime: {
      title: "Detailed Vehicle Status", car: "Car", moto: "Motorbike", ev: "EV",
      statusNormal: "Available", statusMedium: "Average", statusFull: "Nearly Full"
    },
    notice: {
      title: "Management Notices", viewAll: "View All", readMore: "Read More",
      data: [
        { id: 1, date: '15/06 08:30', title: 'Payment system maintenance', type: 'Urgent', tone: 'red', desc: 'E-wallet payment system will be temporarily suspended.' },
        { id: 2, date: '12/06 14:00', title: 'New parking area at B3', type: 'Info', tone: 'sky', desc: 'B3-C area has been converted into motorbike parking.' },
        { id: 3, date: '10/06 09:15', title: 'Monthly fee update', type: 'Policy', tone: 'orange', desc: 'Starting from July, the monthly fee will have a slight adjustment.' }
      ]
    },
    pricing: {
      title: "Pricing & Payment", car: "Car", carDesc: "First 2 hours", moto: "Motorbike", motoDesc: "4 hours block", ev: "EV", evDesc: "Standard charging included", methods: "Payment Methods"
    },
    map: {
      title: "Map & Directions", name: "Nexus Center", address: "123 Tran Phu, Dist 1, HCMC", openMap: "Open Map"
    },
    process: {
      title: "Parking Process",
      s1Title: "1. Detect", s1Desc: "LPR system recognizes plate.",
      s2Title: "2. Park", s2Desc: "Follow boards to available spot.",
      s3Title: "3. Pay", s3Desc: "Cashless payment upon exit.",
      rulesTitle: "Rules", r1: "Height: 2.2m", r2: "Engine off", r3: "Charge in designated spots"
    },
    footer: { rights: "All rights reserved.", terms: "Terms", privacy: "Privacy", support: "Support" }
  }
};

// --- MOCK DATA ---
const trendData = [
  { time: '06h', value: 20 },
  { time: '08h', value: 65 },
  { time: '10h', value: 85 },
  { time: '12h', value: 95 },
  { time: '14h', value: 75 },
  { time: '16h', value: 80 },
  { time: '18h', value: 98 },
  { time: '20h', value: 60 },
  { time: '22h', value: 30 },
];

const floorData = [
  { id: 'B1', name: 'Tầng B1 (EV & Ô tô)', occupied: 95, total: 100 },
  { id: 'B2', name: 'Tầng B2 (Ô tô)', occupied: 72, total: 100 },
  { id: 'B3', name: 'Tầng B3 (Xe máy)', occupied: 120, total: 300 },
];

const mapGrid = Array.from({ length: 48 }, (_, i) => {
  if ([2, 5, 8, 12, 15, 22, 28, 33, 40].includes(i)) return 'empty';
  if ([1, 10, 25].includes(i)) return 'reserved';
  return 'occupied';
});

// --- HELPER HOOK ---
const useScrollSpy = (ids, offset = 100) => {
  const [activeId, setActiveId] = useState('');
  useEffect(() => {
    const listener = () => {
      const scroll = window.scrollY;
      let current = '';
      for (const id of ids) {
        const element = document.getElementById(id);
        if (element) {
          const top = element.offsetTop - offset;
          if (scroll >= top) current = id;
        }
      }
      setActiveId(current || ids[0]); // default to first if none
    };
    window.addEventListener('scroll', listener);
    listener(); // init
    return () => window.removeEventListener('scroll', listener);
  }, [ids, offset]);
  return activeId;
};

// --- COMPONENTS ---

const Navbar = ({ lang, setLang, t }) => {
  const navigate = useNavigate();
  const activeSection = useScrollSpy(['hero', 'dashboard', 'thong-bao', 'bieu-phi'], 200);
  
  const handleScrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 160;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  const handleScrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const reloadPage = () => {
    window.location.href = '/';
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 cursor-pointer" onClick={reloadPage}>
            <div className="bg-sky-600 p-1.5 rounded-lg shadow-sm shadow-sky-600/20">
              <Car className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-extrabold text-slate-800 tracking-tight">
              Smart<span className="text-sky-600">Parking</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-2">
            <a href="#" onClick={handleScrollToTop} className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${activeSection === 'hero' ? 'text-sky-700 bg-sky-50' : 'text-slate-500 hover:text-sky-600 hover:bg-slate-50'}`}>
              {t.nav.home}
            </a>
            <a href="#dashboard" onClick={(e) => handleScrollToSection(e, 'dashboard')} className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${activeSection === 'dashboard' ? 'text-sky-700 bg-sky-50' : 'text-slate-500 hover:text-sky-600 hover:bg-slate-50'}`}>
              {t.nav.dashboard}
            </a>
            <a href="#thong-bao" onClick={(e) => handleScrollToSection(e, 'thong-bao')} className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${activeSection === 'thong-bao' ? 'text-sky-700 bg-sky-50' : 'text-slate-500 hover:text-sky-600 hover:bg-slate-50'}`}>
              {t.nav.notice}
            </a>
            <a href="#bieu-phi" onClick={(e) => handleScrollToSection(e, 'bieu-phi')} className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${activeSection === 'bieu-phi' ? 'text-sky-700 bg-sky-50' : 'text-slate-500 hover:text-sky-600 hover:bg-slate-50'}`}>
              {t.nav.pricing}
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setLang(lang === 'VN' ? 'EN' : 'VN')}
            className="flex items-center gap-1.5 text-sm font-bold text-slate-600 hover:text-sky-600 transition-colors bg-slate-100 px-3 py-1.5 rounded-lg"
          >
            <Globe className="w-4 h-4" />
            <span>{lang}</span>
          </button>
          <div className="h-5 w-px bg-slate-200 hidden sm:block"></div>
          <button 
            onClick={() => navigate('/login')}
            className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-700 hover:text-sky-600 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <LogIn className="w-4 h-4" />
            {t.nav.login}
          </button>
          <button 
            onClick={() => navigate('/signup')}
            className="flex items-center gap-2 bg-[#0EA5E9] hover:bg-[#0284c7] px-5 py-2.5 rounded-lg text-sm font-bold shadow-md shadow-sky-500/20 transition-all hover:-translate-y-0.5"
          >
            <UserPlus className="w-4 h-4 text-white" style={{ color: '#FFFFFF' }} />
            <span className="text-white" style={{ color: '#FFFFFF' }}>{t.nav.signup}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

const HeroSection = ({ t }) => {
  return (
    <section id="hero" className="relative pt-20 pb-24 px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[400px]">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=1920&q=80" 
          alt="Parking Background" 
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-sky-900/80"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto text-center w-full">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-sm font-bold mb-6 backdrop-blur-md shadow-lg">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          {t.hero.badge}
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-6 drop-shadow-lg">
          {t.hero.title1} <br className="hidden sm:block" />
          <span className="text-sky-400">{t.hero.title2}</span>
        </h1>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-10 drop-shadow font-medium">
          {t.hero.desc}
        </p>

        <div className="flex flex-wrap justify-center gap-6 text-slate-200 text-sm font-bold">
          <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/10">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" /> {t.hero.f1}
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/10">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" /> {t.hero.f2}
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/10">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" /> {t.hero.f3}
          </div>
        </div>
      </div>
    </section>
  );
};

// --- REALTIME STATUS BAR ---
const RealtimeStatusBar = ({ t }) => {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-slate-900 border-b border-slate-800 text-slate-300 py-2.5 px-4 sm:px-6 lg:px-8 flex justify-between items-center text-sm font-bold sticky top-16 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
        <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-md border border-emerald-500/20">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          {t.live.liveStatus}
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <Clock className="w-4 h-4" />
          <span>{t.live.lastUpdate} <span className="text-white ml-1">{time}</span></span>
        </div>
      </div>
    </div>
  );
};

// --- DASHBOARD WRAPPER ---
const MainDashboard = ({ t }) => {
  return (
    <section id="dashboard" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-20 py-12 space-y-8">
      {/* 1. KPI Dashboard */}
      <KPIDashboard t={t} />

      {/* 2. Occupancy Overview & Alert Center */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <OccupancyOverview t={t} />
        </div>
        <div className="lg:col-span-2">
          <AlertCenter t={t} />
        </div>
      </div>

      {/* 3. Trend Chart & Floor Management */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ParkingTrendChart t={t} />
        </div>
        <div className="lg:col-span-1">
          <FloorManagement t={t} />
        </div>
      </div>

      {/* 4. Map Overview & Vehicle Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ParkingMapOverview t={t} />
        </div>
        <div className="lg:col-span-2">
          <VehicleStatus t={t} />
        </div>
      </div>
    </section>
  );
};

const KPIDashboard = ({ t }) => {
  const kpis = [
    { id: 1, title: t.kpi.c1.title, value: '142', unit: t.kpi.c1.unit, trend: '+12%', trendDir: 'up', icon: LayoutDashboard, color: 'emerald', progress: 32 },
    { id: 2, title: t.kpi.c2.title, value: '358', unit: t.kpi.c2.unit, trend: '-5%', trendDir: 'down', icon: Car, color: 'sky', progress: 68 },
    { id: 3, title: t.kpi.c3.title, value: '71.6', unit: t.kpi.c3.unit, trend: '+2.4%', trendDir: 'up', icon: Activity, color: 'orange', progress: 71.6 },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {kpis.map((kpi) => (
        <div key={kpi.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all group cursor-default">
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3.5 rounded-xl bg-${kpi.color}-50 text-${kpi.color}-600 group-hover:scale-110 transition-transform`}>
              <kpi.icon className="w-6 h-6" />
            </div>
            <div className={`flex items-center gap-1 text-sm font-bold px-2.5 py-1 rounded-full ${kpi.trendDir === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
              {kpi.trendDir === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {kpi.trend}
            </div>
          </div>
          <p className="text-slate-500 font-bold mb-1 text-sm">{kpi.title}</p>
          <div className="flex items-baseline gap-1 mb-4">
            <span className="text-4xl font-black text-slate-800 tracking-tight">{kpi.value}</span>
            <span className="text-sm font-bold text-slate-400">{kpi.unit}</span>
          </div>
          {/* Mini progress */}
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className={`h-1.5 rounded-full bg-${kpi.color}-500`} style={{ width: `${kpi.progress}%` }}></div>
          </div>
          <p className="text-xs font-semibold text-slate-400 mt-3">{t.kpi.vsYesterday}</p>
        </div>
      ))}
    </div>
  );
};

const OccupancyOverview = ({ t }) => {
  const percentage = 72; // mock 72%
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm h-full flex flex-col items-center justify-center">
      <h3 className="font-bold text-slate-800 self-start mb-6 w-full flex items-center justify-between">
        {t.occupancy.title}
        <Info className="w-4 h-4 text-slate-400" />
      </h3>
      
      <div className="relative flex items-center justify-center w-48 h-48 mb-6">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
          <circle cx="70" cy="70" r={radius} fill="transparent" stroke="#f1f5f9" strokeWidth="16" />
          <circle 
            cx="70" cy="70" r={radius} fill="transparent" stroke="#0ea5e9" strokeWidth="16"
            strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-4xl font-black text-slate-800">{percentage}%</span>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">{t.occupancy.systemOccupancy}</span>
        </div>
      </div>
      
      <div className="w-full grid grid-cols-2 gap-4 mt-auto">
        <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
          <p className="text-xs font-bold text-slate-500 mb-1">{t.occupancy.availableSlots}</p>
          <p className="text-xl font-black text-emerald-500">142</p>
        </div>
        <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
          <p className="text-xs font-bold text-slate-500 mb-1">{t.occupancy.totalCapacity}</p>
          <p className="text-xl font-black text-slate-700">500</p>
        </div>
      </div>
    </div>
  );
};

const AlertCenter = ({ t }) => {
  return (
    <div className="bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-800 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <AlertCircle className="text-red-500 w-5 h-5" /> {t.alert.title}
        </h3>
        <span className="bg-red-500/20 text-red-400 px-3 py-1 text-xs font-bold rounded-full border border-red-500/30">
          3 Active
        </span>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex gap-4">
          <div className="bg-red-500/20 p-2 rounded-lg h-fit">
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h4 className="font-bold text-red-400 text-sm mb-1">Tầng B1 sắp đầy (95%)</h4>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">Hệ thống sẽ tự động điều hướng xe mới xuống tầng B2 trong 5 phút tới.</p>
          </div>
          <span className="text-xs text-slate-500 font-bold ml-auto whitespace-nowrap">Vừa xong</span>
        </div>

        <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 flex gap-4">
          <div className="bg-orange-500/20 p-2 rounded-lg h-fit">
            <Zap className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <h4 className="font-bold text-orange-400 text-sm mb-1">Khu sạc EV chỉ còn 2 chỗ</h4>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">Nhu cầu sạc xe điện đang tăng cao so với ngày hôm qua (+40%).</p>
          </div>
          <span className="text-xs text-slate-500 font-bold ml-auto whitespace-nowrap">10m trước</span>
        </div>

        <div className="bg-sky-500/10 border border-sky-500/20 rounded-xl p-4 flex gap-4">
          <div className="bg-sky-500/20 p-2 rounded-lg h-fit">
            <TrendingUp className="w-5 h-5 text-sky-400" />
          </div>
          <div>
            <h4 className="font-bold text-sky-400 text-sm mb-1">Lưu lượng xe tăng đột biến</h4>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">Lượng xe vào bãi tăng 18% so với cùng kỳ giờ sáng qua.</p>
          </div>
          <span className="text-xs text-slate-500 font-bold ml-auto whitespace-nowrap">1h trước</span>
        </div>
      </div>
    </div>
  );
};

const ParkingTrendChart = ({ t }) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm h-full">
      <h3 className="font-bold text-slate-800 mb-6">{t.trend.title}</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trendData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 'bold' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 'bold' }} />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
              labelStyle={{ color: '#64748b' }}
            />
            <Area type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const FloorManagement = ({ t }) => {
  const getBadge = (pct) => {
    if (pct < 60) return { color: 'emerald', text: t.floor.statusNormal };
    if (pct < 85) return { color: 'orange', text: t.floor.statusMedium };
    return { color: 'red', text: t.floor.statusFull };
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm h-full">
      <h3 className="font-bold text-slate-800 mb-6">{t.floor.title}</h3>
      <div className="space-y-6">
        {floorData.map(f => {
          const pct = Math.round((f.occupied / f.total) * 100);
          const badge = getBadge(pct);
          return (
            <div key={f.id}>
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-slate-700 text-sm">{f.name}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md bg-${badge.color}-50 text-${badge.color}-600 border border-${badge.color}-200`}>
                  {badge.text}
                </span>
              </div>
              <div className="flex justify-between items-end mb-2">
                <div className="text-xl font-black text-slate-800">{f.occupied}<span className="text-sm text-slate-400">/{f.total}</span></div>
                <div className="text-xs font-bold text-slate-500">{pct}%</div>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className={`h-2 rounded-full bg-${badge.color}-500 transition-all duration-1000`} style={{ width: `${pct}%` }}></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const CustomSelect = ({ value, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-2 bg-slate-700 hover:bg-slate-600 text-base !font-bold !text-white border border-slate-500 rounded-lg px-3 py-2 outline-none cursor-pointer transition-colors min-w-[120px]"
        style={{ color: '#ffffff' }}
      >
        <span className="!text-white !font-bold">{selectedOption?.label}</span>
        <ChevronDown className={`w-5 h-5 !text-white transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 left-0 w-full bg-slate-800 border border-slate-500 rounded-lg shadow-2xl overflow-hidden z-[100]">
          {options.map((opt) => (
            <div 
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={`px-3 py-2 text-sm font-medium cursor-pointer transition-colors ${
                value === opt.value ? 'bg-sky-500 text-white' : 'text-slate-200 hover:bg-slate-600 hover:text-white'
              }`}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ParkingMapOverview = ({ t }) => {
  const [zone, setZone] = useState('A');
  const [floor, setFloor] = useState('B1');
  const [grid, setGrid] = useState(mapGrid);

  useEffect(() => {
    // Generate new random grid layout when zone or floor changes
    const newGrid = Array.from({ length: 48 }, () => {
      const rand = Math.random();
      if (rand > 0.75) return 'empty';
      if (rand > 0.65) return 'reserved';
      return 'occupied';
    });
    setGrid(newGrid);
  }, [zone, floor]);

  const zoneOptions = [
    { value: 'A', label: `${t.mapOverview.zone} A` },
    { value: 'B', label: `${t.mapOverview.zone} B` },
    { value: 'C', label: `${t.mapOverview.zone} C` }
  ];

  const floorOptions = [
    { value: 'B1', label: `${t.mapOverview.floor} B1` },
    { value: 'B2', label: `${t.mapOverview.floor} B2` },
    { value: 'B3', label: `${t.mapOverview.floor} B3` }
  ];

  return (
    <div className="bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-800 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h3 className="font-bold text-white">{t.mapOverview.title}</h3>
        <div className="flex items-center gap-3">
          <CustomSelect value={zone} options={zoneOptions} onChange={setZone} />
          <CustomSelect value={floor} options={floorOptions} onChange={setFloor} />
        </div>
      </div>

      <div className="flex-1 bg-slate-800/50 rounded-xl border border-slate-700 p-4 mb-4 grid grid-cols-8 gap-1.5 content-start">
        {grid.map((status, i) => {
          let bg = "bg-emerald-500/20 border-emerald-500/50 shadow-[inset_0_0_8px_rgba(16,185,129,0.2)]"; // empty
          let textColor = "text-white/90";
          if(status === 'occupied') {
            bg = "bg-red-500/20 border-red-500/50 shadow-[inset_0_0_8px_rgba(239,68,68,0.2)]";
          }
          if(status === 'reserved') {
            bg = "bg-sky-500/20 border-sky-500/50 shadow-[inset_0_0_8px_rgba(14,165,233,0.2)]";
          }
          
          return (
            <div key={i} className={`aspect-square rounded-md border ${bg} transition-all duration-500 flex items-center justify-center`}>
              <span className={`text-[10px] sm:text-xs font-bold ${textColor}`}>
                {zone}{i + 1}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-emerald-500/40 border border-emerald-500 rounded-sm"></div> {t.mapOverview.empty}</div>
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-red-500/40 border border-red-500 rounded-sm"></div> {t.mapOverview.occupied}</div>
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-sky-500/40 border border-sky-500 rounded-sm"></div> {t.mapOverview.reserved}</div>
      </div>
    </div>
  );
};

const VehicleStatus = ({ t }) => {
  const parkingStatus = [
    { id: 1, type: t.realtime.car, occupied: 75, total: 120, icon: Car },
    { id: 2, type: t.realtime.moto, occupied: 211, total: 300, icon: Bike },
    { id: 3, type: t.realtime.ev, occupied: 18, total: 20, icon: Zap },
  ];

  const getBadge = (pct) => {
    if (pct < 60) return { color: 'emerald', text: t.realtime.statusNormal };
    if (pct < 85) return { color: 'orange', text: t.realtime.statusMedium };
    return { color: 'red', text: t.realtime.statusFull };
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm h-full">
      <h3 className="font-bold text-slate-800 mb-6">{t.realtime.title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {parkingStatus.map((item) => {
          const pct = Math.round((item.occupied / item.total) * 100);
          const badge = getBadge(pct);
          return (
            <div key={item.id} className={`p-4 rounded-xl border-2 border-slate-100 hover:border-${badge.color}-200 transition-colors`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-slate-50 text-slate-600 shadow-sm border border-slate-200`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md bg-${badge.color}-50 text-${badge.color}-600 border border-${badge.color}-200`}>
                  {badge.text}
                </span>
              </div>
              <p className="font-bold text-slate-700 mb-1 text-sm">{item.type}</p>
              <div className="flex items-end justify-between mb-2">
                <div className="text-2xl font-black text-slate-800">{item.occupied}<span className="text-sm font-bold text-slate-400">/{item.total}</span></div>
                <div className="text-xs font-bold text-slate-500">{pct}%</div>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div className={`h-1.5 rounded-full bg-${badge.color}-500 transition-all duration-1000`} style={{ width: `${pct}%` }}></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const NotificationCenter = ({ t }) => {
  const getBadgeColor = (tone) => {
    if(tone === 'red') return 'bg-red-50 text-red-600 border-red-200';
    if(tone === 'sky') return 'bg-sky-50 text-sky-600 border-sky-200';
    if(tone === 'orange') return 'bg-orange-50 text-orange-600 border-orange-200';
    return 'bg-slate-50 text-slate-600 border-slate-200';
  };

  return (
    <section id="thong-bao" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
          <Bell className="text-sky-600 w-6 h-6" /> {t.notice.title}
        </h2>
        <button className="text-sm font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 hover:underline">
          {t.notice.viewAll} <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {t.notice.data.map((ann) => (
          <div key={ann.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all cursor-pointer flex flex-col h-full group">
            <div className="flex items-center justify-between mb-4">
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border ${getBadgeColor(ann.tone)} uppercase tracking-wider`}>
                {ann.type}
              </span>
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3" /> {ann.date}
              </span>
            </div>
            <h3 className="font-bold text-slate-800 mb-2 leading-snug group-hover:text-sky-600 transition-colors">{ann.title}</h3>
            <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-1">{ann.desc}</p>
            <div className="flex items-center gap-1 text-sky-600 text-sm font-bold mt-auto">
              {t.notice.readMore} <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const PricingAndMap = ({ t }) => {
  return (
    <div id="bieu-phi" className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16">
      <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 flex flex-col">
        <h2 className="text-2xl font-extrabold text-slate-800 mb-6 flex items-center gap-2">
          <CreditCard className="text-sky-600 w-6 h-6" /> {t.pricing.title}
        </h2>
        
        <div className="space-y-4 mb-8 flex-1">
          <div className="flex items-center justify-between p-5 bg-slate-50 rounded-xl border border-slate-100 hover:border-sky-200 transition-colors">
            <div className="flex items-center gap-4">
              <div className="bg-white p-2 rounded-lg shadow-sm border border-slate-100 text-slate-600">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">{t.pricing.car}</h3>
                <p className="text-sm text-slate-500 font-medium">{t.pricing.carDesc}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xl font-extrabold text-slate-800">30.000đ</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-5 bg-slate-50 rounded-xl border border-slate-100 hover:border-sky-200 transition-colors">
            <div className="flex items-center gap-4">
              <div className="bg-white p-2 rounded-lg shadow-sm border border-slate-100 text-slate-600">
                <Bike className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">{t.pricing.moto}</h3>
                <p className="text-sm text-slate-500 font-medium">{t.pricing.motoDesc}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xl font-extrabold text-slate-800">5.000đ</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">{t.pricing.methods}</h3>
          <div className="flex flex-wrap gap-3">
            <span className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 shadow-sm flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-pink-500" /> MoMo
            </span>
            <span className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 shadow-sm flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-blue-500" /> VNPAY
            </span>
            <span className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 shadow-sm flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-orange-500" /> Visa/Master
            </span>
            <span className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 shadow-sm flex items-center gap-2">
              <Car className="w-4 h-4 text-emerald-500" /> ePass/VETC
            </span>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 flex flex-col">
        <h2 className="text-2xl font-extrabold text-slate-800 mb-6 flex items-center gap-2">
          <MapPin className="text-sky-600 w-6 h-6" /> {t.map.title}
        </h2>
        
        <div className="relative flex-1 bg-slate-100 rounded-xl overflow-hidden mb-6 min-h-[260px] border border-slate-200 shadow-inner">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1m2!1s0x31752f241a7d6ab3%3A0x6bda19a9f5d17dd3!2zMTIzIMSQxrDhu51uZyBUcuG6p24gUGjDuiwgUXXhuq1uIDEsIFRow6BuaCBwaOG7kSBI4buTIENow60gTWluaA!5e0!3m2!1svi!2s!4v1700000000000!5m2!1svi!2s" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0"
            title="Google Maps Location"
          ></iframe>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <h3 className="font-bold text-slate-800">{t.map.name}</h3>
            <p className="text-sm text-slate-500 font-medium">{t.map.address}</p>
          </div>
          <button className="flex items-center justify-center gap-2 bg-sky-50 text-sky-600 border border-sky-200 hover:bg-sky-100 px-6 py-3 rounded-xl font-bold transition-colors">
            <MapPin className="w-5 h-5" /> {t.map.openMap}
          </button>
        </div>
      </section>
    </div>
  );
};

const ProcessTimeline = ({ t }) => {
  return (
    <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-20">
      <div className="bg-slate-900 rounded-2xl p-8 sm:p-12 text-white overflow-hidden relative shadow-xl">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 text-slate-800">
          <ShieldCheck className="w-64 h-64" />
        </div>
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-extrabold mb-2">{t.process.title}</h2>
              <p className="text-slate-400 font-medium">Đơn giản hóa trải nghiệm đỗ xe của bạn</p>
            </div>
            <div className="bg-sky-500/20 border border-sky-500/30 text-sky-400 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 w-fit">
              <Clock className="w-4 h-4" /> Toàn bộ quy trình dưới 30 giây
            </div>
          </div>
          
          <div className="relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -translate-y-1/2 z-0"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
              <div className="flex flex-col gap-4 group">
                <div className="w-16 h-16 bg-slate-800 border-2 border-slate-700 rounded-2xl flex items-center justify-center group-hover:border-sky-500 group-hover:bg-slate-800 transition-all shadow-lg group-hover:-translate-y-1">
                  <ScanLine className="w-7 h-7 text-sky-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-white">{t.process.s1Title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed font-medium">{t.process.s1Desc}</p>
                </div>
              </div>
              
              <div className="flex flex-col gap-4 group">
                <div className="w-16 h-16 bg-slate-800 border-2 border-slate-700 rounded-2xl flex items-center justify-center group-hover:border-sky-500 group-hover:bg-slate-800 transition-all shadow-lg group-hover:-translate-y-1">
                  <MapPin className="w-7 h-7 text-sky-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-white">{t.process.s2Title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed font-medium">{t.process.s2Desc}</p>
                </div>
              </div>

              <div className="flex flex-col gap-4 group">
                <div className="w-16 h-16 bg-slate-800 border-2 border-slate-700 rounded-2xl flex items-center justify-center group-hover:border-sky-500 group-hover:bg-slate-800 transition-all shadow-lg group-hover:-translate-y-1">
                  <Smartphone className="w-7 h-7 text-sky-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-white">{t.process.s3Title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed font-medium">{t.process.s3Desc}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = ({ t }) => {
  return (
    <footer className="bg-white border-t border-slate-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-sky-600 p-1.5 rounded-lg">
                <Car className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-slate-800 tracking-tight">SmartParking</span>
            </div>
            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6">
              Giải pháp đỗ xe thông minh hàng đầu dành cho khu đô thị, trung tâm thương mại và tòa nhà văn phòng.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-sky-100 hover:text-sky-600 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-sky-100 hover:text-sky-600 transition-colors">
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-800 mb-4">Sản phẩm</h4>
            <ul className="space-y-3 text-sm font-medium text-slate-500">
              <li><a href="#" className="hover:text-sky-600 transition-colors">Enterprise Dashboard</a></li>
              <li><a href="#" className="hover:text-sky-600 transition-colors">Mobile App</a></li>
              <li><a href="#" className="hover:text-sky-600 transition-colors">LPR Camera System</a></li>
              <li><a href="#" className="hover:text-sky-600 transition-colors">Payment Gateway</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-800 mb-4">Hỗ trợ</h4>
            <ul className="space-y-3 text-sm font-medium text-slate-500">
              <li><a href="#" className="hover:text-sky-600 transition-colors">Trung tâm trợ giúp</a></li>
              <li><a href="#" className="hover:text-sky-600 transition-colors">Tài liệu API</a></li>
              <li><a href="#" className="hover:text-sky-600 transition-colors">Cộng đồng</a></li>
              <li><a href="#" className="hover:text-sky-600 transition-colors">Liên hệ</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-800 mb-4">Liên hệ</h4>
            <ul className="space-y-3 text-sm font-medium text-slate-500">
              <li>Email: contact@smartparking.vn</li>
              <li>Hotline: 1900 1234</li>
              <li>Địa chỉ: Tòa nhà Nexus, 123 Trần Phú, Q.1, TP.HCM</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-sm text-slate-500 font-medium">© 2024 SmartParking SaaS. {t.footer.rights}</span>
          <div className="flex gap-6 text-sm font-bold text-slate-500">
            <a href="#" className="hover:text-sky-600 transition-colors">{t.footer.terms}</a>
            <a href="#" className="hover:text-sky-600 transition-colors">{t.footer.privacy}</a>
            <a href="#" className="hover:text-sky-600 transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- MAIN PAGE COMPONENT ---

export default function WelcomePage() {
  const [lang, setLang] = useState('VN');
  const t = translations[lang];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 selection:bg-sky-200">
      <Navbar lang={lang} setLang={setLang} t={t} />
      <RealtimeStatusBar t={t} />
      <main>
        <HeroSection t={t} />
        <MainDashboard t={t} />
        <NotificationCenter t={t} />
        <PricingAndMap t={t} />
        <ProcessTimeline t={t} />
      </main>
      <Footer t={t} />
    </div>
  );
}
