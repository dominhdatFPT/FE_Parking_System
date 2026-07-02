import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  BellRing,
  CheckCircle2,
  Clock3,
  Edit3,
  Eye,
  FileText,
  RefreshCw,
  Save,
  Search,
  Send,
  Sparkles,
  Trash2,
  Users,
  X,
} from 'lucide-react';
import {
  createAdminNotification,
  deleteAdminNotification,
  getAdminNotifications,
  sendAdminNotification,
  updateAdminNotification,
} from '../services/adminNotificationService';

const emptyForm = {
  title: '',
  content: '',
  type: 'Hệ thống',
  priority: 'Thường',
  target: 'Tất cả user',
  sendTime: 'Gửi ngay',
};

const notificationTypes = ['Tất cả', 'Hệ thống', 'Bảo trì', 'Gói gửi xe', 'Thanh toán', 'Sự cố'];
const statusFilters = ['Tất cả', 'Đã gửi', 'Nháp', 'Hẹn lịch'];
const priorityOptions = ['Thường', 'Quan trọng'];
const targetOptions = [
  'Tất cả user',
  'User đang gửi xe',
  'User có gói tháng',
  'User sắp hết hạn gói',
  'User cụ thể',
];
const sendTimeOptions = ['Gửi ngay', 'Lưu nháp', 'Hẹn lịch'];

const inputClass =
  'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100';

function resolveStatus(sendTime) {
  if (sendTime === 'Lưu nháp') return 'Nháp';
  if (sendTime === 'Hẹn lịch') return 'Hẹn lịch';
  return 'Đã gửi';
}

function getStatusClasses(status) {
  const styles = {
    'Đã gửi': 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    Nháp: 'bg-slate-100 text-slate-600 ring-slate-200',
    'Hẹn lịch': 'bg-sky-50 text-sky-700 ring-sky-200',
  };

  return styles[status] ?? 'bg-orange-50 text-orange-700 ring-orange-200';
}

function getPriorityClasses(priority) {
  const styles = {
    Thường: 'bg-slate-100 text-slate-600 ring-slate-200',
    'Quan trọng': 'bg-amber-50 text-amber-700 ring-amber-200',
  };

  return styles[priority] ?? styles.Thường;
}

function getTypeClasses(type) {
  const styles = {
    'Hệ thống': 'bg-indigo-50 text-indigo-700',
    'Bảo trì': 'bg-cyan-50 text-cyan-700',
    'Gói gửi xe': 'bg-violet-50 text-violet-700',
    'Thanh toán': 'bg-emerald-50 text-emerald-700',
    'Sự cố': 'bg-orange-50 text-orange-700',
  };

  return styles[type] ?? 'bg-slate-100 text-slate-700';
}

function StatCard({ icon: Icon, label, value, tone }) {
  const tones = {
    sky: 'bg-sky-50 text-sky-700 ring-sky-100',
    emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    slate: 'bg-slate-100 text-slate-700 ring-slate-200',
  };

  return (
    <article className="rounded-[24px] border border-white/80 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-3 text-3xl font-semibold tabular-nums tracking-normal text-slate-950">{value}</p>
        </div>
        <span className={`grid h-12 w-12 place-items-center rounded-2xl ring-1 ${tones[tone]}`}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </article>
  );
}

function Badge({ children, className }) {
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ring-1 ${className}`}>
      {children}
    </span>
  );
}

function ActionButton({ icon: Icon, label, onClick, tone = 'slate' }) {
  const tones = {
    slate: 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50',
    sky: 'border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100',
    emerald: 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100',
    rose: 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border transition active:scale-95 ${tones[tone]}`}
      title={label}
      aria-label={label}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

function NotificationPreview({ form }) {
  return (
    <aside className="rounded-[24px] border border-sky-100 bg-gradient-to-br from-sky-50 to-white p-5 shadow-[0_18px_45px_rgba(14,165,233,0.08)]">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-slate-900">Xem trước thông báo</p>
        <Badge className={getPriorityClasses(form.priority)}>{form.priority}</Badge>
      </div>

      <div className="mt-5 rounded-[22px] border border-white bg-white p-4 shadow-sm">
        <div className="flex gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-sky-500 text-white shadow-[0_12px_28px_rgba(14,165,233,0.24)]">
            <BellRing className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <h4 className="text-sm font-semibold text-slate-950">
              {form.title.trim() || 'Tiêu đề thông báo'}
            </h4>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              {form.content.trim() || 'Nội dung thông báo sẽ hiển thị ở đây để staff/admin kiểm tra trước khi gửi.'}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${getTypeClasses(form.type)}`}>
            {form.type}
          </span>
          <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            <Clock3 className="h-3.5 w-3.5" />
            {form.sendTime}
          </span>
        </div>
      </div>
    </aside>
  );
}

function NotificationFormModal({
  editingNotification,
  form,
  setForm,
  onClose,
  onSaveDraft,
  onSend,
  actionLoading,
}) {
  const title = editingNotification ? 'Chỉnh sửa thông báo' : 'Tạo thông báo';

  return (
    <div className="fixed inset-y-0 left-0 right-0 z-[70] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm lg:left-[260px]">
      <div className="max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-[28px] bg-white shadow-[0_30px_90px_rgba(15,23,42,0.28)]">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-600">Parking Management</p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-950">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={actionLoading}
            className="grid h-10 w-10 place-items-center rounded-2xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 active:scale-95"
            aria-label="Đóng modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid max-h-[calc(92vh-164px)] gap-6 overflow-y-auto p-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-4">
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-slate-700">Tiêu đề thông báo</span>
              <input
                className={inputClass}
                value={form.title}
                onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                placeholder="Nhập tiêu đề ngắn gọn"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-semibold text-slate-700">Nội dung thông báo</span>
              <textarea
                className={`${inputClass} min-h-32 resize-y leading-6`}
                value={form.content}
                onChange={(event) => setForm((current) => ({ ...current, content: event.target.value }))}
                placeholder="Nhập nội dung gửi đến người dùng"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block space-y-2">
                <span className="text-sm font-semibold text-slate-700">Loại thông báo</span>
                <select
                  className={inputClass}
                  value={form.type}
                  onChange={(event) => setForm((current) => ({ ...current, type: event.target.value }))}
                >
                  {notificationTypes.slice(1).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-semibold text-slate-700">Mức độ ưu tiên</span>
                <select
                  className={inputClass}
                  value={form.priority}
                  onChange={(event) => setForm((current) => ({ ...current, priority: event.target.value }))}
                >
                  {priorityOptions.map((priority) => (
                    <option key={priority} value={priority}>
                      {priority}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-semibold text-slate-700">Đối tượng nhận</span>
                <select
                  className={inputClass}
                  value={form.target}
                  onChange={(event) => setForm((current) => ({ ...current, target: event.target.value }))}
                >
                  {targetOptions.map((target) => (
                    <option key={target} value={target}>
                      {target}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-semibold text-slate-700">Thời gian gửi</span>
                <select
                  className={inputClass}
                  value={form.sendTime}
                  onChange={(event) => setForm((current) => ({ ...current, sendTime: event.target.value }))}
                >
                  {sendTimeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <NotificationPreview form={form} />
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/80 px-6 py-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={actionLoading}
            className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 active:scale-[0.98]"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={onSaveDraft}
            disabled={actionLoading}
            className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Lưu nháp
          </button>
          <button
            type="button"
            onClick={onSend}
            disabled={actionLoading}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(14,165,233,0.24)] transition hover:bg-sky-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {editingNotification ? <Save className="h-4 w-4" /> : <Send className="h-4 w-4" />}
            {actionLoading ? 'Đang xử lý...' : editingNotification ? 'Lưu thông báo' : 'Gửi thông báo'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function NotificationManagement() {
  const [notifications, setNotifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tất cả');
  const [typeFilter, setTypeFilter] = useState('Tất cả');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNotification, setEditingNotification] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setNotifications(await getAdminNotifications());
    } catch {
      setNotifications([]);
      setError('Không thể tải danh sách thông báo. Vui lòng kiểm tra API backend.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const stats = useMemo(
    () => ({
      total: notifications.length,
      sent: notifications.filter((item) => item.status === 'Đã gửi').length,
      draft: notifications.filter((item) => item.status === 'Nháp').length,
    }),
    [notifications],
  );

  const filteredNotifications = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    return notifications.filter((item) => {
      const matchesSearch =
        !keyword ||
        item.title.toLowerCase().includes(keyword) ||
        item.content.toLowerCase().includes(keyword);
      const matchesStatus = statusFilter === 'Tất cả' || item.status === statusFilter;
      const matchesType = typeFilter === 'Tất cả' || item.type === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [notifications, searchTerm, statusFilter, typeFilter]);

  function openCreateModal() {
    setEditingNotification(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  }

  function openEditModal(notification) {
    setEditingNotification(notification);
    setForm({
      title: notification.title,
      content: notification.content,
      type: notification.type,
      priority: notification.priority,
      target: notification.target,
      sendTime:
        notification.status === 'Nháp'
          ? 'Lưu nháp'
          : notification.status === 'Hẹn lịch'
            ? 'Hẹn lịch'
            : 'Gửi ngay',
    });
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingNotification(null);
    setForm(emptyForm);
  }

  async function upsertNotification(status) {
    const normalized = {
      ...form,
      title: form.title.trim() || 'Thông báo chưa có tiêu đề',
      content: form.content.trim() || 'Nội dung đang được cập nhật.',
    };

    setActionLoading(true);
    setError('');
    try {
      if (editingNotification) {
        const updated = await updateAdminNotification(editingNotification.id, normalized, status);
        setNotifications((current) =>
          current.map((item) => (item.id === editingNotification.id ? updated : item)),
        );
      } else {
        const created = await createAdminNotification(normalized, status);
        setNotifications((current) => [created, ...current]);
      }
      closeModal();
    } catch {
      setError('Không thể lưu thông báo. Vui lòng kiểm tra API backend.');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDelete(id) {
    const shouldDelete = window.confirm('Bạn có chắc muốn xóa thông báo này?');
    if (!shouldDelete) return;

    setActionLoading(true);
    setError('');
    try {
      await deleteAdminNotification(id);
      setNotifications((current) => current.filter((item) => item.id !== id));
    } catch {
      setError('Không thể xóa thông báo. Vui lòng kiểm tra API backend.');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleSend(id) {
    setActionLoading(true);
    setError('');
    try {
      const sent = await sendAdminNotification(id);
      setNotifications((current) => current.map((item) => (item.id === id ? sent : item)));
    } catch {
      setError('Không thể gửi thông báo. Vui lòng kiểm tra API backend.');
    } finally {
      setActionLoading(false);
    }
  }

  function handlePreview(notification) {
    setEditingNotification(notification);
    setForm({
      title: notification.title,
      content: notification.content,
      type: notification.type,
      priority: notification.priority,
      target: notification.target,
      sendTime:
        notification.status === 'Nháp'
          ? 'Lưu nháp'
          : notification.status === 'Hẹn lịch'
            ? 'Hẹn lịch'
            : 'Gửi ngay',
    });
    setIsModalOpen(true);
  }

  return (
    <div className="mx-auto max-w-[1440px] space-y-6">
      <section className="rounded-[28px] border border-white/80 bg-white/90 p-6 shadow-[0_18px_55px_rgba(15,23,42,0.07)] backdrop-blur-xl lg:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-600">Parking Management</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl">
              Quản lý thông báo
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Tạo, chỉnh sửa và gửi thông báo đến người dùng trong hệ thống bãi xe.
            </p>
          </div>
          <button
            type="button"
            onClick={openCreateModal}
            disabled={actionLoading}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(14,165,233,0.24)] transition hover:bg-sky-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
          >
            <Sparkles className="h-4 w-4" />
            Tạo thông báo
          </button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard icon={BellRing} label="Tổng thông báo" value={stats.total} tone="sky" />
        <StatCard icon={CheckCircle2} label="Đã gửi" value={stats.sent} tone="emerald" />
        <StatCard icon={FileText} label="Nháp" value={stats.draft} tone="slate" />
      </section>

      <section className="rounded-[28px] border border-white/80 bg-white p-5 shadow-[0_18px_55px_rgba(15,23,42,0.06)] lg:p-6">
        <div className="grid gap-4 xl:grid-cols-[1.5fr_0.8fr_0.8fr_auto]">
          <label className="space-y-2 text-sm font-semibold text-slate-700">
            <span>Tìm kiếm thông báo</span>
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Tìm theo tiêu đề hoặc nội dung"
                className={`${inputClass} pl-11`}
              />
            </div>
          </label>

          <label className="space-y-2 text-sm font-semibold text-slate-700">
            <span>Trạng thái</span>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className={inputClass}
            >
              {statusFilters.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm font-semibold text-slate-700">
            <span>Loại</span>
            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
              className={inputClass}
            >
              {notificationTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>

          <div className="flex items-end">
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('Tất cả');
                setTypeFilter('Tất cả');
                fetchNotifications();
              }}
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 xl:w-auto"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Làm mới
            </button>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-[28px] border border-white/80 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.06)]">
        <div className="flex flex-col gap-2 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between lg:px-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">Danh sách thông báo</h2>
            <p className="mt-1 text-sm text-slate-500">
              Đang hiển thị {filteredNotifications.length}/{notifications.length} thông báo
            </p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-700">
            <Users className="h-4 w-4" />
            Staff/Admin
          </span>
        </div>

        {error ? (
          <div className="mx-5 mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 lg:mx-6">
            {error}
          </div>
        ) : null}

        <div className="overflow-x-auto">
          <table className="min-w-[1120px] divide-y divide-slate-100 text-left text-sm">
            <thead className="bg-slate-50/80 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              <tr>
                <th className="px-5 py-4">Tiêu đề</th>
                <th className="px-5 py-4">Nội dung ngắn</th>
                <th className="px-5 py-4">Loại</th>
                <th className="px-5 py-4">Đối tượng nhận</th>
                <th className="px-5 py-4">Mức độ</th>
                <th className="px-5 py-4">Trạng thái</th>
                <th className="px-5 py-4">Ngày tạo</th>
                <th className="px-5 py-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-5 py-12 text-center">
                    <div className="mx-auto max-w-sm">
                      <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-sky-50 text-sky-600">
                        <RefreshCw className="h-6 w-6 animate-spin" />
                      </span>
                      <p className="mt-4 text-base font-semibold text-slate-950">Đang tải thông báo</p>
                      <p className="mt-1 text-sm text-slate-500">Dữ liệu đang được lấy từ API backend.</p>
                    </div>
                  </td>
                </tr>
              ) : filteredNotifications.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-5 py-12 text-center">
                    <div className="mx-auto max-w-sm">
                      <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-slate-500">
                        <BellRing className="h-6 w-6" />
                      </span>
                      <p className="mt-4 text-base font-semibold text-slate-950">Không có thông báo phù hợp</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {error ? 'Backend chưa trả dữ liệu thông báo.' : 'Thử đổi từ khóa hoặc xóa bộ lọc hiện tại.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredNotifications.map((notification) => (
                  <tr key={notification.id} className="transition hover:bg-slate-50/80">
                    <td className="max-w-[220px] px-5 py-4">
                      <p className="font-semibold text-slate-950">{notification.title}</p>
                    </td>
                    <td className="max-w-[280px] px-5 py-4 text-slate-600">
                      <p className="line-clamp-2">{notification.content}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${getTypeClasses(notification.type)}`}>
                        {notification.type}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{notification.target}</td>
                    <td className="px-5 py-4">
                      <Badge className={getPriorityClasses(notification.priority)}>{notification.priority}</Badge>
                    </td>
                    <td className="px-5 py-4">
                      <Badge className={getStatusClasses(notification.status)}>{notification.status}</Badge>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-slate-600">{notification.createdAt}</td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <ActionButton icon={Eye} label="Xem" onClick={() => handlePreview(notification)} />
                        <ActionButton icon={Edit3} label="Sửa" onClick={() => openEditModal(notification)} tone="sky" />
                        <ActionButton icon={Send} label="Gửi" onClick={() => handleSend(notification.id)} tone="emerald" />
                        <ActionButton icon={Trash2} label="Xóa" onClick={() => handleDelete(notification.id)} tone="rose" />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {isModalOpen ? (
        <NotificationFormModal
          editingNotification={editingNotification}
          form={form}
          setForm={setForm}
          onClose={closeModal}
          onSaveDraft={() => upsertNotification('Nháp')}
          onSend={() => upsertNotification(resolveStatus(form.sendTime))}
          actionLoading={actionLoading}
        />
      ) : null}
    </div>
  );
}
