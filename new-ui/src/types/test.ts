export interface Test {
  id: string;
  name: string;
  description: string;
  type: string;
  updated_at: string;
  artillery_test: Record<string, unknown>;
  is_favorite: boolean;
  csv_file_id?: string;
}

export interface TestCreatePayload {
  name: string;
  description: string;
  type: string;
  artillery_test: Record<string, unknown>;
  csv_file_id?: string;
}

export interface FileMetadata {
  id: string;
  filename: string;
}
