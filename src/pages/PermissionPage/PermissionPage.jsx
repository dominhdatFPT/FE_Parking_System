import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../../contexts/useAuth';
import {
  Users,
  KeyRound,
  History,
  LayoutDashboard,
  ArrowDownUp,
  Boxes,
  Package,
  BarChart3,
  Shield,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  Search,
  X,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Download
} from 'lucide-react';
import PermissionToggleCard from './PermissionToggleCard';
import AdminAccountRow from './AdminAccountRow';

// Grouping structure for permissions
const PERMISSION_GROUPS = [
  {
    category: 'Tổng quan & Báo cáo',
    permissions: [1, 5]
  },
  {
    category: 'Vận hành Bãi xe',
    permissions: [2, 3]
  },
  {
    category: 'Cấu hình & Hệ thống',
    permissions: [4, 6]
  }
];

// Mock permissions details definition
const AVAILABLE_PERMISSIONS = [
  { id: 1, icon: LayoutDashboard, name: 'Xem tổng quan bãi', desc: 'Cho phép truy cập Dashboard, theo dõi các chỉ số KPI, và thống kê lượt xe trong ngày.' },
  { id: 2, icon: ArrowDownUp, name: 'Xử lý xe vào / ra', desc: 'Cho phép ghi nhận lượt xe vào bãi, chụp ảnh nhận diện biển số và xác nhận xe ra.' },
  { id: 3, icon: Boxes, name: 'Quản lý phiên gửi xe', desc: 'Cho phép xem chi tiết, chỉnh sửa thông tin thủ công, hoặc kết thúc cưỡng bức các phiên gửi xe.' },
  { id: 4, icon: Package, name: 'Quản lý gói & giá vé', desc: 'Cấu hình bảng giá gửi xe lượt, đăng ký/gia hạn/chỉnh sửa các gói gửi xe tháng của khách hàng.' },
  { id: 5, icon: BarChart3, name: 'Xem báo cáo & doanh thu', desc: 'Truy cập báo cáo doanh thu chi tiết theo ngày/tháng/năm, thống kê công suất và xuất file Excel.' },
  { id: 6, icon: Shield, name: 'Phân quyền & cài đặt hệ thống', desc: 'Quyền cao nhất dành cho Super Admin để quản lý danh sách admin, sửa đổi vai trò và cấu hình hệ thống.' }
];

export default function PermissionPage() {
  const { user } = useAuth();
  const loggedInUserName = user?.fullName || user?.name || 'Nguyễn Văn A';

  // 1. Password Verification State
  const [isVerified, setIsVerified] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // 2. Panel Controls & Selection
  const [selectedAccountId, setSelectedAccountId] = useState(1);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalChanges7Days, setTotalChanges7Days] = useState(8);

  // 3. User Data & Permissions Store
  const [accounts, setAccounts] = useState([
    {
      id: 1,
      name: 'Nguyễn Văn A',
      email: 'superadmin@parking.com',
      role: 'Super Admin',
      status: 'Active',
      lastLogin: '25/06/2026 15:30',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80'
    },
    {
      id: 2,
      name: 'Trần Thị B',
      email: 'admin.b@parking.com',
      role: 'Admin',
      status: 'Active',
      lastLogin: '25/06/2026 14:15',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80'
    },
    {
      id: 3,
      name: 'Lê Văn C',
      email: 'viewer.c@parking.com',
      role: 'Viewer',
      status: 'Active',
      lastLogin: '24/06/2026 09:45',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80'
    },
    {
      id: 4,
      name: 'Phạm Minh D',
      email: 'admin.d@parking.com',
      role: 'Admin',
      status: 'Blocked',
      lastLogin: '20/06/2026 18:20',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100&q=80'
    }
  ]);

  const [permissionsState, setPermissionsState] = useState({
    1: { 1: true, 2: true, 3: true, 4: true, 5: true, 6: true }, // Super Admin gets all
    2: { 1: true, 2: true, 3: true, 4: true, 5: true, 6: false }, // Admin
    3: { 1: true, 2: false, 3: false, 4: false, 5: true, 6: false }, // Viewer
    4: { 1: true, 2: true, 3: true, 4: false, 5: false, 6: false } // Blocked Admin
  });

  // 4. Draft Permissions (Save workflow state)
  const [draftPermissions, setDraftPermissions] = useState({});
  const [isSavingPermissions, setIsSavingPermissions] = useState(false);

  // Sync draft permissions whenever the selected account changes or base permissions update
  useEffect(() => {
    if (selectedAccountId) {
      setDraftPermissions(permissionsState[selectedAccountId] || {});
    }
  }, [selectedAccountId, permissionsState]);

  // Check if draft permissions have modifications
  const isDirty = useMemo(() => {
    if (!selectedAccountId || !draftPermissions) return false;
    const original = permissionsState[selectedAccountId] || {};
    return JSON.stringify(original) !== JSON.stringify(draftPermissions);
  }, [draftPermissions, permissionsState, selectedAccountId]);

  // 5. Add New Admin Flow States
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);
  const [addAdminName, setAddAdminName] = useState('');
  const [addAdminEmail, setAddAdminEmail] = useState('');
  const [addAdminRole, setAddAdminRole] = useState('Admin');
  const [addAdminError, setAddAdminError] = useState('');

  // 6. Confirm Dialog for critical permissions
  const [confirmDialog, setConfirmDialog] = useState(null); // { permissionId, nextValue }

  // 7. System Feeback Toast
  const [successToast, setSuccessToast] = useState(null);

  // 8. Audit Log & Filters
  const [auditLogs, setAuditLogs] = useState([
    { id: 1, type: 'permission', color: 'green', text: 'đã cập nhật quyền **Quản lý gói & giá vé** cho **Trần Thị B**', relTime: '5 phút trước' },
    { id: 2, type: 'status', color: 'red', text: 'đã khóa tài khoản của **Phạm Minh D**', relTime: '2 giờ trước' },
    { id: 3, type: 'status', color: 'blue', text: 'đã mở khóa tài khoản của **Lê Văn C**', relTime: '1 ngày trước' },
    { id: 4, type: 'permission', color: 'green', text: 'đã gán quyền **Xem báo cáo & doanh thu** cho **Trần Thị B**', relTime: '3 ngày trước' },
    { id: 5, type: 'system', color: 'blue', text: 'Hệ thống đã tự động cấp quyền Super Admin cho **Nguyễn Văn A**', relTime: '7 ngày trước' }
  ]);
  const [logSearchQuery, setLogSearchQuery] = useState('');
  const [logFilterType, setLogFilterType] = useState('all');

  const filteredLogs = useMemo(() => {
    return auditLogs.filter(log => {
      const matchesSearch = log.text.toLowerCase().includes(logSearchQuery.toLowerCase());
      if (logFilterType === 'all') return matchesSearch;
      return log.type === logFilterType && matchesSearch;
    });
  }, [auditLogs, logSearchQuery, logFilterType]);

  const selectedAccount = useMemo(() => {
    return accounts.find(acc => acc.id === selectedAccountId) || accounts[0];
  }, [accounts, selectedAccountId]);

  const filteredAccounts = useMemo(() => {
    return accounts.filter(acc => 
      acc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      acc.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [accounts, searchQuery]);

  // Verification Form Submit
  const handleVerify = (e) => {
    e.preventDefault();
    if (!passwordInput.trim()) {
      setVerificationError('Vui lòng nhập mật khẩu.');
      return;
    }
    
    setIsVerifying(true);
    setVerificationError('');
    
    setTimeout(() => {
      if (passwordInput === 'admin123') {
        setIsVerified(true);
        setIsVerifying(false);
      } else {
        setVerificationError('Mật khẩu xác thực không đúng. Vui lòng thử lại. (Gợi ý: admin123)');
        setIsVerifying(false);
      }
    }, 850);
  };

  // Toggle Account Active Status
  const handleToggleLock = (accountId) => {
    const target = accounts.find(acc => acc.id === accountId);
    if (!target || target.role === 'Super Admin') return; // Cannot lock Super Admin

    const isBlocking = target.status === 'Active';
    const nextStatus = isBlocking ? 'Blocked' : 'Active';

    // Update account list status
    setAccounts(prev => prev.map(acc => acc.id === accountId ? { ...acc, status: nextStatus } : acc));

    // Update audit logs
    const actionText = isBlocking 
      ? `đã khóa tài khoản của **${target.name}**`
      : `đã mở khóa tài khoản của **${target.name}**`;
    
    const newLog = {
      id: Date.now(),
      type: 'status',
      color: isBlocking ? 'red' : 'blue',
      text: `**${loggedInUserName}** ${actionText}`,
      relTime: 'Vừa xong'
    };

    setAuditLogs(prev => [newLog, ...prev]);
    setTotalChanges7Days(c => c + 1);
  };

  // Handle Switch Trigger
  const handleTogglePermission = (permissionId, val) => {
    if (selectedAccount.role === 'Super Admin') return; // Super admin has permanent rules
    if (permissionId === 6) return; // Cannot toggle root setup for non-superadmin

    const isCritical = [1, 2, 3, 6].includes(permissionId);

    // If turning OFF a critical permission, trigger confirmation dialogue
    if (isCritical && !val) {
      setConfirmDialog({ permissionId, nextValue: val });
    } else {
      // Just update local draft state
      setDraftPermissions(prev => ({
        ...prev,
        [permissionId]: val
      }));
    }
  };

  // Confirm Critical Revocation Dialog Action
  const handleConfirmCritical = () => {
    if (confirmDialog) {
      const { permissionId, nextValue } = confirmDialog;
      setDraftPermissions(prev => ({
        ...prev,
        [permissionId]: nextValue
      }));
      setConfirmDialog(null);
    }
  };

  // Save changes action
  const handleSaveChanges = () => {
    setIsSavingPermissions(true);
    
    setTimeout(() => {
      const original = permissionsState[selectedAccountId] || {};
      const changedList = [];
      AVAILABLE_PERMISSIONS.forEach(perm => {
        if (original[perm.id] !== draftPermissions[perm.id]) {
          const oldVal = original[perm.id] ? 'Bật' : 'Tắt';
          const newVal = draftPermissions[perm.id] ? 'Bật' : 'Tắt';
          changedList.push(`**${perm.name}** (từ **${oldVal}** thành **${newVal}**)`);
        }
      });

      // Update base permission state
      setPermissionsState(prev => ({
        ...prev,
        [selectedAccountId]: draftPermissions
      }));

      // Log updates
      const actionText = changedList.length > 0 
        ? `đã cập nhật các quyền của **${selectedAccount.name}**: ${changedList.join(', ')}`
        : `đã ghi nhận cấu hình quyền cho **${selectedAccount.name}**`;

      const newLog = {
        id: Date.now(),
        type: 'permission',
        color: 'green',
        text: `**${loggedInUserName}** ${actionText}`,
        relTime: 'Vừa xong'
      };

      setAuditLogs(prev => [newLog, ...prev]);
      setTotalChanges7Days(c => c + 1);

      setIsSavingPermissions(false);
      setSuccessToast(`Đã lưu thay đổi phân quyền cho ${selectedAccount.name}!`);
      setTimeout(() => setSuccessToast(null), 3000);
    }, 800);
  };

  // Cancel changes action
  const handleCancelChanges = () => {
    setDraftPermissions(permissionsState[selectedAccountId] || {});
  };

  // Close Add Admin Modal
  const handleCloseAddAdmin = () => {
    setIsAddAdminOpen(false);
    setAddAdminName('');
    setAddAdminEmail('');
    setAddAdminRole('Admin');
    setAddAdminError('');
  };

  // Create new Admin account action
  const handleCreateAdmin = (e) => {
    e.preventDefault();
    if (!addAdminName.trim() || !addAdminEmail.trim()) {
      setAddAdminError('Vui lòng điền đầy đủ họ tên và email.');
      return;
    }
    
    // Check email uniqueness
    if (accounts.some(acc => acc.email.toLowerCase() === addAdminEmail.toLowerCase().trim())) {
      setAddAdminError('Email này đã được sử dụng bởi một Admin khác.');
      return;
    }

    const newId = accounts.length + 1;
    const newAccount = {
      id: newId,
      name: addAdminName.trim(),
      email: addAdminEmail.toLowerCase().trim(),
      role: addAdminRole,
      status: 'Active',
      lastLogin: 'Chưa từng đăng nhập',
      avatar: `https://images.unsplash.com/photo-${1500000000000 + newId * 20000}?auto=format&fit=crop&w=100&h=100&q=80`
    };

    setAccounts(prev => [...prev, newAccount]);

    const isNewAdmin = addAdminRole === 'Admin';
    setPermissionsState(prev => ({
      ...prev,
      [newId]: {
        1: true,
        2: isNewAdmin,
        3: isNewAdmin,
        4: false,
        5: true,
        6: false
      }
    }));

    const newLog = {
      id: Date.now(),
      type: 'status',
      color: 'blue',
      text: `**${loggedInUserName}** đã tạo tài khoản Admin mới cho **${newAccount.name}** (${addAdminRole})`,
      relTime: 'Vừa xong'
    };
    setAuditLogs(prev => [newLog, ...prev]);

    setSuccessToast(`Đã tạo thành công tài khoản Admin ${newAccount.name}!`);
    setTimeout(() => setSuccessToast(null), 3000);
    
    setSelectedAccountId(newId);
    setIsPanelOpen(true);
    handleCloseAddAdmin();
  };

  // Export audit log mock action
  const handleExportLogs = () => {
    alert(`Đã kết xuất thành công ${filteredLogs.length} dòng lịch sử log ra file CSV!`);
  };

  const activeAdminsCount = useMemo(() => {
    return accounts.filter(a => a.status === 'Active').length;
  }, [accounts]);

  // Security Verification Backdrop View
  if (!isVerified) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1E1B4B]/20 backdrop-blur-md px-4">
        <div className="w-full max-w-md bg-white rounded-3xl border border-[#E0E7FF] p-6 shadow-[0_12px_36px_rgba(24,95,165,0.08)] transition-all duration-300">
          <div className="flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-2xl bg-[#EFF6FF] text-[#185FA5] flex items-center justify-center mb-4 border border-[#E0E7FF]">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-[#1E1B4B] tracking-tight">
              Xác thực Danh tính Super Admin
            </h3>
            <p className="mt-1.5 text-xs text-[#6B7280] font-medium max-w-[34ch] leading-normal">
              Yêu cầu xác nhận mật khẩu tài khoản để truy cập trang Phân quyền & Cấu hình bảo mật.
            </p>
          </div>

          <form onSubmit={handleVerify} className="mt-6 space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-1.5">
                Mật khẩu xác nhận
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Nhập mật khẩu của bạn..."
                  style={{ color: '#1E1B4B', backgroundColor: '#F0F4FF' }}
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-[#E0E7FF] text-[#1E1B4B] placeholder-[#6B7280] focus:bg-white focus:border-[#185FA5] focus:ring-1 focus:ring-[#185FA5] text-xs focus:outline-none transition-all font-medium"
                  disabled={isVerifying}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#1E1B4B] transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-[10px] text-[#6B7280] mt-2.5 font-medium">
                Gợi ý: Mật khẩu mặc định là <code className="font-mono bg-[#F0F4FF] px-1.5 py-0.5 rounded text-[#185FA5] font-semibold">admin123</code>
              </p>
            </div>

            {verificationError && (
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-50 border border-rose-100 text-[#DC2626]">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span className="text-xs font-semibold leading-normal">{verificationError}</span>
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={isVerifying}
                className="flex-1 py-2.5 rounded-xl bg-[#185FA5] hover:bg-[#134d85] disabled:bg-[#185FA5]/60 text-white font-bold text-xs shadow-md shadow-[#185FA5]/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isVerifying ? (
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <span>Xác nhận danh tính</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* SECTION 1: Summary Metric KPI Cards */}
      <div className="grid gap-5 md:grid-cols-3">
        {/* KPI 1 */}
        <div className="bg-white border border-[#E0E7FF] p-5 rounded-2xl shadow-[0_2px_12px_rgba(24,95,165,0.02)] flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-[#EFF6FF] text-[#185FA5] border border-[#E0E7FF] flex items-center justify-center">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">
              Tài khoản Admin
            </p>
            <h3 className="text-xl font-bold text-[#1E1B4B] mt-1 font-mono">
              {accounts.length}
            </h3>
            <p className="text-[10px] font-medium text-[#6B7280] mt-0.5">
              Đang hoạt động: <span className="font-semibold font-mono text-[#15803D]">{activeAdminsCount}</span>
            </p>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white border border-[#E0E7FF] p-5 rounded-2xl shadow-[0_2px_12px_rgba(24,95,165,0.02)] flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-[#F0FDF4] text-[#15803D] border border-[#DCFCE7] flex items-center justify-center">
            <KeyRound className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">
              Phiên đăng nhập hôm nay
            </p>
            <h3 className="text-xl font-bold text-[#1E1B4B] mt-1 font-mono">
              12
            </h3>
            <p className="text-[10px] font-medium text-[#6B7280] mt-0.5">
              Gần nhất: <span className="font-semibold font-mono text-[#1E1B4B]">15:30</span>
            </p>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white border border-[#E0E7FF] p-5 rounded-2xl shadow-[0_2px_12px_rgba(24,95,165,0.02)] flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-[#FFFBEB] text-[#D97706] border border-[#FEF3C7] flex items-center justify-center">
            <History className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">
              Thay đổi quyền (7 ngày)
            </p>
            <h3 className="text-xl font-bold text-[#1E1B4B] mt-1 font-mono">
              {totalChanges7Days}
            </h3>
            <p className="text-[10px] font-medium text-[#6B7280] mt-0.5">
              Vừa cập nhật: <span className="font-semibold text-[#1E1B4B] font-mono">Vài giây trước</span>
            </p>
          </div>
        </div>
      </div>

      {/* Grid splits accounts table and permissions grid */}
      <div className={`grid gap-6 transition-all duration-300 ${isPanelOpen ? 'lg:grid-cols-3' : 'lg:grid-cols-1'} items-start`}>
        
        {/* SECTION 2: Admin Accounts Table */}
        <div className={`${isPanelOpen ? 'lg:col-span-2' : 'lg:col-span-1'} bg-white border border-[#E0E7FF] rounded-2xl shadow-[0_2px_12px_rgba(24,95,165,0.02)] overflow-hidden`}>
          <div className="px-4 py-3 border-b border-[#E0E7FF] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-[#1E1B4B] uppercase tracking-wider">
                Danh sách tài khoản Admin
              </h3>
              <p className="mt-1 text-xs text-[#6B7280] font-medium">
                Quản lý phân cấp người dùng và trạng thái hoạt động hệ thống.
              </p>
            </div>
            
            <div className="flex items-center gap-3 self-end sm:self-center">
              {/* Search Input */}
              <div className="relative max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#6B7280]" />
                <input
                  type="text"
                  placeholder="Tìm kiếm admin..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ color: '#1E1B4B', backgroundColor: '#FFFFFF' }}
                  className="w-full pl-9 pr-3.5 py-1.5 rounded-lg border border-[#E0E7FF] focus:border-[#185FA5] focus:ring-1 focus:ring-[#185FA5] text-xs text-[#1E1B4B] placeholder-[#6B7280] focus:outline-none transition-all"
                />
              </div>

              {/* Add Admin Button */}
              <button
                type="button"
                onClick={() => setIsAddAdminOpen(true)}
                className="flex items-center gap-1.5 bg-[#185FA5] hover:bg-[#134d85] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer whitespace-nowrap active:scale-95"
              >
                <Plus className="h-3.5 w-3.5 animate-pulse" />
                <span>Thêm Admin</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F0F4FF] border-b border-[#E0E7FF]">
                  <th className="px-3 py-2 text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">
                    Avatar & Tên
                  </th>
                  <th className="px-3 py-2 text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">
                    Cấp độ
                  </th>
                  <th className="px-3 py-2 text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-3 py-2 text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">
                    Đăng nhập cuối
                  </th>
                  <th className="px-3 py-2 text-[10px] font-bold text-[#6B7280] uppercase tracking-wider text-right">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E0E7FF]">
                {filteredAccounts.length > 0 ? (
                  filteredAccounts.map((account) => (
                    <AdminAccountRow
                      key={account.id}
                      account={account}
                      isLoggedInUser={account.id === 1} // ID 1 is logged-in superadmin in mockup
                      isSelected={account.id === selectedAccountId && isPanelOpen}
                      onSelect={(id) => {
                        setSelectedAccountId(id);
                        setIsPanelOpen(true);
                      }}
                      onToggleLock={handleToggleLock}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-5 py-8 text-center text-xs font-bold text-[#6B7280]">
                      Không tìm thấy tài khoản admin nào phù hợp.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 3: Permission Matrix Grid */}
        {isPanelOpen && (
          <div className={`bg-white border rounded-2xl p-5 relative transition-all duration-300 ${
            isDirty 
              ? 'border-amber-300 shadow-[0_4px_20px_rgba(217,119,6,0.06)]' 
              : 'border-[#E0E7FF] shadow-[0_2px_12px_rgba(24,95,165,0.02)]'
          }`}>
            <div className="flex items-start justify-between border-b border-[#E0E7FF] pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-[#185FA5] bg-[#EFF6FF] px-2 py-0.5 rounded border border-[#E0E7FF]">
                    Cấu hình quyền hạn
                  </span>
                  {isDirty ? (
                    <span className="text-[9px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                      Đang chỉnh sửa
                    </span>
                  ) : (
                    <span className="text-[9px] font-bold text-[#6B7280] bg-[#F5F5F4] border border-[#E5E5E0] px-1.5 py-0.5 rounded">
                      Đang xem
                    </span>
                  )}
                </div>
                <h3 className="mt-2 text-xs font-medium text-[#6B7280]">
                  Đang chỉnh quyền cho: <strong className="text-[#1E1B4B] font-bold">{selectedAccount.name}</strong>
                </h3>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => {
                  setIsPanelOpen(false);
                  handleCancelChanges();
                }}
                className="text-[#6B7280] hover:text-[#1E1B4B] p-1 rounded-lg hover:bg-[#F0F4FF] transition-all cursor-pointer"
                title="Đóng bảng phân quyền"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable Container with Grouped Categories */}
            <div className="mt-4 space-y-4 max-h-[460px] overflow-y-auto pr-1 scrollbar-thin">
              {PERMISSION_GROUPS.map((group) => (
                <div key={group.category} className="space-y-2.5">
                  <h4 className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider border-b border-[#E0E7FF]/70 pb-1">
                    {group.category}
                  </h4>
                  <div className="flex flex-col gap-3">
                    {group.permissions.map((permId) => {
                      const perm = AVAILABLE_PERMISSIONS.find(p => p.id === permId);
                      const checked = draftPermissions ? !!draftPermissions[perm.id] : false;
                      const isDisabled = selectedAccount.role === 'Super Admin' || (perm.id === 6 && selectedAccount.role !== 'Super Admin');
                      
                      let disabledReason = null;
                      if (selectedAccount.role === 'Super Admin') {
                        disabledReason = "Tài khoản Super Admin sở hữu toàn bộ quyền và không thể chỉnh sửa.";
                      } else if (perm.id === 6 && selectedAccount.role !== 'Super Admin') {
                        disabledReason = "Quyền hệ thống này chỉ dành riêng cho Super Admin.";
                      }

                      return (
                        <PermissionToggleCard
                          key={perm.id}
                          icon={perm.icon}
                          name={perm.name}
                          description={perm.desc}
                          checked={checked}
                          onChange={(val) => handleTogglePermission(perm.id, val)}
                          disabled={isDisabled || isSavingPermissions}
                          disabledReason={disabledReason}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {selectedAccount.role === 'Super Admin' && (
              <div className="mt-4 p-3 rounded-xl bg-[#EFF6FF] border border-[#E0E7FF] flex gap-2">
                <ShieldCheck className="h-4 w-4 text-[#185FA5] shrink-0 mt-0.5" />
                <span className="text-[10px] text-[#185FA5] font-medium leading-normal">
                  Tài khoản <strong>Super Admin</strong> sở hữu toàn bộ quyền hoạt động và không thể tùy biến cấu hình chi tiết.
                </span>
              </div>
            )}

            {/* SAVE WORKFLOW ACTION BAR */}
            {isDirty && (
              <div className="sticky bottom-0 left-0 right-0 mt-6 -mx-5 -mb-5 p-4 bg-slate-50 border-t border-[#E0E7FF] rounded-b-2xl flex items-center justify-between gap-3 animate-slide-up shadow-[0_-4px_12px_rgba(0,0,0,0.03)] z-10">
                <span className="text-[9px] text-[#6B7280] font-bold">
                  Có thay đổi chưa lưu!
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={isSavingPermissions}
                    onClick={handleCancelChanges}
                    className="px-2.5 py-1.5 rounded-lg border border-[#E0E7FF] text-[#6B7280] hover:bg-slate-150 text-[10px] font-bold cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    disabled={isSavingPermissions}
                    onClick={handleSaveChanges}
                    className="px-2.5 py-1.5 rounded-lg bg-[#185FA5] text-white hover:bg-[#134d85] text-[10px] font-bold cursor-pointer transition-colors shadow-sm flex items-center gap-1 disabled:bg-[#185FA5]/60 disabled:cursor-not-allowed"
                  >
                    {isSavingPermissions ? (
                      <>
                        <svg className="animate-spin h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Đang lưu...</span>
                      </>
                    ) : (
                      <span>Lưu thay đổi</span>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* SECTION 4: Change History (Audit Log) */}
      <div className="bg-white border border-[#E0E7FF] rounded-2xl shadow-[0_2px_12px_rgba(24,95,165,0.02)] p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E0E7FF] pb-3.5 mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold text-[#1E1B4B] uppercase tracking-widest">
              Lịch sử thay đổi hệ thống
            </h3>
            <span className="text-[10px] font-bold bg-[#F0F4FF] text-[#185FA5] px-2 py-0.5 rounded-full border border-[#E0E7FF]">
              {filteredLogs.length} bản ghi
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input for Logs */}
            <div className="relative max-w-xs">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#6B7280]" />
              <input
                type="text"
                placeholder="Tìm kiếm log..."
                value={logSearchQuery}
                onChange={(e) => setLogSearchQuery(e.target.value)}
                style={{ color: '#1E1B4B', backgroundColor: '#F0F4FF' }}
                className="pl-8 pr-3 py-1.5 rounded-lg border border-[#E0E7FF] text-xs text-[#1E1B4B] placeholder-[#6B7280] focus:bg-white focus:outline-none transition-all w-44"
              />
            </div>

            {/* Filter Dropdown */}
            <select
              value={logFilterType}
              onChange={(e) => setLogFilterType(e.target.value)}
              style={{ color: '#1E1B4B', backgroundColor: '#F0F4FF' }}
              className="px-2 py-1.5 rounded-lg border border-[#E0E7FF] text-xs font-medium focus:bg-white focus:outline-none cursor-pointer"
            >
              <option value="all">Tất cả hoạt động</option>
              <option value="permission">Thay đổi quyền</option>
              <option value="status">Trạng thái tài khoản</option>
            </select>

            {/* Export Logs Button */}
            <button
              type="button"
              onClick={handleExportLogs}
              className="inline-flex items-center gap-1 bg-white hover:bg-[#F0F4FF] text-[#185FA5] border border-[#E0E7FF] px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Xuất Excel</span>
            </button>
          </div>
        </div>

        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
          {filteredLogs.length > 0 ? (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between py-1 border-b border-[#E0E7FF]/40 last:border-0"
              >
                <div className="flex items-center gap-3">
                  {/* Dot Color */}
                  <span
                    className={`h-2 w-2 rounded-full shrink-0 ${
                      log.color === 'green'
                        ? 'bg-[#15803D]'
                        : log.color === 'red'
                        ? 'bg-[#DC2626]'
                        : 'bg-[#185FA5]'
                    }`}
                  />
                  
                  {/* Text Parser (bold formatter) */}
                  <p 
                    className="text-xs text-[#6B7280] font-medium"
                    dangerouslySetInnerHTML={{
                      __html: log.text
                        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-[#1E1B4B]">$1</strong>')
                    }}
                  />
                </div>

                {/* Timestamp */}
                <span className="text-[10px] text-[#6B7280] font-medium font-mono whitespace-nowrap pl-4">
                  {log.relTime}
                </span>
              </div>
            ))
          ) : (
            <p className="text-center text-xs font-bold text-[#6B7280] py-4">
              Không tìm thấy dòng lịch sử log nào khớp với bộ lọc.
            </p>
          )}
        </div>
      </div>

      {/* ADD ADMIN DIALOG */}
      {isAddAdminOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1E1B4B]/25 backdrop-blur-md px-4 animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl border border-[#E0E7FF] p-6 shadow-[0_12px_36px_rgba(24,95,165,0.08)] transition-all duration-300">
            <div className="flex items-center justify-between border-b border-[#E0E7FF] pb-3 mb-4">
              <h3 className="text-sm font-bold text-[#1E1B4B] uppercase tracking-wider">
                Tạo tài khoản Admin mới
              </h3>
              <button
                type="button"
                onClick={handleCloseAddAdmin}
                className="text-[#6B7280] hover:text-[#1E1B4B] p-1 rounded-lg hover:bg-[#F0F4FF] transition-all cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-1.5">
                  Họ và tên
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nhập họ và tên..."
                  value={addAdminName}
                  onChange={(e) => setAddAdminName(e.target.value)}
                  style={{ color: '#1E1B4B', backgroundColor: '#F0F4FF' }}
                  className="w-full pl-3.5 pr-3.5 py-2 rounded-xl border border-[#E0E7FF] text-[#1E1B4B] placeholder-[#6B7280] focus:bg-white focus:border-[#185FA5] focus:ring-1 focus:ring-[#185FA5] text-xs focus:outline-none transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-1.5">
                  Địa chỉ Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="admin.name@parking.com"
                  value={addAdminEmail}
                  onChange={(e) => setAddAdminEmail(e.target.value)}
                  style={{ color: '#1E1B4B', backgroundColor: '#F0F4FF' }}
                  className="w-full pl-3.5 pr-3.5 py-2 rounded-xl border border-[#E0E7FF] text-[#1E1B4B] placeholder-[#6B7280] focus:bg-white focus:border-[#185FA5] focus:ring-1 focus:ring-[#185FA5] text-xs focus:outline-none transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-1.5">
                  Cấp độ quyền hạn
                </label>
                <select
                  value={addAdminRole}
                  onChange={(e) => setAddAdminRole(e.target.value)}
                  style={{ color: '#1E1B4B', backgroundColor: '#F0F4FF' }}
                  className="w-full pl-3.5 pr-3.5 py-2 rounded-xl border border-[#E0E7FF] text-[#1E1B4B] focus:bg-white focus:border-[#185FA5] focus:ring-1 focus:ring-[#185FA5] text-xs focus:outline-none transition-all font-medium cursor-pointer"
                >
                  <option value="Admin">Admin (Đầy đủ quyền vận hành)</option>
                  <option value="Viewer">Viewer (Chỉ xem dữ liệu)</option>
                </select>
              </div>

              {addAdminError && (
                <p className="text-[10px] text-[#DC2626] font-semibold">{addAdminError}</p>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCloseAddAdmin}
                  className="flex-1 py-2 rounded-xl bg-[#F5F5F4] text-[#6B7280] hover:bg-[#E5E5E0] font-bold text-xs active:scale-[0.98] transition-all cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-[#185FA5] hover:bg-[#134d85] text-white font-bold text-xs active:scale-[0.98] transition-all cursor-pointer"
                >
                  Tạo tài khoản
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CRITICAL PERMISSION REVOKE CONFIRM DIALOG */}
      {confirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1E1B4B]/20 backdrop-blur-md px-4 animate-fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl border border-[#E0E7FF] p-6 shadow-[0_12px_36px_rgba(24,95,165,0.08)] text-center">
            <div className="mx-auto h-12 w-12 rounded-2xl bg-rose-50 text-[#DC2626] flex items-center justify-center mb-4 border border-rose-100">
              <AlertTriangle className="h-6 w-6 animate-pulse" />
            </div>
            <h3 className="text-sm font-bold text-[#1E1B4B] uppercase tracking-wider">
              Xác nhận thu hồi quyền quan trọng
            </h3>
            <p className="mt-2 text-xs text-[#6B7280] font-medium leading-normal">
              Bạn có chắc chắn muốn thu hồi quyền <strong>{AVAILABLE_PERMISSIONS.find(p => p.id === confirmDialog.permissionId)?.name}</strong> từ <strong>{selectedAccount.name}</strong>?
            </p>
            <p className="mt-1 text-[10px] text-[#DC2626] font-semibold bg-rose-50/50 p-2 rounded-xl border border-rose-100/50 leading-normal">
              Quản trị viên này sẽ mất khả năng sử dụng hoặc quản trị chức năng trên hệ thống ngay lập tức.
            </p>

            <div className="flex items-center gap-3 mt-5">
              <button
                type="button"
                onClick={() => setConfirmDialog(null)}
                className="flex-1 py-2 rounded-xl bg-[#F5F5F4] text-[#6B7280] hover:bg-[#E5E5E0] font-bold text-xs active:scale-[0.98] transition-all cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmCritical}
                className="flex-1 py-2 rounded-xl bg-[#DC2626] hover:bg-[#b91c1c] text-white font-bold text-xs active:scale-[0.98] transition-all cursor-pointer"
              >
                Xác nhận thu hồi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS TOAST ALERTS */}
      {successToast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-[#F0FDF4] border border-[#DCFCE7] text-[#15803D] px-4 py-3 rounded-2xl shadow-lg animate-slide-in">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span className="text-xs font-semibold">{successToast}</span>
        </div>
      )}

    </div>
  );
}
