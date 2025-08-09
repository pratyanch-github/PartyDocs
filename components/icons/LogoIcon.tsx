
import React from 'react';

export const LogoIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="PratyDOC Logo"
  >
    <path
      d="M18 2.25C9.85127 2.25 3.375 8.72627 3.375 16.875V28.125C3.375 30.2287 5.02125 31.875 6.75 31.875H13.5C15.5962 31.875 16.875 30.6962 16.875 28.125V11.25C16.875 8.25375 19.1287 5.625 22.5 5.625C25.8712 5.625 28.125 8.25375 28.125 11.25V28.125C28.125 30.2287 29.7712 31.875 31.5 31.875H32.625"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
