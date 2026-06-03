import { NavLink } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../constants/routes';
import Icon from '../../components/Icon';
import NotificationDropdown from '../../components/NotificationDropdown';
import SettingsDropdown from '../../components/SettingsDropdown';

// Helper functions for styling
const getStatusStyle = (state) => {
    const styles = {
        success: 'bg-green-100 text-green-800',
        warning: 'bg-yellow-100 text-yellow-800',
        error: 'bg-red-100 text-red-800',
    };
    return styles[state] || 'bg-gray-100 text-gray-800';
};

const getToneStyle = (tone) => {
    const styles = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        slate: 'bg-slate-50 text-slate-600',
        orange: 'bg-orange-50 text-orange-600',
    };
    return styles[tone] || 'bg-gray-50 text-gray-600';
};

function initials(name) {
    return name
        .split(' ')
        .slice(-2)
        .map((part) => part[0])
        .join('')
        .toUpperCase();
}

const menuItems = [
    { icon: 'dashboard', label: 'Tổng quan', href: ROUTES.HOME },
    { icon: 'manage_accounts', label: 'Quản lý tài khoản', href: ROUTES.ADMIN.USERS },
    { icon: 'security', label: 'Quyền truy cập', href: ROUTES.ADMIN.ROLES },
    { icon: 'settings', label: 'Cấu hình hệ thống', href: ROUTES.ADMIN.SYSTEM_CONFIG },
    { icon: 'history', label: 'Nhật ký hệ thống', href: ROUTES.ADMIN.AUDIT_LOG },
];

const summaryCards = [
    { icon: 'group', label: 'Tổng tài khoản', value: '248', detail: '+12 tài khoản mới', tone: 'blue' },
    { icon: 'verified_user', label: 'Đang hoạt động', value: '221', detail: '89% tổng hệ thống', tone: 'green' },
    { icon: 'admin_panel_settings', label: 'Quản trị viên', value: '18', detail: '4 nhóm quyền', tone: 'slate' },
    { icon: 'lock_clock', label: 'Tạm khóa', value: '9', detail: 'Cần rà soát', tone: 'orange' },
];

const users = [
    {
        name: 'Nguyễn Minh Anh',
        email: 'minhanh@parking.ai',
        role: 'Quản trị viên',
        department: 'Vận hành',
        lastActive: '20/05/2026 19:42',
        status: 'Hoạt động',
        state: 'success',
    },
    {
        name: 'Trần Quốc Huy',
        email: 'quochuy@parking.ai',
        role: 'Quản lý bãi xe',
        department: 'Bãi xe A1',
        lastActive: '20/05/2026 18:15',
        status: 'Hoạt động',
        state: 'success',
    },
    {
        name: 'Lê Hoàng Vy',
        email: 'hoangvy@parking.ai',
        role: 'Nhân viên cổng',
        department: 'Cổng chính',
        lastActive: '20/05/2026 16:08',
        status: 'Chờ xác minh',
        state: 'warning',
    },
    {
        name: 'Phạm Đức Long',
        email: 'duclong@parking.ai',
        role: 'Kế toán',
        department: 'Tài chính',
        lastActive: '18/05/2026 09:30',
        status: 'Tạm khóa',
        state: 'error',
    },
    {
        name: 'Vũ Thanh Hà',
        email: 'thanhha@parking.ai',
        role: 'Giám sát camera',
        department: 'An ninh',
        lastActive: '20/05/2026 13:22',
        status: 'Hoạt động',
        state: 'success',
    },
];

export default function AccountManagementPage() {
    const { user, role } = useAuth();

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 flex-shrink-0 bg-slate-900 text-white shadow-xl">
                <div className="space-y-6 p-4">
                    {/* Brand */}
                    <div className="flex items-center gap-3 border-b border-slate-700 pb-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded bg-blue-600">
                            <Icon name="local_parking" />
                        </div>
                        <div>
                            <h1 className="font-bold text-lg">Smart Parking AI</h1>
                            <p className="text-xs text-slate-400">Hệ thống quản trị</p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="space-y-1">
                        {menuItems.map((item) => (
                            <NavLink
                                key={item.label}
                                to={item.href}
                                end={item.href === ROUTES.HOME}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                                        isActive
                                            ? 'bg-blue-600 text-white shadow-lg'
                                            : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                                    }`
                                }
                            >
                                <Icon name={item.icon} />
                                <span>{item.label}</span>
                            </NavLink>
                        ))}
                    </nav>

                    {/* Footer */}
                    <div className="space-y-1 border-t border-slate-700 pt-4">
                        <a
                            href="#"
                            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800/50 hover:text-white"
                        >
                            <Icon name="help" />
                            <span>Hỗ trợ</span>
                        </a>
                        <a
                            href="#"
                            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-rose-300 transition hover:bg-slate-800/50 hover:text-rose-100"
                        >
                            <Icon name="logout" />
                            <span>Đăng xuất</span>
                        </a>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                {/* Header */}
                <header className="border-b border-gray-200 bg-white px-6 py-4 shadow-sm">
                    <div className="flex items-center justify-between gap-4">
                        {/* Search */}
                        <label className="flex flex-1 items-center gap-2 rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-600 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-200">
                            <Icon name="search" />
                            <input
                                placeholder="Tìm kiếm tài khoản, email, vai trò..."
                                type="search"
                                className="flex-1 bg-transparent outline-none"
                            />
                        </label>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                            <NotificationDropdown />
                            <SettingsDropdown
                                trigger={
                                    <button className="flex items-center gap-2 rounded-lg hover:bg-gray-100 p-2 transition">
                                        <span className="text-right">
                                            <strong className="block text-sm text-gray-900">{user?.fullName}</strong>
                                            <small className="text-xs text-gray-600">
                                                {role === 'admin' ? 'Quản trị viên' : 'Nhân viên'}
                                            </small>
                                        </span>
                                        <img
                                            alt="User profile"
                                            src={
                                                user?.avatarUrl ??
                                                'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=96&q=80'
                                            }
                                            className="h-10 w-10 rounded-full"
                                        />
                                    </button>
                                }
                            />
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <section className="space-y-6 p-6">
                    {/* Page Heading */}
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">Quản lý tài khoản</h2>
                            <p className="text-gray-600">Quản trị người dùng, vai trò truy cập và trạng thái tài khoản trong hệ thống.</p>
                        </div>
                        <div className="flex gap-3">
                            <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                                <Icon name="upload_file" />
                                Nhập danh sách
                            </button>
                            <button className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                                <Icon name="person_add" />
                                Thêm tài khoản
                            </button>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {summaryCards.map((card) => (
                            <div key={card.label} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition">
                                <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${getToneStyle(card.tone)} mb-4`}>
                                    <Icon name={card.icon} />
                                </div>
                                <p className="text-sm text-gray-600">{card.label}</p>
                                <strong className="text-2xl text-gray-900">{card.value}</strong>
                                <p className="text-xs text-gray-500 mt-1">{card.detail}</p>
                            </div>
                        ))}
                    </div>

                    {/* Filter Section */}
                    <div className="rounded-lg border border-gray-200 bg-white p-6">
                        <div className="grid gap-4 md:grid-cols-4">
                            <label>
                                <span className="block text-sm font-medium text-gray-700 mb-2">Tìm kiếm</span>
                                <div className="relative">
                                    <Icon name="search" />
                                    <input 
                                        placeholder="Tên, email hoặc bộ phận" 
                                        type="search"
                                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 pl-10 text-sm placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                    />
                                </div>
                            </label>
                            <label>
                                <span className="block text-sm font-medium text-gray-700 mb-2">Vai trò</span>
                                <select className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                                    <option>Tất cả vai trò</option>
                                    <option>Quản trị viên</option>
                                    <option>Quản lý bãi xe</option>
                                    <option>Nhân viên cổng</option>
                                </select>
                            </label>
                            <label>
                                <span className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</span>
                                <select className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                                    <option>Tất cả trạng thái</option>
                                    <option>Hoạt động</option>
                                    <option>Chờ xác minh</option>
                                    <option>Tạm khóa</option>
                                </select>
                            </label>
                            <div className="flex items-end">
                                <button className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                                    <Icon name="filter_alt" />
                                    Lọc dữ liệu
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Accounts Table */}
                    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                        <div className="flex items-center justify-between border-b border-gray-200 p-6">
                            <div>
                                <h3 className="font-semibold text-gray-900">Danh sách tài khoản</h3>
                                <p className="text-sm text-gray-600">5 tài khoản hiển thị trong hệ thống quản trị.</p>
                            </div>
                            <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                                <Icon name="download" />
                                Xuất dữ liệu
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200 bg-gray-50">
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Người dùng</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Vai trò</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Bộ phận</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Hoạt động cuối</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Trạng thái</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {users.map((u) => (
                                        <tr key={u.email} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 font-semibold text-gray-700">
                                                        {initials(u.name)}
                                                    </div>
                                                    <div>
                                                        <strong className="block text-sm text-gray-900">{u.name}</strong>
                                                        <p className="text-xs text-gray-500">{u.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700">{u.role}</td>
                                            <td className="px-6 py-4 text-sm text-gray-700">{u.department}</td>
                                            <td className="px-6 py-4 text-sm text-gray-700">{u.lastActive}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(u.state)}`}>
                                                    {u.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button className="rounded-lg p-2 hover:bg-gray-100 text-gray-600 hover:text-gray-900" title="Sửa">
                                                        <Icon name="edit" />
                                                    </button>
                                                    <button className="rounded-lg p-2 hover:bg-gray-100 text-gray-600 hover:text-gray-900" title="Khóa">
                                                        <Icon name="lock" />
                                                    </button>
                                                    <button className="rounded-lg p-2 hover:bg-gray-100 text-gray-600 hover:text-gray-900" title="Thêm">
                                                        <Icon name="more_horiz" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-gray-200 bg-white px-6 py-4 text-sm text-gray-600">
                    <div className="flex items-center justify-between">
                        <p>© 2024 Smart Parking AI. Toàn bộ quyền được bảo hộ.</p>
                        <div className="flex gap-4">
                            <a href="#" className="hover:text-gray-900">Điều khoản</a>
                            <a href="#" className="hover:text-gray-900">Bảo mật</a>
                            <span>Trạng thái hệ thống: Hoạt động</span>
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
}
