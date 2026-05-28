export interface ChaosExperiment {
  id: string;
  name: string;
  kubeObject: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface ChaosExperimentCreatePayload {
  name: string;
  kubeObject: Record<string, unknown>;
}
