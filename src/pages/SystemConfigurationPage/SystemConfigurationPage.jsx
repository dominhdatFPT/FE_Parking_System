import { useEffect, useMemo, useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../constants/routes';
import Icon from '../../components/Icon';
import NotificationDropdown from '../../components/NotificationDropdown';
import SettingsDropdown from '../../components/SettingsDropdown';

// ─── Constants ───────────────────────────────────────────────────────────────

const STORAGE_KEY = 'parking_system_configuration';

const DEFAULT_CONFIG = {
    systemName: 'Smart Parking AI',
    region: 'VN',
    timezone: 'Asia/Ho_Chi_Minh',
    defaultLanguage: 'Vietnamese',
    operationMode: 'auto',
    enableCamera: true,
    enableRFID: true,
    enableQR: false,
    enablePaymentGateway: false,
    enableAuditLogs: true,
    sessionTimeout: 15,
    maxConcurrentSessions: 120,
    maintenanceWindow: '02:00 - 04:00',
};

const menuItems = [
    { icon: 'dashboard',          label: 'Tổng quan',           href: '/home' },
    { icon: 'manage_accounts',    label: 'Quản lý tài khoản',   href: ROUTES.ADMIN.USERS },
    { icon: 'security',           label: 'Quyền truy cập',      href: ROUTES.ADMIN.ROLES },
    { icon: 'settings',           label: 'Cấu hình hệ thống',   href: ROUTES.ADMIN.SYSTEM_CONFIG },
    { icon: 'history',            label: 'Nhật ký hệ thống',    href: ROUTES.ADMIN.AUDIT_LOG },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function loadConfig() {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_CONFIG;
    try {
        return { ...DEFAULT_CONFIG, ...JSON.parse(stored) };
    } catch {
        return DEFAULT_CONFIG;
    }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionCard({ title, description, children }) {
    return (
        <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-6 py-4">
                <h3 className="font-semibold text-gray-900">{title}</h3>
                <p className="mt-0.5 text-sm text-gray-500">{description}</p>
            </div>
            <div className="px-6 py-5">{children}</div>
        </section>
    );
}

function FormRow({ label, children }) {
    return (
        <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-gray-700">{label}</span>
            {children}
        </label>
    );
}

const inputClass =
    'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 ' +
    'focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition';

function ToggleRow({ label, checked, onChange }) {
    return (
        <label className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 hover:bg-gray-50 transition">
            <span className="text-sm font-medium text-gray-700">{label}</span>
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                onClick={() => onChange(!checked)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 ${
                    checked ? 'bg-blue-600' : 'bg-gray-300'
                }`}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                        checked ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
            </button>
        </label>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SystemConfigurationPage() {
    const { user, role } = useAuth();
    const navigate = useNavigate();
    const handleNavigate = (path) => navigate(path);
    const [config, setConfig] = useState(DEFAULT_CONFIG);
    const [message, setMessage] = useState('');

    useEffect(() => {
        setConfig(loadConfig());
    }, []);

    const enabledIntegrations = useMemo(
        () =>
            [config.enableCamera, config.enableRFID, config.enableQR, config.enablePaymentGateway].filter(
                Boolean,
            ).length,
        [config],
    );

    function handleChange(key, value) {
        setConfig((current) => ({ ...current, [key]: value }));
    }

    function handleSave() {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
        setMessage('✓ Đã lưu cấu hình hệ thống thành công.');
    }

    function handleReset() {
        setConfig(DEFAULT_CONFIG);
        window.localStorage.removeItem(STORAGE_KEY);
        setMessage('↺ Đã khôi phục cấu hình mặc định.');
    }

    const operationModeLabel =
        config.operationMode === 'auto'
            ? 'Tự động'
            : config.operationMode === 'manual'
              ? 'Thủ công'
              : 'Kết hợp';

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* ── Sidebar ── */}
            <aside className="w-64 flex-shrink-0 flex flex-col bg-slate-900 text-white shadow-xl">
                <div className="flex-1 space-y-6 p-4">
                    {/* Brand */}
                    <div className="flex items-center gap-3 border-b border-slate-700 pb-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded bg-blue-600">
                            <Icon name="local_parking" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold">Smart Parking AI</h1>
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
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-700 flex items-center gap-3 shrink-0 mt-auto bg-slate-900">
                  <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-[#20438e] hover:bg-blue-800 rounded-xl transition-colors text-sm font-semibold shadow-sm text-white">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Hỗ trợ</span>
                  </button>
                  <button 
                    title="Đăng xuất"
                    onClick={() => handleNavigate('/login')}
                    className="flex-shrink-0 flex items-center justify-center p-2.5 text-red-600 hover:text-white hover:bg-red-600 bg-red-100 rounded-lg transition-all"
                  >
                    <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                  </button>
                </div>
            </aside>

            {/* ── Main ── */}
            <main className="flex-1 overflow-auto">
                {/* Header */}
                <header className="border-b border-gray-200 bg-white px-6 py-4 shadow-sm">
                    <div className="flex items-center justify-between gap-4">
                        <label className="flex flex-1 items-center gap-2 rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-600 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-200">
                            <Icon name="search" />
                            <input
                                placeholder="Tìm kiếm cấu hình, thiết lập..."
                                type="search"
                                className="flex-1 bg-transparent outline-none text-sm"
                            />
                        </label>
                        <div className="flex items-center gap-3">
                            <NotificationDropdown />
                            <SettingsDropdown
                                trigger={
                                    <button className="flex items-center gap-2 rounded-lg p-2 transition hover:bg-gray-100">
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
                                            className="h-10 w-10 rounded-full object-cover"
                                        />
                                    </button>
                                }
                            />
                        </div>
                    </div>
                </header>

                {/* Content */}
                <section className="space-y-6 p-6">
                    {/* Page heading */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Cấu hình hệ thống</h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Thiết lập thông số vận hành, phần cứng và bảo mật chung của Smart Parking AI.
                        </p>
                    </div>

                    {/* Body: 3-col cards + sidebar */}
                    <div className="flex gap-6 items-start">
                        {/* Left: config cards */}
                        <div className="flex-1 space-y-6 min-w-0">
                            {/* System Info */}
                            <SectionCard
                                title="Thông tin hệ thống"
                                description="Điều chỉnh tên, vùng và chế độ vận hành mặc định."
                            >
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <FormRow label="Tên hệ thống">
                                        <input
                                            type="text"
                                            className={inputClass}
                                            value={config.systemName}
                                            onChange={(e) => handleChange('systemName', e.target.value)}
                                        />
                                    </FormRow>
                                    <FormRow label="Vùng">
                                        <select
                                            className={inputClass}
                                            value={config.region}
                                            onChange={(e) => handleChange('region', e.target.value)}
                                        >
                                            <option value="VN">Việt Nam</option>
                                            <option value="SG">Singapore</option>
                                            <option value="US">Hoa Kỳ</option>
                                            <option value="DE">Đức</option>
                                        </select>
                                    </FormRow>
                                    <FormRow label="Múi giờ">
                                        <select
                                            className={inputClass}
                                            value={config.timezone}
                                            onChange={(e) => handleChange('timezone', e.target.value)}
                                        >
                                            <option value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh</option>
                                            <option value="Asia/Singapore">Asia/Singapore</option>
                                            <option value="America/New_York">America/New_York</option>
                                            <option value="Europe/Berlin">Europe/Berlin</option>
                                        </select>
                                    </FormRow>
                                    <FormRow label="Ngôn ngữ mặc định">
                                        <select
                                            className={inputClass}
                                            value={config.defaultLanguage}
                                            onChange={(e) => handleChange('defaultLanguage', e.target.value)}
                                        >
                                            <option value="Vietnamese">Tiếng Việt</option>
                                            <option value="English">English</option>
                                        </select>
                                    </FormRow>
                                    <FormRow label="Chế độ vận hành">
                                        <select
                                            className={inputClass}
                                            value={config.operationMode}
                                            onChange={(e) => handleChange('operationMode', e.target.value)}
                                        >
                                            <option value="auto">Tự động</option>
                                            <option value="manual">Thủ công</option>
                                            <option value="hybrid">Kết hợp</option>
                                        </select>
                                    </FormRow>
                                </div>
                            </SectionCard>

                            {/* Devices */}
                            <SectionCard
                                title="Thiết bị & tích hợp"
                                description="Quản lý phần cứng, camera và kết nối thanh toán."
                            >
                                <div className="divide-y divide-gray-100">
                                    <ToggleRow
                                        label="Camera AI"
                                        checked={config.enableCamera}
                                        onChange={(v) => handleChange('enableCamera', v)}
                                    />
                                    <ToggleRow
                                        label="RFID Reader"
                                        checked={config.enableRFID}
                                        onChange={(v) => handleChange('enableRFID', v)}
                                    />
                                    <ToggleRow
                                        label="QR Scanner"
                                        checked={config.enableQR}
                                        onChange={(v) => handleChange('enableQR', v)}
                                    />
                                    <ToggleRow
                                        label="Payment Gateway"
                                        checked={config.enablePaymentGateway}
                                        onChange={(v) => handleChange('enablePaymentGateway', v)}
                                    />
                                </div>
                            </SectionCard>

                            {/* Security */}
                            <SectionCard
                                title="Bảo mật & vận hành"
                                description="Các thiết lập bảo mật và giới hạn phiên người dùng."
                            >
                                <div className="space-y-1 mb-4">
                                    <ToggleRow
                                        label="Kích hoạt audit logs"
                                        checked={config.enableAuditLogs}
                                        onChange={(v) => handleChange('enableAuditLogs', v)}
                                    />
                                </div>
                                <div className="grid gap-4 sm:grid-cols-3">
                                    <FormRow label="Timeout phiên (phút)">
                                        <input
                                            type="number"
                                            min="5"
                                            max="120"
                                            className={inputClass}
                                            value={config.sessionTimeout}
                                            onChange={(e) => handleChange('sessionTimeout', Number(e.target.value))}
                                        />
                                    </FormRow>
                                    <FormRow label="Số phiên đồng thời">
                                        <input
                                            type="number"
                                            min="10"
                                            max="500"
                                            className={inputClass}
                                            value={config.maxConcurrentSessions}
                                            onChange={(e) =>
                                                handleChange('maxConcurrentSessions', Number(e.target.value))
                                            }
                                        />
                                    </FormRow>
                                    <FormRow label="Cửa sổ bảo trì">
                                        <input
                                            type="text"
                                            className={inputClass}
                                            value={config.maintenanceWindow}
                                            onChange={(e) => handleChange('maintenanceWindow', e.target.value)}
                                        />
                                    </FormRow>
                                </div>
                            </SectionCard>
                        </div>

                        {/* Right: sidebar */}
                        <aside className="w-72 flex-shrink-0 space-y-4">
                            {/* Status */}
                            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                                <h4 className="mb-4 font-semibold text-gray-900">Trạng thái hiện tại</h4>
                                <dl className="space-y-3">
                                    {[
                                        { label: 'Tích hợp đang bật', value: `${enabledIntegrations} / 4` },
                                        { label: 'Audit logs', value: config.enableAuditLogs ? 'Bật' : 'Tắt' },
                                        { label: 'Chế độ vận hành', value: operationModeLabel },
                                        { label: 'Timeout phiên', value: `${config.sessionTimeout} phút` },
                                    ].map(({ label, value }) => (
                                        <div key={label} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
                                            <span className="text-sm text-gray-600">{label}</span>
                                            <strong className="text-sm font-semibold text-gray-900">{value}</strong>
                                        </div>
                                    ))}
                                </dl>
                            </div>

                            {/* Note */}
                            <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
                                <h4 className="mb-2 font-semibold text-amber-800">Lưu ý</h4>
                                <p className="text-sm text-amber-700 leading-relaxed">
                                    Các thay đổi được áp dụng ngay sau khi nhấn <strong>Lưu cấu hình</strong>. Vui lòng
                                    kiểm tra phần cứng trước khi bật RFID hoặc Payment Gateway.
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-3">
                                <button
                                    type="button"
                                    onClick={handleSave}
                                    className="w-full rounded-lg bg-[#1e3a8a] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                >
                                    <span className="text-white">Lưu cấu hình</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
                                >
                                    Khôi phục mặc định
                                </button>
                                {message && (
                                    <p className="rounded-lg bg-green-50 px-3 py-2 text-center text-sm font-medium text-green-700 border border-green-200">
                                        {message}
                                    </p>
                                )}
                            </div>
                        </aside>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-gray-200 bg-white px-6 py-4 text-sm text-gray-600">
                    <div className="flex items-center justify-between">
                        <p>© 2024 Smart Parking AI. Toàn bộ quyền được bảo hộ.</p>
                        <div className="flex gap-4">
                            <a href="#" className="hover:text-gray-900 transition">Điều khoản</a>
                            <a href="#" className="hover:text-gray-900 transition">Bảo mật</a>
                            <span>Trạng thái hệ thống: Hoạt động</span>
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
}
