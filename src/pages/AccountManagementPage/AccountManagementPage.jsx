import { useEffect, useMemo, useState } from 'react';
import Icon from '../../components/Icon';
import { getAdminUsers } from '../../services/adminDashboardService';

const formatDateTime = (value) => {
  if (!value) return 'Chưa có dữ liệu';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Chưa có dữ liệu';

  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const initials = (name = '') => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'U';

  return parts
    .slice(-2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
};

const getFriendlyError = (error) => {
  const message = error?.response?.data?.message;
  if (typeof message === 'string') return message;
  if (error?.response?.status === 500) return 'Backend hoặc schema database đang lỗi.';
  if (error?.response?.status === 404) return 'Backend chưa có endpoint tài khoản.';
  return 'Không thể tải danh sách tài khoản.';
};

const downloadCsv = (users) => {
  const rows = [
    ['ID', 'Họ tên', 'Email', 'Vai trò', 'Ngày tạo', 'Cập nhật gần nhất'],
    ...users.map((user) => [
      user.id,
      user.fullName || '',
      user.email || '',
      user.role || '',
      user.createdAt || '',
      user.updatedAt || '',
    ]),
  ];

  const content = rows
    .map((row) => row.map((cell) => `"${String(cell ?? '').replaceAll('"', '""')}"`).join(','))
    .join('\n');
  const blob = new Blob([`\uFEFF${content}`], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'danh-sach-tai-khoan.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export default function AccountManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminUsers();
      setUsers(data);
    } catch (err) {
      setError(getFriendlyError(err));
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const roles = useMemo(() => {
    const uniqueRoles = users.map((user) => user.role).filter(Boolean);
    return [...new Set(uniqueRoles)];
  }, [users]);

  const filteredUsers = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !keyword ||
        user.fullName?.toLowerCase().includes(keyword) ||
        user.email?.toLowerCase().includes(keyword) ||
        String(user.id || '').includes(keyword);
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  return (
    <div className="space-y-8 px-4 py-6 sm:px-6 lg:px-8">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-950">Quản lý tài khoản</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Danh sách bên dưới được lấy trực tiếp từ API người dùng của backend.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              className="inline-flex items-center gap-2 rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              type="button"
              onClick={() => downloadCsv(filteredUsers)}
              disabled={filteredUsers.length === 0}
            >
              <Icon name="download" />
              Xuất dữ liệu
            </button>
            <button
              className="inline-flex items-center gap-2 rounded-3xl bg-[#1e3a8a] px-5 py-3 text-sm font-semibold transition hover:bg-blue-800"
              type="button"
              onClick={fetchUsers}
            >
              <span className="text-white"><Icon name="refresh" /></span>
              <span className="text-white">Làm mới</span>
            </button>
          </div>
        </div>

        <div className="mt-8 rounded-[28px] border border-slate-200 bg-slate-50 p-6">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">Bộ lọc tài khoản</h2>
              <p className="mt-1 text-sm text-slate-600">Tìm theo tên, email, ID hoặc lọc theo vai trò hiện có trong DB.</p>
            </div>
            <div className="rounded-3xl bg-white px-4 py-3 text-sm font-semibold text-slate-700">
              {filteredUsers.length}/{users.length} tài khoản
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr_0.9fr]">
            <label className="space-y-2 text-sm text-slate-600">
              <span>Tìm kiếm</span>
              <div className="relative">
                <span className="material-symbols-outlined pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Tên, email hoặc ID"
                  className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 pl-11 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </label>
            <label className="space-y-2 text-sm text-slate-600">
              <span>Vai trò</span>
              <select
                value={roleFilter}
                onChange={(event) => setRoleFilter(event.target.value)}
                className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="all">Tất cả vai trò</option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex items-end">
              <button
                className="inline-flex w-full items-center justify-center gap-2 rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setRoleFilter('all');
                }}
              >
                <Icon name="filter_alt_off" />
                Xóa lọc
              </button>
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <section className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500 shadow-sm">
          Đang tải danh sách tài khoản...
        </section>
      )}

      {error && (
        <section className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </section>
      )}

      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-slate-950">Danh sách tài khoản</h2>
          <p className="mt-1 text-sm text-slate-600">Các trường chưa được backend trả về sẽ được ghi rõ là chưa có dữ liệu.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm text-slate-700">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.18em] text-slate-500">
              <tr>
                <th className="whitespace-nowrap px-4 py-3">Người dùng</th>
                <th className="whitespace-nowrap px-4 py-3">Vai trò</th>
                <th className="whitespace-nowrap px-4 py-3">Bộ phận</th>
                <th className="whitespace-nowrap px-4 py-3">Ngày tạo</th>
                <th className="whitespace-nowrap px-4 py-3">Cập nhật gần nhất</th>
                <th className="whitespace-nowrap px-4 py-3">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-slate-500">
                    {loading ? 'Đang tải...' : 'Không có tài khoản phù hợp.'}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id || user.email} className="transition-colors hover:bg-slate-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-4">
                        <span className="flex h-11 w-11 items-center justify-center rounded-3xl bg-slate-100 text-sm font-semibold text-slate-900">
                          {initials(user.fullName || user.email)}
                        </span>
                        <div>
                          <p className="font-semibold text-slate-950">{user.fullName || 'Chưa có tên'}</p>
                          <p className="text-sm text-slate-500">{user.email || 'Chưa có email'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-700">{user.role || 'Chưa có role'}</td>
                    <td className="px-4 py-4 text-slate-500">Chưa có trường dữ liệu</td>
                    <td className="px-4 py-4 text-slate-700">{formatDateTime(user.createdAt)}</td>
                    <td className="px-4 py-4 text-slate-700">{formatDateTime(user.updatedAt)}</td>
                    <td className="px-4 py-4">
                      <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
                        Có trong DB
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
