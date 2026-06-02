import React from 'react';

export default function PermissionMatrix({ permissionModules, permissionActions, selectedPermissions, togglePermission }) {
  return (
    <div className="rbac-table-wrap">
      <table className="rbac-table">
        <thead>
          <tr>
            <th>Module</th>
            {permissionActions.map((action) => (<th key={action.key}>{action.label}</th>))}
          </tr>
        </thead>
        <tbody>
          {permissionModules.map((moduleItem) => (
            <tr key={moduleItem.key}>
              <td>
                <strong>{moduleItem.label}</strong>
                <span>{moduleItem.description}</span>
              </td>
              {permissionActions.map((action) => (
                <td key={action.key}>
                  <input checked={selectedPermissions[moduleItem.key][action.key]} onChange={() => togglePermission(moduleItem.key, action.key)} type="checkbox" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
