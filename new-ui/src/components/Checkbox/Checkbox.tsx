import React from 'react';
import MuiCheckbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
}) => {
  const checkbox = (
    <MuiCheckbox
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      disabled={disabled}
    />
  );

  if (label) {
    return (
      <FormControlLabel
        control={checkbox}
        label={label}
        disabled={disabled}
      />
    );
  }

  return checkbox;
};

export default Checkbox;
