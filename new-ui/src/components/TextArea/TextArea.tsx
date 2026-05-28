import React from 'react';
import TextField from '@mui/material/TextField';

export interface TextAreaProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
}

const TextArea: React.FC<TextAreaProps> = ({
  value,
  onChange,
  label,
  placeholder,
  rows = 4,
  disabled = false,
}) => {
  return (
    <TextField
      value={value}
      onChange={(e) => onChange(e.target.value)}
      label={label}
      placeholder={placeholder}
      rows={rows}
      disabled={disabled}
      multiline
      fullWidth
      variant="outlined"
      size="small"
    />
  );
};

export default TextArea;
