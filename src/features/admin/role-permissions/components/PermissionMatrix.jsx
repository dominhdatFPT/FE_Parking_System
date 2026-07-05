import React from 'react';

export default function PermissionMatrix({ permissionModules, permissionActions, selectedPermissions, togglePermission }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border-b border-gray-300 bg-gray-100 p-3 text-left text-xs font-bold uppercase text-gray-700">Module</th>
            {permissionActions.map((action) => (
              <th key={action.key} className="border-b border-gray-300 bg-gray-100 p-3 text-center text-xs font-bold uppercase text-gray-700">
                {action.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {permissionModules.map((moduleItem) => (
            <tr key={moduleItem.key}>
              <td className="border-b border-gray-200 p-3">
                <strong className="block text-gray-900 mb-1">{moduleItem.label}</strong>
                <span className="text-xs text-gray-600">{moduleItem.description}</span>
              </td>
              {permissionActions.map((action) => (
                <td key={action.key} className="border-b border-gray-200 p-3 text-center">
                  <input
                    checked={selectedPermissions[moduleItem.key][action.key]}
                    onChange={() => togglePermission(moduleItem.key, action.key)}
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-blue-600 cursor-pointer"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
