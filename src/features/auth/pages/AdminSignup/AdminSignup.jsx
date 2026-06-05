// src/pages/AdminSignup.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router';

const fieldClass = 'flex cursor-pointer flex-col gap-1';
const labelClass = 'text-[11px] font-bold uppercase tracking-[0.05em] text-[#45464d]';
const inputWrapClass = 'relative flex items-center focus-within:[&_.icon-left]:text-[#0051d5]';
const inputIconClass =
    'material-symbols-outlined icon-left pointer-events-none absolute left-3 text-[18px] text-[#76777d] transition-colors';
const inputClass =
    'w-full appearance-none rounded-lg border border-[#c6c6cd] bg-[#eceef0] py-2 pr-3 pl-[38px] text-[15px] leading-5 text-[#191c1e] outline-none transition placeholder:text-[#76777d] focus:border-[#0051d5] focus:bg-white focus:shadow-[0_0_0_2px_rgba(0,81,213,0.2)]';

const benefits = [
  {
    icon: 'verified_user',
    title: 'Bảo mật cấp độ doanh nghiệp',
    description: 'Bảo vệ dữ liệu hệ thống với chuẩn mã hóa quốc tế 256-bit.',
  },
  {
    icon: 'analytics',
    title: 'Báo cáo dữ liệu thời gian thực',
    description: 'Theo dõi toàn bộ hoạt động bãi đỗ chính xác đến từng giây.',
  },
  {
    icon: 'support_agent',
    title: 'Hỗ trợ kỹ thuật 24/7',
    description: 'Đội ngũ chuyên gia luôn sẵn sàng hỗ trợ bạn bất kỳ lúc nào.',
  },
];

export default function AdminSignup() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        adminCode: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert("Mật khẩu xác nhận không khớp!");
            return;
        }

        if (!formData.adminCode) {
            alert("Vui lòng nhập Mã xác thực Admin!");
            return;
        }

        // TODO: Gọi API đăng ký ở đây
        console.log("Đăng ký với dữ liệu:", formData);

        alert("Đăng ký tài khoản Quản trị viên thành công!");
        navigate('/admin/login'); // Chuyển về trang đăng nhập admin
    };

    return (
        <main className="flex h-screen min-h-screen flex-col overflow-hidden bg-[#f7f9fb] text-[#191c1e]">
            <section className="flex min-h-0 flex-1 overflow-hidden border-t border-[#c6c6cd] bg-white max-[980px]:border-t-0">
                <aside
                    className="relative flex w-1/2 flex-col justify-between overflow-hidden bg-[#131b2e] px-6 py-8 text-white max-[980px]:hidden"
                    aria-label="Thông tin hệ thống"
                >
                    <div
                        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-20 grayscale"
                        style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCwkE0leAOdDu1ZrgB3fe58r3k3LvFLxvIpy2DzouynWB4N4wF-PnhdxlhybeIJ3f6tS45eCSvv5WN9zlOeUzMBNBWEG_sp33AtqxuaFzmJ3hMjKT3LJ7Zi4nb5tAdcGKcQ3Wilkuh5PXelVXfVJeHbV6HDUgbEhGQZ7W441xDDLaKBV0Fa1F1oeVHLCfyY6XhNK4xORM42fGGZBt7QLv2UGqbKhU1-ewog2GnDOCHJOM7bmDDZyo0-lK_GHAQ-sCGaf3nVJgIRa_Oa')` }}
                    />

                    <div className="relative z-10">
                        <div className="mb-6 flex items-center gap-3">
                            <div className="grid h-12 w-12 place-items-center overflow-hidden rounded-full bg-white/95">
                                <img
                                    alt="Parking System Logo"
                                    className="h-full w-full object-cover"
                                    src="/parking-system-logo.png"
                                />
                            </div>
                            <span className="text-2xl font-semibold leading-8 text-white">Parking System</span>
                        </div>

                        <h1 className="mb-3 text-[26px] font-bold leading-9 text-[#dbe1ff]">
                            Giải pháp Quản lý Bãi đậu xe Thông minh
                        </h1>
                        <p className="mb-8 max-w-[420px] text-[15px] leading-relaxed text-[#7c839b] opacity-90">
                            Hệ Thống Quản Trị Đỗ Xe. Nâng tầm trải nghiệm vận hành với hệ thống tự động hóa chuẩn doanh
                            nghiệp. Chính xác, bảo mật và hiệu quả vượt trội.
                        </p>

                        <div className="grid gap-4">
                            {benefits.map((benefit) => (
                                <article 
                                    className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/5 p-4 transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 hover:shadow-xl" 
                                    key={benefit.title}
                                >
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#316bf3] to-[#003ea8] text-white shadow-[0_0_15px_rgba(49,107,243,0.4)]">
                                        <span className="material-symbols-outlined text-[22px]">{benefit.icon}</span>
                                    </div>
                                    <div>
                                        <h2 className="mb-1 text-[15px] font-semibold leading-5 text-white tracking-wide">{benefit.title}</h2>
                                        <p className="text-[13px] leading-[18px] text-[#a5adc6]">{benefit.description}</p>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>

                    <div className="relative z-10 mt-auto pt-8">
                        <p className="m-0 text-xs font-bold uppercase tracking-[0.05em] text-[#7c839b]/60">
                            PHIÊN BẢN 4.2.0 • 2024 NEXUS INFRASTRUCTURE
                        </p>
                    </div>
                </aside>

                <section
                    className="flex min-h-0 w-1/2 flex-1 flex-col justify-center overflow-y-auto overflow-x-hidden bg-white px-6 py-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden max-[980px]:w-full max-[980px]:px-6 max-[980px]:py-5 max-sm:px-4 max-sm:py-4"
                    aria-label="Đăng ký quản trị viên"
                >
                    <div className="mx-auto w-full max-w-md max-sm:max-w-full">
                        <div className="mb-4">
                            <h2 className="mb-1 text-[20px] font-semibold leading-6 text-[#191c1e] max-[720px]:text-lg max-[720px]:leading-6">Đăng ký tài khoản</h2>
                            <p className="text-[13px] leading-5 text-[#45464d]">
                                Vui lòng điền thông tin chi tiết bên dưới để bắt đầu quản trị hệ thống.
                            </p>
                        </div>

                        <form className="flex flex-col gap-2.5" onSubmit={handleSubmit}>
                            {/* Họ và Tên */}
                            <div className={fieldClass}>
                                <label className={labelClass}>Họ và Tên</label>
                                <div className={inputWrapClass}>
                                    <span className={inputIconClass}>person</span>
                                    <input
                                        className={inputClass}
                                        type="text"
                                        name="fullName"
                                        placeholder="Nguyễn Văn A"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                {/* Email */}
                                <div className={fieldClass}>
                                    <label className={labelClass}>Địa chỉ Email</label>
                                    <div className={inputWrapClass}>
                                        <span className={inputIconClass}>mail</span>
                                        <input
                                            className={inputClass}
                                            type="email"
                                            name="email"
                                            placeholder="admin@nexus.vn"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Tên đăng nhập */}
                                <div className={fieldClass}>
                                    <label className={labelClass}>Tên đăng nhập</label>
                                    <div className={inputWrapClass}>
                                        <span className={inputIconClass}>alternate_email</span>
                                        <input
                                            className={inputClass}
                                            type="text"
                                            name="username"
                                            placeholder="admin_nexus"
                                            value={formData.username}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                {/* Mật khẩu */}
                                <div className={fieldClass}>
                                    <label className={labelClass}>Mật khẩu</label>
                                    <div className={inputWrapClass}>
                                        <span className={inputIconClass}>lock</span>
                                        <input
                                            className={inputClass}
                                            type="password"
                                            name="password"
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            minLength={8}
                                        />
                                    </div>
                                </div>

                                {/* Xác nhận mật khẩu */}
                                <div className={fieldClass}>
                                    <label className={labelClass}>Xác nhận mật khẩu</label>
                                    <div className={inputWrapClass}>
                                        <span className={inputIconClass}>key</span>
                                        <input
                                            className={inputClass}
                                            type="password"
                                            name="confirmPassword"
                                            placeholder="••••••••"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Admin Code - Trường đặc biệt */}
                            <div className="flex flex-col gap-1.5 rounded-lg border border-[#ba1a1a]/20 bg-[#ffdad6]/20 p-3">
                                <div className="flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-[18px] text-[#ba1a1a] [font-variation-settings:'FILL'_1]">security</span>
                                    <label className="text-[11px] font-bold uppercase tracking-[0.05em] text-[#ba1a1a]">Mã xác thực Admin</label>
                                </div>
                                <div className="relative flex items-center">
                                    <span className="material-symbols-outlined absolute left-3 text-[18px] text-[#ba1a1a]/60">admin_panel_settings</span>
                                    <input
                                        className="w-full appearance-none rounded-lg border border-[#ba1a1a]/30 bg-white py-1.5 pr-3 pl-[38px] font-mono text-[14px] font-medium uppercase tracking-[0.1em] outline-none transition placeholder:text-[13px] placeholder:normal-case placeholder:tracking-normal focus:border-[#ba1a1a] focus:shadow-[0_0_0_2px_rgba(186,26,26,0.2)]"
                                        type="text"
                                        name="adminCode"
                                        placeholder="Nhập mã xác thực hệ thống"
                                        value={formData.adminCode}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <p className="m-0 text-[10px] text-[#45464d]/70">Bắt buộc để xác thực quyền quản trị viên cấp cao.</p>
                            </div>

                            {/* Nút Đăng ký */}
                            <button
                                className="mt-1 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#0051d5] p-2.5 text-[14px] font-bold leading-5 text-white shadow-[0_8px_16px_rgba(0,81,213,0.15)] transition hover:bg-[#003ea8] active:scale-[0.98]"
                                type="submit"
                            >
                                Đăng ký tài khoản
                                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                            </button>
                        </form>

                        <div className="mt-4 border-t border-[#c6c6cd] pt-3.5 text-center">
                            <p className="mb-1.5 text-[12px] leading-[16px] text-[#45464d]">Bạn đã có tài khoản?</p>
                            <button
                                className="inline-flex min-h-10 w-full cursor-pointer items-center justify-center rounded border border-[#c6c6cd] bg-white text-[14px] font-bold leading-5 text-[#45464d] transition hover:border-[#0051d5] hover:text-[#0051d5]"
                                type="button"
                                onClick={(e) => { e.preventDefault(); navigate('/admin/login'); }}
                            >
                                Đăng nhập ngay
                            </button>
                        </div>

                        <div className="mt-3 text-center text-[11px] text-[#76777d]">
                            <p>
                                Bằng việc đăng ký, bạn đồng ý với <a className="text-inherit underline hover:text-[#0051d5]" href="#">Điều khoản Dịch vụ</a> và <a className="text-inherit underline hover:text-[#0051d5]" href="#">Chính sách Bảo mật</a> của Parking System.
                            </p>
                        </div>

                    </div>
                </section>
            </section>
        </main>
    );
}
