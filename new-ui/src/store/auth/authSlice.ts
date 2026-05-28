import { AuthState, AuthAction, SET_TOKEN, CLEAR_TOKEN } from './authTypes';

const initialState: AuthState = {
  token: null,
};

export function authReducer(
  state: AuthState = initialState,
  action: AuthAction
): AuthState {
  switch (action.type) {
    case SET_TOKEN:
      return { ...state, token: action.payload };
    case CLEAR_TOKEN:
      return { ...state, token: null };
    default:
      return state;
  }
}
