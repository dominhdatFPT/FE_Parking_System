import { useState, useMemo } from 'react';
import {
  Search,
  UserPlus,
  Lock,
  Unlock,
  X,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Shield,
  Eye,
  EyeOff,
  Info,
  UserCheck,
  UserX
} from 'lucide-react';

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

// Initial Mock Data for Users (24)
const INITIAL_USERS = [
  { id: 1, name: 'Nguyễn Văn A', email: 'nguyenvana@gmail.com', phone: '0901234567', createdAt: '10/01/2026', status: 'Hoạt động' },
  { id: 2, name: 'Trần Thị B', email: 'tranthib@gmail.com', phone: '0912345678', createdAt: '12/01/2026', status: 'Hoạt động' },
  { id: 3, name: 'Lê Văn C', email: 'levanc@gmail.com', phone: '0923456789', createdAt: '15/01/2026', status: 'Bị khóa' },
  { id: 4, name: 'Phạm Minh D', email: 'phamminhd@gmail.com', phone: '0934567890', createdAt: '18/01/2026', status: 'Hoạt động' },
  { id: 5, name: 'Hoàng Thị E', email: 'hoangthie@gmail.com', phone: '0945678901', createdAt: '20/01/2026', status: 'Hoạt động' },
  { id: 6, name: 'Vũ Văn F', email: 'vuvanf@gmail.com', phone: '0956789012', createdAt: '22/01/2026', status: 'Bị khóa' },
  { id: 7, name: 'Ngô Thị G', email: 'ngothig@gmail.com', phone: '0967890123', createdAt: '25/01/2026', status: 'Hoạt động' },
  { id: 8, name: 'Đỗ Văn H', email: 'dovanh@gmail.com', phone: '0978901234', createdAt: '28/01/2026', status: 'Hoạt động' },
  { id: 9, name: 'Bùi Thị I', email: 'buithii@gmail.com', phone: '0989012345', createdAt: '01/02/2026', status: 'Hoạt động' },
  { id: 10, name: 'Lý Văn J', email: 'lyvanj@gmail.com', phone: '0990123456', createdAt: '03/02/2026', status: 'Bị khóa' },
  { id: 11, name: 'Dương Văn K', email: 'duongvank@gmail.com', phone: '0909876543', createdAt: '05/02/2026', status: 'Hoạt động' },
  { id: 12, name: 'Lâm Thị L', email: 'lamthil@gmail.com', phone: '0919876543', createdAt: '08/02/2026', status: 'Hoạt động' },
  { id: 13, name: 'Phan Văn M', email: 'phanvanm@gmail.com', phone: '0929876543', createdAt: '10/02/2026', status: 'Hoạt động' },
  { id: 14, name: 'Đặng Thị N', email: 'dangthin@gmail.com', phone: '0939876543', createdAt: '12/02/2026', status: 'Bị khóa' },
  { id: 15, name: 'Nguyễn Văn O', email: 'nguyenvano@gmail.com', phone: '0949876543', createdAt: '15/02/2026', status: 'Hoạt động' },
  { id: 16, name: 'Trịnh Thị P', email: 'trinhthip@gmail.com', phone: '0959876543', createdAt: '18/02/2026', status: 'Hoạt động' },
  { id: 17, name: 'Mai Văn Q', email: 'maivanq@gmail.com', phone: '0969876543', createdAt: '20/02/2026', status: 'Hoạt động' },
  { id: 18, name: 'Đào Thị R', email: 'daothir@gmail.com', phone: '0979876543', createdAt: '22/02/2026', status: 'Bị khóa' },
  { id: 19, name: 'Hà Văn S', email: 'havans@gmail.com', phone: '0989876543', createdAt: '25/02/2026', status: 'Hoạt động' },
  { id: 20, name: 'Đinh Thị T', email: 'dinhthit@gmail.com', phone: '0999876543', createdAt: '28/02/2026', status: 'Hoạt động' },
  { id: 21, name: 'Lương Văn U', email: 'luongvanu@gmail.com', phone: '0901122334', createdAt: '01/03/2026', status: 'Hoạt động' },
  { id: 22, name: 'Phùng Thị V', email: 'phungthiv@gmail.com', phone: '0911122334', createdAt: '03/03/2026', status: 'Bị khóa' },
  { id: 23, name: 'Vương Văn W', email: 'vuongvanw@gmail.com', phone: '0921122334', createdAt: '05/03/2026', status: 'Hoạt động' },
  { id: 24, name: 'Tạ Thị X', email: 'tathix@gmail.com', phone: '0931122334', createdAt: '08/03/2026', status: 'Hoạt động' }
];

// Initial Mock Data for Staff (5)
const INITIAL_STAFF = [
  { id: 1, name: 'Nguyễn Văn Admin', email: 'admin@parking.com', phone: '0900000001', createdAt: '01/12/2025', staffCode: 'STF001', role: 'Admin', status: 'Hoạt động' },
  { id: 2, name: 'Lê Thị Staff', email: 'staff1@parking.com', phone: '0900000002', createdAt: '15/12/2025', staffCode: 'STF002', role: 'Staff', status: 'Hoạt động' },
  { id: 3, name: 'Trần Văn Staff', email: 'staff2@parking.com', phone: '0900000003', createdAt: '05/01/2026', staffCode: 'STF003', role: 'Staff', status: 'Hoạt động' },
  { id: 4, name: 'Phạm Thị Staff', email: 'staff3@parking.com', phone: '0900000004', createdAt: '20/01/2026', staffCode: 'STF004', role: 'Staff', status: 'Hoạt động' },
  { id: 5, name: 'Hoàng Văn Staff', email: 'staff4@parking.com', phone: '0900000005', createdAt: '10/02/2026', staffCode: 'STF005', role: 'Staff', status: 'Hoạt động' }
];

export default function AccountManagementPage() {
  // State management
  const [activeTab, setActiveTab] = useState('users'); // 'users' or 'staff'
  const [users, setUsers] = useState(INITIAL_USERS);
  const [staff, setStaff] = useState(INITIAL_STAFF);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'Hoạt động', 'Bị khóa'
  const [roleFilter, setRoleFilter] = useState('all'); // 'all', 'Admin', 'Staff'

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Dialog & Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const [showRoleDialog, setShowRoleDialog] = useState(false);

  // Selected item reference for confirmation dialogs
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [pendingRoleChange, setPendingRoleChange] = useState('');

  // Form input states for creating new employee
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    role: 'Staff'
  });
  const [showPassword, setShowPassword] = useState(false);

  // Handle Tab Switch
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchQuery('');
    setStatusFilter('all');
    setRoleFilter('all');
    setCurrentPage(1);
  };

  // Auto-generate employee code (STF + sequential number)
  const generatedStaffCode = useMemo(() => {
    if (staff.length === 0) return 'STF001';
    const codes = staff.map(s => {
      const num = parseInt(s.staffCode.replace('STF', ''), 10);
      return isNaN(num) ? 0 : num;
    });
    const maxNum = Math.max(...codes);
    return `STF${String(maxNum + 1).padStart(3, '0')}`;
  }, [staff]);

  // Filters and search logic
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phone.includes(searchQuery);

      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [users, searchQuery, statusFilter]);

  const filteredStaff = useMemo(() => {
    return staff.filter(member => {
      const matchesSearch =
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.staffCode.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole = roleFilter === 'all' || member.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [staff, searchQuery, roleFilter]);

  // Current records to display based on active tab and pagination
  const currentList = activeTab === 'users' ? filteredUsers : filteredStaff;
  const totalItems = currentList.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  const paginatedItems = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return currentList.slice(startIdx, startIdx + itemsPerPage);
  }, [currentList, currentPage]);

  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

  // Handle pagination navigation
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Open Block Account Dialog
  const openBlockConfirmation = (account) => {
    setSelectedAccount(account);
    setShowBlockDialog(true);
  };

  // Toggle User Status (Lock/Unlock)
  const confirmToggleStatus = () => {
    if (!selectedAccount) return;

    if (activeTab === 'users') {
      setUsers(prev => prev.map(u => {
        if (u.id === selectedAccount.id) {
          const newStatus = u.status === 'Hoạt động' ? 'Bị khóa' : 'Hoạt động';
          return { ...u, status: newStatus };
        }
        return u;
      }));
    } else {
      setStaff(prev => prev.map(s => {
        if (s.id === selectedAccount.id) {
          const newStatus = s.status === 'Hoạt động' ? 'Bị khóa' : 'Hoạt động';
          return { ...s, status: newStatus };
        }
        return s;
      }));
    }

    setShowBlockDialog(false);
    setSelectedAccount(null);
  };

  // Open Role Change Dialog
  const handleRoleChangeDropdown = (member, newRoleValue) => {
    setSelectedAccount(member);
    setPendingRoleChange(newRoleValue);
    setShowRoleDialog(true);
  };

  // Confirm Role Change
  const confirmRoleChange = () => {
    if (!selectedAccount || !pendingRoleChange) return;

    setStaff(prev => prev.map(s => {
      if (s.id === selectedAccount.id) {
        return { ...s, role: pendingRoleChange };
      }
      return s;
    }));

    setShowRoleDialog(false);
    setSelectedAccount(null);
    setPendingRoleChange('');
  };

  // Reset form and fields
  const closeCreateModal = () => {
    setShowCreateModal(false);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      password: '',
      role: 'Staff'
    });
    setShowPassword(false);
  };

  // Create new Staff account
  const handleCreateStaff = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.password) {
      alert('Vui lòng nhập đầy đủ thông tin bắt buộc (*)');
      return;
    }

    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;

    const newEmployee = {
      id: Date.now(),
      name: formData.fullName,
      email: formData.email,
      phone: formData.phone || 'Chưa cập nhật',
      createdAt: formattedDate,
      staffCode: generatedStaffCode,
      role: formData.role,
      status: 'Hoạt động'
    };

    setStaff(prev => [newEmployee, ...prev]);
    closeCreateModal();
    // Return to page 1 of staff tab to view the newly added staff at the top
    setCurrentPage(1);
  };

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

        {/* Action Button: Create Account (Only visible on Staff Tab) */}
        {activeTab === 'staff' && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center justify-center gap-2 bg-[#4ade80] hover:bg-[#34c76d] active:scale-[0.98] text-zinc-950 font-bold px-5 py-3 rounded-xl transition duration-200 shadow-[0_4px_16px_rgba(74,222,128,0.15)] group"
          >
            <UserPlus size={18} className="transition-transform group-hover:scale-110" />
            <span>Tạo tài khoản</span>
          </button>
        )}
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
          Người dùng ({users.length})
        </button>
        <button
          onClick={() => handleTabChange('staff')}
          className={`px-5 py-3 font-semibold text-sm transition-all duration-200 relative ${
            activeTab === 'staff'
              ? 'text-white border-b-2 border-[#4ade80]'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
          }`}
        >
          Nhân viên ({staff.length})
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
              <tbody className="divide-y divide-zinc-800">
                {paginatedItems.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-zinc-500 font-medium">
                      Không tìm thấy người dùng nào phù hợp.
                    </td>
                  </tr>
                ) : (
                  paginatedItems.map((user) => {
                    const avatarStyle = getAvatarStyle(user.name);
                    const isLocked = user.status === 'Bị khóa';
                    return (
                      <tr key={user.id} className="hover:bg-zinc-800/40 transition duration-150 group">
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
                        <td className="px-6 py-4 text-zinc-300 font-medium">{user.phone}</td>
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
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
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
              <tbody className="divide-y divide-zinc-800">
                {paginatedItems.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-zinc-500 font-medium">
                      Không tìm thấy nhân viên nào phù hợp.
                    </td>
                  </tr>
                ) : (
                  paginatedItems.map((member) => {
                    const avatarStyle = getAvatarStyle(member.name);
                    const isAdmin = member.role === 'Admin';
                    const isLocked = member.status === 'Bị khóa';
                    return (
                      <tr key={member.id} className="hover:bg-zinc-800/40 transition duration-150 group">
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
                        <td className="px-6 py-4 text-[#4ade80] font-mono font-semibold">{member.staffCode}</td>
                        <td className="px-6 py-4">
                          {isAdmin ? (
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
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* 5. PAGINATION PANEL */}
      {totalItems > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#222222] border border-zinc-800 p-5 rounded-2xl shadow-md text-sm text-zinc-400">
          <div>
            Hiển thị <span className="font-semibold text-white">{startIndex}–{endIndex}</span> / <span className="font-semibold text-white">{totalItems}</span> {activeTab === 'users' ? 'người dùng' : 'nhân viên'}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition duration-150"
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
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
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition duration-150"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ================= MÀN HÌNH 3: FORM TẠO TÀI KHOẢN NHÂN VIÊN ================= */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div onClick={closeCreateModal} className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity" />

          {/* Modal Content */}
          <div className="relative bg-[#1e1e1e] border border-zinc-800 w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <UserPlus className="text-[#4ade80]" size={20} />
                Tạo tài khoản nhân viên
              </h2>
              <button
                onClick={closeCreateModal}
                className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Warning Banner */}
            <div className="bg-sky-500/10 border-b border-sky-500/20 px-6 py-4 flex items-start gap-3">
              <Info className="text-sky-400 shrink-0 mt-0.5" size={18} />
              <div>
                <p className="text-xs font-semibold text-sky-400 uppercase tracking-wider mb-0.5">Quyền Hạn Hệ Thống</p>
                <p className="text-sm text-zinc-300">Chỉ Admin mới có quyền tạo tài khoản nhân viên mới trong hệ thống.</p>
              </div>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateStaff} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Họ tên */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Họ tên</label>
                  <input
                    type="text"
                    required
                    placeholder="Nhập họ và tên"
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    className="w-full px-4 py-3 bg-[#242424] border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-[#4ade80] focus:ring-1 focus:ring-[#4ade80] transition text-sm"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="username@parking.com"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 bg-[#242424] border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-[#4ade80] focus:ring-1 focus:ring-[#4ade80] transition text-sm"
                  />
                </div>

                {/* Số điện thoại */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Số điện thoại</label>
                  <input
                    type="text"
                    placeholder="Nhập số điện thoại (tùy chọn)"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 bg-[#242424] border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-[#4ade80] focus:ring-1 focus:ring-[#4ade80] transition text-sm"
                  />
                </div>

                {/* Mật khẩu */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Mật khẩu</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Mật khẩu khởi tạo"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full pl-4 pr-10 py-3 bg-[#242424] border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-[#4ade80] focus:ring-1 focus:ring-[#4ade80] transition text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-zinc-300"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-1 italic">Nhân viên đổi mật khẩu sau lần đăng nhập đầu</p>
                </div>

                {/* Role */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full px-4 py-3 bg-[#242424] border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-[#4ade80] focus:ring-1 focus:ring-[#4ade80] transition text-sm cursor-pointer appearance-none"
                    style={{
                      backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23a1a1aa' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                      backgroundPosition: 'right 0.75rem center',
                      backgroundSize: '1.25rem 1.25rem',
                      backgroundRepeat: 'no-repeat'
                    }}
                  >
                    <option value="Staff">Staff</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>

                {/* Mã nhân viên (Readonly) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Mã nhân viên (Tự động)</label>
                  <input
                    type="text"
                    readOnly
                    value={`Tự động tạo: ${generatedStaffCode}`}
                    className="w-full px-4 py-3 bg-[#2d2d2d] border border-zinc-800 rounded-xl text-zinc-400 select-none text-sm font-mono font-semibold"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-850">
                <button
                  type="button"
                  onClick={closeCreateModal}
                  className="px-5 py-3 border border-zinc-700 hover:bg-zinc-800 text-zinc-300 font-semibold rounded-xl text-sm transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-3 bg-[#4ade80] hover:bg-[#34c76d] text-zinc-950 font-bold rounded-xl text-sm transition"
                >
                  Tạo tài khoản
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MÀN HÌNH 4: CONFIRM DIALOG 1 (VÔ HIỆU HÓA TÀI KHOẢN) ================= */}
      {showBlockDialog && selectedAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setShowBlockDialog(false)} className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity" />

          <div className="relative bg-[#1e1e1e] border border-zinc-800 w-full max-w-md rounded-2xl p-6 text-center shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-150">
            {/* Warning Icon Container */}
            <div className="mx-auto w-14 h-14 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle size={28} />
            </div>

            {/* Header Title */}
            <h3 className="text-lg font-bold text-white mb-2">
              {selectedAccount.status === 'Hoạt động' ? 'Vô hiệu hóa tài khoản?' : 'Kích hoạt lại tài khoản?'}
            </h3>

            {/* Dialog Content */}
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

            {/* Actions */}
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setShowBlockDialog(false)}
                className="w-1/2 py-3 border border-zinc-700 hover:bg-zinc-800 text-zinc-300 font-semibold rounded-xl text-sm transition"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={confirmToggleStatus}
                className={`w-1/2 py-3 font-semibold rounded-xl text-sm transition text-white ${
                  selectedAccount.status === 'Hoạt động'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-emerald-500 hover:bg-emerald-600'
                }`}
              >
                {selectedAccount.status === 'Hoạt động' ? 'Vô hiệu hóa' : 'Kích hoạt'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MÀN HÌNH 4: CONFIRM DIALOG 2 (ĐỔI ROLE NHÂN VIÊN) ================= */}
      {showRoleDialog && selectedAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setShowRoleDialog(false)} className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity" />

          <div className="relative bg-[#1e1e1e] border border-zinc-800 w-full max-w-md rounded-2xl p-6 text-center shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-150">
            {/* Warning Shield Icon */}
            <div className="mx-auto w-14 h-14 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full flex items-center justify-center mb-4">
              <Shield size={28} />
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-white mb-2">
              Đổi role nhân viên?
            </h3>

            {/* Content Text */}
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

            {/* Action buttons */}
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowRoleDialog(false);
                  setSelectedAccount(null);
                  setPendingRoleChange('');
                }}
                className="w-1/2 py-3 border border-zinc-700 hover:bg-zinc-800 text-zinc-300 font-semibold rounded-xl text-sm transition"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={confirmRoleChange}
                className="w-1/2 py-3 bg-[#4ade80] hover:bg-[#34c76d] text-zinc-950 font-bold rounded-xl text-sm transition"
              >
                Xác nhận đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
