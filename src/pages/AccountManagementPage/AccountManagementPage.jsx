import Icon from '../../components/Icon';

const users = [
  {
    name: 'Nguyen Minh Anh',
    email: 'minhanh@parking.ai',
    role: 'Quan tri vien',
    department: 'Van hanh',
    lastActive: '20/05/2026 19:42',
    status: 'Hoat dong',
    state: 'success',
  },
  {
    name: 'Tran Quoc Huy',
    email: 'quochuy@parking.ai',
    role: 'Quan ly bai xe',
    department: 'Bai xe A1',
    lastActive: '20/05/2026 18:15',
    status: 'Hoat dong',
    state: 'success',
  },
  {
    name: 'Le Hoang Vy',
    email: 'hoangvy@parking.ai',
    role: 'Nhan vien cong',
    department: 'Cong chinh',
    lastActive: '20/05/2026 16:08',
    status: 'Cho xac minh',
    state: 'warning',
  },
  {
    name: 'Pham Duc Long',
    email: 'duclong@parking.ai',
    role: 'Ke toan',
    department: 'Tai chinh',
    lastActive: '18/05/2026 09:30',
    status: 'Tam khoa',
    state: 'error',
  },
  {
    name: 'Vu Thanh Ha',
    email: 'thanhha@parking.ai',
    role: 'Giam sat camera',
    department: 'An ninh',
    lastActive: '20/05/2026 13:22',
    status: 'Hoat dong',
    state: 'success',
  },
];

const statusStyles = {
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  error: 'bg-rose-100 text-rose-700',
};

function initials(name) {
  return name
    .split(' ')
    .slice(-2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

export default function AccountManagementPage() {
  return (
    <div className="space-y-8 px-4 py-6 sm:px-6 lg:px-8">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-950">Quan ly tai khoan</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Quan tri nguoi dung, vai tro truy cap va trang thai tai khoan trong he thong.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              className="inline-flex items-center gap-2 rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              type="button"
            >
              <Icon name="upload_file" />
              Nhap danh sach
            </button>
            <button
              className="inline-flex items-center gap-2 rounded-3xl bg-[#1e3a8a] px-5 py-3 text-sm font-semibold transition hover:bg-blue-800"
              type="button"
            >
              <span className="text-white"><Icon name="person_add" /></span>
              <span className="text-white">Thêm tài khoản</span>
            </button>
          </div>
        </div>

        <div className="mt-8 rounded-[28px] border border-slate-200 bg-slate-50 p-6">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">Bang dieu khien tai khoan</h2>
              <p className="mt-1 text-sm text-slate-600">Tim kiem, loc va quan ly quyen truy cap cua nguoi dung.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="inline-flex items-center gap-2 rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100" type="button">
                <Icon name="download" />
                Xuat du lieu
              </button>
              <button className="inline-flex items-center gap-2 rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100" type="button">
                <Icon name="refresh" />
                Lam moi
              </button>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr_1fr_0.9fr]">
            <label className="space-y-2 text-sm text-slate-600">
              <span>Tim kiem</span>
              <div className="relative">
                <span className="material-symbols-outlined pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                <input
                  type="search"
                  placeholder="Ten, email hoac bo phan"
                  className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 pl-11 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </label>
            <label className="space-y-2 text-sm text-slate-600">
              <span>Vai tro</span>
              <select className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                <option>Tat ca vai tro</option>
                <option>Quan tri vien</option>
                <option>Quan ly bai xe</option>
                <option>Nhan vien cong</option>
                <option>Ke toan</option>
              </select>
            </label>
            <label className="space-y-2 text-sm text-slate-600">
              <span>Trang thai</span>
              <select className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                <option>Tat ca trang thai</option>
                <option>Hoat dong</option>
                <option>Cho xac minh</option>
                <option>Tam khoa</option>
              </select>
            </label>
            <div className="flex items-end">
              <button className="inline-flex w-full items-center justify-center gap-2 rounded-3xl bg-[#1e3a8a] px-5 py-3 text-sm font-semibold transition hover:bg-blue-800" type="button">
                <span className="text-white"><Icon name="filter_alt" /></span>
                <span className="text-white">Áp dụng</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">Danh sach tai khoan</h2>
            <p className="mt-1 text-sm text-slate-600">Xem thong tin nguoi dung va trang thai truy cap moi nhat.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="inline-flex items-center gap-2 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100" type="button">
              <Icon name="person_add" />
              Them moi
            </button>
            <button className="inline-flex items-center gap-2 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100" type="button">
              <Icon name="download" />
              Xuat bang
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm text-slate-700">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.18em] text-slate-500">
              <tr>
                <th className="whitespace-nowrap px-4 py-3">Nguoi dung</th>
                <th className="whitespace-nowrap px-4 py-3">Vai tro</th>
                <th className="whitespace-nowrap px-4 py-3">Bo phan</th>
                <th className="whitespace-nowrap px-4 py-3">Hoat dong cuoi</th>
                <th className="whitespace-nowrap px-4 py-3">Trang thai</th>
                <th className="whitespace-nowrap px-4 py-3">Thao tac</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {users.map((user) => (
                <tr key={user.email} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-4">
                      <span className="flex h-11 w-11 items-center justify-center rounded-3xl bg-slate-100 text-sm font-semibold text-slate-900">{initials(user.name)}</span>
                      <div>
                        <p className="font-semibold text-slate-950">{user.name}</p>
                        <p className="text-sm text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-slate-700">{user.role}</td>
                  <td className="px-4 py-4 text-slate-700">{user.department}</td>
                  <td className="px-4 py-4 text-slate-700">{user.lastActive}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${statusStyles[user.state]}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      <button className="inline-flex h-11 w-11 items-center justify-center rounded-3xl bg-slate-100 text-slate-700 transition hover:bg-slate-200" aria-label={`Sua ${user.name}`} type="button">
                        <Icon name="edit" />
                      </button>
                      <button className="inline-flex h-11 w-11 items-center justify-center rounded-3xl bg-slate-100 text-slate-700 transition hover:bg-slate-200" aria-label={`Khoa ${user.name}`} type="button">
                        <Icon name="lock" />
                      </button>
                      <button className="inline-flex h-11 w-11 items-center justify-center rounded-3xl bg-slate-100 text-slate-700 transition hover:bg-slate-200" aria-label={`Xem them ${user.name}`} type="button">
                        <Icon name="more_horiz" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
