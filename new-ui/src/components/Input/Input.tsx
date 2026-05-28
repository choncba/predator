import React from 'react';
import TextField from '@mui/material/TextField';

export interface InputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  type?: string;
  fullWidth?: boolean;
}

const Input: React.FC<InputProps> = ({
  value,
  onChange,
  label,
  placeholder,
  disabled = false,
  error = false,
  helperText,
  type = 'text',
  fullWidth = true,
}) => {
  return (
    <TextField
      value={value}
      onChange={(e) => onChange(e.target.value)}
      label={label}
      placeholder={placeholder}
      disabled={disabled}
      error={error}
      helperText={helperText}
      type={type}
      fullWidth={fullWidth}
      variant="outlined"
      size="small"
    />
  );
};

export default Input;
