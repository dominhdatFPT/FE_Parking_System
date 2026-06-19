import React from 'react';

/**
 * Geometric Brand Logo component combining letter 'P' with an upward arrow
 * representing Smart Parking progress, movement, and technology.
 */
export default function Logo({ variant = 'horizontal', theme = 'brand', size = 'md', className = '' }) {
  // Sizing mappings
  const iconSizes = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
    xl: 'w-32 h-32',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-3xl',
    xl: 'text-5xl',
  };

  const gapSizes = {
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  };

  // Color theme mappings
  const iconThemes = {
    brand: 'text-sky-600 dark:text-sky-400',
    light: 'text-slate-800 dark:text-slate-200',
    dark: 'text-white',
  };

  const getTextColor = () => {
    if (theme === 'dark') return '#ffffff';
    if (theme === 'light') return '#1e293b';
    return '#1e293b'; // Solid high-contrast charcoal for brand theme
  };

  const getSubtextColor = () => {
    if (theme === 'dark') return '#93c5fd';
    if (theme === 'light') return '#64748b';
    return '#3B6E8C'; // Brand steel blue
  };

  const iconClass = `${iconSizes[size]} ${iconThemes[theme]} shrink-0`;
  const textClass = `font-black tracking-tight ${textSizes[size]} transform -translate-y-[2px]`;
  const subtextClass = `font-bold`;
  const containerClass = `flex ${variant === 'vertical' ? 'flex-col items-center text-center' : 'items-center'} ${gapSizes[size]} ${className}`;

  const LogoIcon = () => (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={iconClass}
    >
      {/* Top-right loop (steel blue) */}
      <path 
        d="M32 20 H62 C74.15 20 84 29.85 84 42 C84 54.15 74.15 64 62 64 H50 V45 Z" 
        fill="#3B6E8C" 
      />
      {/* Bottom-left stem (dark navy) */}
      <path 
        d="M32 58 L32 80 L50 80 L50 40 Z" 
        fill="#1C355E" 
      />
      {/* Dark shadow divider under arrow */}
      <path 
        d="M32 40 L50 22 L50 40 Z" 
        fill="#122442" 
      />
      {/* White Arrow cutting through diagonally */}
      <path 
        d="M28 66 L58 36 L54 32 L72 30 L70 48 L66 44 L36 74 Z" 
        fill="#FFFFFF" 
      />
    </svg>
  );

  if (variant === 'icon-only') {
    return <LogoIcon />;
  }

  return (
    <div className={containerClass}>
      <LogoIcon />
      <span className={textClass} style={{ color: getTextColor() }}>
        Parking <span className={subtextClass} style={{ color: getSubtextColor() }}>System</span>
      </span>
    </div>
  );
}
