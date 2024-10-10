export interface ServerError {
  collection?: string;
  field: string;
  code: string;
  message: string;
  options?: Record<string, unknown>;
  ref?: string;
}
