import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  selectTests,
  selectProcessingGetTests,
  selectErrorOnGetTests,
  selectDeleteTestSuccess,
  selectErrorOnDeleteTest,
  selectCreateJobSuccess,
} from '../../store/tests/testsSelectors';
import {
  getTests,
  clearSelectedTest,
  clearErrorOnGetTests,
  clearAllSuccessOperations,
  cleanAllErrors,
  deleteTest,
} from '../../store/tests/testsTypes';
import { clearSelectedJob } from '../../store/jobs/jobsTypes';
import { Test } from '../../types/test';
import { isTestValid } from '../../utils/validators';
import { INVALID_TEST_MESSAGE } from '../../constants';
import Page from '../../components/Page/Page';
import Button from '../../components/Button/Button';
import ReactTable from '../../components/ReactTable/ReactTable';
import Dialog from '../../components/Dialog/Dialog';
import DeleteDialog from '../../components/DeleteDialog/DeleteDialog';
import ErrorDialog from '../../components/ErrorDialog/ErrorDialog';
import TitleInput from '../../components/TitleInput/TitleInput';
import UiSwitcher from '../../components/UiSwitcher/UiSwitcher';
import TestForm from './components/TestForm';
import JobForm from './components/JobForm';
import { getTestColumns } from './columns';
import styles from './TestsPage.module.scss';
import { orderBy, filter as lodashFilter } from 'lodash';

const DESCRIPTION = 'Tests include end-to-end scenarios that are executed at pre-configured intervals to provide in-depth performance metrics of your API.';
const ERROR_MSG_GET_TESTS = 'Error occurred while trying to get all tests.';

const TestsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { testId } = useParams<{ testId?: string }>();

  // Redux state
  const tests = useAppSelector(selectTests);
  const processing = useAppSelector(selectProcessingGetTests);
  const errorOnGetTests = useAppSelector(selectErrorOnGetTests);
  const deleteTestSuccessState = useAppSelector(selectDeleteTestSuccess);
  const errorOnDeleteTest = useAppSelector(selectErrorOnDeleteTest);
  const createJobSuccessState = useAppSelector(selectCreateJobSuccess);

  // Local state
  const [sortedTests, setSortedTests] = useState<Test[]>([]);
  const [sortHeader, setSortHeader] = useState('updated_at-');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [openViewTest, setOpenViewTest] = useState<Test | false>(false);
  const [openViewCreateJob, setOpenViewCreateJob] = useState<Test | false>(false);
  const [createTest, setCreateTest] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [testToDelete, setTestToDelete] = useState<Test | undefined>(undefined);
  const [testForEdit, setTestForEdit] = useState<Test | null>(null);
  const [testForClone, setTestForClone] = useState<Test | null>(null);
  const [testActionError, setTestActionError] = useState<string | null>(null);

  // Fetch tests on mount
  useEffect(() => {
    dispatch(clearErrorOnGetTests());
    dispatch(getTests());
    return () => {
      dispatch(clearErrorOnGetTests());
      dispatch(clearSelectedTest());
    };
  }, [dispatch]);

  // Handle createJobSuccess navigation
  useEffect(() => {
    if (createJobSuccessState) {
      setOpenViewCreateJob(false);
      const { testId: successTestId, jobId } = createJobSuccessState;
      dispatch(clearAllSuccessOperations());
      if (jobId && successTestId) {
        navigate(`/tests/${successTestId}/reports/${jobId}`, { replace: true });
      }
    }
  }, [createJobSuccessState, dispatch, navigate]);

  // Filter by favorites helper
  const filterByFavorites = useCallback(
    (testsList: Test[], favoritesOnly: boolean): Test[] => {
      if (favoritesOnly) {
        return testsList.filter((t) => t.is_favorite);
      }
      return testsList;
    },
    []
  );

  // Sort helper
  const sortTests = useCallback(
    (testsList: Test[], field: string, currentSortHeader: string): { sorted: Test[]; newHeader: string } => {
      let isAsc = false;
      if (currentSortHeader.includes(field)) {
        isAsc = !currentSortHeader.includes('+');
      } else {
        isAsc = true;
      }

      const sorted = isAsc
        ? orderBy(testsList, [field], ['desc'])
        : orderBy(testsList, [field], ['asc']);

      const newHeader = `${field}${isAsc ? '+' : '-'}`;
      return { sorted, newHeader };
    },
    []
  );

  // Handle tests prop changes (sorting, route-based actions)
  useEffect(() => {
    if (!tests) return;
    if (tests.length > 0 || sortedTests.length > 0) {
      const filtered = filterByFavorites([...tests], onlyFavorites);
      const { sorted } = sortTests(filtered, 'updated_at', 'updated_at+');
      setSortedTests(sorted);
      setSortHeader('updated_at-');

      // Route-based actions
      if (testId) {
        const path = location.pathname;
        if (path.includes('/run')) {
          const testData = tests.find((t) => t.id === testId);
          if (testData) {
            setOpenViewCreateJob(testData);
          }
        } else if (path.includes('/edit')) {
          const testData = tests.find((t) => t.id === testId);
          if (testData) {
            if (!isTestValid(testData)) {
              setTestActionError(INVALID_TEST_MESSAGE);
            } else {
              setCreateTest(true);
              setTestForEdit(testData);
            }
          }
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tests]);

  // Search handler
  const onSearch = useCallback(
    (value: string) => {
      if (!tests) return;
      if (!value) {
        const filtered = filterByFavorites([...tests], onlyFavorites);
        const { sorted, newHeader } = sortTests(filtered, 'updated_at', 'updated_at+');
        setSortedTests(sorted);
        setSortHeader(newHeader);
        return;
      }
      const lowerValue = value.toLowerCase();
      const filtered = lodashFilter(tests, (t) => {
        return (
          String(t.name).toLowerCase().includes(lowerValue) ||
          String(t.type).toLowerCase().includes(lowerValue) ||
          String(t.description).toLowerCase().includes(lowerValue)
        );
      });
      const favFiltered = filterByFavorites(filtered, onlyFavorites);
      setSortedTests(favFiltered);
    },
    [tests, onlyFavorites, filterByFavorites, sortTests]
  );

  // Sort handler
  const onSort = useCallback(
    (field: string) => {
      const { sorted, newHeader } = sortTests(sortedTests, field, sortHeader);
      setSortedTests(sorted);
      setSortHeader(newHeader);
    },
    [sortedTests, sortHeader, sortTests]
  );

  // Action handlers
  const onRunTest = useCallback(
    (data: Test) => {
      navigate(`/tests/${data.id}/run`, { replace: true });
      setOpenViewCreateJob(data);
    },
    [navigate]
  );

  const onReportView = useCallback(
    (data: Test) => {
      navigate(`/tests/${data.id}/reports`, { replace: true });
    },
    [navigate]
  );

  const onEdit = useCallback(
    (data: Test) => {
      if (!isTestValid(data)) {
        setTestActionError(INVALID_TEST_MESSAGE);
      } else {
        navigate(`/tests/${data.id}/edit`, { replace: true });
        setCreateTest(true);
        setTestForEdit(data);
      }
    },
    [navigate]
  );

  const onClone = useCallback((data: Test) => {
    if (!isTestValid(data)) {
      setTestActionError(INVALID_TEST_MESSAGE);
    } else {
      setCreateTest(true);
      setTestForClone(data);
    }
  }, []);

  const onRawView = useCallback((data: Test) => {
    setOpenViewTest(data);
  }, []);

  const onDelete = useCallback((data: Test) => {
    setDeleteDialog(true);
    setTestToDelete(data);
  }, []);

  const submitDelete = useCallback(() => {
    if (testToDelete) {
      dispatch(deleteTest(testToDelete.id));
    }
    setDeleteDialog(false);
  }, [testToDelete, dispatch]);

  const cancelDelete = useCallback(() => {
    setDeleteDialog(false);
  }, []);

  const closeCreateTest = useCallback(() => {
    navigate('/tests', { replace: true });
    setCreateTest(false);
    setTestForEdit(null);
    setTestForClone(null);
  }, [navigate]);

  const closeViewCreateJobDialog = useCallback(() => {
    navigate('/tests', { replace: true });
    setOpenViewCreateJob(false);
    dispatch(clearSelectedTest());
  }, [navigate, dispatch]);

  const closeViewTestDialog = useCallback(() => {
    setOpenViewTest(false);
    dispatch(clearSelectedTest());
  }, [dispatch]);

  const handleSnackbarClose = useCallback(() => {
    dispatch(clearSelectedJob());
    dispatch(clearSelectedTest());
    dispatch(clearAllSuccessOperations());
    setTestToDelete(undefined);
  }, [dispatch]);

  const onCloseErrorDialog = useCallback(() => {
    setTestActionError(null);
    dispatch(cleanAllErrors());
  }, [dispatch]);

  // Handle favorites toggle
  const handleFavoritesToggle = useCallback(
    (value: boolean) => {
      setOnlyFavorites(value);
      if (!tests) return;
      const filtered = filterByFavorites([...tests], value);
      const { sorted, newHeader } = sortTests(filtered, 'updated_at', 'updated_at+');
      setSortedTests(sorted);
      setSortHeader(newHeader);
    },
    [tests, filterByFavorites, sortTests]
  );

  // Memoized columns
  const columns = useMemo(
    () =>
      getTestColumns({
        onRunTest,
        onReportView,
        onEdit,
        onRawView,
        onClone,
        onDelete,
        onSort,
        sortHeader,
      }),
    [onRunTest, onReportView, onEdit, onRawView, onClone, onDelete, onSort, sortHeader]
  );

  // Feedback message
  const feedbackMsg = useMemo(() => {
    if (deleteTestSuccessState) {
      return 'Test deleted successfully';
    }
    return '';
  }, [deleteTestSuccessState]);

  // Error
  const error = testActionError || errorOnDeleteTest;

  // No data text
  const noDataText = errorOnGetTests ? ERROR_MSG_GET_TESTS : processing ? 'Loading...' : 'There is no data to display.';

  // Search sections (favorites toggle)
  const searchSections = useMemo(
    () => [
      <TitleInput key="favorites" style={{ flexGrow: 0 }} width="130px" height="33px" title="Favorites">
        <UiSwitcher
          onChange={handleFavoritesToggle}
          activeState={onlyFavorites}
          height={12}
          width={22}
          style={{ alignSelf: 'center' }}
        />
      </TitleInput>,
    ],
    [onlyFavorites, handleFavoritesToggle]
  );

  return (
    <Page title="Tests" description={DESCRIPTION}>
      <Button className={styles.createButton} onClick={() => setCreateTest(true)}>
        Create Test
      </Button>
      <ReactTable
        onSearch={onSearch}
        manual={false}
        data={sortedTests as unknown as Record<string, unknown>[]}
        pageSize={10}
        columns={columns as never}
        noDataText={noDataText}
        cursor="default"
        rowHeight="46px"
        searchSections={searchSections}
      />

      {openViewTest && (
        <Dialog
          titleKey="id"
          data={openViewTest as unknown as Record<string, unknown>}
          closeDialog={closeViewTestDialog}
        />
      )}

      {createTest && (
        <TestForm
          data={testForEdit || testForClone || undefined}
          closeDialog={closeCreateTest}
          cloneMode={!!testForClone}
        />
      )}

      {openViewCreateJob && (
        <JobForm data={openViewCreateJob} closeDialog={closeViewCreateJobDialog} />
      )}

      {deleteDialog && !deleteTestSuccessState && (
        <DeleteDialog
          display={testToDelete ? testToDelete.name : ''}
          onSubmit={submitDelete}
          onCancel={cancelDelete}
        />
      )}

      <Snackbar
        open={!!feedbackMsg}
        message={feedbackMsg}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        ContentProps={{
          sx: { backgroundColor: '#2fbb67' },
        }}
      />

      {error && <ErrorDialog closeDialog={onCloseErrorDialog} showMessage={error} />}
    </Page>
  );
};

export default TestsPage;
