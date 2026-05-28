export interface Job {
  id: string;
  test_id: string;
  type: string;
  cron_expression?: string;
  enabled: boolean;
  run_immediately?: boolean;
  duration: number;
  arrival_rate: number;
  ramp_to?: number;
  environment: string;
  notes?: string;
  max_virtual_users?: number;
  webhooks?: string[];
  emails?: string[];
}

export interface JobCreatePayload {
  test_id: string;
  type: string;
  cron_expression?: string;
  enabled?: boolean;
  run_immediately?: boolean;
  duration: number;
  arrival_rate: number;
  ramp_to?: number;
  environment: string;
  notes?: string;
  max_virtual_users?: number;
  webhooks?: string[];
  emails?: string[];
}

export interface CreateJobSuccess {
  run_id: string;
  report_id: string;
  test_id: string;
}
