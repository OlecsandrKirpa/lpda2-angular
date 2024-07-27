/**
 * This is a pased error of ActiveRecord
 */
export interface ActiveError {
  /**
   * The invalid field.
   */
  attribute: string;

  /**
   * The message to show to the user
   */
  message: string;

  /**
   * The types of the error.
   */
  type: string;
  raw_type: string;

  options: {[key: string]: any};
}

export function isActiveError(obj: unknown): obj is ActiveError {
  if (obj === undefined || obj === null || typeof obj !== 'object') return false;

  return obj.hasOwnProperty('attribute') && obj.hasOwnProperty('message') && typeof (obj as Record<string, unknown>)["attribute"] == "string" && typeof (obj as Record<string, unknown>)["message"] == "string";
}