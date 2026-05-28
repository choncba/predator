import React from 'react';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';

export interface RadioButtonOption {
  value: string;
  label: string;
}

export interface RadioButtonProps {
  value: string;
  onChange: (value: string) => void;
  options: RadioButtonOption[];
  label?: string;
}

const RadioButton: React.FC<RadioButtonProps> = ({
  value,
  onChange,
  options,
  label,
}) => {
  return (
    <FormControl>
      {label && <FormLabel>{label}</FormLabel>}
      <RadioGroup
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={<Radio />}
            label={option.label}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

export default RadioButton;
