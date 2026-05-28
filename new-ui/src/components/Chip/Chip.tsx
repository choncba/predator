import React from 'react';
import MuiChip from '@mui/material/Chip';

interface ChipProps {
  label: string;
  onDelete?: () => void;
  color?: 'primary' | 'secondary' | 'default';
}

const Chip: React.FC<ChipProps> = ({ label, onDelete, color = 'default' }) => {
  return (
    <MuiChip
      label={label}
      onDelete={onDelete}
      color={color}
    />
  );
};

export default Chip;
