import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  BadgeCheck,
  CalendarDays,
  CarFront,
  CheckCircle2,
  Clock3,
  CreditCard,
  FileCheck2,
  FileImage,
  Filter,
  Mail,
  PackageCheck,
  RefreshCcw,
  Search,
  ShieldCheck,
  Trash2,
  UserRound,
  XCircle,
} from 'lucide-react';
import {
  deleteVehicleRegistration,
  getVehicleRegistration,
  getVehicleRegistrations,
  reviewVehicleRegistration,
} from '../../../services/staffService';
import { VIETNAM_TIME_ZONE } from '../../../utils/dateTime';

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
];

const formatDate = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';

  return new Intl.DateTimeFormat('vi-VN', {
    timeZone: VIETNAM_TIME_ZONE,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
};

const formatDateTime = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';

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
  if (!Number.isFinite(numericValue) || numericValue <= 0) return '—';
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
  licensePlate: item.licensePlate || '—',
  vehicleType: item.vehicleTypeName || '—',
  vehicleColor: item.color || '—',
  vehicleBrand: item.brand || '—',
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

function StatusBadge({ status }) {
  const info = getStatusInfo(status);

  return (
    <span className={`inline-flex shrink-0 items-center gap-2 rounded-full px-2.5 py-1 text-[11px] font-black ring-1 ${info.badge}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${info.dot}`} />
      {info.label}
    </span>
  );
}

function SectionCard({ title, icon: Icon, children, action }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-sky-50 text-sky-600 ring-1 ring-sky-100">
            <Icon size={18} />
          </span>
          <h2 className="text-sm font-black text-slate-950">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 px-3 py-2.5">
      <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-0.5 truncate text-sm font-bold text-slate-900">{value || '—'}</p>
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

function EkycSection({ record }) {
  return (
    <SectionCard
      title="Kết quả OCR / eKYC"
      icon={ShieldCheck}
      action={
        record.eKyc.confidence ? (
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200">
            {Math.round(record.eKyc.confidence)}%
          </span>
        ) : null
      }
    >
      <div className="grid grid-cols-2 gap-2">
        {[
          ['Họ tên khớp', record.eKyc.fullNameMatch],
          ['CCCD hợp lệ', record.eKyc.cccdValid],
          ['GPLX hợp lệ', record.eKyc.licenseValid],
          ['Biển số hợp lệ', record.eKyc.plateValid],
        ].map(([label, ok]) => (
          <div
            key={label}
            className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-bold ring-1 ${
              ok ? 'bg-emerald-50 text-emerald-700 ring-emerald-100' : 'bg-rose-50 text-rose-700 ring-rose-100'
            }`}
          >
            {ok ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
            {label}
          </div>
        ))}
      </div>
      {record.eKyc.isFake === true && (
        <div className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 ring-1 ring-rose-100">
          Hệ thống phát hiện tài liệu giả mạo.
        </div>
      )}
    </SectionCard>
  );
}

export default function StaffVehicleRegistrationReview() {
  const [registrations, setRegistrations] = useState([]);
  const [registrationDetails, setRegistrationDetails] = useState({});
  const [activeTab, setActiveTab] = useState('pending');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKey, setSelectedKey] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const records = useMemo(() => registrations.map(normalizeRegistration), [registrations]);

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

  const selectedSummary = useMemo(() => {
    if (!filteredRecords.length) return null;
    return filteredRecords.find((record) => `${record.source}-${record.id}` === selectedKey) ?? filteredRecords[0];
  }, [filteredRecords, selectedKey]);

  const selectedRecord = useMemo(() => {
    if (!selectedSummary) return null;
    if (selectedSummary.source !== 'registration') return selectedSummary;
    const details = registrationDetails[selectedSummary.id];
    return details ? normalizeRegistration(details) : selectedSummary;
  }, [registrationDetails, selectedSummary]);

  const canReview = selectedRecord && ['PENDING', 'WAITING_STAFF_APPROVAL'].includes(selectedRecord.status);

  const fetchData = async () => {
    setLoading(true);
    setMessage('');
    try {
      const registrationsResult = await getVehicleRegistrations('ALL');
      setRegistrations(registrationsResult);
      setRegistrationDetails({});
    } catch (registrationError) {
      const status = registrationError?.response?.status;
      setRegistrations([]);

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
    if (!selectedSummary || selectedSummary.source !== 'registration') return undefined;
    if (registrationDetails[selectedSummary.id]) return undefined;

    let cancelled = false;
    getVehicleRegistration(selectedSummary.id)
      .then((details) => {
        if (cancelled) return;
        setRegistrationDetails((current) => ({
          ...current,
          [selectedSummary.id]: details,
        }));
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [registrationDetails, selectedSummary]);

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
      await reviewVehicleRegistration(selectedRecord.id, decision, note.trim());

      setMessage(decision === 'APPROVED' ? 'Đã duyệt hồ sơ thành công.' : 'Đã từ chối hồ sơ.');
      await fetchData();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Không thể xử lý hồ sơ. Vui lòng thử lại.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedRecord) return;

    setDeleteLoading(true);
    setMessage('');
    try {
      await deleteVehicleRegistration(selectedRecord.id);
      setRegistrations((current) => current.filter(
        (item) => item.registrationId !== selectedRecord.id,
      ));
      setRegistrationDetails((current) => {
        const next = { ...current };
        delete next[selectedRecord.id];
        return next;
      });
      setSelectedKey('');
      setShowDeleteConfirm(false);
      setMessage(`Đã xóa mềm xe ${selectedRecord.licensePlate}.`);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Không thể xóa xe. Vui lòng thử lại.');
      setShowDeleteConfirm(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col gap-3 overflow-hidden">
      {/* ── HEADER: TABS + CONTROLS ── */}
      <div className="flex shrink-0 items-center justify-between gap-3">
        {/* Tabs */}
        <div className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-100/80 p-1 shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-bold transition ${
                activeTab === tab.key
                  ? 'bg-white text-blue-700 shadow-sm ring-1 ring-blue-200'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-black ${activeTab === tab.key ? 'bg-blue-50 text-blue-600' : 'bg-slate-200 text-slate-600'}`}>
                {counts[tab.key]}
              </span>
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <label className="flex h-10 min-w-[220px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 shadow-sm focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100">
            <Search size={15} className="shrink-0 text-slate-400" />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Tìm tên, biển số, tên gói..."
              className="w-full bg-transparent text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400"
            />
          </label>
          <div className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 shadow-sm">
            <Filter size={15} className="shrink-0 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="bg-transparent text-sm font-semibold text-slate-700 outline-none"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="PENDING">Chờ duyệt</option>
              <option value="APPROVED">Đã duyệt</option>
              <option value="REJECTED">Từ chối</option>
            </select>
          </div>
          <button
            type="button"
            onClick={fetchData}
            className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <RefreshCcw size={15} />
            Làm mới
          </button>
        </div>
      </div>

      {/* ── MESSAGE ── */}
      {message && (
        <div className="shrink-0 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-bold text-blue-800">
          {message}
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      {loading ? (
        <div className="flex flex-1 min-h-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-sm font-black text-slate-500 shadow-sm">
          Đang tải hồ sơ đăng ký...
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="flex flex-1 min-h-0 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-slate-50 text-slate-400 ring-1 ring-slate-200">
              <FileCheck2 size={30} />
            </div>
            <h2 className="mt-5 text-xl font-black text-slate-950">Không có hồ sơ cần xử lý</h2>
            <p className="mx-auto mt-2 max-w-md text-sm font-medium text-slate-500">
              Tất cả yêu cầu đăng ký đã được xử lý hoặc chưa có hồ sơ mới.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 min-h-0 flex-row-reverse gap-4 overflow-hidden">

          {/* ── LEFT: LIST ── */}
          <aside className="flex w-[300px] shrink-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-4 py-3">
              <div>
                <h2 className="text-sm font-black text-slate-950">Danh sách hồ sơ</h2>
                <p className="text-xs font-medium text-slate-400">{filteredRecords.length} hồ sơ phù hợp</p>
              </div>
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-blue-50 text-blue-600">
                <PackageCheck size={16} />
              </span>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-2 space-y-1.5">
              {filteredRecords.map((record) => {
                const recordKey = `${record.source}-${record.id}`;
                const isSelected = recordKey === `${selectedRecord?.source}-${selectedRecord?.id}`;
                return (
                  <button
                    key={recordKey}
                    type="button"
                    onClick={() => setSelectedKey(recordKey)}
                    className={`w-full rounded-xl p-3 text-left transition ${
                      isSelected
                        ? 'bg-blue-50 ring-2 ring-blue-300'
                        : 'ring-1 ring-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-blue-600 text-sm font-black text-white">
                        {record.avatarInitial}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-bold text-slate-900">{record.name}</p>
                        <div className="mt-0.5"><StatusBadge status={record.status} /></div>
                        <p className="mt-1 truncate text-[11px] font-semibold text-slate-600">{record.licensePlate}</p>
                        <p className="truncate text-[11px] text-slate-400">{record.planName}</p>
                        <p className="text-[11px] text-slate-400">{formatDate(record.createdAt)}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* ── RIGHT: DETAIL ── */}
          {selectedRecord ? (
            <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">

              {/* Scrollable content */}
              <div className="min-h-0 flex-1 overflow-y-auto p-4 space-y-3">

                {/* DETAIL HEADER */}
                <div className="flex items-start justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-slate-400">Chi tiết đăng ký</p>
                    <h2 className="mt-0.5 text-xl font-black text-slate-950">{selectedRecord.name}</h2>
                    <p className="mt-0.5 text-xs font-medium text-slate-500">
                      Hồ sơ #{selectedRecord.id} · {selectedRecord.licensePlate}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {selectedRecord.status === 'APPROVED' && (
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(true)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-600 ring-1 ring-rose-200 transition hover:bg-rose-100"
                      >
                        <Trash2 size={13} />
                        Xóa xe
                      </button>
                    )}
                    <StatusBadge status={selectedRecord.status} />
                  </div>
                </div>

                <EkycSection record={selectedRecord} />

                {/* USER INFO + VEHICLE INFO */}
                <div className="grid gap-3 xl:grid-cols-2">
                  <SectionCard title="Thông tin người dùng" icon={UserRound}>
                    <div className="grid grid-cols-2 gap-2">
                      <InfoRow label="Họ tên" value={selectedRecord.name} />
                      <InfoRow label="Email" value={selectedRecord.email} />
                      <InfoRow label="Điện thoại" value={selectedRecord.phone} />
                      <InfoRow label="Ngày đăng ký" value={formatDateTime(selectedRecord.createdAt)} />
                    </div>
                  </SectionCard>
                  <SectionCard title="Thông tin xe" icon={CarFront}>
                    <div className="grid grid-cols-2 gap-2">
                      <InfoRow label="Loại xe" value={selectedRecord.vehicleType} />
                      <InfoRow label="Biển số" value={selectedRecord.licensePlate} />
                      <InfoRow label="Màu xe" value={selectedRecord.vehicleColor} />
                      <InfoRow label="Hãng xe" value={selectedRecord.vehicleBrand} />
                    </div>
                  </SectionCard>
                </div>

                {/* PLAN INFO */}
                <SectionCard title="Thông tin gói" icon={PackageCheck}>
                  <div className="rounded-xl bg-gradient-to-br from-sky-50 to-emerald-50 p-4 ring-1 ring-sky-100">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="font-black text-slate-950">{selectedRecord.planName}</h3>
                        <p className="mt-0.5 text-xs font-medium text-slate-500">{selectedRecord.duration}</p>
                      </div>
                      <div className="rounded-xl bg-white px-4 py-2 text-right shadow-sm ring-1 ring-slate-200">
                        <p className="text-[10px] font-black uppercase text-slate-400">Giá</p>
                        <p className="text-lg font-black text-slate-950">{formatCurrency(selectedRecord.price)}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {['Ra vào không giới hạn', 'Ưu tiên làn thẻ', 'Hỗ trợ khẩn cấp'].map((benefit) => (
                        <span key={benefit} className="inline-flex items-center gap-1.5 rounded-lg bg-white/80 px-2.5 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-100">
                          <CheckCircle2 size={13} />
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>
                </SectionCard>

                {/* PAYMENT + DOCUMENTS */}
                <div className="grid gap-3 xl:grid-cols-2">
                  <SectionCard title="Thanh toán" icon={CreditCard}>
                    <div className="mb-3">
                      {selectedRecord.paymentStatus === 'PAID' ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200">
                          <CheckCircle2 size={13} />Đã thanh toán
                        </span>
                      ) : selectedRecord.paymentStatus === 'UNKNOWN' ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 ring-1 ring-slate-200">
                          <Clock3 size={13} />Chưa có dữ liệu
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 ring-1 ring-amber-200">
                          <Clock3 size={13} />Chờ thanh toán
                        </span>
                      )}
                    </div>
                    <div className="grid gap-2">
                      <InfoRow label="Mã giao dịch" value={selectedRecord.transactionId} />
                      <InfoRow label="Thời gian TT" value={formatDateTime(selectedRecord.paymentTime)} />
                      <InfoRow label="Phương thức" value={selectedRecord.paymentMethod} />
                    </div>
                  </SectionCard>

                  <SectionCard title="Hồ sơ xác thực" icon={FileImage}>
                    {selectedRecord.documents.length ? (
                      <div className="grid grid-cols-2 gap-2">
                        {selectedRecord.documents.map((document) => (
                          <button
                            key={document.label}
                            type="button"
                            onClick={() => setPreviewImage({ label: document.label, src: getImageSource(document.value) })}
                            className="group overflow-hidden rounded-xl bg-slate-50 text-left ring-1 ring-slate-200 transition hover:ring-sky-300"
                          >
                            <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                              <img
                                src={getImageSource(document.value)}
                                alt={document.label}
                                className="h-full w-full object-cover transition group-hover:scale-105"
                              />
                            </div>
                            <div className="px-2 py-1.5 text-[11px] font-bold text-slate-600">{document.label}</div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-xl bg-slate-50 py-6 text-center text-xs font-bold text-slate-400 ring-1 ring-slate-200">
                        Chưa có ảnh xác thực.
                      </div>
                    )}
                  </SectionCard>
                </div>

                {/* HISTORY */}
                <div>
                  <SectionCard title="Lịch sử xử lý" icon={BadgeCheck}>
                    <div className="space-y-3">
                      {[
                        { time: selectedRecord.createdAt, label: 'Người dùng gửi hồ sơ', icon: Mail },
                        { time: selectedRecord.paymentTime, label: selectedRecord.paymentStatus === 'PAID' ? 'Thanh toán thành công' : 'Chờ thông tin thanh toán', icon: CreditCard },
                        { time: selectedRecord.reviewedAt || selectedRecord.createdAt, label: getStatusInfo(selectedRecord.status).label, icon: FileCheck2 },
                      ].map((event, index) => {
                        const Icon = event.icon;
                        return (
                          <div key={`${event.label}-${index}`} className="relative flex items-start gap-3">
                            {index < 2 && <span className="absolute left-4 top-9 h-full w-px bg-slate-200" />}
                            <span className="z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-blue-600 ring-1 ring-sky-100">
                              <Icon size={15} />
                            </span>
                            <div>
                              <p className="text-xs font-bold text-slate-900">{event.label}</p>
                              <p className="text-[11px] font-medium text-slate-400">{formatDateTime(event.time)}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </SectionCard>
                </div>

              </div>

              {/* ── STICKY ACTION BAR ── */}
              <div className="shrink-0 border-t border-slate-200 bg-white/95 p-4 backdrop-blur-sm">
                <div className="flex items-end gap-3">
                  <label className="flex-1">
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">Ghi chú xử lý</span>
                    <textarea
                      value={note}
                      onChange={(event) => setNote(event.target.value)}
                      placeholder="Nhập ghi chú hoặc lý do từ chối..."
                      rows={2}
                      className="mt-1.5 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-800 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100 placeholder:text-slate-400"
                    />
                  </label>
                  <div className="flex shrink-0 flex-col gap-2">
                    <button
                      type="button"
                      disabled={!canReview || actionLoading}
                      onClick={() => handleDecision('APPROVED')}
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {actionLoading ? (
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      ) : (
                        <CheckCircle2 size={16} />
                      )}
                      Duyệt hồ sơ
                    </button>
                    <button
                      type="button"
                      disabled={!canReview || actionLoading}
                      onClick={() => handleDecision('REJECTED')}
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 text-sm font-bold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <XCircle size={16} />
                      Từ chối
                    </button>
                  </div>
                </div>
              </div>

            </div>
          ) : null}
        </div>
      )}

      {/* ── IMAGE PREVIEW MODAL ── */}
      {previewImage && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-6 backdrop-blur-sm" role="dialog" aria-modal="true">
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

      {/* ── DELETE CONFIRM MODAL ── */}
      {showDeleteConfirm && selectedRecord && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-6 backdrop-blur-sm" role="dialog" aria-modal="true">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="px-6 pt-6 text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-rose-50 text-rose-600 ring-1 ring-rose-200">
                <Trash2 size={26} />
              </div>
              <h2 className="mt-4 text-lg font-black text-slate-950">Xác nhận xóa xe</h2>
              <p className="mt-3 text-sm font-semibold text-slate-600">
                Xe <span className="font-black text-slate-900">{selectedRecord.licensePlate}</span> sẽ
                được xóa mềm và không còn xuất hiện trong danh sách hoạt động.
              </p>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
              <button
                type="button"
                disabled={deleteLoading}
                onClick={() => setShowDeleteConfirm(false)}
                className="h-11 rounded-2xl bg-white text-sm font-black text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-100 disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                type="button"
                disabled={deleteLoading}
                onClick={handleDelete}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-rose-600 text-sm font-black text-white transition hover:bg-rose-700 disabled:opacity-60"
              >
                {deleteLoading ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                ) : (
                  <Trash2 size={16} />
                )}
                {deleteLoading ? 'Đang xóa...' : 'Xác nhận xóa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

