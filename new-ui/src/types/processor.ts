export interface Processor {
  id: string;
  name: string;
  description: string;
  javascript: string;
  exported_functions: string[];
  created_at: string;
  updated_at: string;
}

export interface ProcessorCreatePayload {
  name: string;
  description: string;
  javascript: string;
  exported_functions: string[];
}
