import React from 'react';

export default function RoleForm({ newRoleName, setNewRoleName, newRoleDescription, setNewRoleDescription, onCreateRole }) {
  return (
    <form className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4" onSubmit={onCreateRole}>
      <div>
        <h2 className="text-xl font-bold text-gray-900">Tạo Role mới</h2>
        <p className="text-sm text-gray-600">Nhập tên, mô tả và admin code để tạo</p>
      </div>
      <input
        placeholder="Tên Role"
        value={newRoleName}
        onChange={(e) => setNewRoleName(e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
      />
      <textarea
        placeholder="Mô tả Role"
        value={newRoleDescription}
        onChange={(e) => setNewRoleDescription(e.target.value)}
        rows="4"
        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition resize-vertical"
      />
      <button
        type="submit"
        className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white transition hover:bg-blue-700"
      >
        Tạo Role
      </button>
    </form>
  );
}
