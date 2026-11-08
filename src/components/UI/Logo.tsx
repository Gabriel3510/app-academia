import React from 'react';

/** Keep in sync with public/favicon.svg and scripts/gerar_icones.py */
const Logo: React.FC<{ size?: number; className?: string }> = ({ size = 36, className }) => (
  <svg viewBox="0 0 64 64" width={size} height={size} className={className} aria-hidden="true">
    <rect width="64" height="64" rx="16" fill="#181A22" />
    <rect x="21" y="29" width="22" height="6" rx="3" fill="#F3F4F6" />
    <rect x="14" y="17" width="8" height="30" rx="3" fill="#FF6A1A" />
    <rect x="42" y="17" width="8" height="30" rx="3" fill="#FF6A1A" />
    <rect x="7" y="23" width="6" height="18" rx="2.5" fill="#FF6A1A" />
    <rect x="51" y="23" width="6" height="18" rx="2.5" fill="#FF6A1A" />
  </svg>
);

export default Logo;
