import React from 'react';

export default function PermissionToggleCard({
  icon: Icon,
  name,
  description,
  checked,
  onChange,
  disabled,
  disabledReason
}) {
  return (
    <div
      className={`flex items-start justify-between p-4 rounded-2xl border transition-all duration-300 ${
        disabled
          ? 'bg-[#F0F4FF]/50 border-[#E0E7FF] opacity-75'
          : 'bg-white border-[#E0E7FF] shadow-[0_2px_12px_rgba(24,95,165,0.02)] hover:border-[#185FA5]/30'
      }`}
    >
      <div className="flex gap-3">
        <div
          className={`p-2 rounded-xl shrink-0 flex items-center justify-center border ${
            disabled
              ? 'bg-[#E0E7FF] text-[#6B7280] border-transparent'
              : checked
              ? 'bg-[#EFF6FF] text-[#185FA5] border-[#E0E7FF]'
              : 'bg-[#F0F4FF] text-[#6B7280] border-transparent'
          }`}
        >
          {Icon && <Icon className="h-5 w-5" />}
        </div>
        <div>
          <h4
            className={`text-xs font-semibold tracking-tight transition-colors ${
              disabled
                ? 'text-[#6B7280]'
                : 'text-[#1E1B4B]'
            }`}
          >
            {name}
          </h4>
          <p
            className={`mt-1 text-[11px] leading-normal font-medium transition-colors ${
              disabled
                ? 'text-[#6B7280]/70'
                : 'text-[#6B7280]'
            }`}
          >
            {description}
          </p>
        </div>
      </div>

      <div className="relative group/tooltip flex items-center">
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange && onChange(!checked)}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            disabled
              ? 'bg-[#E0E7FF] cursor-not-allowed'
              : checked
              ? 'bg-[#185FA5]'
              : 'bg-[#E0E7FF]'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
              checked ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>

        {disabled && disabledReason && (
          <div className="absolute right-0 bottom-full mb-2.5 hidden group-hover/tooltip:block z-30 w-48 bg-[#1E1B4B] text-white text-[10px] p-2 rounded-lg shadow-lg font-normal leading-normal text-left transition-all">
            {disabledReason}
            {/* Tooltip arrow */}
            <div className="absolute top-full right-4 -mt-1 border-4 border-transparent border-t-[#1E1B4B]" />
          </div>
        )}
      </div>
    </div>
  );
}
