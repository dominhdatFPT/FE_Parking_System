import React, { useState } from 'react';
import { useNavigate } from 'react-router';

const visualIcons = [
    ['security', 'text-[120px]'],
    ['encrypted', 'text-[100px]'],
    ['lock_person', 'text-[140px]'],
    ['verified_user', 'text-[110px]'],
    ['admin_panel_settings', 'text-[130px]'],
    ['policy', 'text-[90px]'],
    ['vpn_key', 'text-[150px]'],
    ['shield_lock', 'text-[110px]'],
    ['key_visualizer', 'text-[120px]'],
    ['safety_check', 'text-[100px]'],
    ['fingerprint', 'text-[140px]'],
    ['id_card', 'text-[110px]'],
];

const ruleIconClass = (valid, dirty) =>
    `material-symbols-outlined text-[18px] ${
        valid
            ? "text-[#0051d5] [font-variation-settings:'FILL'_1]"
            : dirty
              ? "text-[#ba1a1a] [font-variation-settings:'FILL'_1]"
              : "text-[#76777d] [font-variation-settings:'FILL'_0]"
    }`;

export default function ResetPassword() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    // Kiểm tra điều kiện mật khẩu (Ít nhất 8 ký tự và có cả chữ lẫn số)
    const isLengthValid = newPassword.length >= 8;
    const isAlphanumericValid = /[a-zA-Z]/.test(newPassword) && /[0-9]/.test(newPassword);

    // Xử lý khi nhấn nút Cập nhật mật khẩu
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isLengthValid || !isAlphanumericValid) {
            alert('Vui lòng đảm bảo mật khẩu đáp ứng đủ các quy tắc!');
            return;
        }
        if (newPassword !== confirmPassword) {
            alert('Mật khẩu xác nhận không khớp!');
            return;
        }

        // TODO: Gọi API cập nhật mật khẩu của bạn ở đây
        console.log('Cập nhật mật khẩu thành công:', newPassword);

        // Thông báo và chuyển hướng về trang đăng nhập
        alert('Đổi mật khẩu thành công!');
        navigate('/login');
    };

    return (
        <main className="flex h-screen w-screen overflow-hidden bg-[#f7f9fb] text-[#191c1e]">

            {/* Cột trái: Hình ảnh và thông tin hệ thống */}
            <section className="relative hidden w-1/2 flex-col items-center justify-center overflow-hidden bg-[#131b2e] md:flex">
                <div className="pointer-events-none absolute inset-0 grid grid-cols-6 gap-8 p-12 opacity-10">
                    {visualIcons.map(([icon, size]) => (
                        <span className={`material-symbols-outlined text-[#dae2fd] ${size}`} key={icon}>
                            {icon}
                        </span>
                    ))}
                </div>

                <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="mb-8 flex h-48 w-48 items-center justify-center overflow-hidden rounded-full border-4 border-[#0051d5]/20 bg-white p-4 shadow-xl">
                        {/* Đường dẫn logo (Đảm bảo file image_ac156e.jpg đã nằm trong thư mục public) */}
                        <img
                            className="h-full w-full object-contain"
                            alt="Parking System Logo"
                            src="/image_ac156e.jpg"
                        />
                    </div>
                    <h1 className="m-0 text-4xl font-bold leading-[44px] tracking-[-0.02em] text-white">Parking System</h1>
                    <p className="mt-4 max-w-md text-base leading-6 text-[#7c839b]">
                        Hệ thống quản lý bãi đỗ xe thông minh, tối ưu hóa vận hành và đảm bảo an ninh tuyệt đối cho tòa nhà của bạn.
                    </p>
                </div>

                <div className="absolute bottom-12 text-xs font-bold uppercase tracking-[0.05em] text-[#7c839b]/60">
                    Operational Precision © 2024
                </div>
            </section>

            {/* Cột phải: Form đặt lại mật khẩu */}
            <section className="flex w-full items-center justify-center bg-[#f7f9fb] p-6 md:w-1/2">
                <div className="w-full max-w-[480px]">
                    <div className="mb-10">
                        <h2 className="mb-2 text-2xl font-semibold leading-8 text-black">Đặt lại mật khẩu</h2>
                        <p className="text-base text-[#45464d]">Vui lòng khởi tạo mật khẩu mới cho tài khoản của bạn</p>
                    </div>

                    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>

                        {/* Tên đăng nhập (Chỉ đọc) */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold uppercase tracking-[0.05em] text-[#45464d]">Tên đăng nhập</label>
                            <div className="relative flex items-center">
                                <span className="material-symbols-outlined pointer-events-none absolute left-4 text-[#76777d]">person</span>
                                <input
                                    className="w-full rounded-lg border border-[#c6c6cd] bg-[#f2f4f6] px-4 py-3 pl-12 text-base text-[#191c1e] outline-none read-only:cursor-not-allowed"
                                    readOnly
                                    type="text"
                                    value="admin_precision_01"
                                />
                            </div>
                        </div>

                        {/* Mật khẩu mới */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold uppercase tracking-[0.05em] text-[#45464d]">Mật khẩu mới</label>
                            <div className="relative flex items-center">
                                <span className="material-symbols-outlined pointer-events-none absolute left-4 text-[#76777d]">lock</span>
                                <input
                                    className="w-full rounded-lg border border-[#c6c6cd] bg-white py-3 pr-12 pl-12 text-base text-[#191c1e] outline-none transition focus:border-[#0051d5] focus:shadow-[0_0_0_1px_#0051d5]"
                                    placeholder="Nhập mật khẩu mới"
                                    type={showPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                                <button
                                    className="absolute right-4 flex cursor-pointer border-0 bg-transparent p-0 text-[#76777d] hover:text-[#0051d5]"
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                  <span className="material-symbols-outlined">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                                </button>
                            </div>
                        </div>

                        {/* Xác nhận mật khẩu mới */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold uppercase tracking-[0.05em] text-[#45464d]">Xác nhận mật khẩu mới</label>
                            <div className="relative flex items-center">
                                <span className="material-symbols-outlined pointer-events-none absolute left-4 text-[#76777d]">verified_user</span>
                                <input
                                    className="w-full rounded-lg border border-[#c6c6cd] bg-white px-4 py-3 pl-12 text-base text-[#191c1e] outline-none transition focus:border-[#0051d5] focus:shadow-[0_0_0_1px_#0051d5]"
                                    placeholder="Nhập lại mật khẩu mới"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                            {confirmPassword && confirmPassword !== newPassword && (
                                <p className="mt-1 text-xs text-[#ba1a1a]">Mật khẩu xác nhận không khớp!</p>
                            )}
                        </div>

                        {/* Bảng kiểm tra quy tắc mật khẩu */}
                        <div className="flex flex-col gap-3 rounded-lg border border-[#c6c6cd] bg-white p-4">
                            <p className="m-0 text-xs font-bold uppercase text-[#45464d]">Quy tắc mật khẩu:</p>
                            <div className="flex items-center gap-2 text-sm text-[#45464d]">
                <span className={ruleIconClass(isLengthValid, newPassword)}>
                  {isLengthValid ? 'check_circle' : (newPassword ? 'cancel' : 'radio_button_unchecked')}
                </span>
                                <span>Ít nhất 8 ký tự</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-[#45464d]">
                <span className={ruleIconClass(isAlphanumericValid, newPassword)}>
                  {isAlphanumericValid ? 'check_circle' : (newPassword ? 'cancel' : 'radio_button_unchecked')}
                </span>
                                <span>Bao gồm cả chữ cái và số</span>
                            </div>
                        </div>

                        {/* Nút Submit */}
                        <button
                            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#0051d5] p-4 text-lg font-semibold text-white shadow transition hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
                            type="submit"
                            disabled={!isLengthValid || !isAlphanumericValid || !newPassword || newPassword !== confirmPassword}
                        >
                            Cập nhật mật khẩu
                            <span className="material-symbols-outlined">arrow_forward</span>
                        </button>

                        {/* Link quay lại */}
                        <div className="mt-6 text-center">
                            <a
                                className="inline-flex cursor-pointer items-center justify-center gap-1 text-sm text-[#0051d5] hover:underline"
                                onClick={() => navigate('/login')}
                            >
                                <span className="material-symbols-outlined text-[18px]">keyboard_backspace</span>
                                Quay lại trang đăng nhập
                            </a>
                        </div>
                    </form>
                </div>
            </section>
        </main>
    );
}
