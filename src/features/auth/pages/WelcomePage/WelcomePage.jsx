import React, { useState, useEffect, useRef } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router';
import i18n from 'i18next';
import {
  Car, Zap, MapPin, CreditCard, Globe, ScanLine, CalendarDays,
  Smartphone, CheckCircle2, Clock, ShieldCheck,
  Bell, ChevronRight, ChevronDown,
  TrendingUp, TrendingDown, BarChart3,
  LayoutDashboard, LogIn, UserPlus, Facebook, Github, X,
  Mail, Phone, Coins, Sparkles, Camera, DoorOpen, ClipboardList, Database
} from 'lucide-react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  notificationService,
  getCategoryToneClass,
  getCategoryLabel,
} from '../../../../services/notificationService';
import { vietnamDayjs } from '../../../../utils/dateTime';
import Logo from '../../../../components/Logo';
import { useAuth } from '../../../../contexts/useAuth';
import { ROUTES } from '../../../../constants/routes';

function getDashboardPath(role) {
  const normalizedRole = role?.toLowerCase();

  if (normalizedRole === 'admin' || normalizedRole === 'staff') {
    return ROUTES.ADMIN.DASHBOARD;
  }

  return ROUTES.DRIVER.DASHBOARD;
}

// --- DICTIONARY (i18n) ---
const translations = {
  vi: {
    nav: { home: "Trang chủ", dashboard: "Bảng điều khiển", notice: "Thông báo", explore: "Khám phá", checkout: "Thanh toán", login: "Đăng nhập", signup: "Đăng ký" },
    hero: { title1: "Quản lý bãi đỗ xe", title2: "tòa nhà thông minh", desc: "Nền tảng Smart Parking dành cho chung cư, văn phòng và trung tâm thương mại với đặt chỗ trước, nhận diện biển số LPR và theo dõi trạng thái thời gian thực.", f1: "Đặt chỗ trước", f2: "Nhận diện biển số LPR", f3: "Theo dõi thời gian thực" },
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
      emptyTitle: "Chưa có thông báo nào", emptyDescription: "Vui lòng quay lại sau.",
      loadError: "Không tải được nội dung", noDetail: "Chưa có nội dung chi tiết.", close: "Đóng",
      categoryLabels: {
        "Hệ thống": "Hệ thống", "Bảo trì": "Bảo trì", "Gói gửi xe": "Gói gửi xe",
        "Thanh toán": "Thanh toán", "Sự cố": "Sự cố", THONG_TIN: "Thông tin",
        CHINH_SACH: "Chính sách", CANH_BAO: "Cảnh báo", BAO_TRI: "Bảo trì"
      },
      data: [
        { id: 1, date: '15/06 08:30', title: 'Bảo trì hệ thống camera tại Zone B', type: 'Thông tin', tone: 'orange', desc: 'Hệ thống LPR tại Zone B sẽ bảo trì từ 00:00 đến 04:00 ngày 16/06.', fullContent: 'Kính gửi quý khách,\n\nNhằm nâng cao chất lượng dịch vụ và độ chính xác của hệ thống nhận diện biển số (LPR), Ban Quản Lý sẽ tiến hành bảo trì định kỳ camera tại khu vực Zone B.\n\nThời gian bảo trì: Từ 00:00 đến 04:00 sáng ngày 16/06.\n\nTrong thời gian này, barie tự động có thể hoạt động chậm hơn bình thường. Quý khách vui lòng chuẩn bị thẻ từ để quẹt thủ công nếu hệ thống không tự động mở. Mong quý khách thông cảm vì sự bất tiện này.' },
        { id: 2, date: '12/06 14:00', title: 'Mở thêm khu vực đỗ xe máy tại Zone C', type: 'Thông tin', tone: 'sky', desc: 'Nhằm phục vụ nhu cầu tăng cao, khu vực Zone C đã được mở rộng.', fullContent: 'Kính gửi quý khách,\n\nDo nhu cầu gửi xe máy tăng đột biến trong thời gian gần đây, Ban Quản Lý đã sắp xếp và mở rộng thêm 200 vị trí đỗ xe máy mới tại khu vực Zone C (Tầng hầm B2).\n\nKhu vực mới đã được trang bị đầy đủ hệ thống chiếu sáng và camera an ninh 24/7. Quý khách đi xe máy có thể di chuyển theo biển chỉ dẫn màu xanh mới được lắp đặt để đến khu vực này.' },
        { id: 3, date: '10/06 09:15', title: 'Cập nhật biểu phí gửi xe tháng', type: 'Chính sách', tone: 'orange', desc: 'Bắt đầu từ tháng 07, biểu phí đăng ký thẻ tháng sẽ có sự điều chỉnh nhẹ.', fullContent: 'Kính báo toàn thể cư dân và khách thuê,\n\nCăn cứ vào quyết định số 45/QĐ-BQL, bắt đầu từ ngày 01/07/2026, biểu phí gửi xe tháng sẽ được điều chỉnh để bù đắp chi phí vận hành hệ thống Smart Parking mới:\n\n- Ô tô: Tăng từ 1.200.000đ/tháng lên 1.300.000đ/tháng.\n- Xe máy: Giữ nguyên mức phí 120.000đ/tháng.\n\nTrân trọng thông báo!' }
      ]
    },
    funFacts: {
      title: "Thông tin hữu ích",
      f1Title: "Không gian tối ưu",
      f1Desc: "Thiết kế phân làn thông minh, đường chạy 1 chiều chống kẹt xe hiệu quả.",
      f2Title: "Trạm sạc xe điện EV",
      f2Desc: "Hỗ trợ các trụ sạc điện thông minh, vừa gửi xe vừa nạp đầy năng lượng!",
      f3Title: "Hệ thống thông gió xanh",
      f3Desc: "Hệ thống thông gió công suất lớn, lọc khí liên tục, không lo ngột ngạt."
    },
    features: {
      title: "Công nghệ nổi bật",
      f1Title: "An toàn bảo mật",
      f1Desc: "Camera giám sát 24/7, nhận diện biển số chuẩn xác 99.9%!",
      f2Title: "Tối ưu tốc độ",
      f2Desc: "Ra vào không chạm, không cần chờ đợi lấy thẻ từ.",
      f3Title: "Thanh toán dễ dàng",
      f3Desc: "Quét mã QR hoặc ví điện tử siêu nhanh gọn, không cần tiền mặt.",
      f4Title: "Ứng dụng di động",
      f4Desc: "Đặt chỗ trước, tìm vị trí xe đậu dễ dàng ngay trên điện thoại!",
      badge: "Hơn 10,000+ người dùng tin cậy"
    },
    process: {
      title: "Quy trình đỗ xe",
      subtitle: "Đơn giản hóa trải nghiệm đỗ xe của bạn",
      duration: "Toàn bộ quy trình dưới 30 giây",
      s1Title: "1. Nhận diện", s1Desc: "Hệ thống LPR nhận diện biển số.",
      s2Title: "2. Đỗ xe", s2Desc: "Theo dõi bảng điện tử để tìm chỗ trống.",
      s3Title: "3. Thanh toán", s3Desc: "Thanh toán không tiền mặt khi ra.",
      rulesTitle: "Quy định", r1: "Cao: 2.2m", r2: "Tắt máy", r3: "Đỗ đúng vạch"
    },
    showcase: {
      title: "Trải nghiệm Đỗ xe Thông minh",
      subtitle: "Khám phá quy trình khép kín tự động hóa, giúp bạn đỗ xe nhanh chóng và thuận tiện.",
      tag: "HÀNH TRÌNH TRẢI NGHIỆM",
      card1Title: "Đăng ký phương tiện",
      card1Desc: "Đăng ký biển số và thông tin phương tiện để bắt đầu sử dụng hệ thống.",
      card2Title: "Biểu phí minh bạch",
      card2Desc: "Xem bảng giá rõ ràng và đầy đủ trước khi sử dụng dịch vụ.",
      card3Title: "Nhận diện biển số",
      card3Desc: "Camera tự động nhận diện biển số nhanh chóng và chính xác để hỗ trợ kiểm soát phương tiện.",
      card4Title: "Trải nghiệm thông minh",
      card4Desc: "Quản lý phương tiện, theo dõi lịch sử gửi xe và sử dụng dịch vụ trên giao diện trực quan, hiện đại.",
      card5Title: "Thanh toán tiện lợi",
      card5Desc: "Thanh toán nhanh chóng bằng QR hoặc các phương thức không tiền mặt."
    },
    footer: { 
      desc: "Nền tảng quản lý bãi đỗ xe thông minh cho tòa nhà, chung cư và trung tâm thương mại.",
      products: "Chức năng", f1: "Đăng ký thẻ xe", f3: "Quản lý phương tiện", f4: "Thanh toán",
      support: "Hỗ trợ", faq: "Câu hỏi thường gặp", guide: "Hướng dẫn sử dụng",
      contact: "Liên hệ", addressLabel: "Địa chỉ", addressVal: "TP. Hồ Chí Minh",
      rights: "All rights reserved.", terms: "Điều khoản sử dụng", privacy: "Chính sách bảo mật" 
    },
    vehicleLog: {
      title: "Lịch sử Xe Ra / Vào",
      plate: "Biển số",
      vehicle: "Phương tiện",
      checkIn: "Giờ vào",
      checkOut: "Giờ ra",
      status: "Trạng thái",
      inParking: "Đang đỗ",
      completed: "Đã hoàn thành",
      car: "Ô tô",
      motorbike: "Xe máy"
    },
    gateControl: {
      title: "Kiểm soát Cổng",
      entrance: "Cổng vào",
      exit: "Cổng ra",
      open: "Mở",
      processing: "Đang xử lý",
      lastPlate: "Biển số cuối",
      vehiclesInside: "Xe trong bãi",
      capacity: "Sức chứa",
      occupancy: "Hiệu suất"
    }
  },
  en: {
    nav: { home: "Home", dashboard: "Dashboard", notice: "Notices", explore: "Explore", checkout: "Checkout", login: "Login", signup: "Sign Up" },
    hero: { title1: "Smart Building", title2: "Parking Management", desc: "Smart Parking platform for apartments, offices and commercial centers with pre-booking, LPR system, and real-time tracking.", f1: "Pre-booking", f2: "LPR System", f3: "Real-time Tracking" },
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
      emptyTitle: "No notices yet", emptyDescription: "Please check back later.",
      loadError: "Unable to load content", noDetail: "No detailed content available.", close: "Close",
      categoryLabels: {
        "Hệ thống": "System", "Bảo trì": "Maintenance", "Gói gửi xe": "Parking Plan",
        "Thanh toán": "Payment", "Sự cố": "Incident", THONG_TIN: "Information",
        CHINH_SACH: "Policy", CANH_BAO: "Warning", BAO_TRI: "Maintenance"
      },
      data: [
        { id: 1, date: '15/06 08:30', title: 'Camera system maintenance at Zone B', type: 'Info', tone: 'orange', desc: 'LPR system at Zone B will be maintained.', fullContent: 'Dear customers,\n\nTo improve service quality and LPR system accuracy, the Management Board will conduct routine maintenance on cameras at Zone B.\n\nMaintenance time: From 00:00 to 04:00 AM on Jun 16.\n\nDuring this time, automatic barriers may operate slower than usual. Please have your parking card ready to swipe manually if needed. We apologize for the inconvenience.' },
        { id: 2, date: '12/06 14:00', title: 'New parking area at Zone C', type: 'Info', tone: 'sky', desc: 'Zone C area has been expanded.', fullContent: 'Dear customers,\n\nDue to the sudden increase in motorbike parking demand recently, the Management Board has arranged and expanded 200 new motorbike parking spots at Zone C (Basement B2).\n\nThe new area is fully equipped with lighting and 24/7 security cameras. Motorbike drivers can follow the newly installed blue directional signs to reach this area.' },
        { id: 3, date: '10/06 09:15', title: 'Monthly fee update', type: 'Policy', tone: 'orange', desc: 'Starting from July, the monthly fee will have a slight adjustment.', fullContent: 'Notice to all residents and tenants,\n\nBased on decision No. 45/QD-BQL, starting July 1st, 2026, monthly parking fees will be adjusted to cover the operating costs of the new Smart Parking system:\n\n- Cars: Increased from 1,200,000 VND/month to 1,300,000 VND/month.\n- Motorbikes: Remaining at 120,000 VND/month.\n\nSincerely!' }
      ]
    },
    funFacts: {
      title: "Useful Information",
      f1Title: "Optimized Space",
      f1Desc: "Smart lane design, one-way routes to prevent traffic jams efficiently.",
      f2Title: "EV Charging Stations",
      f2Desc: "Supports smart charging stations, charge your car while parking!",
      f3Title: "Green Ventilation",
      f3Desc: "High-capacity ventilation system, continuous air filtering."
    },
    features: {
      title: "Key Features",
      f1Title: "Secure System",
      f1Desc: "24/7 Camera monitoring, 99.9% accurate LPR!",
      f2Title: "High Performance",
      f2Desc: "Contactless entry/exit, no need to wait for cards.",
      f3Title: "Seamless Payment",
      f3Desc: "Scan QR code or use e-wallets fast, cash-free.",
      f4Title: "Mobile Application",
      f4Desc: "Pre-book slots, find your parking spot easily on your phone!",
      badge: "Trusted by over 10,000+ users"
    },
    process: {
      title: "Parking Process",
      subtitle: "Simplify your parking experience",
      duration: "Complete the entire process in under 30 seconds",
      s1Title: "1. Detect", s1Desc: "LPR system recognizes plate.",
      s2Title: "2. Park", s2Desc: "Follow boards to available spot.",
      s3Title: "3. Pay", s3Desc: "Cashless payment upon exit.",
      rulesTitle: "Rules", r1: "Height: 2.2m", r2: "Engine off", r3: "Park within lines"
    },
    showcase: {
      title: "Smart Parking Journey",
      subtitle: "Discover how simple and automated the parking cycle is with our SaaS infrastructure.",
      tag: "USER JOURNEY",
      card1Title: "Register Vehicle",
      card1Desc: "Register your license plate and vehicle information to start using the system.",
      card2Title: "Transparent Pricing",
      card2Desc: "View clear and complete pricing details before using the service.",
      card3Title: "License Plate Recognition",
      card3Desc: "Camera automatically recognizes plates quickly and accurately to support vehicle control.",
      card4Title: "Smart Parking Experience",
      card4Desc: "Manage vehicles, track parking history, and use services on a modern, intuitive interface.",
      card5Title: "Convenient Payment",
      card5Desc: "Pay quickly with QR codes or other cashless methods."
    },
    footer: { 
      desc: "Smart parking management platform for buildings, apartments and shopping centers.",
      products: "Features", f1: "Register parking card", f3: "Manage vehicle", f4: "Payment",
      support: "Support", faq: "FAQs", guide: "User guide",
      contact: "Contact", addressLabel: "Address", addressVal: "Ho Chi Minh City",
      rights: "All rights reserved.", terms: "Terms of Use", privacy: "Privacy Policy" 
    },
    vehicleLog: {
      title: "Vehicle In / Out History",
      plate: "Plate",
      vehicle: "Vehicle",
      checkIn: "Check In",
      checkOut: "Check Out",
      status: "Status",
      inParking: "In Parking",
      completed: "Completed",
      car: "Car",
      motorbike: "Motorbike"
    },
    gateControl: {
      title: "Gate Control",
      entrance: "Entrance Gate",
      exit: "Exit Gate",
      open: "Open",
      processing: "Processing",
      lastPlate: "Last Plate",
      vehiclesInside: "Vehicles Inside",
      capacity: "Capacity",
      occupancy: "Occupancy"
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

void zoneData;
void floorOptions;
void generateParkingAreas;
void getAreaTone;

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
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isScrolled = scrollY > 20;
  
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

  const getNavLinkClass = (sectionId) => {
    const isActive = activeSection === sectionId;
    const baseClass = 'inline-flex h-11 items-center justify-center whitespace-nowrap rounded-xl px-3 text-sm font-bold leading-none transition-all duration-300 xl:px-4';
    if (isActive) {
      return isScrolled
        ? `${baseClass} text-sky-700 bg-sky-50`
        : `${baseClass} text-sky-300 bg-white/10`;
    }
    return isScrolled
      ? `${baseClass} text-slate-700 hover:text-sky-700 hover:bg-slate-50`
      : `${baseClass} text-white hover:text-sky-300 hover:bg-white/5`;
  };

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200' 
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="mx-auto flex h-20 max-w-[1500px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-5 xl:gap-8">
          <div className="shrink-0 cursor-pointer" onClick={reloadPage}>
            <Logo variant="horizontal" size="md" theme={isScrolled ? 'brand' : 'dark'} />
          </div>

          <nav className="hidden items-center gap-1 lg:flex xl:gap-2">
            <a href="#" onClick={handleScrollToTop} className={getNavLinkClass('hero')}>
              {t.nav.home}
            </a>
            <a href="#dashboard" onClick={(e) => handleScrollToSection(e, 'dashboard')} className={getNavLinkClass('dashboard')}>
              {t.nav.dashboard}
            </a>
            <a href="#thong-bao" onClick={(e) => handleScrollToSection(e, 'thong-bao')} className={getNavLinkClass('thong-bao')}>
              {t.nav.notice}
            </a>
            <a href="#kham-pha" onClick={(e) => handleScrollToSection(e, 'kham-pha')} className={getNavLinkClass('kham-pha')}>
              {t.nav.explore}
            </a>
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-2 xl:gap-3">
          <button 
            onClick={() => setLang(lang === 'vi' ? 'en' : 'vi')}
            className={`inline-flex h-11 items-center gap-1.5 whitespace-nowrap rounded-xl px-3 text-sm font-bold leading-none transition-all ${
              isScrolled 
                ? 'bg-slate-100 hover:bg-slate-200 hover:text-sky-600' 
                : 'bg-white/10 hover:bg-white/20 hover:text-sky-300'
            }`}
            style={{ color: isScrolled ? '#475569' : '#ffffff' }}
          >
            <Globe className="w-4 h-4" />
            <span>{lang === 'vi' ? 'VN' : 'EN'}</span>
          </button>
          <div className={`h-5 w-px hidden sm:block transition-all duration-300 ${isScrolled ? 'bg-slate-200' : 'bg-white/40'}`}></div>
          <button
            type="button"
            title={t.nav.checkout}
            onClick={() => navigate(ROUTES.VISITOR_CHECKOUT)}
            className={`inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-xl px-3 text-sm font-bold leading-none transition-all sm:px-4 ${
              isScrolled
                ? 'bg-sky-50 text-sky-700 ring-1 ring-sky-100 hover:bg-sky-100 hover:text-sky-800'
                : 'bg-white text-slate-900 hover:bg-sky-50'
            }`}
          >
            <CreditCard className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">{t.nav.checkout}</span>
          </button>
          <button 
            onClick={() => navigate('/login')}
            className={`hidden h-11 items-center gap-2 whitespace-nowrap rounded-xl px-3 text-sm font-bold leading-none transition-all sm:flex xl:px-4 ${
              isScrolled 
                ? 'hover:bg-slate-50 hover:text-sky-600' 
                : 'hover:bg-white/10 hover:text-sky-300'
            }`}
            style={{ color: isScrolled ? '#334155' : '#ffffff' }}
          >
            <LogIn className="w-4 h-4" />
            <span>{t.nav.login}</span>
          </button>
          <button 
            onClick={() => navigate('/signup')}
            className="flex h-11 items-center gap-2 whitespace-nowrap rounded-xl bg-[#0EA5E9] px-4 text-sm font-bold leading-none text-white shadow-md shadow-sky-500/20 transition-all hover:-translate-y-0.5 hover:bg-[#0284c7] xl:px-5"
            style={{ color: '#FFFFFF' }}
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

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.4
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <section id="hero" className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[480px]">
      <div className="absolute inset-0 z-0 overflow-hidden bg-slate-900">
        <motion.div
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full"
        >
          {backgrounds.map((bg, idx) => (
            <img 
              key={idx}
              src={bg} 
              alt={`Parking Background ${idx + 1}`} 
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${currentBg === idx ? 'opacity-100' : 'opacity-0'}`}
            />
          ))}
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/70 to-sky-950/65"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto text-center w-full flex flex-col items-center">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-[28px] md:text-[34px] font-bold text-white tracking-tight mb-4 drop-shadow-lg leading-[1.2]"
        >
          {t.hero.title1} <br className="hidden sm:block" />
          <span className="text-sky-400">{t.hero.title2}</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-[16px] text-slate-300 max-w-[60ch] mx-auto mb-5 drop-shadow leading-[1.6] font-normal"
        >
          {t.hero.desc}
        </motion.p>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap justify-center gap-6 text-slate-100 text-sm font-bold"
        >
          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.02, borderColor: "rgba(255, 255, 255, 0.25)", boxShadow: "0 12px 40px 0 rgba(0,0,0,0.25)" }}
            className="flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 px-6 py-4 rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.15)] transition-all duration-300 cursor-default"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <ScanLine className="w-5 h-5" />
            </div>
            <span className="text-white tracking-wide font-semibold text-base">{t.hero.f2}</span>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.02, borderColor: "rgba(255, 255, 255, 0.25)", boxShadow: "0 12px 40px 0 rgba(0,0,0,0.25)" }}
            className="flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 px-6 py-4 rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.15)] transition-all duration-300 cursor-default"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-white tracking-wide font-semibold text-base">{t.hero.f3}</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// --- DASHBOARD WRAPPER ---
const MainDashboard = ({ t }) => {
  const zone = 'LK';
  const floor = '1';

  return (
    <section id="dashboard" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-20 py-12 space-y-8">
      {/* 1. KPI Row */}
      <KPIDashboard t={t} zone={zone} floor={floor} />

      {/* 2. Main Section & Side Panel */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="md:col-span-3">
          <VehicleInOutLog t={t} />
        </div>
        <div className="md:col-span-2">
          <GateControlPanel />
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
  
  const peakStart = zone === 'A' ? 17 : zone === 'B' ? 18 : 16;
  const peakEnd = peakStart + 2;

  const kpis = [
    { id: 1, title: t.kpi.c1.title, value: totalSlots.toString(), unit: t.kpi.c1.unit, trend: '', trendDir: '', icon: LayoutDashboard, color: 'slate', progress: 100 },
    { id: 2, title: t.kpi.c2.title, value: availableSlots.toString(), unit: t.kpi.c2.unit, trend: '-5%', trendDir: 'down', icon: Car, color: 'emerald', progress: availableProgress },
    { id: 4, title: t.kpi.c4.title, value: `${peakStart}:00`, unit: `- ${peakEnd}:00`, trend: '', trendDir: '', icon: Clock, color: 'orange', progress: 0 },
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
              <div className={`flex items-center gap-1 text-sm font-semibold px-2.5 py-1 rounded-full ${kpi.trendDir === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                {kpi.trendDir === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {kpi.trend}
              </div>
            )}
          </div>
          <p className="text-slate-500 font-semibold mb-3 text-[12px] uppercase tracking-[0.08em]">{kpi.title}</p>
          <div className="flex items-baseline gap-1 mb-4">
            <span className="text-[26px] font-bold text-slate-800 tracking-tight">{kpi.value}</span>
            <span className="text-[13px] font-medium text-slate-400">{kpi.unit}</span>
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

const VehicleInOutLog = ({ t }) => {
  const steps = [
    {
      id: 1,
      title: t.showcase.card1Title,
      desc: t.showcase.card1Desc,
      icon: Car,
      color: 'bg-blue-50 text-blue-600 border-blue-100',
    },
    {
      id: 2,
      title: t.showcase.card2Title,
      desc: t.showcase.card2Desc,
      icon: Coins,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    },
    {
      id: 3,
      title: t.showcase.card3Title,
      desc: t.showcase.card3Desc,
      icon: ScanLine,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    },
    {
      id: 4,
      title: t.showcase.card4Title,
      desc: t.showcase.card4Desc,
      icon: Sparkles,
      color: 'bg-sky-50 text-sky-600 border-sky-100',
    },
    {
      id: 5,
      title: t.showcase.card5Title,
      desc: t.showcase.card5Desc,
      icon: CreditCard,
      color: 'bg-amber-50 text-amber-600 border-amber-100',
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 h-full flex flex-col justify-start gap-6">
      <div>
        <div className="inline-flex items-center gap-1.5 text-[12px] tracking-[0.08em] font-semibold text-sky-600 bg-sky-50 px-3 py-1 rounded-full uppercase mb-3">
          {t.showcase.tag}
        </div>
        <h3 className="font-bold text-slate-800 text-[26px] tracking-tight mb-4">
          {t.showcase.title}
        </h3>
        <p className="text-slate-500 text-[16px] font-normal leading-[1.6] max-w-[65ch] mb-2">
          {t.showcase.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-1 flex-1">
        {steps.map((step) => {
          const StepIcon = step.icon;
          return (
            <motion.div
              key={step.id}
              className={`p-4 rounded-xl border border-slate-100 bg-slate-50/40 hover:bg-white hover:border-sky-100 hover:shadow-[0_4px_20px_rgba(14,165,233,0.08)] transition-all duration-300 group cursor-default flex flex-col gap-3 ${
                step.id === 5 ? 'sm:col-span-2' : ''
              }`}
              whileHover={{ y: -4 }}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: step.id * 0.08 }}
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${step.color} group-hover:bg-sky-600 group-hover:text-white group-hover:border-sky-600 transition-colors duration-300 shadow-sm`}>
                  <StepIcon className="w-4.5 h-4.5" />
                </div>
                <h4 className="font-bold text-slate-800 text-[15px] group-hover:text-sky-600 transition-colors">
                  {step.title}
                </h4>
              </div>
              <p className="text-[13px] text-slate-500 font-medium leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};


const ParkingTrendChart = ({ t }) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm h-full">
      <h3 className="font-bold text-slate-800 text-[26px] mb-6 flex items-center gap-2">
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
            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 600 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 600 }} />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontWeight: 600 }}
              labelStyle={{ color: '#64748b' }}
            />
            <Area type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const GateControlPanel = () => {
  const features = [
    {
      id: 1,
      title: i18n.language === 'en' ? 'LPR Recognition' : 'Nhận diện Biển số',
      desc: i18n.language === 'en' ? 'Automated vehicle recognition and access with high accuracy.' : 'Nhận diện phương tiện tự động ra vào bãi với độ chính xác cao.',
      icon: ScanLine,
      color: 'text-blue-500 bg-blue-50 border-blue-100/50',
    },
    {
      id: 2,
      title: i18n.language === 'en' ? 'Pre-Booking' : 'Đặt chỗ trước',
      desc: i18n.language === 'en' ? 'Reserve your desired parking slot easily before arrival.' : 'Đặt trước vị trí gửi xe nhanh chóng và tiện lợi trước khi di chuyển.',
      icon: CalendarDays,
      color: 'text-amber-500 bg-amber-50 border-amber-100/50',
    },
    {
      id: 3,
      title: i18n.language === 'en' ? 'Vehicle Management' : 'Quản lý phương tiện',
      desc: i18n.language === 'en' ? 'Track and manage your private vehicles history easily.' : 'Theo dõi và quản lý danh sách xe cá nhân cũng như lịch sử ra vào bãi.',
      icon: Car,
      color: 'text-indigo-500 bg-indigo-50 border-indigo-100/50',
    },
    {
      id: 4,
      title: i18n.language === 'en' ? 'Visitor Card Support' : 'Hỗ trợ xe vãng lai',
      desc: i18n.language === 'en' ? 'Quick registration and automatic ticket codes for guest cars.' : 'Đăng ký và sử dụng dịch vụ gửi xe nhanh chóng khi không có tài khoản tháng.',
      icon: Zap,
      color: 'text-emerald-500 bg-emerald-50 border-emerald-100/50',
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm h-full flex flex-col justify-start gap-6">
      <div>
        <div className="inline-flex items-center gap-1.5 text-[12px] tracking-[0.08em] font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase mb-3">
          {i18n.language === 'en' ? 'Key Features' : 'Tính năng nổi bật'}
        </div>
        <h3 className="font-bold text-slate-800 text-[26px] tracking-tight mb-4">
          {i18n.language === 'en' ? 'Platform Features' : 'Tính năng cốt lõi'}
        </h3>
        <p className="text-slate-500 text-[16px] font-normal leading-[1.6] max-w-[65ch] mb-5">
          {i18n.language === 'en' ? 'Outstanding capabilities for modern buildings.' : 'Giải pháp công nghệ tối ưu hóa hiệu suất bãi xe.'}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 flex-1">
        {features.map((item) => {
          const FeatureIcon = item.icon;
          return (
            <motion.div
              key={item.id}
              className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-sky-100 hover:shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all duration-300 group cursor-default flex flex-col justify-center min-h-[76px]"
              whileHover={{ y: -2 }}
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${item.color} group-hover:bg-sky-600 group-hover:text-white group-hover:border-sky-600 transition-colors duration-300`}>
                  <FeatureIcon className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-[16px] group-hover:text-sky-600 transition-colors mb-2">{item.title}</h4>
                  <p className="text-[13px] text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </motion.div>
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

void CustomSelect;

const NotificationCenter = ({ t }) => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data } = await notificationService.getActiveNotifications({ page: 0, size: 6 });
      if (!cancelled) {
        setNotices(Array.isArray(data) ? data : []);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const openDetail = async (notice) => {
    setSelectedNotice({ ...notice, content: '', _loading: true });
    setDetailLoading(true);
    const { data } = await notificationService.getNotificationDetail(notice.id);
    setDetailLoading(false);
    if (data) {
      setSelectedNotice({ ...notice, ...data, _loading: false });
    } else {
      setSelectedNotice({ ...notice, content: notice.summary || '', _loading: false, _error: true });
    }
  };

  const closeDetail = () => setSelectedNotice(null);

  const formatDate = (iso) => {
    if (!iso) return '';
    const d = vietnamDayjs(iso);
    return d.isValid() ? d.format('DD/MM HH:mm') : '';
  };

  const renderCards = () => {
    if (loading) {
      return Array.from({ length: 3 }).map((_, idx) => (
        <div
          key={`skeleton-${idx}`}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full animate-pulse"
        >
          <div className="h-4 w-20 bg-slate-200 rounded mb-4" />
          <div className="h-5 w-3/4 bg-slate-200 rounded mb-3" />
          <div className="h-3 w-full bg-slate-100 rounded mb-2" />
          <div className="h-3 w-5/6 bg-slate-100 rounded mb-auto" />
          <div className="h-4 w-24 bg-slate-200 rounded mt-4" />
        </div>
      ));
    }

    if (notices.length === 0) {
      return (
        <div className="md:col-span-3 bg-white p-10 rounded-2xl border border-slate-200 text-center text-slate-500">
          <Bell className="w-10 h-10 mx-auto mb-3 text-slate-300" />
          <p className="font-bold text-slate-700 mb-1">{t.notice.emptyTitle}</p>
          <p className="text-sm">{t.notice.emptyDescription}</p>
        </div>
      );
    }

    return notices.map((ann) => (
      <div
        key={ann.id}
        onClick={() => openDetail(ann)}
        className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all cursor-pointer flex flex-col h-full group"
      >
        <div className="flex items-center justify-between mb-4">
          <span className={`text-[12px] font-semibold px-2.5 py-1 rounded-lg border ${getCategoryToneClass(ann.category)} uppercase tracking-[0.08em]`}>
            {t.notice.categoryLabels[ann.category] || getCategoryLabel(ann.category)}
          </span>
          <span className="text-[13px] font-medium text-slate-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {formatDate(ann.publishedAt)}
          </span>
        </div>
        <h3 className="font-bold text-slate-800 text-[24px] leading-snug mb-4 group-hover:text-sky-600 transition-colors">{ann.title}</h3>
        <p className="text-[16px] text-slate-500 font-normal leading-[1.6] line-clamp-2 mb-5 flex-1 max-w-[65ch]">{ann.summary}</p>
        <div className="flex items-center gap-1 text-sky-600 text-[13px] font-medium mt-auto">
          {t.notice.readMore} <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    ));
  };

  return (
    <section id="thong-bao" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16 relative">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[28px] md:text-[34px] font-bold text-slate-800 leading-[1.2] flex items-center gap-3">
          <Bell className="text-sky-600 w-8 h-8" /> {t.notice.title}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {renderCards()}
      </div>

      {selectedNotice && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
          onClick={closeDetail}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col border border-slate-200 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg border ${getCategoryToneClass(selectedNotice.category)}`}>
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">
                    {t.notice.categoryLabels[selectedNotice.category] || getCategoryLabel(selectedNotice.category)}
                  </h3>
                  <p className="text-xs font-semibold text-slate-400">
                    {selectedNotice._error ? t.notice.loadError : formatDate(selectedNotice.publishedAt)}
                  </p>
                </div>
              </div>
              <button
                onClick={closeDetail}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh] custom-scrollbar">
              <h2 className="text-[24px] font-bold text-slate-800 mb-4 leading-tight">{selectedNotice.title}</h2>
              {detailLoading ? (
                <div className="space-y-2 animate-pulse">
                  <div className="h-3 w-full bg-slate-100 rounded" />
                  <div className="h-3 w-5/6 bg-slate-100 rounded" />
                  <div className="h-3 w-4/6 bg-slate-100 rounded" />
                </div>
              ) : (
                <div className="text-slate-600 text-[16px] font-normal leading-[1.6] whitespace-pre-wrap max-w-[65ch]">
                  {selectedNotice.content || selectedNotice.summary || t.notice.noDetail}
                </div>
              )}
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={closeDetail}
                className="px-6 py-2 bg-sky-500 hover:bg-sky-600 !text-white font-bold rounded-lg transition-colors"
                style={{ color: '#FFFFFF' }}
              >
                {t.notice.close}
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
    <div id="kham-pha" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-24">
      {/* Section Header */}
      <div className="mb-12 text-center lg:text-left">
        <div className="inline-flex items-center gap-1.5 text-[12px] tracking-[0.08em] font-semibold text-sky-600 bg-sky-50 px-3 py-1 rounded-full uppercase mb-3 w-fit">
          {i18n.language === 'en' ? 'Core Capabilities' : 'Năng lực cốt lõi'}
        </div>
        <h2 className="text-[28px] md:text-[34px] font-bold text-slate-800 tracking-tight mb-4 leading-[1.2]">
          {t.features.title}
        </h2>
        <p className="text-slate-500 font-normal text-[16px] max-w-[65ch] leading-[1.6]">
          {i18n.language === 'en' 
            ? 'Our infrastructure leverages state-of-the-art computer vision and digital orchestration to deliver absolute efficiency.'
            : 'Hệ thống hạ tầng kết hợp thị giác máy tính và điều phối số nhằm đem lại hiệu suất vận hành tối đa.'}
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Big Feature: LPR (Occupies 2 columns on lg screens) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-[0_2px_20px_rgba(0,0,0,0.015)] p-6 md:p-8 flex flex-col gap-6 overflow-hidden relative group transition-all duration-300 hover:border-sky-200/60">
          {/* Header */}
          <div>
            <span className="text-[12px] font-semibold text-sky-600 uppercase tracking-[0.08em] bg-sky-50 px-2.5 py-1 rounded-lg inline-block w-fit">Computer Vision</span>
            <h3 className="text-[24px] md:text-[26px] font-bold text-slate-800 tracking-tight mt-2 mb-1">
              {t.features.f1Title}
            </h3>
            <p className="text-[15px] text-slate-500 font-normal leading-[1.6]">
              {t.features.f1Desc}
            </p>
          </div>

          {/* Feature rows */}
          <div className="space-y-4">
            {/* Row 1 */}
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/60 border border-slate-100 hover:border-sky-100 hover:bg-sky-50/30 transition-all duration-200 group/row">
              <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center shrink-0 group-hover/row:bg-sky-100 transition-colors">
                <Camera className="w-5 h-5 text-sky-600" />
              </div>
              <div>
                <p className="text-[15px] font-bold text-slate-800 mb-0.5">
                  {i18n.language === 'en' ? 'Automatic license plate detection & recognition' : 'Camera tự động phát hiện và nhận diện biển số'}
                </p>
                <p className="text-[13px] text-slate-500 leading-relaxed">
                  {i18n.language === 'en' ? 'Real-time license plate recognition system with high accuracy.' : 'Hệ thống nhận diện biển số theo thời gian thực với độ chính xác cao.'}
                </p>
              </div>
            </div>
            {/* Row 2 */}
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/60 border border-slate-100 hover:border-sky-100 hover:bg-sky-50/30 transition-all duration-200 group/row">
              <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center shrink-0 group-hover/row:bg-sky-100 transition-colors">
                <DoorOpen className="w-5 h-5 text-sky-600" />
              </div>
              <div>
                <p className="text-[15px] font-bold text-slate-800 mb-0.5">
                  {i18n.language === 'en' ? 'Barrier gate opens automatically & instantly' : 'Cổng tự động barrier mở ngay lập tức'}
                </p>
                <p className="text-[13px] text-slate-500 leading-relaxed">
                  {i18n.language === 'en' ? 'On valid recognition, barrier opens in 1–2 seconds, optimizing traffic flow.' : 'Nhận diện hợp lệ, barrier tự động mở trong 1–2 giây, tối ưu lưu thông.'}
                </p>
              </div>
            </div>
            {/* Row 3 */}
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/60 border border-slate-100 hover:border-sky-100 hover:bg-sky-50/30 transition-all duration-200 group/row">
              <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center shrink-0 group-hover/row:bg-sky-100 transition-colors">
                <ClipboardList className="w-5 h-5 text-sky-600" />
              </div>
              <div>
                <p className="text-[15px] font-bold text-slate-800 mb-0.5">
                  {i18n.language === 'en' ? 'Real-time vehicle status tracking & logging' : 'Theo dõi trạng thái và ghi nhật ký xe thời gian thực'}
                </p>
                <p className="text-[13px] text-slate-500 leading-relaxed">
                  {i18n.language === 'en' ? 'Complete in/out history logging for easy retrieval and management.' : 'Ghi nhận đầy đủ lịch sử ra vào, hỗ trợ tra cứu và quản lý dễ dàng.'}
                </p>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 rounded-2xl p-3 flex items-center gap-3 border border-slate-100">
              <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4.5 h-4.5 text-sky-600" />
              </div>
              <div>
                <p className="text-[17px] font-bold text-sky-600 leading-none">99.9%</p>
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.05em] mt-0.5">{i18n.language === 'en' ? 'Accuracy' : 'Độ chính xác'}</p>
                <p className="text-[10px] text-slate-400 font-medium">{i18n.language === 'en' ? 'Plate recognition' : 'Nhận diện biển số'}</p>
              </div>
            </div>
            <div className="bg-slate-50 rounded-2xl p-3 flex items-center gap-3 border border-slate-100">
              <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center shrink-0">
                <Clock className="w-4.5 h-4.5 text-sky-600" />
              </div>
              <div>
                <p className="text-[17px] font-bold text-sky-600 leading-none">24/7</p>
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.05em] mt-0.5">{i18n.language === 'en' ? 'Monitoring' : 'Giám sát liên tục'}</p>
                <p className="text-[10px] text-slate-400 font-medium">{i18n.language === 'en' ? 'Always on' : 'Hoạt động không gián đoạn'}</p>
              </div>
            </div>
            <div className="bg-slate-50 rounded-2xl p-3 flex items-center gap-3 border border-slate-100">
              <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center shrink-0">
                <Zap className="w-4.5 h-4.5 text-sky-600" />
              </div>
              <div>
                <p className="text-[17px] font-bold text-sky-600 leading-none">1–2s</p>
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.05em] mt-0.5">{i18n.language === 'en' ? 'Fast barrier' : 'Mở barrier nhanh'}</p>
                <p className="text-[10px] text-slate-400 font-medium">{i18n.language === 'en' ? 'Save waiting time' : 'Tiết kiệm thời gian chờ'}</p>
              </div>
            </div>
            <div className="bg-slate-50 rounded-2xl p-3 flex items-center gap-3 border border-slate-100">
              <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center shrink-0">
                <Database className="w-4.5 h-4.5 text-sky-600" />
              </div>
              <div>
                <p className="text-[17px] font-bold text-sky-600 leading-none">100%</p>
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.05em] mt-0.5">{i18n.language === 'en' ? 'Data stored' : 'Dữ liệu được lưu trữ'}</p>
                <p className="text-[10px] text-slate-400 font-medium">{i18n.language === 'en' ? 'Safe & secure' : 'An toàn và bảo mật'}</p>
              </div>
            </div>
          </div>

          {/* System flow diagram */}
          <div className="w-full rounded-2xl border border-slate-100 bg-slate-50/50 p-4 sm:p-5 flex flex-col gap-3">
            <div className="text-[12px] font-semibold text-slate-400 uppercase tracking-[0.08em] text-center border-b border-slate-100 pb-2">
              {i18n.language === 'en' ? 'Integrated System Workflow' : 'Luồng Vận Hành Hệ Thống Tích Hợp'}
            </div>
            <div className="flex items-center justify-between gap-2">
              {/* Node 1 */}
              <div className="flex-1 bg-white border border-slate-100 rounded-xl p-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.015)] h-[110px] flex flex-col justify-between items-center text-center">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.05em]">{i18n.language === 'en' ? 'User' : 'Cá nhân'}</span>
                <span className="text-[12px] font-bold text-slate-700 leading-tight">{i18n.language === 'en' ? 'Vehicle Registration' : 'Đăng ký xe'}</span>
                <span className="text-[10px] text-slate-400 font-medium leading-tight">{i18n.language === 'en' ? 'Register vehicle info' : 'Đăng ký thông tin phương tiện'}</span>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
              </div>
              <div className="text-slate-300 text-xs font-bold">→</div>
              {/* Node 2 */}
              <div className="flex-1 bg-white border border-emerald-100 rounded-xl p-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.015)] h-[110px] flex flex-col justify-between items-center text-center">
                <span className="text-[11px] font-semibold text-emerald-500 uppercase tracking-[0.05em]">{i18n.language === 'en' ? 'Pricing' : 'Biểu phí'}</span>
                <span className="text-[12px] font-bold text-slate-700 leading-tight">{i18n.language === 'en' ? 'View pricing' : 'Xem biểu phí'}</span>
                <span className="text-[10px] text-slate-400 font-medium leading-tight">{i18n.language === 'en' ? 'Clear, transparent pricing' : 'Bảng giá rõ ràng, minh bạch'}</span>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
              </div>
              <div className="text-slate-300 text-xs font-bold">→</div>
              {/* Node 3 - Highlighted */}
              <div className="flex-1 bg-sky-50 border border-sky-100 rounded-xl p-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.015)] h-[110px] flex flex-col justify-between items-center text-center">
                <span className="text-[11px] font-semibold text-sky-500 uppercase tracking-[0.05em]">{i18n.language === 'en' ? 'Gate' : 'Cổng Vào/Ra'}</span>
                <span className="text-[12px] font-bold text-sky-800 leading-tight">{i18n.language === 'en' ? 'LPR Recognition' : 'Nhận diện LPR'}</span>
                <span className="text-[10px] text-sky-600/70 font-medium leading-tight">{i18n.language === 'en' ? 'Plate scan & barrier open' : 'Nhận diện biển số và mở barrier'}</span>
                <div className="w-1.5 h-1.5 rounded-full bg-sky-500"></div>
              </div>
              <div className="text-slate-300 text-xs font-bold">→</div>
              {/* Node 4 */}
              <div className="flex-1 bg-white border border-violet-100 rounded-xl p-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.015)] h-[110px] flex flex-col justify-between items-center text-center">
                <span className="text-[11px] font-semibold text-violet-500 uppercase tracking-[0.05em]">{i18n.language === 'en' ? 'Management' : 'Quản lý'}</span>
                <span className="text-[12px] font-bold text-slate-700 leading-tight">{i18n.language === 'en' ? 'Session tracking' : 'Theo dõi phiên gửi xe'}</span>
                <span className="text-[10px] text-slate-400 font-medium leading-tight">{i18n.language === 'en' ? 'Manage, store & track history' : 'Quản lý, lưu trữ và theo dõi lịch sử'}</span>
                <div className="w-1.5 h-1.5 rounded-full bg-violet-400"></div>
              </div>
              <div className="text-slate-300 text-xs font-bold">→</div>
              {/* Node 5 */}
              <div className="flex-1 bg-white border border-amber-100 rounded-xl p-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.015)] h-[110px] flex flex-col justify-between items-center text-center">
                <span className="text-[11px] font-semibold text-amber-500 uppercase tracking-[0.05em]">{i18n.language === 'en' ? 'Payment' : 'Thanh Toán'}</span>
                <span className="text-[12px] font-bold text-slate-700 leading-tight">{i18n.language === 'en' ? 'Convenient payment' : 'Thanh toán tiện lợi'}</span>
                <span className="text-[10px] text-slate-400 font-medium leading-tight">{i18n.language === 'en' ? 'Pay via QR or e-wallet' : 'Thanh toán QR hoặc ví điện tử'}</span>
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
              </div>
            </div>
            <div className="border-t border-slate-100 pt-2 flex items-center justify-between text-[12px] font-semibold text-slate-400 tracking-[0.08em]">
              <span>PLATFORM FLOW</span>
              <span>CORE ARCHITECTURE INTEGRATED</span>
            </div>
          </div>
        </div>

        {/* Supporting small features (1 column on lg screens) */}
        <div className="flex flex-col gap-6">
          {/* Spot 2: Parking Reservation */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_2px_20px_rgba(0,0,0,0.015)] flex-1 flex flex-col justify-between hover:border-sky-200/60 transition-all duration-300 group">
            <div>
              <span className="text-[12px] font-semibold text-amber-600 uppercase tracking-[0.08em] bg-amber-50 px-2.5 py-1 rounded-lg w-fit inline-block">{i18n.language === 'en' ? 'Booking' : 'Đặt chỗ trước'}</span>
              <h3 className="text-[20px] md:text-[22px] font-bold text-slate-800 tracking-tight mt-2 mb-3">{t.features.f2Title}</h3>
              <p className="text-[14px] text-slate-500 font-normal leading-[1.6] max-w-[65ch] mb-4">{t.features.f2Desc}</p>
            </div>
            <div className="h-px bg-slate-100 mb-6"></div>
            <div className="text-[12px] font-semibold text-slate-400 uppercase tracking-[0.08em]">
              {i18n.language === 'en' ? 'Optimized Space Allocation' : 'Tối ưu phân bổ không gian đỗ'}
            </div>
          </div>

          {/* Spot 3: Cashless Payment */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_2px_20px_rgba(0,0,0,0.015)] flex-1 flex flex-col justify-between hover:border-sky-200/60 transition-all duration-300 group">
            <div>
              <span className="text-[12px] font-semibold text-sky-600 uppercase tracking-[0.08em] bg-sky-50 px-2.5 py-1 rounded-lg w-fit inline-block">{i18n.language === 'en' ? 'Payment' : 'Thanh toán'}</span>
              <h3 className="text-[20px] md:text-[22px] font-bold text-slate-800 tracking-tight mt-2 mb-3">{t.features.f3Title}</h3>
              <p className="text-[14px] text-slate-500 font-normal leading-[1.6] max-w-[65ch] mb-4">{t.features.f3Desc}</p>
            </div>
            <div className="h-px bg-slate-100 mb-6"></div>
            <div className="text-[12px] font-semibold text-slate-400 uppercase tracking-[0.08em]">
              {i18n.language === 'en' ? 'QR & E-Wallet integration' : 'Hỗ trợ QR và Ví điện tử'}
            </div>
          </div>

          {/* Spot 4: Mobile App */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_2px_20px_rgba(0,0,0,0.015)] flex-1 flex flex-col justify-between hover:border-sky-200/60 transition-all duration-300 group">
            <div>
              <span className="text-[12px] font-semibold text-emerald-600 uppercase tracking-[0.08em] bg-emerald-50 px-2.5 py-1 rounded-lg w-fit inline-block">{i18n.language === 'en' ? 'App' : 'Ứng dụng'}</span>
              <h3 className="text-[20px] md:text-[22px] font-bold text-slate-800 tracking-tight mt-2 mb-3">{t.features.f4Title}</h3>
              <p className="text-[14px] text-slate-500 font-normal leading-[1.6] max-w-[65ch] mb-4">{t.features.f4Desc}</p>
            </div>
            <div className="h-px bg-slate-100 mb-6"></div>
            <div className="text-[12px] font-semibold text-slate-400 uppercase tracking-[0.08em]">
              {i18n.language === 'en' ? 'iOS & Android support' : 'Hỗ trợ iOS và Android'}
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
              <h2 className="text-[28px] md:text-[34px] font-bold text-white leading-[1.2] mb-2">{t.process.title}</h2>
              <p className="text-slate-400 text-[16px] font-normal leading-[1.6] max-w-[65ch]">{t.process.subtitle}</p>
            </div>
            <div className="bg-sky-500/20 border border-sky-500/30 text-sky-400 px-4 py-2 rounded-lg text-[13px] font-semibold flex items-center gap-2 w-fit">
              <Clock className="w-4 h-4" /> {t.process.duration}
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
                  <h3 className="text-[24px] font-bold text-white mb-4">{t.process.s1Title}</h3>
                  <p className="text-slate-400 text-[16px] font-normal leading-[1.6] max-w-[65ch]">{t.process.s1Desc}</p>
                </div>
              </div>
              
              <div className="flex flex-col gap-4 group">
                <div className="w-16 h-16 bg-slate-800 border-2 border-slate-700 rounded-2xl flex items-center justify-center group-hover:border-sky-500 group-hover:bg-slate-800 transition-all shadow-lg group-hover:-translate-y-1">
                  <MapPin className="w-7 h-7 text-sky-400" />
                </div>
                <div>
                  <h3 className="text-[24px] font-bold text-white mb-4">{t.process.s2Title}</h3>
                  <p className="text-slate-400 text-[16px] font-normal leading-[1.6] max-w-[65ch]">{t.process.s2Desc}</p>
                </div>
              </div>

              <div className="flex flex-col gap-4 group">
                <div className="w-16 h-16 bg-slate-800 border-2 border-slate-700 rounded-2xl flex items-center justify-center group-hover:border-sky-500 group-hover:bg-slate-800 transition-all shadow-lg group-hover:-translate-y-1">
                  <Smartphone className="w-7 h-7 text-sky-400" />
                </div>
                <div>
                  <h3 className="text-[24px] font-bold text-white mb-4">{t.process.s3Title}</h3>
                  <p className="text-slate-400 text-[16px] font-normal leading-[1.6] max-w-[65ch]">{t.process.s3Desc}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ModalContainer = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col border border-slate-200 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h3 className="font-bold text-slate-800 text-lg">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[60vh] custom-scrollbar text-slate-600 text-sm font-medium leading-relaxed">
          {children}
        </div>
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-sky-500 hover:bg-sky-600 !text-white font-bold rounded-lg transition-colors"
            style={{ color: '#FFFFFF' }}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

const Footer = ({ t, onOpenModal }) => {
  const navigate = useNavigate();
  const currentPath = window.location.pathname;

  const handleFeatureClick = (e, path) => {
    e.preventDefault();
    const token = sessionStorage.getItem('access_token') || localStorage.getItem('access_token');
    if (token) {
      navigate(path);
    } else {
      sessionStorage.setItem('redirect_after_login', path);
      navigate('/login');
    }
  };

  const handleFaqClick = (e) => {
    e.preventDefault();
    const target = document.getElementById('thong-bao');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleContactClick = (e) => {
    e.preventDefault();
    window.location.href = "mailto:smartparkingswp202@gmail.com";
  };

  const linkClass = (path) => {
    const isActive = currentPath === path;
    return `group flex items-center gap-2 cursor-pointer focus:ring-2 focus:ring-sky-500/40 focus:outline-none min-h-[40px] px-1 py-1 rounded transition-all duration-200 ease-out text-slate-500 hover:text-sky-600 hover:translate-x-1 ${
      isActive ? 'text-sky-600 font-semibold border-b border-sky-600 w-fit' : ''
    }`;
  };

  return (
    <footer className="bg-slate-50 border-t border-slate-200/60 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-1">
            <Logo variant="horizontal" size="sm" />
            <p className="text-slate-500 text-[13px] font-medium leading-[1.6] mt-4 max-w-[30ch]">
              {t.footer.desc}
            </p>
          </div>
          
          <div>
            <h4 className="text-[12px] font-semibold text-slate-800 uppercase tracking-[0.08em] mb-4">{t.footer.products}</h4>
            <ul className="space-y-1">
              <li>
                <a 
                  href="#" 
                  onClick={(e) => handleFeatureClick(e, '/driver-vehicle-registration')} 
                  className={linkClass('/driver-vehicle-registration')}
                >
                  <span className="hover:underline text-[13px] font-medium">{t.footer.f1}</span>
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  onClick={(e) => handleFeatureClick(e, '/driver-dashboard')} 
                  className={linkClass('/driver-dashboard')}
                >
                  <span className="hover:underline text-[13px] font-medium">{t.footer.f3}</span>
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  onClick={(e) => handleFeatureClick(e, '/driver-payment')} 
                  className={linkClass('/driver-payment')}
                >
                  <span className="hover:underline text-[13px] font-medium">{t.footer.f4}</span>
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-[12px] font-semibold text-slate-800 uppercase tracking-[0.08em] mb-4">{t.footer.support}</h4>
            <ul className="space-y-1">
              <li>
                <a 
                  href="#thong-bao" 
                  onClick={handleFaqClick} 
                  className="group flex items-center gap-2 cursor-pointer focus:ring-2 focus:ring-sky-500/40 focus:outline-none min-h-[40px] px-1 py-1 rounded transition-all duration-200 ease-out text-slate-500 hover:text-sky-600 hover:translate-x-1 text-[13px] font-medium"
                >
                  <span className="hover:underline">{t.footer.faq}</span>
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); onOpenModal('guide'); }} 
                  className="group flex items-center gap-2 cursor-pointer focus:ring-2 focus:ring-sky-500/40 focus:outline-none min-h-[40px] px-1 py-1 rounded transition-all duration-200 ease-out text-slate-500 hover:text-sky-600 hover:translate-x-1 text-[13px] font-medium"
                >
                  <span className="hover:underline">{t.footer.guide}</span>
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  onClick={handleContactClick} 
                  className="group flex items-center gap-2 cursor-pointer focus:ring-2 focus:ring-sky-500/40 focus:outline-none min-h-[40px] px-1 py-1 rounded transition-all duration-200 ease-out text-slate-500 hover:text-sky-600 hover:translate-x-1 text-[13px] font-medium"
                >
                  <span className="hover:underline">{t.footer.contact}</span>
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-[12px] font-semibold text-slate-800 uppercase tracking-[0.08em] mb-4">{t.footer.contact}</h4>
            <ul className="space-y-2.5 text-[13px] font-medium text-slate-500">
              <li className="flex items-center gap-2 min-h-[40px]">
                <a 
                  href="mailto:smartparkingswp202@gmail.com" 
                  className="inline-flex items-center gap-2 text-slate-500 hover:text-sky-600 transition-colors duration-200 focus:ring-2 focus:ring-sky-500/40 focus:outline-none px-1.5 py-1.5 rounded"
                >
                  <Mail className="w-4 h-4 shrink-0 text-sky-500" />
                  <span>smartparkingswp202@gmail.com</span>
                </a>
              </li>
              <li className="flex items-center gap-2 min-h-[40px]">
                <a 
                  href="tel:+840982094533" 
                  className="inline-flex items-center gap-2 text-slate-500 hover:text-sky-600 transition-colors duration-200 focus:ring-2 focus:ring-sky-500/40 focus:outline-none px-1.5 py-1.5 rounded"
                >
                  <Phone className="w-4 h-4 shrink-0 text-sky-500" />
                  <span>0982 094 533</span>
                </a>
              </li>
              <li className="flex items-center gap-2 min-h-[40px] text-slate-500 px-1.5 py-1.5">
                <MapPin className="w-4 h-4 shrink-0 text-slate-400" />
                <span>{t.footer.addressVal}</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-200 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-[13px] text-slate-500 font-medium">© 2026 Parking Building Management System. {t.footer.rights}</span>
          <div className="flex gap-6 text-[13px] font-semibold text-slate-500">
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); onOpenModal('terms'); }} 
              className="transition-colors duration-200 hover:text-sky-600 focus:ring-2 focus:ring-sky-500/40 focus:outline-none px-1 py-1 rounded"
            >
              {t.footer.terms}
            </a>
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); onOpenModal('privacy'); }} 
              className="transition-colors duration-200 hover:text-sky-600 focus:ring-2 focus:ring-sky-500/40 focus:outline-none px-1 py-1 rounded"
            >
              {t.footer.privacy}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default function WelcomePage() {
  const location = useLocation();
  const { isAuthenticated, isAuthLoading, role } = useAuth();
  const getInitialLang = () => {
    const current = i18n.language || localStorage.getItem('language') || 'vi';
    return current.startsWith('en') ? 'en' : 'vi';
  };

  const [lang, setLangState] = useState(getInitialLang);
  const t = translations[lang];

  const setLang = (newLang) => {
    setLangState(newLang);
    i18n.changeLanguage(newLang);
  };

  useEffect(() => {
    const handleLangChange = (lng) => {
      setLangState(lng.startsWith('en') ? 'en' : 'vi');
    };
    i18n.on('languageChanged', handleLangChange);
    return () => {
      i18n.off('languageChanged', handleLangChange);
    };
  }, []);

  useEffect(() => {
    const targetId = location.hash.replace('#', '');
    if (!targetId) {
      window.scrollTo({ top: 0, behavior: 'auto' });
      return;
    }

    const scrollToHashTarget = () => {
      const target = document.getElementById(targetId);
      if (!target) return;

      const headerOffset = 160;
      const targetTop = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
      window.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' });
    };

    const frameId = window.requestAnimationFrame(scrollToHashTarget);
    return () => window.cancelAnimationFrame(frameId);
  }, [location.hash]);

  const [activeModal, setActiveModal] = useState(null);

  if (!isAuthLoading && isAuthenticated) {
    return <Navigate to={getDashboardPath(role)} replace />;
  }

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
      <Footer t={t} onOpenModal={setActiveModal} />

      <ModalContainer 
        isOpen={activeModal === 'guide'} 
        onClose={() => setActiveModal(null)} 
        title={lang === 'vi' ? 'Hướng dẫn sử dụng hệ thống' : 'System User Guide'}
      >
        {lang === 'vi' ? (
          <div className="space-y-4 text-[13px] text-slate-600 font-medium leading-[1.6]">
            <p className="font-semibold text-slate-800">Để sử dụng dịch vụ bãi đỗ xe thông minh, quý khách vui lòng làm theo các bước sau:</p>
            <ol className="list-decimal pl-5 space-y-2">
              <li><strong>Đăng ký tài khoản:</strong> Tạo tài khoản và cập nhật thông tin cá nhân.</li>
              <li><strong>Đăng ký thẻ xe:</strong> Đăng ký biển số xe chính chủ và chọn loại thẻ tháng hoặc lượt.</li>
              <li><strong>Đặt chỗ trước:</strong> Chọn khu vực, tầng và vị trí đỗ mong muốn trước khi di chuyển đến tòa nhà.</li>
              <li><strong>Vào bãi xe:</strong> Camera LPR sẽ tự động nhận diện biển số của bạn và mở cổng barie trong 2 giây.</li>
              <li><strong>Thanh toán trực tuyến:</strong> Thanh toán phí gửi xe dễ dàng qua ứng dụng di động hoặc ví điện tử liên kết khi ra cổng.</li>
            </ol>
          </div>
        ) : (
          <div className="space-y-4 text-[13px] text-slate-600 font-medium leading-[1.6]">
            <p className="font-semibold text-slate-800">To use our smart parking services, please follow these steps:</p>
            <ol className="list-decimal pl-5 space-y-2">
              <li><strong>Account Registration:</strong> Create an account and update your profile details.</li>
              <li><strong>Parking Card Registration:</strong> Register your vehicle license plate and choose subscription or single-use card.</li>
              <li><strong>Pre-booking Slot:</strong> Select your desired parking zone, floor and slot before arriving.</li>
              <li><strong>Access the Gate:</strong> The LPR camera will automatically scan your plate and open the barrier gate in 2 seconds.</li>
              <li><strong>Online Payment:</strong> Easily pay parking fees via mobile app or linked e-wallets when exiting.</li>
            </ol>
          </div>
        )}
      </ModalContainer>

      <ModalContainer 
        isOpen={activeModal === 'terms'} 
        onClose={() => setActiveModal(null)} 
        title={lang === 'vi' ? 'Điều khoản sử dụng' : 'Terms of Use'}
      >
        {lang === 'vi' ? (
          <div className="space-y-4 text-[13px] text-slate-600 font-medium leading-[1.6]">
            <p>Chào mừng bạn đến với <strong>Parking Building Management System</strong>. Khi truy cập và sử dụng dịch vụ của chúng tôi, bạn đồng ý tuân thủ các điều khoản sau:</p>
            <h4 className="font-semibold text-slate-800 uppercase text-[13px]">1. Đăng ký & Bảo mật thông tin</h4>
            <p>Người dùng có trách nhiệm tự bảo mật tài khoản và mật khẩu cá nhân. Mọi hành vi chia sẻ tài khoản cho bên thứ ba hoặc vi phạm nội quy đỗ xe đều có thể bị khóa tài khoản tạm thời hoặc vĩnh viễn.</p>
            <h4 className="font-semibold text-slate-800 uppercase text-[13px]">2. Quy định trong bãi đỗ xe</h4>
            <p>Khách hàng phải tuân thủ hướng dẫn của nhân viên điều phối, đỗ đúng vị trí ô đỗ đã đặt, tuân thủ tốc độ giới hạn và tắt động cơ khi xe đã vào vị trí đỗ.</p>
          </div>
        ) : (
          <div className="space-y-4 text-[13px] text-slate-600 font-medium leading-[1.6]">
            <p>Welcome to <strong>Parking Building Management System</strong>. By accessing and using our service, you agree to comply with the following terms:</p>
            <h4 className="font-semibold text-slate-800 uppercase text-[13px]">1. Registration & Security</h4>
            <p>Users are responsible for maintaining the confidentiality of their accounts and passwords. Any sharing of accounts or parking violation may result in temporary or permanent suspension.</p>
            <h4 className="font-semibold text-slate-800 uppercase text-[13px]">2. Parking Lot Regulations</h4>
            <p>Customers must follow coordinates and guidelines from operators, park inside designated lines, adhere to speed limits, and turn off engines after parking.</p>
          </div>
        )}
      </ModalContainer>

      <ModalContainer 
        isOpen={activeModal === 'privacy'} 
        onClose={() => setActiveModal(null)} 
        title={lang === 'vi' ? 'Chính sách bảo mật' : 'Privacy Policy'}
      >
        {lang === 'vi' ? (
          <div className="space-y-4 text-[13px] text-slate-600 font-medium leading-[1.6]">
            <p>Chính sách bảo mật này mô tả cách chúng tôi thu thập, sử dụng và bảo vệ thông tin cá nhân của bạn:</p>
            <h4 className="font-semibold text-slate-800 uppercase text-[13px]">1. Dữ liệu thu thập</h4>
            <p>Chúng tôi thu thập thông tin tài khoản (Họ tên, Email, Số điện thoại), thông tin phương tiện (Biển số xe, hình ảnh nhận diện LPR tại cổng) để phục vụ cho mục đích vận hành tự động bãi xe.</p>
            <h4 className="font-semibold text-slate-800 uppercase text-[13px]">2. Cam kết bảo mật</h4>
            <p>Thông tin của bạn được lưu trữ trên hạ tầng an toàn bảo mật cao và tuyệt đối không chia sẻ cho bất kỳ bên thứ ba nào nếu không có sự đồng ý của bạn hoặc yêu cầu từ cơ quan có thẩm quyền.</p>
          </div>
        ) : (
          <div className="space-y-4 text-[13px] text-slate-600 font-medium leading-[1.6]">
            <p>This privacy policy describes how we collect, use and protect your personal information:</p>
            <h4 className="font-semibold text-slate-800 uppercase text-[13px]">1. Data Collected</h4>
            <p>We collect account details (Full name, Email, Phone number) and vehicle details (license plates, LPR entry/exit logs) for automated parking operations.</p>
            <h4 className="font-semibold text-slate-800 uppercase text-[13px]">2. Security Guarantee</h4>
            <p>Your details are stored in highly secure cloud environments and will never be shared with third parties without your permission or regulatory requirements.</p>
          </div>
        )}
      </ModalContainer>
    </div>
  );
}
