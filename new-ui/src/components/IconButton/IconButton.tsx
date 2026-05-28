import React from 'react';
import MuiIconButton from '@mui/material/IconButton';
import MuiTooltip from '@mui/material/Tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface IconButtonProps {
  icon: IconDefinition;
  onClick?: () => void;
  tooltip?: string;
  disabled?: boolean;
  className?: string;
}

const IconButton: React.FC<IconButtonProps> = ({ icon, onClick, tooltip, disabled = false, className }) => {
  const button = (
    <MuiIconButton onClick={onClick} disabled={disabled} className={className}>
      <FontAwesomeIcon icon={icon} />
    </MuiIconButton>
  );

  if (tooltip) {
    return (
      <MuiTooltip title={tooltip}>
        <span>{button}</span>
      </MuiTooltip>
    );
  }

  return button;
};

export default IconButton;
