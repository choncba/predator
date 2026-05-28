import React, { useState, useCallback } from 'react';
import MuiDialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import MuiButton from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Input from '../../../components/Input/Input';
import Checkbox from '../../../components/Checkbox/Checkbox';
import Dropdown from '../../../components/Dropdown/Dropdown';
import { Webhook, WebhookCreatePayload } from '../../../types/webhook';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { createWebhook, updateWebhook } from '../../../store/webhooks/webhooksTypes';
import { selectWebhooksProcessing } from '../../../store/webhooks/webhooksSelectors';

const FORMAT_TYPE_OPTIONS = [
  { value: 'json', label: 'JSON' },
  { value: 'slack', label: 'Slack' },
  { value: 'teams', label: 'Teams' },
  { value: 'discord', label: 'Discord' },
];

interface WebhookFormProps {
  data?: Webhook;
  closeDialog: () => void;
}

const WebhookForm: React.FC<WebhookFormProps> = ({ data, closeDialog }) => {
  const dispatch = useAppDispatch();
  const processing = useAppSelector(selectWebhooksProcessing);

  const [name, setName] = useState(data?.name || '');
  const [url, setUrl] = useState(data?.url || '');
  const [global, setGlobal] = useState(data?.global || false);
  const [formatType, setFormatType] = useState(data?.format_type || 'slack');

  const isEditMode = !!data;

  const handleSubmit = useCallback(() => {
    const payload: WebhookCreatePayload = {
      name,
      url,
      global,
      format_type: formatType,
    };

    if (isEditMode && data) {
      dispatch(updateWebhook(data.id, payload));
    } else {
      dispatch(createWebhook(payload));
    }
  }, [name, url, global, formatType, isEditMode, data, dispatch]);

  const isValid = name.trim().length > 0 && url.trim().length > 0;

  return (
    <MuiDialog open onClose={closeDialog} maxWidth="sm" fullWidth>
      <DialogTitle>{isEditMode ? 'Edit Webhook' : 'Create Webhook'}</DialogTitle>
      <DialogContent dividers>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingTop: '8px' }}>
          <Input
            value={name}
            onChange={setName}
            label="Name"
            placeholder="Webhook name"
            disabled={processing}
          />
          <Input
            value={url}
            onChange={setUrl}
            label="URL"
            placeholder="Webhook URL"
            disabled={processing}
          />
          <Checkbox
            checked={global}
            onChange={setGlobal}
            label="Global"
            disabled={processing}
          />
          <Dropdown
            value={formatType}
            onChange={setFormatType}
            options={FORMAT_TYPE_OPTIONS}
            label="Format Type"
            disabled={processing}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <MuiButton onClick={closeDialog} color="primary" disabled={processing}>
          Cancel
        </MuiButton>
        <MuiButton
          onClick={handleSubmit}
          color="primary"
          disabled={!isValid || processing}
        >
          {processing ? <CircularProgress size={20} /> : 'Submit'}
        </MuiButton>
      </DialogActions>
    </MuiDialog>
  );
};

export default WebhookForm;
