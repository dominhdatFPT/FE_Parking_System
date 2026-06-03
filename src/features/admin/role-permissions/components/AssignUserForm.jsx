import React from 'react';

export default function AssignUserForm({ users, roles, selectedUserId, setSelectedUserId, assignRoleId, setAssignRoleId, onAssign }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Gán Role cho User</h2>
        <p className="text-sm text-gray-600">Chọn user và role, sau đó gán</p>
      </div>
      <select
        value={selectedUserId}
        onChange={(e) => setSelectedUserId(e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition bg-white"
      >
        {users.map((user) => (
          <option key={user.userId} value={user.userId}>
            {user.fullName} - {user.email}
          </option>
        ))}
      </select>
      <select
        value={assignRoleId}
        onChange={(e) => setAssignRoleId(e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition bg-white"
      >
        {roles.map((role) => (
          <option key={role.id} value={role.id}>
            {role.name}
          </option>
        ))}
      </select>
      <button
        onClick={onAssign}
        type="button"
        className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white transition hover:bg-blue-700"
      >
        Gán Role
      </button>
    </div>
  );
}
