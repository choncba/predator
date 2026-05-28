import React from 'react';
import MuiButton from '@mui/material/Button';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'contained' | 'outlined' | 'text';
  color?: 'primary' | 'secondary' | 'error';
  disabled?: boolean;
  type?: 'button' | 'submit';
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  className,
  variant = 'contained',
  color = 'primary',
  disabled = false,
  type = 'button',
}) => {
  return (
    <MuiButton
      variant={variant}
      color={color}
      onClick={onClick}
      className={className}
      disabled={disabled}
      type={type}
    >
      {children}
    </MuiButton>
  );
};

export default Button;
