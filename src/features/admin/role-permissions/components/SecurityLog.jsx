import React from 'react';

export default function SecurityLog({ securityLogs }) {
  return (
    <div className="rbac-log">
      <h2>Security Log</h2>
      {securityLogs.slice(0, 10).map((log) => (
        <p key={log.id}>
          <strong>{log.status}</strong> - {log.action}: {log.message}
        </p>
      ))}
    </div>
  );
}
