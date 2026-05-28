import React, { useEffect, useState, useCallback } from 'react';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import Page from '../../components/Page/Page';
import Loader from '../../components/Loader/Loader';
import ErrorDialog from '../../components/ErrorDialog/ErrorDialog';
import DeleteDialog from '../../components/DeleteDialog/DeleteDialog';
import WebhookForm from './components/WebhookForm';
import Button from '../../components/Button/Button';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  getWebhooks,
  clearAllWebhooksSuccess,
} from '../../store/webhooks/webhooksTypes';
import {
  selectWebhooks,
  selectWebhooksLoading,
  selectWebhooksError,
  selectWebhookDeleteSuccess,
  selectWebhookCreateSuccess,
} from '../../store/webhooks/webhooksSelectors';
import { deleteWebhook } from '../../store/webhooks/webhooksTypes';
import { Webhook } from '../../types/webhook';
import styles from './WebhooksPage.module.scss';

const DESCRIPTION =
  'Webhooks are events that notify you on test progress. ' +
  'Webhooks are supported in Slack, Microsoft Teams, or JSON format for an easy server to server integration. ' +
  'You can define a global webhook which will be enabled for system-wide tests or an adhoc webhook which will be optional on a specific test run.';

const WebhooksPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const webhooks = useAppSelector(selectWebhooks);
  const loading = useAppSelector(selectWebhooksLoading);
  const error = useAppSelector(selectWebhooksError);
  const deleteSuccess = useAppSelector(selectWebhookDeleteSuccess);
  const createSuccess = useAppSelector(selectWebhookCreateSuccess);

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState<Webhook | null>(null);
  const [deletingWebhook, setDeletingWebhook] = useState<Webhook | null>(null);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    dispatch(getWebhooks());
  }, [dispatch]);

  useEffect(() => {
    if (deleteSuccess) {
      setSnackbarMessage('Webhook deleted successfully');
      setDeletingWebhook(null);
      dispatch(clearAllWebhooksSuccess());
    }
  }, [deleteSuccess, dispatch]);

  useEffect(() => {
    if (createSuccess) {
      setSnackbarMessage(editingWebhook ? 'Webhook updated successfully' : 'Webhook created successfully');
      setShowCreateDialog(false);
      setEditingWebhook(null);
      dispatch(clearAllWebhooksSuccess());
    }
  }, [createSuccess, editingWebhook, dispatch]);

  const handleCloseError = useCallback(() => {
    dispatch(clearAllWebhooksSuccess());
  }, [dispatch]);

  const handleCloseSnackbar = useCallback(() => {
    setSnackbarMessage('');
  }, []);

  const handleEdit = useCallback((webhook: Webhook) => {
    setEditingWebhook(webhook);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (deletingWebhook) {
      dispatch(deleteWebhook(deletingWebhook.id));
    }
  }, [deletingWebhook, dispatch]);

  const handleCloseForm = useCallback(() => {
    setShowCreateDialog(false);
    setEditingWebhook(null);
  }, []);

  return (
    <Page title="Webhooks" description={DESCRIPTION}>
      <div className={styles.webhooksContainer}>
        <Button
          className={styles.createButton}
          onClick={() => setShowCreateDialog(true)}
          disabled={showCreateDialog}
        >
          Create Webhook
        </Button>

        {webhooks.length === 0 && loading && <Loader />}

        <div className={styles.webhooksList}>
          {webhooks.map((webhook) => (
            <div key={webhook.id} className={styles.webhookCard}>
              <div className={styles.webhookInfo}>
                <div className={styles.webhookName}>{webhook.name}</div>
                <div className={styles.webhookUrl}>{webhook.url}</div>
                <div className={styles.webhookMeta}>
                  {webhook.global && <span className={styles.globalBadge}>Global</span>}
                  <span className={styles.formatBadge}>{webhook.format_type}</span>
                </div>
              </div>
              <div className={styles.webhookActions}>
                <IconButton size="small" onClick={() => handleEdit(webhook)}>
                  <FontAwesomeIcon icon={faPencilAlt} size="sm" />
                </IconButton>
                <IconButton size="small" onClick={() => setDeletingWebhook(webhook)}>
                  <FontAwesomeIcon icon={faTrash} size="sm" />
                </IconButton>
              </div>
            </div>
          ))}
        </div>

        {showCreateDialog && (
          <WebhookForm closeDialog={handleCloseForm} />
        )}

        {editingWebhook && (
          <WebhookForm data={editingWebhook} closeDialog={handleCloseForm} />
        )}

        {deletingWebhook && (
          <DeleteDialog
            display={`${deletingWebhook.name} webhook`}
            onSubmit={handleDeleteConfirm}
            onCancel={() => setDeletingWebhook(null)}
          />
        )}

        {error && (
          <ErrorDialog showMessage={error} closeDialog={handleCloseError} />
        )}

        <Snackbar
          open={!!snackbarMessage}
          message={snackbarMessage}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          ContentProps={{
            sx: { backgroundColor: '#2fbb67' },
          }}
        />
      </div>
    </Page>
  );
};

export default WebhooksPage;
