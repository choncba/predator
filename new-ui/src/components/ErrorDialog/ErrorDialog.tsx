import React from 'react';
import MuiDialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import MuiButton from '@mui/material/Button';

interface ErrorDialogProps {
  showMessage: string;
  closeDialog: () => void;
}

const ErrorDialog: React.FC<ErrorDialogProps> = ({ showMessage, closeDialog }) => {
  if (!showMessage) {
    return null;
  }

  return (
    <MuiDialog open onClose={closeDialog} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ color: 'error.main' }}>Error</DialogTitle>
      <DialogContent dividers>
        {String(showMessage)}
      </DialogContent>
      <DialogActions>
        <MuiButton onClick={closeDialog} color="primary">
          OK
        </MuiButton>
      </DialogActions>
    </MuiDialog>
  );
};

export default ErrorDialog;
