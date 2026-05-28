import React, { useState, useCallback, useEffect } from 'react';
import MuiDialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import MuiButton from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  createChaosExperiment,
  updateChaosExperiment,
  clearAllChaosExperimentsSuccess,
} from '../../../store/chaosExperiments/chaosExperimentsTypes';
import {
  selectChaosExperimentsProcessing,
  selectChaosExperimentsCreateSuccess,
  selectChaosExperimentsError,
} from '../../../store/chaosExperiments/chaosExperimentsSelectors';
import { ChaosExperiment } from '../../../types/chaosExperiment';

const DEFAULT_KUBE_OBJECT = `{
  "apiVersion": "chaos-mesh.org/v1alpha1",
  "kind": "PodChaos",
  "metadata": {
    "name": "",
    "namespace": "",
    "annotations": {}
  },
  "spec": {
    "duration": "",
    "action": ""
  }
}`;

interface ChaosExperimentFormProps {
  data?: ChaosExperiment;
  closeDialog: () => void;
}

const ChaosExperimentForm: React.FC<ChaosExperimentFormProps> = ({ data, closeDialog }) => {
  const dispatch = useAppDispatch();
  const processing = useAppSelector(selectChaosExperimentsProcessing);
  const createSuccess = useAppSelector(selectChaosExperimentsCreateSuccess);
  const error = useAppSelector(selectChaosExperimentsError);

  const [kubeObjectText, setKubeObjectText] = useState<string>(
    data ? JSON.stringify(data.kubeObject, null, '\t') : DEFAULT_KUBE_OBJECT
  );
  const [validationError, setValidationError] = useState<string>('');

  useEffect(() => {
    if (createSuccess) {
      dispatch(clearAllChaosExperimentsSuccess());
      closeDialog();
    }
  }, [createSuccess, closeDialog, dispatch]);

  const handleKubeObjectChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const code = e.target.value;
    setKubeObjectText(code);
    try {
      JSON.parse(code);
      setValidationError('');
    } catch {
      setValidationError('Invalid JSON format');
    }
  }, []);

  const handleSubmit = useCallback(() => {
    try {
      const parsed = JSON.parse(kubeObjectText);
      const name = parsed.metadata?.name || '';
      const body = { name, kubeObject: parsed };

      if (data) {
        dispatch(updateChaosExperiment(data.id, body));
      } else {
        dispatch(createChaosExperiment(body));
      }
    } catch {
      setValidationError('Invalid JSON format');
    }
  }, [kubeObjectText, data, dispatch]);

  return (
    <MuiDialog open onClose={closeDialog} maxWidth="md" fullWidth>
      <DialogTitle>{data ? 'Edit Chaos Experiment' : 'Create Chaos Experiment'}</DialogTitle>
      <DialogContent dividers>
        <TextField
          label="Kubernetes Object (JSON)"
          multiline
          minRows={16}
          maxRows={24}
          fullWidth
          value={kubeObjectText}
          onChange={handleKubeObjectChange}
          error={!!validationError}
          helperText={validationError || ' '}
          InputProps={{
            sx: { fontFamily: 'monospace', fontSize: '0.85rem' },
          }}
        />
        {error && (
          <div style={{ color: 'red', marginTop: 8 }}>{error}</div>
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
          disabled={!!validationError || processing}
        >
          {processing ? <CircularProgress size={20} /> : 'Submit'}
        </MuiButton>
      </DialogActions>
    </MuiDialog>
  );
};

export default ChaosExperimentForm;
