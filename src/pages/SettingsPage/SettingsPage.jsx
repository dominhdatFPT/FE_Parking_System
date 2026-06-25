import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import {
  Camera,
  Check,
  KeyRound,
  LockKeyhole,
  Mail,
  Phone,
  Save,
  ShieldCheck,
  UserRound,
  X,
} from 'lucide-react';
import { useAuth } from '../../contexts/useAuth';

const SELECTED_AVATAR_STORAGE_KEY = 'selectedAvatar';

const avatarOptions = [
  '/avatars/avatar-1.svg',
  '/avatars/avatar-2.svg',
  '/avatars/avatar-3.svg',
  '/avatars/avatar-4.svg',
  '/avatars/avatar-5.svg',
];

const tabs = [
  {
    id: 'profile',
    label: 'Thông tin cơ bản',
    description: 'Hồ sơ và liên hệ',
    icon: UserRound,
  },
  {
    id: 'password',
    label: 'Mật khẩu',
    description: 'Bảo mật tài khoản',
    icon: KeyRound,
  },
];

function getStoredAvatar() {
  if (typeof window === 'undefined') return avatarOptions[0];

  const saved = window.localStorage.getItem(SELECTED_AVATAR_STORAGE_KEY);
  return avatarOptions.includes(saved) ? saved : avatarOptions[0];
}

function getProfileFromUser(user) {
  return {
    email: user?.email || '',
    displayName: user?.fullName || user?.name || user?.email || 'Người dùng',
    phone: user?.phone || user?.phoneNumber || '',
    role: user?.role || 'User',
    avatar: user?.avatarUrl || user?.avatar || '',
  };
}

function AvatarImage({ src, initials = 'DA', className = '' }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  if (hasError || !src) {
    return (
      <span className={`grid place-items-center rounded-full bg-sky-600 font-bold text-white ${className}`}>
        {initials}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt="Ảnh đại diện"
      onError={() => setHasError(true)}
      className={`rounded-full object-cover ${className}`}
    />
  );
}

function FieldShell({ label, required, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
        {required ? <span className="text-sky-600"> *</span> : null}
      </span>
      {children}
    </label>
  );
}

function ProfileSidebar({ activeTab, onChange }) {
  return (
    <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-2 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
      <div className="px-3 py-3">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Cài đặt</p>
        <h3 className="mt-1 text-base font-bold text-slate-900">Tài khoản</h3>
      </div>

      <div className="space-y-1">
        {tabs.map((tab) => {
          const TabIcon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`group flex w-full items-center gap-3 rounded-2xl border-l-4 px-3 py-3 text-left transition ${
                isActive
                  ? 'border-sky-600 bg-sky-50 text-sky-700'
                  : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-950'
              }`}
            >
              <span
                className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
                  isActive ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-white'
                }`}
              >
                <TabIcon className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-bold">{tab.label}</span>
                <span className={`mt-0.5 block text-xs ${isActive ? 'text-sky-600' : 'text-slate-400'}`}>
                  {tab.description}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

function ProfileHeaderCard({ selectedAvatar, onAvatarSelect, profile }) {
  const [pickerOpen, setPickerOpen] = useState(false);

  function handleAvatarSelect(avatar) {
    onAvatarSelect(avatar);
    setPickerOpen(false);
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
      <div className="relative h-44 overflow-hidden bg-[linear-gradient(135deg,#0f5ea8_0%,#0ea5e9_52%,#dff6ff_100%)]">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.12)_1px,transparent_1px)] bg-[size:44px_44px]" />
        <div className="absolute left-8 top-8 h-20 w-32 rounded-2xl border border-white/25 bg-white/10" />
        <div className="absolute bottom-8 right-10 h-14 w-44 rounded-2xl border border-white/25 bg-white/10" />
        <div className="absolute left-1/2 top-1/2 h-px w-[70%] -translate-x-1/2 bg-white/25" />
      </div>

      <div className="px-5 pb-6 sm:px-8">
        <div className="relative mx-auto -mt-16 h-32 w-32">
          <AvatarImage
            src={selectedAvatar}
            initials="DA"
            className="h-32 w-32 border-4 border-white text-3xl shadow-xl shadow-slate-900/15"
          />
          <button
            type="button"
            onClick={() => setPickerOpen((prev) => !prev)}
            className="absolute bottom-1 right-1 grid h-10 w-10 place-items-center rounded-full border-2 border-white bg-sky-600 text-white shadow-lg transition hover:bg-sky-700 active:scale-95"
            aria-label="Chọn ảnh đại diện"
          >
            <Camera className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-950">{profile.displayName}</h2>
          <p className="mt-1 text-sm font-medium text-slate-500">{profile.email || 'Chưa có email'}</p>
          <span className="mt-3 inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700">
            <ShieldCheck className="h-4 w-4" />
            {profile.role}
          </span>
        </div>

        {pickerOpen ? (
          <div className="mx-auto mt-6 max-w-xl rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Chọn ảnh đại diện</h3>
                <p className="mt-0.5 text-xs text-slate-500">Ảnh được cập nhật ngay trên trang hồ sơ.</p>
              </div>
              <button
                type="button"
                onClick={() => setPickerOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-xl text-slate-500 transition hover:bg-white hover:text-slate-900"
                aria-label="Đóng chọn ảnh đại diện"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              {avatarOptions.map((avatar, index) => {
                const isSelected = selectedAvatar === avatar;

                return (
                  <button
                    key={avatar}
                    type="button"
                    onClick={() => handleAvatarSelect(avatar)}
                    className={`relative grid h-16 w-16 place-items-center rounded-full transition ${
                      isSelected
                        ? 'ring-2 ring-sky-500 ring-offset-2 ring-offset-slate-50'
                        : 'hover:ring-2 hover:ring-slate-200 hover:ring-offset-2 hover:ring-offset-slate-50'
                    }`}
                    aria-label={`Chọn ảnh đại diện ${index + 1}`}
                  >
                    <AvatarImage src={avatar} initials="DA" className="h-16 w-16 text-sm" />
                    {isSelected ? (
                      <span className="absolute -right-1 -top-1 grid h-6 w-6 place-items-center rounded-full bg-sky-600 text-white ring-2 ring-white">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function ProfileInfoForm({ initialProfile, onSave }) {
  const [formData, setFormData] = useState(initialProfile);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setFormData(initialProfile);
    setMessage('');
  }, [initialProfile]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSave(formData);
    setMessage('Cập nhật hồ sơ thành công');
  }

  function handleCancel() {
    setFormData(initialProfile);
    setMessage('');
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.06)] sm:p-6">
      <div className="flex flex-col gap-3 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-950">Thông tin cơ bản</h2>
          <p className="mt-1 text-sm text-slate-500">Cập nhật thông tin hiển thị trong hệ thống.</p>
        </div>
        {message ? (
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700">
            <Check className="h-4 w-4" />
            {message}
          </span>
        ) : null}
      </div>

      <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
        <div className="grid gap-5 md:grid-cols-2">
          <FieldShell label="Email" required>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm font-medium text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
              />
            </div>
          </FieldShell>

          <FieldShell label="Tên hiển thị" required>
            <div className="relative">
              <UserRound className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                name="displayName"
                type="text"
                value={formData.displayName}
                onChange={handleChange}
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm font-medium text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
              />
            </div>
          </FieldShell>

          <FieldShell label="Số điện thoại" required>
            <div className="relative">
              <Phone className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Nhập số điện thoại"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
              />
            </div>
          </FieldShell>

          <FieldShell label="Vai trò">
            <input
              value={formData.role}
              disabled
              className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-500"
            />
          </FieldShell>

        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleCancel}
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 active:scale-[0.99]"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-sky-600 px-5 text-sm font-bold text-white shadow-lg shadow-sky-600/20 transition hover:bg-sky-700 active:scale-[0.99]"
          >
            <Save className="h-4 w-4" />
            Lưu
          </button>
        </div>
      </form>
    </section>
  );
}

function PasswordForm() {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  const isSuccess = message.type === 'success';
  const isInfo = message.type === 'info';

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }

  function handleCancel() {
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setMessage({ type: '', text: '' });
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Vui lòng nhập đầy đủ thông tin mật khẩu' });
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Mật khẩu mới không khớp' });
      return;
    }

    setMessage({
      type: 'info',
      text: 'Chưa có API đổi mật khẩu trong dự án. Vui lòng cấu hình endpoint trước khi lưu.',
    });
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.06)] sm:p-6">
      <div className="flex flex-col gap-3 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-950">Đổi mật khẩu</h2>
          <p className="mt-1 text-sm text-slate-500">Tăng bảo mật cho tài khoản quản trị của bạn.</p>
        </div>
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-sky-50 text-sky-700">
          <LockKeyhole className="h-6 w-6" />
        </span>
      </div>

      {message.text ? (
        <div
          className={`mt-5 rounded-2xl px-4 py-3 text-sm font-semibold ${
            isSuccess
              ? 'bg-emerald-50 text-emerald-700'
              : isInfo
                ? 'bg-amber-50 text-amber-700'
                : 'bg-rose-50 text-rose-700'
          }`}
        >
          {message.text}
        </div>
      ) : null}

      <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
        <FieldShell label="Mật khẩu hiện tại">
          <input
            name="currentPassword"
            type="password"
            value={formData.currentPassword}
            onChange={handleChange}
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
          />
        </FieldShell>

        <div className="grid gap-5 md:grid-cols-2">
          <FieldShell label="Mật khẩu mới">
            <input
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleChange}
              className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
            />
          </FieldShell>

          <FieldShell label="Nhập lại mật khẩu mới">
            <input
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
            />
          </FieldShell>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleCancel}
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 active:scale-[0.99]"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-sky-600 px-5 text-sm font-bold text-white shadow-lg shadow-sky-600/20 transition hover:bg-sky-700 active:scale-[0.99]"
          >
            <LockKeyhole className="h-4 w-4" />
            Cập nhật mật khẩu
          </button>
        </div>
      </form>
    </section>
  );
}

export default function SettingsPage() {
  const { section } = useParams();
  const { user, setUser } = useAuth();
  const profile = useMemo(() => getProfileFromUser(user), [user]);
  const [activeTab, setActiveTab] = useState(section === 'password' ? 'password' : 'profile');
  const [selectedAvatar, setSelectedAvatar] = useState(() => profile.avatar || getStoredAvatar());

  useEffect(() => {
    setActiveTab(section === 'password' ? 'password' : 'profile');
  }, [section]);

  function handleAvatarSelect(avatar) {
    setSelectedAvatar(avatar);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(SELECTED_AVATAR_STORAGE_KEY, avatar);
    }
    setUser((current) => (current ? { ...current, avatarUrl: avatar, avatar } : current));
  }

  function handleProfileSave(nextProfile) {
    setUser((current) => {
      if (!current) return current;

      return {
        ...current,
        email: nextProfile.email,
        fullName: nextProfile.displayName,
        name: nextProfile.displayName,
        phone: nextProfile.phone,
        role: nextProfile.role,
        avatarUrl: selectedAvatar,
        avatar: selectedAvatar,
      };
    });
  }

  return (
    <div className="mx-auto max-w-[1440px] space-y-6">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Hồ sơ cá nhân</h1>
          <p className="mt-2 max-w-2xl text-sm font-medium text-slate-500">
            Quản lý thông tin tài khoản và bảo mật
          </p>
        </div>
      </header>

      <div className="grid min-w-0 gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        <ProfileSidebar activeTab={activeTab} onChange={setActiveTab} />
        <div className="min-w-0 space-y-6">
          {activeTab === 'password' ? (
            <PasswordForm />
          ) : (
            <>
              <ProfileHeaderCard
                selectedAvatar={selectedAvatar}
                onAvatarSelect={handleAvatarSelect}
                profile={profile}
              />
              <ProfileInfoForm initialProfile={profile} onSave={handleProfileSave} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
