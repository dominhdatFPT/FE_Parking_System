import React from 'react';

export default function RoleList({ roles, selectedRoleId, onSelect }) {
  return (
    <div className="space-y-2.5">
      {roles.map((role) => (
        <button
          className={`w-full text-left rounded-lg border p-4 transition ${
            role.id === selectedRoleId
              ? 'border-blue-600 bg-blue-50 shadow-md ring-1 ring-blue-100'
              : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50'
          }`}
          key={role.id}
          onClick={() => onSelect(role.id)}
          type="button"
        >
          <div className="flex items-center justify-between mb-2">
            <strong className="text-gray-900">{role.name}</strong>
            <small className="text-gray-600 font-medium">{role.status}</small>
          </div>
          <p className="text-gray-600 text-sm leading-snug mb-1">{role.description}</p>
          <small className="text-gray-500">{role.assignedUsers} user đang dùng</small>
        </button>
      ))}
    </div>
  );
}
