// src/pages/AccountRecovery.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import Logo from '../../../../components/Logo';

export default function AccountRecovery() {
    const navigate = useNavigate();

    // State lưu 6 ô input OTP
    const [otp, setOtp] = useState(new Array(6).fill(""));

    // State đếm ngược thời gian (2 phút = 120 giây)
    const [timeLeft, setTimeLeft] = useState(120);

    // Ref để auto focus vào ô đầu tiên
    const inputRefs = useRef([]);

    // Xử lý đếm ngược
    useEffect(() => {
        if (timeLeft <= 0) return;
        const timerId = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);
        return () => clearInterval(timerId);
    }, [timeLeft]);

    // Format thời gian thành dạng MM:SS
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    // Xử lý khi gõ vào ô OTP
    const handleChange = (element, index) => {
        if (isNaN(element.value)) return; // Chỉ cho phép nhập số

        // Lấy ký tự cuối cùng nếu người dùng copy paste nhiều số vào 1 ô
        const val = element.value.slice(-1);

        let newOtp = [...otp];
        newOtp[index] = val;
        setOtp(newOtp);

        // Tự động chuyển focus sang ô tiếp theo nếu có giá trị
        if (val !== "" && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    // Xử lý nút xóa (Backspace) để tự động lùi về ô trước
    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    // Xử lý nhấn gửi lại mã
    const handleResend = () => {
        setTimeLeft(120);
        setOtp(new Array(6).fill(""));
        inputRefs.current[0].focus();
        alert("Đã gửi lại mã xác nhận về Email của bạn!");
    };

    // Xử lý submit
    const handleSubmit = (e) => {
        e.preventDefault();
        const otpCode = otp.join("");

        if (otpCode.length < 6) {
            alert("Vui lòng nhập đầy đủ 6 số xác nhận.");
            return;
        }

        // TODO: Gọi API xác thực ở đây
        console.log("Đang xác thực mã:", otpCode);

        // Giả lập thành công và chuyển hướng về trang đặt lại mật khẩu hoặc dashboard
        navigate('/reset-password');
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#eff1f3] p-6 text-[#191c1e]">
            <div className="w-full max-w-[480px] rounded-xl border border-[#e0e3e5] bg-white px-8 py-10 text-center shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] max-sm:px-5">
                {/* Header & Logo */}
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-3 shadow-[0_4px_12px_rgba(0,0,0,0.03)]">
                    <Logo variant="icon-only" size="lg" />
                </div>

                <div>
                    <h1 className="mb-2 text-2xl font-bold text-[#191c1e]">Xác nhận danh tính</h1>
                    <p className="mb-8 text-[15px] leading-normal text-[#45464d]">
                        Vui lòng nhập mã OTP 6 số đã được gửi đến email<br/>
                        <strong className="text-[#0051d5]">admin@nexus.vn</strong>
                    </p>
                </div>

                {/* Form nhập OTP */}
                <form onSubmit={handleSubmit}>

                    <div className="mb-6 flex justify-center gap-3 max-[400px]:gap-2">
                        {otp.map((data, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength="1"
                                className="h-14 w-12 rounded-lg border border-[#c6c6cd] bg-[#f2f4f6] text-center text-2xl font-bold text-[#191c1e] outline-none transition focus:border-[#0051d5] focus:bg-white focus:shadow-[0_0_0_2px_rgba(0,81,213,0.2)] max-[400px]:h-12 max-[400px]:w-10 max-[400px]:text-xl"
                                value={data}
                                onChange={e => handleChange(e.target, index)}
                                onKeyDown={e => handleKeyDown(e, index)}
                                ref={el => inputRefs.current[index] = el}
                                autoFocus={index === 0}
                            />
                        ))}
                    </div>

                    <div className="mb-3 flex items-center justify-between rounded-lg border border-[#e0e3e5] bg-[#f7f9fb] p-4">
                        <div className={`flex items-center gap-1.5 text-sm font-bold ${timeLeft === 0 ? 'text-[#76777d]' : 'text-[#ba1a1a]'}`}>
                            <span className="material-symbols-outlined text-[18px]">timer</span>
                            <span>{formatTime(timeLeft)}</span>
                        </div>
                        <button
                            type="button"
                            className="cursor-pointer rounded-md border border-[#c6c6cd] bg-white px-4 py-2 text-[13px] font-semibold text-[#45464d] transition hover:border-[#76777d] hover:bg-[#f2f4f6] hover:text-[#191c1e] disabled:cursor-not-allowed disabled:opacity-50"
                            onClick={handleResend}
                            disabled={timeLeft > 0} // Chỉ cho phép gửi lại khi hết giờ
                        >
                            Gửi lại mã
                        </button>
                    </div>
                    <p className="mb-8 text-xs italic text-[#76777d]">
                        Mã xác nhận sẽ hết hạn sau {formatTime(timeLeft)} phút
                    </p>

                    <button
                        type="submit"
                        className="mb-6 w-full cursor-pointer rounded-lg bg-[#0051d5] p-4 text-base font-bold text-white transition hover:bg-[#003ea8] hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-[#c6c6cd]"
                        disabled={otp.join("").length < 6}
                    >
                        Xác nhận danh tính
                    </button>

                    <a
                        className="inline-flex cursor-pointer items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-[0.05em] text-[#45464d] transition hover:text-[#0051d5]"
                        onClick={(e) => { e.preventDefault(); navigate('/login'); }}
                    >
                        <span className="material-symbols-outlined">arrow_back</span>
                        Quay lại đăng nhập
                    </a>
                </form>

                {/* Footer Support */}
                <div className="mt-8 border-t border-[#e0e3e5] pt-6 text-sm text-[#45464d]">
                    <p>Gặp khó khăn? <a className="font-bold text-[#0051d5] underline" href="#">Liên hệ bộ phận kỹ thuật</a></p>
                    <div className="mt-4 flex justify-center gap-4 text-[#c6c6cd]">
                        <span className="material-symbols-outlined text-xl" title="SSL Secured">lock</span>
                        <span className="material-symbols-outlined text-xl" title="Verified Identity">verified_user</span>
                        <span className="material-symbols-outlined text-xl" title="Encrypted Data">enhanced_encryption</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
