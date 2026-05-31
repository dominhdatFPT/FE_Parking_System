import React from 'react';

export default function RoleForm({ newRoleName, setNewRoleName, newRoleDescription, setNewRoleDescription, onCreateRole }) {
  return (
    <form className="rbac-panel" onSubmit={onCreateRole}>
      <div className="rbac-panel__heading">
        <h2>Tạo Role mới</h2>
        <p>Nhập tên, mô tả và Admin Code để tạo.</p>
      </div>
      <input placeholder="Tên Role" value={newRoleName} onChange={(e) => setNewRoleName(e.target.value)} />
      <textarea placeholder="Mô tả Role" value={newRoleDescription} onChange={(e) => setNewRoleDescription(e.target.value)} />
      <button type="submit">Tạo Role</button>
    </form>
  );
}
