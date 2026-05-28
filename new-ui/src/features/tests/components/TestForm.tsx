import React, { useState, useCallback } from 'react';
import MuiDialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import MuiButton from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { useAppDispatch } from '../../../store/hooks';
import { createTest, editTest } from '../../../store/tests/testsTypes';
import { Test, TestCreatePayload } from '../../../types/test';

interface TestFormProps {
  data?: Test;
  closeDialog: () => void;
  cloneMode?: boolean;
}

const TestForm: React.FC<TestFormProps> = ({ data, closeDialog, cloneMode = false }) => {
  const dispatch = useAppDispatch();

  const isEditMode = !!data && !cloneMode;
  const title = isEditMode ? 'Edit Test' : cloneMode ? 'Clone Test' : 'Create Test';

  const [name, setName] = useState(data ? (cloneMode ? `${data.name}_clone` : data.name) : '');
  const [description, setDescription] = useState(data?.description ?? '');
  const [type, setType] = useState(data?.type ?? 'basic');
  const [artilleryTest, setArtilleryTest] = useState(
    data?.artillery_test ? JSON.stringify(data.artillery_test, null, 2) : '{}'
  );
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [jsonError, setJsonError] = useState<string | null>(null);

  const handleSubmit = useCallback(() => {
    let parsedArtillery: Record<string, unknown>;
    try {
      parsedArtillery = JSON.parse(artilleryTest);
    } catch {
      setJsonError('Invalid JSON');
      return;
    }

    const body: TestCreatePayload = {
      name,
      description,
      type,
      artillery_test: parsedArtillery,
    };

    if (isEditMode && data) {
      dispatch(editTest(body, data.id, csvFile ?? undefined));
    } else {
      dispatch(createTest(body, csvFile ?? undefined));
    }

    closeDialog();
  }, [name, description, type, artilleryTest, csvFile, isEditMode, data, dispatch, closeDialog]);

  const isDisabled = !name.trim();

  return (
    <MuiDialog open onClose={closeDialog} maxWidth="md" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          margin="normal"
          multiline
          rows={2}
        />
        <TextField
          label="Type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          select
          fullWidth
          margin="normal"
        >
          <MenuItem value="basic">basic</MenuItem>
          <MenuItem value="dsl">dsl</MenuItem>
        </TextField>
        <TextField
          label="Artillery Test (JSON)"
          value={artilleryTest}
          onChange={(e) => {
            setArtilleryTest(e.target.value);
            setJsonError(null);
          }}
          fullWidth
          margin="normal"
          multiline
          rows={10}
          error={!!jsonError}
          helperText={jsonError}
          InputProps={{
            style: { fontFamily: 'monospace', fontSize: '13px' },
          }}
        />
        <MuiButton
          variant="outlined"
          component="label"
          sx={{ mt: 1 }}
        >
          Upload CSV File
          <input
            type="file"
            accept=".csv"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null;
              setCsvFile(file);
            }}
          />
        </MuiButton>
        {csvFile && (
          <span style={{ marginLeft: 8, fontSize: '13px' }}>{csvFile.name}</span>
        )}
      </DialogContent>
      <DialogActions>
        <MuiButton onClick={closeDialog} color="primary">
          Cancel
        </MuiButton>
        <MuiButton
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          disabled={isDisabled}
        >
          {isEditMode ? 'Save' : 'Create'}
        </MuiButton>
      </DialogActions>
    </MuiDialog>
  );
};

export default TestForm;
