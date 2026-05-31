import React, { useState } from 'react';

export default function AdminCodeModal({ open, title, onCancel, onConfirm }) {
  const [code, setCode] = useState('');
  if (!open) return null;
  const [showCode, setShowCode] = useState(false);
  return (
    <div className="rbac-modal" role="dialog" aria-modal="true">
      <div className="rbac-modal__panel">
        <h3>{title}</h3>
        <p>Vui lòng nhập Admin Code để xác nhận thao tác.</p>
        <div className="rbac-password-field">
          <input autoFocus type={showCode ? 'text' : 'password'} value={code} onChange={(e) => setCode(e.target.value)} placeholder="Admin Code" />
          <button type="button" className="rbac-password-toggle" aria-label={showCode ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'} onClick={() => setShowCode((prev) => !prev)}>
            <span className="material-symbols-outlined">{showCode ? 'visibility_off' : 'visibility'}</span>
          </button>
        </div>
        <div className="rbac-modal__actions">
          <button onClick={() => { setCode(''); onCancel(); }} type="button">Hủy</button>
          <button onClick={() => { onConfirm(code); setCode(''); }} type="button">Xác nhận</button>
        </div>
      </div>
    </div>
  );
}
