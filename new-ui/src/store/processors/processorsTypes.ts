import { Processor } from '../../types/processor';

export interface ProcessorsState {
  processors: Processor[];
  selectedProcessor: Processor | null;
  processing: boolean;
  error: string | null;
  deleteSuccess: boolean;
  createSuccess: boolean;
  loading: boolean;
}

export const GET_PROCESSORS = 'GET_PROCESSORS' as const;
export const GET_PROCESSORS_SUCCESS = 'GET_PROCESSORS_SUCCESS' as const;
export const GET_PROCESSORS_FAILURE = 'GET_PROCESSORS_FAILURE' as const;

export const CREATE_PROCESSOR = 'CREATE_PROCESSOR' as const;
export const CREATE_PROCESSOR_SUCCESS = 'CREATE_PROCESSOR_SUCCESS' as const;
export const CREATE_PROCESSOR_FAILURE = 'CREATE_PROCESSOR_FAILURE' as const;

export const UPDATE_PROCESSOR = 'UPDATE_PROCESSOR' as const;
export const UPDATE_PROCESSOR_SUCCESS = 'UPDATE_PROCESSOR_SUCCESS' as const;
export const UPDATE_PROCESSOR_FAILURE = 'UPDATE_PROCESSOR_FAILURE' as const;

export const DELETE_PROCESSOR = 'DELETE_PROCESSOR' as const;
export const DELETE_PROCESSOR_SUCCESS = 'DELETE_PROCESSOR_SUCCESS' as const;
export const DELETE_PROCESSOR_FAILURE = 'DELETE_PROCESSOR_FAILURE' as const;

export const CLEAR_SELECTED_PROCESSOR = 'CLEAR_SELECTED_PROCESSOR' as const;
export const CLEAR_ALL_PROCESSORS_SUCCESS = 'CLEAR_ALL_PROCESSORS_SUCCESS' as const;

export type ProcessorsAction =
  | { type: typeof GET_PROCESSORS }
  | { type: typeof GET_PROCESSORS_SUCCESS; payload: Processor[] }
  | { type: typeof GET_PROCESSORS_FAILURE; payload: string }
  | { type: typeof CREATE_PROCESSOR; payload: { name: string; description: string; javascript: string; exported_functions: string[] } }
  | { type: typeof CREATE_PROCESSOR_SUCCESS }
  | { type: typeof CREATE_PROCESSOR_FAILURE; payload: string }
  | { type: typeof UPDATE_PROCESSOR; payload: { id: string; body: Partial<{ name: string; description: string; javascript: string; exported_functions: string[] }> } }
  | { type: typeof UPDATE_PROCESSOR_SUCCESS }
  | { type: typeof UPDATE_PROCESSOR_FAILURE; payload: string }
  | { type: typeof DELETE_PROCESSOR; payload: string }
  | { type: typeof DELETE_PROCESSOR_SUCCESS }
  | { type: typeof DELETE_PROCESSOR_FAILURE; payload: string }
  | { type: typeof CLEAR_SELECTED_PROCESSOR }
  | { type: typeof CLEAR_ALL_PROCESSORS_SUCCESS };
