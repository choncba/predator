import React from 'react';
import MuiDialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import MuiButton from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

interface DeleteDialogProps {
  display: string;
  onSubmit: () => void;
  onCancel: () => void;
  loader?: boolean;
  errorOnDelete?: string;
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({
  display,
  onSubmit,
  onCancel,
  loader = false,
  errorOnDelete,
}) => {
  const title = errorOnDelete
    ? errorOnDelete
    : `Are you sure you want to delete ${display}?`;

  return (
    <MuiDialog open onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        {errorOnDelete
          ? 'Please click cancel to go back.'
          : ''}
        {loader && <CircularProgress size={24} sx={{ ml: 2 }} />}
      </DialogContent>
      <DialogActions>
        <MuiButton onClick={onCancel} color="primary">
          Cancel
        </MuiButton>
        <MuiButton
          onClick={onSubmit}
          color="primary"
          disabled={!!errorOnDelete || loader}
        >
          Submit
        </MuiButton>
      </DialogActions>
    </MuiDialog>
  );
};

export default DeleteDialog;
