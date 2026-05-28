import {
  WebhooksState,
  WebhooksAction,
  GET_WEBHOOKS,
  GET_WEBHOOKS_SUCCESS,
  GET_WEBHOOKS_FAILURE,
  CREATE_WEBHOOK,
  CREATE_WEBHOOK_SUCCESS,
  CREATE_WEBHOOK_FAILURE,
  UPDATE_WEBHOOK,
  UPDATE_WEBHOOK_SUCCESS,
  UPDATE_WEBHOOK_FAILURE,
  DELETE_WEBHOOK,
  DELETE_WEBHOOK_SUCCESS,
  DELETE_WEBHOOK_FAILURE,
  CLEAR_SELECTED_WEBHOOK,
  CLEAR_ALL_WEBHOOKS_SUCCESS,
} from './webhooksTypes';

const initialState: WebhooksState = {
  webhooks: [],
  selectedWebhook: null,
  processing: false,
  error: null,
  deleteSuccess: false,
  createSuccess: false,
  loading: false,
};

export function webhooksReducer(
  state: WebhooksState = initialState,
  action: WebhooksAction
): WebhooksState {
  switch (action.type) {
    case GET_WEBHOOKS:
      return { ...state, loading: true, error: null };

    case GET_WEBHOOKS_SUCCESS:
      return { ...state, webhooks: action.payload, loading: false };

    case GET_WEBHOOKS_FAILURE:
      return { ...state, error: action.payload, loading: false };

    case CREATE_WEBHOOK:
      return { ...state, processing: true, error: null, createSuccess: false };

    case CREATE_WEBHOOK_SUCCESS:
      return { ...state, processing: false, createSuccess: true };

    case CREATE_WEBHOOK_FAILURE:
      return { ...state, processing: false, error: action.payload, createSuccess: false };

    case UPDATE_WEBHOOK:
      return { ...state, processing: true, error: null };

    case UPDATE_WEBHOOK_SUCCESS:
      return { ...state, processing: false };

    case UPDATE_WEBHOOK_FAILURE:
      return { ...state, processing: false, error: action.payload };

    case DELETE_WEBHOOK:
      return { ...state, processing: true, error: null, deleteSuccess: false };

    case DELETE_WEBHOOK_SUCCESS:
      return { ...state, processing: false, deleteSuccess: true };

    case DELETE_WEBHOOK_FAILURE:
      return { ...state, processing: false, error: action.payload, deleteSuccess: false };

    case CLEAR_SELECTED_WEBHOOK:
      return { ...state, selectedWebhook: null };

    case CLEAR_ALL_WEBHOOKS_SUCCESS:
      return { ...state, createSuccess: false, deleteSuccess: false, error: null };

    default:
      return state;
  }
}
