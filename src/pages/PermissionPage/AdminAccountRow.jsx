import React from 'react';
import { Edit2, ShieldAlert, UserCheck, UserX } from 'lucide-react';

export default function AdminAccountRow({
  account,
  isLoggedInUser,
  isSelected,
  onSelect,
  onToggleLock
}) {
  const { id, name, email, role, status, lastLogin, avatar } = account;

  const isSuperAdmin = role === 'Super Admin';
  const isBlocked = status === 'Blocked';

  // Role Badge Styling
  const getRoleBadgeClasses = () => {
    switch (role) {
      case 'Super Admin':
        return 'bg-[#EFF6FF] text-[#185FA5] border-[#E0E7FF]';
      case 'Admin':
        return 'bg-[#F0FDF4] text-[#15803D] border-[#DCFCE7]';
      case 'Viewer':
      default:
        return 'bg-[#F5F5F4] text-[#6B7280] border-[#E5E5E0]';
    }
  };

  // Status Badge Styling
  const getStatusBadgeClasses = () => {
    return isBlocked
      ? 'bg-[#DC2626]/10 text-[#DC2626] border-[#DC2626]/20'
      : 'bg-[#15803D]/10 text-[#15803D] border-[#15803D]/20';
  };

  return (
    <tr
      className={`border-b border-[#E0E7FF] transition-colors ${
        isSelected
          ? 'bg-[#F0F4FF]'
          : 'hover:bg-[#F0F4FF]/40'
      }`}
    >
      {/* Avatar & Name */}
      <td className="px-3 py-2.5 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <img
            src={avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80&q=80'}
            alt={name}
            className="h-8 w-8 rounded-full object-cover border border-[#E0E7FF] shadow-sm"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-xs font-semibold text-[#1E1B4B] leading-none">
                {name}
              </span>
              {isLoggedInUser && (
                <span className="text-[9px] font-semibold text-[#185FA5] bg-[#EFF6FF] px-1 py-0.5 rounded border border-[#E0E7FF]">
                  (bạn)
                </span>
              )}
            </div>
            <span className="block text-[9px] text-[#6B7280] font-medium mt-0.5 leading-none">
              {email}
            </span>
          </div>
        </div>
      </td>

      {/* Role */}
      <td className="px-3 py-2.5 whitespace-nowrap">
        <span className={`inline-flex items-center border rounded-full px-2 py-0.5 text-[9px] font-semibold tracking-wide ${getRoleBadgeClasses()}`}>
          {role}
        </span>
      </td>

      {/* Status */}
      <td className="px-3 py-2.5 whitespace-nowrap">
        <span className={`inline-flex items-center border rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${getStatusBadgeClasses()}`}>
          <span className={`mr-1 h-1 w-1 rounded-full ${isBlocked ? 'bg-[#DC2626]' : 'bg-[#15803D]'}`} />
          {isBlocked ? 'Bị khóa' : 'Hoạt động'}
        </span>
      </td>

      {/* Last Login */}
      <td className="px-3 py-2.5 whitespace-nowrap text-[10px] text-[#6B7280] font-medium font-mono leading-tight">
        <div>{lastLogin.split(' ')[0]}</div>
        <div className="text-[9px] opacity-75">{lastLogin.split(' ')[1]}</div>
      </td>

      {/* Action Buttons */}
      <td className="px-3 py-2.5 whitespace-nowrap text-right text-xs font-semibold">
        <div className="flex items-center justify-end gap-1.5">
          {/* Edit Permissions button */}
          <button
            type="button"
            onClick={() => onSelect(id)}
            disabled={isSuperAdmin && !isLoggedInUser} // Only allow self superadmin edit or disable superadmin modifications for others
            className={`inline-flex items-center gap-0.5 px-2 py-1 rounded-lg border text-[10px] font-semibold transition-all duration-200 ${
              isSelected
                ? 'bg-[#185FA5] text-white border-[#185FA5]'
                : isSuperAdmin && !isLoggedInUser
                ? 'bg-[#F5F5F4] text-[#6B7280]/40 border-[#E5E5E0] cursor-not-allowed'
                : 'bg-white text-[#185FA5] border-[#E0E7FF] hover:border-[#185FA5]/30 hover:bg-[#F0F4FF]/30'
            }`}
          >
            <Edit2 className="h-3 w-3" />
            <span>Sửa quyền</span>
          </button>

          {/* Lock / Unlock button */}
          {!isLoggedInUser && !isSuperAdmin ? (
            <button
              type="button"
              onClick={() => onToggleLock(id)}
              className={`inline-flex items-center gap-0.5 px-2 py-1 rounded-lg border text-[10px] font-semibold transition-all duration-200 ${
                isBlocked
                  ? 'bg-[#15803D]/10 text-[#15803D] border-[#15803D]/20 hover:bg-[#15803D]/20'
                  : 'bg-[#DC2626]/10 text-[#DC2626] border-[#DC2626]/20 hover:bg-[#DC2626]/20'
              }`}
            >
              {isBlocked ? (
                <>
                  <UserCheck className="h-3.5 w-3.5" />
                  <span>Mở khóa</span>
                </>
              ) : (
                <>
                  <UserX className="h-3.5 w-3.5" />
                  <span>Khóa</span>
                </>
              )}
            </button>
          ) : isSuperAdmin && !isLoggedInUser ? (
            <span className="text-[10px] text-[#6B7280] italic px-1.5 py-1 flex items-center gap-0.5">
              <ShieldAlert className="h-3 w-3 text-[#6B7280]/65" />
              Bảo vệ
            </span>
          ) : null}
        </div>
      </td>
    </tr>
  );
}
