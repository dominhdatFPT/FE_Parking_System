import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router';
import {
  Car, Bike, Zap, MapPin, CreditCard, Globe, ScanLine, CalendarDays,
  Smartphone, CheckCircle2, AlertTriangle, Clock, ShieldCheck,
  BatteryCharging, Maximize, Bell, ChevronRight, ChevronDown, Info,
  TrendingUp, TrendingDown, Activity, BarChart3, Users,
  LayoutDashboard, LogIn, UserPlus, Facebook, Github, Check,
  AlertCircle, Sparkles, X
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { parkingAreaSummaryService } from '../../../../services/parkingAreaSummaryService';

// --- DICTIONARY (i18n) ---
const translations = {
  VN: {
    nav: { home: "Trang chủ", dashboard: "Bảng điều khiển", notice: "Thông báo", explore: "Khám phá", login: "Đăng nhập", signup: "Đăng ký" },
    hero: { badge: "Hệ thống đang hoạt động 24/7", title1: "Quản lý bãi đỗ xe", title2: "tòa nhà thông minh", desc: "Nền tảng Smart Parking dành cho chung cư, văn phòng và trung tâm thương mại với nhận diện biển số LPR, đặt chỗ trước và thanh toán không chạm.", f1: "Thanh toán không chạm", f2: "Nhận diện biển số LPR", f3: "Theo dõi thời gian thực" },
    kpi: { 
      c1: { title: "Tổng số Slot", unit: "chỗ" }, 
      c2: { title: "Slot còn trống", unit: "chỗ" }, 
     // xoá
      c4: { title: "Hệ thống dự báo cao điểm", unit: "" },
      vsYesterday: "so với hôm qua"
    },
    live: {
      liveStatus: "LIVE", lastUpdate: "Cập nhật lần cuối:"
    },
    trend: {
      title: "Xu hướng sử dụng bãi xe"
    },
    floor: {
      title: "Quản lý khu vực", statusNormal: "Còn nhiều chỗ", statusMedium: "Trung bình", statusFull: "Gần đầy"
    },
    mapOverview: {
      title: "Sơ đồ bãi xe thông minh", 
      searchPlaceholder: "Tìm mã slot, ô tô, xe máy...",
      filters: {
        all: "Tất cả", available: "Trống", occupied: "Có xe", reserved: "Đặt trước", maintenance: "Bảo trì",
        car: "Ô tô", moto: "Xe máy"
      },
      zone: "Toà",
      floor: "Tầng",
      empty: "Trống", occupied: "Có xe", reserved: "Đặt trước"
    },

    notice: {
      title: "Thông báo từ Ban Quản Lý", viewAll: "Xem tất cả", readMore: "Đọc tiếp",
      data: [
        { id: 1, date: '15/06 08:30', title: 'Bảo trì hệ thống camera tại Zone B', type: 'Thông tin', tone: 'orange', desc: 'Hệ thống LPR tại Zone B sẽ bảo trì từ 00:00 đến 04:00 ngày 16/06.', fullContent: 'Kính gửi quý khách,\n\nNhằm nâng cao chất lượng dịch vụ và độ chính xác của hệ thống nhận diện biển số (LPR), Ban Quản Lý sẽ tiến hành bảo trì định kỳ camera tại khu vực Zone B.\n\nThời gian bảo trì: Từ 00:00 đến 04:00 sáng ngày 16/06.\n\nTrong thời gian này, barie tự động có thể hoạt động chậm hơn bình thường. Quý khách vui lòng chuẩn bị thẻ từ để quẹt thủ công nếu hệ thống không tự động mở. Mong quý khách thông cảm vì sự bất tiện này.' },
        { id: 2, date: '12/06 14:00', title: 'Mở thêm khu vực đỗ xe máy tại Zone C', type: 'Thông tin', tone: 'sky', desc: 'Nhằm phục vụ nhu cầu tăng cao, khu vực Zone C đã được mở rộng.', fullContent: 'Kính gửi quý khách,\n\nDo nhu cầu gửi xe máy tăng đột biến trong thời gian gần đây, Ban Quản Lý đã sắp xếp và mở rộng thêm 200 vị trí đỗ xe máy mới tại khu vực Zone C (Tầng hầm B2).\n\nKhu vực mới đã được trang bị đầy đủ hệ thống chiếu sáng và camera an ninh 24/7. Quý khách đi xe máy có thể di chuyển theo biển chỉ dẫn màu xanh mới được lắp đặt để đến khu vực này.' },
        { id: 3, date: '10/06 09:15', title: 'Cập nhật biểu phí gửi xe tháng', type: 'Chính sách', tone: 'orange', desc: 'Bắt đầu từ tháng 07, biểu phí đăng ký thẻ tháng sẽ có sự điều chỉnh nhẹ.', fullContent: 'Kính báo toàn thể cư dân và khách thuê,\n\nCăn cứ vào quyết định số 45/QĐ-BQL, bắt đầu từ ngày 01/07/2026, biểu phí gửi xe tháng sẽ được điều chỉnh để bù đắp chi phí vận hành hệ thống Smart Parking mới:\n\n- Ô tô: Tăng từ 1.200.000đ/tháng lên 1.300.000đ/tháng.\n- Xe máy: Giữ nguyên mức phí 120.000đ/tháng.\n\nTrân trọng thông báo!' }
      ]
    },
    funFacts: {
      title: "Có Thể Bạn Chưa Biết? 🤭",
      f1Title: "Không Gian Cực Rộng 📏",
      f1Desc: "Thiết kế phân làn thông minh, đường chạy 1 chiều chống kẹt xe hiệu quả.",
      f2Title: "Trạm Sạc EV Siêu Tốc 🔋",
      f2Desc: "Hỗ trợ các trụ sạc điện thông minh, vừa gửi xe vừa nạp đầy năng lượng!",
      f3Title: "Luôn Xanh & Sạch Sẽ 🌿",
      f3Desc: "Hệ thống thông gió công suất lớn, lọc khí liên tục, không lo ngột ngạt."
    },
    features: {
      title: "Điểm Nổi Bật Siêu Xịn ✨",
      f1Title: "An toàn tuyệt đối 🛡️",
      f1Desc: "Camera AI giám sát 24/7, nhận diện biển số chuẩn xác 99.9%!",
      f2Title: "Siêu tốc độ ⚡",
      f2Desc: "Ra vào không chạm, không cần chờ đợi lấy thẻ từ.",
      f3Title: "Thanh toán cái vèo 💳",
      f3Desc: "Quét mã QR hoặc ví điện tử siêu nhanh gọn, không cần tiền mặt.",
      f4Title: "App cực xịn xò 📱",
      f4Desc: "Đặt chỗ trước, tìm vị trí xe đậu dễ dàng ngay trên điện thoại!",
      badge: "Hơn 10,000+ người dùng đã mê mẩn! 😍"
    },
    process: {
      title: "Quy trình đỗ xe",
      s1Title: "1. Nhận diện", s1Desc: "Hệ thống LPR nhận diện biển số.",
      s2Title: "2. Đỗ xe", s2Desc: "Theo dõi bảng điện tử để tìm chỗ trống.",
      s3Title: "3. Thanh toán", s3Desc: "Thanh toán không tiền mặt khi ra.",
      rulesTitle: "Quy định", r1: "Cao: 2.2m", r2: "Tắt máy", r3: "Đỗ đúng vạch"
    },
    footer: { 
      desc: "Giải pháp đỗ xe thông minh hàng đầu dành cho khu đô thị, trung tâm thương mại và tòa nhà văn phòng.",
      products: "Sản phẩm", support: "Hỗ trợ", helpCenter: "Trung tâm trợ giúp", apiDocs: "Tài liệu API", community: "Cộng đồng",
      contact: "Liên hệ", addressLabel: "Địa chỉ", addressVal: "Tòa nhà Nexus, 123 Trần Phú, Q.1, TP.HCM",
      rights: "All rights reserved.", terms: "Điều khoản", privacy: "Bảo mật", cookies: "Cookies" 
    }
  },
  EN: {
    nav: { home: "Home", dashboard: "Dashboard", notice: "Notices", explore: "Explore", login: "Login", signup: "Sign Up" },
    hero: { badge: "System running 24/7", title1: "Smart Building", title2: "Parking Management", desc: "Smart Parking platform for apartments, offices and commercial centers with LPR, booking and contactless payment.", f1: "Contactless Payment", f2: "LPR System", f3: "Real-time Tracking" },
    kpi: { 
      c1: { title: "Total Slots", unit: "slots" }, 
      c2: { title: "Available Slots", unit: "slots" }, 
      c3: { title: "Today Traffic", unit: "vehicles" },
      c4: { title: "Peak Prediction System", unit: "" },
      vsYesterday: "vs yesterday"
    },
    live: {
      liveStatus: "LIVE", lastUpdate: "Last update:"
    },
    trend: {
      title: "Usage Trend"
    },
    floor: {
      title: "Zone Management", statusNormal: "Available", statusMedium: "Average", statusFull: "Nearly Full"
    },
    mapOverview: {
      title: "Smart Parking Map", 
      searchPlaceholder: "Search slot, car, moto...",
      filters: {
        all: "All", available: "Available", occupied: "Occupied", reserved: "Reserved", maintenance: "Maintenance",
        car: "Car", moto: "Motorbike"
      },
      zone: "Building",
      floor: "Floor",
      empty: "Available", occupied: "Occupied", reserved: "Reserved"
    },
    
    notice: {
      title: "Management Notices", viewAll: "View All", readMore: "Read More",
      data: [
        { id: 1, date: '15/06 08:30', title: 'Camera system maintenance at Zone B', type: 'Info', tone: 'orange', desc: 'LPR system at Zone B will be maintained.', fullContent: 'Dear customers,\n\nTo improve service quality and LPR system accuracy, the Management Board will conduct routine maintenance on cameras at Zone B.\n\nMaintenance time: From 00:00 to 04:00 AM on Jun 16.\n\nDuring this time, automatic barriers may operate slower than usual. Please have your parking card ready to swipe manually if needed. We apologize for the inconvenience.' },
        { id: 2, date: '12/06 14:00', title: 'New parking area at Zone C', type: 'Info', tone: 'sky', desc: 'Zone C area has been expanded.', fullContent: 'Dear customers,\n\nDue to the sudden increase in motorbike parking demand recently, the Management Board has arranged and expanded 200 new motorbike parking spots at Zone C (Basement B2).\n\nThe new area is fully equipped with lighting and 24/7 security cameras. Motorbike drivers can follow the newly installed blue directional signs to reach this area.' },
        { id: 3, date: '10/06 09:15', title: 'Monthly fee update', type: 'Policy', tone: 'orange', desc: 'Starting from July, the monthly fee will have a slight adjustment.', fullContent: 'Notice to all residents and tenants,\n\nBased on decision No. 45/QD-BQL, starting July 1st, 2026, monthly parking fees will be adjusted to cover the operating costs of the new Smart Parking system:\n\n- Cars: Increased from 1,200,000 VND/month to 1,300,000 VND/month.\n- Motorbikes: Remaining at 120,000 VND/month.\n\nSincerely!' }
      ]
    },
    funFacts: {
      title: "Did You Know? 🤭",
      f1Title: "Extra Spacious 📏",
      f1Desc: "Smart lane design, one-way routes to prevent traffic jams efficiently.",
      f2Title: "Fast EV Charging 🔋",
      f2Desc: "Supports smart charging stations, charge your car while parking!",
      f3Title: "Green & Clean 🌿",
      f3Desc: "High-capacity ventilation system, continuous air filtering."
    },
    features: {
      title: "Awesome Highlights ✨",
      f1Title: "Absolute Safety 🛡️",
      f1Desc: "24/7 AI Camera monitoring, 99.9% accurate LPR!",
      f2Title: "Lightning Fast ⚡",
      f2Desc: "Contactless entry/exit, no need to wait for cards.",
      f3Title: "Quick Payment 💳",
      f3Desc: "Scan QR code or use e-wallets fast, cash-free.",
      f4Title: "Smart App 📱",
      f4Desc: "Pre-book slots, find your parking spot easily on your phone!",
      badge: "Over 10,000+ happy users! 😍"
    },
    process: {
      title: "Parking Process",
      s1Title: "1. Detect", s1Desc: "LPR system recognizes plate.",
      s2Title: "2. Park", s2Desc: "Follow boards to available spot.",
      s3Title: "3. Pay", s3Desc: "Cashless payment upon exit.",
      rulesTitle: "Rules", r1: "Height: 2.2m", r2: "Engine off", r3: "Park within lines"
    },
    footer: { 
      desc: "Leading smart parking solution for urban areas, commercial centers, and office buildings.",
      products: "Products", support: "Support", helpCenter: "Help Center", apiDocs: "API Documentation", community: "Community",
      contact: "Contact", addressLabel: "Address", addressVal: "Nexus Building, 123 Tran Phu, Dist 1, HCMC",
      rights: "All rights reserved.", terms: "Terms", privacy: "Privacy", cookies: "Cookies" 
    }
  }
};

// --- MOCK DATA ---
const trendData = [
  { time: '06h', value: 120 },
  { time: '08h', value: 850 },
  { time: '10h', value: 920 },
  { time: '12h', value: 750 },
  { time: '14h', value: 680 },
  { time: '16h', value: 890 },
  { time: '18h', value: 1100 },
  { time: '20h', value: 450 },
  { time: '22h', value: 150 },
];

const zoneData = [
  { id: 'A', name: 'Khu A', vehicle: 'Ô tô', occupied: 40, total: 100 },
  { id: 'B', name: 'Khu B', vehicle: 'Ô tô', occupied: 72, total: 100 },
  { id: 'C', name: 'Khu C', vehicle: 'Xe máy', occupied: 28, total: 100 },
  { id: 'D', name: 'Khu D', vehicle: 'Xe máy', occupied: 91, total: 100 },
];

const buildingOptions = [
  { value: 'LK', label: 'Long Khánh' },
  { value: 'TCM', label: 'Toàn Cẩm Mỹ' },
  { value: 'BH', label: 'Biên Hòa' },
];

const floorOptions = [
  { value: '1', label: 'Tầng 1' },
  { value: '2', label: 'Tầng 2' },
  { value: '3', label: 'Tầng 3' },
];

const generateParkingAreas = (buildingCode, floor = '1') => {
  const building = buildingOptions.find((item) => item.value === buildingCode) || buildingOptions[0];
  const areaSeed = {
    LK: [18, 21, 9, 14],
    TCM: [11, 16, 20, 7],
    BH: [22, 12, 15, 19],
  };
  const baseCounts = areaSeed[building.value] || areaSeed.LK;
  const floorBoost = Number(floor) - 1;

  return ['A', 'B', 'C', 'D'].map((areaCode, index) => {
    const vehicleType = index < 2 ? 'car' : 'moto';
    const capacity = 25;
    const occupied = Math.min(capacity, baseCounts[index] + floorBoost);

    return {
      id: `${building.value}-${floor}-${areaCode}`,
      areaCode,
      name: `Khu ${areaCode}`,
      buildingName: building.label,
      floor,
      vehicleType,
      occupied,
      capacity,
    };
  });
};

const getAreaTone = (percent) => {
  if (percent < 55) {
    return {
      label: 'Còn nhiều chỗ',
      card: 'bg-emerald-50 border-emerald-200 text-emerald-800',
      meter: 'bg-emerald-500',
    };
  }
  if (percent < 85) {
    return {
      label: 'Trung bình',
      card: 'bg-amber-50 border-amber-200 text-amber-800',
      meter: 'bg-amber-500',
    };
  }
  return {
    label: 'Gần đầy',
    card: 'bg-rose-50 border-rose-200 text-rose-800',
    meter: 'bg-rose-500',
  };
};

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
  const activeSection = useScrollSpy(['hero', 'dashboard', 'thong-bao', 'kham-pha'], 200);
  
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
            <a href="#kham-pha" onClick={(e) => handleScrollToSection(e, 'kham-pha')} className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${activeSection === 'kham-pha' ? 'text-sky-700 bg-sky-50' : 'text-slate-500 hover:text-sky-600 hover:bg-slate-50'}`}>
              {t.nav.explore}
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
  const [currentBg, setCurrentBg] = useState(0);

  const backgrounds = [
    "https://www.honolulu.gov/dts/wp-content/uploads/sites/45/2023/10/Parking-Lot-1024x585.jpg",
    "https://static01.nyt.com/images/2026/02/12/multimedia/12BACKING-IN-kvtb/12BACKING-IN-kvtb-articleLarge.jpg?quality=75&auto=webp&disable=upscale",
    "https://kps.com.vn/upload/product/C5-gioi-thieu-car-parking-tu-dong-99774237_p2.jpg",
    "https://aozoom.com.vn/storage/uploads/content/images/2023/thang-8/b%C3%A3i%20g%E1%BB%ADi%20xe%20%C3%B4%20t%C3%B4%20tphcm/bai-gui-xe-quan-binh-tan.jpg",
    "https://image.luatvietnam.vn/uploaded/twebp/images/original/2021/09/23/dieu-kien-kinh-doanh-bai-do-xe_2309144305.jpeg"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgrounds.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [backgrounds.length]);

  return (
    <section id="hero" className="relative pt-20 pb-24 px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[400px]">
      <div className="absolute inset-0 z-0 overflow-hidden bg-slate-900">
        {backgrounds.map((bg, idx) => (
          <img 
            key={idx}
            src={bg} 
            alt={`Parking Background ${idx + 1}`} 
            className={`absolute inset-0 w-full h-full object-cover scale-105 transition-opacity duration-1000 ease-in-out ${currentBg === idx ? 'opacity-100' : 'opacity-0'}`}
          />
        ))}
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

// --- DASHBOARD WRAPPER ---
const MainDashboard = ({ t }) => {
  const [zone, setZone] = useState('LK');
  const [floor, setFloor] = useState('1');

  return (
    <section id="dashboard" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-20 py-12 space-y-8">
      {/* 1. KPI Row */}
      <KPIDashboard t={t} zone={zone} floor={floor} />

      {/* 2. Main Section & Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SmartParkingMap t={t} zone={zone} setZone={setZone} floor={floor} setFloor={setFloor} />
        </div>
         <div className="lg:col-span-1">
          <FloorManagement t={t} />
        </div>
      </div>

      {/* 3. Phân tích & Vận hành */}
      <div>
        <div>
          <ParkingTrendChart t={t} />
        </div>
      </div>
    </section>
  );
};

const KPIDashboard = ({ t, zone, floor }) => {
  // Generate data dynamically based on zone and floor
  const baseTotal = zone === 'C' ? 120 : 100;
  const floorMult = floor === 'B1' ? 1 : floor === 'B2' ? 0.8 : 0.6;
  const totalSlots = Math.round(baseTotal * floorMult);
  
  const occupiedRatio = zone === 'A' ? 0.85 : zone === 'B' ? 0.6 : 0.4;
  const occupied = Math.round(totalSlots * occupiedRatio * floorMult);
  const availableSlots = totalSlots - occupied;
  
  const availableProgress = totalSlots > 0 ? Math.round((availableSlots / totalSlots) * 100) : 0;
  
  const todayTraffic = Math.round(totalSlots * 3.5 * floorMult);
  
  const peakStart = zone === 'A' ? 17 : zone === 'B' ? 18 : 16;
  const peakEnd = peakStart + 2;

  const kpis = [
    { id: 1, title: t.kpi.c1.title, value: totalSlots.toString(), unit: t.kpi.c1.unit, trend: '', trendDir: '', icon: LayoutDashboard, color: 'slate', progress: 100 },
    { id: 2, title: t.kpi.c2.title, value: availableSlots.toString(), unit: t.kpi.c2.unit, trend: '-5%', trendDir: 'down', icon: Car, color: 'emerald', progress: availableProgress },
      // xoá 
    { id: 4, title: t.kpi.c4.title, value: `${peakStart}:00`, unit: `- ${peakEnd}:00`, trend: '', trendDir: '', icon: Sparkles, color: 'orange', progress: 0 },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {kpis.map((kpi) => (
        <div key={kpi.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all group cursor-default">
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3.5 rounded-xl bg-${kpi.color}-50 text-${kpi.color}-600 group-hover:scale-110 transition-transform`}>
              <kpi.icon className="w-6 h-6" />
            </div>
            {kpi.trend && (
              <div className={`flex items-center gap-1 text-sm font-bold px-2.5 py-1 rounded-full ${kpi.trendDir === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                {kpi.trendDir === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {kpi.trend}
              </div>
            )}
          </div>
          <p className="text-slate-500 font-bold mb-1 text-sm">{kpi.title}</p>
          <div className="flex items-baseline gap-1 mb-4">
            <span className="text-3xl font-black text-slate-800 tracking-tight">{kpi.value}</span>
            <span className="text-sm font-bold text-slate-400">{kpi.unit}</span>
          </div>
          {/* Mini progress */}
          {kpi.progress > 0 && (
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div className={`h-1.5 rounded-full bg-${kpi.color}-500`} style={{ width: `${kpi.progress}%` }}></div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const SmartParkingMap = ({ t, zone, setZone, floor, setFloor }) => {
  const [areas, setAreas] = useState([]);
  const [loadingAreas, setLoadingAreas] = useState(true);
  const [areaError, setAreaError] = useState('');

  useEffect(() => {
    let active = true;

    const fetchAreas = async () => {
      setLoadingAreas(true);
      setAreaError('');

      const result = await parkingAreaSummaryService.getAreas({
        buildingCode: zone,
        floorNumber: floor,
      });

      if (!active) return;

      if (result.error) {
        setAreas([]);
        setAreaError('Không thể tải dữ liệu bãi đỗ xe');
        setLoadingAreas(false);
        return;
      }

      const mappedAreas = (result.data || []).map((area) => {
        const vehicleType = area.vehicleType === 'CAR' ? 'car' : 'moto';

        return {
          id: area.id,
          areaCode: area.areaCode,
          name: `Khu ${area.areaCode}`,
          buildingName: area.buildingName,
          floor: String(area.floorNumber),
          vehicleType,
          occupied: Number(area.currentVehicleCount || 0),
          capacity: Number(area.capacity || 25),
        };
      });

      setAreas(mappedAreas);
      setLoadingAreas(false);
    };

    fetchAreas();

    return () => {
      active = false;
    };
  }, [zone, floor]);

  const totalOccupied = areas.reduce((sum, area) => sum + area.occupied, 0);
  const totalCapacity = areas.reduce((sum, area) => sum + area.capacity, 0);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
          <MapPin className="text-sky-500 w-5 h-5" /> {t.mapOverview.title}
        </h3>
        <div className="flex items-center gap-3">
          <CustomSelect value={floor} options={floorOptions} onChange={setFloor} />
          <CustomSelect value={zone} options={buildingOptions} onChange={setZone} />
        </div>
      </div>

      <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-wide">Tổng xe trong bãi</p>
          <p className="text-2xl font-black text-slate-900">{totalOccupied}<span className="text-sm text-slate-500">/{totalCapacity} xe</span></p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-slate-500">Quản lý theo khu</p>
          <p className="text-sm font-black text-slate-700">Không gán vị trí cụ thể</p>
        </div>
      </div>

      {/* Area Grid */}
      <div className="flex-1 bg-slate-100 rounded-xl border border-slate-200 p-4 mb-4 grid grid-cols-2 sm:grid-cols-4 gap-3 content-start">
        {loadingAreas && (
          <div className="col-span-full min-h-[156px] rounded-xl border border-slate-200 bg-white flex items-center justify-center text-sm font-bold text-slate-500">
            Đang tải dữ liệu từ BE...
          </div>
        )}

        {!loadingAreas && areaError && (
          <div className="col-span-full min-h-[156px] rounded-xl border border-rose-200 bg-rose-50 flex items-center justify-center text-sm font-bold text-rose-600">
            {areaError}
          </div>
        )}

        {!loadingAreas && !areaError && areas.length === 0 && (
          <div className="col-span-full min-h-[156px] rounded-xl border border-slate-200 bg-white flex items-center justify-center text-sm font-bold text-slate-500">
            Chưa có dữ liệu cho tòa và tầng này
          </div>
        )}

        {!loadingAreas && !areaError && areas.map((area) => {
          const percent = Math.round((area.occupied / area.capacity) * 100);
          const tone = getAreaTone(percent);
          return (
            <div
              key={area.id}
              className={`min-h-[156px] rounded-xl border-2 p-4 transition-all duration-300 flex flex-col justify-between shadow-sm ${tone.card}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-black text-slate-800">{area.name}</p>
                  <p className="text-[11px] font-bold text-slate-500">
                    {area.buildingName} - Tầng {area.floor}
                  </p>
                  <p className="text-[11px] font-bold text-slate-500">
                    {area.vehicleType === 'car' ? 'Dành cho ô tô' : 'Dành cho xe máy'}
                  </p>
                </div>
                {area.vehicleType === 'car'
                  ? <Car className="w-4 h-4 opacity-70" />
                  : <Bike className="w-4 h-4 opacity-70" />}
              </div>

              <div>
                <div className="flex items-end justify-between mb-2">
                  <p className="text-2xl font-black">{area.occupied}<span className="text-xs opacity-60">/{area.capacity}</span></p>
                  <span className="text-[10px] font-black opacity-70">{percent}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/70 overflow-hidden">
                  <div className={`h-full rounded-full ${tone.meter}`} style={{ width: `${percent}%` }} />
                </div>
                <p className="mt-1 text-[10px] font-bold opacity-70">{tone.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 items-center text-[10px] font-bold text-slate-500 px-2 mt-auto pt-4 border-t border-slate-100">
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-emerald-100 border border-emerald-300 rounded-sm"></div> Còn nhiều chỗ</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-amber-100 border border-amber-300 rounded-sm"></div> Trung bình</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-rose-100 border border-rose-300 rounded-sm"></div> Gần đầy</div>
      </div>
    </div>
  );
};


const ParkingTrendChart = ({ t }) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm h-full">
      <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-sky-500" /> {t.trend.title}
      </h3>
      <div className="w-full h-[300px] min-h-[300px]">
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
              contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
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
    if (pct < 60) {
      return {
        text: t.floor.statusNormal,
        card: 'bg-emerald-50 border-emerald-200 text-emerald-800',
        badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        bar: 'bg-emerald-500',
      };
    }
    if (pct < 85) {
      return {
        text: t.floor.statusMedium,
        card: 'bg-amber-50 border-amber-200 text-amber-800',
        badge: 'bg-amber-100 text-amber-700 border-amber-200',
        bar: 'bg-amber-500',
      };
    }
    return {
      text: t.floor.statusFull,
      card: 'bg-rose-50 border-rose-200 text-rose-800',
      badge: 'bg-rose-100 text-rose-700 border-rose-200',
      bar: 'bg-rose-500',
    };
  };
  const totalOccupied = zoneData.reduce((sum, zone) => sum + zone.occupied, 0);
  const totalCapacity = zoneData.reduce((sum, zone) => sum + zone.total, 0);
  const totalPct = Math.round((totalOccupied / totalCapacity) * 100);

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm h-full">
      <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
        <MapPin className="w-5 h-5 text-sky-500" /> {t.floor.title}
      </h3>
      <div className="relative grid grid-cols-2 gap-3">
        {zoneData.map(z => {
          const pct = Math.round((z.occupied / z.total) * 100);
          const badge = getBadge(pct);
          return (
            <div key={z.id} className={`rounded-xl border p-4 min-h-[128px] ${badge.card}`}>
              <div className="flex justify-between items-start gap-2 mb-4">
                <div>
                  <p className="font-black text-lg">{z.name}</p>
                  <p className="text-xs font-bold opacity-70">{z.vehicle}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${badge.badge}`}>
                  {badge.text}
                </span>
              </div>
              <div className="flex justify-between items-end mb-3">
                <div className="text-2xl font-black">{z.occupied}<span className="text-sm opacity-60">/{z.total}</span></div>
                <div className="text-xs font-black opacity-70">{pct}%</div>
              </div>
              <div className="w-full bg-white/70 rounded-full h-2 overflow-hidden">
                <div className={`h-2 rounded-full ${badge.bar} transition-all duration-1000`} style={{ width: `${pct}%` }}></div>
              </div>
            </div>
          );
        })}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-32 h-32 rounded-full bg-white border border-slate-200 shadow-xl flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wide">Đang đỗ</span>
            <span className="text-3xl font-black text-slate-900 leading-none">{totalOccupied}</span>
            <span className="text-xs font-bold text-slate-500">xe / {totalPct}%</span>
          </div>
        </div>
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
        className="flex items-center justify-between gap-2 bg-[#0EA5E9] hover:bg-[#0284c7] text-base !font-bold !text-white border border-[#0ea5e9] rounded-lg px-3 py-2 outline-none cursor-pointer transition-colors min-w-[120px]"
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

const NotificationCenter = ({ t }) => {
  const [selectedNotice, setSelectedNotice] = useState(null);

  const getBadgeColor = (tone) => {
    if(tone === 'red') return 'bg-red-50 text-red-600 border-red-200';
    if(tone === 'sky') return 'bg-sky-50 text-sky-600 border-sky-200';
    if(tone === 'orange') return 'bg-orange-50 text-orange-600 border-orange-200';
    return 'bg-slate-50 text-slate-600 border-slate-200';
  };

  return (
    <section id="thong-bao" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16 relative">
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
          <div 
            key={ann.id} 
            onClick={() => setSelectedNotice(ann)}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all cursor-pointer flex flex-col h-full group"
          >
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

      {/* Modal */}
      {selectedNotice && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg border ${getBadgeColor(selectedNotice.tone)}`}>
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{selectedNotice.type}</h3>
                  <p className="text-xs font-bold text-slate-400">{selectedNotice.date}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedNotice(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh] custom-scrollbar">
              <h2 className="text-xl font-extrabold text-slate-800 mb-4">{selectedNotice.title}</h2>
              <div className="text-slate-600 text-sm font-medium leading-relaxed whitespace-pre-wrap">
                {selectedNotice.fullContent || selectedNotice.desc}
              </div>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setSelectedNotice(null)}
                className="px-6 py-2 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-lg transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

const PricingAndMap = ({ t }) => {
  return (
    <div id="kham-pha" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16">
      <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-3xl p-6 sm:p-10 shadow-lg border border-indigo-100 flex flex-col lg:flex-row items-center gap-10">
        {/* Image Side */}
        <div className="w-full lg:w-1/2 h-[400px] rounded-2xl overflow-hidden shadow-2xl relative group">
          <img 
            src="https://images.unsplash.com/photo-1506521781263-d8422e82f27a?q=80&w=2070&auto=format&fit=crop" 
            alt="Smart Parking Technology" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
          <div className="absolute bottom-6 left-6 right-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm font-bold mb-3">
              <ScanLine className="w-4 h-4" /> Công nghệ thông minh
            </div>
            <h3 className="text-white font-bold text-xl drop-shadow-md">Nhận diện biển số và thanh toán chạm cực mượt mà</h3>
          </div>
        </div>
        
        {/* Info Side */}
        <div className="w-full lg:w-1/2 space-y-8">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-800 mb-4 flex items-center gap-3">
              <div className="p-2 bg-indigo-100 text-indigo-500 rounded-xl">
                <Sparkles className="w-7 h-7" />
              </div>
              {t.features.title}
            </h2>
            <p className="text-slate-500 font-medium text-lg leading-relaxed">
              Khám phá những công nghệ đột phá giúp bãi đỗ xe của chúng tôi trở nên thông minh và khác biệt so với phần còn lại.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="bg-white p-4 rounded-xl border border-indigo-50 shadow-sm hover:shadow-md transition-shadow">
              <ShieldCheck className="w-6 h-6 text-indigo-500 mb-3" />
              <h4 className="font-bold text-slate-800 mb-1">{t.features.f1Title}</h4>
              <p className="text-sm text-slate-500">{t.features.f1Desc}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-indigo-50 shadow-sm hover:shadow-md transition-shadow">
              <Zap className="w-6 h-6 text-orange-500 mb-3" />
              <h4 className="font-bold text-slate-800 mb-1">{t.features.f2Title}</h4>
              <p className="text-sm text-slate-500">{t.features.f2Desc}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-indigo-50 shadow-sm hover:shadow-md transition-shadow">
              <CreditCard className="w-6 h-6 text-sky-500 mb-3" />
              <h4 className="font-bold text-slate-800 mb-1">{t.features.f3Title}</h4>
              <p className="text-sm text-slate-500">{t.features.f3Desc}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-indigo-50 shadow-sm hover:shadow-md transition-shadow">
              <Smartphone className="w-6 h-6 text-emerald-500 mb-3" />
              <h4 className="font-bold text-slate-800 mb-1">{t.features.f4Title}</h4>
              <p className="text-sm text-slate-500">{t.features.f4Desc}</p>
            </div>
          </div>
        </div>
      </div>
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
              {t.footer.desc}
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
            <h4 className="font-bold text-slate-800 mb-4">{t.footer.products}</h4>
            <ul className="space-y-3 text-sm font-medium text-slate-500">
              <li><a href="#" className="hover:text-sky-600 transition-colors">Enterprise Dashboard</a></li>
              <li><a href="#" className="hover:text-sky-600 transition-colors">Mobile App</a></li>
              <li><a href="#" className="hover:text-sky-600 transition-colors">LPR Camera System</a></li>
              <li><a href="#" className="hover:text-sky-600 transition-colors">Payment Gateway</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-800 mb-4">{t.footer.support}</h4>
            <ul className="space-y-3 text-sm font-medium text-slate-500">
              <li><a href="#" className="hover:text-sky-600 transition-colors">{t.footer.helpCenter}</a></li>
              <li><a href="#" className="hover:text-sky-600 transition-colors">{t.footer.apiDocs}</a></li>
              <li><a href="#" className="hover:text-sky-600 transition-colors">{t.footer.community}</a></li>
              <li><a href="#" className="hover:text-sky-600 transition-colors">{t.footer.contact}</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-800 mb-4">{t.footer.contact}</h4>
            <ul className="space-y-3 text-sm font-medium text-slate-500">
              <li>Email: contact@smartparking.vn</li>
              <li>Hotline: 1900 1234</li>
              <li>{t.footer.addressLabel}: {t.footer.addressVal}</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-sm text-slate-500 font-medium">© 2026 SmartParking SaaS. {t.footer.rights}</span>
          <div className="flex gap-6 text-sm font-bold text-slate-500">
            <a href="#" className="hover:text-sky-600 transition-colors">{t.footer.terms}</a>
            <a href="#" className="hover:text-sky-600 transition-colors">{t.footer.privacy}</a>
            <a href="#" className="hover:text-sky-600 transition-colors">{t.footer.cookies}</a>
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
