import React from 'react';
import MuiDialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import MuiButton from '@mui/material/Button';
import Loader from '../Loader';

interface DialogProps {
  data: Record<string, unknown>;
  titleKey?: string;
  closeDialog: () => void;
}

const Dialog: React.FC<DialogProps> = ({ data, titleKey, closeDialog }) => {
  const title = titleKey && data ? String(data[titleKey] ?? 'None') : 'None';

  return (
    <MuiDialog open onClose={closeDialog} maxWidth="md" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        {data ? (
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        ) : (
          <Loader />
        )}
      </DialogContent>
      <DialogActions>
        <MuiButton onClick={closeDialog} color="primary">
          Cancel
        </MuiButton>
      </DialogActions>
    </MuiDialog>
  );
};

export default Dialog;
