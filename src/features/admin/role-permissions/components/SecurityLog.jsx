import React from 'react';

export default function SecurityLog({ securityLogs }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-bold text-gray-900">Security Log</h2>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {securityLogs.slice(0, 10).map((log) => (
          <p key={log.id} className="text-sm text-gray-700 pb-2 border-b border-gray-100 last:border-0">
            <strong className={`inline-block px-2 py-1 rounded text-xs font-bold text-white mr-2 ${
              log.status === 'Success' ? 'bg-green-600' :
              log.status === 'Failed' ? 'bg-red-600' :
              log.status === 'Blocked' ? 'bg-yellow-600' :
              'bg-blue-600'
            }`}>
              {log.status}
            </strong>
            <span className="text-gray-900">{log.action}</span>: <span className="text-gray-600">{log.message}</span>
          </p>
        ))}
      </div>
    </div>
  );
}
