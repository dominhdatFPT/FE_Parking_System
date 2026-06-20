import { useMemo, useState } from 'react';
import {
  CheckCircle2,
  Clock3,
  LifeBuoy,
  MessageSquareText,
  Search,
  Send,
  X,
} from 'lucide-react';

const mockIncidents = [
  {
    id: 'INC-001',
    userName: 'Nguyen Van A',
    userEmail: 'nguyenvana@example.com',
    service: 'Thanh toán & hóa đơn',
    content: 'Tôi đã thanh toán phí gửi xe nhưng hệ thống chưa cập nhật trạng thái. Mong admin kiểm tra giúp.',
    status: 'Chờ xử lý',
    createdAt: '20/06/2026 21:30',
    replyTitle: '',
    replyMessage: '',
    repliedBy: '',
    repliedAt: '',
  },
  {
    id: 'INC-002',
    userName: 'Tran Minh B',
    userEmail: 'tranminhb@example.com',
    service: 'Dịch vụ gửi xe',
    content: 'Barrier không mở khi tôi quét mã ra bãi, nhân viên phải xử lý thủ công.',
    status: 'Đã phản hồi',
    createdAt: '20/06/2026 20:10',
    replyTitle: 'Đã tiếp nhận lỗi quét mã ra bãi',
    replyMessage: 'Admin đã tiếp nhận và đang kiểm tra phiên gửi xe liên quan.',
    repliedBy: 'Admin Parking',
    repliedAt: '20/06/2026 20:22',
  },
  {
    id: 'INC-003',
    userName: 'Le Hoang C',
    userEmail: 'lehoangc@example.com',
    service: 'An ninh',
    content: 'Tôi phát hiện xe bị trầy xước tại khu B2, cần kiểm tra camera ngay.',
    status: 'Chờ xử lý',
    createdAt: '20/06/2026 19:45',
    replyTitle: '',
    replyMessage: '',
    repliedBy: '',
    repliedAt: '',
  },
  {
    id: 'INC-004',
    userName: 'Pham Quoc D',
    userEmail: 'phamquocd@example.com',
    service: 'Tài khoản người dùng',
    content: 'Tài khoản của tôi không hiển thị đúng biển số đã đăng ký.',
    status: 'Đã phản hồi',
    createdAt: '19/06/2026 16:20',
    replyTitle: 'Hướng dẫn cập nhật thông tin tài khoản',
    replyMessage: 'Admin đã đồng bộ lại thông tin phương tiện cho tài khoản.',
    repliedBy: 'Admin Parking',
    repliedAt: '19/06/2026 16:42',
  },
];

const statuses = ['Tất cả', 'Chờ xử lý', 'Đang xử lý', 'Đã phản hồi', 'Đã giải quyết', 'Đã đóng'];

function getStatusClass(status) {
  const styles = {
    'Chờ xử lý': 'bg-slate-100 text-slate-700 ring-slate-200',
    'Đang xử lý': 'bg-sky-50 text-sky-700 ring-sky-200',
    'Đã phản hồi': 'bg-violet-50 text-violet-700 ring-violet-200',
    'Đã giải quyết': 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    'Đã đóng': 'bg-zinc-100 text-zinc-600 ring-zinc-200',
  };

  return styles[status] || 'bg-slate-100 text-slate-700 ring-slate-200';
}

function Badge({ children, className }) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${className}`}>
      {children}
    </span>
  );
}

function StatCard({ icon: Icon, label, value, description, tone }) {
  const tones = {
    blue: 'bg-sky-50 text-sky-700 ring-sky-100',
    amber: 'bg-amber-50 text-amber-700 ring-amber-100',
    emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  };

  return (
    <article className="rounded-[28px] bg-white/80 p-1.5 ring-1 ring-slate-200/70 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
      <div className="rounded-[22px] bg-white p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-500">{label}</p>
            <p className="mt-3 text-4xl font-semibold tracking-normal text-slate-950 tabular-nums">{value}</p>
          </div>
          <span className={`grid h-12 w-12 place-items-center rounded-2xl ring-1 ${tones[tone]}`}>
            <Icon className="h-5 w-5" />
          </span>
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-500">{description}</p>
      </div>
    </article>
  );
}

function CompactInfoRow({ label, children }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 py-3 last:border-b-0">
      <span className="text-sm font-medium text-slate-500">{label}</span>
      <span className="max-w-[58%] text-right text-sm font-semibold text-slate-900">{children}</span>
    </div>
  );
}

function IncidentReplyModal({
  incident,
  isOpen,
  replyTitle,
  replyMessage,
  selectedStatus,
  errors,
  setReplyTitle,
  setReplyMessage,
  setSelectedStatus,
  onClose,
  onSubmit,
}) {
  if (!isOpen || !incident) return null;

  const responseTime = new Date().toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-y-0 left-0 right-0 z-[70] flex items-center justify-center bg-black/40 p-4 lg:left-[260px]">
      <button
        type="button"
        aria-label="Đóng modal phản hồi"
        className="absolute inset-0"
        onClick={onClose}
      />

      <section className="relative flex max-h-[82vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-[0_30px_100px_rgba(15,23,42,0.32)]">
        <header className="sticky top-0 z-10 border-b border-slate-100 bg-white px-5 py-4 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-2xl font-semibold tracking-normal text-slate-950">Phản hồi sự cố</h2>
            <button
              type="button"
              onClick={onClose}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-950 active:scale-95"
              aria-label="Đóng"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="grid lg:grid-cols-[0.45fr_0.55fr]">
            <div className="space-y-4 bg-slate-50 px-5 py-5 sm:px-6">
              <article className="rounded-3xl bg-white p-5 ring-1 ring-slate-200/80 shadow-[0_16px_42px_rgba(15,23,42,0.05)]">
                <h3 className="text-base font-semibold text-slate-950">Thông tin người gửi</h3>
                <div className="mt-3">
                  <CompactInfoRow label="Tên người gửi">{incident.userName}</CompactInfoRow>
                  <CompactInfoRow label="Email">{incident.userEmail}</CompactInfoRow>
                  <CompactInfoRow label="Loại sự cố">{incident.service}</CompactInfoRow>
                  <CompactInfoRow label="Trạng thái">
                    <Badge className={getStatusClass(incident.status)}>{incident.status}</Badge>
                  </CompactInfoRow>
                  <CompactInfoRow label="Thời gian gửi">{incident.createdAt}</CompactInfoRow>
                </div>
              </article>

              <article className="rounded-3xl bg-white p-5 ring-1 ring-slate-200/80">
                <h3 className="text-sm font-semibold text-slate-950">Nội dung sự cố</h3>
                <p className="mt-3 rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-600">
                  {incident.content}
                </p>
              </article>
            </div>

            <div className="flex min-h-full flex-col bg-white">
              <div className="flex-1 space-y-4 px-5 py-5 sm:px-6">
                <article className="rounded-2xl bg-sky-50/80 p-4 ring-1 ring-sky-100">
                  <h3 className="text-sm font-semibold text-slate-950">Nhân viên xử lý</h3>
                  <div className="mt-2 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                    <p className="text-sm font-semibold text-slate-950">Admin Parking · Admin</p>
                    <p className="whitespace-nowrap text-xs font-medium text-slate-500">
                      {responseTime.replace(',', '')}
                    </p>
                  </div>
                </article>

                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-slate-700">Tiêu đề phản hồi</span>
                  <input
                    value={replyTitle}
                    onChange={(event) => setReplyTitle(event.target.value)}
                    placeholder="Nhập tiêu đề phản hồi hoặc tóm tắt hướng xử lý..."
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 outline-none transition placeholder:font-medium placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                  />
                  {errors.replyTitle ? <p className="text-xs font-semibold text-rose-600">{errors.replyTitle}</p> : null}
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-slate-700">Cập nhật trạng thái</span>
                  <select
                    value={selectedStatus}
                    onChange={(event) => setSelectedStatus(event.target.value)}
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                  >
                    {statuses.slice(1).map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-slate-700">Nội dung phản hồi</span>
                  <textarea
                    value={replyMessage}
                    onChange={(event) => setReplyMessage(event.target.value)}
                    placeholder="Nhập nội dung phản hồi hoặc hướng dẫn hỗ trợ cho người dùng..."
                    className="h-56 min-h-[180px] w-full resize-none rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-800 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
                  />
                  {errors.replyMessage ? (
                    <p className="text-xs font-semibold text-rose-600">{errors.replyMessage}</p>
                  ) : null}
                  <p className="text-xs font-medium text-slate-500">
                    Nội dung phản hồi sẽ được gửi đến người dùng qua thông báo hỗ trợ.
                  </p>
                </label>
              </div>

              <footer className="sticky bottom-0 flex flex-col-reverse gap-3 border-t border-slate-100 bg-white px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-[0.98]"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={onSubmit}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(14,165,233,0.24)] transition hover:bg-sky-700 active:scale-[0.98]"
                >
                  <Send className="h-4 w-4" />
                  Gửi phản hồi
                </button>
              </footer>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function IncidentPage() {
  const [incidents, setIncidents] = useState(mockIncidents);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tất cả');
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [replyTitle, setReplyTitle] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Đã phản hồi');
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const filteredIncidents = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return incidents.filter((incident) => {
      const matchesKeyword =
        !keyword ||
        [incident.userName, incident.userEmail, incident.service, incident.content, incident.replyTitle].some((value) =>
          String(value || '').toLowerCase().includes(keyword),
        );
      const matchesStatus = statusFilter === 'Tất cả' || incident.status === statusFilter;

      return matchesKeyword && matchesStatus;
    });
  }, [incidents, search, statusFilter]);

  const stats = useMemo(
    () => ({
      total: incidents.length,
      pending: incidents.filter((incident) => incident.status === 'Chờ xử lý').length,
      replied: incidents.filter((incident) => incident.status === 'Đã phản hồi').length,
    }),
    [incidents],
  );

  function openReplyModal(incident) {
    setSelectedIncident(incident);
    setSelectedStatus(incident.status === 'Chờ xử lý' ? 'Đã phản hồi' : incident.status);
    setReplyTitle(incident.replyTitle || '');
    setReplyMessage(incident.replyMessage || '');
    setErrors({});
    setSuccessMessage('');
    setIsReplyModalOpen(true);
  }

  function closeReplyModal() {
    setIsReplyModalOpen(false);
    setSelectedIncident(null);
    setReplyTitle('');
    setReplyMessage('');
    setSelectedStatus('Đã phản hồi');
    setErrors({});
  }

  function handleSendReply() {
    const nextErrors = {};

    if (!replyTitle.trim()) {
      nextErrors.replyTitle = 'Vui lòng nhập tiêu đề phản hồi.';
    }

    if (!replyMessage.trim()) {
      nextErrors.replyMessage = 'Vui lòng nhập nội dung phản hồi.';
    }

    setErrors(nextErrors);
    if (!selectedIncident || Object.keys(nextErrors).length > 0) return;

    const now = new Date().toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    setIncidents((current) =>
      current.map((incident) =>
        incident.id === selectedIncident.id
          ? {
              ...incident,
              status: selectedStatus || 'Đã phản hồi',
              replyTitle: replyTitle.trim(),
              replyMessage: replyMessage.trim(),
              repliedBy: 'Admin Parking',
              repliedAt: now,
            }
          : incident,
      ),
    );
    setSuccessMessage('Phản hồi đã được gửi đến người dùng.');
    closeReplyModal();
  }

  return (
    <main className="mx-auto max-w-[1440px] space-y-6">
      {successMessage ? (
        <div className="flex items-center gap-3 rounded-3xl bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-200">
          <CheckCircle2 className="h-5 w-5" />
          {successMessage}
        </div>
      ) : null}

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard
          icon={LifeBuoy}
          label="Tổng sự cố"
          value={stats.total}
          description="Tất cả báo cáo trong hệ thống"
          tone="blue"
        />
        <StatCard
          icon={Clock3}
          label="Chờ xử lý"
          value={stats.pending}
          description="Cần admin kiểm tra sớm"
          tone="amber"
        />
        <StatCard
          icon={MessageSquareText}
          label="Đã phản hồi"
          value={stats.replied}
          description="Đã phản hồi cho người dùng"
          tone="emerald"
        />
      </section>

      <section className="overflow-hidden rounded-[28px] bg-white ring-1 ring-slate-200/80 shadow-[0_18px_55px_rgba(15,23,42,0.06)]">
        <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 lg:flex-row lg:items-center lg:justify-between lg:px-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">Danh sách sự cố</h2>
          </div>
          <div className="grid w-full gap-3 sm:grid-cols-[1fr_220px] lg:w-auto lg:min-w-[620px]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Tìm theo người gửi, dịch vụ, nội dung..."
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-medium text-slate-800 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-left text-sm">
            <thead className="bg-slate-50/90 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              <tr>
                <th className="px-5 py-4">Người gửi</th>
                <th className="px-5 py-4">Loại sự cố</th>
                <th className="px-5 py-4">Trạng thái</th>
                <th className="px-5 py-4">Thời gian</th>
                <th className="px-5 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredIncidents.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-5 py-16 text-center">
                    <div className="mx-auto max-w-sm">
                      <span className="mx-auto grid h-16 w-16 place-items-center rounded-[24px] bg-slate-100 text-slate-500">
                        <LifeBuoy className="h-7 w-7" />
                      </span>
                      <p className="mt-5 text-lg font-semibold text-slate-950">Không tìm thấy sự cố phù hợp</p>
                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredIncidents.map((incident) => (
                  <tr
                    key={incident.id}
                    onClick={() => openReplyModal(incident)}
                    className="cursor-pointer transition-colors duration-200 hover:bg-sky-50/45"
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-900">{incident.userName}</p>
                      <p className="mt-1 text-xs text-slate-500">{incident.userEmail}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{incident.service}</td>
                    <td className="px-5 py-4">
                      <Badge className={getStatusClass(incident.status)}>{incident.status}</Badge>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-slate-600">{incident.createdAt}</td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end" onClick={(event) => event.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => openReplyModal(incident)}
                          className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-sky-700 active:scale-95"
                        >
                          <MessageSquareText className="h-3.5 w-3.5" />
                          Xem chi tiết
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <IncidentReplyModal
        incident={selectedIncident}
        isOpen={isReplyModalOpen}
        replyTitle={replyTitle}
        replyMessage={replyMessage}
        selectedStatus={selectedStatus}
        errors={errors}
        setReplyTitle={setReplyTitle}
        setReplyMessage={setReplyMessage}
        setSelectedStatus={setSelectedStatus}
        onClose={closeReplyModal}
        onSubmit={handleSendReply}
      />
    </main>
  );
}
