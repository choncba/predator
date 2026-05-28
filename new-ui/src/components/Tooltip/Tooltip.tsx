import React from 'react';
import MuiTooltip from '@mui/material/Tooltip';

interface TooltipProps {
  children: React.ReactElement;
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

const Tooltip: React.FC<TooltipProps> = ({ children, content, placement = 'top' }) => {
  return (
    <MuiTooltip title={content} placement={placement}>
      {children}
    </MuiTooltip>
  );
};

export default Tooltip;
