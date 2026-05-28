import React, { useEffect, useState, useCallback, useMemo } from 'react';
import Snackbar from '@mui/material/Snackbar';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  selectProcessors,
  selectProcessingGetProcessors,
  selectErrorOnGetProcessors,
  selectDeleteProcessorSuccess,
  selectCreateProcessorSuccess,
} from '../../store/processors/processorsSelectors';
import {
  GET_PROCESSORS,
  DELETE_PROCESSOR,
  CLEAR_ALL_PROCESSORS_SUCCESS,
} from '../../store/processors/processorsTypes';
import Page from '../../components/Page/Page';
import Button from '../../components/Button/Button';
import ReactTable from '../../components/ReactTable/ReactTable';
import DeleteDialog from '../../components/DeleteDialog/DeleteDialog';
import ErrorDialog from '../../components/ErrorDialog/ErrorDialog';
import ProcessorForm from './components/ProcessorForm';
import { getProcessorColumns } from './columns';
import { Processor } from '../../types/processor';
import Loader from '../../components/Loader/Loader';
import _ from 'lodash';
import styles from './ProcessorsPage.module.scss';

const DESCRIPTION =
  'Processors inject custom JavaScript into test flows, allowing the flow to be as flexible as possible.';
const ERROR_MSG_GET_PROCESSORS = 'Error occurred while trying to get all processors.';

const ProcessorsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const processors = useAppSelector(selectProcessors);
  const processing = useAppSelector(selectProcessingGetProcessors);
  const error = useAppSelector(selectErrorOnGetProcessors);
  const deleteSuccess = useAppSelector(selectDeleteProcessorSuccess);
  const createSuccess = useAppSelector(selectCreateProcessorSuccess);

  const [sortedProcessors, setSortedProcessors] = useState<Processor[]>([]);
  const [sortHeader, setSortHeader] = useState('updated_at-');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [processorForEdit, setProcessorForEdit] = useState<Processor | undefined>(undefined);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [processorToDelete, setProcessorToDelete] = useState<Processor | undefined>(undefined);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    dispatch({ type: GET_PROCESSORS });
  }, [dispatch]);

  useEffect(() => {
    if (processors.length > 0) {
      const sorted = _.chain([...processors]).sortBy('updated_at').reverse().value();
      setSortedProcessors(sorted);
      setSortHeader('updated_at-');
    } else {
      setSortedProcessors([]);
    }
  }, [processors]);

  useEffect(() => {
    if (deleteSuccess) {
      setSnackbarMessage('Processor deleted successfully');
      setSnackbarOpen(true);
      dispatch({ type: CLEAR_ALL_PROCESSORS_SUCCESS });
    }
  }, [deleteSuccess, dispatch]);

  useEffect(() => {
    if (createSuccess) {
      setSnackbarMessage('Processor saved successfully');
      setSnackbarOpen(true);
    }
  }, [createSuccess]);

  const onSort = useCallback(
    (field: string) => {
      let isAsc = false;
      if (sortHeader.includes(field)) {
        isAsc = !sortHeader.includes('+');
      } else {
        isAsc = true;
      }

      const sorted = isAsc
        ? _.chain([...sortedProcessors]).sortBy(field).reverse().value()
        : _.chain([...sortedProcessors]).sortBy(field).value();

      setSortedProcessors(sorted);
      setSortHeader(`${field}${isAsc ? '+' : '-'}`);
    },
    [sortHeader, sortedProcessors]
  );

  const onSearch = useCallback(
    (value: string) => {
      if (!value) {
        setSortedProcessors([...processors]);
        return;
      }
      const filtered = processors.filter(
        (processor) =>
          String(processor.name).toLowerCase().includes(value.toLowerCase()) ||
          String(processor.description).toLowerCase().includes(value.toLowerCase())
      );
      setSortedProcessors(filtered);
    },
    [processors]
  );

  const onEdit = useCallback((processor: Processor) => {
    setProcessorForEdit(processor);
    setShowCreateDialog(true);
  }, []);

  const onDelete = useCallback((processor: Processor) => {
    setProcessorToDelete(processor);
    setDeleteDialog(true);
  }, []);

  const submitDelete = useCallback(() => {
    if (processorToDelete) {
      dispatch({ type: DELETE_PROCESSOR, payload: processorToDelete.id });
    }
    setDeleteDialog(false);
  }, [dispatch, processorToDelete]);

  const cancelDelete = useCallback(() => {
    setDeleteDialog(false);
  }, []);

  const closeCreateDialog = useCallback(() => {
    setShowCreateDialog(false);
    setProcessorForEdit(undefined);
  }, []);

  const handleSnackbarClose = useCallback(() => {
    setSnackbarOpen(false);
    setProcessorToDelete(undefined);
  }, []);

  const onCloseErrorDialog = useCallback(() => {
    dispatch({ type: CLEAR_ALL_PROCESSORS_SUCCESS });
  }, [dispatch]);

  const columns = useMemo(
    () => getProcessorColumns({ onEdit, onDelete, sortHeader, onSort }),
    [onEdit, onDelete, sortHeader, onSort]
  );

  const noDataText = error
    ? ERROR_MSG_GET_PROCESSORS
    : processing && processors.length === 0
      ? 'Loading...'
      : 'There is no data to display.';

  return (
    <Page title="Processors" description={DESCRIPTION}>
      <Button className={styles.createButton} onClick={() => setShowCreateDialog(true)}>
        Create Processor
      </Button>

      {processing && processors.length === 0 ? (
        <Loader />
      ) : (
        <ReactTable
          data={sortedProcessors as (Processor & Record<string, unknown>)[]}
          columns={columns}
          onSearch={onSearch}
          pageSize={10}
          noDataText={noDataText}
          showPagination
          cursor="default"
          rowHeight="46px"
          manual={false}
        />
      )}

      {showCreateDialog && (
        <ProcessorForm data={processorForEdit} closeDialog={closeCreateDialog} />
      )}

      {deleteDialog && !deleteSuccess && processorToDelete && (
        <DeleteDialog
          display={processorToDelete.name}
          onSubmit={submitDelete}
          onCancel={cancelDelete}
        />
      )}

      <Snackbar
        open={snackbarOpen}
        message={snackbarMessage}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        ContentProps={{ style: { backgroundColor: '#2fbb67' } }}
      />

      {error && <ErrorDialog showMessage={error} closeDialog={onCloseErrorDialog} />}
    </Page>
  );
};

export default ProcessorsPage;
