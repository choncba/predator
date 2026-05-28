import { all } from 'redux-saga/effects';
import { testsRegister } from './tests/testsSaga';
import { jobsRegister } from './jobs/jobsSaga';
import { reportsRegister } from './reports/reportsSaga';
import { configRegister } from './config/configSaga';
import { processorsRegister } from './processors/processorsSaga';
import { chaosExperimentsRegister } from './chaosExperiments/chaosExperimentsSaga';
import { webhooksRegister } from './webhooks/webhooksSaga';

export default function* rootSaga() {
  yield all([
    testsRegister(),
    jobsRegister(),
    reportsRegister(),
    configRegister(),
    processorsRegister(),
    chaosExperimentsRegister(),
    webhooksRegister(),
  ]);
}
