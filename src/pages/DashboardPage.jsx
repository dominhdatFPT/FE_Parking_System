import MainLayout from '../layouts/MainLayout';

const summaryCards = [
  { label: 'Xe đang gửi', value: '326', icon: 'directions_car', tone: 'bg-[#eaf2ff] text-[#0051d5]' },
  { label: 'Chỗ trống', value: '184', icon: 'local_parking', tone: 'bg-[#e9f8ef] text-[#087443]' },
  { label: 'Doanh thu hôm nay', value: '18.4M', icon: 'payments', tone: 'bg-[#fff4e5] text-[#b54708]' },
  { label: 'Cảnh báo', value: '7', icon: 'warning', tone: 'bg-[#fff0f0] text-[#b42318]' },
];

const recentSessions = [
  { plate: '51F-234.88', zone: 'B1 - A12', status: 'Đang gửi', time: '08:12' },
  { plate: '30H-918.22', zone: 'B2 - C04', status: 'Đã thanh toán', time: '08:04' },
  { plate: '59A-771.10', zone: 'B1 - B18', status: 'Đang gửi', time: '07:52' },
  { plate: '43C-105.46', zone: 'B3 - D09', status: 'Cần kiểm tra', time: '07:40' },
];

export default function DashboardPage() {
  return (
    <MainLayout>
      <div className="grid gap-6">
        <section className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[#0051d5]">
              Tổng quan
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-[#101828]">
              Chào mừng trở lại, Admin!
            </h1>
            <p className="mt-2 text-sm text-[#667085]">
              Theo dõi tình hình bãi xe, doanh thu và cảnh báo vận hành trong ngày.
            </p>
          </div>
          <button className="inline-flex h-10 cursor-pointer items-center gap-2 rounded border border-[#c9d2df] bg-white px-4 text-sm font-semibold text-[#344054] hover:border-[#0051d5] hover:text-[#0051d5]">
            <span className="material-symbols-outlined text-[18px]">download</span>
            Xuất báo cáo
          </button>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <article className="rounded border border-[#dde5f0] bg-white p-5" key={card.label}>
              <div className={`mb-5 grid h-11 w-11 place-items-center rounded ${card.tone}`}>
                <span className="material-symbols-outlined">{card.icon}</span>
              </div>
              <p className="text-sm text-[#667085]">{card.label}</p>
              <p className="mt-2 text-3xl font-semibold text-[#101828]">{card.value}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <article className="rounded border border-[#dde5f0] bg-white p-5">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#101828]">Lưu lượng theo giờ</h2>
              <span className="text-sm text-[#667085]">Hôm nay</span>
            </div>
            <div className="flex h-72 items-end gap-3 border-b border-[#e4eaf2] px-2 pb-4">
              {[34, 46, 58, 72, 63, 88, 76, 92, 69, 54, 48, 40].map((height, index) => (
                <div className="flex flex-1 flex-col items-center gap-2" key={height + index}>
                  <div
                    className="w-full rounded-t bg-[#0051d5]"
                    style={{ height: `${height}%`, minHeight: '28px' }}
                  />
                  <span className="text-[11px] text-[#667085]">{index + 7}h</span>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded border border-[#dde5f0] bg-white p-5">
            <h2 className="mb-5 text-lg font-semibold text-[#101828]">Phiên gần đây</h2>
            <div className="grid gap-3">
              {recentSessions.map((session) => (
                <div className="rounded border border-[#e4eaf2] p-3" key={session.plate}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-[#101828]">{session.plate}</p>
                      <p className="mt-1 text-sm text-[#667085]">{session.zone}</p>
                    </div>
                    <span className="font-mono text-xs text-[#667085]">{session.time}</span>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-[#0051d5]">{session.status}</p>
                </div>
              ))}
            </div>
          </article>
        </section>
      </div>
    </MainLayout>
  );
}
