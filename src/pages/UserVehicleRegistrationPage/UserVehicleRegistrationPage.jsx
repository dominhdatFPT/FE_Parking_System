import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  CarFront,
  CheckCircle2,
  FileImage,
  LockKeyhole,
  RefreshCcw,
  Search,
  UserRound,
  X,
} from 'lucide-react';
import { getAccountUsers } from '../../services/accountApi';
import { apiClient } from '../../services/apiClient';
import { API_ENDPOINTS } from '../../services/endpoints';
import { createVehicleRegistrationForUser } from '../../services/backOfficeVehicleRegistrationService';

const VEHICLE_TYPES = [
  { code: 'MOTORBIKE', id: 1, label: 'Xe máy' },
  { code: 'CAR', id: 2, label: 'Ô tô' },
];

const emptyFiles = {
  cccdFrontImage: null,
  cccdBackImage: null,
  licenseImage: null,
  vehicleDocumentImage: null,
  plateImage: null,
};

const documentFields = [
  { key: 'cccdFrontImage', label: 'Mặt trước CCCD', required: true },
  { key: 'cccdBackImage', label: 'Mặt sau CCCD', required: true },
  { key: 'licenseImage', label: 'Bằng lái xe', required: true },
  { key: 'vehicleDocumentImage', label: 'Giấy đăng ký xe', required: true },
  { key: 'plateImage', label: 'Ảnh biển số xe', required: false },
];

function extractList(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.content)) return response.content;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.items)) return response.items;
  return [];
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function normalizeUser(item) {
  return {
    userId: item.userId ?? item.id,
    fullName: item.fullName || item.name || 'Người dùng',
    email: item.email || '',
    phone: item.phone || '',
    status: item.status || 'UNKNOWN',
    role: item.role || 'USER',
    createdAt: item.createdAt,
  };
}

function formatDate(value) {
  if (!value) return 'Chưa có';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Chưa có';
  return new Intl.DateTimeFormat('vi-VN').format(date);
}

function formatMoney(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 'Chưa có giá';
  return `${number.toLocaleString('vi-VN')} đ`;
}

export default function UserVehicleRegistrationPage() {
  const [users, setUsers] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  const [vehicleType, setVehicleType] = useState('MOTORBIKE');
  const [licensePlate, setLicensePlate] = useState('');
  const [files, setFiles] = useState(emptyFiles);
  const [feePackages, setFeePackages] = useState([]);
  const [selectedFeePackageId, setSelectedFeePackageId] = useState('');
  const [loadingPackages, setLoadingPackages] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const vehicleTypeId = useMemo(
    () => VEHICLE_TYPES.find((type) => type.code === vehicleType)?.id ?? 1,
    [vehicleType],
  );

  const selectedPackage = feePackages.find((item) => String(item.id) === String(selectedFeePackageId));

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await getAccountUsers({ keyword, page: 0, size: 80 });
      setUsers(extractList(response).map(normalizeUser));
    } catch (error) {
      setUsers([]);
      setMessage(error?.response?.data?.message || 'Không thể tải danh sách user.');
    } finally {
      setLoading(false);
    }
  }, [keyword]);

  const fetchFeePackages = useCallback(async () => {
    setLoadingPackages(true);
    setSelectedFeePackageId('');
    try {
      const response = await apiClient.get(API_ENDPOINTS.FEE.PACKAGES, {
        params: { vehicleTypeId },
      });
      setFeePackages(response.data?.data ?? []);
    } catch {
      setFeePackages([]);
    } finally {
      setLoadingPackages(false);
    }
  }, [vehicleTypeId]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (selectedUser) fetchFeePackages();
  }, [fetchFeePackages, selectedUser]);

  function openRegistrationModal(user) {
    setSelectedUser(user);
    setVehicleType('MOTORBIKE');
    setLicensePlate('');
    setFiles(emptyFiles);
    setSelectedFeePackageId('');
    setFormError('');
  }

  function closeRegistrationModal() {
    if (submitting) return;
    setSelectedUser(null);
    setFormError('');
  }

  function handleFileChange(key, event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setFormError('Chỉ chấp nhận file ảnh cho eKYC.');
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setFormError('Mỗi ảnh không được vượt quá 4 MB.');
      return;
    }
    setFormError('');
    setFiles((current) => ({ ...current, [key]: file }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!selectedUser) return;

    const missingDocument = documentFields.find((field) => field.required && !files[field.key]);
    if (missingDocument) {
      setFormError(`Vui lòng tải lên ${missingDocument.label}.`);
      return;
    }
    if (!licensePlate.trim()) {
      setFormError('Vui lòng nhập biển số xe.');
      return;
    }

    setSubmitting(true);
    setFormError('');
    try {
      const payload = {
        vehicleTypeId,
        requestedFeePackageId: selectedFeePackageId ? Number(selectedFeePackageId) : null,
        licensePlate: licensePlate.trim().toUpperCase(),
        cccdFrontImage: await fileToBase64(files.cccdFrontImage),
        cccdBackImage: await fileToBase64(files.cccdBackImage),
        licenseImage: await fileToBase64(files.licenseImage),
        vehicleDocumentImage: await fileToBase64(files.vehicleDocumentImage),
        plateImage: files.plateImage ? await fileToBase64(files.plateImage) : null,
      };

      await createVehicleRegistrationForUser(selectedUser.userId, payload);
      setMessage(
        selectedFeePackageId
          ? `Đã tạo hồ sơ cho ${selectedUser.fullName}. Khi hồ sơ được duyệt, khoản thanh toán sẽ nằm ở tài khoản user này.`
          : `Đã tạo hồ sơ đăng ký xe cho ${selectedUser.fullName}.`,
      );
      closeRegistrationModal();
    } catch (error) {
      setFormError(error?.response?.data?.message || 'Không thể tạo hồ sơ đăng ký xe.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-sky-600">Back-office Vehicle Registration</p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">Đăng ký xe cho user</h1>
          <p className="mt-2 max-w-3xl text-sm font-medium text-slate-500">
            Admin hoặc staff chọn user, upload hồ sơ eKYC và tạo đăng ký xe cho đúng tài khoản user đó.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="flex h-12 min-w-[280px] items-center gap-3 rounded-2xl bg-white px-4 shadow-sm ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-sky-200">
            <Search size={18} className="text-slate-400" />
            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Tìm tên, email, số điện thoại..."
              className="w-full bg-transparent text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400"
            />
          </label>
          <button
            type="button"
            onClick={fetchUsers}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-white px-5 text-sm font-black text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
          >
            <RefreshCcw size={18} />
            Làm mới
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
        Mật khẩu thật không thể hiển thị vì hệ thống chỉ lưu mật khẩu đã mã hóa. Staff/Admin chỉ có thể xem thông tin tài khoản và thao tác nghiệp vụ.
      </div>

      {message && (
        <div className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-bold text-sky-800">
          {message}
        </div>
      )}

      <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <div className="grid grid-cols-[1.5fr_1.4fr_1fr_1fr_auto] gap-4 border-b border-slate-100 bg-slate-50 px-5 py-3 text-xs font-black uppercase text-slate-500">
          <span>User</span>
          <span>Liên hệ</span>
          <span>Mật khẩu</span>
          <span>Trạng thái</span>
          <span>Thao tác</span>
        </div>

        {loading ? (
          <div className="grid min-h-48 place-items-center text-sm font-bold text-slate-500">Đang tải danh sách user...</div>
        ) : users.length === 0 ? (
          <div className="grid min-h-48 place-items-center text-center">
            <div>
              <UserRound className="mx-auto h-10 w-10 text-slate-300" />
              <p className="mt-3 text-sm font-bold text-slate-500">Không tìm thấy user phù hợp.</p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {users.map((user) => (
              <div key={user.userId} className="grid grid-cols-[1.5fr_1.4fr_1fr_1fr_auto] items-center gap-4 px-5 py-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-black text-slate-950">{user.fullName}</p>
                  <p className="mt-1 text-xs font-semibold text-slate-400">ID #{user.userId} · Tạo ngày {formatDate(user.createdAt)}</p>
                </div>
                <div className="min-w-0 text-sm">
                  <p className="truncate font-bold text-slate-700">{user.email || 'Chưa có email'}</p>
                  <p className="mt-1 text-xs font-semibold text-slate-400">{user.phone || 'Chưa có số điện thoại'}</p>
                </div>
                <div className="inline-flex w-fit items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                  <LockKeyhole size={14} />
                  Đã mã hóa
                </div>
                <div>
                  <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700 ring-1 ring-emerald-200">
                    {user.status}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => openRegistrationModal(user)}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 text-sm font-black text-white shadow-sm shadow-sky-600/20 transition hover:bg-sky-700"
                >
                  <CarFront size={17} />
                  Đăng ký xe
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {selectedUser && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/70 p-4" role="dialog" aria-modal="true">
          <div className="max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-600">Tạo hồ sơ cho user</p>
                <h2 className="mt-1 text-xl font-black text-slate-950">{selectedUser.fullName}</h2>
                <p className="mt-1 text-sm font-semibold text-slate-500">{selectedUser.email || selectedUser.phone}</p>
              </div>
              <button
                type="button"
                onClick={closeRegistrationModal}
                className="grid h-10 w-10 place-items-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="max-h-[calc(92vh-93px)] overflow-y-auto p-6">
              <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
                <div className="space-y-5">
                  <section className="rounded-2xl border border-slate-200 p-5">
                    <h3 className="text-sm font-black text-slate-950">Thông tin xe</h3>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      {VEHICLE_TYPES.map((type) => (
                        <button
                          key={type.code}
                          type="button"
                          onClick={() => setVehicleType(type.code)}
                          className={`rounded-2xl border px-4 py-3 text-left text-sm font-black transition ${
                            vehicleType === type.code
                              ? 'border-sky-400 bg-sky-50 text-sky-700 ring-2 ring-sky-100'
                              : 'border-slate-200 bg-white text-slate-600 hover:border-sky-200'
                          }`}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>

                    <label className="mt-4 block">
                      <span className="text-xs font-black uppercase text-slate-500">Biển số xe</span>
                      <input
                        value={licensePlate}
                        onChange={(event) => setLicensePlate(event.target.value.toUpperCase())}
                        placeholder="VD: 59A12345"
                        className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm font-black uppercase text-slate-800 outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                      />
                    </label>
                  </section>

                  <section className="rounded-2xl border border-slate-200 p-5">
                    <h3 className="text-sm font-black text-slate-950">Hồ sơ eKYC</h3>
                    <p className="mt-1 text-xs font-semibold text-slate-500">
                      Các ảnh này sẽ được gửi qua cùng luồng OCR/eKYC như user tự đăng ký.
                    </p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {documentFields.map((field) => (
                        <label
                          key={field.key}
                          className="relative flex min-h-24 cursor-pointer flex-col justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 transition hover:border-sky-300 hover:bg-sky-50/50"
                        >
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="absolute inset-0 cursor-pointer opacity-0"
                            onChange={(event) => handleFileChange(field.key, event)}
                          />
                          <div className="flex items-center gap-3">
                            <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-sky-600 ring-1 ring-slate-200">
                              {files[field.key] ? <CheckCircle2 size={20} /> : <FileImage size={20} />}
                            </span>
                            <div className="min-w-0">
                              <p className="text-sm font-black text-slate-800">
                                {field.label}{field.required ? ' *' : ''}
                              </p>
                              <p className="mt-1 truncate text-xs font-semibold text-slate-400">
                                {files[field.key]?.name || 'Chọn ảnh từ máy'}
                              </p>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </section>
                </div>

                <aside className="space-y-5">
                  <section className="rounded-2xl border border-sky-100 bg-sky-50/40 p-5">
                    <h3 className="text-sm font-black text-slate-950">Biểu phí xe</h3>
                    <p className="mt-1 text-xs font-semibold text-slate-500">
                      Không bắt buộc. Nếu chọn, sau khi duyệt hồ sơ hệ thống sẽ tạo khoản chờ thanh toán cho user này.
                    </p>

                    <div className="mt-4 space-y-3">
                      <label className="block">
                        <span className="text-xs font-black uppercase text-slate-500">Chọn gói</span>
                        <select
                          value={selectedFeePackageId}
                          onChange={(event) => setSelectedFeePackageId(event.target.value)}
                          disabled={loadingPackages}
                          className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-800 outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                        >
                          <option value="">Không chọn biểu phí</option>
                          {feePackages.map((pkg) => (
                            <option key={pkg.id} value={pkg.id}>
                              {pkg.name} · {pkg.durationMonths} tháng · {formatMoney(pkg.currentPrice ?? pkg.price)}
                            </option>
                          ))}
                        </select>
                      </label>

                      {selectedPackage && (
                        <div className="rounded-2xl bg-white p-4 text-sm ring-1 ring-sky-100">
                          <div className="flex items-center justify-between gap-3">
                            <span className="font-bold text-slate-500">Gói đã chọn</span>
                            <span className="font-black text-slate-950">{selectedPackage.name}</span>
                          </div>
                          <div className="mt-2 flex items-center justify-between gap-3">
                            <span className="font-bold text-slate-500">Số tiền</span>
                            <span className="font-black text-sky-700">
                              {formatMoney(selectedPackage.currentPrice ?? selectedPackage.price)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </section>

                  <section className="rounded-2xl border border-slate-200 p-5">
                    <h3 className="text-sm font-black text-slate-950">Tóm tắt</h3>
                    <dl className="mt-4 space-y-3 text-sm">
                      <div className="flex justify-between gap-4">
                        <dt className="font-bold text-slate-500">User</dt>
                        <dd className="text-right font-black text-slate-900">{selectedUser.fullName}</dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="font-bold text-slate-500">Loại xe</dt>
                        <dd className="font-black text-slate-900">
                          {VEHICLE_TYPES.find((type) => type.code === vehicleType)?.label}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="font-bold text-slate-500">Biển số</dt>
                        <dd className="font-black uppercase text-slate-900">{licensePlate || 'Chưa nhập'}</dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="font-bold text-slate-500">Ảnh bắt buộc</dt>
                        <dd className="font-black text-slate-900">
                          {documentFields.filter((field) => field.required && files[field.key]).length}/4
                        </dd>
                      </div>
                    </dl>
                  </section>
                </aside>
              </div>

              {formError && (
                <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
                  {formError}
                </div>
              )}

              <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeRegistrationModal}
                  disabled={submitting}
                  className="h-12 rounded-2xl bg-slate-100 px-5 text-sm font-black text-slate-700 transition hover:bg-slate-200 disabled:opacity-60"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-sky-600 px-6 text-sm font-black text-white shadow-sm shadow-sky-600/20 transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? 'Đang tạo hồ sơ...' : 'Tạo đăng ký xe'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

