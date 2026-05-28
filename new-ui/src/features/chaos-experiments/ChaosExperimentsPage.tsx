import React, { useEffect, useState, useMemo, useCallback } from 'react';
import Snackbar from '@mui/material/Snackbar';
import { type ColumnDef } from '@tanstack/react-table';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  getChaosExperiments,
  deleteChaosExperiment,
  clearAllChaosExperimentsSuccess,
} from '../../store/chaosExperiments/chaosExperimentsTypes';
import {
  selectChaosExperiments,
  selectChaosExperimentsLoading,
  selectChaosExperimentsError,
  selectChaosExperimentsDeleteSuccess,
} from '../../store/chaosExperiments/chaosExperimentsSelectors';
import { ChaosExperiment } from '../../types/chaosExperiment';
import Page from '../../components/Page';
import Button from '../../components/Button';
import ReactTable from '../../components/ReactTable/ReactTable';
import ErrorDialog from '../../components/ErrorDialog/ErrorDialog';
import DeleteDialog from '../../components/DeleteDialog/DeleteDialog';
import Dialog from '../../components/Dialog/Dialog';
import Loader from '../../components/Loader';
import ChaosExperimentForm from './components/ChaosExperimentForm';
import { getColumns } from './columns';
import styles from './ChaosExperimentsPage.module.scss';
import _ from 'lodash';

const DESCRIPTION = 'Create chaos experiments templates to be injected as part of your running test.';
const NO_DATA_MSG = 'There is no data to display.';
const ERROR_MSG = 'Error occurred while trying to get all chaos experiments.';

const ChaosExperimentsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const chaosExperiments = useAppSelector(selectChaosExperiments);
  const loading = useAppSelector(selectChaosExperimentsLoading);
  const error = useAppSelector(selectChaosExperimentsError);
  const deleteSuccess = useAppSelector(selectChaosExperimentsDeleteSuccess);

  const [sortedExperiments, setSortedExperiments] = useState<ChaosExperiment[]>([]);
  const [sortHeader, setSortHeader] = useState<string>('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [experimentForEdit, setExperimentForEdit] = useState<ChaosExperiment | undefined>(undefined);
  const [experimentToDelete, setExperimentToDelete] = useState<ChaosExperiment | undefined>(undefined);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [rawViewData, setRawViewData] = useState<Record<string, unknown> | null>(null);
  const [showSnackbar, setShowSnackbar] = useState(false);

  useEffect(() => {
    dispatch(getChaosExperiments());
  }, [dispatch]);

  useEffect(() => {
    if (chaosExperiments) {
      const sorted = _.chain([...chaosExperiments]).sortBy('updated_at').reverse().value();
      setSortedExperiments(sorted);
      setSortHeader('updated_at-');
    }
  }, [chaosExperiments]);

  useEffect(() => {
    if (deleteSuccess) {
      setShowSnackbar(true);
    }
  }, [deleteSuccess]);

  const handleSearch = useCallback(
    (value: string) => {
      if (!value) {
        setSortedExperiments([...chaosExperiments]);
        return;
      }
      const filtered = chaosExperiments.filter((experiment) =>
        String(experiment.name).toLowerCase().includes(value.toLowerCase())
      );
      setSortedExperiments(filtered);
    },
    [chaosExperiments]
  );

  const handleSort = useCallback(
    (field: string) => {
      let isAsc = false;
      if (sortHeader.includes(field)) {
        isAsc = !sortHeader.includes('+');
      } else {
        isAsc = true;
      }
      const sorted = isAsc
        ? _.chain([...sortedExperiments]).sortBy(field).reverse().value()
        : _.chain([...sortedExperiments]).sortBy(field).value();
      setSortedExperiments(sorted);
      setSortHeader(`${field}${isAsc ? '+' : '-'}`);
    },
    [sortHeader, sortedExperiments]
  );

  const handleEdit = useCallback((data: ChaosExperiment) => {
    setExperimentForEdit(data);
    setShowCreateDialog(true);
  }, []);

  const handleRawView = useCallback((data: ChaosExperiment) => {
    setRawViewData(data.kubeObject as Record<string, unknown>);
  }, []);

  const handleDelete = useCallback((data: ChaosExperiment) => {
    setExperimentToDelete(data);
    setShowDeleteDialog(true);
  }, []);

  const submitDelete = useCallback(() => {
    if (experimentToDelete) {
      dispatch(deleteChaosExperiment(experimentToDelete.id));
      setShowDeleteDialog(false);
    }
  }, [experimentToDelete, dispatch]);

  const cancelDelete = useCallback(() => {
    setShowDeleteDialog(false);
  }, []);

  const closeFormDialog = useCallback(() => {
    setShowCreateDialog(false);
    setExperimentForEdit(undefined);
  }, []);

  const closeRawView = useCallback(() => {
    setRawViewData(null);
  }, []);

  const handleSnackbarClose = useCallback(() => {
    setShowSnackbar(false);
    dispatch(clearAllChaosExperimentsSuccess());
  }, [dispatch]);

  const handleCloseErrorDialog = useCallback(() => {
    dispatch(clearAllChaosExperimentsSuccess());
  }, [dispatch]);

  const columns = useMemo(
    () => getColumns({ onEdit: handleEdit, onRawView: handleRawView, onDelete: handleDelete }),
    [handleEdit, handleRawView, handleDelete]
  );

  const noDataText = error ? ERROR_MSG : (loading && chaosExperiments.length === 0 ? '' : NO_DATA_MSG);

  return (
    <Page title="Chaos Experiments" description={DESCRIPTION}>
      <div className={styles.pageContent}>
        <Button className={styles.createButton} onClick={() => setShowCreateDialog(true)}>
          Create Experiment
        </Button>

        {loading && chaosExperiments.length === 0 ? (
          <Loader />
        ) : (
          <ReactTable
            data={sortedExperiments as unknown as Record<string, unknown>[]}
            columns={columns as unknown as ColumnDef<Record<string, unknown>, unknown>[]}
            onSearch={handleSearch}
            sortEvent={handleSort}
            manual={false}
            pageSize={10}
            noDataText={noDataText}
            showPagination
            cursor="default"
            rowHeight="46px"
          />
        )}

        {rawViewData && (
          <Dialog data={rawViewData} titleKey="name" closeDialog={closeRawView} />
        )}

        {showCreateDialog && (
          <ChaosExperimentForm data={experimentForEdit} closeDialog={closeFormDialog} />
        )}

        {showDeleteDialog && !deleteSuccess && (
          <DeleteDialog
            display={experimentToDelete ? experimentToDelete.name : ''}
            onSubmit={submitDelete}
            onCancel={cancelDelete}
          />
        )}

        <Snackbar
          open={showSnackbar}
          message="Chaos experiment deleted successfully"
          autoHideDuration={4000}
          onClose={handleSnackbarClose}
          ContentProps={{ sx: { backgroundColor: '#2fbb67' } }}
        />

        {error && <ErrorDialog showMessage={error} closeDialog={handleCloseErrorDialog} />}
      </div>
    </Page>
  );
};

export default ChaosExperimentsPage;
