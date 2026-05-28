export interface Report {
  test_id: string;
  report_id: string;
  test_name: string;
  status: string;
  start_time: string;
  end_time?: string;
  phase: string;
  notes?: string;
  is_favorite: boolean;
  last_stats: ReportStats;
}

export interface ReportStats {
  timestamp: string;
  scenariosCreated: number;
  scenariosCompleted: number;
  requestsCompleted: number;
  latency: LatencyStats;
  rps: RpsStats;
  codes: Record<string, number>;
  errors: Record<string, number>;
}

export interface LatencyStats {
  min: number;
  max: number;
  median: number;
  p95: number;
  p99: number;
}

export interface RpsStats {
  count: number;
  mean: number;
}

export interface AggregateReport {
  benchmarkWeightsData: Record<string, unknown>;
  grafanaUrl?: string;
  parallelism?: number;
  score?: number;
}
