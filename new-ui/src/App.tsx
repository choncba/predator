import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { selectConfig, selectConfigLoading, selectConfigError } from './store/config/configSelectors';
import { getConfig } from './store/config/configTypes';
import { NavigationDrawer } from './features/navigation/NavigationDrawer';
import { ERROR_GET_CONFIG_MESSAGE } from './constants';

// Feature page imports
import ConfigurationPage from './features/configuration/ConfigurationPage';
import WebhooksPage from './features/webhooks/WebhooksPage';
import ProcessorsPage from './features/processors/ProcessorsPage';
import ChaosExperimentsPage from './features/chaos-experiments/ChaosExperimentsPage';
import TestsPage from './features/tests/TestsPage';
import JobsPage from './features/jobs/JobsPage';

import LastReportsPage from './features/reports/LastReportsPage';
import TestReportsPage from './features/reports/TestReportsPage';
import ReportPage from './features/reports/ReportPage';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const config = useAppSelector(selectConfig);
  const loading = useAppSelector(selectConfigLoading);
  const error = useAppSelector(selectConfigError);

  useEffect(() => {
    dispatch(getConfig());
  }, [dispatch]);

  if (error) return <div>{ERROR_GET_CONFIG_MESSAGE}</div>;
  if (loading) return <div>Loading...</div>;

  return (
    <NavigationDrawer config={config}>
      <Routes>
        <Route path="/" element={<Navigate to="/last_reports" replace />} />
        <Route path="/ui" element={<Navigate to="/last_reports" replace />} />
        <Route path="/ui/*" element={<Navigate to="/last_reports" replace />} />
        <Route path="/tests" element={<TestsPage />} />
        <Route path="/tests/:testId/run" element={<TestsPage />} />
        <Route path="/tests/:testId/edit" element={<TestsPage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/jobs/:jobId/edit" element={<JobsPage />} />
        <Route path="/tests/:testId/reports" element={<TestReportsPage />} />
        <Route path="/tests/:testId/reports/:reportId" element={<ReportPage />} />
        <Route path="/last_reports" element={<LastReportsPage />} />
        <Route path="/processors" element={<ProcessorsPage />} />
        <Route path="/chaos_experiments" element={<ChaosExperimentsPage />} />
        <Route path="/webhooks" element={<WebhooksPage />} />
        <Route path="/settings" element={<ConfigurationPage />} />
      </Routes>
    </NavigationDrawer>
  );
};

export default App;
