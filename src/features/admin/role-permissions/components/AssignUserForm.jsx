import React from 'react';

export default function AssignUserForm({ users, roles, selectedUserId, setSelectedUserId, assignRoleId, setAssignRoleId, onAssign }) {
  return (
    <div className="rbac-panel">
      <div className="rbac-panel__heading">
        <h2>Gán Role cho User</h2>
        <p>Chọn user và role, sau đó gán.</p>
      </div>
      <select value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)}>
        {users.map((user) => (<option key={user.userId} value={user.userId}>{user.fullName} - {user.email}</option>))}
      </select>
      <select value={assignRoleId} onChange={(e) => setAssignRoleId(e.target.value)}>
        {roles.map((role) => (<option key={role.id} value={role.id}>{role.name}</option>))}
      </select>
      <button onClick={onAssign} type="button">Gán Role</button>
    </div>
  );
}
