import React, { useState } from 'react';

export default function AdminCodeModal({ open, title, onCancel, onConfirm }) {
  const [code, setCode] = useState('');
  const [showCode, setShowCode] = useState(false);
  
  if (!open) return null;

  const handleCancel = () => {
    setCode('');
    onCancel();
  };

  const handleConfirm = () => {
    onConfirm(code);
    setCode('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" role="dialog" aria-modal="true">
      <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white shadow-2xl p-8 space-y-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
          <p className="text-gray-600 mt-2">Vui lòng nhập Admin Code để xác nhận thao tác.</p>
        </div>

        <div className="flex gap-2">
          <input
            autoFocus
            type={showCode ? 'text' : 'password'}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Admin Code"
            className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
          />
          <button
            type="button"
            className="px-3 py-3 text-gray-600 hover:text-gray-900"
            aria-label={showCode ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            onClick={() => setShowCode((prev) => !prev)}
          >
            <span className="material-symbols-outlined text-xl">
              {showCode ? 'visibility_off' : 'visibility'}
            </span>
          </button>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            onClick={handleCancel}
            type="button"
            className="flex-1 rounded-lg border border-gray-300 text-gray-700 font-semibold py-2.5 transition hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            onClick={handleConfirm}
            type="button"
            className="flex-1 rounded-lg bg-blue-600 text-white font-semibold py-2.5 transition hover:bg-blue-700"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}
