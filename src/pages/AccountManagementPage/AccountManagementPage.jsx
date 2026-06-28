import { useCallback, useEffect, useMemo, useState } from 'react';
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
} from 'lucide-react';
import {
  getAccountUsers,
  getAccountEmployees,
  toggleUserStatus,
  changeUserRole,
} from '../../services/accountApi';
import { formatVietnamDate } from '../../utils/dateTime';
import { useAuth } from '../../contexts/useAuth';

// Color palette helper for initials avatar
const AVATAR_COLORS = [
  'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'bg-amber-500/20 text-amber-400 border-amber-500/30',
  'bg-rose-500/20 text-rose-400 border-rose-500/30',
  'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  'bg-teal-500/20 text-teal-400 border-teal-500/30'
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
  if (status === 'Bị khóa') return 'LOCKED';
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
    ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-100'
    : 'border-red-500/40 bg-red-500/15 text-red-100';

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
    <tbody className="divide-y divide-zinc-800">
      {Array.from({ length: 6 }).map((_, idx) => (
        <tr key={idx} className="animate-pulse">
          {Array.from({ length: columns }).map((__, colIdx) => (
            <td key={colIdx} className="px-6 py-4">
              <div className="h-3.5 w-3/4 rounded-full bg-zinc-800" />
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

  // Aggregate counts for tab badges
  const totalUsers = useMemo(() => (activeTab === 'users' ? totalElements : null), [activeTab, totalElements]);
  const totalStaff = useMemo(() => (activeTab === 'staff' ? totalElements : null), [activeTab, totalElements]);

  // Display range for pagination summary
  const startIndex = totalElements === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const endIndex = Math.min(currentPage * PAGE_SIZE, totalElements);

  return (
    <div className="-m-4 sm:-m-5 lg:-m-8 min-h-screen bg-[#1a1a1a] text-zinc-100 p-4 sm:p-5 lg:p-8 font-sans antialiased selection:bg-[#4ade80]/30 selection:text-white">
      {/* 1. HEADER & BREADCRUMB */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-zinc-800 pb-6 mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-1.5">
            <span>PARKING MANAGEMENT</span>
            <span className="text-[#4ade80]/80">/</span>
            <span className="text-zinc-400">Quản lý tài khoản</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Quản lý tài khoản</h1>
        </div>
      </header>

      {/* 2. TAB SELECTOR */}
      <div className="flex border-b border-zinc-800 mb-6 gap-2">
        <button
          onClick={() => handleTabChange('users')}
          className={`px-5 py-3 font-semibold text-sm transition-all duration-200 relative ${
            activeTab === 'users'
              ? 'text-white border-b-2 border-[#4ade80]'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
          }`}
        >
          Người dùng{totalUsers !== null ? ` (${totalUsers})` : ''}
        </button>
        <button
          onClick={() => handleTabChange('staff')}
          className={`px-5 py-3 font-semibold text-sm transition-all duration-200 relative ${
            activeTab === 'staff'
              ? 'text-white border-b-2 border-[#4ade80]'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
          }`}
        >
          Nhân viên{totalStaff !== null ? ` (${totalStaff})` : ''}
        </button>
      </div>

      {/* 3. FILTERS & ACTIONS CONTAINER */}
      <div className="grid gap-4 md:grid-cols-[1.5fr_1fr] lg:grid-cols-[2fr_1fr] bg-[#222222] border border-zinc-850 p-5 rounded-2xl mb-6 shadow-md">
        {/* Search Field */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
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
            className="w-full pl-10 pr-4 py-3 bg-[#1a1a1a] border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-[#4ade80] focus:ring-1 focus:ring-[#4ade80] transition duration-200 text-sm"
          />
        </div>

        {/* Dropdown Filter */}
        <div>
          {activeTab === 'users' ? (
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-3 bg-[#1a1a1a] border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-[#4ade80] focus:ring-1 focus:ring-[#4ade80] transition duration-200 text-sm appearance-none cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23a1a1aa' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                backgroundPosition: 'right 0.75rem center',
                backgroundSize: '1.25rem 1.25rem',
                backgroundRepeat: 'no-repeat'
              }}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="Hoạt động">Hoạt động</option>
              <option value="Bị khóa">Bị khóa</option>
            </select>
          ) : (
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-3 bg-[#1a1a1a] border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-[#4ade80] focus:ring-1 focus:ring-[#4ade80] transition duration-200 text-sm appearance-none cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23a1a1aa' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                backgroundPosition: 'right 0.75rem center',
                backgroundSize: '1.25rem 1.25rem',
                backgroundRepeat: 'no-repeat'
              }}
            >
              <option value="all">Tất cả role</option>
              <option value="Admin">Admin</option>
              <option value="Staff">Staff</option>
            </select>
          )}
        </div>
      </div>

      {/* 4. DATA TABLES */}
      <div className="bg-[#222222] border border-zinc-800 rounded-2xl shadow-lg overflow-hidden mb-6">
        <div className="overflow-x-auto">
          {activeTab === 'users' ? (
            /* ================= USER TABLE ================= */
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-zinc-850 border-b border-zinc-800 text-zinc-400 font-bold uppercase tracking-wider text-xs">
                  <th className="px-6 py-4">Người dùng</th>
                  <th className="px-6 py-4">Số điện thoại</th>
                  <th className="px-6 py-4">Ngày tạo</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4 text-center">Hành động</th>
                </tr>
              </thead>
              {loading ? (
                <TableSkeleton columns={5} />
              ) : (
                <tbody className="divide-y divide-zinc-800">
                  {accounts.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-zinc-500 font-medium">
                        Không tìm thấy người dùng nào phù hợp.
                      </td>
                    </tr>
                  ) : (
                    accounts.map((user) => {
                      const avatarStyle = getAvatarStyle(user.name);
                      const isLocked = user.status === 'Bị khóa';
                      return (
                        <tr key={user.userId ?? user.id} className="hover:bg-zinc-800/40 transition duration-150 group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <span className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border ${avatarStyle}`}>
                                {getInitials(user.name)}
                              </span>
                              <div>
                                <div className="font-semibold text-white group-hover:text-[#4ade80] transition-colors">{user.name}</div>
                                <div className="text-zinc-500 text-xs mt-0.5">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-zinc-300 font-medium">{user.phone || '—'}</td>
                          <td className="px-6 py-4 text-zinc-400">{user.createdAt}</td>
                          <td className="px-6 py-4">
                            {isLocked ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-800 text-zinc-400 border border-zinc-700">
                                <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
                                Bị khóa
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-[#4ade80] border border-[#4ade80]/20">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" />
                                Hoạt động
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
                                        ? 'bg-emerald-500/10 border-emerald-500/30 text-[#4ade80] hover:bg-[#4ade80] hover:text-zinc-950 shadow-[0_2px_8px_rgba(74,222,128,0.1)]'
                                        : 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white shadow-[0_2px_8px_rgba(239,68,68,0.1)]'
                                    }`}
                                  >
                                    {isLocked ? <Unlock size={16} /> : <Lock size={16} />}
                                  </button>
                                </>
                              ) : (
                                <span className="text-xs text-zinc-500 italic">Chỉ Admin</span>
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
                <tr className="bg-zinc-850 border-b border-zinc-800 text-zinc-400 font-bold uppercase tracking-wider text-xs">
                  <th className="px-6 py-4">Nhân viên</th>
                  <th className="px-6 py-4">Mã NV</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4">Hành động (Vai trò)</th>
                </tr>
              </thead>
              {loading ? (
                <TableSkeleton columns={5} />
              ) : (
                <tbody className="divide-y divide-zinc-800">
                  {accounts.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-zinc-500 font-medium">
                        Không tìm thấy nhân viên nào phù hợp.
                      </td>
                    </tr>
                  ) : (
                    accounts.map((member) => {
                      const avatarStyle = getAvatarStyle(member.name);
                      const isMemberAdmin = member.role === 'Admin';
                      const isLocked = member.status === 'Bị khóa';
                      return (
                        <tr key={member.userId ?? member.id} className="hover:bg-zinc-800/40 transition duration-150 group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <span className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border ${avatarStyle}`}>
                                {getInitials(member.name)}
                              </span>
                              <div>
                                <div className="font-semibold text-white group-hover:text-[#4ade80] transition-colors">{member.name}</div>
                                <div className="text-zinc-500 text-xs mt-0.5">{member.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-[#4ade80] font-mono font-semibold">{buildStaffCode(member.userId ?? member.id)}</td>
                          <td className="px-6 py-4">
                            {isMemberAdmin ? (
                              <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-[0_2px_8px_rgba(168,85,247,0.05)]">
                                Admin
                              </span>
                            ) : (
                              <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-[0_2px_8px_rgba(59,130,246,0.05)]">
                                Staff
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {isLocked ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-800 text-zinc-400 border border-zinc-700">
                                <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
                                Bị khóa
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-[#4ade80] border border-[#4ade80]/20">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" />
                                Hoạt động
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {isAdmin ? (
                              <div className="flex items-center gap-3">
                                <select
                                  value={member.role}
                                  onChange={(e) => handleRoleChangeDropdown(member, e.target.value)}
                                  className="px-3 py-1.5 bg-[#1a1a1a] border border-zinc-700 rounded-lg text-xs font-medium text-zinc-200 focus:outline-none focus:border-[#4ade80] transition cursor-pointer"
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
                                      ? 'bg-emerald-500/10 border-emerald-500/30 text-[#4ade80] hover:bg-[#4ade80] hover:text-zinc-950'
                                      : 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white'
                                  }`}
                                >
                                  {isLocked ? <UserCheck size={14} /> : <UserX size={14} />}
                                </button>
                              </div>
                            ) : (
                              <span className="text-xs text-zinc-500 italic">Chỉ Admin</span>
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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#222222] border border-zinc-800 p-5 rounded-2xl shadow-md text-sm text-zinc-400">
          <div>
            Hiển thị <span className="font-semibold text-white">{startIndex}–{endIndex}</span> / <span className="font-semibold text-white">{totalElements}</span> {activeTab === 'users' ? 'người dùng' : 'nhân viên'}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
              className="p-2 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition duration-150"
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
                    ? 'bg-[#4ade80] text-zinc-950 border-[#4ade80] shadow-[0_2px_8px_rgba(74,222,128,0.2)]'
                    : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || loading}
              className="p-2 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition duration-150"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ================= ROLE PICKER (NÂNG ROLE CHO USER) ================= */}
      {showRolePicker && selectedAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => { setShowRolePicker(false); setSelectedAccount(null); }} className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity" />

          <div className="relative bg-[#1e1e1e] border border-zinc-800 w-full max-w-sm rounded-2xl p-6 text-center shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-150">
            <div className="mx-auto w-14 h-14 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mb-4">
              <UserPlus size={28} />
            </div>

            <h3 className="text-lg font-bold text-white mb-1">Nâng cấp tài khoản</h3>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
              Chọn role mới cho <span className="font-semibold text-white">{selectedAccount.name}</span>
            </p>

            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => {
                  setPendingRoleChange('Staff');
                  setShowRolePicker(false);
                  setShowRoleDialog(true);
                }}
                className="w-full py-3.5 bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500 hover:text-white font-bold rounded-xl text-sm transition flex items-center justify-center gap-3"
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
                className="w-full py-3.5 bg-purple-500/10 border border-purple-500/30 text-purple-400 hover:bg-purple-500 hover:text-white font-bold rounded-xl text-sm transition flex items-center justify-center gap-3"
              >
                <Shield size={18} />
                <span>ADMIN — Quản trị viên</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => { setShowRolePicker(false); setSelectedAccount(null); }}
              className="mt-4 w-full py-2.5 border border-zinc-700 hover:bg-zinc-800 text-zinc-400 font-semibold rounded-xl text-sm transition"
            >
              Hủy
            </button>
          </div>
        </div>
      )}

      {/* ================= CONFIRM DIALOG 1 (VÔ HIỆU HÓA / KÍCH HOẠT) ================= */}
      {showBlockDialog && selectedAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => !actionLoading && setShowBlockDialog(false)} className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity" />

          <div className="relative bg-[#1e1e1e] border border-zinc-800 w-full max-w-md rounded-2xl p-6 text-center shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-150">
            <div className="mx-auto w-14 h-14 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle size={28} />
            </div>

            <h3 className="text-lg font-bold text-white mb-2">
              {selectedAccount.status === 'Hoạt động' ? 'Vô hiệu hóa tài khoản?' : 'Kích hoạt lại tài khoản?'}
            </h3>

            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
              {selectedAccount.status === 'Hoạt động' ? (
                <>
                  Tài khoản <span className="font-semibold text-white">{selectedAccount.name}</span> sẽ bị khóa. Người dùng không thể đăng nhập cho đến khi được kích hoạt lại.
                </>
              ) : (
                <>
                  Tài khoản <span className="font-semibold text-white">{selectedAccount.name}</span> sẽ được kích hoạt trở lại. Người dùng có thể đăng nhập bình thường.
                </>
              )}
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setShowBlockDialog(false)}
                disabled={actionLoading}
                className="w-1/2 py-3 border border-zinc-700 hover:bg-zinc-800 text-zinc-300 font-semibold rounded-xl text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
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
          <div onClick={() => !actionLoading && setShowRoleDialog(false)} className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity" />

          <div className="relative bg-[#1e1e1e] border border-zinc-800 w-full max-w-md rounded-2xl p-6 text-center shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-150">
            <div className="mx-auto w-14 h-14 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full flex items-center justify-center mb-4">
              <Shield size={28} />
            </div>

            <h3 className="text-lg font-bold text-white mb-2">
              Đổi role nhân viên?
            </h3>

            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
              Đổi role của <span className="font-semibold text-white">{selectedAccount.name}</span> từ{' '}
              <span className="font-semibold text-white">{selectedAccount.role}</span> sang{' '}
              <span className="font-semibold text-[#4ade80]">{pendingRoleChange}</span>.
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
                className="w-1/2 py-3 border border-zinc-700 hover:bg-zinc-800 text-zinc-300 font-semibold rounded-xl text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={confirmRoleChange}
                disabled={actionLoading}
                className="w-1/2 py-3 bg-[#4ade80] hover:bg-[#34c76d] text-zinc-950 font-bold rounded-xl text-sm transition inline-flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {actionLoading && <Loader2 size={16} className="animate-spin" />}
                Xác nhận đổi
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast toast={toast} onClose={closeToast} />
    </div>
  );
}
