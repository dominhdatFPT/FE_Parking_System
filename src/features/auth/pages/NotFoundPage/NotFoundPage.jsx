// src/pages/NotFoundPage.jsx
import React from 'react';
import { useNavigate } from 'react-router';

export default function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div className="flex h-screen flex-col items-center justify-center bg-[#f7f9fb] p-6 text-center">
            <h1 className="m-0 text-[80px] font-bold text-[#0051d5]">404</h1>
            <h2 className="mt-4 mb-2 text-2xl text-[#191c1e]">Không tìm thấy trang</h2>
            <p className="mb-8 max-w-[400px] leading-normal text-[#76777d]">
                Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển sang một đường dẫn khác.
            </p>

            {/* Nút quay về trang chủ hoặc trang đăng nhập tùy bạn */}
            <button
                className="inline-flex items-center gap-2 rounded-lg bg-[#0051d5] px-6 py-3 font-semibold text-white transition hover:bg-[#003ea8]"
                onClick={() => navigate('/login')}
            >
                <span className="material-symbols-outlined">home</span>
                Quay lại trang chủ
            </button>
        </div>
    );
}
