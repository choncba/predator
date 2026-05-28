import React from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';

export interface MultiSelectOption {
  value: string;
  label: string;
}

export interface MultiSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
  options: MultiSelectOption[];
  label?: string;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  value,
  onChange,
  options,
  label,
}) => {
  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const selected = event.target.value;
    onChange(typeof selected === 'string' ? selected.split(',') : selected);
  };

  const getLabelForValue = (val: string): string => {
    const option = options.find((opt) => opt.value === val);
    return option ? option.label : val;
  };

  return (
    <FormControl fullWidth size="small">
      {label && <InputLabel>{label}</InputLabel>}
      <Select
        multiple
        value={value}
        onChange={handleChange}
        label={label}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map((val) => (
              <Chip key={val} label={getLabelForValue(val)} size="small" />
            ))}
          </Box>
        )}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default MultiSelect;
