export interface AuthState {
  token: string | null;
}

export const SET_TOKEN = 'SET_TOKEN' as const;
export const CLEAR_TOKEN = 'CLEAR_TOKEN' as const;

export type AuthAction =
  | { type: typeof SET_TOKEN; payload: string }
  | { type: typeof CLEAR_TOKEN };
