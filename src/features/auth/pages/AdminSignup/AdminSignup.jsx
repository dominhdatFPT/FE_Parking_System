// src/pages/AdminSignup.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router';

const fieldClass = 'flex flex-col gap-2';
const labelClass = 'text-xs font-bold uppercase tracking-[0.05em] text-[#45464d]';
const inputWrapClass = 'relative flex items-center focus-within:[&_.icon-left]:text-[#0051d5]';
const inputIconClass =
    'material-symbols-outlined icon-left absolute left-4 text-[#76777d] transition-colors';
const inputClass =
    'w-full rounded-lg border border-[#c6c6cd] bg-[#f2f4f6] px-4 py-3 pl-12 text-base text-[#191c1e] outline-none transition focus:border-[#0051d5] focus:bg-white focus:shadow-[0_0_0_2px_rgba(0,81,213,0.2)]';

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
        <div className="flex min-h-screen items-center justify-center bg-[#f7f9fb] p-6 text-[#191c1e]">
            <div className="flex w-full max-w-[1100px] overflow-hidden rounded-xl border border-[#c6c6cd] bg-white shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)]">

                {/* Cột trái: Branding & Thông tin */}
                <div className="relative hidden w-5/12 flex-col justify-between overflow-hidden bg-[#131b2e] p-12 lg:flex">

                    {/* ĐÃ CẬP NHẬT ẢNH NỀN BÃI ĐỖ XE CỦA BẠN Ở ĐÂY */}
                    <div className="absolute inset-0 opacity-20">
                        <img
                            className="h-full w-full object-cover"
                            src="/image_ba9d2d.jpg"
                            alt="Parking Structure Background"
                        />
                    </div>

                    <div className="relative z-10">
                        <div className="mb-6 h-32 w-32 overflow-hidden rounded-full border-4 border-white/10 bg-white">
                            {/* Logo của bạn */}
                            <img className="h-full w-full object-contain" alt="Parking System Logo" src="/image_ac156e.jpg" />
                        </div>
                        <h1 className="m-0 text-4xl font-bold leading-[44px] tracking-[-0.02em] text-[#fefcff]">
                            Parking System
                        </h1>
                        <p className="mt-2 text-base uppercase tracking-[0.05em] text-[#7c839b]">Hệ Thống Quản Trị Đỗ Xe</p>

                        <div className="mt-12 flex flex-col gap-4">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-[#316bf3]">verified_user</span>
                                <p className="m-0 text-sm text-[#7c839b]">Bảo mật cấp độ doanh nghiệp</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-[#316bf3]">analytics</span>
                                <p className="m-0 text-sm text-[#7c839b]">Báo cáo dữ liệu thời gian thực</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-[#316bf3]">support_agent</span>
                                <p className="m-0 text-sm text-[#7c839b]">Hỗ trợ kỹ thuật 24/7</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 mt-12 border-t border-white/10 pt-8">
                        <p className="m-0 text-xs font-bold uppercase tracking-[0.05em] text-[#7c839b]/60">
                            PHIÊN BẢN 4.2.0 • 2024 NEXUS INFRASTRUCTURE
                        </p>
                    </div>
                </div>

                {/* Cột phải: Form đăng ký */}
                <div className="flex w-full flex-col justify-center p-8 lg:w-7/12 lg:p-16">
                    <div className="mb-8">
                        <h2 className="m-0 text-2xl font-semibold text-black">Đăng ký tài khoản</h2>
                        <p className="mt-2 text-base text-[#45464d]">
                            Vui lòng điền thông tin chi tiết bên dưới để bắt đầu quản trị hệ thống.
                        </p>
                    </div>

                    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
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

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                        <div className="flex flex-col gap-2 rounded-lg border border-[#ba1a1a]/20 bg-[#ffdad6]/20 p-6">
                            <div className="mb-2 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[#ba1a1a] [font-variation-settings:'FILL'_1]">security</span>
                                <label className="text-xs font-bold uppercase tracking-[0.05em] text-[#ba1a1a]">Mã xác thực Admin</label>
                            </div>
                            <div className="relative flex items-center">
                                <span className="material-symbols-outlined absolute left-4 text-[#ba1a1a]/60">admin_panel_settings</span>
                                <input
                                    className="w-full rounded-lg border-2 border-[#ba1a1a]/30 bg-white px-4 py-4 pl-12 font-mono text-sm font-medium uppercase tracking-[0.1em] outline-none transition placeholder:normal-case placeholder:tracking-normal focus:border-[#ba1a1a] focus:shadow-[0_0_0_2px_rgba(186,26,26,0.2)]"
                                    type="text"
                                    name="adminCode"
                                    placeholder="Nhập mã xác thực hệ thống được cấp"
                                    value={formData.adminCode}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <p className="m-0 text-sm text-[#45464d]/70">Trường thông tin bắt buộc để xác thực quyền quản trị viên cấp cao.</p>
                        </div>

                        {/* Nút Đăng ký */}
                        <button
                            className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#0051d5] p-4 text-lg font-semibold text-white transition hover:bg-[#316bf3] hover:shadow-lg active:scale-[0.98]"
                            type="submit"
                        >
                            Đăng ký tài khoản
                            <span className="material-symbols-outlined">arrow_forward</span>
                        </button>
                    </form>

                    <div className="mt-8 flex items-center justify-center gap-2 text-sm text-[#45464d]">
                        <span>Bạn đã có tài khoản?</span>
                        <a
                            className="font-bold text-[#0051d5] no-underline hover:underline"
                            href="#"
                            onClick={(e) => { e.preventDefault(); navigate('/admin/login'); }}
                        >
                            Đăng nhập ngay
                        </a>
                    </div>

                    <div className="mt-12 text-center text-sm text-[#76777d]">
                        <p>
                            Bằng việc đăng ký, bạn đồng ý với <a className="text-inherit underline" href="#">Điều khoản Dịch vụ</a> và <a className="text-inherit underline" href="#">Chính sách Bảo mật</a> của Parking System.
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}
