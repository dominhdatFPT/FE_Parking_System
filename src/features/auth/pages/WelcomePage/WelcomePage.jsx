import { useState } from 'react';
import { useNavigate } from 'react-router';

const logoUrl = '/parking-system-logo.png';

const heroCards = [
  {
    icon: 'search',
    title: 'Tìm kiếm dễ dàng',
    description:
      'Hệ thống định vị thông minh giúp bạn tìm thấy vị trí đỗ xe trống gần nhất chỉ trong vài giây qua ứng dụng di động.',
  },
  {
    icon: 'event_available',
    title: 'Đặt chỗ nhanh chóng',
    description:
      'Tính năng đặt chỗ trước đảm bảo bạn luôn có vị trí đỗ xe sẵn sàng, tiết kiệm thời gian trong giờ cao điểm.',
  },
  {
    icon: 'qr_code_2',
    title: 'Vé điện tử tiện lợi',
    description:
      'Mọi thông tin lượt gửi và thanh toán đều được tích hợp trên mã QR bảo mật, không còn lo mất vé giấy.',
  },
];

const spotsByFloor = {
  B1: [
    ['A01', 'occupied'], ['A02', 'occupied'], ['A03', 'available'], ['A04', 'available'], ['A05', 'pending'],
    ['A06', 'available'], ['A07', 'occupied'], ['A08', 'available'], ['A09', 'available'], ['A10', 'available'],
    ['A11', 'available'], ['A12', 'occupied'], ['A13', 'available'], ['A14', 'available'], ['A15', 'occupied'],
    ['A16', 'occupied'], ['A17', 'pending'], ['A18', 'available'],
  ],
  B2: [
    ['B01', 'available'], ['B02', 'available'], ['B03', 'occupied'], ['B04', 'available'], ['B05', 'available'],
    ['B06', 'occupied'], ['B07', 'occupied'], ['B08', 'pending'], ['B09', 'available'], ['B10', 'available'],
    ['B11', 'occupied'], ['B12', 'available'], ['B13', 'available'], ['B14', 'pending'], ['B15', 'available'],
    ['B16', 'available'], ['B17', 'occupied'], ['B18', 'available'],
  ],
  B3: [
    ['C01', 'occupied'], ['C02', 'pending'], ['C03', 'available'], ['C04', 'occupied'], ['C05', 'available'],
    ['C06', 'available'], ['C07', 'available'], ['C08', 'available'], ['C09', 'occupied'], ['C10', 'available'],
    ['C11', 'pending'], ['C12', 'available'], ['C13', 'occupied'], ['C14', 'available'], ['C15', 'available'],
    ['C16', 'occupied'], ['C17', 'available'], ['C18', 'pending'],
  ]
};

const stats = [
  { label: 'Tổng vị trí', value: '450', icon: 'local_parking', tone: 'primary' },
  { label: 'Vị trí trống', value: '124', icon: 'check_circle', tone: 'success' },
  { label: 'Đang hoạt động', value: '326', icon: 'sensors', tone: 'danger' },
];

const announcements = [
  {
    day: '15', month: 'TH05', badge: 'Khẩn cấp', tone: 'danger',
    title: 'Bảo trì hệ thống thanh toán tự động',
    description: 'Hệ thống thanh toán qua ví điện tử sẽ tạm ngưng hoạt động từ 00:00 đến 04:00 ngày 16/05 để nâng cấp bảo mật.',
  },
  {
    day: '12', month: 'TH05', badge: 'Thông tin', tone: 'info',
    title: 'Mở thêm khu vực đỗ xe máy tại Tầng B3',
    description: 'Nhằm phục vụ nhu cầu tăng cao, khu vực B3-C đã được chuyển đổi thành bãi đỗ xe máy với sức chứa thêm 200 xe.',
  },
  {
    day: '10', month: 'TH05', badge: 'Chính sách', tone: 'policy',
    title: 'Cập nhật biểu phí gửi xe tháng cho cư dân',
    description: 'Bắt đầu từ tháng 06, biểu phí đăng ký thẻ tháng sẽ có sự điều chỉnh nhẹ. Vui lòng xem chi tiết tại văn phòng quản lý.',
  },
  {
    day: '08', month: 'TH05', badge: 'Bảo trì', tone: 'maintenance',
    title: 'Nâng cấp camera an ninh khu vực B1–B2',
    description: 'Hệ thống camera tại tầng B1 và B2 sẽ được thay thế toàn bộ vào ngày 09/05. Hoạt động gửi xe vẫn bình thường.',
  },
  {
    day: '05', month: 'TH05', badge: 'Thông tin', tone: 'info',
    title: 'Lịch vệ sinh bãi xe định kỳ tháng 5',
    description: 'Công tác vệ sinh định kỳ diễn ra vào mỗi thứ 7 hàng tuần trong tháng 5, từ 6:00 đến 8:00 sáng.',
  },
  {
    day: '01', month: 'TH05', badge: 'Mới', tone: 'new',
    title: 'Ra mắt tính năng đặt chỗ theo giờ',
    description: 'Người dùng có thể đặt trước vị trí đỗ xe theo khung giờ cụ thể ngay trên ứng dụng di động từ ngày 01/05.',
  },
  {
    day: '28', month: 'TH04', badge: 'Chính sách', tone: 'policy',
    title: 'Quy định mới về xe quá khổ tại tầng hầm',
    description: 'Xe có chiều cao trên 1.9m không được phép vào tầng B2 và B3. Vui lòng sử dụng bãi đỗ ngoài trời khu vực A.',
  },
  {
    day: '20', month: 'TH04', badge: 'Khẩn cấp', tone: 'danger',
    title: 'Sự cố mất điện cục bộ tầng B1 đã được khắc phục',
    description: 'Sự cố mất điện xảy ra lúc 14:30 ngày 20/04 đã được xử lý hoàn toàn sau 45 phút. Hệ thống hoạt động bình thường.',
  }
];

const glassCardClass =
  'border border-slate-200 bg-white/90 shadow-[0_10px_26px_rgba(19,27,46,0.06)] backdrop-blur';

function spotClass(status) {
  const tone =
    status === 'available'
      ? 'border-green-500 bg-green-500/15 text-green-800'
      : status === 'occupied'
        ? 'border-red-500 bg-red-500/15 text-red-800'
        : 'border-amber-500 bg-amber-500/15 text-amber-800';

  return `flex h-[60px] w-10 items-center justify-center rounded-sm border-2 text-[10px] font-bold ${tone}`;
}

function dotClass(status) {
  const tone =
    status === 'available'
      ? 'bg-green-500/15 border border-green-500'
      : status === 'occupied'
        ? 'bg-red-500/15 border border-red-500'
        : 'bg-amber-500/15 border border-amber-500';

  return `h-3 w-3 rounded-full ${tone}`;
}

function statIconClass(tone) {
  const toneClass =
    tone === 'success'
      ? 'bg-[#008cc7]/10 text-[#008cc7]'
      : tone === 'danger'
        ? 'bg-[#ba1a1a]/10 text-[#ba1a1a]'
        : 'bg-[#0051d5]/10 text-[#0051d5]';

  return `material-symbols-outlined grid h-12 w-12 place-items-center rounded-full text-[26px] ${toneClass}`;
}

function statValueClass(tone) {
  if (tone === 'success') return 'text-[#008cc7]';
  if (tone === 'danger') return 'text-[#ba1a1a]';
  return 'text-black';
}

function badgeClass(tone) {
  const toneClass =
    tone === 'danger'
      ? 'bg-[#ffdad6] text-[#93000a]'
      : tone === 'info'
        ? 'bg-[#c9e6ff] text-[#001e2f]'
        : tone === 'maintenance'
          ? 'bg-amber-100 text-amber-800'
          : tone === 'new'
            ? 'bg-emerald-100 text-emerald-800'
            : 'bg-[#dbe1ff] text-[#00174b]';

  return `rounded px-2 py-0.5 text-[10px] font-bold uppercase ${toneClass}`;
}

export default function WelcomePage() {
  const navigate = useNavigate();
  const [selectedFloor, setSelectedFloor] = useState('B1');
  const [activeTab, setActiveTab] = useState('trang-chu');
  const [showAllAnnouncements, setShowAllAnnouncements] = useState(false);
  const [announcementFilter, setAnnouncementFilter] = useState('Tất cả');

  const filterOptions = ['Tất cả', 'Khẩn cấp', 'Thông tin', 'Chính sách', 'Bảo trì', 'Mới'];

  const filteredAnnouncements = announcements.filter(item => 
    announcementFilter === 'Tất cả' || item.badge === announcementFilter
  );
  
  const displayedAnnouncements = showAllAnnouncements 
    ? filteredAnnouncements 
    : announcements.slice(0, 3);

  const handleNavClick = (e, id) => {
    e.preventDefault();
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e]">
      <header className="fixed top-0 left-0 z-50 grid h-16 w-full grid-cols-[minmax(180px,1fr)_auto_minmax(280px,1fr)] items-center gap-6 border-b border-[#c6c6cd] bg-[#f7f9fb]/95 px-8 backdrop-blur max-[980px]:grid-cols-[1fr_auto] max-[720px]:h-auto max-[720px]:min-h-16 max-[720px]:px-4 max-[720px]:py-2.5">
        <div 
          className="flex items-center gap-4 cursor-pointer" 
          onClick={() => {
            navigate('/');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setActiveTab('trang-chu');
          }} 
          title="Trang chủ"
        >
          <img className="h-10 w-10 rounded-full object-cover" alt="Parking System Logo" src={logoUrl} />
          <span className="text-lg font-bold leading-6 text-[#0051d5]">Parking System</span>
        </div>

        <nav className="flex justify-center gap-8 max-[980px]:hidden" aria-label="Điều hướng trang chủ">
          <a 
            className={`text-base font-semibold leading-6 no-underline transition hover:text-[#0051d5] ${activeTab === 'trang-chu' ? 'text-[#0051d5]' : 'text-[#45464d]'}`} 
            href="#trang-chu"
            onClick={(e) => handleNavClick(e, 'trang-chu')}
          >
            Trang chủ
          </a>
          <a 
            className={`text-base font-semibold leading-6 no-underline transition hover:text-[#0051d5] ${activeTab === 'thong-tin-bai' ? 'text-[#0051d5]' : 'text-[#45464d]'}`} 
            href="#thong-tin-bai"
            onClick={(e) => handleNavClick(e, 'thong-tin-bai')}
          >
            Thông tin bãi
          </a>
          <a 
            className={`text-base font-semibold leading-6 no-underline transition hover:text-[#0051d5] ${activeTab === 'thong-bao' ? 'text-[#0051d5]' : 'text-[#45464d]'}`} 
            href="#thong-bao"
            onClick={(e) => handleNavClick(e, 'thong-bao')}
          >
            Thông báo của Admin
          </a>
        </nav>

        <div className="flex items-center justify-end gap-3 max-[720px]:gap-1.5">
          <button
            className="min-h-9 cursor-pointer rounded border-2 border-[#0051d5] bg-transparent px-5 py-2 text-xs font-bold uppercase tracking-[0.05em] text-[#0051d5] transition hover:bg-[#0051d5]/10 active:scale-95 max-[720px]:px-2.5 max-[720px]:py-1.5"
            type="button"
            onClick={() => navigate('/signup')}
          >
            Đăng ký
          </button>
          <button
            className="min-h-9 cursor-pointer rounded border-2 border-[#1e3a8a] bg-[#1e3a8a] px-5 py-2 text-xs font-bold uppercase tracking-[0.05em] shadow-[0_8px_18px_rgba(30,58,138,0.16)] transition hover:bg-blue-800 hover:border-blue-800 hover:shadow-[0_10px_22px_rgba(30,58,138,0.22)] active:scale-95 max-[720px]:px-2.5 max-[720px]:py-1.5"
            type="button"
            onClick={() => navigate('/login')}
          >
            <span className="text-white">Đăng nhập</span>
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-6 pt-24 pb-16 max-[720px]:px-4 max-[720px]:pb-12">
        <section className="mb-20 scroll-mt-28" id="trang-chu">
          <div className="mb-16 grid grid-cols-[minmax(0,1fr)_minmax(420px,1fr)] items-center gap-12 max-[980px]:grid-cols-1">
            <div>
              <h1 className="mb-6 text-4xl font-bold leading-[44px] text-black max-[720px]:text-[30px] max-[720px]:leading-[38px]">
                Giải Pháp Quản Lý Bãi Gửi Xe Thông Minh
              </h1>
              <p className="mb-6 text-base leading-[26px] text-[#45464d]">
                Hệ thống Parking System cung cấp công nghệ quản lý vận hành hiện đại,
                giúp tối ưu hóa không gian đỗ xe và nâng cao trải nghiệm người dùng với
                tính chính xác tuyệt đối.
              </p>
              <a 
                className="inline-flex min-h-12 items-center gap-2 rounded bg-[#1e3a8a] px-8 py-3 text-xs font-bold uppercase tracking-[0.05em] no-underline hover:bg-blue-800 transition-colors" 
                href="#thong-tin-bai"
                onClick={(e) => handleNavClick(e, 'thong-tin-bai')}
              >
                <span className="text-white">Khám phá ngay</span>
                <span className="material-symbols-outlined text-white">arrow_forward</span>
              </a>
            </div>

            <img
              className="aspect-video w-full rounded-lg border border-[#c6c6cd] object-cover shadow-[0_24px_44px_rgba(19,27,46,0.16)]"
              alt="Modern parking structure"
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80"
            />
          </div>

          <div className="grid grid-cols-3 gap-4 max-[980px]:grid-cols-1">
            {heroCards.map((card) => (
              <article className={`${glassCardClass} rounded-lg border-l-4 border-l-[#0051d5] p-8`} key={card.title}>
                <span className="material-symbols-outlined mb-4 text-[40px] text-[#0051d5]">{card.icon}</span>
                <h2 className="mb-2 text-lg leading-6 text-black">{card.title}</h2>
                <p className="text-sm leading-5 text-[#45464d]">{card.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-20 scroll-mt-28" id="thong-tin-bai">
          <div className="mb-8 flex items-end justify-between gap-6 max-[980px]:flex-col max-[980px]:items-start">
            <div>
              <h2 className="m-0 text-2xl font-semibold leading-8 text-black">Tình Trạng Bãi Đỗ Xe</h2>
              <p className="m-0 text-sm leading-5 text-[#45464d]">
                Dữ liệu thời gian thực được cập nhật mỗi 30 giây từ hệ thống cảm biến.
              </p>
            </div>
            <div className="flex gap-4 text-xs font-bold uppercase text-[#45464d] max-[720px]:flex-wrap">
              <span className="inline-flex items-center gap-2"><i className={dotClass('available')} />Trống</span>
              <span className="inline-flex items-center gap-2"><i className={dotClass('occupied')} />Đã có xe</span>
              <span className="inline-flex items-center gap-2"><i className={dotClass('pending')} />Đã đặt</span>
            </div>
          </div>

          <div className="grid grid-cols-[minmax(0,2fr)_minmax(260px,1fr)] gap-6 max-[980px]:grid-cols-1">
            <article className={`${glassCardClass} min-h-[400px] rounded-lg p-6`}>
              <div className="mb-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#0051d5]">apartment</span>
                  <strong className="text-lg leading-6">Sơ đồ Tầng {selectedFloor} - Khu vực A</strong>
                </div>
                <select
                  className="min-h-[34px] rounded border-0 bg-[#eceef0] px-3 py-1.5 text-[#191c1e] outline-none"
                  value={selectedFloor}
                  onChange={(event) => setSelectedFloor(event.target.value)}
                >
                  <option value="B1">Tầng B1</option>
                  <option value="B2">Tầng B2</option>
                  <option value="B3">Tầng B3</option>
                </select>
              </div>

              <div className="grid grid-cols-[repeat(10,40px)] gap-2 overflow-x-auto rounded-lg border border-[#c6c6cd] bg-[#f2f4f6] p-4">
                {spotsByFloor[selectedFloor].slice(0, 5).map(([id, status]) => (
                  <span className={spotClass(status)} key={id}>{id}</span>
                ))}
                <span className="h-[60px] w-10" />
                {spotsByFloor[selectedFloor].slice(5, 9).map(([id, status]) => (
                  <span className={spotClass(status)} key={id}>{id}</span>
                ))}
                <div className="col-span-full flex h-8 items-center justify-center border-y border-dashed border-[#76777d] text-[10px] font-bold uppercase tracking-[0.5em] text-[#76777d]">
                  Lối đi chính
                </div>
                {spotsByFloor[selectedFloor].slice(9, 14).map(([id, status]) => (
                  <span className={spotClass(status)} key={id}>{id}</span>
                ))}
                <span className="h-[60px] w-10" />
                {spotsByFloor[selectedFloor].slice(14).map(([id, status]) => (
                  <span className={spotClass(status)} key={id}>{id}</span>
                ))}
              </div>
            </article>

            <div className="grid gap-4">
              {stats.map((stat) => (
                <article className={`${glassCardClass} flex items-center justify-between gap-4 rounded-lg p-6`} key={stat.label}>
                  <div>
                    <p className="m-0 text-xs font-bold uppercase tracking-[0.05em] text-[#45464d]">{stat.label}</p>
                    <strong className={`text-4xl font-bold leading-[44px] ${statValueClass(stat.tone)}`}>{stat.value}</strong>
                  </div>
                  <span className={statIconClass(stat.tone)}>{stat.icon}</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-20 scroll-mt-28" id="thong-bao">
          <div className="mb-8 flex items-center justify-between gap-6 max-[720px]:flex-col max-[720px]:items-start">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#0051d5]">campaign</span>
              <div>
                <h2 className="m-0 text-2xl font-semibold leading-8 text-black">Thông báo của Admin</h2>
                {showAllAnnouncements && (
                  <p className="mt-1 text-sm font-medium text-[#45464d]">{filteredAnnouncements.length} thông báo</p>
                )}
              </div>
            </div>

            {showAllAnnouncements && (
              <div className="flex flex-wrap gap-2">
                {filterOptions.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setAnnouncementFilter(filter)}
                    className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                      announcementFilter === filter
                        ? 'bg-gradient-to-r from-emerald-400 to-green-500 text-black shadow-md'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid gap-4">
            {displayedAnnouncements.map((item) => (
              <article className={`${glassCardClass} grid cursor-pointer grid-cols-[auto_minmax(0,1fr)] items-center gap-6 rounded-lg p-6 transition hover:border-[#0051d5] max-[720px]:grid-cols-[1fr]`} key={item.title}>
                <div className="grid min-w-[72px] justify-items-center border-r border-[#c6c6cd] pr-4 max-[720px]:col-span-full max-[720px]:justify-items-start max-[720px]:border-r-0 max-[720px]:border-b max-[720px]:pb-3 max-[720px]:pr-0">
                  <strong className="text-2xl leading-8 text-[#0051d5]">{item.day}</strong>
                  <span className="text-xs font-bold">{item.month}</span>
                </div>
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <span className={badgeClass(item.tone)}>{item.badge}</span>
                    <h3 className="m-0 text-lg leading-6">{item.title}</h3>
                  </div>
                  <p className="m-0 text-sm leading-5 text-[#45464d]">{item.description}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button 
              className="cursor-pointer border-0 bg-transparent text-xs font-bold uppercase tracking-[0.05em] text-[#0051d5] hover:underline" 
              type="button"
              onClick={() => {
                setShowAllAnnouncements(!showAllAnnouncements);
                if (showAllAnnouncements) setAnnouncementFilter('Tất cả');
              }}
            >
              {showAllAnnouncements ? 'Thu gọn' : 'Xem tất cả thông báo'}
            </button>
          </div>
        </section>
      </main>

      <footer className="bg-[#131b2e] px-8 py-16 text-white/80">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-[1.5fr_1fr_1.25fr_1fr] gap-12 max-[980px]:grid-cols-1">
          <section className="flex flex-col gap-4">
            <div className="mb-2 flex items-center gap-3">
              <img className="h-8 w-8 rounded-full object-cover" alt="Parking System Logo Small" src={logoUrl} />
              <span className="text-xs font-bold uppercase tracking-[0.05em] text-[#b4c5ff]">Parking System</span>
            </div>
            <p className="m-0 text-sm leading-5 text-white/80">
              Operational Precision. Giải pháp quản lý bãi đỗ xe hàng đầu cho các tòa
              nhà văn phòng và trung tâm thương mại cao cấp.
            </p>
          </section>

          <section className="flex flex-col gap-4">
            <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.05em] text-white">Liên kết nhanh</h2>
            <a className="text-white/80 no-underline hover:text-[#0051d5]" href="/privacy">Chính sách bảo mật</a>
            <a className="text-white/80 no-underline hover:text-[#0051d5]" href="/terms">Điều khoản dịch vụ</a>
            <a className="text-white/80 no-underline hover:text-[#0051d5]" href="/support">Hỗ trợ kỹ thuật</a>
          </section>

          <section className="flex flex-col gap-4">
            <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.05em] text-white">Hỗ trợ</h2>
            <p className="m-0 flex items-center gap-2.5 text-sm leading-5 text-white/80"><span className="material-symbols-outlined text-xl text-[#b4c5ff]">support_agent</span>Hotline: 1900 8888</p>
            <p className="m-0 flex items-center gap-2.5 text-sm leading-5 text-white/80"><span className="material-symbols-outlined text-xl text-[#b4c5ff]">mail</span>support@nexus.vn</p>
            <p className="m-0 flex items-center gap-2.5 text-sm leading-5 text-white/80"><span className="material-symbols-outlined text-xl text-[#b4c5ff]">location_on</span>Tòa nhà Nexus, Quận 1, TP.HCM</p>
          </section>

          <section className="flex flex-col gap-4">
            <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.05em] text-white">Theo dõi chúng tôi</h2>
            <div className="flex gap-4">
              <a className="grid h-10 w-10 place-items-center rounded bg-white/10 font-bold uppercase text-white no-underline hover:bg-[#316bf3]" href="#facebook" aria-label="Facebook">f</a>
              <a className="grid h-10 w-10 place-items-center rounded bg-white/10 font-bold uppercase text-white no-underline hover:bg-[#316bf3]" href="#twitter" aria-label="Twitter">x</a>
            </div>
          </section>
        </div>

        <div className="mx-auto mt-12 flex w-full max-w-7xl justify-between gap-6 border-t border-white/10 pt-8 text-sm text-white/60 max-[720px]:flex-wrap">
          <span>© 2024 Parking System Management. Operational Precision.</span>
          <span>Hệ thống quản lý bãi đỗ xe thông minh v4.2.0</span>
        </div>
      </footer>
    </div>
  );
}
