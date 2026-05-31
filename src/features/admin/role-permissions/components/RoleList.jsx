import React from 'react';

export default function RoleList({ roles, selectedRoleId, onSelect, searchValue, setSearchValue }) {
  return (
    <div className="rbac-role-list">
      <label className="rbac-search">
        Tìm kiếm Role
        <input value={searchValue} onChange={(e) => setSearchValue(e.target.value)} placeholder="Admin, Manager, Staff..." />
      </label>
      {roles.map((role) => (
        <button
          className={role.id === selectedRoleId ? 'selected' : ''}
          key={role.id}
          onClick={() => onSelect(role.id)}
          type="button"
        >
          <span>
            <strong>{role.name}</strong>
            <small>{role.status}</small>
          </span>
          <em>{role.description}</em>
          <small>{role.assignedUsers} user đang dùng</small>
        </button>
      ))}
    </div>
  );
}
