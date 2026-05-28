import React, { useState, useCallback } from 'react';
import MuiDialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import MuiButton from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useAppDispatch } from '../../../store/hooks';
import { createJob } from '../../../store/jobs/jobsTypes';
import { Test } from '../../../types/test';

const DESCRIPTION = 'Predator executes tests through jobs. Use this form to specify the parameters for the job you want to execute.';

interface JobFormProps {
  data: Test;
  closeDialog: () => void;
  featureToggles?: Record<string, boolean>;
}

const JobForm: React.FC<JobFormProps> = ({ data, closeDialog }) => {
  const dispatch = useAppDispatch();

  const [duration, setDuration] = useState('60');
  const [arrivalRate, setArrivalRate] = useState('10');
  const [rampTo, setRampTo] = useState('');
  const [maxVirtualUsers, setMaxVirtualUsers] = useState('');
  const [environment, setEnvironment] = useState('test');
  const [cronExpression, setCronExpression] = useState('');
  const [notes, setNotes] = useState('');
  const [webhooks, setWebhooks] = useState('');
  const [emails, setEmails] = useState('');

  const handleSubmit = useCallback(() => {
    const body: Record<string, unknown> = {
      test_id: data.id,
      type: 'load_test',
      duration: Number(duration),
      arrival_rate: Number(arrivalRate),
      environment,
      run_immediately: !cronExpression,
    };

    if (rampTo) {
      body.ramp_to = Number(rampTo);
    }
    if (maxVirtualUsers) {
      body.max_virtual_users = Number(maxVirtualUsers);
    }
    if (cronExpression) {
      body.cron_expression = cronExpression;
    }
    if (notes) {
      body.notes = notes;
    }
    if (webhooks.trim()) {
      body.webhooks = webhooks.split(',').map((w) => w.trim()).filter(Boolean);
    }
    if (emails.trim()) {
      body.emails = emails.split(',').map((e) => e.trim()).filter(Boolean);
    }

    dispatch(createJob(body));
    closeDialog();
  }, [data, duration, arrivalRate, rampTo, maxVirtualUsers, environment, cronExpression, notes, webhooks, emails, dispatch, closeDialog]);

  const isDisabled = !duration || !arrivalRate;

  return (
    <MuiDialog open onClose={closeDialog} maxWidth="md" fullWidth>
      <DialogTitle>Run Test: {data.name}</DialogTitle>
      <DialogContent dividers>
        <p style={{ fontSize: '13px', color: '#666', marginBottom: 16 }}>{DESCRIPTION}</p>
        <TextField
          label="Duration (seconds)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          fullWidth
          margin="normal"
          type="number"
          required
        />
        <TextField
          label="Arrival Rate (scenarios/sec)"
          value={arrivalRate}
          onChange={(e) => setArrivalRate(e.target.value)}
          fullWidth
          margin="normal"
          type="number"
          required
        />
        <TextField
          label="Ramp To (scenarios/sec)"
          value={rampTo}
          onChange={(e) => setRampTo(e.target.value)}
          fullWidth
          margin="normal"
          type="number"
        />
        <TextField
          label="Max Virtual Users"
          value={maxVirtualUsers}
          onChange={(e) => setMaxVirtualUsers(e.target.value)}
          fullWidth
          margin="normal"
          type="number"
        />
        <TextField
          label="Environment"
          value={environment}
          onChange={(e) => setEnvironment(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Cron Expression (leave empty for immediate run)"
          value={cronExpression}
          onChange={(e) => setCronExpression(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          fullWidth
          margin="normal"
          multiline
          rows={2}
        />
        <TextField
          label="Webhooks (comma-separated URLs)"
          value={webhooks}
          onChange={(e) => setWebhooks(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Emails (comma-separated)"
          value={emails}
          onChange={(e) => setEmails(e.target.value)}
          fullWidth
          margin="normal"
        />
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
          Run
        </MuiButton>
      </DialogActions>
    </MuiDialog>
  );
};

export default JobForm;
