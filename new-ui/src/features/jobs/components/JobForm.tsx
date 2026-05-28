import React, { useState, useCallback, useEffect } from 'react';
import MuiDialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import MuiButton from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { selectTests } from '../../../store/tests/testsSelectors';
import { getTests } from '../../../store/tests/testsTypes';
import { createJob, updateJob } from '../../../store/jobs/jobsTypes';
import { Job } from '../../../types/job';

const DESCRIPTION = 'Predator executes tests through jobs. Use this form to specify the parameters for the job you want to execute.';

interface JobFormProps {
  data?: Job;
  closeDialog: () => void;
  featureToggles?: Record<string, boolean>;
}

const JobForm: React.FC<JobFormProps> = ({ data, closeDialog, featureToggles: _featureToggles }) => {
  const dispatch = useAppDispatch();
  const tests = useAppSelector(selectTests);
  const editMode = !!data;

  const [testId, setTestId] = useState(data?.test_id || '');
  const [type, setType] = useState(data?.type || 'load_test');
  const [cronExpression, setCronExpression] = useState(data?.cron_expression || '');
  const [duration, setDuration] = useState(data ? String(Math.round(data.duration / 60)) : '');
  const [arrivalRate, setArrivalRate] = useState(data ? String(data.arrival_rate) : '');
  const [rampTo, setRampTo] = useState(data?.ramp_to ? String(data.ramp_to) : '');
  const [maxVirtualUsers, setMaxVirtualUsers] = useState(data?.max_virtual_users ? String(data.max_virtual_users) : '');
  const [environment, setEnvironment] = useState(data?.environment || 'test');
  const [notes, setNotes] = useState(data?.notes || '');
  const [emails, setEmails] = useState<string[]>(data?.emails || []);
  const [webhooks, setWebhooks] = useState<string[]>(data?.webhooks || []);
  const [emailInput, setEmailInput] = useState('');
  const [runImmediately, setRunImmediately] = useState(false);

  useEffect(() => {
    dispatch(getTests());
  }, [dispatch]);

  const handleAddEmail = useCallback(() => {
    const trimmed = emailInput.trim();
    if (trimmed && !emails.includes(trimmed)) {
      setEmails((prev) => [...prev, trimmed]);
      setEmailInput('');
    }
  }, [emailInput, emails]);

  const handleRemoveEmail = useCallback((email: string) => {
    setEmails((prev) => prev.filter((e) => e !== email));
  }, []);

  const handleSubmit = useCallback(() => {
    const durationSec = parseInt(duration, 10) * 60;
    const body: Record<string, unknown> = {
      test_id: testId,
      type,
      duration: durationSec,
      arrival_rate: parseInt(arrivalRate, 10),
      environment,
      run_immediately: runImmediately,
    };

    if (cronExpression) {
      body.cron_expression = cronExpression;
    }
    if (rampTo) {
      body.ramp_to = parseInt(rampTo, 10);
    }
    if (maxVirtualUsers) {
      body.max_virtual_users = parseInt(maxVirtualUsers, 10);
    }
    if (notes) {
      body.notes = notes;
    }
    if (emails.length > 0) {
      body.emails = emails;
    }
    if (webhooks.length > 0) {
      body.webhooks = webhooks;
    }

    if (editMode && data) {
      dispatch(updateJob(data.id, body));
    } else {
      dispatch(createJob(body));
    }
    closeDialog();
  }, [
    testId, type, cronExpression, duration, arrivalRate, rampTo,
    maxVirtualUsers, environment, notes, emails, webhooks,
    runImmediately, editMode, data, dispatch, closeDialog,
  ]);

  const isValid = testId && duration && arrivalRate;

  return (
    <MuiDialog open onClose={closeDialog} maxWidth="sm" fullWidth>
      <DialogTitle>{editMode ? 'Edit Job' : 'Create a New Job'}</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <Box sx={{ mb: 1, color: 'text.secondary', fontSize: '0.875rem' }}>
            {DESCRIPTION}
          </Box>

          <FormControl fullWidth size="small">
            <InputLabel>Test</InputLabel>
            <Select
              value={testId}
              onChange={(e: SelectChangeEvent) => setTestId(e.target.value)}
              label="Test"
              disabled={editMode}
            >
              {tests.map((test) => (
                <MenuItem key={test.id} value={test.id}>
                  {test.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>Type</InputLabel>
            <Select
              value={type}
              onChange={(e: SelectChangeEvent) => setType(e.target.value)}
              label="Type"
            >
              <MenuItem value="load_test">Load Test</MenuItem>
              <MenuItem value="functional_test">Functional Test</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Cron Expression"
            value={cronExpression}
            onChange={(e) => setCronExpression(e.target.value)}
            size="small"
            fullWidth
            placeholder="e.g. 0 0 22 * * *"
          />

          <TextField
            label="Duration (Minutes)"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            size="small"
            fullWidth
            type="number"
            required
          />

          <TextField
            label="Arrival Rate"
            value={arrivalRate}
            onChange={(e) => setArrivalRate(e.target.value)}
            size="small"
            fullWidth
            type="number"
            required
          />

          <TextField
            label="Ramp To"
            value={rampTo}
            onChange={(e) => setRampTo(e.target.value)}
            size="small"
            fullWidth
            type="number"
          />

          <TextField
            label="Max Virtual Users"
            value={maxVirtualUsers}
            onChange={(e) => setMaxVirtualUsers(e.target.value)}
            size="small"
            fullWidth
            type="number"
          />

          <TextField
            label="Environment"
            value={environment}
            onChange={(e) => setEnvironment(e.target.value)}
            size="small"
            fullWidth
          />

          <TextField
            label="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            size="small"
            fullWidth
            multiline
            rows={3}
          />

          <Box>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
              <TextField
                label="Add Email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                size="small"
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddEmail(); } }}
                sx={{ flex: 1 }}
              />
              <MuiButton variant="outlined" size="small" onClick={handleAddEmail}>
                Add
              </MuiButton>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {emails.map((email) => (
                <Chip key={email} label={email} onDelete={() => handleRemoveEmail(email)} size="small" />
              ))}
            </Box>
          </Box>

          <TextField
            label="Webhooks (comma-separated IDs)"
            value={webhooks.join(', ')}
            onChange={(e) => setWebhooks(e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
            size="small"
            fullWidth
          />

          {!editMode && (
            <FormControlLabel
              control={
                <Switch
                  checked={runImmediately}
                  onChange={(e) => setRunImmediately(e.target.checked)}
                />
              }
              label="Run Immediately"
            />
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <MuiButton onClick={closeDialog}>Cancel</MuiButton>
        <MuiButton onClick={handleSubmit} variant="contained" disabled={!isValid}>
          {editMode ? 'Update' : 'Create'}
        </MuiButton>
      </DialogActions>
    </MuiDialog>
  );
};

export default JobForm;
