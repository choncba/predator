import { combineReducers } from 'redux';
import { testsReducer } from './tests/testsSlice';
import { jobsReducer } from './jobs/jobsSlice';
import { reportsReducer } from './reports/reportsSlice';
import { authReducer } from './auth/authSlice';
import { configReducer } from './config/configSlice';
import { processorsReducer } from './processors/processorsSlice';
import { chaosExperimentsReducer } from './chaosExperiments/chaosExperimentsSlice';
import { webhooksReducer } from './webhooks/webhooksSlice';

export const rootReducer = combineReducers({
  tests: testsReducer,
  jobs: jobsReducer,
  reports: reportsReducer,
  auth: authReducer,
  config: configReducer,
  processors: processorsReducer,
  chaosExperiments: chaosExperimentsReducer,
  webhooks: webhooksReducer,
});
