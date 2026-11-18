import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'yellow' | 'red' | 'blue' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-headline uppercase tracking-wider font-semibold transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none rounded focus:outline-none';

  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-xs sm:text-sm px-4 py-2.5 gap-2',
    lg: 'text-sm sm:text-base px-6 py-3.5 gap-2.5',
  };

  const variantClasses = {
    primary:
      'bg-[#E5CFAF] text-[#0E2F2C] font-extrabold hover:brightness-105 shadow-[0_4px_16px_rgba(229,207,175,0.35)] rounded-xl',
    yellow:
      'bg-[#E5CFAF] text-[#0E2F2C] font-extrabold hover:brightness-105 shadow-[0_4px_16px_rgba(229,207,175,0.35)] rounded-xl',
    accent:
      'bg-[#0B2523] text-[#FAF7F2] border border-[#1D4D47] hover:border-[#E5CFAF] rounded-xl',
    secondary:
      'bg-[#133834] text-[#FAF7F2] hover:bg-[#18423D] border border-[#1D4D47] hover:border-[#E5CFAF]/40 rounded-xl',
    outline:
      'bg-transparent hover:bg-[#133834] text-[#FAF7F2] border border-[#1D4D47] hover:border-[#E5CFAF] rounded-xl',
    danger:
      'bg-[#133834] hover:bg-red-950/40 text-red-300 border border-red-900/40 rounded-xl',
    red:
      'bg-red-600 text-white hover:brightness-110 font-bold rounded-xl',
    blue:
      'bg-[#E5CFAF] text-[#0E2F2C] hover:brightness-110 font-bold rounded-xl',
    ghost:
      'bg-transparent hover:bg-white/5 text-[#C5D5D3] hover:text-[#FAF7F2] rounded-xl',
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
    </button>
  );
};
