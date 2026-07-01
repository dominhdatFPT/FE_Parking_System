import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Search,
  Lock,
  Unlock,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Shield,
  Loader2,
  UserCheck,
  UserX,
  UserPlus,
  CheckCircle2,
  XCircle,
  Mail,
  Phone,
  User,
  Eye,
  EyeOff,
  X,
  AlertCircle,
} from 'lucide-react';
import {
  getAccountUsers,
  getAccountEmployees,
  toggleUserStatus,
  changeUserRole,
  createAccountUser,
} from '../../services/accountApi';
import { formatVietnamDate } from '../../utils/dateTime';
import { useAuth } from '../../contexts/useAuth';

// Color palette helper for initials avatar
const AVATAR_COLORS = [
  'bg-emerald-100 text-emerald-700 border-emerald-200',
  'bg-blue-100 text-blue-700 border-blue-200',
  'bg-purple-100 text-purple-700 border-purple-200',
  'bg-amber-100 text-amber-700 border-amber-200',
  'bg-rose-100 text-rose-700 border-rose-200',
  'bg-cyan-100 text-cyan-700 border-cyan-200',
  'bg-indigo-100 text-indigo-700 border-indigo-200',
  'bg-teal-100 text-teal-700 border-teal-200',
];

const getAvatarStyle = (str = '') => {
  let sum = 0;
  for (let i = 0; i < str.length; i++) {
    sum += str.charCodeAt(i);
  }
  return AVATAR_COLORS[sum % AVATAR_COLORS.length];
};

const getInitials = (name = '') => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'U';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const PAGE_SIZE = 10;

const mapStatusToView = (status = '') => {
  const value = String(status).toUpperCase();
  if (value === 'ACTIVE' || value === 'HOAT_DONG') return 'Hoạt động';
  if (value === 'LOCKED' || value === 'INACTIVE' || value === 'BLOCKED' || value === 'BI_KHOA') return 'Bị khóa';
  return 'Hoạt động';
};

const mapStatusToApi = (status = '') => {
  if (status === 'Hoạt động') return 'ACTIVE';
  if (status === 'Bị khóa') return 'INACTIVE';
  return '';
};

const mapRoleToView = (role = '') => {
  const value = String(role).toUpperCase();
  if (value === 'ADMIN') return 'Admin';
  if (value === 'STAFF') return 'Staff';
  return 'User';
};

const mapRoleToApi = (role = '') => {
  if (role === 'Admin') return 'ADMIN';
  if (role === 'Staff') return 'STAFF';
  return String(role || '').toUpperCase();
};

const formatDate = (value) => formatVietnamDate(value) || (value ? String(value) : '');

const buildStaffCode = (userId) => {
  if (userId === null || userId === undefined) return 'STF---';
  return `STF${String(userId).padStart(3, '0')}`;
};

const extractList = (payload) => {
  if (!payload) return [];
  if (Array.isArray(payload?.content)) return payload.content;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload)) return payload;
  return [];
};

const extractTotalElements = (payload) => {
  if (!payload) return 0;
  if (typeof payload.totalElements === 'number') return payload.totalElements;
  if (typeof payload.total === 'number') return payload.total;
  if (Array.isArray(payload?.content)) return payload.content.length;
  if (Array.isArray(payload?.items)) return payload.items.length;
  if (Array.isArray(payload)) return payload.length;
  return 0;
};

const extractTotalPages = (payload, totalElements) => {
  if (!payload) return 1;
  if (typeof payload.totalPages === 'number') return payload.totalPages;
  if (typeof payload.totalPages === 'number' && payload.totalPages > 0) return payload.totalPages;
  return Math.max(1, Math.ceil((totalElements || 0) / PAGE_SIZE));
};

const extractPageNumber = (payload) => {
  if (typeof payload?.number === 'number') return payload.number;
  if (typeof payload?.page === 'number') return payload.page;
  return 0;
};

const normalizeAccount = (item) => {
  const rawStatus = item.status ?? item.accountStatus ?? 'ACTIVE';
  const rawRole = item.role ?? 'USER';
  const rawPayment = item.paymentStatus ?? item.payment_status ?? item.isPaid ?? null;
  const isPaid = rawPayment === 'PAID' || rawPayment === true || String(rawPayment).toUpperCase() === 'PAID';
  return {
    id: item.userId ?? item.id,
    userId: item.userId ?? item.id,
    name: item.fullName ?? item.name ?? '',
    email: item.email ?? '',
    phone: item.phone ?? '',
    avatarUrl: item.avatarUrl ?? item.avatar ?? '',
    role: mapRoleToView(rawRole),
    roleApi: String(rawRole).toUpperCase(),
    status: mapStatusToView(rawStatus),
    statusApi: String(rawStatus).toUpperCase(),
    createdAt: formatDate(item.createdAt ?? item.createdDate ?? item.created_at),
    paid: rawPayment === null ? null : isPaid,
  };
};

function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return undefined;
    const timeout = window.setTimeout(() => onClose(), 3000);
    return () => window.clearTimeout(timeout);
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const Icon = isSuccess ? CheckCircle2 : XCircle;
  const colorClasses = isSuccess
    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
    : 'border-red-200 bg-red-50 text-red-700';

  return (
    <div
      role="status"
      className={`pointer-events-none fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border px-5 py-3.5 text-sm font-semibold shadow-2xl backdrop-blur-md ${colorClasses}`}
    >
      <Icon size={18} />
      <span>{toast.message}</span>
    </div>
  );
}

function TableSkeleton({ columns = 5 }) {
  return (
    <tbody className="divide-y divide-slate-100">
      {Array.from({ length: 6 }).map((_, idx) => (
        <tr key={idx} className="animate-pulse">
          {Array.from({ length: columns }).map((__, colIdx) => (
            <td key={colIdx} className="px-6 py-4">
              <div className="h-3.5 w-3/4 rounded-full bg-slate-200" />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}

export default function AccountManagementPage() {
  // Tab & filter state
  const [activeTab, setActiveTab] = useState('users'); // 'users' or 'staff'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'Hoạt động', 'Bị khóa'
  const [roleFilter, setRoleFilter] = useState('all'); // 'all', 'Admin', 'Staff'

  // Data state
  const [accounts, setAccounts] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1); // 1-indexed for UI
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Dialog state
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [showRolePicker, setShowRolePicker] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [pendingRoleChange, setPendingRoleChange] = useState('');

  // Create account dialog state
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');
  const [createErrors, setCreateErrors] = useState({});
  const [showCreatePassword, setShowCreatePassword] = useState(false);
  const [createForm, setCreateForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    role: 'USER',
  });
  const fullNameInputRef = useRef(null);

  // Toast state
  const [toast, setToast] = useState(null);

  // Current user's role
  const { role: currentRole } = useAuth();
  const normalizedRole = String(currentRole || '').toUpperCase();
  const isAdmin = normalizedRole === 'ADMIN';

  const showToast = useCallback((type, message) => {
    setToast({ type, message });
  }, []);

  const closeToast = useCallback(() => setToast(null), []);

  // Handle API errors uniformly
  const handleApiError = useCallback((error) => {
    const status = error?.response?.status;
    if (status === 403) {
      showToast('error', 'Chỉ Admin mới có quyền sử dụng');
      return;
    }
    if (status === 401) {
      // apiClient interceptor already redirects to /login
      return;
    }
    const message = error?.response?.data?.message
      || error?.message
      || 'Đã xảy ra lỗi. Vui lòng thử lại.';
    showToast('error', message);
  }, [showToast]);

  // Fetch list (users or staff)
  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage - 1,
        size: PAGE_SIZE,
        keyword: searchQuery.trim() || undefined,
      };

      let response;
      if (activeTab === 'users') {
        params.status = statusFilter !== 'all' ? mapStatusToApi(statusFilter) : undefined;
        response = await getAccountUsers(params);
      } else {
        params.role = roleFilter !== 'all' ? mapRoleToApi(roleFilter) : undefined;
        params.status = statusFilter !== 'all' ? mapStatusToApi(statusFilter) : undefined;
        response = await getAccountEmployees(params);
      }

      const list = extractList(response).map(normalizeAccount);
      const total = extractTotalElements(response);
      const pages = extractTotalPages(response, total);
      const serverPage = extractPageNumber(response);

      setAccounts(list);
      setTotalElements(total);
      setTotalPages(Math.max(1, pages));

      // Sync local page with server page (e.g. when results shrink)
      const localPage = serverPage + 1;
      if (localPage !== currentPage && localPage >= 1 && localPage <= Math.max(1, pages)) {
        setCurrentPage(localPage);
      }
    } catch (error) {
      setAccounts([]);
      setTotalElements(0);
      setTotalPages(1);
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  }, [activeTab, currentPage, searchQuery, statusFilter, roleFilter, handleApiError]);

  // Trigger fetch whenever dependencies change
  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  // Tab switch: reset filters & page
  const handleTabChange = (tab) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    setSearchQuery('');
    setStatusFilter('all');
    setRoleFilter('all');
    setCurrentPage(1);
    setAccounts([]);
  };

  // Pagination
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Open Block / Activate dialog
  const openBlockConfirmation = (account) => {
    setSelectedAccount(account);
    setShowBlockDialog(true);
  };

  // Toggle user / staff status
  const confirmToggleStatus = async () => {
    if (!selectedAccount) return;
    setActionLoading(true);
    try {
      await toggleUserStatus(selectedAccount.userId);
      showToast('success', 'Cập nhật trạng thái thành công');
      setShowBlockDialog(false);
      setSelectedAccount(null);
      await fetchAccounts();
    } catch (error) {
      handleApiError(error);
    } finally {
      setActionLoading(false);
    }
  };

  // Open role picker for users tab
  const openRolePicker = (user) => {
    setSelectedAccount(user);
    setShowRolePicker(true);
  };

  // Open role change dialog
  const handleRoleChangeDropdown = (member, newRoleValue) => {
    setSelectedAccount(member);
    setPendingRoleChange(newRoleValue);
    setShowRoleDialog(true);
  };

  // Confirm role change
  const confirmRoleChange = async () => {
    if (!selectedAccount || !pendingRoleChange) return;
    setActionLoading(true);
    try {
      const apiRole = mapRoleToApi(pendingRoleChange);
      await changeUserRole(selectedAccount.userId, apiRole);
      showToast('success', 'Đổi role thành công');
      setShowRoleDialog(false);
      setSelectedAccount(null);
      setPendingRoleChange('');
      await fetchAccounts();
    } catch (error) {
      handleApiError(error);
    } finally {
      setActionLoading(false);
    }
  };

  // ====== Create account handlers ======
  const resetCreateForm = useCallback(() => {
    setCreateForm({ fullName: '', email: '', phone: '', password: '', role: 'USER' });
    setCreateErrors({});
    setCreateError('');
    setShowCreatePassword(false);
  }, []);

  const openCreateDialog = useCallback(() => {
    resetCreateForm();
    setShowCreateDialog(true);
  }, [resetCreateForm]);

  const closeCreateDialog = useCallback(() => {
    if (createLoading) return;
    setShowCreateDialog(false);
    resetCreateForm();
  }, [createLoading, resetCreateForm]);

  const handleCreateChange = useCallback(
    (field) => (e) => {
      const value = e.target.value;
      setCreateForm((prev) => ({ ...prev, [field]: value }));
      setCreateErrors((prev) => {
        if (!prev[field]) return prev;
        const next = { ...prev };
        delete next[field];
        return next;
      });
      if (createError) setCreateError('');
    },
    [createError]
  );

  const validateCreateForm = (form) => {
    const errors = {};
    if (!form.fullName.trim()) {
      errors.fullName = 'Họ tên không được để trống';
    }
    if (!form.email.trim()) {
      errors.email = 'Email không được để trống';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errors.email = 'Email không hợp lệ';
    }
    const trimmedPhone = form.phone.trim();
    if (trimmedPhone && !/^\d{10,11}$/.test(trimmedPhone)) {
      errors.phone = 'Số điện thoại phải có 10-11 chữ số';
    }
    if (!form.password) {
      errors.password = 'Mật khẩu không được để trống';
    } else if (form.password.length < 6) {
      errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    if (!form.role) {
      errors.role = 'Vui lòng chọn phân quyền';
    }
    return errors;
  };

  const confirmCreateAccount = async (e) => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    const errors = validateCreateForm(createForm);
    setCreateErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setCreateLoading(true);
    setCreateError('');
    try {
      const trimmedPhone = createForm.phone.trim();
      await createAccountUser({
        fullName: createForm.fullName.trim(),
        email: createForm.email.trim(),
        ...(trimmedPhone ? { phone: trimmedPhone } : {}),
        password: createForm.password,
        role: createForm.role,
      });
      showToast('success', 'Tạo tài khoản thành công');
      setShowCreateDialog(false);
      resetCreateForm();
      await fetchAccounts();
    } catch (error) {
      const message = error?.response?.data?.message
        || error?.message
        || 'Tạo tài khoản thất bại. Vui lòng thử lại.';
      setCreateError(message);
    } finally {
      setCreateLoading(false);
    }
  };

  // Autofocus first field when modal opens
  useEffect(() => {
    if (showCreateDialog && fullNameInputRef.current) {
      fullNameInputRef.current.focus();
    }
  }, [showCreateDialog]);

  // Esc closes the create modal (unless submitting)
  useEffect(() => {
    if (!showCreateDialog) return undefined;
    const onKeyDown = (ev) => {
      if (ev.key === 'Escape' && !createLoading) closeCreateDialog();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [showCreateDialog, createLoading, closeCreateDialog]);

  // Aggregate counts for tab badges
  const totalUsers = useMemo(() => (activeTab === 'users' ? totalElements : null), [activeTab, totalElements]);
  const totalStaff = useMemo(() => (activeTab === 'staff' ? totalElements : null), [activeTab, totalElements]);

  // Display range for pagination summary
  const startIndex = totalElements === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const endIndex = Math.min(currentPage * PAGE_SIZE, totalElements);

  return (
    <div className="-m-4 sm:-m-5 lg:-m-8 min-h-screen bg-slate-50 text-slate-900 p-4 sm:p-5 lg:p-8 font-sans antialiased">
      {/* 2. TABS + CREATE BUTTON */}
      <div className="flex items-center justify-between border-b border-slate-200 mb-4">
        <div className="flex gap-1">
          <button
            onClick={() => handleTabChange('users')}
            className={`px-4 py-2 font-semibold text-sm transition-all duration-200 relative ${
              activeTab === 'users'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100/60'
            }`}
          >
            Người dùng{totalUsers !== null ? ` (${totalUsers})` : ''}
          </button>
          <button
            onClick={() => handleTabChange('staff')}
            className={`px-4 py-2 font-semibold text-sm transition-all duration-200 relative ${
              activeTab === 'staff'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100/60'
            }`}
          >
            Nhân viên{totalStaff !== null ? ` (${totalStaff})` : ''}
          </button>
        </div>
        {isAdmin && (
          <button
            type="button"
            onClick={openCreateDialog}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 mb-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition shadow-sm"
          >
            <UserPlus size={18} />
            Tạo tài khoản
          </button>
        )}
      </div>

      {/* 3. FILTERS & ACTIONS CONTAINER */}
      <div className={`grid gap-3 bg-white border border-slate-200 p-4 rounded-2xl mb-4 shadow-sm ${
        activeTab === 'staff'
          ? 'md:grid-cols-[1.5fr_1fr_1fr] lg:grid-cols-[2fr_1fr_1fr]'
          : 'md:grid-cols-[1.5fr_1fr] lg:grid-cols-[2fr_1fr]'
      }`}>
        {/* Search Field */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={
              activeTab === 'users'
                ? 'Tìm tên, email, số điện thoại...'
                : 'Tìm tên, email, mã nhân viên...'
            }
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition duration-200 text-sm"
          />
        </div>

        {/* Role Filter (staff tab only) */}
        {activeTab === 'staff' && (
          <div>
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition duration-200 text-sm appearance-none cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                backgroundPosition: 'right 0.75rem center',
                backgroundSize: '1.25rem 1.25rem',
                backgroundRepeat: 'no-repeat'
              }}
            >
              <option value="all">Tất cả role</option>
              <option value="Admin">Admin</option>
              <option value="Staff">Staff</option>
            </select>
          </div>
        )}

        {/* Status Filter (both tabs) */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition duration-200 text-sm appearance-none cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
              backgroundPosition: 'right 0.75rem center',
              backgroundSize: '1.25rem 1.25rem',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="Hoạt động">Hoạt động</option>
            <option value="Bị khóa">Bị khóa</option>
          </select>
        </div>
      </div>

      {/* 4. DATA TABLES */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-6">
        <div className="overflow-x-auto">
          {activeTab === 'users' ? (
            /* ================= USER TABLE ================= */
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-xs">
                  <th className="px-6 py-4 w-[260px]">Người dùng</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Số điện thoại</th>
                  <th className="px-6 py-4">Thanh toán</th>
                  <th className="px-6 py-4 text-center">Hành động</th>
                </tr>
              </thead>
              {loading ? (
                <TableSkeleton columns={5} />
              ) : (
                <tbody className="divide-y divide-slate-100">
                  {accounts.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-slate-500 font-medium">
                        Không tìm thấy người dùng nào phù hợp.
                      </td>
                    </tr>
                  ) : (
                    accounts.map((user) => {
                      const avatarStyle = getAvatarStyle(user.name);
                      const isLocked = user.status === 'Bị khóa';
                      return (
                        <tr key={user.userId ?? user.id} className="hover:bg-blue-50/40 transition duration-150 group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <span className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border shrink-0 ${avatarStyle}`}>
                                {getInitials(user.name)}
                              </span>
                              <div className="min-w-0">
                                <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">{user.name}</div>
                                <div className="mt-1">
                                  {isLocked ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-500 border border-slate-200">
                                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                      Bị khóa
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                      Hoạt động
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-slate-600 text-sm truncate block max-w-[220px]" title={user.email}>{user.email || '—'}</span>
                          </td>
                          <td className="px-6 py-4 text-slate-700 font-medium">{user.phone || '—'}</td>
                          <td className="px-6 py-4">
                            {user.paid === true ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                Đã thanh toán
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                Chưa thanh toán
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              {isAdmin ? (
                                <>
                                  <button
                                    onClick={() => openRolePicker(user)}
                                    title="Nâng cấp lên nhân viên"
                                    className="p-2 rounded-lg border border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition duration-200 shadow-[0_2px_8px_rgba(59,130,246,0.1)]"
                                  >
                                    <UserPlus size={16} />
                                  </button>
                                  <button
                                    onClick={() => openBlockConfirmation(user)}
                                    title={isLocked ? "Mở khóa tài khoản" : "Vô hiệu hóa tài khoản"}
                                    className={`p-2 rounded-lg border transition duration-200 ${
                                      isLocked
                                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-500 hover:text-white'
                                        : 'bg-red-50 border-red-200 text-red-600 hover:bg-red-500 hover:text-white'
                                    }`}
                                  >
                                    {isLocked ? <Unlock size={16} /> : <Lock size={16} />}
                                  </button>
                                </>
                              ) : (
                                <span className="text-xs text-slate-400 italic">Chỉ Admin</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              )}
            </table>
          ) : (
            /* ================= STAFF TABLE ================= */
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-xs">
                  <th className="px-6 py-4">Nhân viên</th>
                  <th className="px-6 py-4">Mã NV</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Hành động (Vai trò)</th>
                </tr>
              </thead>
              {loading ? (
                <TableSkeleton columns={5} />
              ) : (
                <tbody className="divide-y divide-slate-100">
                  {accounts.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-slate-500 font-medium">
                        Không tìm thấy nhân viên nào phù hợp.
                      </td>
                    </tr>
                  ) : (
                    accounts.map((member) => {
                      const avatarStyle = getAvatarStyle(member.name);
                      const isMemberAdmin = member.role === 'Admin';
                      const isLocked = member.status === 'Bị khóa';
                      return (
                        <tr key={member.userId ?? member.id} className="hover:bg-blue-50/40 transition duration-150 group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <span className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border ${avatarStyle}`}>
                                {getInitials(member.name)}
                              </span>
                              <div>
                                <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{member.name}</div>
                                <div className="mt-1">
                                  {isLocked ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-500 border border-slate-200">
                                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                      Bị khóa
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                      Hoạt động
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-blue-600 font-mono font-semibold">{buildStaffCode(member.userId ?? member.id)}</td>
                          <td className="px-6 py-4">
                            {isMemberAdmin ? (
                              <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                                Admin
                              </span>
                            ) : (
                              <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                                Staff
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 max-w-[220px]">
                            <span className="block truncate text-sm text-slate-700" title={member.email}>
                              {member.email || '—'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {isAdmin ? (
                              <div className="flex items-center gap-3">
                                <select
                                  value={member.role}
                                  onChange={(e) => handleRoleChangeDropdown(member, e.target.value)}
                                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:border-blue-400 transition cursor-pointer"
                                >
                                  <option value="Staff">Staff</option>
                                  <option value="Admin">Admin</option>
                                </select>

                                {/* Additional Lock button for staff to toggle status */}
                                <button
                                  onClick={() => openBlockConfirmation(member)}
                                  title={isLocked ? "Mở khóa nhân viên" : "Khóa nhân viên"}
                                  className={`p-1.5 rounded-lg border transition ${
                                    isLocked
                                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-500 hover:text-white'
                                      : 'bg-red-50 border-red-200 text-red-600 hover:bg-red-500 hover:text-white'
                                  }`}
                                >
                                  {isLocked ? <UserCheck size={14} /> : <UserX size={14} />}
                                </button>
                              </div>
                            ) : (
                              <span className="text-xs text-slate-400 italic">Chỉ Admin</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              )}
            </table>
          )}
        </div>
      </div>

      {/* 5. PAGINATION PANEL */}
      {totalElements > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-slate-200 p-5 rounded-2xl shadow-sm text-sm text-slate-600">
          <div>
            Hiển thị <span className="font-semibold text-slate-900">{startIndex}–{endIndex}</span> / <span className="font-semibold text-slate-900">{totalElements}</span> {activeTab === 'users' ? 'người dùng' : 'nhân viên'}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition duration-150"
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                disabled={loading}
                className={`w-9 h-9 rounded-xl font-semibold border transition duration-150 ${
                  currentPage === page
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || loading}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition duration-150"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ================= ROLE PICKER (NÂNG ROLE CHO USER) ================= */}
      {showRolePicker && selectedAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => { setShowRolePicker(false); setSelectedAccount(null); }} className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" />

          <div className="relative bg-white border border-slate-200 w-full max-w-sm rounded-2xl p-6 text-center shadow-xl z-10 animate-in fade-in zoom-in-95 duration-150">
            <div className="mx-auto w-14 h-14 bg-blue-50 border border-blue-200 text-blue-600 rounded-full flex items-center justify-center mb-4">
              <UserPlus size={28} />
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-1">Nâng cấp tài khoản</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              Chọn role mới cho <span className="font-semibold text-slate-900">{selectedAccount.name}</span>
            </p>

            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => {
                  setPendingRoleChange('Staff');
                  setShowRolePicker(false);
                  setShowRoleDialog(true);
                }}
                className="w-full py-3.5 bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-600 hover:text-white font-bold rounded-xl text-sm transition flex items-center justify-center gap-3"
              >
                <Shield size={18} />
                <span>STAFF — Nhân viên</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setPendingRoleChange('Admin');
                  setShowRolePicker(false);
                  setShowRoleDialog(true);
                }}
                className="w-full py-3.5 bg-purple-50 border border-purple-200 text-purple-700 hover:bg-purple-600 hover:text-white font-bold rounded-xl text-sm transition flex items-center justify-center gap-3"
              >
                <Shield size={18} />
                <span>ADMIN — Quản trị viên</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => { setShowRolePicker(false); setSelectedAccount(null); }}
              className="mt-4 w-full py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold rounded-xl text-sm transition"
            >
              Hủy
            </button>
          </div>
        </div>
      )}

      {/* ================= CONFIRM DIALOG 1 (VÔ HIỆU HÓA / KÍCH HOẠT) ================= */}
      {showBlockDialog && selectedAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => !actionLoading && setShowBlockDialog(false)} className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" />

          <div className="relative bg-white border border-slate-200 w-full max-w-md rounded-2xl p-6 text-center shadow-xl z-10 animate-in fade-in zoom-in-95 duration-150">
            <div className="mx-auto w-14 h-14 bg-red-50 border border-red-200 text-red-600 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle size={28} />
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-2">
              {selectedAccount.status === 'Hoạt động' ? 'Vô hiệu hóa tài khoản?' : 'Kích hoạt lại tài khoản?'}
            </h3>

            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              {selectedAccount.status === 'Hoạt động' ? (
                <>
                  Tài khoản <span className="font-semibold text-slate-900">{selectedAccount.name}</span> sẽ bị khóa. Người dùng không thể đăng nhập cho đến khi được kích hoạt lại.
                </>
              ) : (
                <>
                  Tài khoản <span className="font-semibold text-slate-900">{selectedAccount.name}</span> sẽ được kích hoạt trở lại. Người dùng có thể đăng nhập bình thường.
                </>
              )}
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setShowBlockDialog(false)}
                disabled={actionLoading}
                className="w-1/2 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={confirmRoleChange}
                disabled={actionLoading}
                className="w-1/2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition inline-flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={confirmToggleStatus}
                disabled={actionLoading}
                className={`w-1/2 py-3 font-semibold rounded-xl text-sm transition text-white inline-flex items-center justify-center gap-2 ${
                  selectedAccount.status === 'Hoạt động'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-emerald-500 hover:bg-emerald-600'
                } disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                {actionLoading && <Loader2 size={16} className="animate-spin" />}
                {selectedAccount.status === 'Hoạt động' ? 'Vô hiệu hóa' : 'Kích hoạt'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= CONFIRM DIALOG 2 (ĐỔI ROLE NHÂN VIÊN) ================= */}
      {showRoleDialog && selectedAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => !actionLoading && setShowRoleDialog(false)} className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" />

          <div className="relative bg-white border border-slate-200 w-full max-w-md rounded-2xl p-6 text-center shadow-xl z-10 animate-in fade-in zoom-in-95 duration-150">
            <div className="mx-auto w-14 h-14 bg-amber-50 border border-amber-200 text-amber-600 rounded-full flex items-center justify-center mb-4">
              <Shield size={28} />
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Đổi role nhân viên?
            </h3>

            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              Đổi role của <span className="font-semibold text-slate-900">{selectedAccount.name}</span> từ{' '}
              <span className="font-semibold text-slate-900">{selectedAccount.role}</span> sang{' '}
              <span className="font-semibold text-blue-600">{pendingRoleChange}</span>.
              {pendingRoleChange === 'Admin' ? (
                <> Nhân viên sẽ có thêm quyền quản trị và truy cập dữ liệu nâng cao.</>
              ) : (
                <> Nhân viên sẽ bị hạn chế bớt một số quyền quản trị cấp cao.</>
              )}
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowRoleDialog(false);
                  setSelectedAccount(null);
                  setPendingRoleChange('');
                }}
                disabled={actionLoading}
                className="w-1/2 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading && <Loader2 size={16} className="animate-spin" />}
                Xác nhận đổi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= CREATE ACCOUNT DIALOG ================= */}
      {showCreateDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={closeCreateDialog}
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
          />

          <form
            onSubmit={confirmCreateAccount}
            className="relative bg-white border border-slate-200 w-full max-w-xl rounded-2xl shadow-xl z-10 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col"
            noValidate
          >
            {/* Header */}
            <div className="flex items-start gap-4 p-6 border-b border-slate-100">
              <div className="w-12 h-12 bg-blue-50 border border-blue-200 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                <UserPlus size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-slate-900">Tạo tài khoản mới</h3>
                <p className="text-slate-500 text-sm mt-1">Điền thông tin để tạo tài khoản mới trong hệ thống.</p>
              </div>
              <button
                type="button"
                onClick={closeCreateDialog}
                disabled={createLoading}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                title="Đóng"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 overflow-y-auto">
              {createError && (
                <div className="flex items-start gap-2.5 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  <span className="break-words">{createError}</span>
                </div>
              )}

              {/* Họ tên */}
              <div>
                <label htmlFor="create-fullName" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Họ tên <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User size={18} />
                  </span>
                  <input
                    id="create-fullName"
                    ref={fullNameInputRef}
                    type="text"
                    value={createForm.fullName}
                    onChange={handleCreateChange('fullName')}
                    placeholder="Nguyễn Văn A"
                    className={`w-full pl-10 pr-4 py-2.5 bg-white border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition text-sm ${
                      createErrors.fullName
                        ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                        : 'border-slate-200 focus:border-blue-400 focus:ring-blue-100'
                    }`}
                  />
                </div>
                {createErrors.fullName && (
                  <p className="text-xs text-red-600 mt-1.5">{createErrors.fullName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="create-email" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail size={18} />
                  </span>
                  <input
                    id="create-email"
                    type="email"
                    value={createForm.email}
                    onChange={handleCreateChange('email')}
                    placeholder="example@gmail.com"
                    className={`w-full pl-10 pr-4 py-2.5 bg-white border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition text-sm ${
                      createErrors.email
                        ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                        : 'border-slate-200 focus:border-blue-400 focus:ring-blue-100'
                    }`}
                  />
                </div>
                {createErrors.email && (
                  <p className="text-xs text-red-600 mt-1.5">{createErrors.email}</p>
                )}
              </div>

              {/* Số điện thoại */}
              <div>
                <label htmlFor="create-phone" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Số điện thoại <span className="text-slate-400">(không bắt buộc)</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone size={18} />
                  </span>
                  <input
                    id="create-phone"
                    type="tel"
                    inputMode="numeric"
                    value={createForm.phone}
                    onChange={handleCreateChange('phone')}
                    placeholder="0901234567"
                    maxLength={11}
                    className={`w-full pl-10 pr-4 py-2.5 bg-white border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition text-sm ${
                      createErrors.phone
                        ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                        : 'border-slate-200 focus:border-blue-400 focus:ring-blue-100'
                    }`}
                  />
                </div>
                {createErrors.phone && (
                  <p className="text-xs text-red-600 mt-1.5">{createErrors.phone}</p>
                )}
              </div>

              {/* Mật khẩu */}
              <div>
                <label htmlFor="create-password" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Mật khẩu <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock size={18} />
                  </span>
                  <input
                    id="create-password"
                    type={showCreatePassword ? 'text' : 'password'}
                    value={createForm.password}
                    onChange={handleCreateChange('password')}
                    placeholder="Tối thiểu 6 ký tự"
                    className={`w-full pl-10 pr-11 py-2.5 bg-white border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition text-sm ${
                      createErrors.password
                        ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                        : 'border-slate-200 focus:border-blue-400 focus:ring-blue-100'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCreatePassword((v) => !v)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 transition"
                    title={showCreatePassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    tabIndex={-1}
                  >
                    {showCreatePassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {createErrors.password && (
                  <p className="text-xs text-red-600 mt-1.5">{createErrors.password}</p>
                )}
              </div>

              {/* Phân quyền */}
              <div>
                <label htmlFor="create-role" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Phân quyền <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Shield size={18} />
                  </span>
                  <select
                    id="create-role"
                    value={createForm.role}
                    onChange={handleCreateChange('role')}
                    className={`w-full pl-10 pr-10 py-2.5 bg-white border rounded-xl text-slate-900 focus:outline-none focus:ring-2 transition text-sm appearance-none cursor-pointer ${
                      createErrors.role
                        ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                        : 'border-slate-200 focus:border-blue-400 focus:ring-blue-100'
                    }`}
                    style={{
                      backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                      backgroundPosition: 'right 0.75rem center',
                      backgroundSize: '1.25rem 1.25rem',
                      backgroundRepeat: 'no-repeat'
                    }}
                  >
                    <option value="USER">USER — Người dùng</option>
                    <option value="STAFF">STAFF — Nhân viên</option>
                    <option value="ADMIN">ADMIN — Quản trị viên</option>
                  </select>
                </div>
                {createErrors.role && (
                  <p className="text-xs text-red-600 mt-1.5">{createErrors.role}</p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-100 bg-slate-50 rounded-b-2xl">
              <button
                type="button"
                onClick={closeCreateDialog}
                disabled={createLoading}
                className="px-5 py-2.5 border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={createLoading}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition inline-flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
              >
                {createLoading && <Loader2 size={16} className="animate-spin" />}
                Tạo tài khoản
              </button>
            </div>
          </form>
        </div>
      )}

      <Toast toast={toast} onClose={closeToast} />
    </div>
  );
}
