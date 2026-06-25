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
  UserRound,
  XCircle,
} from 'lucide-react';
import {
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

function StatusBadge({ status }) {
  const info = getStatusInfo(status);

  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-black ring-1 ${info.badge}`}>
      <span className={`h-2 w-2 rounded-full ${info.dot}`} />
      {info.label}
    </span>
  );
}

function SectionCard({ title, icon: Icon, children, action }) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-sky-50 text-sky-600 ring-1 ring-sky-100">
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

function InfoRow({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 px-4 py-3">
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-sky-600">Package Review</p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">Quản lý đăng ký gói</h1>
          <p className="mt-2 max-w-3xl text-sm font-medium text-slate-500">
            Xét duyệt hồ sơ đăng ký gói gửi xe định kỳ, kiểm tra giấy tờ và kích hoạt gói dịch vụ.
          </p>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row">
          <label className="flex h-12 min-w-[280px] items-center gap-3 rounded-2xl bg-white px-4 shadow-sm ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-sky-200">
            <Search size={18} className="text-slate-400" />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Tìm tên, biển số, tên gói..."
              className="w-full bg-transparent text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400"
            />
          </label>

          <label className="flex h-12 items-center gap-3 rounded-2xl bg-white px-4 shadow-sm ring-1 ring-slate-200">
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
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-white px-5 text-sm font-black text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
          >
            <RefreshCcw size={18} />
            Làm mới
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 rounded-2xl bg-white p-2 shadow-sm ring-1 ring-slate-200">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-black transition ${
              activeTab === tab.key
                ? 'bg-[#DBEAFE] text-[#1D4ED8] shadow-[0_4px_12px_rgba(37,99,235,0.12)] ring-1 ring-[#93C5FD]'
                : 'text-slate-600 hover:bg-[#EFF6FF] hover:text-slate-950'
            }`}
          >
            {tab.label}
            <span className={activeTab === tab.key ? 'rounded-full bg-white px-2 py-0.5 text-xs' : 'rounded-full bg-slate-100 px-2 py-0.5 text-xs'}>
              {counts[tab.key]}
            </span>
          </button>
        ))}
      </div>

      {message && (
        <div className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-bold text-sky-800">
          {message}
        </div>
      )}

      {loading ? (
        <div className="grid min-h-[520px] place-items-center rounded-2xl bg-white text-sm font-black text-slate-500 shadow-sm ring-1 ring-slate-200">
          Đang tải hồ sơ đăng ký...
        </div>
      ) : filteredRecords.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-6 xl:grid-cols-[minmax(360px,35%)_minmax(0,1fr)]">
          <aside className="space-y-3">
            <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-black text-slate-950">Danh sách hồ sơ</h2>
                  <p className="mt-1 text-xs font-semibold text-slate-500">{filteredRecords.length} hồ sơ phù hợp</p>
                </div>
                <PackageCheck className="text-sky-600" size={22} />
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
                    className={`w-full rounded-2xl bg-white p-4 text-left shadow-sm ring-1 transition ${
                      isSelected
                        ? 'ring-2 ring-sky-300 shadow-[0_14px_36px_rgba(14,165,233,0.14)]'
                        : 'ring-slate-200 hover:ring-sky-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-slate-900 text-base font-black text-white">
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

          <section className="min-w-0 space-y-5 pb-28">
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-400">Chi tiết đăng ký</p>
                  <h2 className="mt-2 text-2xl font-black text-slate-950">{selectedRecord.name}</h2>
                  <p className="mt-1 text-sm font-semibold text-slate-500">
                    Hồ sơ #{selectedRecord.id} · {selectedRecord.licensePlate}
                  </p>
                </div>
                <StatusBadge status={selectedRecord.status} />
              </div>
            </div>

            <div className="grid gap-5 2xl:grid-cols-2">
              <SectionCard title="Thông tin người dùng" icon={UserRound}>
                <div className="grid gap-3 md:grid-cols-2">
                  <InfoRow label="Họ tên" value={selectedRecord.name} />
                  <InfoRow label="Email" value={selectedRecord.email} />
                  <InfoRow label="Số điện thoại" value={selectedRecord.phone} />
                  <InfoRow label="Ngày đăng ký" value={formatDateTime(selectedRecord.createdAt)} />
                </div>
              </SectionCard>

              <SectionCard title="Thông tin xe" icon={CarFront}>
                <div className="grid gap-3 md:grid-cols-2">
                  <InfoRow label="Loại xe" value={selectedRecord.vehicleType} />
                  <InfoRow label="Biển số" value={selectedRecord.licensePlate} />
                  <InfoRow label="Màu xe" value={selectedRecord.vehicleColor} />
                  <InfoRow label="Hãng xe" value={selectedRecord.vehicleBrand} />
                </div>
              </SectionCard>
            </div>

            <SectionCard title="Thông tin gói" icon={PackageCheck}>
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
              <SectionCard title="Thông tin thanh toán" icon={CreditCard}>
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
                  <InfoRow label="Mã giao dịch" value={selectedRecord.transactionId} />
                  <InfoRow label="Thời gian thanh toán" value={formatDateTime(selectedRecord.paymentTime)} />
                  <InfoRow label="Phương thức thanh toán" value={selectedRecord.paymentMethod} />
                </div>
              </SectionCard>

              <SectionCard title="Hồ sơ xác thực" icon={FileImage}>
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

              <SectionCard title="Lịch sử xử lý" icon={BadgeCheck}>
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
