import React from 'react';
import MuiPopover from '@mui/material/Popover';

interface PopoverProps {
  children: React.ReactNode;
  content: React.ReactNode;
  open: boolean;
  onClose: () => void;
  anchorEl: HTMLElement | null;
}

const Popover: React.FC<PopoverProps> = ({ children, content, open, onClose, anchorEl }) => {
  return (
    <>
      {children}
      <MuiPopover
        open={open}
        anchorEl={anchorEl}
        onClose={onClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        {content}
      </MuiPopover>
    </>
  );
};

export default Popover;
