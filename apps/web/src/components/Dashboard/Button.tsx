import { FC } from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  children: React.ReactNode;
}

export const Button: FC<ButtonProps> = ({ variant = 'primary', onClick, className, disabled, children }) => {
  const baseClass = 'px-4 py-2 rounded font-semibold';
  const variantClass =
    variant === 'primary'
      ? 'bg-blue-500 text-white'
      : 'bg-gray-500 text-white';

  return (
    <button
      className={`${baseClass} ${variantClass} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
