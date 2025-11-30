import React from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  label: string; // For accessibility
}

export const IconButton: React.FC<IconButtonProps> = ({ children, label, className, ...props }) => {
  return (
    <button
      type="button"
      aria-label={label}
      className={`p-2 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green transition-colors ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
