import { put, takeLatest, call, all } from 'redux-saga/effects';
import { AxiosResponse } from 'axios';
import * as Types from './reportsTypes';
import * as reportsApi from '../../api/reportsApi';
import { Report, AggregateReport } from '../../types/report';
import { PaginatedResponse } from '../../types/api';

export function* getReports(action: { type: typeof Types.GET_REPORTS; testId: string }) {
  try {
    const response: AxiosResponse<PaginatedResponse<Report>> = yield call(
      reportsApi.getReports,
      action.testId
    );
    let reportsData: Report[] = response.data.data;
    let nextUrl = response.data.next;

    while (nextUrl) {
      const charIndex = nextUrl.indexOf('?');
      const queryParams = nextUrl.substring(charIndex);
      const paginationResponse: AxiosResponse<PaginatedResponse<Report>> = yield call(
        reportsApi.getReports,
        action.testId,
        queryParams
      );
      reportsData = reportsData.concat(paginationResponse.data.data);
      nextUrl = paginationResponse.data.next;
    }

    yield put({ type: Types.GET_REPORTS_SUCCESS, payload: reportsData });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to get reports';
    yield put({ type: Types.GET_REPORTS_FAILURE, payload: message });
  }
}

export function* getLastReports() {
  try {
    const response: AxiosResponse<PaginatedResponse<Report>> = yield call(
      reportsApi.getLastReports
    );
    let reportsData: Report[] = response.data.data;
    let nextUrl = response.data.next;

    while (nextUrl) {
      const charIndex = nextUrl.indexOf('?');
      const queryParams = nextUrl.substring(charIndex);
      const paginationResponse: AxiosResponse<PaginatedResponse<Report>> = yield call(
        reportsApi.getLastReports,
        queryParams
      );
      reportsData = reportsData.concat(paginationResponse.data.data);
      nextUrl = paginationResponse.data.next;
    }

    yield put({ type: Types.GET_LAST_REPORTS_SUCCESS, payload: reportsData });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to get last reports';
    yield put({ type: Types.GET_LAST_REPORTS_FAILURE, payload: message });
  }
}

export function* getReport(action: { type: typeof Types.GET_REPORT; testId: string; reportId: string }) {
  try {
    const response: AxiosResponse<Report> = yield call(
      reportsApi.getReport,
      action.testId,
      action.reportId
    );
    yield put({ type: Types.GET_REPORT_SUCCESS, payload: response.data });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to get report';
    yield put({ type: Types.GET_REPORT_FAILURE, payload: message });
  }
}

export function* deleteReport(action: { type: typeof Types.DELETE_REPORT; selectedReports: Array<{ testId: string; reportId: string }> }) {
  const failedReports: string[] = [];
  try {
    yield all(
      action.selectedReports.map(function* ({ testId, reportId }) {
        try {
          yield call(reportsApi.deleteReport, testId, reportId);
        } catch {
          failedReports.push(`(test id: ${testId}, report id: ${reportId})`);
        }
      })
    );

    if (failedReports.length > 0) {
      throw new Error(
        'Failed to delete the next reports: ' +
          failedReports.join(',') +
          ". Please note that it's impossible to delete in-progress reports"
      );
    }

    yield put({ type: Types.DELETE_REPORT_SUCCESS, payload: action.selectedReports.length });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to delete reports';
    yield put({ type: Types.GET_REPORTS_FAILURE, payload: message });
  }
}

export function* editReport(action: { type: typeof Types.EDIT_REPORT; testId: string; reportId: string; body: Partial<Report> }) {
  try {
    yield call(reportsApi.editReport, action.testId, action.reportId, action.body);
    yield put({ type: Types.EDIT_REPORT_SUCCESS, payload: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to edit report';
    yield put({ type: Types.GET_REPORTS_FAILURE, payload: message });
  }
}

export function* getAggregateReport(action: { type: typeof Types.GET_AGGREGATE_REPORT; reportsData: Array<{ testId: string; reportId: string }> }) {
  try {
    const results: AxiosResponse<AggregateReport>[] = yield all(
      action.reportsData.map((report) =>
        call(reportsApi.getAggregateReport, report.testId, report.reportId)
      )
    );
    const data = results.map((result) => result.data);
    // For single report, return first item; for multiple, return the combined data
    yield put({
      type: Types.GET_AGGREGATE_REPORT_SUCCESS,
      payload: data.length === 1 ? data[0] : data[0],
    });
  } catch {
    // Silently fail for aggregate reports (matching existing behavior)
  }
}

export function* reportsRegister() {
  yield takeLatest(Types.GET_REPORTS, getReports);
  yield takeLatest(Types.GET_LAST_REPORTS, getLastReports);
  yield takeLatest(Types.GET_REPORT, getReport);
  yield takeLatest(Types.DELETE_REPORT, deleteReport);
  yield takeLatest(Types.EDIT_REPORT, editReport);
  yield takeLatest(Types.GET_AGGREGATE_REPORT, getAggregateReport);
}
