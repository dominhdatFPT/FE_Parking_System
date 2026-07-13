import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  BadgeCheck,
  CalendarDays,
  CarFront,
  CheckCircle2,
  Clock3,
  CreditCard,
  DollarSign,
  FileCheck2,
  FileImage,
  Filter,
  Mail,
  PackageCheck,
  RefreshCcw,
  Search,
  ShieldCheck,
  UserRound,
  XCircle,
} from 'lucide-react';
import {
  approveStaffBooking,
  getVehicleRegistrations,
  rejectStaffBooking,
  reviewVehicleRegistration,
} from '../../../services/staffService';
import { VIETNAM_TIME_ZONE } from '../../../utils/dateTime';
import StaffVehicleRegistrationPricing from './StaffVehicleRegistrationPricing';

const statusConfig = {
  PENDING: {
    label: 'Chờ duyệt',
    badge: 'bg-amber-50 text-amber-700 ring-amber-200',
    dot: 'bg-amber-400',
  },
  WAITING_STAFF_APPROVAL: {
    label: 'Chờ duyệt',
    badge: 'bg-amber-50 text-amber-700 ring-amber-200',
    dot: 'bg-amber-400',
  },
  APPROVED: {
    label: 'Đã duyệt',
    badge: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    dot: 'bg-emerald-500',
  },
  APPROVED_WAITING_PAYMENT: {
    label: 'Chờ thanh toán',
    badge: 'bg-sky-50 text-sky-700 ring-sky-200',
    dot: 'bg-sky-500',
  },
  PAID: {
    label: 'Đã thanh toán',
    badge: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    dot: 'bg-emerald-500',
  },
  CONFIRMED: {
    label: 'Đã duyệt',
    badge: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    dot: 'bg-emerald-500',
  },
  REJECTED: {
    label: 'Từ chối',
    badge: 'bg-rose-50 text-rose-700 ring-rose-200',
    dot: 'bg-rose-500',
  },
};

const tabs = [
  { key: 'pending', label: 'Chờ duyệt' },
  { key: 'approved', label: 'Đã duyệt' },
  { key: 'rejected', label: 'Từ chối' },
  { key: 'all', label: 'Tất cả' },
  { key: 'pricing', label: 'Cài đặt giá', Icon: DollarSign, hideCount: true },
];

const formatDate = (value) => {
  if (!value) return 'Chưa có dữ liệu';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Chưa có dữ liệu';

  return new Intl.DateTimeFormat('vi-VN', {
    timeZone: VIETNAM_TIME_ZONE,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
};

const formatDateTime = (value) => {
  if (!value) return 'Chưa có dữ liệu';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Chưa có dữ liệu';

  return new Intl.DateTimeFormat('vi-VN', {
    timeZone: VIETNAM_TIME_ZONE,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const formatCurrency = (value) => {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue) || numericValue <= 0) return 'Chưa có dữ liệu';
  return `${numericValue.toLocaleString('vi-VN')}đ`;
};

const getImageSource = (value) => {
  if (!value) return '';
  if (value.startsWith('data:image')) return value;
  return `data:image/jpeg;base64,${value}`;
};

const getStatusInfo = (status) => statusConfig[status] ?? {
  label: status || 'Chưa có dữ liệu',
  badge: 'bg-slate-100 text-slate-600 ring-slate-200',
  dot: 'bg-slate-400',
};

const getTabKey = (status) => {
  if (['PENDING', 'WAITING_STAFF_APPROVAL'].includes(status)) return 'pending';
  if (['APPROVED', 'APPROVED_WAITING_PAYMENT', 'PAID', 'CONFIRMED'].includes(status)) return 'approved';
  if (status === 'REJECTED') return 'rejected';
  return 'all';
};

const normalizeRegistration = (item) => ({
  source: 'registration',
  id: item.registrationId,
  userId: item.userId,
  name: item.userFullName || item.ekycFullName || `Người dùng #${item.userId || '-'}`,
  email: item.email || '',
  phone: item.phone || '',
  avatarInitial: (item.userFullName || item.ekycFullName || 'U').trim().charAt(0).toUpperCase(),
  licensePlate: item.licensePlate || 'Chưa có biển số',
  vehicleType: item.vehicleTypeName || 'Chưa có dữ liệu',
  vehicleColor: item.color || 'Chưa có dữ liệu',
  vehicleBrand: item.brand || 'Chưa có dữ liệu',
  planName: item.planName || item.packageName || item.subscriptionPlanName || 'Gói gửi xe định kỳ',
  duration: item.duration || item.packageDuration || 'Chưa có dữ liệu',
  price: item.price ?? item.amount ?? item.totalAmount ?? null,
  createdAt: item.createdAt,
  reviewedAt: item.reviewedAt,
  status: item.status || 'PENDING',
  rejectReason: item.rejectReason,
  paymentStatus: item.paymentStatus || 'UNKNOWN',
  transactionId: item.transactionId || '',
  paymentTime: item.paidAt || item.paymentTime || null,
  paymentMethod: item.paymentMethod || '',
  eKyc: {
    fullNameMatch: Boolean(item.ekycFullName),
    cccdValid: Boolean(item.ekycCccdId) && item.ekycIsFake !== true,
    licenseValid: Boolean(item.ekycLicenseNumber),
    plateValid: Boolean(item.licensePlate),
    isValid: item.ekycIsValid,
    isFake: item.ekycIsFake,
    confidence: item.ekycConfidenceScore,
    cccdId: item.ekycCccdId,
    licenseNumber: item.ekycLicenseNumber,
    licenseClass: item.ekycLicenseClass,
  },
  documents: [
    { label: 'CCCD Mặt trước', value: item.cccdFrontImage },
    { label: 'CCCD Mặt sau', value: item.cccdBackImage },
    { label: 'Bằng lái xe', value: item.licenseImage },
    { label: 'Ảnh biển số', value: item.plateImage },
  ].filter((document) => document.value),
});

const normalizeBooking = (item) => ({
  source: 'booking',
  id: item.id,
  userId: item.userId,
  name: item.userFullName || `Người dùng #${item.userId || '-'}`,
  email: '',
  phone: '',
  avatarInitial: (item.userFullName || 'U').trim().charAt(0).toUpperCase(),
  licensePlate: item.licensePlate || item.cardCode || 'Chưa có biển số',
  vehicleType: item.vehicleTypeName || 'Chưa có dữ liệu',
  vehicleColor: 'Chưa có dữ liệu',
  vehicleBrand: 'Chưa có dữ liệu',
  planName: item.planName || 'Gói đặt chỗ định kỳ',
  duration: item.startTime && item.endTime ? `${formatDate(item.startTime)} - ${formatDate(item.endTime)}` : 'Chưa có dữ liệu',
  price: item.totalAmount ?? item.amount ?? item.fee ?? null,
  createdAt: item.createdAt,
  reviewedAt: item.acceptedAt || item.rejectedAt,
  status: item.status || 'PENDING',
  rejectReason: item.staffNote,
  paymentStatus: item.paymentStatus || 'UNKNOWN',
  transactionId: item.transactionId || item.paymentCode || '',
  paymentTime: item.paidAt,
  paymentMethod: item.paymentMethod || '',
  eKyc: {
    fullNameMatch: false,
    cccdValid: false,
    licenseValid: false,
    plateValid: Boolean(item.slotNumber || item.cardCode),
    isValid: null,
    isFake: null,
    confidence: null,
  },
  documents: [],
});

function StatusBadge({ status }) {
  const info = getStatusInfo(status);

  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-black ring-1 ${info.badge}`}>
      <span className={`h-2 w-2 rounded-full ${info.dot}`} />
      {info.label}
    </span>
  );
}

const cardTones = {
  sky: {
    section: 'bg-gradient-to-br from-white via-sky-50/70 to-white ring-sky-100',
    icon: 'bg-sky-100 text-sky-700 ring-sky-200',
    accent: 'border-sky-300',
  },
  indigo: {
    section: 'bg-gradient-to-br from-white via-indigo-50/70 to-white ring-indigo-100',
    icon: 'bg-indigo-100 text-indigo-700 ring-indigo-200',
    accent: 'border-indigo-300',
  },
  emerald: {
    section: 'bg-gradient-to-br from-white via-emerald-50/70 to-white ring-emerald-100',
    icon: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
    accent: 'border-emerald-300',
  },
  amber: {
    section: 'bg-gradient-to-br from-white via-amber-50/70 to-white ring-amber-100',
    icon: 'bg-amber-100 text-amber-700 ring-amber-200',
    accent: 'border-amber-300',
  },
  violet: {
    section: 'bg-gradient-to-br from-white via-violet-50/70 to-white ring-violet-100',
    icon: 'bg-violet-100 text-violet-700 ring-violet-200',
    accent: 'border-violet-300',
  },
  rose: {
    section: 'bg-gradient-to-br from-white via-rose-50/70 to-white ring-rose-100',
    icon: 'bg-rose-100 text-rose-700 ring-rose-200',
    accent: 'border-rose-300',
  },
  slate: {
    section: 'bg-gradient-to-br from-white via-slate-50 to-white ring-slate-200',
    icon: 'bg-slate-100 text-slate-700 ring-slate-200',
    accent: 'border-slate-300',
  },
};

const infoTones = {
  sky: 'bg-sky-50/80 ring-sky-100',
  indigo: 'bg-indigo-50/80 ring-indigo-100',
  emerald: 'bg-emerald-50/80 ring-emerald-100',
  amber: 'bg-amber-50/80 ring-amber-100',
  violet: 'bg-violet-50/80 ring-violet-100',
  slate: 'bg-slate-50 ring-slate-100',
};

function SectionCard({ title, icon: Icon, children, action, tone = 'sky' }) {
  const toneClasses = cardTones[tone] ?? cardTones.sky;

  return (
    <section className={`overflow-hidden rounded-2xl border-l-4 p-5 shadow-sm ring-1 ${toneClasses.section} ${toneClasses.accent}`}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className={`grid h-10 w-10 place-items-center rounded-xl ring-1 ${toneClasses.icon}`}>
            <Icon size={20} />
          </span>
          <h2 className="text-base font-black text-slate-950">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function InfoRow({ label, value, tone = 'slate' }) {
  return (
    <div className={`rounded-xl px-4 py-3 ring-1 ${infoTones[tone] ?? infoTones.slate}`}>
      <p className="text-xs font-black uppercase text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-black text-slate-900">{value || 'Chưa có dữ liệu'}</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="grid min-h-[520px] place-items-center rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
      <div>
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-slate-50 text-slate-400 ring-1 ring-slate-200">
          <FileCheck2 size={30} />
        </div>
        <h2 className="mt-5 text-xl font-black text-slate-950">Không có hồ sơ cần xử lý</h2>
        <p className="mx-auto mt-2 max-w-md text-sm font-medium text-slate-500">
          Tất cả yêu cầu đăng ký đã được xử lý hoặc chưa có hồ sơ mới.
        </p>
      </div>
    </div>
  );
}

export default function StaffBookingReview() {
  const [registrations, setRegistrations] = useState([]);
  const [fallbackBookings, setFallbackBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKey, setSelectedKey] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [previewImage, setPreviewImage] = useState(null);

  const records = useMemo(() => {
    const registrationRecords = registrations.map(normalizeRegistration);
    if (registrationRecords.length > 0) return registrationRecords;
    return fallbackBookings.map(normalizeBooking);
  }, [fallbackBookings, registrations]);

  const counts = useMemo(() => {
    const initialCounts = { pending: 0, approved: 0, rejected: 0, all: records.length };
    records.forEach((record) => {
      const tabKey = getTabKey(record.status);
      if (tabKey !== 'all') initialCounts[tabKey] += 1;
    });
    return initialCounts;
  }, [records]);

  const filteredRecords = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    return records.filter((record) => {
      const matchesTab = activeTab === 'all' || getTabKey(record.status) === activeTab;
      const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
      const matchesKeyword = !keyword
        || [record.name, record.licensePlate, record.planName, record.vehicleType]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(keyword));

      return matchesTab && matchesStatus && matchesKeyword;
    });
  }, [activeTab, records, searchTerm, statusFilter]);

  const selectedRecord = useMemo(() => {
    if (!filteredRecords.length) return null;
    return filteredRecords.find((record) => `${record.source}-${record.id}` === selectedKey) ?? filteredRecords[0];
  }, [filteredRecords, selectedKey]);

  const canReview = selectedRecord && ['PENDING', 'WAITING_STAFF_APPROVAL'].includes(selectedRecord.status);

  const fetchData = async () => {
    setLoading(true);
    setMessage('');
    try {
      const registrationsResult = await getVehicleRegistrations('ALL');
      setRegistrations(registrationsResult);
      setFallbackBookings([]);
    } catch (registrationError) {
      const status = registrationError?.response?.status;
      setRegistrations([]);
      setFallbackBookings([]);

      if (status === 401 || status === 403) {
        setMessage('Tài khoản hiện tại chưa có quyền xem hồ sơ đăng ký gói. Vui lòng đăng xuất và đăng nhập bằng Admin hoặc Staff.');
      } else {
        setMessage(registrationError?.response?.data?.message || 'Không thể tải hồ sơ đăng ký gói. Vui lòng kiểm tra API backend.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!filteredRecords.length) {
      setSelectedKey('');
      return;
    }

    const stillVisible = filteredRecords.some((record) => `${record.source}-${record.id}` === selectedKey);
    if (!stillVisible) {
      const firstRecord = filteredRecords[0];
      setSelectedKey(`${firstRecord.source}-${firstRecord.id}`);
    }
  }, [filteredRecords, selectedKey]);

  useEffect(() => {
    setNote(selectedRecord?.rejectReason || '');
  }, [selectedRecord?.id, selectedRecord?.rejectReason, selectedRecord?.source]);

  const handleDecision = async (decision) => {
    if (!selectedRecord) return;

    if (decision === 'REJECTED' && !note.trim()) {
      setMessage('Vui lòng nhập ghi chú hoặc lý do từ chối trước khi từ chối hồ sơ.');
      return;
    }

    setActionLoading(true);
    setMessage('');
    try {
      if (selectedRecord.source === 'registration') {
        await reviewVehicleRegistration(selectedRecord.id, decision, note.trim());
      } else if (decision === 'APPROVED') {
        await approveStaffBooking(selectedRecord.id, note.trim());
      } else {
        await rejectStaffBooking(selectedRecord.id, note.trim());
      }

      setMessage(decision === 'APPROVED' ? 'Đã duyệt hồ sơ thành công.' : 'Đã từ chối hồ sơ.');
      await fetchData();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Không thể xử lý hồ sơ. Vui lòng thử lại.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="relative space-y-6 overflow-hidden rounded-[28px] bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.22),transparent_34%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.16),transparent_30%),linear-gradient(135deg,#f8fbff_0%,#eef7ff_48%,#f7fff9_100%)] p-4 shadow-[0_24px_70px_rgba(15,23,42,0.08)] ring-1 ring-white/70 sm:p-6">
      <div className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-sm backdrop-blur xl:flex xl:items-end xl:justify-between xl:gap-6">
        <div>
          <p className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-sky-700 ring-1 ring-sky-200">Package Review</p>
          <h1 className="mt-3 text-3xl font-black text-slate-950">Quản lý đăng ký gói</h1>
          <p className="mt-2 max-w-3xl text-sm font-medium text-slate-500">
            Xét duyệt hồ sơ đăng ký gói gửi xe định kỳ, kiểm tra giấy tờ và kích hoạt gói dịch vụ.
          </p>
        </div>

        <div className="mt-5 flex flex-col gap-3 lg:flex-row xl:mt-0">
          {activeTab !== 'pricing' && (
            <>
          <label className="flex h-12 min-w-[280px] items-center gap-3 rounded-2xl bg-white px-4 shadow-sm ring-1 ring-sky-100 focus-within:ring-2 focus-within:ring-sky-300">
            <Search size={18} className="text-slate-400" />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Tìm tên, biển số, tên gói..."
              className="w-full bg-transparent text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400"
            />
          </label>

          <label className="flex h-12 items-center gap-3 rounded-2xl bg-white px-4 shadow-sm ring-1 ring-indigo-100">
            <Filter size={18} className="text-slate-500" />
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="bg-transparent text-sm font-black text-slate-700 outline-none"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="PENDING">Chờ duyệt</option>
              <option value="APPROVED">Đã duyệt</option>
              <option value="REJECTED">Từ chối</option>
            </select>
          </label>

          <button
            type="button"
            onClick={fetchData}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-white px-5 text-sm font-black text-slate-700 shadow-sm ring-1 ring-amber-100 transition hover:bg-amber-50"
          >
            <RefreshCcw size={18} />
            Làm mới
          </button>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 rounded-2xl bg-white/85 p-2 shadow-sm ring-1 ring-white/80 backdrop-blur">
        {tabs.map((tab) => {
          const TabIcon = tab.Icon;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-black transition ${
                activeTab === tab.key
                  ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-[0_8px_20px_rgba(37,99,235,0.22)] ring-1 ring-sky-300'
                  : 'text-slate-600 hover:bg-sky-50 hover:text-slate-950'
              }`}
            >
              {TabIcon ? <TabIcon size={15} /> : null}
              {tab.label}
              {!tab.hideCount && (
                <span className={activeTab === tab.key ? 'rounded-full bg-white px-2 py-0.5 text-xs text-sky-700' : 'rounded-full bg-slate-100 px-2 py-0.5 text-xs'}>
                  {counts[tab.key]}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {activeTab !== 'pricing' && message && (
        <div className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-bold text-sky-800">
          {message}
        </div>
      )}

      {activeTab === 'pricing' ? (
        <StaffVehicleRegistrationPricing />
      ) : loading ? (
        <div className="grid min-h-[520px] place-items-center rounded-2xl bg-white text-sm font-black text-slate-500 shadow-sm ring-1 ring-slate-200">
          Đang tải hồ sơ đăng ký...
        </div>
      ) : filteredRecords.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(340px,31%)]">
          <aside className="space-y-3 xl:order-2">
            <div className="rounded-2xl bg-gradient-to-br from-slate-950 to-sky-900 p-4 text-white shadow-[0_18px_40px_rgba(15,23,42,0.16)] ring-1 ring-sky-200/30">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-black text-white">Danh sách hồ sơ</h2>
                  <p className="mt-1 text-xs font-semibold text-sky-100">{filteredRecords.length} hồ sơ phù hợp</p>
                </div>
                <PackageCheck className="text-sky-200" size={22} />
              </div>
            </div>

            <div className="max-h-[calc(100vh-330px)] space-y-3 overflow-y-auto pr-1">
              {filteredRecords.map((record) => {
                const recordKey = `${record.source}-${record.id}`;
                const isSelected = recordKey === `${selectedRecord?.source}-${selectedRecord?.id}`;

                return (
                  <button
                    key={recordKey}
                    type="button"
                    onClick={() => setSelectedKey(recordKey)}
                    className={`w-full rounded-2xl p-4 text-left shadow-sm ring-1 transition ${
                      isSelected
                        ? 'bg-sky-50 ring-2 ring-sky-300 shadow-[0_14px_36px_rgba(14,165,233,0.16)]'
                        : 'bg-white/90 ring-white/80 hover:bg-white hover:ring-sky-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-base font-black text-white shadow-sm ${
                        isSelected ? 'bg-sky-600' : 'bg-slate-900'
                      }`}>
                        {record.avatarInitial}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="truncate text-sm font-black text-slate-950">{record.name}</h3>
                          <StatusBadge status={record.status} />
                        </div>
                        <div className="mt-3 grid gap-2 text-xs font-bold text-slate-500">
                          <span className="inline-flex items-center gap-2"><CarFront size={14} />{record.licensePlate}</span>
                          <span className="inline-flex items-center gap-2"><PackageCheck size={14} />{record.planName}</span>
                          <span className="inline-flex items-center gap-2"><Clock3 size={14} />{record.duration}</span>
                          <span className="inline-flex items-center gap-2"><CreditCard size={14} />{formatCurrency(record.price)}</span>
                          <span className="inline-flex items-center gap-2"><CalendarDays size={14} />{formatDate(record.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          <section className="min-w-0 space-y-5 pb-28 xl:order-1">
            <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-sky-900 to-emerald-800 p-5 text-white shadow-[0_22px_50px_rgba(15,23,42,0.18)] ring-1 ring-white/30">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.18em] text-sky-100">Chi tiết đăng ký</p>
                  <h2 className="mt-2 text-2xl font-black text-white">{selectedRecord.name}</h2>
                  <p className="mt-1 text-sm font-semibold text-sky-100">
                    Hồ sơ #{selectedRecord.id} · {selectedRecord.licensePlate}
                  </p>
                </div>
                <StatusBadge status={selectedRecord.status} />
              </div>
            </div>

            <div className="grid gap-5 2xl:grid-cols-2">
              <SectionCard title="Thông tin người dùng" icon={UserRound} tone="sky">
                <div className="grid gap-3 md:grid-cols-2">
                  <InfoRow label="Họ tên" value={selectedRecord.name} tone="sky" />
                  <InfoRow label="Email" value={selectedRecord.email} tone="sky" />
                  <InfoRow label="Số điện thoại" value={selectedRecord.phone} tone="sky" />
                  <InfoRow label="Ngày đăng ký" value={formatDateTime(selectedRecord.createdAt)} tone="sky" />
                </div>
              </SectionCard>

              <SectionCard title="Thông tin xe" icon={CarFront} tone="indigo">
                <div className="grid gap-3 md:grid-cols-2">
                  <InfoRow label="Loại xe" value={selectedRecord.vehicleType} tone="indigo" />
                  <InfoRow label="Biển số" value={selectedRecord.licensePlate} tone="indigo" />
                  <InfoRow label="Màu xe" value={selectedRecord.vehicleColor} tone="indigo" />
                  <InfoRow label="Hãng xe" value={selectedRecord.vehicleBrand} tone="indigo" />
                </div>
              </SectionCard>
            </div>

            <SectionCard title="Thông tin gói" icon={PackageCheck} tone="emerald">
              <div className="rounded-2xl bg-gradient-to-br from-sky-50 to-emerald-50 p-5 ring-1 ring-sky-100">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h3 className="text-xl font-black text-slate-950">{selectedRecord.planName}</h3>
                    <p className="mt-1 text-sm font-bold text-slate-500">{selectedRecord.duration}</p>
                  </div>
                  <div className="rounded-2xl bg-white px-5 py-3 text-right shadow-sm ring-1 ring-slate-200">
                    <p className="text-xs font-black uppercase text-slate-400">Giá tiền</p>
                    <p className="mt-1 text-2xl font-black text-slate-950">{formatCurrency(selectedRecord.price)}</p>
                  </div>
                </div>
                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  {['Ra vào không giới hạn', 'Ưu tiên làn thẻ', 'Hỗ trợ khẩn cấp'].map((benefit) => (
                    <div key={benefit} className="flex items-center gap-2 rounded-xl bg-white/80 px-3 py-2 text-sm font-black text-emerald-700 ring-1 ring-emerald-100">
                      <CheckCircle2 size={16} />
                      {benefit}
                    </div>
                  ))}
                </div>
              </div>
            </SectionCard>

            <div className="grid gap-5 2xl:grid-cols-2">
              <SectionCard title="Thông tin thanh toán" icon={CreditCard} tone="amber">
                <div className="mb-4">
                  {selectedRecord.paymentStatus === 'PAID' ? (
                    <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700 ring-1 ring-emerald-200">
                      <CheckCircle2 size={14} />Đã thanh toán
                    </span>
                  ) : selectedRecord.paymentStatus === 'UNKNOWN' ? (
                    <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600 ring-1 ring-slate-200">
                      <Clock3 size={14} />Chưa có dữ liệu thanh toán
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-700 ring-1 ring-amber-200">
                      <Clock3 size={14} />Chờ thanh toán
                    </span>
                  )}
                </div>
                <div className="grid gap-3">
                  <InfoRow label="Mã giao dịch" value={selectedRecord.transactionId} tone="amber" />
                  <InfoRow label="Thời gian thanh toán" value={formatDateTime(selectedRecord.paymentTime)} tone="amber" />
                  <InfoRow label="Phương thức thanh toán" value={selectedRecord.paymentMethod} tone="amber" />
                </div>
              </SectionCard>

              <SectionCard title="Hồ sơ xác thực" icon={FileImage} tone="violet">
                {selectedRecord.documents.length ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {selectedRecord.documents.map((document) => (
                      <button
                        key={document.label}
                        type="button"
                        onClick={() => setPreviewImage({ label: document.label, src: getImageSource(document.value) })}
                        className="group overflow-hidden rounded-2xl bg-slate-50 text-left ring-1 ring-slate-200 transition hover:ring-sky-300"
                      >
                        <div className="aspect-[4/3] bg-slate-100">
                          <img
                            src={getImageSource(document.value)}
                            alt={document.label}
                            className="h-full w-full object-cover transition group-hover:scale-[1.02]"
                          />
                        </div>
                        <div className="px-3 py-2 text-sm font-black text-slate-700">{document.label}</div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl bg-slate-50 p-8 text-center text-sm font-bold text-slate-500 ring-1 ring-slate-200">
                    Chưa có ảnh hồ sơ xác thực từ API.
                  </div>
                )}
              </SectionCard>
            </div>

            <div className="grid gap-5 2xl:grid-cols-[1fr_0.85fr]">
              <SectionCard
                title="Kết quả OCR / eKYC"
                icon={ShieldCheck}
                tone="rose"
                action={
                  selectedRecord.eKyc.confidence ? (
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700 ring-1 ring-emerald-200">
                      Độ tin cậy {Math.round(selectedRecord.eKyc.confidence)}%
                    </span>
                  ) : null
                }
              >
                <div className="grid gap-3 md:grid-cols-2">
                  {[
                    ['Họ tên khớp', selectedRecord.eKyc.fullNameMatch],
                    ['CCCD hợp lệ', selectedRecord.eKyc.cccdValid],
                    ['GPLX hợp lệ', selectedRecord.eKyc.licenseValid],
                    ['Biển số xe hợp lệ', selectedRecord.eKyc.plateValid],
                  ].map(([label, ok]) => (
                    <div
                      key={label}
                      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-black ring-1 ${
                        ok
                          ? 'bg-emerald-50 text-emerald-700 ring-emerald-100'
                          : 'bg-rose-50 text-rose-700 ring-rose-100'
                      }`}
                    >
                      {ok ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
                      {label}
                    </div>
                  ))}
                </div>
                {selectedRecord.eKyc.isFake === true && (
                  <div className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-black text-rose-700 ring-1 ring-rose-100">
                    Hệ thống phát hiện dấu hiệu tài liệu giả mạo.
                  </div>
                )}
              </SectionCard>

              <SectionCard title="Lịch sử xử lý" icon={BadgeCheck} tone="slate">
                <div className="space-y-4">
                  {[
                    { time: selectedRecord.createdAt, label: 'Người dùng gửi hồ sơ', icon: Mail },
                    { time: selectedRecord.paymentTime, label: selectedRecord.paymentStatus === 'PAID' ? 'Thanh toán thành công' : 'Chờ thông tin thanh toán', icon: CreditCard },
                    { time: selectedRecord.reviewedAt || selectedRecord.createdAt, label: getStatusInfo(selectedRecord.status).label, icon: FileCheck2 },
                  ].map((event, index) => {
                    const Icon = event.icon;
                    return (
                      <div key={`${event.label}-${index}`} className="relative flex gap-3">
                        {index < 2 && <span className="absolute left-5 top-10 h-full w-px bg-slate-200" />}
                        <span className="z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-sky-600 ring-1 ring-sky-100">
                          <Icon size={17} />
                        </span>
                        <div>
                          <p className="text-sm font-black text-slate-900">{event.label}</p>
                          <p className="mt-1 text-xs font-bold text-slate-500">{formatDateTime(event.time)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </SectionCard>
            </div>

            <div className="sticky bottom-4 z-10 rounded-2xl bg-white/95 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.14)] ring-1 ring-slate-200 backdrop-blur">
              <div className="grid gap-3 xl:grid-cols-[1fr_auto] xl:items-end">
                <label>
                  <span className="text-xs font-black uppercase text-slate-400">Ghi chú xử lý</span>
                  <textarea
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    placeholder="Nhập ghi chú xét duyệt hoặc lý do từ chối"
                    className="mt-2 min-h-20 w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
                  />
                </label>
                <div className="grid gap-2 sm:grid-cols-2 xl:min-w-[320px]">
                  <button
                    type="button"
                    disabled={!canReview || actionLoading}
                    onClick={() => handleDecision('REJECTED')}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-rose-50 px-5 text-sm font-black text-rose-700 ring-1 ring-rose-200 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <XCircle size={18} />
                    Từ chối
                  </button>
                  <button
                    type="button"
                    disabled={!canReview || actionLoading}
                    onClick={() => handleDecision('APPROVED')}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#2563EB] px-5 text-sm font-black text-white shadow-[0_10px_24px_rgba(37,99,235,0.24)] transition hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <CheckCircle2 size={18} />
                    Duyệt hồ sơ
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {previewImage && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/70 p-6" role="dialog" aria-modal="true">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h2 className="text-base font-black text-slate-950">{previewImage.label}</h2>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="grid h-10 w-10 place-items-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                aria-label="Đóng ảnh xem trước"
              >
                <XCircle size={22} />
              </button>
            </div>
            <div className="max-h-[calc(90vh-73px)] overflow-auto bg-slate-100 p-4">
              <img src={previewImage.src} alt={previewImage.label} className="mx-auto max-h-[75vh] rounded-xl object-contain" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
