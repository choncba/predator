export interface Webhook {
  id: string;
  name: string;
  url: string;
  global: boolean;
  format_type: string;
}

export interface WebhookCreatePayload {
  name: string;
  url: string;
  global?: boolean;
  format_type?: string;
}
