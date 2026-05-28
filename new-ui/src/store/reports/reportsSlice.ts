import {
  ReportsState,
  ReportsAction,
  GET_REPORTS_SUCCESS,
  GET_REPORTS_FAILURE,
  GET_REPORT_SUCCESS,
  GET_REPORT_FAILURE,
  GET_LAST_REPORTS,
  GET_LAST_REPORTS_SUCCESS,
  GET_LAST_REPORTS_FAILURE,
  GET_REPORTS,
  GET_REPORT,
  DELETE_REPORT_SUCCESS,
  EDIT_REPORT_SUCCESS,
  GET_AGGREGATE_REPORT_SUCCESS,
  CLEAR_SELECTED_REPORT,
  CLEAR_ERROR_ON_GET_REPORTS,
} from './reportsTypes';

const initialState: ReportsState = {
  reports: [],
  report: null,
  aggregateReport: null,
  processing: false,
  error: null,
  loading: false,
};

export function reportsReducer(
  state: ReportsState = initialState,
  action: ReportsAction
): ReportsState {
  switch (action.type) {
    case GET_REPORTS:
    case GET_LAST_REPORTS:
      return { ...state, processing: true, error: null };
    case GET_REPORTS_SUCCESS:
    case GET_LAST_REPORTS_SUCCESS:
      return { ...state, reports: action.payload, processing: false };
    case GET_REPORTS_FAILURE:
    case GET_LAST_REPORTS_FAILURE:
      return { ...state, error: action.payload, processing: false };
    case GET_REPORT:
      return { ...state, loading: true };
    case GET_REPORT_SUCCESS:
      return { ...state, report: action.payload, loading: false };
    case GET_REPORT_FAILURE:
      return { ...state, error: action.payload, loading: false };
    case DELETE_REPORT_SUCCESS:
      return { ...state };
    case EDIT_REPORT_SUCCESS:
      return { ...state };
    case GET_AGGREGATE_REPORT_SUCCESS:
      return { ...state, aggregateReport: action.payload };
    case CLEAR_SELECTED_REPORT:
      return { ...state, report: null };
    case CLEAR_ERROR_ON_GET_REPORTS:
      return { ...state, error: null };
    default:
      return state;
  }
}
